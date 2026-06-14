/**
 * Forced-growth signal for Region Hostility (Prompt 3B).
 * Minimal log in 3A; Part 2 replaces raiseRegionHostility with the full system.
 */

export function ensureForcedGrowthLog(game) {
  game.worldFlags = game.worldFlags || {};
  if (!game.worldFlags.forcedGrowthLog) {
    game.worldFlags.forcedGrowthLog = [];
  }
  return game.worldFlags.forcedGrowthLog;
}

export function recordForcedGrowth(game, regionId, severity) {
  if (!game || !regionId) return null;
  const log = ensureForcedGrowthLog(game);
  const entry = { regionId, severity, day: game.day ?? 1 };
  log.push(entry);
  raiseRegionHostility(game, regionId, severity);
  return entry;
}

/** Stub — Part 2 implements real region hostility. */
export function raiseRegionHostility(game, regionId, severity) {
  game.worldFlags = game.worldFlags || {};
  if (!game.worldFlags.regionHostility) game.worldFlags.regionHostility = {};
  const rec = game.worldFlags.regionHostility[regionId] ?? { level: 0 };
  rec.level = Math.min(10, (rec.level || 0) + severity);
  game.worldFlags.regionHostility[regionId] = rec;
  return rec;
}
