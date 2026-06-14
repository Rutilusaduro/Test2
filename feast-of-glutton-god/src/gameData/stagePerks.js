/**
 * Size stage perks — mechanical and narrative consequences per stage band.
 * Integrates with combat, growth, and overworld systems.
 */
import { getStage } from './stages.js';

export const STAGE_PERKS = [
  {
    minStage: 0,
    label: 'Lithe Vessel',
    combat: { reachBonus: 0, damageBonus: 0, acBonus: 0 },
    social: { flirtBonus: 0 },
    desc: 'Agile and light — abundance has only begun to gather.',
  },
  {
    minStage: 2,
    label: 'Softening Grace',
    combat: { reachBonus: 0, damageBonus: 0, acBonus: 0 },
    social: { flirtBonus: 1 },
    desc: 'Curves bloom with charm — social growth magic lands easier.',
  },
  {
    minStage: 4,
    label: 'Plush Presence',
    combat: { reachBonus: 0, damageBonus: 1, acBonus: 1 },
    social: { flirtBonus: 1 },
    growth: { selfFeedUnlocked: true },
    puzzle: { blockPath: true, shoulderObstacle: true, skillBonus: 1 },
    desc: 'A real belly grants presence — bonus damage, self-feed in combat, and puzzle force.',
  },
  {
    minStage: 6,
    label: 'Heavy Dominion',
    combat: { reachBonus: 1, damageBonus: 2, acBonus: 2 },
    social: { flirtBonus: 2 },
    growth: { growthDamageBonus: 1 },
    puzzle: { livingBridge: true, reachHigh: true, skillBonus: 1 },
    desc: 'Mass becomes weapon — crushing melee, living bridges, and harder-to-budge presence.',
  },
  {
    minStage: 8,
    label: 'Enormous Aura',
    combat: { reachBonus: 1, damageBonus: 3, acBonus: 3 },
    social: { flirtBonus: 2 },
    growth: { bodySlamUnlocked: true, growthDamageBonus: 2 },
    puzzle: { crushObstacle: true, squeezeThrough: true, skillBonus: 2 },
    desc: 'Your size dominates the field — body slam, aura tactics, and puzzle-crushing mass.',
  },
  {
    minStage: 10,
    label: 'Divine Immensity',
    combat: { reachBonus: 2, damageBonus: 4, acBonus: 4 },
    social: { flirtBonus: 3 },
    growth: { crushingAuraUnlocked: true, growthDamageBonus: 3 },
    puzzle: { immovablePresence: true, tightSpacePenalty: true, skillBonus: 3 },
    desc: 'Near-apotheosis of flesh — crushing aura, legendary presence, and world-shaping puzzle power.',
  },
];

export function getStagePerk(character) {
  const stageId = getStage(character?.lbs ?? 80).id;
  let perk = STAGE_PERKS[0];
  for (const p of STAGE_PERKS) {
    if (stageId >= p.minStage) perk = p;
  }
  return { ...perk, stageId };
}

export function getCombatModifiers(character) {
  const perk = getStagePerk(character);
  return perk.combat || {};
}

export function hasGrowthUnlock(character, unlockKey) {
  const perk = getStagePerk(character);
  return Boolean(perk.growth?.[unlockKey]);
}

/** Puzzle-solving capabilities unlocked by size stage. */
export function getPuzzleCapabilities(character) {
  const perk = getStagePerk(character);
  const puzzle = perk.puzzle ?? {};
  return {
    blockPath: Boolean(puzzle.blockPath),
    shoulderObstacle: Boolean(puzzle.shoulderObstacle),
    livingBridge: Boolean(puzzle.livingBridge),
    reachHigh: Boolean(puzzle.reachHigh),
    crushObstacle: Boolean(puzzle.crushObstacle),
    squeezeThrough: Boolean(puzzle.squeezeThrough),
    immovablePresence: Boolean(puzzle.immovablePresence),
    tightSpacePenalty: Boolean(puzzle.tightSpacePenalty),
    skillBonus: puzzle.skillBonus ?? 0,
    label: perk.label,
  };
}
