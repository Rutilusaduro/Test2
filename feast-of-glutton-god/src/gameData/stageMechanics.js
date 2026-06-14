/**
 * Size-stage mechanical consequences — mobility, structures, command play, world presence.
 */
import { getStage, getMovement, getStageById, STAGE_BAND } from './stages.js';

export const STRUCTURE_ACCESS = {
  NORMAL: 'normal',
  WIDE: 'wide',
  VAST: 'vast',
  RITUAL_ONLY: 'ritual_only',
};

export function getStructureAccess(stageId) {
  if (stageId >= 11) return STRUCTURE_ACCESS.RITUAL_ONLY;
  if (stageId >= 9) return STRUCTURE_ACCESS.VAST;
  if (stageId >= 6) return STRUCTURE_ACCESS.WIDE;
  return STRUCTURE_ACCESS.NORMAL;
}

export function isImmobile(stageId) {
  return stageId >= 11;
}

export function requiresMagicalMobility(stageId) {
  return stageId >= 11;
}

export function isCommandPlayStage(stageId) {
  return stageId >= 11;
}

export function hasTightSpacePenalty(stageId) {
  return stageId >= 8;
}

export function getTightSpacePenalty(stageId) {
  if (stageId >= 13) return 5;
  if (stageId >= 11) return 4;
  if (stageId >= 9) return 3;
  if (stageId >= 8) return 2;
  return 0;
}

export function getInfluencePresenceBonus(stageId) {
  if (stageId >= 14) return 25;
  if (stageId >= 12) return 18;
  if (stageId >= 10) return 12;
  if (stageId >= 8) return 8;
  if (stageId >= 6) return 5;
  if (stageId >= 4) return 2;
  return 0;
}

export function getWorldReactionTier(stageId) {
  if (stageId >= 14) return 'apotheosis';
  if (stageId >= 12) return 'titanic';
  if (stageId >= 10) return 'colossal';
  if (stageId >= 8) return 'mythic';
  if (stageId >= 6) return 'legendary';
  if (stageId >= 4) return 'notable';
  return 'ordinary';
}

export function getStageMechanics(character) {
  const stage = getStage(character?.lbs ?? 80);
  const stageId = stage.id;
  return {
    stageId,
    label: stage.label,
    band: stage.band,
    tier: stage.tier,
    movement: getMovement(stageId),
    structureAccess: getStructureAccess(stageId),
    immobile: isImmobile(stageId),
    commandPlay: isCommandPlayStage(stageId),
    tightSpacePenalty: getTightSpacePenalty(stageId),
    influencePresence: getInfluencePresenceBonus(stageId),
    worldReaction: getWorldReactionTier(stageId),
    desc: stage.desc,
  };
}

export function canEnterStructure(character, structureSize = STRUCTURE_ACCESS.NORMAL) {
  const access = getStructureAccess(getStage(character.lbs).id);
  const order = [STRUCTURE_ACCESS.NORMAL, STRUCTURE_ACCESS.WIDE, STRUCTURE_ACCESS.VAST, STRUCTURE_ACCESS.RITUAL_ONLY];
  return order.indexOf(access) <= order.indexOf(structureSize);
}

export function getMobilityLabel(stageId) {
  const m = getMovement(stageId);
  if (m === 0) return 'Immobile — command & ritual only';
  if (m === 1) return 'Barely mobile';
  if (m === 2) return 'Slow, deliberate';
  if (m === 3) return 'Steady waddle';
  return 'Agile';
}

export function isMythicBand(stageId) {
  const stage = getStageByIdSafe(stageId);
  return stage.band === STAGE_BAND.MYTHIC || stage.band === STAGE_BAND.COLOSSAL || stage.band === STAGE_BAND.WORLD;
}

function getStageByIdSafe(id) {
  return getStageById(id);
}
