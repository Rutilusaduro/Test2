/**
 * Divine Resonance — excess AP (level 15+) channels into upcast fuel.
 * 3 excess AP → 1 resonance (max 20). Resets on long rest.
 */
import { getMaxAbundancePoints } from './stats.js';

export const MAX_DIVINE_RESONANCE = 20;
export const AP_PER_RESONANCE = 3;
export const RESONANCE_UNLOCK_LEVEL = 15;

export function ensureDivineResonance(character) {
  if (character.divineResonance == null) character.divineResonance = 0;
  return character.divineResonance;
}

export function canChannelDivineResonance(character) {
  return (character?.level ?? 1) >= RESONANCE_UNLOCK_LEVEL;
}

/** Convert AP above max into divine resonance. Returns { gained, overflowAp }. */
export function channelExcessApToResonance(character, game = null) {
  if (!canChannelDivineResonance(character)) return { gained: 0, overflowAp: 0 };

  const maxAp = getMaxAbundancePoints(character);
  const current = character.ap ?? 0;
  if (current <= maxAp) return { gained: 0, overflowAp: 0 };

  const excess = current - maxAp;
  character.ap = maxAp;

  const room = MAX_DIVINE_RESONANCE - ensureDivineResonance(character);
  if (room <= 0) return { gained: 0, overflowAp: excess };

  const convertible = Math.floor(excess / AP_PER_RESONANCE);
  const gained = Math.min(room, convertible);
  character.divineResonance += gained;

  const leftoverAp = excess - gained * AP_PER_RESONANCE;
  if (leftoverAp > 0) {
    character.ap = Math.min(maxAp, (character.ap ?? 0) + leftoverAp);
  }

  return { gained, overflowAp: excess };
}

export function getDivineResonance(character) {
  return ensureDivineResonance(character);
}

export function resetDivineResonance(character) {
  character.divineResonance = 0;
  return character;
}

/**
 * Spend resonance to upcast one slot level above highest available slot.
 * @returns {boolean} whether resonance was spent
 */
export function spendResonanceForUpcast(character, spellSlotLevel) {
  if (!canChannelDivineResonance(character)) return false;
  if (ensureDivineResonance(character) <= 0) return false;

  const needed = Math.max(1, Math.ceil(spellSlotLevel / 3));
  if (character.divineResonance < needed) return false;
  character.divineResonance -= needed;
  return true;
}

/** True when no slot exists at spell level but resonance could upcast. */
export function canResonanceUpcast(character, slotLevel) {
  if (!canChannelDivineResonance(character)) return false;
  const needed = Math.max(1, Math.ceil(slotLevel / 3));
  return ensureDivineResonance(character) >= needed;
}
