/**
 * Character-creation gifts — forbidden spells above your level, 3 free casts each per long rest.
 */
import { getSpell, getSpellsBySlotLevel } from './spells.js';
import { learnSpell, getCharacterSpells, spellSummary } from './spellLearning.js';
import { usesSpellPreparation } from './spellPreparation.js';

export const CREATION_GIFT_MAX_USES = 3;
export const CREATION_GIFT_SLOT_LEVEL = 3;
export const CREATION_GIFT_SLOT_LEVEL_4 = 4;
export const CREATION_GIFT_LEVELS = [CREATION_GIFT_SLOT_LEVEL, CREATION_GIFT_SLOT_LEVEL_4];

function normalizeCreationGifts(character) {
  if (!character) return [];
  if (!character.creationGifts?.length && character.creationGift?.spellId) {
    const legacy = character.creationGift;
    character.creationGifts = [{
      spellId: legacy.spellId,
      slotLevel: legacy.slotLevel ?? CREATION_GIFT_SLOT_LEVEL,
      usesRemaining: legacy.usesRemaining ?? CREATION_GIFT_MAX_USES,
      maxUses: legacy.maxUses ?? CREATION_GIFT_MAX_USES,
    }];
    delete character.creationGift;
  }
  if (!character.creationGifts) character.creationGifts = [];
  return character.creationGifts;
}

export function getCreationGiftSpellOptions(slotLevel) {
  return getSpellsBySlotLevel(slotLevel)
    .map((s) => spellSummary(s.id, true))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getThirdLevelSpellOptions() {
  return getCreationGiftSpellOptions(CREATION_GIFT_SLOT_LEVEL);
}

export function getFourthLevelSpellOptions() {
  return getCreationGiftSpellOptions(CREATION_GIFT_SLOT_LEVEL_4);
}

export function getCreationGiftEntries(character) {
  return normalizeCreationGifts(character);
}

export function getCreationGiftSpellIds(character) {
  return getCreationGiftEntries(character).map((g) => g.spellId).filter(Boolean);
}

export function findCreationGiftEntry(character, spellId) {
  return getCreationGiftEntries(character).find((g) => g.spellId === spellId) ?? null;
}

export function getCreationGiftUses(character, spellId) {
  const entry = findCreationGiftEntry(character, spellId);
  if (!entry) return null;
  return {
    usesRemaining: entry.usesRemaining ?? 0,
    maxUses: entry.maxUses ?? CREATION_GIFT_MAX_USES,
  };
}

export function ensureCreationGiftState(character) {
  const gifts = normalizeCreationGifts(character);
  for (const gift of gifts) {
    gift.maxUses = gift.maxUses ?? CREATION_GIFT_MAX_USES;
    if (gift.usesRemaining == null) gift.usesRemaining = gift.maxUses;
  }
  return character;
}

export function canUseCreationGift(character, spellId, opts = {}) {
  if (opts.overflow) return false;
  const entry = findCreationGiftEntry(character, spellId);
  if (!entry) return false;
  return (entry.usesRemaining ?? 0) > 0;
}

export function spendCreationGiftUse(character, spellId) {
  ensureCreationGiftState(character);
  const entry = findCreationGiftEntry(character, spellId);
  if (!entry || !canUseCreationGift(character, spellId)) return false;
  entry.usesRemaining -= 1;
  return true;
}

export function resetCreationGiftUses(character) {
  const gifts = normalizeCreationGifts(character);
  if (!gifts.length) return character;
  ensureCreationGiftState(character);
  for (const gift of gifts) {
    gift.usesRemaining = gift.maxUses ?? CREATION_GIFT_MAX_USES;
  }
  return character;
}

function prepareGiftSpell(character, spellId) {
  learnSpell(character, spellId);
  if (usesSpellPreparation(character.classId)) {
    character.spellsPrepared = character.spellsPrepared || [];
    if (!character.spellsPrepared.includes(spellId)) {
      character.spellsPrepared.push(spellId);
    }
  }
  character.spells = getCharacterSpells(character);
}

/** Grant one creation gift spell at character creation. */
export function applyCreationGift(character, spellId) {
  const spell = getSpell(spellId);
  const slotLevel = spell?.slotLevel ?? 0;
  if (!spell || !CREATION_GIFT_LEVELS.includes(slotLevel)) return false;

  const gifts = normalizeCreationGifts(character);
  const existingIdx = gifts.findIndex((g) => g.slotLevel === slotLevel);
  const entry = {
    spellId,
    slotLevel,
    usesRemaining: CREATION_GIFT_MAX_USES,
    maxUses: CREATION_GIFT_MAX_USES,
  };
  if (existingIdx >= 0) gifts[existingIdx] = entry;
  else gifts.push(entry);

  prepareGiftSpell(character, spellId);
  return true;
}

/** @deprecated Use getCreationGiftLabels */
export function getCreationGiftLabel(character) {
  const labels = getCreationGiftLabels(character);
  return labels[0] ?? null;
}

export function getCreationGiftLabels(character) {
  return getCreationGiftEntries(character)
    .map((gift) => {
      const spell = getSpell(gift.spellId);
      return {
        spellId: gift.spellId,
        slotLevel: gift.slotLevel,
        name: spell?.name ?? gift.spellId,
        usesRemaining: gift.usesRemaining ?? 0,
        maxUses: gift.maxUses ?? CREATION_GIFT_MAX_USES,
      };
    })
    .sort((a, b) => (a.slotLevel ?? 0) - (b.slotLevel ?? 0));
}
