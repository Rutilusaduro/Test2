import {
  notifyQuestEvent,
  startQuest,
  canStartQuest,
  getActiveQuests,
  getDiscoverableQuests,
  ensureQuestState,
} from '../gameData/questEngine.js';
import { QUEST_TYPE } from '../gameData/quests/constants.js';
import { narrateEvent } from '../gameData/narrator.js';
import { renderRegionHostilityBeat } from '../textEngine/scenes/dm/region.js';
import { clearCrackdown } from '../gameData/regionHostility.js';
import { awardCompanionDevotion } from '../gameData/companionDevotion.js';
import {
  checkCompanionMilestones,
  formatCompanionMilestoneMessages,
} from '../gameData/companionMilestones.js';
import { syncPrestigeRank } from '../gameData/prestige.js';
import { checkAchievements, recordCosmicConversion } from '../gameData/achievements.js';
import { isCosmicThreat } from '../gameData/enemies.js';

/**
 * Record an NPC interaction for quest objective progress.
 * @returns {{ lines: string[], growthSnippets: string[], questMessages: string }}
 */
export function flushCompanionMilestoneBeats(game) {
  const fired = checkCompanionMilestones(game);
  const message = formatCompanionMilestoneMessages(fired);
  if (message) narrateEvent(game, message, 'devotion');
  if (fired.length) {
    const prestige = syncPrestigeRank(game);
    if (prestige.rankUp && prestige.message) {
      narrateEvent(game, prestige.message, 'levelup');
    }
  }
  return fired;
}

export function recordNpcInteractionForQuests(game, { npcId, interaction, npc, meta }) {
  ensureQuestState(game);
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'npc_interaction',
    npcId,
    interaction,
    npc,
    meta,
    regionId: game.region,
  });
  const questMessages = formatQuestMessages(lines, growthSnippets);
  flushCompanionMilestoneBeats(game);
  return { lines, growthSnippets, questMessages };
}

export function recordNpcGrowthForQuests(game, { npcId, startStage, endStage, stagesGained }) {
  ensureQuestState(game);
  const companion = (game.party ?? []).find((c) => c.id === npcId);
  if (companion && stagesGained > 0) {
    awardCompanionDevotion(companion, Math.min(5, stagesGained * 2), 'growth');
  }
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'npc_growth',
    npcId,
    startStage,
    endStage,
    stagesGained: stagesGained ?? Math.max(0, endStage - startStage),
  });
  return { questMessages: formatQuestMessages(lines, growthSnippets), lines, growthSnippets };
}

export function recordRegionVisitForQuests(game, regionId) {
  ensureQuestState(game);
  if (regionId === 'eternal_feast_hall') {
    game.worldFlags = game.worldFlags ?? {};
    game.worldFlags.eternal_hall_visited = true;
  }
  if (regionId === 'divine_plane_vestibule') {
    game.worldFlags = game.worldFlags ?? {};
    game.worldFlags.vestibule_crossed = true;
  }
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'visit_region',
    regionId,
  });
  flushCompanionMilestoneBeats(game);
  checkAchievements(game);
  return { questMessages: formatQuestMessages(lines, growthSnippets) };
}

export function recordCombatEndForQuests(game, combat) {
  ensureQuestState(game);
  if (!combat?.victory || combat.victory === 'lose') {
    return { questMessages: '' };
  }
  const victoryType = combat.victory === 'converted' ? 'converted' : 'win';
  const defeatedEnemyIds = (combat.enemies ?? [])
    .filter((e) => e.hp <= 0 || e.converted)
    .map((e) => e.typeId || e.type || e.id)
    .filter(Boolean);
  const foughtEnemyIds = (combat.enemies ?? [])
    .map((e) => e.typeId || e.type || e.id)
    .filter(Boolean);
  if (foughtEnemyIds.includes('korthak_titan')) {
    game.worldFlags = game.worldFlags || {};
    game.worldFlags.korthak_titan_encountered = true;
  }
  if (defeatedEnemyIds.includes('dream_echo')) {
    game.player.storyFlags = game.player.storyFlags || {};
    game.player.storyFlags.dream_echo_faced = true;
  }
  if (defeatedEnemyIds.includes('lyra_champion') || defeatedEnemyIds.includes('lyra_apostate')) {
    game.player.storyFlags = game.player.storyFlags || {};
    game.player.storyFlags.lyra_ascended_defeated = true;
  }
  if (defeatedEnemyIds.includes('wheel_incarnate')) {
    game.worldFlags = game.worldFlags || {};
    game.worldFlags.defeated_wheel_incarnate = true;
  }
  if (combat.victory === 'converted') {
    const hasCosmic = (combat.enemies ?? []).some((e) => isCosmicThreat(e));
    if (hasCosmic) recordCosmicConversion(game);
  }
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'combat_end',
    victoryType,
    regionId: game.region,
    defeatedEnemyIds,
    trivialized: Boolean(combat.trivialized),
  });
  flushCompanionMilestoneBeats(game);
  const achievements = checkAchievements(game);
  const achMsg = achievements.map((a) => a.message).filter(Boolean).join('\n\n');
  const base = formatQuestMessages(lines, growthSnippets);
  return { questMessages: [base, achMsg].filter(Boolean).join('\n\n') };
}

export function tryStartQuest(game, questId) {
  ensureQuestState(game);
  return startQuest(game, questId);
}

export function getQuestLogData(game) {
  ensureQuestState(game);
  return {
    main: getActiveQuests(game, QUEST_TYPE.MAIN),
    side: getActiveQuests(game, QUEST_TYPE.SIDE),
    completed: game.quests.completed,
  };
}

export function getAvailableQuestsInRegion(game, regionId) {
  return getDiscoverableQuests(game, regionId);
}

function formatQuestMessages(lines, growthSnippets) {
  const parts = [];
  if (lines?.length) parts.push(lines.join('\n'));
  if (growthSnippets?.length) parts.push(growthSnippets.join('\n\n'));
  return parts.join('\n\n');
}

/** Narrate hostility tier beats and auto-start redemption quest when crackdown triggers. */
export function flushHostilityPending(game) {
  ensureQuestState(game);
  const pending = game.worldFlags?.pending_hostility_narration;
  if (pending) {
    const beat = renderRegionHostilityBeat(game, pending.regionId, pending);
    if (beat) narrateEvent(game, beat, 'quest');
    delete game.worldFlags.pending_hostility_narration;
  }
  if (game.worldFlags?.pending_redemption_quest) {
    game.worldFlags.pending_redemption_quest = false;
    const already = game.quests.active?.side_hostility_redemption
      || game.quests.completed?.includes('side_hostility_redemption');
    if (!already) {
      const quest = startQuest(game, 'side_hostility_redemption');
      if (quest.ok && quest.message) narrateEvent(game, quest.message, 'quest');
    }
  }
}

export function onRedemptionQuestComplete(game) {
  const regionId = game.worldFlags?.redemptionRegion ?? game.region;
  clearCrackdown(game, regionId);
  game.worldFlags.hostility_redemption_complete = true;
  game.worldFlags.pending_hostility_narration = {
    regionId,
    hostilityTier: 1,
    crackdown: false,
  };
  flushHostilityPending(game);
}
