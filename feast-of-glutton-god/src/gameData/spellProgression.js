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
    spellsPerLevel: 2,
    magicalSecretsLevels: [10, 14, 18],
    magicalSecretsCount: 2,
    description: 'Learn two new spells per level from your growing curriculum.',
  },
  warlock: {
    type: 'known',
    label: 'Pact Spells',
    spellsPerLevel: 2,
    description: 'Learn two powerful pact spells when your pact magic deepens.',
  },
};

/**
 * Spells automatically granted at specific character levels (class curriculum).
 * `growth` spells are sorted first when offering choices.
 */
export const CLASS_SPELL_CURRICULUM = {
  wizard: {
    1: ['expand_minor', 'abundant_berry', 'weight_of_desire', 'honeyed_overflow'],
    2: ['weight_of_desire', 'overflowing_charm', 'honeyed_overflow'],
    3: ['glutinous_surge', 'form_of_abundance', 'cauldron_flesh'],
    4: ['form_of_abundance', 'feast_of_the_goddess', 'cauldron_flesh'],
    5: ['overflowing_script', 'pleasurable_pressure', 'banquet_mist'],
    6: ['overflowing_script', 'lovers_feast', 'sated_storm'],
    7: ['overflow_cascade', 'form_of_the_devoted', 'velvet_gravity'],
    8: ['eternal_indulgence', 'velvet_gravity', 'form_of_the_devoted'],
    9: ['grand_transmutation', 'cascade_of_curves', 'throne_of_flesh', 'gorge_field'],
    10: ['grand_transmutation', 'cascade_of_curves', 'throne_of_flesh'],
    11: ['divine_plump', 'cathedral_of_cream', 'gorgara_commune'],
    12: ['divine_plump', 'cathedral_of_cream'],
    13: ['true_overflow', 'velvet_cataclysm', 'queenly_metamorphosis'],
    14: ['true_overflow', 'velvet_cataclysm', 'queenly_metamorphosis'],
    15: ['mass_indulgence', 'palace_of_plenty', 'the_feast_without_end'],
    16: ['mass_indulgence', 'palace_of_plenty'],
    17: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    18: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    19: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    20: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
  },
  cleric: {
    1: ['abundant_berry', 'expand_minor', 'swell_kiss', 'honeyed_overflow'],
    2: ['swell_kiss', 'overflowing_charm', 'honeyed_overflow'],
    3: ['glutinous_surge', 'feast_of_the_goddess', 'prayer_full_belly'],
    4: ['form_of_abundance', 'feast_of_the_goddess', 'prayer_full_belly'],
    5: ['living_altar', 'pleasurable_pressure', 'lovers_feast'],
    6: ['banquet_mist', 'sated_storm', 'living_altar'],
    7: ['eternal_indulgence', 'overflow_cascade', 'matrons_blessing', 'hearth_blessing'],
    8: ['velvet_gravity', 'overflow_cascade', 'matrons_blessing'],
    9: ['gorgara_grand_feast', 'cascade_of_curves', 'throne_of_flesh'],
    10: ['gorgara_grand_feast', 'cascade_of_curves', 'throne_of_flesh'],
    11: ['divine_plump', 'cathedral_of_cream', 'gorgara_commune'],
    12: ['divine_plump', 'cathedral_of_cream'],
    13: ['true_overflow', 'queenly_metamorphosis'],
    14: ['true_overflow', 'queenly_metamorphosis'],
    15: ['mass_indulgence', 'palace_of_plenty', 'the_feast_without_end'],
    16: ['mass_indulgence', 'palace_of_plenty'],
    17: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    18: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    19: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    20: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
  },
  bard: {
    1: ['overflowing_charm', 'expand_minor', 'honeyed_overflow'],
    2: ['expand_minor', 'swell_kiss', 'honeyed_overflow'],
    3: ['weight_of_desire', 'overflowing_charm', 'swell_kiss'],
    4: ['weight_of_desire', 'overflowing_charm', 'honeyed_overflow'],
    5: ['ballad_bottomless', 'glutinous_surge', 'feast_of_the_goddess'],
    6: ['ballad_bottomless', 'form_of_abundance', 'feast_of_the_goddess'],
    7: ['ballad_bottomless', 'form_of_abundance', 'prayer_full_belly'],
    8: ['ballad_bottomless', 'glutinous_surge', 'prayer_full_belly'],
    9: ['feast_song', 'lovers_feast', 'banquet_mist', 'sated_storm'],
    10: ['feast_song', 'lovers_feast', 'sated_storm'],
    11: ['lovers_feast', 'banquet_mist', 'sated_storm'],
    12: ['lovers_feast', 'banquet_mist', 'sated_storm'],
    13: ['eternal_indulgence', 'matrons_blessing', 'velvet_gravity'],
    14: ['eternal_indulgence', 'matrons_blessing', 'velvet_gravity'],
    15: ['eternal_indulgence', 'overflow_cascade', 'velvet_gravity'],
    16: ['eternal_indulgence', 'overflow_cascade', 'velvet_gravity'],
    17: ['abundance_crescendo', 'cascade_of_curves', 'throne_of_flesh'],
    18: ['abundance_crescendo', 'cascade_of_curves', 'throne_of_flesh'],
    19: ['abundance_crescendo', 'cascade_of_curves', 'throne_of_flesh'],
    20: ['abundance_crescendo', 'cascade_of_curves', 'throne_of_flesh'],
  },
  warlock: {
    1: ['weight_of_desire', 'expand_minor', 'honeyed_overflow'],
    2: ['overflowing_charm', 'weight_of_desire', 'swell_kiss'],
    3: ['gorgara_claim', 'glutinous_surge', 'form_of_abundance'],
    4: ['gorgara_claim', 'feast_of_the_goddess', 'form_of_abundance'],
    5: ['essence_drain', 'banquet_mist', 'sated_storm'],
    6: ['essence_drain', 'lovers_feast', 'sated_storm'],
    7: ['velvet_gravity', 'overflow_cascade', 'eternal_indulgence'],
    8: ['velvet_gravity', 'overflow_cascade', 'eternal_indulgence'],
    9: ['hunger_pact', 'cascade_of_curves', 'throne_of_flesh'],
    10: ['hunger_pact', 'cascade_of_curves', 'throne_of_flesh'],
    11: ['divine_plump', 'cathedral_of_cream', 'gorgara_commune'],
    12: ['divine_plump', 'cathedral_of_cream'],
    13: ['true_overflow', 'velvet_cataclysm', 'queenly_metamorphosis'],
    14: ['true_overflow', 'velvet_cataclysm', 'queenly_metamorphosis'],
    15: ['mass_indulgence', 'palace_of_plenty', 'the_feast_without_end'],
    16: ['mass_indulgence', 'palace_of_plenty'],
    17: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    18: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    19: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
    20: ['gorgaras_awakening', 'worldwell_communion', 'apotheosis_feast'],
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
  12: 'cascade_of_curves',
};

export function getLearningModel(classId) {
  return SPELL_LEARNING_MODEL[classId] || SPELL_LEARNING_MODEL.bard;
}

export function getCurriculumForLevel(classId, level) {
  return CLASS_SPELL_CURRICULUM[classId]?.[level] ?? [];
}

/** All leveled spells unlocked in the curriculum up to this character level. */
export function getUnlockedSpellPool(classId, upToLevel) {
  const ids = new Set();
  for (let lvl = 1; lvl <= upToLevel; lvl++) {
    for (const id of getCurriculumForLevel(classId, lvl)) ids.add(id);
  }
  return [...ids];
}

export function getSubclassGrantsAtLevel(subclassId, level) {
  return SUBCLASS_SPELL_GRANTS[subclassId]?.[level] ?? [];
}
