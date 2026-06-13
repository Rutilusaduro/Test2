import {
  notifyQuestEvent,
  startQuest,
  canStartQuest,
  getActiveQuests,
  getDiscoverableQuests,
  ensureQuestState,
} from '../gameData/questEngine.js';
import { QUEST_TYPE } from '../gameData/quests/constants.js';

/**
 * Record an NPC interaction for quest objective progress.
 * @returns {{ lines: string[], growthSnippets: string[], questMessages: string }}
 */
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
  return { lines, growthSnippets, questMessages };
}

export function recordNpcGrowthForQuests(game, { npcId, startStage, endStage, stagesGained }) {
  ensureQuestState(game);
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
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'visit_region',
    regionId,
  });
  return { questMessages: formatQuestMessages(lines, growthSnippets) };
}

export function recordCombatEndForQuests(game, combat) {
  ensureQuestState(game);
  const victoryType = combat.victory === 'converted' ? 'converted' : 'win';
  const defeatedEnemyIds = (combat.enemies ?? [])
    .map((e) => e.id)
    .filter(Boolean);
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'combat_end',
    victoryType,
    regionId: game.region,
    defeatedEnemyIds,
  });
  return { questMessages: formatQuestMessages(lines, growthSnippets) };
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
