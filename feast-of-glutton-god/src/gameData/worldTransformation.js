/**
 * Regional world transformation — abundance visibly reshapes the continent.
 * Point-based levels (0–5) stack with narrative depth (story-flag gates) on
 * gorgara_cradle, ancient_temple, and gilded_citadel.
 */
import { getAbundanceSpread } from './abundanceSpread.js';
import { getRegion } from './regions.js';
import { getNpcsInRegion } from './npcs.js';
import { getNpcState, applyNpcState } from './player.js';
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

export const NARRATIVE_DEPTH_REGIONS = new Set([
  'gorgara_cradle',
  'ancient_temple',
  'gilded_citadel',
]);

export const NARRATIVE_DEPTH_LABELS = {
  gorgara_cradle: {
    4: 'The Goddess Breathes Here',
    5: 'Divine Locale',
  },
  ancient_temple: {
    4: 'The Temple Blooms',
    5: 'First True Altar',
  },
  gilded_citadel: {
    4: 'The Cathedral Bends',
    5: 'Involuntary Feasts',
  },
};

/** World flags set on first visit to key late-game regions. */
export const REGION_VISIT_FLAGS = {
  barrow_deeps: 'barrow_deeps_explored',
  gilded_citadel_inner: 'citadel_inner_entered',
  divine_plane_vestibule: 'vestibule_crossed',
};

/** Spells that manifest the Fat Goddess in the cradle (narrative depth 5). */
export const GORGARA_MANIFEST_SPELLS = new Set([
  'gorgaras_awakening',
  'apotheosis_feast',
]);

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

/**
 * Story-flag narrative depth (0–5) for the three arc regions.
 * Depth 4–5 overlay point-based transformation with scripted world states.
 */
export function getNarrativeDepth(game, regionId) {
  const flags = game?.worldFlags ?? {};
  const level = game?.player?.level ?? 1;

  switch (regionId) {
    case 'gorgara_cradle':
      if (flags.gorgara_manifest) return 5;
      if (flags.replacementGoddess) return 4;
      return 0;
    case 'ancient_temple':
      if (flags.barrow_voice_complete) return 5;
      if (flags.temple_bloomed && flags.temple_sanctuary_mercy) return 4;
      return 0;
    case 'gilded_citadel':
      if (flags.citadel_inner_entered) return 5;
      if (flags.defeated_champion_aurelan && level >= 13) return 4;
      return 0;
    default:
      return 0;
  }
}

export function getNarrativeDepthLabel(regionId, depth) {
  return NARRATIVE_DEPTH_LABELS[regionId]?.[depth] ?? null;
}

/** Effective presentation level — points and narrative depth both count. */
export function getEffectiveTransformLevel(game, regionId) {
  const points = getRegionTransformationPoints(game, regionId);
  const { current } = getTransformationLevel(points);
  const narrative = getNarrativeDepth(game, regionId);
  return Math.max(current.level, narrative);
}

export function getRegionTransformation(game, regionId) {
  const points = getRegionTransformationPoints(game, regionId);
  const { current, next } = getTransformationLevel(points);
  const narrativeDepth = getNarrativeDepth(game, regionId);
  const effectiveLevel = Math.max(current.level, narrativeDepth);
  const pct = next
    ? Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
    : 100;
  return {
    regionId,
    points,
    level: current,
    effectiveLevel,
    narrativeDepth,
    narrativeLabel: getNarrativeDepthLabel(regionId, narrativeDepth),
    next,
    pct,
    flags: ensureTransformationState(game)[regionId]?.flags ?? {},
  };
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

/** AP generation doubles in gorgara_cradle at narrative depth 5. */
export function getRegionApMultiplier(game, regionId = game?.region) {
  if (regionId === 'gorgara_cradle' && getNarrativeDepth(game, regionId) >= 5) {
    return 2;
  }
  return 1;
}

/** Minimum corruption for NPCs in regions at narrative depth 5 (cradle). */
export function getRegionCorruptionFloor(game, regionId) {
  if (regionId === 'gorgara_cradle' && getNarrativeDepth(game, regionId) >= 5) {
    return 80;
  }
  return 0;
}

export function applyRegionNarrativeEffects(game, regionId) {
  const floor = getRegionCorruptionFloor(game, regionId);
  if (floor <= 0) return;
  for (const npc of getNpcsInRegion(regionId, game)) {
    const state = getNpcState(game, npc);
    if ((state.corruption ?? 0) < floor) {
      applyNpcState(game, npc.id, { corruption: floor });
    }
  }
}

/** Record region visit flags and apply narrative depth side effects. */
export function recordRegionVisit(game, regionId) {
  if (!game.worldFlags) game.worldFlags = {};
  const visitFlag = REGION_VISIT_FLAGS[regionId];
  if (visitFlag) {
    game.worldFlags[visitFlag] = true;
  }
  applyRegionNarrativeEffects(game, regionId);
  return visitFlag ? game.worldFlags[visitFlag] : null;
}

/** Set gorgara_manifest when a goddess-manifest spell is cast in the cradle. */
export function recordGorgaraManifestCast(game, spellId, regionId = game?.region) {
  if (regionId !== 'gorgara_cradle') return false;
  if (!GORGARA_MANIFEST_SPELLS.has(spellId)) return false;
  game.worldFlags = game.worldFlags ?? {};
  if (game.worldFlags.gorgara_manifest) return false;
  game.worldFlags.gorgara_manifest = true;
  applyRegionNarrativeEffects(game, regionId);
  return true;
}

export function getRegionPresentation(game, regionId) {
  const base = getRegion(regionId);
  const transform = getRegionTransformation(game, regionId);
  const globalSpread = getAbundanceSpread(game);
  const level = transform.effectiveLevel;
  const narrativeDepth = transform.narrativeDepth;

  let desc = base.desc;
  if (level >= 1) {
    const narrativeKey = narrativeDepth >= 4
      ? `transformation.region.${regionId}.narrative.${narrativeDepth}`
      : null;
    const standardKey = `transformation.region.${regionId}.${level}`;

    desc = renderWorldText(narrativeKey ?? standardKey, game, {
      globals: {
        regionName: base.name,
        transformLabel: transform.narrativeLabel ?? transform.level.label,
        narrativeDepth,
        spread: globalSpread,
      },
      fallback: renderWorldText(standardKey, game, {
        globals: {
          regionName: base.name,
          transformLabel: transform.level.label,
          narrativeDepth,
          spread: globalSpread,
        },
        fallback: `${base.desc} ${transform.narrativeLabel ?? transform.level.desc}`,
      }),
    });
  }

  return {
    ...base,
    desc,
    transformation: transform,
    opportunities: getTransformationOpportunities(game, regionId, level, narrativeDepth),
  };
}

function getTransformationOpportunities(game, regionId, level, narrativeDepth = 0) {
  const opps = [];
  if (level >= 2) opps.push({ id: 'feast_halls', label: 'Public feast halls opening' });
  if (level >= 3) opps.push({ id: 'weakened_purity', label: 'Inquisition patrols weakened' });
  if (level >= 4) opps.push({ id: 'growth_fashion', label: 'Growth celebrated openly' });
  if (level >= 5) opps.push({ id: 'cultural_shift', label: 'Regional culture transformed' });
  if (narrativeDepth >= 4) {
    opps.push({
      id: `narrative_${narrativeDepth}`,
      label: getNarrativeDepthLabel(regionId, narrativeDepth) ?? 'Story transformation',
    });
  }
  if (regionId === 'gorgara_cradle' && narrativeDepth >= 5) {
    opps.push({ id: 'ap_doubled', label: 'AP generation doubled here' });
  }
  if (regionId === 'ancient_temple' && narrativeDepth >= 5) {
    opps.push({ id: 'barrow_passage', label: 'Passage to the Barrow Deeps open' });
  }
  return opps;
}

export function getContinentTransformationSummary(game) {
  const state = ensureTransformationState(game);
  const regions = Object.keys(state);
  const transformed = regions.filter((id) => getRegionTransformation(game, id).effectiveLevel >= 5).length;
  const avgPoints = regions.length
    ? regions.reduce((s, id) => s + (state[id]?.points ?? 0), 0) / regions.length
    : 0;
  return { regionsTracked: regions.length, fullyTransformed: transformed, avgPoints };
}
