import { createHistory } from '../textEngine/index.js';
import { renderObserve } from '../textEngine/scenes/npc/observe.js';
import { renderFeed } from '../textEngine/scenes/npc/feed.js';
import { renderTalk } from '../textEngine/scenes/npc/talk.js';
import { renderFlirt } from '../textEngine/scenes/npc/flirt.js';
import { renderBless } from '../textEngine/scenes/npc/bless.js';
import { renderFeast } from '../textEngine/scenes/npc/feast.js';
import { renderIntimate } from '../textEngine/scenes/npc/intimate.js';
import { renderCombatBeat } from '../textEngine/scenes/combatText.js';
import { applyNpcGrowth } from '../gameData/npcGrowth.js';
import { addGainDesire, getGainDesire } from '../gameData/gainDesire.js';
import {
  isInteractionSatiationLocked,
  getSatiationLockReason,
  isSatiationRefusing,
} from '../gameData/satiation.js';
import { addCorruption, getCorruptionTier } from '../gameData/corruption.js';
import { getStage } from '../gameData/stages.js';
import {
  awardRelationship,
  getTier,
  getFlirtBonus,
  getInteractionLockReason,
  INTERACTION_UNLOCKS,
  getTierUpMessage,
  canUnlockInteraction,
  RELATIONSHIP_AWARDS,
  getRelationshipAwardMultiplier,
} from '../gameData/relationships.js';
import { spendAP } from '../gameData/player.js';
import { checkSeduce, formatCheckSummary, toTextContext, DC } from '../gameData/skillChecks.js';
import { recordNpcInteractionForQuests, recordNpcGrowthForQuests } from './questHooks.js';
import { awardAbundanceSpreadWithEvents } from '../gameData/worldEvents.js';
import { awardInfluence, getRelationshipInfluenceBonus } from '../gameData/influence.js';
import { awardRegionTransformation } from '../gameData/worldTransformation.js';
import { appendPuzzleHintToTalk } from '../gameData/puzzleHints.js';
import { getReactivityGlobals } from '../gameData/worldReactivity.js';
import { syncGateUnlocks } from '../gameData/regionObstacles.js';
import { getQuestOffersForNpc, buildQuestOfferNarrative, acceptQuestFromNpc } from '../gameData/questOffers.js';
import { renderSpecial } from '../textEngine/scenes/npc/special.js';
import {
  getGrowthFavorCost,
  getBlessFavorCost,
  getSpecialFavorCost,
  canSpendFavor,
  spendFavor,
  getFavorRefusalText,
  canUseSpecialToday,
  markSpecialUsed,
  getSpecialCooldownText,
} from '../gameData/favor.js';
import {
  isServiceLocked,
  isNpcDecliningHostility,
  scaleHostilityGain,
} from '../gameData/regionHostility.js';
import { tickRegionHostility } from '../gameData/regionHostility.js';
import { renderRegionHostilityBeat } from '../textEngine/scenes/dm/region.js';

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
    if (result.growth?.stagesJumped > 0 && result.growth?.consentState !== 'forced') {
      const relResult = applyRelationshipGain(result.npc ?? npc, 'growth_witnessed', null, game);
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
    const transform = awardRegionTransformation(game, game.region, key);
    if (transform.levelUp && transform.message) {
      result.text = (result.text || '') + `\n\n---\n${transform.message}`;
      if (result.narrative) result.narrative += `\n\n---\n${transform.message}`;
    }
    const relBonus = getRelationshipInfluenceBonus(result.npc ?? npc);
    if (interaction === 'feast' || interaction === 'bless' || interaction?.startsWith('bless')) {
      awardInfluence(game, 'religious', 2 + relBonus, key);
    } else if (interaction === 'feed' || interaction?.startsWith('feed')) {
      awardInfluence(game, 'cultural', 1 + relBonus, key);
    } else if (interaction === 'flirt' || interaction === 'intimate') {
      awardInfluence(game, 'cultural', 1 + relBonus, key);
    }
  }
  result.questNotes = quest;
  return result;
}

function applyRelationshipGain(npc, source, amountOverride, game) {
  if (game && amountOverride == null && source) {
    const base = RELATIONSHIP_AWARDS[source] ?? 0;
    const scaled = scaleHostilityGain(Math.round(base * getRelationshipAwardMultiplier(npc)), game);
    return awardRelationship(npc, source, scaled);
  }
  if (game && amountOverride != null) {
    return awardRelationship(npc, source, scaleHostilityGain(amountOverride, game));
  }
  return awardRelationship(npc, source, amountOverride);
}

function appendTierUp(result, npc, relResult) {
  if (!relResult?.tierUp) return result;
  const msg = getTierUpMessage(npc, relResult);
  result.text = (result.text || '') + `\n\n${msg}`;
  if (result.narrative) result.narrative += `\n\n${msg}`;
  result.relationship = relResult;
  return result;
}

function growNpc(npc, game, baseStages, method = 'feed', opts = {}) {
  if (!opts.skipFavor && game?.player) {
    const bonus = getGrowthStageBonus(npc, method);
    const cost = opts.favorCost ?? getGrowthFavorCost(baseStages + bonus);
    if (!canSpendFavor(game.player, cost)) {
      return {
        refused: true,
        favorRefused: true,
        text: getFavorRefusalText(game.player, game, opts.favorAction ?? 'growth'),
        stagesJumped: 0,
        startStage: getStage(npc.lbs).id,
        endStage: getStage(npc.lbs).id,
      };
    }
    const result = applyNpcGrowth(npc, game, baseStages, method, { history: getTextHistory(game) });
    if (!result.favorRefused) spendFavor(game.player, cost);
    return result;
  }
  return applyNpcGrowth(npc, game, baseStages, method, { history: getTextHistory(game) });
}

function growthRenderOpts(npc, growth) {
  return {
    consentState: growth.consentState ?? 'willing',
    severity: growth.severity ?? 0,
    gainDesire: getGainDesire(npc),
  };
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
    reactivity: game ? getReactivityGlobals(game, game.region) : {},
  });
}

export function doObserve(npc, player, game) {
  const poses = ['standing', 'sitting', 'walking'];
  const pose = poses[Math.floor(Math.random() * poses.length)];
  const reactivity = getReactivityGlobals(game, game.region);
  const text = renderObserve(npc, player, { pose, location: game.region, history: getTextHistory(game), reactivity });
  addCorruption(npc, 1);
  const relResult = applyRelationshipGain(npc, 'observe', null, game);
  return withQuestProgress(game, npc, 'observe', null, appendTierUp({ text, npc }, npc, relResult));
}

export function doTalk(npc, player, game) {
  if (isNpcDecliningHostility(npc, game)) {
    const beat = renderRegionHostilityBeat(game, game.region, { hostilityTier: 1 });
    return { text: beat, npc, ok: false, declined: true };
  }
  const reactivity = getReactivityGlobals(game, game.region);
  const text = renderTalk(npc, player, { location: game.region, history: getTextHistory(game), reactivity });
  const relResult = applyRelationshipGain(npc, 'talk', null, game);
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
      null,
      game,
    );
    addGainDesire(updatedNpc, check.critical === 'success' ? 4 : 2);
    addCorruption(updatedNpc, check.critical === 'success' ? 5 : 3);
  } else if (check.critical === 'failure') {
    relResult = applyRelationshipGain(updatedNpc, 'flirt_fumble', null, game);
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
  if (isServiceLocked(game, game.region)) {
    return {
      text: renderRegionHostilityBeat(game, game.region, { hostilityTier: 3, crackdown: true }),
      npc, ok: false,
    };
  }
  if (isInteractionSatiationLocked(npc, game, 'feed')) {
    return { text: getSatiationLockReason(npc), npc, ok: false, refused: true };
  }
  const baseStages = feedType === 'magical' ? 2 : 1;
  const growth = growNpc(npc, game, baseStages, 'feed', { favorAction: 'growth' });
  if (growth.favorRefused) {
    return { text: growth.text, npc, ok: false, favorRefused: true };
  }
  if (growth.refused) {
    return { text: growth.text, npc, ok: false, refused: true, growth };
  }
  const renderOpts = growthRenderOpts(npc, growth);
  const text = renderFeed(npc, player, {
    feedType, location: game.region, history: getTextHistory(game), ...renderOpts,
  });
  if (growth.consentState !== 'forced') {
    addCorruption(npc, feedType === 'magical' ? 6 : 4);
  }
  const relResult = growth.consentState !== 'forced' && growth.stagesJumped > 0
    ? applyRelationshipGain(npc, feedType === 'magical' ? 'feed_magical' : 'feed', null, game)
    : null;
  let result = appendTierUp({
    text: text + '\n\n' + (growth.text || ''), npc, growth,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'feed', { feedType }, result);
}

export function doBless(npc, player, game, blessType = 'minor') {
  if (!canUnlockInteraction(npc, 'bless')) {
    return { text: getInteractionLockReason(npc, 'bless'), npc, ok: false };
  }
  if (isServiceLocked(game, game.region)) {
    return {
      text: renderRegionHostilityBeat(game, game.region, { hostilityTier: 3, crackdown: true }),
      npc, ok: false,
    };
  }
  if (isInteractionSatiationLocked(npc, game, 'bless')) {
    return { text: getSatiationLockReason(npc), npc, ok: false, refused: true };
  }
  const costs = { minor: 5, major: 15, targeted: 10 };
  const cost = costs[blessType] || 5;
  if (!spendAP(game, cost)) return { text: 'Not enough Abundance Points.', npc, ok: false };
  const baseStages = blessType === 'major' ? 2 : 1;
  const favorCost = getBlessFavorCost(blessType);
  const growth = growNpc(npc, game, baseStages, 'blessing', { favorCost, favorAction: 'bless' });
  if (growth.favorRefused) {
    return { text: growth.text, npc, ok: false, favorRefused: true };
  }
  if (growth.refused) {
    return { text: growth.text, npc, ok: false, refused: true, growth };
  }
  const renderOpts = growthRenderOpts(npc, growth);
  const text = renderBless(npc, player, {
    blessType,
    zone: blessType === 'targeted' ? 'belly' : undefined,
    history: getTextHistory(game),
    ...renderOpts,
  });
  if (growth.consentState !== 'forced') {
    addCorruption(npc, blessType === 'major' ? 10 : 5);
  }
  const awardKey = blessType === 'major' ? 'bless_major' : blessType === 'targeted' ? 'bless_targeted' : 'bless_minor';
  const relResult = growth.consentState !== 'forced' && growth.stagesJumped > 0
    ? applyRelationshipGain(npc, awardKey, null, game)
    : null;
  let result = appendTierUp({
    text: text + '\n\n' + (growth.text || ''), npc, growth, ok: true,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'bless', { blessType }, result);
}

export function doFeast(npc, player, game) {
  if (!canUnlockInteraction(npc, 'feast')) {
    return { text: getInteractionLockReason(npc, 'feast'), npc, ok: false };
  }
  if (isServiceLocked(game, game.region)) {
    return {
      text: renderRegionHostilityBeat(game, game.region, { hostilityTier: 3, crackdown: true }),
      npc, ok: false,
    };
  }
  if (isSatiationRefusing(npc, game)) {
    return { text: getSatiationLockReason(npc), npc, ok: false, refused: true };
  }
  if (!spendAP(game, 20)) return { text: 'Not enough Abundance Points for a feast.', npc, ok: false };
  const growth = growNpc(npc, game, 3, 'feast', { favorAction: 'growth' });
  if (growth.favorRefused) {
    return { text: growth.text, npc, ok: false, favorRefused: true };
  }
  if (growth.refused) {
    return { text: growth.text, npc, ok: false, refused: true, growth };
  }
  const text = renderFeast(npc, player, { history: getTextHistory(game) });
  if (growth.consentState !== 'forced') addCorruption(npc, 15);
  const relResult = growth.consentState !== 'forced' && growth.stagesJumped > 0
    ? applyRelationshipGain(npc, 'feast', null, game)
    : null;
  game.day += 1;
  tickRegionHostility(game, { dayAdvance: true });
  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags[`feast_held_${game.region}`] = true;
  game.worldFlags.communal_feast_done = true;
  const gateMsgs = syncGateUnlocks(game, { regionId: game.region });
  let result = appendTierUp({
    text: text + '\n\n' + (growth.text || ''), npc, growth, ok: true,
  }, npc, relResult);
  if (gateMsgs.length) {
    result.text = `${result.text}\n\n${gateMsgs.join('\n\n')}`;
  }
  return withQuestProgress(game, npc, 'feast', null, result);
}

export function getInteractionMenu(npc, player, game) {
  const rel = getTier(npc.relationship || 0);
  const cor = getCorruptionTier(npc.corruption || 0);
  const crackdown = game && isServiceLocked(game, game.region);
  const crackdownHint = 'Region crackdown — larders and blessings sealed';

  const item = (id, label, extraEnabled = true, hint) => {
    const satiationLocked = game && isInteractionSatiationLocked(npc, game, id);
    const serviceLocked = crackdown && ['feed', 'bless', 'feast', 'special'].includes(id);
    const enabled = canUnlockInteraction(npc, id) && extraEnabled && !satiationLocked && !serviceLocked;
    let lockHint = !canUnlockInteraction(npc, id) ? getInteractionLockReason(npc, id) : hint;
    if (serviceLocked) lockHint = crackdownHint;
    if (satiationLocked) lockHint = getSatiationLockReason(npc);
    return {
      id,
      label,
      enabled,
      hint: lockHint,
      tierRequired: INTERACTION_UNLOCKS[id] ?? 0,
    };
  };

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
  if (isServiceLocked(game, game.region)) {
    return {
      text: renderRegionHostilityBeat(game, game.region, { hostilityTier: 3, crackdown: true }),
      npc, ok: false,
    };
  }
  if (!canUseSpecialToday(npc, game)) {
    return { text: getSpecialCooldownText(npc, player, game), npc, ok: false, cooldown: true };
  }
  if (isInteractionSatiationLocked(npc, game, 'special')) {
    return { text: getSatiationLockReason(npc), npc, ok: false, refused: true };
  }
  const growth = growNpc(npc, game, 2, 'blessing', {
    favorCost: getSpecialFavorCost(),
    favorAction: 'special',
  });
  if (growth.favorRefused) {
    return { text: growth.text, npc, ok: false, favorRefused: true };
  }
  if (growth.refused) {
    return { text: growth.text, npc, ok: false, refused: true, growth };
  }
  markSpecialUsed(npc, game);
  const renderOpts = growthRenderOpts(npc, growth);
  const line = renderSpecial(npc, player, {
    playerClass: player.classId,
    history: getTextHistory(game),
    ...renderOpts,
  });
  if (growth.consentState !== 'forced') addCorruption(npc, 8);
  const relResult = growth.consentState !== 'forced' && growth.stagesJumped > 0
    ? applyRelationshipGain(npc, 'special', null, game)
    : null;
  let result = appendTierUp({
    text: line + '\n\n' + (growth.text || ''), npc, growth,
  }, npc, relResult);
  return withQuestProgress(game, npc, 'special', null, result);
}

export function doIntimate(npc, player, game) {
  if (!canUnlockInteraction(npc, 'intimate')) {
    return { text: getInteractionLockReason(npc, 'intimate'), npc, ok: false };
  }
  if (isInteractionSatiationLocked(npc, game, 'intimate')) {
    return { text: getSatiationLockReason(npc), npc, ok: false, refused: true };
  }
  const growth = growNpc(npc, game, 2, 'intimate');
  if (growth.refused) {
    return { text: growth.text, npc, ok: false, refused: true, growth };
  }
  if (growth.consentState !== 'forced') addCorruption(npc, 5);
  const relResult = growth.consentState !== 'forced' && growth.stagesJumped > 0
    ? applyRelationshipGain(npc, 'intimate', null, game)
    : null;
  const sceneText = renderIntimate(npc, player, { location: game.region, history: getTextHistory(game) });
  let result = appendTierUp({
    text: sceneText + '\n\n' + (growth.text || ''), npc, growth,
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
    text: `You whisper the Fat Goddess's gospel into ${npc.name}'s ear until resistance crumbles into hungry devotion.`, npc, ok: true,
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
