import { REGION_PUZZLES } from './definitions/index.js';

export { PUZZLE_TYPE, SOLUTION_KIND } from './constants.js';
export { REGION_PUZZLES } from './definitions/index.js';

export function getPuzzleDefinition(puzzleId) {
  return REGION_PUZZLES.find((p) => p.id === puzzleId) ?? null;
}

export function getPuzzlesInRegion(regionId) {
  return REGION_PUZZLES.filter((p) => p.regionId === regionId);
}

export function getAllPuzzles() {
  return REGION_PUZZLES;
}

export function getPuzzleByFeature(featureId) {
  return REGION_PUZZLES.find((p) => p.featureId === featureId) ?? null;
}

export function getPuzzleByGate(gateId) {
  return REGION_PUZZLES.find((p) => p.gateId === gateId) ?? null;
}
