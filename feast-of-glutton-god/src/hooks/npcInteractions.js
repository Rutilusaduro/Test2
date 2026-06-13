import { createHistory } from '../textEngine/index.js';
import { renderObserve } from '../textEngine/scenes/npc/observe.js';
import { renderFeed } from '../textEngine/scenes/npc/feed.js';
import { renderTalk } from '../textEngine/scenes/npc/talk.js';
import { renderFlirt } from '../textEngine/scenes/npc/flirt.js';
import { renderBless } from '../textEngine/scenes/npc/bless.js';
import { renderFeast } from '../textEngine/scenes/npc/feast.js';
import { renderGrowthScene } from '../textEngine/scenes/growthEvent/index.js';
import { renderCombatBeat } from '../textEngine/scenes/combatText.js';
import { advanceStage } from '../gameData/stages.js';
import { addCorruption } from '../gameData/corruption.js';
import { addRelationship } from '../gameData/relationships.js';
import { getTier } from '../gameData/relationships.js';
import { getCorruptionTier } from '../gameData/corruption.js';
import { getStage } from '../gameData/stages.js';
import { spendAP } from '../gameData/player.js';
import { checkSeduce, formatCheckSummary, toTextContext, DC } from '../gameData/skillChecks.js';
import { recordNpcInteractionForQuests, recordNpcGrowthForQuests } from './questHooks.js';

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
  }
  if (questMessages) {
    result.text = (result.text || '') + `\n\n---\n${questMessages}`;
  }
  result.questNotes = quest;
  return result;
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
  return withQuestProgress(game, npc, 'observe', null, { text, npc });
}

export function doTalk(npc, player, game) {
  const text = renderTalk(npc, player, { location: game.region, history: getTextHistory(game) });
  addRelationship(npc, 3);
  return withQuestProgress(game, npc, 'talk', null, { text, npc });
}

export function doFlirt(npc, player, game) {
  const relBonus = (npc.relationship || 0) >= 40 ? 2 : 0;
  const check = checkSeduce(player, DC.medium, {
    bonuses: relBonus
      ? [{ type: 'circumstantial', label: 'Warm rapport', value: relBonus, source: 'relationship' }]
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

  if (check.success) {
    addRelationship(updatedNpc, check.critical === 'success' ? 8 : 5);
    addCorruption(updatedNpc, check.critical === 'success' ? 5 : 3);
  } else if (check.critical === 'failure') {
    addRelationship(updatedNpc, 1);
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

  return withQuestProgress(game, updatedNpc, 'flirt', null, {
    text: `${summary}\n\n${text}${failNote}${critNote}`,
    npc: updatedNpc,
    success: check.success,
    check,
  });
}

export function doFeed(npc, player, game, feedType = 'hand') {
  const startStage = getStage(npc.lbs).id;
  const growth = advanceStage(npc, feedType === 'magical' ? 2 : 1);
  const text = renderFeed(npc, player, { feedType, location: game.region, history: getTextHistory(game) });
  addCorruption(npc, feedType === 'magical' ? 6 : 4);
  addRelationship(npc, 4);
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'feed',
    startStage,
    endStage: growth.endStage,
    gainLbs: 10,
    week: game.day,
  });
  return withQuestProgress(game, npc, 'feed', { feedType }, {
    text: text + '\n\n' + growthText, npc, growth,
  });
}

export function doBless(npc, player, game, blessType = 'minor') {
  const costs = { minor: 5, major: 15, targeted: 10 };
  const cost = costs[blessType] || 5;
  if (!spendAP(game, cost)) return { text: 'Not enough Abundance Points.', npc, ok: false };
  const startStage = getStage(npc.lbs).id;
  const stages = blessType === 'major' ? 2 : 1;
  const growth = advanceStage(npc, stages);
  const text = renderBless(npc, player, {
    blessType,
    zone: blessType === 'targeted' ? 'belly' : undefined,
    history: getTextHistory(game),
  });
  addCorruption(npc, blessType === 'major' ? 10 : 5);
  addRelationship(npc, 6);
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'blessing',
    startStage,
    endStage: growth.endStage,
    week: game.day,
  });
  return withQuestProgress(game, npc, 'bless', { blessType }, {
    text: text + '\n\n' + growthText, npc, growth, ok: true,
  });
}

export function doFeast(npc, player, game) {
  if (!spendAP(game, 20)) return { text: 'Not enough Abundance Points for a feast.', npc, ok: false };
  const startStage = getStage(npc.lbs).id;
  const growth = advanceStage(npc, 3);
  const text = renderFeast(npc, player, { history: getTextHistory(game) });
  addCorruption(npc, 15);
  addRelationship(npc, 10);
  const growthText = renderGrowthScene(npc, {
    growthMethod: 'feast',
    startStage,
    endStage: growth.endStage,
    week: game.day,
  });
  game.day += 1;
  return withQuestProgress(game, npc, 'feast', null, {
    text: text + '\n\n' + growthText, npc, growth, ok: true,
  });
}

export function getInteractionMenu(npc, player) {
  const rel = getTier(npc.relationship || 0);
  const cor = getCorruptionTier(npc.corruption || 0);
  const menu = [
    { id: 'talk', label: 'Talk', enabled: true },
    { id: 'flirt', label: 'Flirt / Compliment', enabled: true },
    { id: 'observe', label: 'Observe / Admire', enabled: true },
    { id: 'feed', label: 'Feed', enabled: true },
    { id: 'bless', label: 'Bless (spend AP)', enabled: true },
    { id: 'feast', label: 'Invite to Feast', enabled: (player.ap || 0) >= 20 },
    { id: 'special', label: `Special (${player.subclass})`, enabled: true },
    { id: 'intimate', label: 'Intimate', enabled: rel.id >= 4 },
    { id: 'corrupt', label: 'Corrupt', enabled: rel.id >= 2 && cor.id < 2 },
    { id: 'recruit', label: 'Recruit', enabled: rel.id >= 3 && cor.id >= 1 && npc.companionId },
  ];
  return menu;
}

export function doSpecial(npc, player, game) {
  const lines = {
    bard: 'You perform a private growth ballad. Her body sways in time, swelling with each verse.',
    wizard: 'You conjure a cauldron of experimental feast-magic. She watches, fascinated, as the brew swells her.',
    cleric: 'You lead a prayer of abundance. Golden light pours into her, belly rounding with divine pleasure.',
    warlock: 'You invoke Gorgara\'s Claim — hunger floods her until she moans your name.',
  };
  const startStage = getStage(npc.lbs).id;
  const growth = advanceStage(npc, 2);
  addCorruption(npc, 8);
  addRelationship(npc, 5);
  const growthText = renderGrowthScene(npc, { growthMethod: 'blessing', startStage, endStage: growth.endStage, week: game.day });
  return withQuestProgress(game, npc, 'special', null, {
    text: (lines[player.classId] || lines.cleric) + '\n\n' + growthText, npc, growth,
  });
}

export function doIntimate(npc, player, game) {
  const startStage = getStage(npc.lbs).id;
  const growth = advanceStage(npc, 2);
  addCorruption(npc, 5);
  addRelationship(npc, 3);
  const growthText = renderGrowthScene(npc, { growthMethod: 'blessing', startStage, endStage: growth.endStage, week: game.day });
  return withQuestProgress(game, npc, 'intimate', null, {
    text: `Intimacy with ${npc.name} — warmth, feeding, worship, growth during lovemaking.\n\n${growthText}`,
    npc, growth,
  });
}

export function doCorrupt(npc, player, game) {
  if (!spendAP(game, 10)) return { text: 'Not enough AP.', npc, ok: false };
  addCorruption(npc, 15);
  return withQuestProgress(game, npc, 'corrupt', null, {
    text: `You whisper Gorgara's gospel into ${npc.name}'s ear until resistance crumbles into hungry devotion.`, npc, ok: true,
  });
}

export function doRecruit(npc, player, game) {
  if (!npc.companionId) return { text: 'She cannot join your party.', npc, ok: false };
  const exists = game.party.find((c) => c.id === npc.companionId);
  if (exists) return { text: `${npc.name} is already in your party.`, npc, ok: false };
  const companion = { ...npc, id: npc.companionId, recruited: true, isCompanion: true };
  game.party.push(companion);
  return withQuestProgress(game, npc, 'recruit', null, {
    text: `${npc.name} joins your feast-bound pilgrimage!`, npc: companion, ok: true,
  });
}

export function renderCombatNarration(unit, interaction) {
  return renderCombatBeat(unit, { interaction });
}
