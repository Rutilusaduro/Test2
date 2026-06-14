/**
 * Spell learning on level up — class-specific, subclass-aware, growth-prioritized.
 */
import { getSpell } from './spells.js';
import { getCasterType } from './spellSlots.js';
import { getEffectiveStatMod } from './stats.js';
import {
  getLearningModel,
  getCurriculumForLevel,
  getSubclassGrantsAtLevel,
  CLASS_CANTRIP_POOL,
  STARTING_SPELLS,
  MILESTONE_GROWTH_SPELLS,
} from './spellProgression.js';

const GROWTH_SCHOOLS = new Set(['abundance', 'transmutation', 'enchantment', 'conjuration']);

export function isGrowthThemedSpell(spell) {
  if (!spell) return false;
  if (spell.growth) return true;
  if (GROWTH_SCHOOLS.has(spell.school)) return true;
  const eff = spell.effect || {};
  return Boolean(eff.growth || eff.feed || eff.corruption || eff.selfGrowth);
}

export function getMaxCastableSpellLevel(character) {
  const slots = character.spellSlots?.max ?? [0, 0, 0, 0, 0];
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) return i + 1;
  }
  const level = character.level || 1;
  if (getCasterType(character.classId) === 'pact') {
    return Math.min(5, Math.ceil(level / 2));
  }
  return Math.min(5, Math.max(1, Math.ceil(level / 2)));
}

function sortGrowthFirst(spellIds) {
  return [...spellIds].sort((a, b) => {
    const sa = getSpell(a);
    const sb = getSpell(b);
    const ga = isGrowthThemedSpell(sa) ? 0 : 1;
    const gb = isGrowthThemedSpell(sb) ? 0 : 1;
    if (ga !== gb) return ga - gb;
    return (sa?.slotLevel ?? 0) - (sb?.slotLevel ?? 0);
  });
}

export function ensureSpellState(character) {
  if (!character.spellsKnown) {
    character.spellsKnown = (character.spells || []).map((s) => s.id).filter(Boolean);
  }
  if (!character.spellbook && character.classId === 'wizard') {
    character.spellbook = [...character.spellsKnown];
  }
  return character;
}

export function getKnownSpellIds(character) {
  ensureSpellState(character);
  return [...new Set(character.spellsKnown)];
}

export function getCharacterSpells(character) {
  return getKnownSpellIds(character).map((id) => getSpell(id)).filter(Boolean);
}

export function knowsSpell(character, spellId) {
  return getKnownSpellIds(character).includes(spellId);
}

export function learnSpell(character, spellId) {
  ensureSpellState(character);
  if (!spellId || knowsSpell(character, spellId)) return false;
  const spell = getSpell(spellId);
  if (!spell) return false;
  character.spellsKnown.push(spellId);
  if (character.classId === 'wizard') {
    character.spellbook = character.spellbook || [];
    if (!character.spellbook.includes(spellId)) character.spellbook.push(spellId);
  }
  character.spells = getCharacterSpells(character);
  return true;
}

export function getPreparedCap(character) {
  const level = character.level || 1;
  const mod = getEffectiveStatMod(character, character.classId === 'wizard' ? 'int' : 'wis');
  return Math.max(1, level + mod);
}

/** Build starting spell set at character creation. */
export function buildStartingSpells(classId, subclassId) {
  const start = STARTING_SPELLS[classId] || { cantrips: 2, spells: 1 };
  const cantripPool = sortGrowthFirst(CLASS_CANTRIP_POOL[classId] || []);
  const cantrips = cantripPool.slice(0, start.cantrips);

  const curriculum = getCurriculumForLevel(classId, 1);
  const options = sortGrowthFirst(curriculum);
  const leveled = options.slice(0, start.spells);

  const subclassGrants = getSubclassGrantsAtLevel(subclassId, 1);
  const known = [...new Set([...cantrips, ...leveled, ...subclassGrants])];

  return {
    spellsKnown: known,
    cantrips,
    leveled,
    autoGranted: subclassGrants,
  };
}

function filterLearnable(spellIds, character, maxLevel) {
  return sortGrowthFirst(spellIds.filter((id) => {
    if (knowsSpell(character, id)) return false;
    const spell = getSpell(id);
    if (!spell || spell.slotLevel === 0) return false;
    return spell.slotLevel <= maxLevel;
  }));
}

/**
 * Resolve spell gains for a level up. Returns auto-grants and optional player choices.
 */
export function resolveSpellLearning(character, newLevel) {
  ensureSpellState(character);
  const classId = character.classId;
  const subclassId = character.subclassId;
  const model = getLearningModel(classId);
  const maxSpellLevel = getMaxCastableSpellLevel({ ...character, level: newLevel });
  const autoGranted = [];
  const growthHighlights = [];

  for (const id of getSubclassGrantsAtLevel(subclassId, newLevel)) {
    if (learnSpell(character, id)) {
      autoGranted.push(id);
      if (isGrowthThemedSpell(getSpell(id))) growthHighlights.push(id);
    }
  }

  const milestone = MILESTONE_GROWTH_SPELLS[newLevel];
  if (milestone && !knowsSpell(character, milestone) && learnSpell(character, milestone)) {
    autoGranted.push(milestone);
    growthHighlights.push(milestone);
  }

  if (model.type === 'domain_prepared') {
    const curriculum = getCurriculumForLevel(classId, newLevel);
    for (const id of curriculum) {
      if (learnSpell(character, id)) {
        autoGranted.push(id);
        if (isGrowthThemedSpell(getSpell(id))) growthHighlights.push(id);
      }
    }
    return {
      autoGranted: autoGranted.map((id) => spellSummary(id)),
      choices: null,
      growthHighlights: growthHighlights.map((id) => spellSummary(id)),
      model: model.type,
    };
  }

  const curriculum = filterLearnable(getCurriculumForLevel(classId, newLevel), character, maxSpellLevel);
  const pickCount = model.spellsPerLevel ?? 1;

  if (model.type === 'spellbook' && newLevel > 1) {
  } else if (model.type === 'known' && newLevel === 1) {
    return {
      autoGranted: autoGranted.map((id) => spellSummary(id)),
      choices: null,
      growthHighlights: growthHighlights.map((id) => spellSummary(id)),
      model: model.type,
    };
  }

  const magicalSecrets = model.magicalSecretsLevels?.includes(newLevel);
  const extraPick = magicalSecrets ? (model.magicalSecretsCount ?? 2) : 0;
  const totalPick = (typeof pickCount === 'number' ? pickCount : 0) + extraPick;

  if (totalPick <= 0 || curriculum.length === 0) {
    return {
      autoGranted: autoGranted.map((id) => spellSummary(id)),
      choices: null,
      growthHighlights: growthHighlights.map((id) => spellSummary(id)),
      model: model.type,
    };
  }

  const options = curriculum.slice(0, Math.max(totalPick + 3, 5));
  if (options.length <= totalPick) {
    for (const id of options) {
      if (learnSpell(character, id)) autoGranted.push(id);
    }
    return {
      autoGranted: autoGranted.map((id) => spellSummary(id)),
      choices: null,
      growthHighlights: growthHighlights.map((id) => spellSummary(id)),
      model: model.type,
    };
  }

  return {
    autoGranted: autoGranted.map((id) => spellSummary(id)),
    choices: {
      pickCount: totalPick,
      options: options.map((id) => spellSummary(id, true)),
      label: model.label,
      description: model.description,
    },
    growthHighlights: growthHighlights.map((id) => spellSummary(id)),
    model: model.type,
  };
}

export function spellSummary(spellId, highlightGrowth = false) {
  const spell = getSpell(spellId);
  if (!spell) return { id: spellId, name: spellId, desc: '', growth: false };
  const growth = isGrowthThemedSpell(spell);
  return {
    id: spell.id,
    name: spell.name,
    desc: spell.desc,
    slotLevel: spell.slotLevel,
    school: spell.school,
    growth,
    highlight: highlightGrowth && growth,
  };
}

export function applySpellChoices(character, spellIds = []) {
  const learned = [];
  for (const id of spellIds) {
    if (learnSpell(character, id)) learned.push(spellSummary(id));
  }
  character.spells = getCharacterSpells(character);
  return learned;
}

export function getPendingLevelUp(character) {
  return character.levelUpsPending?.[0] ?? null;
}

export function completePendingLevelUp(character, selectedSpellIds = []) {
  const pending = character.levelUpsPending?.[0];
  if (!pending) return null;

  const learned = applySpellChoices(character, selectedSpellIds);
  character.levelUpsPending = character.levelUpsPending.slice(1);
  return { ...pending, learned };
}
