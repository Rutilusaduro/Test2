/**
 * Connection gates — travel blocked until puzzle solved or flag set.
 */
import { getRegion } from './regions.js';

export const CONNECTION_GATES = [
  {
    id: 'gate_heartlands_cradle',
    from: 'fertile_heartlands',
    to: 'gorgara_cradle',
    puzzleId: 'choked_ravine',
    solvedFlag: 'puzzle_choked_ravine_solved',
    blockedText: 'The Swollen Ravine blocks the path to Gorgara\'s Cradle — vines and swollen fruit choke the crossing. Find another way through abundance.',
  },
];

export function getGateForConnection(fromRegionId, toRegionId) {
  return CONNECTION_GATES.find(
    (g) => g.from === fromRegionId && g.to === toRegionId,
  ) ?? null;
}

export function isConnectionBlocked(game, fromRegionId, toRegionId) {
  const gate = getGateForConnection(fromRegionId, toRegionId);
  if (!gate) return { blocked: false };
  if (game.worldFlags?.[gate.solvedFlag]) return { blocked: false };
  return {
    blocked: true,
    gate,
    reason: gate.blockedText,
    puzzleId: gate.puzzleId,
  };
}

export function getTravelOptions(game, regionId) {
  const region = getRegion(regionId);
  const unlocked = game.worldFlags?.regions_unlocked ?? [];
  return region.connections.map((toId) => {
    const gateCheck = isConnectionBlocked(game, regionId, toId);
    const regionLocked = !unlocked.includes(toId);
    return {
      regionId: toId,
      name: getRegion(toId).name,
      blocked: gateCheck.blocked || regionLocked,
      blockedReason: gateCheck.blocked
        ? gateCheck.reason
        : regionLocked
          ? 'This region has not yet been unlocked.'
          : null,
      puzzleId: gateCheck.puzzleId ?? null,
      gateId: gateCheck.gate?.id ?? null,
    };
  });
}
