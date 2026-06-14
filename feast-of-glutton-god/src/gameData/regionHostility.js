/**
 * Per-region hostility (0–100, hidden) — wary → tense → crackdown.
 * Consumes forced-growth signals from Prompt 3A.
 */
import { getRegion } from './regions.js';
import { raiseDivineAttentionFromHostility } from './divineAttention.js';

export const HOSTILITY_MAX = 100;

/** Severity from forced growth → hostility delta. */
export const SEVERITY_HOSTILITY = { 1: 12, 2: 20, 3: 30 };

export const HOSTILITY_TIERS = [
  { id: 0, min: 0, label: 'Calm', desc: 'The region bears your presence without alarm.' },
  { id: 1, min: 25, label: 'Wary', desc: 'Whispers follow you — neighbors watch how you touch the unwilling.' },
  { id: 2, min: 50, label: 'Tense', desc: 'Inquisition patrols stir; doors close sooner when you approach.' },
  { id: 3, min: 75, label: 'Crackdown', desc: 'Authority has turned — larders lock, and mercy must be earned again.' },
];

const DECLINE_ARCHETYPES = new Set(['prudish', 'noble', 'haughty', 'scholar']);
const DECAY_PER_DAY = 2;

export function ensureRegionHostilityState(game) {
  game.worldFlags = game.worldFlags || {};
  if (!game.worldFlags.regionHostility) game.worldFlags.regionHostility = {};
  if (!game.worldFlags.crackdown) game.worldFlags.crackdown = {};
  return game.worldFlags.regionHostility;
}

export function getRegionHostility(game, regionId) {
  ensureRegionHostilityState(game);
  const rec = game.worldFlags.regionHostility[regionId];
  return rec?.level ?? 0;
}

export function getHostilityTier(level = 0) {
  const n = Math.max(0, Math.min(HOSTILITY_MAX, level));
  return [...HOSTILITY_TIERS].reverse().find((t) => n >= t.min) || HOSTILITY_TIERS[0];
}

export function getHostilityTierForRegion(game, regionId) {
  return getHostilityTier(getRegionHostility(game, regionId));
}

export function isCrackdownActive(game, regionId = game?.region) {
  if (!game || !regionId) return false;
  ensureRegionHostilityState(game);
  return Boolean(game.worldFlags.crackdown?.[regionId]);
}

export function isServiceLocked(game, regionId = game?.region) {
  return isCrackdownActive(game, regionId);
}

/** Subtle UI label — never the raw number. */
export function getRegionTensionLabel(game, regionId = game?.region) {
  const tier = getHostilityTierForRegion(game, regionId);
  if (tier.id === 0) return null;
  if (isCrackdownActive(game, regionId)) return 'Crackdown';
  return tier.label;
}

export function getHostilityGainMultiplier(game, regionId = game?.region) {
  const tier = getHostilityTierForRegion(game, regionId);
  if (tier.id >= 1) return 0.5;
  return 1;
}

export function scaleHostilityGain(amount, game, regionId = game?.region) {
  return Math.max(0, Math.round(amount * getHostilityGainMultiplier(game, regionId)));
}

export function raiseRegionHostility(game, regionId, severity) {
  if (!game || !regionId) return null;
  const store = ensureRegionHostilityState(game);
  const rec = store[regionId] ?? { level: 0 };
  const beforeTier = getHostilityTier(rec.level).id;
  const delta = SEVERITY_HOSTILITY[severity] ?? (severity || 1) * 10;
  rec.level = Math.min(HOSTILITY_MAX, (rec.level || 0) + delta);
  store[regionId] = rec;

  const afterTier = getHostilityTier(rec.level).id;
  if (afterTier > beforeTier) {
    raiseDivineAttentionFromHostility(game, regionId);
  }
  if (afterTier >= 3 && !game.worldFlags.crackdown[regionId]) {
    triggerCrackdown(game, regionId);
  } else if (afterTier > beforeTier) {
    game.worldFlags.pending_hostility_narration = {
      regionId,
      hostilityTier: afterTier,
      crackdown: false,
    };
  }
  return rec;
}

function triggerCrackdown(game, regionId) {
  ensureRegionHostilityState(game);
  game.worldFlags.crackdown[regionId] = true;
  game.worldFlags.crackdown_active = true;
  game.worldFlags.redemptionRegion = regionId;
  game.worldFlags[`crackdown_${regionId}`] = true;
  game.worldFlags.pending_redemption_quest = true;
  game.worldFlags.pending_hostility_narration = {
    regionId,
    hostilityTier: 3,
    crackdown: true,
  };
}

export function clearCrackdown(game, regionId) {
  if (!game?.worldFlags) return;
  delete game.worldFlags.crackdown?.[regionId];
  delete game.worldFlags[`crackdown_${regionId}`];
  const store = ensureRegionHostilityState(game);
  if (store[regionId]) {
    store[regionId].level = Math.max(0, (store[regionId].level || 0) - 40);
  }
  const anyCrackdown = Object.values(game.worldFlags.crackdown ?? {}).some(Boolean);
  if (!anyCrackdown) {
    game.worldFlags.crackdown_active = false;
    game.worldFlags.redemptionRegion = null;
  }
}

export function decayRegionHostility(game, days = 1) {
  const store = ensureRegionHostilityState(game);
  for (const rid of Object.keys(store)) {
    if (isCrackdownActive(game, rid)) continue;
    const rec = store[rid];
    rec.level = Math.max(0, (rec.level || 0) - DECAY_PER_DAY * days);
    if (rec.level <= 0) delete store[rid];
  }
}

/** Idempotent drain of 3A forced-growth backlog. */
export function drainForcedGrowthLog(game) {
  game.worldFlags = game.worldFlags || {};
  const log = game.worldFlags.forcedGrowthLog;
  if (!Array.isArray(log) || !log.length) return 0;
  let drained = 0;
  for (const entry of log) {
    if (entry.consumed) continue;
    if (!entry.regionId) {
      entry.consumed = true;
      continue;
    }
    raiseRegionHostility(game, entry.regionId, entry.severity ?? 1);
    entry.consumed = true;
    drained += 1;
  }
  return drained;
}

export function tickRegionHostility(game, { dayAdvance = false, longRest = false } = {}) {
  drainForcedGrowthLog(game);
  if (dayAdvance || longRest) {
    decayRegionHostility(game, longRest ? 2 : 1);
  }
}

export function isNpcDecliningHostility(npc, game, regionId = game?.region) {
  const tier = getHostilityTierForRegion(game, regionId);
  if (tier.id < 1) return false;
  const archetype = npc?.archetype || '';
  return DECLINE_ARCHETYPES.has(archetype) && tier.id >= 1;
}

export function rollHostilityTravelEncounter(game, fromRegion, toRegion) {
  const fromTier = getHostilityTierForRegion(game, fromRegion).id;
  const toTier = getHostilityTierForRegion(game, toRegion).id;
  const maxTier = Math.max(fromTier, toTier);
  if (maxTier < 2) return null;
  const chance = maxTier >= 3 ? 0.45 : 0.3;
  if (Math.random() > chance) return null;
  return maxTier >= 3 ? 'purity_inquisitor' : 'rival_adventurer';
}

export function getHostilityGlobals(game, regionId = game?.region) {
  const tier = getHostilityTierForRegion(game, regionId);
  return {
    hostilityTier: tier.id,
    crackdown: isCrackdownActive(game, regionId),
    region: regionId,
    regionName: getRegion(regionId)?.name ?? regionId,
  };
}
