/**
 * Character-creation gift — one 3rd-level spell, 3 free casts per long rest.
 */
import { getSpell, getSpellsBySlotLevel } from './spells.js';
import { learnSpell, getCharacterSpells, spellSummary } from './spellLearning.js';
import { usesSpellPreparation } from './spellPreparation.js';

export const CREATION_GIFT_MAX_USES = 3;
export const CREATION_GIFT_SLOT_LEVEL = 3;

export function getThirdLevelSpellOptions() {
  return getSpellsBySlotLevel(CREATION_GIFT_SLOT_LEVEL)
    .map((s) => spellSummary(s.id, true))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function ensureCreationGiftState(character) {
  if (!character?.creationGift?.spellId) return character;
  const gift = character.creationGift;
  gift.maxUses = gift.maxUses ?? CREATION_GIFT_MAX_USES;
  if (gift.usesRemaining == null) gift.usesRemaining = gift.maxUses;
  return character;
}

export function canUseCreationGift(character, spellId, opts = {}) {
  if (opts.overflow) return false;
  const gift = character?.creationGift;
  if (!gift?.spellId || gift.spellId !== spellId) return false;
  return (gift.usesRemaining ?? 0) > 0;
}

export function spendCreationGiftUse(character) {
  ensureCreationGiftState(character);
  if (!canUseCreationGift(character, character.creationGift.spellId)) return false;
  character.creationGift.usesRemaining -= 1;
  return true;
}

export function resetCreationGiftUses(character) {
  if (!character?.creationGift?.spellId) return character;
  ensureCreationGiftState(character);
  character.creationGift.usesRemaining = character.creationGift.maxUses ?? CREATION_GIFT_MAX_USES;
  return character;
}

/** Grant the creation gift spell at character creation. */
export function applyCreationGift(character, spellId) {
  const spell = getSpell(spellId);
  if (!spell || (spell.slotLevel ?? 0) !== CREATION_GIFT_SLOT_LEVEL) return false;

  character.creationGift = {
    spellId,
    usesRemaining: CREATION_GIFT_MAX_USES,
    maxUses: CREATION_GIFT_MAX_USES,
  };

  learnSpell(character, spellId);

  if (usesSpellPreparation(character.classId)) {
    character.spellsPrepared = character.spellsPrepared || [];
    if (!character.spellsPrepared.includes(spellId)) {
      character.spellsPrepared.push(spellId);
    }
  }

  character.spells = getCharacterSpells(character);
  return true;
}

export function getCreationGiftLabel(character) {
  const gift = character?.creationGift;
  if (!gift?.spellId) return null;
  const spell = getSpell(gift.spellId);
  return {
    spellId: gift.spellId,
    name: spell?.name ?? gift.spellId,
    usesRemaining: gift.usesRemaining ?? 0,
    maxUses: gift.maxUses ?? CREATION_GIFT_MAX_USES,
  };
}
