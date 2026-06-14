/**
 * Gorgara's Favor — daily ceiling for overworld growth magic.
 * favorMax grows as you fatten others; refilled by eating and long rest.
 */
import { renderFavorWarning, renderSpecialCooldown } from '../textEngine/scenes/dm/favor.js';
import { renderIndulge } from '../textEngine/scenes/player/indulge.js';

export const BASE_FAVOR_MAX = 5;
/** +1 favorMax per N growth stages granted worldwide. */
export const FAVOR_MAX_PER_STAGES = 2;

const FAVOR_COST_TABLE = {
  growth_1: 1,
  growth_2: 2,
  growth_3: 4,
  bless_minor: 1,
  bless_major: 2,
  bless_targeted: 1,
  special: 3,
  spell_1: 1,
  spell_2: 2,
  spell_3: 4,
};

export function ensureFavor(player) {
  if (!player) return player;
  if (player.favorMax == null) player.favorMax = BASE_FAVOR_MAX;
  if (player.totalGrowthStagesGranted == null) player.totalGrowthStagesGranted = 0;
  recalcFavorMax(player);
  if (player.favor == null) player.favor = player.favorMax;
  player.favor = Math.min(player.favorMax, Math.max(0, player.favor));
  return player;
}

export function recalcFavorMax(player) {
  const bonus = Math.floor((player.totalGrowthStagesGranted || 0) / FAVOR_MAX_PER_STAGES);
  player.favorMax = BASE_FAVOR_MAX + bonus;
  if (player.favor > player.favorMax) player.favor = player.favorMax;
}

export function recordGrowthStagesGranted(player, stages) {
  if (!stages || stages <= 0) return;
  ensureFavor(player);
  player.totalGrowthStagesGranted = (player.totalGrowthStagesGranted || 0) + stages;
  recalcFavorMax(player);
}

export function getGrowthFavorCost(stages) {
  const s = Math.max(1, stages || 1);
  if (s <= 1) return FAVOR_COST_TABLE.growth_1;
  if (s === 2) return FAVOR_COST_TABLE.growth_2;
  return FAVOR_COST_TABLE.growth_3;
}

export function getBlessFavorCost(blessType = 'minor') {
  if (blessType === 'major') return FAVOR_COST_TABLE.bless_major;
  if (blessType === 'targeted') return FAVOR_COST_TABLE.bless_targeted;
  return FAVOR_COST_TABLE.bless_minor;
}

export function getSpellGrowthFavorCost(stages) {
  return getGrowthFavorCost(stages);
}

export function getSpecialFavorCost() {
  return FAVOR_COST_TABLE.special;
}

export function getFavorState(player) {
  ensureFavor(player);
  if ((player.favor ?? 0) <= 0) return 'empty';
  const ratio = player.favor / Math.max(1, player.favorMax);
  if (ratio <= 0.35) return 'low';
  return 'flush';
}

export function canSpendFavor(player, cost) {
  ensureFavor(player);
  return (player.favor ?? 0) >= cost;
}

export function spendFavor(player, cost) {
  if (!canSpendFavor(player, cost)) return false;
  player.favor -= cost;
  return true;
}

export function getFavorRefusalText(player, game, action = 'growth') {
  const state = getFavorState(player);
  return renderFavorWarning(player, game, { favorState: state, action });
}

export function restoreFavorFromRest(player) {
  ensureFavor(player);
  const topUp = Math.ceil(player.favorMax * 0.55);
  player.favor = Math.min(player.favorMax, Math.max(player.favor, topUp));
  return player.favor;
}

export function restoreFavorFromIndulge(player) {
  ensureFavor(player);
  const gain = Math.max(2, Math.ceil(player.favorMax * 0.4));
  player.favor = Math.min(player.favorMax, (player.favor || 0) + gain);
  return player.favor;
}

export function canIndulgeToday(player) {
  return !player.restFlags?.indulgeUsed;
}

export function markIndulgeUsed(player) {
  player.restFlags = player.restFlags || {};
  player.restFlags.indulgeUsed = true;
}

export function resetIndulgeFlag(player) {
  if (player.restFlags) player.restFlags.indulgeUsed = false;
}

export function canUseSpecialToday(npc, game) {
  const day = game?.day ?? 1;
  const last = npc?.lastSpecialDay;
  return last == null || last < day;
}

export function markSpecialUsed(npc, game) {
  npc.lastSpecialDay = game?.day ?? 1;
}

export function getSpecialCooldownText(npc, player, game) {
  return renderSpecialCooldown(npc, player, game);
}

export function doIndulge(player, game) {
  if (!canIndulgeToday(player)) {
    return {
      ok: false,
      text: 'You have already indulged today — rest or let the day turn before feasting on yourself again.',
    };
  }
  markIndulgeUsed(player);
  restoreFavorFromIndulge(player);
  const text = renderIndulge(player, game);
  return { ok: true, text };
}
