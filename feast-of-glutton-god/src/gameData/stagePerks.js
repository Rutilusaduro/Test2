/**
 * Stage perks — mechanical bands across the full Human → Tarrasque Matriarch ladder.
 */
import { getStage } from './stages.js';

export const STAGE_PERKS = [
  {
    minStage: 0, label: 'Lithe Vessel',
    combat: { reachBonus: 0, damageBonus: 0, acBonus: 0 },
    social: { flirtBonus: 0 },
    desc: 'Agile and light — abundance has only begun to gather.',
  },
  {
    minStage: 2, label: 'Softening Grace',
    combat: { reachBonus: 0, damageBonus: 0, acBonus: 0 },
    social: { flirtBonus: 1 },
    desc: 'Curves bloom with charm — social growth magic lands easier.',
  },
  {
    minStage: 4, label: 'Plush Presence',
    combat: { reachBonus: 0, damageBonus: 1, acBonus: 1 },
    social: { flirtBonus: 1 },
    growth: { selfFeedUnlocked: true },
    puzzle: { blockPath: true, shoulderObstacle: true, skillBonus: 1 },
    desc: 'Massive presence — self-feed in combat, puzzle force, real belly authority.',
  },
  {
    minStage: 6, label: 'Giant Dominion',
    combat: { reachBonus: 1, damageBonus: 2, acBonus: 2 },
    social: { flirtBonus: 2 },
    growth: { growthDamageBonus: 1 },
    puzzle: { livingBridge: true, reachHigh: true, skillBonus: 1 },
    influence: { growthDecreeBonus: 1 },
    desc: 'Giant-scale power — crushing melee, bridges of flesh, influence stirs.',
  },
  {
    minStage: 8, label: 'Mythic Aura',
    combat: { reachBonus: 1, damageBonus: 3, acBonus: 3 },
    social: { flirtBonus: 2 },
    growth: { bodySlamUnlocked: true, growthDamageBonus: 2 },
    puzzle: { crushObstacle: true, squeezeThrough: true, skillBonus: 2 },
    influence: { growthDecreeBonus: 2, regionPresence: true },
    desc: 'Leviathan-class aura — body slam, regional presence, puzzle-crushing mass.',
  },
  {
    minStage: 10, label: 'Colossal Sovereign',
    combat: { reachBonus: 2, damageBonus: 4, acBonus: 4 },
    social: { flirtBonus: 3 },
    growth: { crushingAuraUnlocked: true, growthDamageBonus: 3 },
    puzzle: { immovablePresence: true, tightSpacePenalty: true, skillBonus: 3 },
    influence: { growthDecreeBonus: 3, institutionFounding: true },
    desc: 'Great Whale sovereignty — crushing aura, institutions bend to your hunger.',
  },
  {
    minStage: 11, label: 'Monolith Oracle',
    combat: { reachBonus: 2, damageBonus: 5, acBonus: 5 },
    social: { flirtBonus: 3 },
    growth: { crushingAuraUnlocked: true, growthDamageBonus: 4 },
    command: { delegateTravel: true, feastDecree: true },
    influence: { growthDecreeBonus: 5, cultLeadership: true },
    desc: 'Immobile monument — command play unlocks. Cults whisper your name.',
  },
  {
    minStage: 13, label: 'World Mother',
    combat: { reachBonus: 3, damageBonus: 6, acBonus: 6 },
    social: { flirtBonus: 4 },
    growth: { growthDamageBonus: 5 },
    command: { ritualProjection: true, continentDecree: true },
    influence: { growthDecreeBonus: 8, religiousFounding: true },
    desc: 'Continental matriarch — reshape culture through quiet, totalizing devotion.',
  },
  {
    minStage: 14, label: 'Tarrasque Matriarch',
    combat: { reachBonus: 3, damageBonus: 8, acBonus: 8 },
    social: { flirtBonus: 5 },
    growth: { growthDamageBonus: 6 },
    command: { rivalGoddess: true },
    influence: { growthDecreeBonus: 10, replacementGoddess: true },
    desc: 'Apotheosis — Gorgara\'s rival. The continent fattens in your shadow.',
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

export function hasCommandUnlock(character, unlockKey) {
  const perk = getStagePerk(character);
  return Boolean(perk.command?.[unlockKey]);
}

export function hasInfluenceUnlock(character, unlockKey) {
  const perk = getStagePerk(character);
  return Boolean(perk.influence?.[unlockKey]);
}

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
