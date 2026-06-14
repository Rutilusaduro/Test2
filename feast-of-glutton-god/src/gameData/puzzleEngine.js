/**
 * Puzzle engine — D&D-style creative problem-solving with multiple solutions.
 */
import { ensureQuestState } from './questEngine.js';
import { applyPuzzleRewards } from './puzzleRewards.js';
import {
  getPuzzleDefinition,
  getPuzzlesInRegion,
  getPuzzleByFeature,
} from './puzzles/registry.js';
import { getFeature, getFeaturesInRegion } from './regionFeatures.js';
import { SOLUTION_KIND } from './puzzles/constants.js';
import { getStage, advanceStage } from './stages.js';
import { getTier } from './relationships.js';
import { getNpcState, spendAP } from './player.js';
import { findNpc } from './npcs.js';
import { resolveSkillCheck } from './skillChecks.js';
import { getCombinedPuzzleBonuses } from './worldAuras.js';
import { getAbundanceSpread } from './abundanceSpread.js';
import { getPuzzleCapabilities } from './stagePerks.js';
import { renderPuzzleText } from '../textEngine/scenes/puzzles/index.js';
import { awardAbundanceSpreadWithEvents } from './worldEvents.js';
import { QUEST_NPC_ALIASES } from './quests/constants.js';

function resolveNpcAliases(npcId) {
  if (!npcId) return [];
  if (QUEST_NPC_ALIASES[npcId]) return QUEST_NPC_ALIASES[npcId];
  for (const aliases of Object.values(QUEST_NPC_ALIASES)) {
    if (aliases.includes(npcId)) return aliases;
  }
  return [npcId];
}

function getNpcRelationship(game, npcId) {
  for (const id of resolveNpcAliases(npcId)) {
    const template = findNpc(id, game);
    if (template) {
      const npc = getNpcState(game, template);
      return getTier(npc.relationship || 0).id;
    }
    const companion = (game.party ?? []).find((c) => c.id === id);
    if (companion) return getTier(companion.relationship || 0).id;
  }
  return 0;
}

function getCompanionInParty(game, companionId) {
  const aliases = resolveNpcAliases(companionId);
  return (game.party ?? []).find((c) =>
    aliases.includes(c.id) || c.companionId === companionId || c.id === companionId,
  ) ?? null;
}

export function isPuzzleSolved(game, puzzleId) {
  ensureQuestState(game);
  const def = getPuzzleDefinition(puzzleId);
  if (!def) return false;
  return Boolean(game.worldFlags?.[def.stateFlag]);
}

export function isFeatureExamined(game, featureId) {
  const puzzle = getPuzzleByFeature(featureId);
  if (!puzzle?.examinedFlag) return false;
  return Boolean(game.worldFlags?.[puzzle.examinedFlag]);
}

export function getRegionPuzzleStates(game, regionId) {
  return getPuzzlesInRegion(regionId).map((puzzle) => ({
    puzzle,
    solved: isPuzzleSolved(game, puzzle.id),
    examined: Boolean(game.worldFlags?.[puzzle.examinedFlag]),
  }));
}

export function getVisibleFeatures(game, regionId) {
  return getFeaturesInRegion(regionId).map((feature) => {
    const puzzle = getPuzzleByFeature(feature.id);
    return {
      ...feature,
      puzzle,
      solved: puzzle ? isPuzzleSolved(game, puzzle.id) : false,
      examined: isFeatureExamined(game, feature.id),
    };
  });
}

function evaluateSolutionKind(game, solution, puzzle, context = {}) {
  const player = game.player;
  const stageId = getStage(player.lbs).id;
  const perks = getPuzzleCapabilities(player);
  const bonuses = getCombinedPuzzleBonuses(game, puzzle.regionId);

  switch (solution.kind) {
    case SOLUTION_KIND.SKILL_CHECK:
      return { available: true, hint: solution.hint };

    case SOLUTION_KIND.PLAYER_STAGE_MIN: {
      const need = solution.stage ?? 1;
      const meets = stageId >= need;
      const perkAlt = need <= 6 && perks.livingBridge && solution.id?.includes('bridge');
      return {
        available: meets || perkAlt,
        hint: meets ? null : `Requires size stage ${need}+ (you are ${stageId})`,
      };
    }

    case SOLUTION_KIND.SPELL:
      return {
        available: Boolean(context.spellId)
          ? (solution.spellIds ?? []).includes(context.spellId)
          : true,
        hint: solution.hint ?? 'Cast the right spell on this place from your spellbook.',
      };

    case SOLUTION_KIND.NPC_RELATIONSHIP_MIN: {
      const tier = getNpcRelationship(game, solution.npcId);
      const need = solution.tier ?? 1;
      const template = findNpc(solution.npcId, game);
      const name = template?.name ?? solution.npcId;
      return {
        available: tier >= need,
        hint: tier >= need ? null : `Requires ${need}+ bond with ${name}`,
      };
    }

    case SOLUTION_KIND.COMPANION_HELP: {
      const companion = getCompanionInParty(game, solution.companionId);
      if (!companion) {
        return { available: false, hint: `Requires ${solution.companionId} in your party` };
      }
      const tier = getTier(companion.relationship || 0).id;
      const need = solution.tier ?? 2;
      return {
        available: tier >= need,
        hint: tier >= need ? null : `Requires ${need}+ bond with ${companion.name}`,
      };
    }

    case SOLUTION_KIND.SELF_GROW: {
      const minStage = solution.minStage ?? 4;
      const apCost = Math.max(0, (solution.apCost ?? 10) - bonuses.apDiscount);
      const hasAp = (player.ap || 0) >= apCost;
      return {
        available: stageId >= minStage && hasAp && !isPuzzleSolved(game, puzzle.id),
        hint: !hasAp
          ? `Requires ${apCost} AP`
          : stageId < minStage
            ? `Requires size stage ${minStage}+`
            : solution.hint,
        apCost,
      };
    }

    case SOLUTION_KIND.AP_SPEND: {
      const cost = Math.max(0, (solution.ap ?? 5) - bonuses.apDiscount);
      return {
        available: (player.ap || 0) >= cost,
        hint: (player.ap || 0) >= cost ? null : `Requires ${cost} AP`,
        apCost: cost,
      };
    }

    case SOLUTION_KIND.ABUNDANCE_MIN: {
      const points = getAbundanceSpread(game);
      const need = solution.points ?? 50;
      return {
        available: points >= need,
        hint: points >= need ? null : `Requires ${need}+ abundance influence (${points} now)`,
      };
    }

    case SOLUTION_KIND.FLAG_SET: {
      const flag = solution.flag;
      const val = game.worldFlags?.[flag] ?? game.player?.storyFlags?.[flag];
      return { available: Boolean(val), hint: solution.hint };
    }

    default:
      return { available: false, hint: 'Unknown approach.' };
  }
}

export function getAvailableSolutions(game, puzzleId, context = {}) {
  const puzzle = getPuzzleDefinition(puzzleId);
  if (!puzzle) return [];
  if (isPuzzleSolved(game, puzzleId)) return [];

  return puzzle.solutions.map((solution) => {
    const evalResult = evaluateSolutionKind(game, solution, puzzle, context);
    return {
      ...solution,
      available: evalResult.available,
      hint: evalResult.hint ?? solution.hint,
      apCost: evalResult.apCost,
    };
  });
}

export function examineFeature(game, featureId) {
  ensureQuestState(game);
  const feature = getFeature(featureId);
  if (!feature) return { ok: false, text: 'Nothing to examine here.' };

  const puzzle = getPuzzleByFeature(featureId);
  if (puzzle?.examinedFlag) {
    game.worldFlags[puzzle.examinedFlag] = true;
  }

  const solved = puzzle ? isPuzzleSolved(game, puzzle.id) : false;
  const textKey = solved ? 'puzzle.examine.solved' : 'puzzle.examine.default';
  const prose = renderPuzzleText(textKey, game, {
    feature,
    puzzle,
    globals: {
      featureName: feature.name,
      puzzleTitle: puzzle?.title,
      puzzleDesc: puzzle?.desc,
    },
  });

  const solutions = puzzle ? getAvailableSolutions(game, puzzle.id) : [];
  const hints = solutions
    .filter((s) => s.hint && !s.available)
    .map((s) => `• ${s.label}: ${s.hint}`)
    .slice(0, 3);

  let text = prose;
  if (!solved && hints.length) {
    text += `\n\nYou sense several paths forward:\n${hints.join('\n')}`;
  }
  if (solved) {
    text += `\n\n✦ This mystery has been solved — abundance found a way.`;
  }

  return { ok: true, text, feature, puzzle, solved };
}

function buildSkillCheck(game, puzzle, solution) {
  const bonuses = getCombinedPuzzleBonuses(game, puzzle.regionId);
  const perkMods = getPuzzleCapabilities(game.player);
  const extraBonuses = [];

  if (bonuses.dcReduction > 0) {
    extraBonuses.push({
      type: 'circumstantial',
      label: bonuses.auraLabel ? `${bonuses.auraLabel}` : 'Abundance blessing',
      value: 0,
      source: 'aura',
    });
  }
  if (perkMods.skillBonus > 0) {
    extraBonuses.push({
      type: 'feature',
      label: 'Size-stage presence',
      value: perkMods.skillBonus,
      source: 'stage_perk',
    });
  }

  const dc = Math.max(5, (solution.dc ?? 12) - bonuses.dcReduction);
  return resolveSkillCheck(game.player, {
    skillId: solution.skillId,
    dc,
    bonuses: extraBonuses,
    label: solution.label,
  });
}

export function attemptSolution(game, puzzleId, solutionId, opts = {}) {
  ensureQuestState(game);
  const puzzle = getPuzzleDefinition(puzzleId);
  if (!puzzle) return { ok: false, text: 'Unknown puzzle.' };
  if (isPuzzleSolved(game, puzzleId)) {
    return { ok: false, text: 'You have already solved this.' };
  }

  const solution = puzzle.solutions.find((s) => s.id === solutionId);
  if (!solution) return { ok: false, text: 'Unknown approach.' };

  const evalResult = evaluateSolutionKind(game, solution, puzzle, opts);
  if (!evalResult.available) {
    return { ok: false, text: evalResult.hint || 'That approach is not available yet.' };
  }

  if (solution.kind === SOLUTION_KIND.SKILL_CHECK) {
    const check = buildSkillCheck(game, puzzle, solution);
    return {
      ok: true,
      needsCheck: true,
      check,
      puzzleId,
      solutionId,
      narrative: renderPuzzleText('puzzle.attempt.skill', game, {
        puzzle,
        solution,
        globals: { solutionLabel: solution.label },
      }),
    };
  }

  return applySolutionImmediate(game, puzzleId, solutionId);
}

function spendSolutionCosts(game, solution) {
  const bonuses = getCombinedPuzzleBonuses(game, game.region);
  if (solution.kind === SOLUTION_KIND.SELF_GROW) {
    const apCost = Math.max(0, (solution.apCost ?? 10) - bonuses.apDiscount);
    spendAP(game, apCost);
    const stages = solution.stages ?? 1;
    advanceStage(game.player, stages);
    return { growth: true, stages };
  }
  if (solution.kind === SOLUTION_KIND.AP_SPEND) {
    const cost = Math.max(0, (solution.ap ?? 5) - bonuses.apDiscount);
    spendAP(game, cost);
  }
  return {};
}

export function completeSolutionAfterCheck(game, puzzleId, solutionId, checkResult) {
  if (!checkResult?.success) {
    const failText = renderPuzzleText('puzzle.fail.skill', game, {
      globals: { solutionLabel: checkResult?.label },
    });
    return {
      ok: true,
      solved: false,
      text: failText,
    };
  }
  return applySolutionImmediate(game, puzzleId, solutionId, { checkResult });
}

export function applySolutionImmediate(game, puzzleId, solutionId, opts = {}) {
  ensureQuestState(game);
  const puzzle = getPuzzleDefinition(puzzleId);
  const solution = puzzle?.solutions.find((s) => s.id === solutionId);
  if (!puzzle || !solution) return { ok: false, text: 'Unknown solution.' };

  spendSolutionCosts(game, solution);

  game.worldFlags[puzzle.stateFlag] = true;

  const rewardMsgs = [];
  if (solution.onSolve?.rewards) {
    rewardMsgs.push(...applyPuzzleRewards(game, solution.onSolve.rewards));
  }
  if (puzzle.onSolve) {
    rewardMsgs.push(...applyPuzzleRewards(game, puzzle.onSolve));
  }

  awardAbundanceSpreadWithEvents(game, 'puzzle_solved');

  const textKey = solution.onSolve?.textKey ?? 'puzzle.solve.default';
  const prose = renderPuzzleText(textKey, game, {
    puzzle,
    solution,
    globals: {
      solutionLabel: solution.label,
      puzzleTitle: puzzle.title,
    },
  });

  const rewardNote = rewardMsgs.length ? `\n\n${rewardMsgs.join(' · ')}` : '';

  return {
    ok: true,
    solved: true,
    puzzleId,
    solutionId,
    text: `${prose}${rewardNote}`,
    rewardMsgs,
  };
}

/** Check if a spell can solve a feature puzzle. */
export function getSpellSolutionsForFeature(game, featureId, spellId) {
  const puzzle = getPuzzleByFeature(featureId);
  if (!puzzle || isPuzzleSolved(game, puzzle.id)) return [];

  return puzzle.solutions.filter((s) => {
    if (s.kind !== SOLUTION_KIND.SPELL) return false;
    if (!(s.spellIds ?? []).includes(spellId)) return false;
    const evalResult = evaluateSolutionKind(game, s, puzzle, { spellId });
    return evalResult.available;
  });
}

export function trySpellSolveFeature(game, featureId, spellId) {
  const solutions = getSpellSolutionsForFeature(game, featureId, spellId);
  if (!solutions.length) return null;
  return applySolutionImmediate(game, getPuzzleByFeature(featureId).id, solutions[0].id);
}
