/**
 * Universal size accessibility — every character can reach Tarrasque Matriarch.
 * Only the player is subject to level-based sizeCap progression.
 */
import { MAX_STAGE_ID } from './stages.js';

export function isPlayerCharacter(character) {
  return Boolean(character?.isPlayer || character?.id === 'player');
}

/** Effective size cap: player respects sizeCap; all others may grow to the ceiling. */
export function getEffectiveSizeCap(character) {
  if (isPlayerCharacter(character)) {
    return character?.sizeCap ?? MAX_STAGE_ID;
  }
  return MAX_STAGE_ID;
}

/** Ensure NPCs, companions, and enemies are never capped below max stage. */
export function ensureUniversalSizeAccess(character) {
  if (!character) return character;
  if (isPlayerCharacter(character)) return character;
  character.sizeCap = MAX_STAGE_ID;
  return character;
}

export function ensurePartyUniversalSize(game) {
  ensureUniversalSizeAccess(game?.player);
  for (const member of game?.party ?? []) {
    ensureUniversalSizeAccess(member);
  }
  for (const npc of Object.values(game?.npcStates ?? {})) {
    ensureUniversalSizeAccess(npc);
  }
  return game;
}
