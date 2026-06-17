/**
 * Wizard spell preparation — daily prepared subset from spellbook.
 * Cantrips are always castable; leveled spells must be prepared after rest.
 */
import { getCreationGiftSpellIds } from './creationGift.js';
import { getSpell, getAllSpellIds } from './spells.js';
import { getPreparedCap } from './spellLearning.js';
import { isGrowthThemedSpell, ensureSpellState, getKnownSpellIds } from './spellLearning.js';

export function usesSpellPreparation(classId) {
  return classId === 'wizard';
}

export function getSpellbookLeveledIds(character) {
  ensureSpellState(character);
  return getKnownSpellIds(character).filter((id) => {
    const s = getSpell(id);
    return s && (s.slotLevel ?? 0) > 0;
  });
}

export function getPreparedSpellIds(character) {
  if (character?.debugAllSpellsUnlocked) return getAllSpellIds();
  ensureSpellState(character);
  if (!usesSpellPreparation(character.classId)) {
    const ids = getKnownSpellIds(character);
    const giftIds = getCreationGiftSpellIds(character).filter((id) => !ids.includes(id));
    return giftIds.length ? [...ids, ...giftIds] : ids;
  }
  if (!character.spellsPrepared?.length) {
    autoPrepareSpells(character);
  }
  const cantrips = getKnownSpellIds(character).filter((id) => (getSpell(id)?.slotLevel ?? 0) === 0);
  const prepared = (character.spellsPrepared || []).filter((id) => knowsInSpellbook(character, id));
  const giftExtra = getCreationGiftSpellIds(character).filter(
    (id) => !cantrips.includes(id) && !prepared.includes(id),
  );
  return [...new Set([...cantrips, ...prepared, ...giftExtra])];
}

function knowsInSpellbook(character, spellId) {
  if (!usesSpellPreparation(character.classId)) return true;
  return (character.spellbook || character.spellsKnown || []).includes(spellId);
}

export function getPreparedSpells(character) {
  return getPreparedSpellIds(character).map((id) => getSpell(id)).filter(Boolean);
}

export function isSpellPrepared(character, spellId) {
  if (character?.debugAllSpellsUnlocked) return true;
  const spell = getSpell(spellId);
  if (!spell) return false;
  if (getCreationGiftSpellIds(character).includes(spellId)) return true;
  if (!usesSpellPreparation(character.classId)) return true;
  if ((spell.slotLevel ?? 0) === 0) return true;
  return (character.spellsPrepared || []).includes(spellId);
}

export function setPreparedSpells(character, spellIds = []) {
  ensureSpellState(character);
  if (!usesSpellPreparation(character.classId)) return character;
  const cap = getPreparedCap(character);
  const valid = spellIds
    .filter((id) => knowsInSpellbook(character, id))
    .filter((id) => (getSpell(id)?.slotLevel ?? 0) > 0)
    .slice(0, cap);
  character.spellsPrepared = valid;
  character.spells = getPreparedSpells(character);
  return character;
}

/** Auto-fill prepared list with growth-themed spells first. */
export function autoPrepareSpells(character) {
  ensureSpellState(character);
  if (!usesSpellPreparation(character.classId)) return character;
  const cap = getPreparedCap(character);
  const leveled = getSpellbookLeveledIds(character).sort((a, b) => {
    const ga = isGrowthThemedSpell(getSpell(a)) ? 0 : 1;
    const gb = isGrowthThemedSpell(getSpell(b)) ? 0 : 1;
    if (ga !== gb) return ga - gb;
    return (getSpell(a)?.slotLevel ?? 0) - (getSpell(b)?.slotLevel ?? 0);
  });
  character.spellsPrepared = leveled.slice(0, cap);
  character.spells = getPreparedSpells(character);
  return character;
}

export function togglePreparedSpell(character, spellId) {
  const spell = getSpell(spellId);
  if (!spell || (spell.slotLevel ?? 0) === 0) return character;
  const current = [...(character.spellsPrepared || [])];
  const idx = current.indexOf(spellId);
  const cap = getPreparedCap(character);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else if (current.length < cap) {
    current.push(spellId);
  }
  return setPreparedSpells(character, current);
}

export function getPreparationStatus(character) {
  const cap = usesSpellPreparation(character.classId) ? getPreparedCap(character) : 0;
  const prepared = (character.spellsPrepared || []).length;
  const book = getSpellbookLeveledIds(character).length;
  return { cap, prepared, book, usesPrep: usesSpellPreparation(character.classId) };
}
