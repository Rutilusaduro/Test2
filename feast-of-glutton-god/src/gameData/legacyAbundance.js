/**
 * Legacy abundance — meta progression across pilgrimages (Phase 10b).
 */
import { loadPilgrimageMeta, savePilgrimageMeta } from './save.js';

export const LEGACY_AP_PER_POINT = 2;
export const ENDLESS_BANQUET_AP_COST = 20;

export function ensureLegacyState(game) {
  game.pilgrimageMeta = game.pilgrimageMeta ?? loadPilgrimageMeta();
  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.legacy_abundance = game.pilgrimageMeta.legacyAbundance ?? 0;
  return game.pilgrimageMeta;
}

export function getLegacyAbundance(game) {
  return ensureLegacyState(game).legacyAbundance ?? 0;
}

export function addLegacyAbundance(game, amount = 1) {
  const meta = ensureLegacyState(game);
  meta.legacyAbundance = (meta.legacyAbundance ?? 0) + amount;
  game.worldFlags.legacy_abundance = meta.legacyAbundance;
  savePilgrimageMeta(meta);
  return meta.legacyAbundance;
}

export function getLegacyStartingApBonus(game) {
  return getLegacyAbundance(game) * LEGACY_AP_PER_POINT;
}

export function applyLegacyToNewGame(game) {
  const bonus = getLegacyStartingApBonus(game);
  if (bonus > 0 && game.player) {
    game.player.ap = (game.player.ap ?? 0) + bonus;
  }
  return bonus;
}

/** Spend AP in Eternal Hall for +1 legacy abundance. */
export function performEndlessBanquet(game) {
  const ap = game.player?.ap ?? 0;
  if (ap < ENDLESS_BANQUET_AP_COST) {
    return { ok: false, message: `Need ${ENDLESS_BANQUET_AP_COST} AP for the endless banquet.` };
  }
  game.player.ap -= ENDLESS_BANQUET_AP_COST;
  const total = addLegacyAbundance(game, 1);
  return {
    ok: true,
    message: `★ Endless Banquet — legacy abundance +1 (${total} total). The Fat Goddess remembers across pilgrimages.`,
    total,
  };
}

export function isEternalHallUnlocked(game) {
  const wf = game.worldFlags ?? {};
  const meta = game.pilgrimageMeta ?? loadPilgrimageMeta();
  return Boolean(
    wf.eternal_hall_unlocked
    || meta.eternalHallUnlocked
    || (wf.prestige_rank ?? 0) >= 3
    || wf.all_companions_apotheosis,
  );
}

export function syncEternalHallUnlock(game) {
  if (!isEternalHallUnlocked(game)) return false;
  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.eternal_hall_unlocked = true;
  const meta = ensureLegacyState(game);
  meta.eternalHallUnlocked = true;
  if (!game.worldFlags.regions_unlocked.includes('eternal_feast_hall')) {
    game.worldFlags.regions_unlocked.push('eternal_feast_hall');
  }
  savePilgrimageMeta(meta);
  return true;
}
