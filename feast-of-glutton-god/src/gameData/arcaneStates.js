/**
 * Indulgence States — arcane/abundance conditions on creatures, objects, features, and areas.
 * Phase 1: foundation states for the 5 foundation spells (Mage Hand, Magic Mouth,
 * Stone Shape, Suggestion, Quicksand). Designed to be extensible.
 *
 * States persist in target.indulgenceStates (array). Areas/locations use
 * game.worldFlags.areaStates[regionId].indulgenceStates.
 */

// ─── State Definitions ───────────────────────────────────────────────────────

/**
 * Each state def describes the template for a condition.
 * onTimeProcess(state, timeType) → { event, narrative } | null
 * interactWith(state, spellOrAction) → { bonus, desc, effect } | null
 */
export const ARCANE_STATE_DEFS = {

  restrained: {
    id: 'restrained',
    name: 'Restrained',
    desc: 'Movement is 0. Attacks and DEX saves at disadvantage.',
    targetTypes: ['creature', 'background'],
    durationType: 'until_triggered',
    properties: {
      restrained: true,
      movementPenalty: 'full',
      attackDisadvantage: true,
      saveDexDisadvantage: true,
      // suggestionBonus: allows Suggestion to trigger immediately with +50% growth
      suggestionBonus: true,
    },
  },

  quicksand_restrained: {
    id: 'quicksand_restrained',
    name: 'Quicksand Trapped',
    desc: 'Sinking in magical quicksand — restrained, pulled deeper over time.',
    targetTypes: ['creature', 'background'],
    durationType: 'until_long_rest',
    properties: {
      restrained: true,
      movementPenalty: 'full',
      pullDepth: 'waist',   // 'waist' | 'shoulders'
      attackDisadvantage: true,
      saveDexDisadvantage: true,
      suggestionBonus: true,
    },
    onTimeProcess(state, timeType) {
      // Progress: waist → shoulders on first time tick
      if (timeType === 'short_rest' || timeType === 'day') {
        if (state.properties.pullDepth === 'waist') {
          state.properties.pullDepth = 'shoulders';
          return {
            event: 'pull_deeper',
            narrative: 'The quicksand tightens its grip — they sink to the shoulders, barely able to raise their arms.',
          };
        }
      }
      return null;
    },
  },

  bound_calorie_transfer: {
    id: 'bound_calorie_transfer',
    name: 'Calorie Bond',
    desc: 'Feeding the bound object magically transfers growth to the linked creature.',
    targetTypes: ['object', 'feature'],
    durationType: 'until_long_rest',
    properties: {
      transferTarget: null,   // id/name of linked creature or NPC
      growthTransferRate: 1.0,
      feedCount: 0,           // number of times triggered so far
      maxFeeds: 3,            // cap to prevent infinite abuse
    },
    interactWith(state, spellOrAction) {
      if (spellOrAction.id === 'mage_hand') {
        return {
          bonus: 'mage_hand_feed',
          desc: 'Mage Hand can trigger feeding on this bound object from range, transferring growth to the linked target.',
          effect: { growth: 1, transferTarget: state.properties.transferTarget },
        };
      }
      return null;
    },
  },

  suggestion_active: {
    id: 'suggestion_active',
    name: 'Suggestion Planted',
    desc: 'A magical compulsion nudges the target toward indulgence.',
    targetTypes: ['creature', 'background'],
    durationType: 'until_triggered',
    properties: {
      suggestionText: '',     // the planted compulsion
      dc: 14,
      growthOnResolve: 1,     // stages when triggered
      resolved: false,
      // Doubles growthOnResolve when target is also restrained/quicksand_restrained
      restraintBonusApplied: false,
    },
    onTimeProcess(state, timeType) {
      if (timeType === 'long_rest' && !state.properties.resolved) {
        // Suggestion fades without resolution on long rest
        return {
          event: 'suggestion_decayed',
          narrative: 'The magical suggestion fades, unresolved — the window of compulsion has passed.',
        };
      }
      return null;
    },
  },

  shaped_stone: {
    id: 'shaped_stone',
    name: 'Stone Shape',
    desc: 'A creation of shaped stone or earth — table, basin, cuffs, or small structure.',
    targetTypes: ['object', 'feature', 'area'],
    durationType: 'permanent',
    properties: {
      form: 'table',              // 'table' | 'basin' | 'cuffs' | 'structure'
      holdsLiquid: false,         // basin can hold Grease, milk, potions later
      restraining: false,         // cuffs apply restrained state to a creature
      ediblePotential: false,     // can be transmuted into food later
      potentialForTransmute: true,// hooks for future Transmute spell
      boundTarget: null,          // which creature the cuffs are on, if any
    },
  },

  mage_hand_active: {
    id: 'mage_hand_active',
    name: 'Mage Hand',
    desc: 'A spectral hand hovers, ready to feed or manipulate at range.',
    targetTypes: ['area'],
    durationType: 'consumed',
    properties: {
      range: 30,
      canFeed: true,
      canTriggerBound: true,
      targetId: null,     // who the hand is attending to
    },
  },

};

// ─── State Manager ───────────────────────────────────────────────────────────

function ensureStates(target) {
  if (!Array.isArray(target.indulgenceStates)) target.indulgenceStates = [];
}

/**
 * Apply a state to a target (creature, object, area object, background pseudo-target).
 * If the state already exists it refreshes/merges properties rather than double-stacking.
 * @returns {object} the applied state
 */
export function applyIndulgenceState(target, stateId, overrides = {}) {
  ensureStates(target);
  const def = ARCANE_STATE_DEFS[stateId];
  if (!def) {
    console.warn(`[arcaneStates] Unknown state: ${stateId}`);
    return null;
  }

  const existing = target.indulgenceStates.find((s) => s.id === stateId);
  if (existing) {
    // Refresh: merge override properties on top of existing
    if (overrides.properties) Object.assign(existing.properties, overrides.properties);
    return existing;
  }

  const state = {
    id: stateId,
    name: def.name,
    desc: def.desc,
    durationType: overrides.durationType ?? def.durationType,
    properties: { ...def.properties, ...(overrides.properties ?? {}) },
    appliedAt: overrides.appliedAt ?? null,
    appliedBy: overrides.appliedBy ?? null,
  };

  target.indulgenceStates.push(state);
  if (def.onApply) def.onApply(state, target, overrides);
  return state;
}

export function hasIndulgenceState(target, stateId) {
  return Boolean(target?.indulgenceStates?.some((s) => s.id === stateId));
}

export function getIndulgenceState(target, stateId) {
  return target?.indulgenceStates?.find((s) => s.id === stateId) ?? null;
}

export function removeIndulgenceState(target, stateId) {
  if (!target?.indulgenceStates) return false;
  const before = target.indulgenceStates.length;
  target.indulgenceStates = target.indulgenceStates.filter((s) => s.id !== stateId);
  return target.indulgenceStates.length < before;
}

// ─── Time Processing ─────────────────────────────────────────────────────────

/**
 * Process indulgence states on a single target for a time tick.
 * Returns events for the caller to handle (no growth applied here).
 *
 * @param {object} target
 * @param {'long_rest'|'short_rest'|'day'} timeType
 * @returns {{ events: Array, removedIds: string[] }}
 */
export function processTargetStates(target, timeType) {
  if (!target?.indulgenceStates?.length) return { events: [], removedIds: [] };

  const events = [];
  const toRemove = [];

  for (const state of [...target.indulgenceStates]) {
    const def = ARCANE_STATE_DEFS[state.id];

    if (state.durationType === 'until_long_rest' && timeType === 'long_rest') {
      toRemove.push(state.id);
      events.push({ type: 'state_expired', stateId: state.id, targetId: target.id ?? target.characterId });
      continue;
    }

    if (state.durationType === 'consumed' && state.properties.consumed) {
      toRemove.push(state.id);
      continue;
    }

    if (def?.onTimeProcess) {
      const result = def.onTimeProcess(state, timeType);
      if (result) {
        events.push({
          ...result,
          stateId: state.id,
          targetId: target.id ?? target.characterId,
        });
        // suggestion_decayed → remove it
        if (result.event === 'suggestion_decayed') toRemove.push(state.id);
      }
    }
  }

  for (const id of toRemove) removeIndulgenceState(target, id);

  return { events, removedIds: toRemove };
}

/**
 * Process all indulgence states across the whole game world.
 * Call this during long rest alongside decaySatiationForGame().
 *
 * @param {object} game
 * @param {'long_rest'|'short_rest'|'day'} timeType
 * @returns {{ allEvents: Array, narrativeLines: string[] }}
 */
export function processIndulgenceStates(game, timeType) {
  const allEvents = [];
  const narrativeLines = [];

  const processOne = (target) => {
    if (!target) return;
    const { events } = processTargetStates(target, timeType);
    for (const ev of events) {
      allEvents.push(ev);
      if (ev.narrative) narrativeLines.push(ev.narrative);
    }
  };

  processOne(game.player);
  for (const c of game.party ?? []) processOne(c);

  if (game.npcStates) {
    for (const npc of Object.values(game.npcStates)) processOne(npc);
  }

  if (game.worldFlags?.areaStates) {
    for (const area of Object.values(game.worldFlags.areaStates)) processOne(area);
  }

  if (game.worldFlags?.backgroundPopStates) {
    for (const pop of Object.values(game.worldFlags.backgroundPopStates)) processOne(pop);
  }

  return { allEvents, narrativeLines };
}

// ─── Combo Resolver ──────────────────────────────────────────────────────────

/**
 * Central combo resolver — called after every spell cast.
 * Checks existing states on each target for interactions with the new spell.
 * Returns triggered effects and narrative lines. Does NOT apply growth.
 *
 * @param {object} game
 * @param {object} caster
 * @param {object} spellOrAction — spell data object from spells.js
 * @param {Array}  targets       — creatures, objects, area objects, or bg pseudo-targets
 * @returns {{ combos: Array, lines: string[] }}
 */
export function resolveStateInteractions(game, caster, spellOrAction, targets) {
  const combos = [];
  const lines = [];

  for (const target of targets ?? []) {
    if (!target?.indulgenceStates?.length) continue;

    // ── Per-state interaction hooks ──────────────────────────────
    for (const state of target.indulgenceStates) {
      const def = ARCANE_STATE_DEFS[state.id];
      if (!def?.interactWith) continue;
      const result = def.interactWith(state, spellOrAction);
      if (!result) continue;
      combos.push({
        type: result.bonus ?? 'interaction',
        stateId: state.id,
        spellId: spellOrAction.id,
        targetId: target.id ?? target.characterId ?? 'unknown',
        narrative: result.desc ?? '',
        effect: result.effect ?? null,
      });
    }

    // ── Restraint + Suggestion cross-combo ───────────────────────
    // Any new spell cast in range of a restrained + suggested target
    // triggers the suggestion early with a bonus growth bump.
    const isRestrained = hasIndulgenceState(target, 'quicksand_restrained')
      || hasIndulgenceState(target, 'restrained');

    if (isRestrained && spellOrAction.id !== 'suggestion') {
      const sug = getIndulgenceState(target, 'suggestion_active');
      if (sug && !sug.properties.resolved) {
        sug.properties.resolved = true;
        const base = sug.properties.growthOnResolve ?? 1;
        const bonus = Math.ceil(base * 1.5);
        sug.properties.restraintBonusApplied = true;
        combos.push({
          type: 'suggestion_restraint_combo',
          stateId: 'suggestion_active',
          spellId: spellOrAction.id,
          targetId: target.id ?? target.characterId ?? 'unknown',
          targetName: target.name ?? 'the target',
          narrative: `Restrained and compelled, the planted suggestion ignites — indulgence becomes inevitable.`,
          effect: { growth: bonus, source: 'combo' },
        });
        lines.push(
          `✦ Combo — Restraint + Suggestion: ${target.name ?? 'the target'}'s compulsion ignites with ${bonus} stage${bonus > 1 ? 's' : ''} of inevitable growth!`,
        );
      }
    }

    // ── Mage Hand → Calorie Bond remote feed ────────────────────
    if (spellOrAction.id === 'mage_hand' && hasIndulgenceState(target, 'bound_calorie_transfer')) {
      const bond = getIndulgenceState(target, 'bound_calorie_transfer');
      if (bond && bond.properties.feedCount < (bond.properties.maxFeeds ?? 3)) {
        bond.properties.feedCount = (bond.properties.feedCount || 0) + 1;
        combos.push({
          type: 'remote_feed',
          stateId: 'bound_calorie_transfer',
          spellId: 'mage_hand',
          targetId: bond.properties.transferTarget,
          narrative: 'Your spectral hand activates the Calorie Bond — growth flows to the linked creature.',
          effect: { growth: 1, feed: 1, transferTarget: bond.properties.transferTarget },
        });
        lines.push(`✦ Mage Hand triggers Calorie Bond — magical feeding reaches the linked target remotely.`);
      }
    }
  }

  return { combos, lines };
}

// ─── Area State Helpers ──────────────────────────────────────────────────────

export function ensureAreaStates(game) {
  if (!game.worldFlags) game.worldFlags = {};
  if (!game.worldFlags.areaStates) game.worldFlags.areaStates = {};
  return game.worldFlags.areaStates;
}

export function getAreaState(game, regionId) {
  const areas = ensureAreaStates(game);
  if (!areas[regionId]) areas[regionId] = { id: regionId, indulgenceStates: [] };
  return areas[regionId];
}

export function applyAreaState(game, regionId, stateId, overrides = {}) {
  const area = getAreaState(game, regionId);
  return applyIndulgenceState(area, stateId, { ...overrides, appliedAt: game.day ?? null });
}

export function hasAreaState(game, regionId, stateId) {
  const area = game.worldFlags?.areaStates?.[regionId];
  return hasIndulgenceState(area, stateId);
}

/**
 * Get a summary of active indulgence states on a target, for narrator context.
 */
export function getStateContextGlobals(target) {
  if (!target?.indulgenceStates?.length) return {};
  const ids = target.indulgenceStates.map((s) => s.id);
  return {
    isRestrained: ids.includes('restrained') || ids.includes('quicksand_restrained'),
    isQuicksandTrapped: ids.includes('quicksand_restrained'),
    hasSuggestion: ids.includes('suggestion_active'),
    hasCalorieBond: ids.includes('bound_calorie_transfer'),
    hasShapedStone: ids.includes('shaped_stone'),
    pullDepth: target.indulgenceStates.find((s) => s.id === 'quicksand_restrained')?.properties.pullDepth ?? null,
    activeStateCount: target.indulgenceStates.length,
    activeStateIds: ids,
  };
}
