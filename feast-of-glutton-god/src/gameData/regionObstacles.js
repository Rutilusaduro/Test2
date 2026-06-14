/**
 * Connection gates — travel blocked until puzzle solved or flag set.
 */
import { getRegion, isRegionLocked } from './regions.js';
import {
  isExitBlockedByGiant,
  isImpassableToSmall,
  isSmallTraveler,
} from './worldReactivity.js';

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
  const smallTraveler = isSmallTraveler(game);
  const regionImpassable = isImpassableToSmall(game, regionId);

  return region.connections.map((toId) => {
    const gateCheck = isConnectionBlocked(game, regionId, toId);
    const giantCheck = isExitBlockedByGiant(game, regionId, toId);
    const regionLocked = !unlocked.includes(toId) || isRegionLocked(game, toId);

    let blocked = gateCheck.blocked || regionLocked || giantCheck.blocked;
    let blockedReason = null;
    let puzzleId = gateCheck.puzzleId ?? null;
    let gateId = gateCheck.gate?.id ?? null;

    if (gateCheck.blocked) {
      blockedReason = gateCheck.reason;
    } else if (giantCheck.blocked) {
      blockedReason = giantCheck.reason;
    } else if (regionLocked) {
      blockedReason = 'This region has not yet been unlocked.';
    }

    if (!blocked && regionImpassable && smallTraveler) {
      blocked = true;
      blockedReason = 'The roads are impassable to travelers your size — only the vast can cross this swollen land.';
    }

    return {
      regionId: toId,
      name: getRegion(toId).name,
      blocked,
      blockedReason,
      puzzleId,
      gateId,
      giantBlocked: giantCheck.blocked,
    };
  });
}
