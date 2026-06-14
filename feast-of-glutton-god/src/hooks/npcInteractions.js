import { createHistory } from '../textEngine/index.js';
import { renderObserve } from '../textEngine/scenes/npc/observe.js';
import { renderFeed } from '../textEngine/scenes/npc/feed.js';
import { renderTalk } from '../textEngine/scenes/npc/talk.js';
import { renderFlirt } from '../textEngine/scenes/npc/flirt.js';
import { renderBless } from '../textEngine/scenes/npc/bless.js';
import { renderFeast } from '../textEngine/scenes/npc/feast.js';
import { renderIntimate } from '../textEngine/scenes/npc/intimate.js';
import { renderGrowthScene } from '../textEngine/scenes/growthEvent/index.js';
import { renderCombatBeat } from '../textEngine/scenes/combatText.js';
import { advanceStage } from '../gameData/stages.js';
import { addCorruption } from '../gameData/corruption.js';
import {
  awardRelationship,
  getTier,
  getFlirtBonus,
  getGrowthStageBonus,
  getInteractionLockReason,
  INTERACTION_UNLOCKS,
  getTierUpMessage,
  canUnlockInteraction,
} from '../gameData/relationships.js';
import { getCorruptionTier } from '../gameData/corruption.js';
import { getStage } from '../gameData/stages.js';
import { spendAP } from '../gameData/player.js';
import { checkSeduce, formatCheckSummary, toTextContext, DC } from '../gameData/skillChecks.js';
import { recordNpcInteractionForQuests, recordNpcGrowthForQuests } from './questHooks.js';
import { awardAbundanceSpreadWithEvents } from '../gameData/worldEvents.js';
import { appendPuzzleHintToTalk } from '../gameData/puzzleHints.js';

function withQuestProgress(game, npc, interaction, meta, result) {
  const quest = recordNpcInteractionForQuests(game, {
    npcId: npc.id,
    interaction,
    npc: result.npc ?? npc,
    meta,
  });
  let questMessages = quest.questMessages || '';
  if (result.growth) {
    const growthQuest = recordNpcGrowthForQuests(game, {
      npcId: (result.npc ?? npc).id,
      startStage: result.growth.startStage,
      endStage: result.growth.endStage,
      stagesGained: result.growth.stagesJumped,
    });
    if (growthQuest.questMessages) {
      questMessages = questMessages
        ? `${questMessages}\n\n${growthQuest.questMessages}`
        : growthQuest.questMessages;
    }
    if (result.growth.stagesJumped > 0) {
      const relResult = awardRelationship(result.npc ?? npc, 'growth_witnessed');
      if (relResult.tierUp) {
        const tierMsg = getTierUpMessage(result.npc ?? npc, relResult);
        questMessages = questMessages ? `${questMessages}\n\n${tierMsg}` : tierMsg;
        result.relationship = relResult;
      }
    }
  }
  if (questMessages) {
    result.text = (result.text || '') + `\n\n---\n${questMessages}`;
    if (result.narrative) {
      result.narrative += `\n\n---\n${questMessages}`;
    }
  }
  if (['feed', 'bless', 'feast', 'intimate', 'talk'].includes(interaction)
    || interaction?.startsWith('feed_') || interaction?.startsWith('bless_')) {
    const key = interaction.startsWith('feed') ? 'npc_feed'
      : interaction.startsWith('bless') ? 'npc_bless'
        : `npc_${interaction}`;
    const spread = awardAbundanceSpreadWithEvents(game, key);
    if (spread?.worldEvent?.triggered && spread.worldEvent.message) {
      result.text = (result.text || '') + `\n\n---\n${spread.worldEvent.message}`;
      if (result.narrative) result.narrative += `\n\n---\n${spread.worldEvent.message}`;
    }
  }
  result.questNotes = quest;
  return result;
}

function applyRelationshipGain(npc, source, amountOverride) {
  const relResult = awardRelationship(npc, source, amountOverride);
  return relResult;
}

function appendTierUp(result, npc, relResult) {
  if (!relResult?.tierUp) return result;
  const msg = getTierUpMessage(npc, relResult);
  result.text = (result.text || '') + `\n\n${msg}`;
  if (result.narrative) result.narrative += `\n\n${msg}`;
  result.relationship = relResult;
  return result;
}

function growNpc(npc, baseStages, method = 'feed') {
  const bonus = getGrowthStageBonus(npc, method);
  const stages = baseStages + bonus;
  const startStage = getStage(npc.lbs).id;
  const growth = advanceStage(npc, stages);
  return { ...growth, startStage, bonusStages: bonus };
}

let sessionHistory = null;

export function getTextHistory(game) {
  if (!sessionHistory) sessionHistory = createHistory();
  return sessionHistory;
}

export function renderBodyDesc(character, player, game) {
  return renderObserve(character, player, {
    pose: 'standing',
    location: game?.region,
    history: getTextHistory(game),
  });
}

export function doObserve(npc, player, game) {
  const poses = ['standing', 'sitting', 'walking'];
  const pose = poses[Math.floor(Math.random() * poses.length)];
  const text = renderObserve(npc, player, { pose, location: game.region, history: getTextHistory(game) });
  addCorruption(npc, 1);
  const relResult = applyRelationshipGain(npc, 'observe');
  return withQuestProgress(game, npc, 'observe', null, appendTierUp({ text, npc }, npc, relResult));
}

export function doTalk(npc, player, game) {
  const text = renderTalk(npc, player, { location: game.region, history: getTextHistory(game) });
  const relResult = applyRelationshipGain(npc, 'talk');
  const offers = getQuestOffersForNpc(game, npc);
  let questOfferText = '';
  if (offers.length) {
    questOfferText = '\n\n' + buildQuestOfferNarrative(npc, player, offers);
  }
  const result = appendTierUp({
    text: text + questOfferText,
    npc,
    questOffers: offers.map((o) => ({ id: o.id, title: o.title, type: o.type })),
  }, npc, relResult);
  return withQuestProgress(game, npc, 'talk', null, appendPuzzleHintToTalk(result, game, npc));
}

export function doFlirt(npc, player, game) {
  if (!canUnlockInteraction(npc, 'flirt')) {
    return { text: getInteractionLockReason(npc, 'flirt'), npc, ok: false };
  }

  const flirtBonus = getFlirtBonus(npc);
  const check = checkSeduce(player, DC.medium, {
    bonuses: flirtBonus
      ? [{ type: 'circumstantial', label: 'Warm bond', value: flirtBonus, source: 'relationship' }]
      : [],
    applyCriticalEffects: true,
    target: npc,
  });

  const updatedNpc = check.target ?? npc;
  if (check.entity?.lbs != null && check.entity.id === 'player') {
    game.player = { ...game.player, ...check.entity };
  }

  const textContext = toTextContext(check);
  const text = renderFlirt(updatedNpc, player, {
    history: getTextHistory(game),
    globals: textContext,
    checkResult: check.outcomeKey,
    checkCritical: check.critical,
  });

  let relResult;
  if (check.success) {
    relResult = applyRelationshipGain(
      updatedNpc,
      check.critical === 'success' ? 'flirt_crit' : 'flirt_success',
    );
    addCorruption(updatedNpc, check.critical === 'success' ? 5 : 3);
  } else if (check.critical === 'failure') {
    relResult = applyRelationshipGain(updatedNpc, 'flirt_fumble');
  }

  const summary = formatCheckSummary(check);
  const failNote =
    check.success || check.critical === 'failure'
      ? ''
      : '\n\nShe smiles shyly but isn\'t quite ready for more.';
  const critNote = check.critical === 'success'
    ? '\n\n★ Critical success — desire and softness bloom between you.'
    : check.critical === 'failure'
      ? '\n\n✦ A charming fumble — you blush, and she finds it endearing.'
      : '';
  let narrative = `${text}${failNote}${critNote}`;
  let result = { text: `${summary}\n\n${narrative}`, narrative, check, npc: updatedNpc, success: check.success };
  if (relResult) result = appendTierUp(result, updatedNpc, relResult);

  return withQuestProgress(game, updatedNpc, 'flirt', null, result);
}

export function doFeed(npc, player, game, feedType = 'hand') {
  const startStage = getStage(npc.lbs).id;
  const baseStages = feedType === 'magical' ? 2 : 1;
  const growth = growNpc(npc, baseStages, 'feed');
  const text = renderFeed(npc, player, { feedType, location: game.region, history: getTextHistory(game) });
  addCorruption(npc, feedType === 'magical' ? 6 : 4);
  const relResult = applyRelationshipGain(npc, feedType === 'magical' ? 'feed_magical' : 'feed');
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'feed',
    startStage,
    endStage: growth.endStage,
    gainLbs: 10,
    week: game.day,
  });
  let result = appendTierUp({
    text: text + '\n\n' + growthText, npc, growth,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'feed', { feedType }, result);
}

export function doBless(npc, player, game, blessType = 'minor') {
  if (!canUnlockInteraction(npc, 'bless')) {
    return { text: getInteractionLockReason(npc, 'bless'), npc, ok: false };
  }
  const costs = { minor: 5, major: 15, targeted: 10 };
  const cost = costs[blessType] || 5;
  if (!spendAP(game, cost)) return { text: 'Not enough Abundance Points.', npc, ok: false };
  const startStage = getStage(npc.lbs).id;
  const baseStages = blessType === 'major' ? 2 : 1;
  const growth = growNpc(npc, baseStages, 'blessing');
  const text = renderBless(npc, player, {
    blessType,
    zone: blessType === 'targeted' ? 'belly' : undefined,
    history: getTextHistory(game),
  });
  addCorruption(npc, blessType === 'major' ? 10 : 5);
  const awardKey = blessType === 'major' ? 'bless_major' : blessType === 'targeted' ? 'bless_targeted' : 'bless_minor';
  const relResult = applyRelationshipGain(npc, awardKey);
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'blessing',
    startStage,
    endStage: growth.endStage,
    week: game.day,
  });
  let result = appendTierUp({
    text: text + '\n\n' + growthText, npc, growth, ok: true,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'bless', { blessType }, result);
}

export function doFeast(npc, player, game) {
  if (!canUnlockInteraction(npc, 'feast')) {
    return { text: getInteractionLockReason(npc, 'feast'), npc, ok: false };
  }
  if (!spendAP(game, 20)) return { text: 'Not enough Abundance Points for a feast.', npc, ok: false };
  const startStage = getStage(npc.lbs).id;
  const growth = growNpc(npc, 3, 'feast');
  const text = renderFeast(npc, player, { history: getTextHistory(game) });
  addCorruption(npc, 15);
  const relResult = applyRelationshipGain(npc, 'feast');
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'feast',
    startStage,
    endStage: growth.endStage,
    week: game.day,
  });
  game.day += 1;
  let result = appendTierUp({
    text: text + '\n\n' + growthText, npc, growth, ok: true,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'feast', null, result);
}

export function getInteractionMenu(npc, player) {
  const rel = getTier(npc.relationship || 0);
  const cor = getCorruptionTier(npc.corruption || 0);

  const item = (id, label, extraEnabled = true, hint) => ({
    id,
    label,
    enabled: canUnlockInteraction(npc, id) && extraEnabled,
    hint: !canUnlockInteraction(npc, id) ? getInteractionLockReason(npc, id) : hint,
    tierRequired: INTERACTION_UNLOCKS[id] ?? 0,
  });

  return [
    item('talk', 'Talk'),
    item('flirt', 'Flirt / Compliment'),
    item('observe', 'Observe / Admire'),
    item('feed', 'Feed'),
    item('bless', 'Bless (spend AP)'),
    item('feast', 'Invite to Feast', (player.ap || 0) >= 20, (player.ap || 0) < 20 ? 'Requires 20 AP' : null),
    item('special', `Special (${player.subclass})`),
    item('intimate', 'Intimate'),
    item('corrupt', 'Corrupt', cor.id < 2),
    item('recruit', 'Recruit', cor.id >= 1 && Boolean(npc.companionId)),
  ];
}

export function doSpecial(npc, player, game) {
  if (!canUnlockInteraction(npc, 'special')) {
    return { text: getInteractionLockReason(npc, 'special'), npc, ok: false };
  }
  const bySubclass = {
    feast_singer: 'You perform a private growth ballad. Her body sways in time, swelling with each verse.',
    indulgence: 'You stage an intimate feeding performance — every crumb and moan draws her deeper into appetite.',
    sirens_call: 'Your voice coils around her like honey. She leans in, hungry, before she realizes she is melting.',
    overflowing_heart: 'You share vulnerability and warmth until growth feels like trust made flesh.',
    school_overflow: 'You conjure a cauldron of experimental feast-magic. She watches, fascinated, as the brew swells her.',
    expanding_form: 'You inscribe lasting runes of expansion. Her body accepts the change as sacred and permanent.',
    arcane_gluttony: 'You devour ambient magic and channel it into her — greedy, gleeful, glorious.',
    domain_plenty: 'You lead a prayer of abundance. Golden light pours into her, belly rounding with divine pleasure.',
    eternal_feast: 'You consecrate the room as a ritual banquet. Steam and sighs sanctify every swelling inch.',
    mother_abundance: 'You cradle her in matronly warmth. Growth spreads slow and safe, like being held by the goddess.',
    pact_everfull: "You invoke Gorgara's Claim — hunger floods her until she moans your name.",
    devouring_shadow: 'Shadow-hunger steals resistance and leaves plush, stolen curves in its wake.',
    honeyed_tongue: 'You whisper a sweet pact. She agrees to grow before she notices she already has.',
  };
  const byClass = {
    bard: 'You perform a private growth ballad. Her body sways in time, swelling with each verse.',
    wizard: 'You conjure a cauldron of experimental feast-magic. She watches, fascinated, as the brew swells her.',
    cleric: 'You lead a prayer of abundance. Golden light pours into her, belly rounding with divine pleasure.',
    warlock: "You invoke Gorgara's Claim — hunger floods her until she moans your name.",
  };
  const line = bySubclass[player.subclassId] || byClass[player.classId] || byClass.cleric;
  const startStage = getStage(npc.lbs).id;
  const growth = growNpc(npc, 2, 'blessing');
  addCorruption(npc, 8);
  const relResult = applyRelationshipGain(npc, 'special');
  const growthText = renderGrowthScene(npc, { growthMethod: 'blessing', startStage, endStage: growth.endStage, week: game.day });
  let result = appendTierUp({
    text: line + '\n\n' + growthText, npc, growth,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'special', null, result);
}

export function doIntimate(npc, player, game) {
  if (!canUnlockInteraction(npc, 'intimate')) {
    return { text: getInteractionLockReason(npc, 'intimate'), npc, ok: false };
  }
  const startStage = getStage(npc.lbs).id;
  const growth = growNpc(npc, 2, 'intimate');
  addCorruption(npc, 5);
  const relResult = applyRelationshipGain(npc, 'intimate');
  const sceneText = renderIntimate(npc, player, { location: game.region, history: getTextHistory(game) });
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'intimate',
    startStage,
    endStage: growth.endStage,
    week: game.day,
  });
  let result = appendTierUp({
    text: sceneText + '\n\n' + growthText, npc, growth,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'intimate', null, result);
}

export function doCorrupt(npc, player, game) {
  if (!canUnlockInteraction(npc, 'corrupt')) {
    return { text: getInteractionLockReason(npc, 'corrupt'), npc, ok: false };
  }
  if (!spendAP(game, 10)) return { text: 'Not enough AP.', npc, ok: false };
  addCorruption(npc, 15);
  return withQuestProgress(game, npc, 'corrupt', null, {
    text: `You whisper Gorgara's gospel into ${npc.name}'s ear until resistance crumbles into hungry devotion.`, npc, ok: true,
  });
}

export function doRecruit(npc, player, game) {
  if (!canUnlockInteraction(npc, 'recruit')) {
    return { text: getInteractionLockReason(npc, 'recruit'), npc, ok: false };
  }
  if (!npc.companionId) return { text: 'She cannot join your party.', npc, ok: false };
  const exists = game.party.find((c) => c.id === npc.companionId);
  if (exists) return { text: `${npc.name} is already in your party.`, npc, ok: false };
  const companion = { ...npc, id: npc.companionId, recruited: true, isCompanion: true };
  game.party.push(companion);
  return withQuestProgress(game, npc, 'recruit', null, {
    text: `${npc.name} joins your feast-bound pilgrimage!`, npc: companion, ok: true,
  });
}

/** Award relationship from quest completion or overworld spell cast. */
export function awardNpcRelationship(game, npcId, source, amount) {
  const npc = game.party?.find((c) => c.id === npcId)
    || game.npcStates?.[npcId]
    || null;
  if (!npc) return null;
  const relResult = awardRelationship(npc, source, amount);
  if (game.npcStates?.[npcId]) {
    game.npcStates[npcId] = { ...game.npcStates[npcId], relationship: npc.relationship, bondFlags: npc.bondFlags };
  }
  const partyIdx = game.party?.findIndex((c) => c.id === npcId);
  if (partyIdx >= 0) game.party[partyIdx] = { ...game.party[partyIdx], ...npc };
  return relResult;
}

/** Accept a quest offered by an NPC during dialogue. */
export function acceptNpcQuestOffer(game, npc, questId) {
  const result = acceptQuestFromNpc(game, questId);
  if (!result.ok) return { text: result.message || 'Could not accept quest.', ok: false };
  return {
    ok: true,
    text: `${npc.name} smiles warmly.\n\n${result.message}`,
    questId,
    game,
  };
}

export function renderCombatNarration(unit, interaction) {
  return renderCombatBeat(unit, { interaction });
}
