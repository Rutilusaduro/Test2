/**
 * Background Population — unnamed people in a region or scene.
 *
 * Lightweight aggregate system so spells can feel like they affect a living world,
 * not just named NPCs. Stores per-region density + running counts of who was affected.
 * Big effects feed into worldReactivity / rumors / region transformation points via
 * the calling code in overworldSpells.js.
 */

// ─── Density Config ──────────────────────────────────────────────────────────

export const DENSITY_LABELS = {
  low: 'a handful of people',
  medium: 'a modest crowd',
  high: 'a bustling crowd',
  crowd: 'a dense throng',
};

/** How many background individuals can be meaningfully targeted per density. */
export const DENSITY_MAX_TARGETS = {
  low: 1,
  medium: 3,
  high: 5,
  crowd: 10,
};

/** Default background population data keyed by regionId. */
const REGION_BG_DEFAULTS = {
  market_square:        { density: 'crowd',  mood: 'busy',       description: 'merchants and shoppers' },
  harvest_hearth:       { density: 'medium', mood: 'relaxed',    description: 'villagers and travelers' },
  fertile_heartlands:   { density: 'low',    mood: 'peaceful',   description: 'farmers and wanderers' },
  gorgara_cradle:       { density: 'low',    mood: 'reverent',   description: 'pilgrims and devotees' },
  ancient_temple:       { density: 'low',    mood: 'eerie',      description: 'scholars and scavengers' },
  northern_marches:     { density: 'low',    mood: 'watchful',   description: 'border soldiers and traders' },
  sapphire_coast:       { density: 'medium', mood: 'refined',    description: 'nobles and their retinues' },
  iron_peak_hold:       { density: 'medium', mood: 'boisterous', description: 'dwarves and miners' },
  ember_duchy:          { density: 'medium', mood: 'formal',     description: 'courtiers and functionaries' },
  gilded_citadel:       { density: 'high',   mood: 'zealous',    description: 'worshippers and clergy' },
  barrow_deeps:         { density: 'low',    mood: 'grim',       description: 'wandering shades and treasure-hunters' },
  gilded_citadel_inner: { density: 'low',    mood: 'sacred',     description: 'high clergy' },
  divine_plane_vestibule: { density: 'low',  mood: 'awed',       description: 'planar travelers' },
  eternal_feast_hall:   { density: 'high',   mood: 'ecstatic',   description: 'feasters without end' },
};

// ─── Ensure / Get ────────────────────────────────────────────────────────────

export function ensureBackgroundPop(game) {
  if (!game.worldFlags) game.worldFlags = {};
  if (!game.worldFlags.backgroundPop) game.worldFlags.backgroundPop = {};
  return game.worldFlags.backgroundPop;
}

/**
 * Get (or lazily create) the background population record for a region.
 */
export function getBackgroundPopulation(game, regionId) {
  const pop = ensureBackgroundPop(game);
  if (!pop[regionId]) {
    const def = REGION_BG_DEFAULTS[regionId] ?? { density: 'low', mood: 'neutral', description: 'passersby' };
    pop[regionId] = {
      regionId,
      density: def.density,
      mood: def.mood,
      description: def.description,
      affectedCount: 0,     // total individuals touched by any effect
      affectedGrowth: 0,    // individuals who gained weight
      affectedRestrained: 0,
      affectedSuggestion: 0,
      recentEvents: [],
    };
  }
  return pop[regionId];
}

// ─── Effect Application ──────────────────────────────────────────────────────

/**
 * Apply a spell effect to the background population of a region.
 * Returns { count, affectedPop, lines } — lines are narrative strings for the log.
 *
 * @param {object} game
 * @param {string} regionId
 * @param {'growth'|'restrained'|'suggestion'|'feed'} effectType
 * @param {{ count?: number, pullDepth?: string, day?: number }} opts
 */
export function affectBackgroundPop(game, regionId, effectType, opts = {}) {
  const pop = getBackgroundPopulation(game, regionId);
  const maxTargets = DENSITY_MAX_TARGETS[pop.density] ?? 1;
  const count = Math.min(opts.count ?? 1, maxTargets);
  const lines = [];

  pop.affectedCount += count;

  const ev = { type: effectType, count, day: opts.day ?? (game.day ?? 1) };

  switch (effectType) {
    case 'growth':
      pop.affectedGrowth += count;
      lines.push(describeGrowthEffect(pop, count, opts));
      break;
    case 'restrained':
      pop.affectedRestrained += count;
      lines.push(describeRestraintEffect(pop, count, opts));
      break;
    case 'suggestion':
      pop.affectedSuggestion += count;
      lines.push(describeSuggestionEffect(pop, count, opts));
      break;
    case 'feed':
      pop.affectedGrowth += count;
      lines.push(describeFeedEffect(pop, count, opts));
      break;
    default:
      break;
  }

  pop.recentEvents.push(ev);
  if (pop.recentEvents.length > 10) pop.recentEvents = pop.recentEvents.slice(-10);

  return { count, affectedPop: pop, lines };
}

// ─── Observe / Look Around ───────────────────────────────────────────────────

/**
 * Generate an "observe the crowd" description based on accumulated effects.
 * Surfaces state to the narrator for world-alive prose.
 */
export function observeBackgroundPop(game, regionId) {
  const pop = getBackgroundPopulation(game, regionId);
  const parts = [];

  const label = DENSITY_LABELS[pop.density] ?? 'people';
  parts.push(`${capitalizeFirst(label)} fill${isSingular(pop.density) ? 's' : ''} the area — ${pop.mood}, ${pop.description}.`);

  if (pop.affectedGrowth > 0) {
    const n = pop.affectedGrowth;
    parts.push(
      `${n} ${n === 1 ? 'figure looks' : 'figures look'} noticeably fuller than they should — soft in ways that weren't there before.`,
    );
  }
  if (pop.affectedRestrained > 0) {
    const n = pop.affectedRestrained;
    parts.push(
      `${n} ${n === 1 ? 'person struggles' : 'people struggle'} against an unseen force, mired and unable to flee.`,
    );
  }
  if (pop.affectedSuggestion > 0) {
    const n = pop.affectedSuggestion;
    parts.push(
      `${n} ${n === 1 ? 'individual drifts' : 'individuals drift'} toward the nearest food stall with dreamlike, helpless hunger.`,
    );
  }

  return parts.join(' ');
}

// ─── Pseudo-Target Objects ───────────────────────────────────────────────────

/**
 * Return lightweight pseudo-target objects from the background population.
 * These can hold indulgenceStates just like named NPCs, enabling full combo resolution.
 *
 * @param {object} game
 * @param {string} regionId
 * @param {number} count — how many individuals to surface
 * @returns {Array} pseudo-target objects
 */
export function getBackgroundTargets(game, regionId, count = 1) {
  const pop = getBackgroundPopulation(game, regionId);
  const cap = Math.min(count, DENSITY_MAX_TARGETS[pop.density] ?? 1);

  if (!game.worldFlags.backgroundPopStates) game.worldFlags.backgroundPopStates = {};

  const targets = [];
  for (let i = 0; i < cap; i++) {
    const id = `bg_${regionId}_${i}`;
    if (!game.worldFlags.backgroundPopStates[id]) {
      game.worldFlags.backgroundPopStates[id] = {
        id,
        name: `${pop.description.split(' and ')[0].replace(/s$/, '')} (background)`,
        regionId,
        isBackground: true,
        indulgenceStates: [],
      };
    }
    targets.push(game.worldFlags.backgroundPopStates[id]);
  }
  return targets;
}

/**
 * Get a summary of background population state for narrator globals.
 */
export function getBackgroundPopGlobals(game, regionId) {
  const pop = getBackgroundPopulation(game, regionId);
  return {
    bgDensity: pop.density,
    bgMood: pop.mood,
    bgDescription: pop.description,
    bgAffectedGrowth: pop.affectedGrowth,
    bgAffectedRestrained: pop.affectedRestrained,
    bgAffectedSuggestion: pop.affectedSuggestion,
    bgMaxTargets: DENSITY_MAX_TARGETS[pop.density] ?? 1,
    bgHasAffected: pop.affectedCount > 0,
  };
}

// ─── Narrative Helpers ───────────────────────────────────────────────────────

function describeGrowthEffect(pop, count, opts) {
  const who = count === 1 ? 'one figure' : `${count} people`;
  return `${who} in the ${popLabel(pop)} swell${count === 1 ? 's' : ''} visibly — ${pop.description} caught in the radius.`;
}

function describeRestraintEffect(pop, count, opts) {
  const who = count === 1 ? 'one person' : `${count} people`;
  const depth = opts.pullDepth ?? 'waist';
  const depthDesc = depth === 'shoulders'
    ? 'nearly submerged, arms barely free'
    : 'mud gripping at the waist, feet pinned';
  return `${who} sink${count === 1 ? 's' : ''} into the ground — ${depthDesc}.`;
}

function describeSuggestionEffect(pop, count, opts) {
  const who = count === 1 ? 'one passerby' : `${count} passersby`;
  return `${who} pause${count === 1 ? 's' : ''}, a dazed hunger crossing ${count === 1 ? 'their' : 'their'} face — the suggestion takes root.`;
}

function describeFeedEffect(pop, count, opts) {
  const who = count === 1 ? 'one person' : `${count} people`;
  return `${who} reach${count === 1 ? 'es' : ''} absently for the nearest food, ${pop.mood} no longer — simply, helplessly hungry.`;
}

function popLabel(pop) {
  return DENSITY_LABELS[pop.density] ?? 'crowd';
}

function capitalizeFirst(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function isSingular(density) {
  return density === 'low';
}
