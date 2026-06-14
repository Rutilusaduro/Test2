/**
 * Forced-growth signal for Region Hostility (Prompt 3A → 3B).
 */
import { raiseRegionHostility } from './regionHostility.js';

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
  const entry = {
    regionId,
    severity,
    day: game.day ?? 1,
    consumed: false,
  };
  log.push(entry);
  raiseRegionHostility(game, regionId, severity);
  entry.consumed = true;
  return entry;
}

export { raiseRegionHostility } from './regionHostility.js';
