/**
 * Race feature mechanics — hooks into stats, saves, and skill checks.
 */
import { getRace } from './races.js';
import { getStage, lbsForStage } from './stages.js';

const GROWTH_SKILL_IDS = new Set([
  'endure_growth', 'indulge', 'seduce', 'overwhelm', 'persuade', 'perform',
]);

const GROWTH_SAVE_STATS = new Set(['con']);

export function hasRaceFeature(character, featureId) {
  const race = getRace(character.raceId);
  return race.features?.some((f) => f.id === featureId) ?? false;
}

/** Adjust size-stage stat modifiers from racial features (e.g. elf grace, halfling stability). */
export function getRaceSizeStatModifiers(character, stageId) {
  const mods = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (!character?.raceId) return mods;

  if (hasRaceFeature(character, 'graceful_expansion') && stageId >= 5) {
    mods.dex += 1;
  }

  if (hasRaceFeature(character, 'bottom_heavy_blessing') && stageId >= 5) {
    mods.str += 1;
  }

  if (hasRaceFeature(character, 'draconic_gluttony') && character.tempFlags?.draconic_gluttony) {
    mods.str += 1;
  }

  return mods;
}

export function isGrowthRelatedCheck({ skillId, stat } = {}) {
  if (skillId && GROWTH_SKILL_IDS.has(skillId)) return true;
  if (stat && GROWTH_SAVE_STATS.has(stat)) return true;
  return false;
}

/** Halfling Lucky Roll — reroll natural 1 on growth-related checks. */
export function applyRacialRollAdjustments(character, naturalRoll, context = {}, rng = Math.random) {
  if (naturalRoll !== 1) return { roll: naturalRoll, rerolled: false };

  if (hasRaceFeature(character, 'lucky_roll') && isGrowthRelatedCheck(context)) {
    const reroll = Math.floor(rng() * 20) + 1;
    return { roll: reroll, rerolled: true, feature: 'lucky_roll' };
  }

  return { roll: naturalRoll, rerolled: false };
}

/** Dwarf Stout Belly — advantage on Con saves vs growth/overindulgence. */
export function getRacialSaveRollMode(character, stat) {
  if (hasRaceFeature(character, 'stout_belly') && stat === 'con') {
    return { advantage: true, disadvantage: false };
  }
  return { advantage: false, disadvantage: false };
}

/** Tiefling fire resistance (flavor hook for future damage types). */
export function hasFireResistance(character) {
  return hasRaceFeature(character, 'hellish_appetite');
}

export function getRaceDisplayName(character) {
  const race = getRace(character?.raceId);
  return race.name;
}

export function formatRaceFeatures(raceId) {
  const race = getRace(raceId);
  return race.features?.map((f) => `${f.name}: ${f.desc}`) ?? [];
}

export function getStartLbsWithRace(baseLbs, raceId) {
  const race = getRace(raceId);
  if (!race.startStageBonus) return baseLbs;
  const current = getStage(baseLbs).id;
  const target = Math.min(current + race.startStageBonus, 11);
  return lbsForStage(target);
}
