/**
 * NPC-initiated puzzle hints — Craving+ bond unlocks guidance on regional mysteries.
 */
import { getTier } from './relationships.js';
import { getPuzzlesInRegion } from './puzzles/registry.js';
import { isPuzzleSolved, getAvailableSolutions } from './puzzleEngine.js';
import { getFeature } from './regionFeatures.js';
import { renderPuzzleText } from '../textEngine/scenes/puzzles/index.js';

const NPC_HINT_AFFINITY = {
  elara_inn: ['cellar_abundance_vault', 'hearth_windmill_jam', 'hearth_shrine_bell'],
  mira_bard: ['hearth_shrine_bell', 'vesperia_garden_gate', 'market_spice_vault'],
  greta_smith: ['hearth_windmill_jam', 'collapsed_feast_arch', 'temple_sealed_hall'],
  lira_priestess: ['choked_ravine', 'dryad_thorn_hedge', 'sacred_pool_rite'],
  thalia_witch: ['sacred_pool_rite', 'cradle_hunger_altar'],
  sylvie_scholar: ['collapsed_feast_arch', 'temple_sealed_hall', 'temple_hunger_font'],
  vesperia: ['vesperia_garden_gate', 'market_spice_vault'],
  baker_sylvie: ['market_spice_vault', 'vesperia_garden_gate'],
  harvest_priestess: ['dryad_thorn_hedge', 'hearth_shrine_bell'],
};

function pickHintPuzzle(game, npcId) {
  const affinity = NPC_HINT_AFFINITY[npcId] ?? [];
  const unsolved = getPuzzlesInRegion(game.region).filter((p) => !isPuzzleSolved(game, p.id));
  if (!unsolved.length) return null;

  const preferred = unsolved.find((p) => affinity.includes(p.id));
  return preferred ?? unsolved[0];
}

function pickHintSolution(game, puzzle, tierId) {
  const solutions = getAvailableSolutions(game, puzzle.id);
  const locked = solutions.filter((s) => !s.available && s.hint);
  const open = solutions.filter((s) => s.available);

  if (tierId >= 5 && open.length) {
    return { solution: open[0], specificity: 'devoted' };
  }
  if (tierId >= 4 && locked.length) {
    return { solution: locked[0], specificity: 'craving' };
  }
  if (tierId >= 4 && open.length) {
    return { solution: open[0], specificity: 'craving' };
  }
  return null;
}

/**
 * @returns {{ text: string, puzzleId: string } | null}
 */
export function getNpcPuzzleHint(game, npc) {
  const tier = getTier(npc.relationship || 0);
  if (tier.id < 4) return null;

  const puzzle = pickHintPuzzle(game, npc.id);
  if (!puzzle) return null;

  const feature = getFeature(puzzle.featureId);
  const pick = pickHintSolution(game, puzzle, tier.id);
  if (!pick) return null;

  const textKey = tier.id >= 5
    ? 'puzzle.hint.devoted'
    : 'puzzle.hint.craving';

  const text = renderPuzzleText(textKey, game, {
    globals: {
      npcName: npc.name,
      featureName: feature?.name ?? puzzle.title,
      puzzleTitle: puzzle.title,
      solutionLabel: pick.solution.label,
      solutionHint: pick.solution.hint ?? pick.solution.label,
    },
  });

  return { text, puzzleId: puzzle.id, specificity: pick.specificity };
}

export function appendPuzzleHintToTalk(result, game, npc) {
  const hint = getNpcPuzzleHint(game, npc);
  if (!hint) return result;
  result.text = `${result.text}\n\n---\n♥ ${hint.text}`;
  if (result.narrative) result.narrative += `\n\n---\n♥ ${hint.text}`;
  result.puzzleHint = hint;
  return result;
}
