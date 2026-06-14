/**
 * Class spell curricula — leveled lists with growth-theme priority tags.
 * Spells reference IDs from spells.js (CANTRIPS, BONUS_SPELLS, CLASS_SPELLS).
 */

/** How each class acquires spells on level up. */
export const SPELL_LEARNING_MODEL = {
  wizard: {
    type: 'spellbook',
    label: 'Spellbook',
    spellsPerLevel: 2,
    cantripsAtStart: 4,
    description: 'Learn two new spells per level into your spellbook (growth-themed options highlighted).',
  },
  cleric: {
    type: 'domain_prepared',
    label: 'Divine Prepared',
    spellsPerLevel: 'auto',
    description: 'Automatically gain all cleric spells of newly available levels. Domain spells are always prepared.',
  },
  bard: {
    type: 'known',
    label: 'Spells Known',
    spellsPerLevel: 1,
    magicalSecretsLevels: [10],
    magicalSecretsCount: 2,
    description: 'Learn one new spell per level from the bard list.',
  },
  warlock: {
    type: 'known',
    label: 'Pact Spells',
    spellsPerLevel: 1,
    description: 'Learn one powerful pact spell when your pact magic deepens.',
  },
};

/**
 * Spells automatically granted at specific character levels (class curriculum).
 * `growth` spells are sorted first when offering choices.
 */
export const CLASS_SPELL_CURRICULUM = {
  wizard: {
    1: ['expand_minor', 'abundant_berry', 'weight_of_desire', 'honeyed_overflow'],
    2: ['glutinous_surge', 'form_of_abundance'],
    3: ['overflowing_script', 'pleasurable_pressure', 'banquet_mist'],
    4: ['overflow_cascade', 'form_of_the_devoted', 'cascade_of_curves'],
    5: ['grand_transmutation', 'cauldron_flesh'],
    6: ['divine_plump'],
    7: ['true_overflow'],
    9: ['gorgaras_awakening'],
  },
  cleric: {
    1: ['abundant_berry', 'expand_minor', 'prayer_full_belly', 'swell_kiss'],
    2: ['glutinous_surge', 'feast_of_the_goddess', 'form_of_abundance'],
    3: ['living_altar', 'pleasurable_pressure', 'lovers_feast'],
    4: ['eternal_indulgence', 'overflow_cascade', 'matrons_blessing'],
    5: ['gorgara_grand_feast', 'cascade_of_curves'],
    6: ['divine_plump'],
    7: ['true_overflow', 'banquet_mist'],
    9: ['mass_indulgence'],
  },
  bard: {
    1: ['overflowing_charm', 'expand_minor', 'honeyed_overflow'],
    2: ['ballad_bottomless', 'glutinous_surge', 'swell_kiss'],
    3: ['feast_song', 'feast_of_the_goddess', 'lovers_feast'],
    4: ['eternal_indulgence', 'matrons_blessing'],
    5: ['abundance_crescendo', 'cascade_of_curves'],
    7: ['overflow_cascade', 'banquet_mist'],
    10: ['form_of_the_devoted', 'mass_indulgence'],
  },
  warlock: {
    1: ['weight_of_desire', 'gorgara_claim', 'expand_minor'],
    2: ['essence_drain', 'glutinous_surge'],
    3: ['overflowing_charm', 'hunger_pact'],
    4: ['form_of_abundance'],
    5: ['true_overflow'],
    7: ['mass_indulgence'],
    9: ['gorgaras_awakening'],
  },
};

/** Domain / subclass spells granted automatically at level (always prepared for clerics). */
export const SUBCLASS_SPELL_GRANTS = {
  indulgence: { 3: ['feast_of_the_goddess'] },
  sirens_call: { 3: ['overflowing_charm'] },
  overflowing_heart: { 5: ['eternal_indulgence'] },
  expanding_form: { 2: ['form_of_abundance'] },
  arcane_gluttony: { 2: ['glutinous_surge'] },
  eternal_feast: { 3: ['feast_of_the_goddess'] },
  mother_abundance: { 1: ['abundant_berry'] },
  devouring_shadow: { 3: ['weight_of_desire'] },
  honeyed_tongue: { 3: ['overflowing_charm'] },
};

/** Cantrip pool per class (growth-themed first in UI). */
export const CLASS_CANTRIP_POOL = {
  wizard: ['caloric_bolt', 'gorgaras_spark', 'indulgent_touch', 'softening_ray', 'syrup_splash', 'rich_cream', 'gentle_plump', 'feasts_whisper'],
  cleric: ['caloric_bolt', 'honeyed_lash', 'indulgent_touch', 'gentle_plump', 'flavor_burst', 'feasts_whisper'],
  bard: ['caloric_bolt', 'honeyed_lash', 'feasts_whisper', 'jiggle_charm', 'flavor_burst', 'syrup_splash', 'indulgent_touch'],
  warlock: ['caloric_bolt', 'gluttons_ember', 'gorgaras_spark', 'feasts_whisper', 'softening_ray', 'rich_cream'],
};

/** Starting cantrip count and leveled spells at character creation. */
export const STARTING_SPELLS = {
  wizard: { cantrips: 4, spells: 2 },
  cleric: { cantrips: 3, spells: 2 },
  bard: { cantrips: 2, spells: 2 },
  warlock: { cantrips: 2, spells: 1 },
};

/** Bonus growth spell auto-granted at milestone levels (celebratory). */
export const MILESTONE_GROWTH_SPELLS = {
  5: 'glutinous_surge',
  9: 'overflow_cascade',
  12: 'gorgaras_awakening',
};

export function getLearningModel(classId) {
  return SPELL_LEARNING_MODEL[classId] || SPELL_LEARNING_MODEL.bard;
}

export function getCurriculumForLevel(classId, level) {
  return CLASS_SPELL_CURRICULUM[classId]?.[level] ?? [];
}

export function getSubclassGrantsAtLevel(subclassId, level) {
  return SUBCLASS_SPELL_GRANTS[subclassId]?.[level] ?? [];
}
