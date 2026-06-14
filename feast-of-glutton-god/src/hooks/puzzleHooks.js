import {
  notifyQuestEvent,
  ensureQuestState,
} from '../gameData/questEngine.js';

function formatQuestMessages(lines, growthSnippets) {
  const parts = [];
  if (lines?.length) parts.push(lines.join('\n'));
  if (growthSnippets?.length) parts.push(growthSnippets.join('\n\n'));
  return parts.join('\n\n');
}

export function recordPuzzleSolvedForQuests(game, { puzzleId, solutionId, regionId }) {
  ensureQuestState(game);
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'puzzle_solved',
    puzzleId,
    solutionId,
    regionId: regionId ?? game.region,
  });
  return { questMessages: formatQuestMessages(lines, growthSnippets), lines, growthSnippets };
}

export function recordFeatureExaminedForQuests(game, { featureId, regionId }) {
  ensureQuestState(game);
  const { lines, growthSnippets } = notifyQuestEvent(game, {
    type: 'feature_examined',
    featureId,
    regionId: regionId ?? game.region,
  });
  return { questMessages: formatQuestMessages(lines, growthSnippets), lines, growthSnippets };
}

export function recordSpellOnFeatureForQuests(game, { featureId, spellId, solved, puzzleId }) {
  ensureQuestState(game);
  if (!solved) return { questMessages: '' };
  return recordPuzzleSolvedForQuests(game, {
    puzzleId,
    solutionId: `spell_${spellId}`,
    regionId: game.region,
  });
}
