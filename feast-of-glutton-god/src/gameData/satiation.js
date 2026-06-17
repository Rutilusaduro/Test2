/**
 * Satiation — per-NPC fullness / overwhelm from growth in a short window.
 * Applies regardless of willingness; devoted bonds tolerate more before refusal.
 */
import { getTier } from './relationships.js';
import { reduceRelationship } from './relationships.js';
import { processIndulgenceStates } from './arcaneStates.js';

export const SATIATION_MAX = 100;

export const SATIATION_TIERS = [
  { id: 0, min: 0, label: 'Comfortable', desc: 'Room for more — body and spirit unhurried.' },
  { id: 1, min: 25, label: 'Full', desc: 'Pleasantly sated — growth lands softer now.' },
  { id: 2, min: 50, label: 'Stuffed', desc: 'Breathing deep — every new inch feels rushed.' },
  { id: 3, min: 75, label: 'Overwhelmed', desc: 'Too much, too fast — she needs mercy and rest.' },
];

const GROWTH_MULTIPLIER = [1, 0.7, 0.45, 0.2];

/** Refusal locks these interactions until satiation drops below stuffed tier. */
export const SATIATION_LOCKED_ACTIONS = new Set(['feed', 'bless', 'special', 'intimate']);

export function getSatiationTier(points = 0) {
  return [...SATIATION_TIERS].reverse().find((t) => points >= t.min) || SATIATION_TIERS[0];
}

export function ensureSatiation(npc, game) {
  if (npc.satiation == null) npc.satiation = 0;
  if (npc.growthDay != null && game?.day != null && npc.growthDay !== game.day) {
    npc.growthToday = 0;
  }
  if (npc.growthToday == null) npc.growthToday = 0;
  return npc;
}

export function addSatiation(npc, amount, game) {
  ensureSatiation(npc, game);
  npc.satiation = Math.min(SATIATION_MAX, Math.max(0, (npc.satiation || 0) + amount));
  return getSatiationTier(npc.satiation);
}

export function recordGrowthToday(npc, game, stages) {
  ensureSatiation(npc, game);
  if (npc.growthDay !== game?.day) {
    npc.growthToday = 0;
    npc.growthDay = game?.day;
  }
  npc.growthToday = (npc.growthToday || 0) + stages;
}

export function applySatiationFromGrowth(npc, game, stagesJumped) {
  if (stagesJumped <= 0) return getSatiationTier(npc.satiation || 0);
  const bump = stagesJumped * 10 + (stagesJumped > 1 ? 5 : 0);
  recordGrowthToday(npc, game, stagesJumped);
  return addSatiation(npc, bump, game);
}

/**
 * Devotion (relationship tier 5): refuse threshold 90 instead of 75; +15 satiation tolerance.
 */
export function getRefusalThreshold(npc) {
  const devoted = getTier(npc.relationship || 0).id >= 5;
  return devoted ? 90 : 75;
}

export function isSatiationRefusing(npc, game) {
  ensureSatiation(npc, game);
  return (npc.satiation || 0) >= getRefusalThreshold(npc);
}

export function isInteractionSatiationLocked(npc, game, interactionId) {
  if (!SATIATION_LOCKED_ACTIONS.has(interactionId)) return false;
  ensureSatiation(npc, game);
  return (npc.satiation || 0) >= 50;
}

export function getSatiationLockReason(npc) {
  const tier = getSatiationTier(npc.satiation || 0);
  return `${npc.name} is ${tier.label.toLowerCase()} — she needs rest before more growth magic.`;
}

/**
 * @returns {{ refused: boolean, diminishedStages: number, tier: object, relDip: number }}
 */
export function evaluateSatiation(npc, game, requestedStages) {
  ensureSatiation(npc, game);
  const tier = getSatiationTier(npc.satiation || 0);

  if (isSatiationRefusing(npc, game)) {
    return { refused: true, diminishedStages: 0, tier, relDip: 0 };
  }

  const mult = GROWTH_MULTIPLIER[tier.id] ?? 1;
  const diminishedStages = requestedStages <= 0
    ? 0
    : Math.max(1, Math.ceil(requestedStages * mult));
  const relDip = tier.id >= 2 ? tier.id : tier.id >= 1 ? 1 : 0;

  return { refused: false, diminishedStages, tier, relDip };
}

/** Long rest / day rollover decay for one NPC record. */
export function decaySatiation(npc, { longRest = false } = {}) {
  if (npc.satiation == null) return npc;
  const drop = longRest ? 35 : 15;
  npc.satiation = Math.max(0, (npc.satiation || 0) - drop);
  if (longRest) {
    npc.growthToday = 0;
    npc.growthDay = null;
  }
  return npc;
}

export function decaySatiationForGame(game, { longRest = false } = {}) {
  for (const c of game.party ?? []) decaySatiation(c, { longRest });
  if (game.npcStates) {
    for (const id of Object.keys(game.npcStates)) {
      decaySatiation(game.npcStates[id], { longRest });
    }
  }
  // Expire and tick indulgence states on the same schedule as satiation decay
  if (longRest) {
    processIndulgenceStates(game, 'long_rest');
  }
  return game;
}
