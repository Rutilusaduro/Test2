/**
 * Regional world transformation — abundance visibly reshapes the continent.
 */
import { getAbundanceSpread } from './abundanceSpread.js';
import { getRegion } from './regions.js';
import { renderWorldText } from '../textEngine/scenes/world/transformation.js';
import { raiseDivineAttention } from './divineAttention.js';

export const TRANSFORMATION_LEVELS = [
  { level: 0, label: 'Untouched', minPoints: 0, desc: 'Restrictive norms still hold — abundance is a rumor.' },
  { level: 1, label: 'Stirring', minPoints: 15, desc: 'Kitchens run later. Waistlines soften in whispers.' },
  { level: 2, label: 'Softening', minPoints: 40, desc: 'Fashion loosens. Feasting becomes fashionable.' },
  { level: 3, label: 'Feast-Blessed', minPoints: 80, desc: 'Temples tolerate indulgence. Markets swell with appetite.' },
  { level: 4, label: 'Overflowing', minPoints: 140, desc: 'Inquisition patrols weaken. Fullness is public joy.' },
  { level: 5, label: 'Transformed', minPoints: 220, desc: 'The region belongs to fullness — culture, body, and street.' },
];

export const TRANSFORMATION_AWARDS = {
  npc_feed: 2,
  npc_bless: 3,
  npc_feast: 6,
  npc_growth_stage: 4,
  overworld_spell_growth: 3,
  puzzle_solved: 5,
  quest_regional: 15,
  institution_action: 8,
  abundance_ritual: 12,
};

export function ensureTransformationState(game) {
  if (!game.worldFlags) game.worldFlags = {};
  if (!game.worldFlags.regionTransformation) {
    game.worldFlags.regionTransformation = {};
  }
  return game.worldFlags.regionTransformation;
}

export function getRegionTransformationPoints(game, regionId) {
  const state = ensureTransformationState(game);
  return state[regionId]?.points ?? 0;
}

export function getTransformationLevel(points) {
  let current = TRANSFORMATION_LEVELS[0];
  for (const t of TRANSFORMATION_LEVELS) {
    if (points >= t.minPoints) current = t;
  }
  const next = TRANSFORMATION_LEVELS.find((t) => t.minPoints > points) ?? null;
  return { current, next, points };
}

export function getRegionTransformation(game, regionId) {
  const points = getRegionTransformationPoints(game, regionId);
  const { current, next } = getTransformationLevel(points);
  const pct = next
    ? Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
    : 100;
  return { regionId, points, level: current, next, pct, flags: ensureTransformationState(game)[regionId]?.flags ?? {} };
}

export function awardRegionTransformation(game, regionId, source, amountOverride) {
  if (!regionId) return { gained: 0 };
  const state = ensureTransformationState(game);
  const gained = amountOverride ?? TRANSFORMATION_AWARDS[source] ?? 0;
  if (gained <= 0) return { gained: 0 };

  const rec = state[regionId] ?? { points: 0, flags: {} };
  const oldLevel = getTransformationLevel(rec.points).current.level;
  rec.points += gained;
  state[regionId] = rec;

  const newLevel = getTransformationLevel(rec.points).current.level;
  const levelUp = newLevel > oldLevel;

  let message = null;
  let divineAttention = null;
  if (levelUp) {
    message = renderWorldText('transformation.level_up', game, {
      globals: {
        regionName: getRegion(regionId).name,
        levelLabel: getTransformationLevel(rec.points).current.label,
      },
    });
    divineAttention = raiseDivineAttention(game, 'region_flip');
  }

  return { gained, total: rec.points, levelUp, level: newLevel, message, divineAttention };
}

export function getRegionPresentation(game, regionId) {
  const base = getRegion(regionId);
  const transform = getRegionTransformation(game, regionId);
  const globalSpread = getAbundanceSpread(game);

  let desc = base.desc;
  if (transform.level.level >= 1) {
    desc = renderWorldText(`transformation.region.${regionId}.${transform.level.level}`, game, {
      globals: {
        regionName: base.name,
        transformLabel: transform.level.label,
        spread: globalSpread,
      },
      fallback: `${base.desc} ${transform.level.desc}`,
    });
  }

  return {
    ...base,
    desc,
    transformation: transform,
    opportunities: getTransformationOpportunities(game, regionId, transform.level.level),
  };
}

function getTransformationOpportunities(game, regionId, level) {
  const opps = [];
  if (level >= 2) opps.push({ id: 'feast_halls', label: 'Public feast halls opening' });
  if (level >= 3) opps.push({ id: 'weakened_purity', label: 'Inquisition patrols weakened' });
  if (level >= 4) opps.push({ id: 'growth_fashion', label: 'Growth celebrated openly' });
  if (level >= 5) opps.push({ id: 'cultural_shift', label: 'Regional culture transformed' });
  return opps;
}

export function getContinentTransformationSummary(game) {
  const state = ensureTransformationState(game);
  const regions = Object.keys(state);
  const transformed = regions.filter((id) => getRegionTransformation(game, id).level.level >= 5).length;
  const avgPoints = regions.length
    ? regions.reduce((s, id) => s + (state[id]?.points ?? 0), 0) / regions.length
    : 0;
  return { regionsTracked: regions.length, fullyTransformed: transformed, avgPoints };
}
