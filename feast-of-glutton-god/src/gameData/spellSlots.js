/**
 * Spell slots — abundance-themed casting economy.
 *
 * Full casters: Wizard, Cleric (traditional slots, long-rest recovery)
 * Half caster: Bard (fewer slots)
 * Pact caster: Warlock (2 slots, short-rest recovery, all same level)
 *
 * Hybrid: many spells accept AP when slots are empty (apCost field).
 * Overflow: heightened versions cost +1 slot level or extra AP.
 */
import { getSpellcastingStat, getEffectiveStatMod, proficiencyBonus } from "./stats.js";
import {
  canChannelDivineResonance,
  canResonanceUpcast,
  spendResonanceForUpcast,
} from "./divineResonance.js";

export const MAX_SPELL_LEVEL = 9;

/** Slots by character level — [1st..9th] */
export const FULL_CASTER_SLOTS = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

export const HALF_CASTER_SLOTS = {
  1:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

/** Warlock: [slotCount, slotLevel] */
export const PACT_SLOTS = {
  1:  [1, 1], 2:  [2, 1], 3:  [2, 2], 4:  [2, 2], 5:  [2, 3],
  6:  [2, 3], 7:  [2, 4], 8:  [2, 4], 9:  [2, 5], 10: [2, 5],
  11: [3, 5], 12: [3, 5], 13: [3, 5], 14: [3, 5], 15: [3, 5],
  16: [3, 5], 17: [4, 5], 18: [4, 5], 19: [4, 5], 20: [4, 5],
};

export const WARLOCK_ARCANUM_BY_LEVEL = {
  11: 6,
  13: 7,
  15: 8,
  17: 9,
};

export const CASTER_TYPES = {
  wizard: "full",
  cleric: "full",
  bard: "half",
  warlock: "pact",
};

export function getCasterType(classId) {
  return CASTER_TYPES[classId] || "half";
}

function emptySlots() {
  return Array.from({ length: MAX_SPELL_LEVEL }, () => 0);
}

function normalizeSlotArray(slots = []) {
  const next = emptySlots();
  for (let i = 0; i < Math.min(next.length, slots.length); i++) {
    next[i] = slots[i] ?? 0;
  }
  return next;
}

/** Build max slot pool for a character at rest */
export function getMaxSpellSlots(character) {
  const level = Math.min(character.level || 1, 20);
  const type = getCasterType(character.classId);

  if (type === "pact") {
    const [count, slotLevel] = PACT_SLOTS[level] || [1, 1];
    const slots = emptySlots();
    slots[slotLevel - 1] = count;
    return { slots, pactLevel: slotLevel, pact: true };
  }

  const table = type === "full" ? FULL_CASTER_SLOTS : HALF_CASTER_SLOTS;
  return { slots: [...(table[level] || emptySlots())], pact: false };
}

export function getMaxSpellLevelForCharacter(character) {
  const level = Math.min(character.level || 1, 20);
  const type = getCasterType(character.classId);

  if (type === "pact") {
    let arcanum = 0;
    for (const [unlockLevel, spellLevel] of Object.entries(WARLOCK_ARCANUM_BY_LEVEL)) {
      if (level >= Number(unlockLevel)) arcanum = Math.max(arcanum, spellLevel);
    }
    return Math.max(arcanum, PACT_SLOTS[level]?.[1] ?? 1);
  }

  const slots = getMaxSpellSlots(character).slots;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) return i + 1;
  }
  return 0;
}

/** Initialize or refresh spell slot state on character */
export function initSpellSlots(character) {
  const max = getMaxSpellSlots(character);
  character.spellSlots = {
    current: [...max.slots],
    max: [...max.slots],
    pact: max.pact,
    pactLevel: max.pactLevel ?? null,
  };
  return character;
}

/** Preserve current spent slots while updating max slot topology for migrations/leveling. */
export function syncSpellSlots(character) {
  const max = getMaxSpellSlots(character);
  const prevCurrent = character.spellSlots?.current ?? [];
  const current = normalizeSlotArray(prevCurrent);
  character.spellSlots = {
    current: current.map((count, idx) => {
      if (prevCurrent[idx] == null) return max.slots[idx] ?? 0;
      return Math.min(count, max.slots[idx] ?? 0);
    }),
    max: [...max.slots],
    pact: max.pact,
    pactLevel: max.pactLevel ?? null,
  };
  return character;
}

export function getSlotLevelIndex(spellLevel) {
  return Math.max(0, Math.min(MAX_SPELL_LEVEL - 1, spellLevel - 1));
}

/** Can cast at slotLevel (1-5)? Optional upcast to higher slot */
export function hasSpellSlot(character, slotLevel, useHigher = true) {
  const slots = character.spellSlots?.current;
  if (!slots) return false;
  const idx = getSlotLevelIndex(slotLevel);
  if (slots[idx] > 0) return true;
  if (!useHigher) return false;
  for (let i = idx + 1; i < slots.length; i++) {
    if (slots[i] > 0) return true;
  }
  return false;
}

/** Spend lowest available slot >= slotLevel (upcasting) */
export function spendSpellSlot(character, slotLevel) {
  const slots = character.spellSlots?.current;
  if (!slots) return { ok: false, reason: "no_slots" };
  const start = getSlotLevelIndex(slotLevel);
  for (let i = start; i < slots.length; i++) {
    if (slots[i] > 0) {
      slots[i] -= 1;
      return { ok: true, slotLevelUsed: i + 1, upcast: i > start };
    }
  }
  return { ok: false, reason: "empty" };
}

/** Restore all slots (long rest / feast) */
export function recoverAllSpellSlots(character) {
  if (!character.spellSlots?.max) initSpellSlots(character);
  character.spellSlots.current = [...character.spellSlots.max];
  return character;
}

/** Short rest — warlock full recovery; bard recovers 1 lowest spent slot */
export function shortRestSpellSlots(character) {
  const type = getCasterType(character.classId);
  if (type === "pact") return recoverAllSpellSlots(character);
  if (type === "half") {
    const slots = character.spellSlots?.current;
    const max = character.spellSlots?.max;
    if (slots && max) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i] < max[i]) {
          slots[i] += 1;
          break;
        }
      }
    }
  }
  return character;
}

/** Abundance feast recovery — regain one highest-level spent slot */
export function feastRecoverSlot(character) {
  const slots = character.spellSlots?.current;
  const max = character.spellSlots?.max;
  if (!slots || !max) return false;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] < max[i]) {
      slots[i] += 1;
      return true;
    }
  }
  return false;
}

/**
 * Resolve casting cost — slot, AP hybrid, or cantrip (free).
 * Returns { ok, method: 'cantrip'|'slot'|'ap', slotLevelUsed?, apSpent? }
 */
export function resolveCastCost(character, spell, opts = {}) {
  const slotLevel = spell.slotLevel ?? spell.level ?? 0;
  if (slotLevel === 0) return { ok: true, method: "cantrip" };

  const overflow = opts.overflow && spell.overflow;
  const effectiveLevel = overflow ? slotLevel + (spell.overflow.slotBonus || 1) : slotLevel;
  const apCost = overflow ? (spell.overflow.apCost ?? spell.apCost ?? 0) : (spell.apCost ?? 0);

  if (hasSpellSlot(character, effectiveLevel)) {
    const spent = spendSpellSlot(character, effectiveLevel);
    if (spent.ok) return { ok: true, method: "slot", ...spent };
  }

  if (
    canChannelDivineResonance(character)
    && canResonanceUpcast(character, effectiveLevel)
    && spendResonanceForUpcast(character, effectiveLevel)
  ) {
    return { ok: true, method: "resonance", slotLevelUsed: effectiveLevel, upcast: true };
  }

  if (apCost > 0 && (character.ap ?? 0) >= apCost) {
    character.ap -= apCost;
    return { ok: true, method: "ap", apSpent: apCost };
  }

  if (spell.apCost && (character.ap ?? 0) >= spell.apCost) {
    character.ap -= spell.apCost;
    return { ok: true, method: "ap", apSpent: spell.apCost };
  }

  return { ok: false, reason: "no_slot_or_ap" };
}

/**
 * Dry-run cast cost — does not spend slots or AP.
 * Returns { ok, method: 'cantrip'|'slot'|'ap', apSpent? }
 */
export function previewCastCost(character, spell, opts = {}) {
  const slotLevel = spell.slotLevel ?? spell.level ?? 0;
  if (slotLevel === 0) return { ok: true, method: "cantrip" };

  const overflow = opts.overflow && spell.overflow;
  const effectiveLevel = overflow ? slotLevel + (spell.overflow.slotBonus || 1) : slotLevel;
  const apCost = overflow ? (spell.overflow.apCost ?? spell.apCost ?? 0) : (spell.apCost ?? 0);

  if (hasSpellSlot(character, effectiveLevel)) {
    return { ok: true, method: "slot" };
  }

  if (canChannelDivineResonance(character) && canResonanceUpcast(character, effectiveLevel)) {
    return { ok: true, method: "resonance" };
  }

  if (apCost > 0 && (character.ap ?? 0) >= apCost) {
    return { ok: true, method: "ap", apSpent: apCost };
  }

  if (spell.apCost && (character.ap ?? 0) >= spell.apCost) {
    return { ok: true, method: "ap", apSpent: spell.apCost };
  }

  return { ok: false, reason: "no_slot_or_ap" };
}

export function getSpellPowerMultiplier(character, slotLevelUsed = 1) {
  const key = getSpellcastingStat(character.classId);
  const mod = getEffectiveStatMod(character, key);
  const prof = proficiencyBonus(character.level || 1);
  return 1 + (mod + prof) * 0.05 + (slotLevelUsed - 1) * 0.15;
}
