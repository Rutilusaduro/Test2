/**
 * Extended spell catalog — growth-focused, modular by class and subclass.
 *
 * Phase 1 schema additions (new optional fields):
 *   targetTypes     — string[]  'creature' | 'object' | 'feature' | 'area' | 'background'
 *   mechanicalTags  — string[]  'control' | 'setup' | 'combo' | 'utility' | 'terrain' | ...
 *   createsStates   — string[]  arcaneStates.js state IDs this spell applies
 *   interactsWith   — string[]  state IDs this spell gets bonuses against
 *   persistentUntil — string    'long_rest' | 'until_triggered' | 'consumed' | 'permanent'
 */
import { getSubclass } from './subclasses.js';
import { getMaxSpellLevelForCharacter } from './spellSlots.js';
export const CANTRIPS = [
  { id: 'gentle_plump', name: 'Gentle Plump', slotLevel: 0, school: 'abundance', desc: 'Softly swell a willing target by one stage with a pleasurable surge.', effect: { growth: 1 } },
  { id: 'indulgent_touch', name: 'Indulgent Touch', slotLevel: 0, school: 'abundance', desc: 'Touch a willing creature and cause a small, pleasurable growth surge.', effect: { growth: 1, corruption: 1 } },
  { id: 'feasts_whisper', name: "Feast's Whisper", slotLevel: 0, school: 'enchantment', desc: 'Whisper temptations that make a target crave indulgence.', effect: { charm: 1, corruption: 2 }, environment: { charm: true } },
  { id: 'gorgaras_spark', name: 'Spark of the Fat Goddess', slotLevel: 0, school: 'abundance', desc: 'A minor spark of your patron\'s hunger — can be upcast with higher slots.', effect: { growth: 1 } },
  { id: 'rich_cream', name: 'Rich Cream', slotLevel: 0, school: 'conjuration', desc: 'Conjure slippery, creamy abundance. Contact causes minor pleasurable weight gain.', effect: { growth: 1, corruption: 2, feed: 1 }, environment: { soften: true, slick: true } },
  { id: 'flavor_burst', name: 'Flavor Burst', slotLevel: 0, school: 'abundance', desc: 'Conjure delicious food that tempts and feeds.', effect: { feed: 1, corruption: 3 }, environment: { fertile: true, soften: true } },
  { id: 'jiggle_charm', name: 'Jiggle Charm', slotLevel: 0, school: 'enchantment', desc: 'Hypnotic sway that charms and distracts.', effect: { charm: 1 }, environment: { charm: true } },
  { id: 'softening_ray', name: 'Softening Ray', slotLevel: 0, school: 'abundance', desc: 'A ray of plush caloric energy.', effect: { growth: 1, corruption: 2 }, environment: { soften: true, swell: true } },
  {
    id: 'caloric_bolt', name: 'Caloric Bolt', slotLevel: 0, school: 'evocation',
    desc: 'Hurl a bolt of concentrated caloric force. Spell attack for overindulgence damage.',
    effect: {
      damage: {
        dice: { count: 1, sides: 10 },
        damageType: 'overindulgence',
        spellAttack: true,
        growthConversion: 0.12,
        range: 6,
      },
    },
  },
  {
    id: 'honeyed_lash', name: 'Honeyed Lash', slotLevel: 0, school: 'conjuration',
    desc: 'A whip of golden syrup snaps at a foe in melee reach. Spell attack.',
    effect: {
      damage: {
        dice: { count: 1, sides: 8 },
        damageType: 'pleasurable_pressure',
        spellAttack: true,
        melee: true,
        growthConversion: 0.18,
        range: 1,
      },
    },
  },
  {
    id: 'gluttons_ember', name: "Glutton's Ember", slotLevel: 0, school: 'abundance',
    desc: 'A spark of divine excess burns the target — abundance damage with a sting of corruption.',
    effect: {
      damage: {
        dice: { count: 1, sides: 8 },
        damageType: 'abundance_overload',
        spellAttack: true,
        corruptionOnHit: 3,
        growthConversion: 0.2,
        range: 6,
      },
    },
  },
  {
    id: 'syrup_splash', name: 'Syrup Splash', slotLevel: 0, school: 'conjuration',
    desc: 'Splash hot syrup in a small area. Creatures make a DEX save or take sticky abundance damage.',
    effect: {
      damage: {
        dice: { count: 1, sides: 6 },
        damageType: 'overindulgence',
        save: 'dex',
        halfOnSuccess: true,
        aoe: true,
        radius: 2,
        range: 5,
        growthConversion: 0.15,
      },
    },
  },
  // ── Phase 1 Foundation Cantrip ──────────────────────────────────────────────
  {
    id: 'mage_hand', name: 'Mage Hand', slotLevel: 0, school: 'conjuration',
    desc: 'Conjure a spectral hand to manipulate objects at range, feed willing or restrained targets, or trigger a bound Calorie Bond from a distance. Creates a mage_hand_active state that persists until used.',
    effect: { feed: 1 },
    targetTypes: ['creature', 'object', 'feature'],
    mechanicalTags: ['utility', 'setup', 'remote_feed'],
    createsStates: ['mage_hand_active'],
    interactsWith: ['bound_calorie_transfer', 'quicksand_restrained'],
    persistentUntil: 'consumed',
  },
];

/**
 * Phase 1 utility spells — class-agnostic, grantable by any build or granted by the
 * DM / story unlock. Listed in the SPELL_INDEX and castable via overworldSpells.js
 * special-case paths.
 */
export const UTILITY_SPELLS = {
  magic_mouth: {
    id: 'magic_mouth', name: 'Magic Mouth', slotLevel: 2, school: 'illusion',
    desc: 'Bind an object (food container, shrine, chest) to a creature. Any calories fed to that object are magically transferred to the linked person — a perfect long-range feeding scheme.',
    effect: {},   // growth happens via bound_calorie_transfer state resolution
    targetTypes: ['object', 'feature', 'creature'],
    mechanicalTags: ['setup', 'persistent', 'remote_feed', 'weight_scheme'],
    createsStates: ['bound_calorie_transfer'],
    interactsWith: ['mage_hand_active'],
    persistentUntil: 'until_long_rest',
    environment: { ritual: true },
  },
  stone_shape: {
    id: 'stone_shape', name: 'Stone Shape', slotLevel: 4, school: 'transmutation',
    desc: 'Shape stone, earth, or similar material into useful forms — a sturdy table, a large basin (holds liquids), simple stone cuffs that restrain a creature, or small structures. Shaped items persist until destroyed.',
    effect: {},   // creates physical shaped_stone state with chosen form
    targetTypes: ['object', 'feature', 'area', 'creature'],
    mechanicalTags: ['utility', 'setup', 'control', 'terrain'],
    createsStates: ['shaped_stone'],
    interactsWith: ['quicksand_restrained'],
    persistentUntil: 'permanent',
    environment: { soften: true },
  },
  suggestion: {
    id: 'suggestion', name: 'Suggestion', slotLevel: 2, school: 'enchantment',
    desc: 'Plant a subtle magical compulsion in a target — "You feel incredibly hungry, go eat the nearest rich food" or "Indulge yourself freely." Resolves immediately with bonus growth if the target is already restrained.',
    effect: { charm: 1, corruption: 4 },
    targetTypes: ['creature', 'background'],
    mechanicalTags: ['control', 'combo', 'setup', 'social'],
    createsStates: ['suggestion_active'],
    interactsWith: ['quicksand_restrained', 'restrained'],
    persistentUntil: 'until_triggered',
    environment: { charm: true },
  },
  quicksand: {
    id: 'quicksand', name: 'Quicksand', slotLevel: 3, school: 'transmutation',
    desc: 'Transform a patch of terrain into magical quicksand. Named targets or background crowd members sink to waist depth (quicksand_restrained). Excellent setup — restrained targets are far more susceptible to Suggestion and feeding magic.',
    effect: {},   // applies quicksand_restrained to targets
    targetTypes: ['area', 'creature', 'background'],
    mechanicalTags: ['control', 'terrain', 'setup', 'aoe'],
    createsStates: ['quicksand_restrained'],
    interactsWith: ['suggestion_active'],
    persistentUntil: 'until_long_rest',
    environment: { slick: true, soften: true },
  },
  conjure_vines: {
    id: 'conjure_vines', name: 'Conjure Vines', slotLevel: 2, school: 'conjuration',
    apCost: 15,
    desc: 'Summon thick magical vines to bind or suspend a target. Bound: vines coil around wrists, ankles, and waist — restrained in place, belly exposed, feeding trivial. Suspended: target hoisted face-down off the ground, hanging helplessly — gravity-assisted feeding, weight permitting.',
    effect: {},
    targetTypes: ['creature'],
    mechanicalTags: ['control', 'restraint', 'setup', 'suspend'],
    createsStates: ['vine_bound', 'vine_suspended'],
    interactsWith: ['suggestion_active', 'bound_calorie_transfer'],
    persistentUntil: 'until_triggered',
  },
};

/** Spells granted by specific subclasses or shared across classes. */
export const BONUS_SPELLS = {
  abundant_berry: {
    id: 'abundant_berry', name: 'Abundant Berry', slotLevel: 1, school: 'abundance',
    desc: 'Berries that cause noticeable, delicious weight gain when eaten.',
    effect: { feed: 1, growth: 1, corruption: 3 },
  },
  expand_minor: {
    id: 'expand_minor', name: 'Expand Minor', slotLevel: 1, school: 'transmutation',
    desc: 'Target grows slightly toward the next size stage with euphoric sensation.',
    effect: { growth: 1 },
  },
  weight_of_desire: {
    id: 'weight_of_desire', name: 'Weight of Desire', slotLevel: 1, school: 'enchantment',
    desc: 'Target feels heavier and slower as their body yearns to grow.',
    effect: { corruption: 4, growth: 1 },
  },
  overflowing_charm: {
    id: 'overflowing_charm', name: 'Overflowing Charm', slotLevel: 1, school: 'enchantment',
    desc: 'Charisma-based growth charm — desire becomes visible softness.',
    effect: { charm: 1, growth: 1, corruption: 3 },
  },
  glutinous_surge: {
    id: 'glutinous_surge', name: 'Glutinous Surge', slotLevel: 2, school: 'abundance',
    desc: 'Rapid, sensual growth on a target — Growth Damage made manifest.',
    effect: { growth: 2, corruption: 5 },
  },
  feast_of_the_goddess: {
    id: 'feast_of_the_goddess', name: 'Feast of the Goddess', slotLevel: 2, school: 'abundance',
    desc: 'A magical banquet that swells all who partake.',
    effect: { growth: 1, feed: 2, aoe: true, corruption: 4 },
    ritual: true,
    environment: { fertile: true, ritual: true },
  },
  form_of_abundance: {
    id: 'form_of_abundance', name: 'Form of Abundance', slotLevel: 2, school: 'transmutation',
    desc: 'Major growth toward higher size stages. Concentration. Pleasurable and powerful.',
    effect: { growth: 2, corruption: 4 },
    environment: { swell: true, crush: true },
  },
  pleasurable_pressure: {
    id: 'pleasurable_pressure', name: 'Pleasurable Pressure', slotLevel: 3, school: 'evocation',
    desc: 'Crushing but euphoric force that causes growth instead of harm.',
    effect: { growth: 2, corruption: 6 },
    environment: { crush: true, swell: true },
  },
  sated_storm: {
    id: 'sated_storm', name: 'Sated Storm', slotLevel: 3, school: 'evocation', apCost: 14,
    desc: 'A thunderhead of honeyed force bursts overhead, battering foes with caloric lightning.',
    effect: {
      damage: {
        dice: { count: 6, sides: 6 },
        damageType: 'overindulgence',
        save: 'dex',
        halfOnSuccess: true,
        aoe: true,
        radius: 2,
        range: 6,
        growthConversion: 0.2,
      },
    },
    environment: { slick: true },
  },
  overflow_cascade: {
    id: 'overflow_cascade', name: 'Overflow Cascade', slotLevel: 4, school: 'abundance',
    desc: 'Chain growth effect rippling across multiple targets.',
    effect: { growth: 1, aoe: true, corruption: 3 },
  },
  velvet_gravity: {
    id: 'velvet_gravity', name: 'Velvet Gravity', slotLevel: 4, school: 'abundance', apCost: 18,
    desc: 'You thicken the air with lush gravity that drags bodies downward into plush, helpless abundance.',
    effect: { growth: 1, aoe: true, corruption: 4 },
    environment: { crush: true, soften: true },
  },
  eternal_indulgence: {
    id: 'eternal_indulgence', name: 'Eternal Indulgence', slotLevel: 4, school: 'abundance',
    desc: 'Long-duration growth aura of luxurious fullness.',
    effect: { growth: 1, buff: 'indulgence', party: true },
  },
  form_of_the_devoted: {
    id: 'form_of_the_devoted', name: 'Form of the Devoted', slotLevel: 4, school: 'transmutation',
    desc: 'Transform a target into a curvier, larger, more devoted version of themselves.',
    effect: { growth: 2, corruption: 5, charm: 1 },
  },
  true_overflow: {
    id: 'true_overflow', name: 'True Overflow', slotLevel: 7, school: 'abundance', apCost: 32, minSizeStage: 6,
    desc: 'Permanent or very long-term size stage increases through divine excess.',
    effect: { growth: 3, corruption: 8 },
  },
  velvet_cataclysm: {
    id: 'velvet_cataclysm', name: 'Velvet Cataclysm', slotLevel: 7, school: 'evocation', apCost: 32, minSizeStage: 6,
    desc: 'A ruinous blossom of caloric pressure detonates across the battlefield, breaking resistance beneath sumptuous force.',
    effect: {
      damage: {
        dice: { count: 8, sides: 8 },
        damageType: 'abundance_overload',
        save: 'dex',
        halfOnSuccess: true,
        aoe: true,
        radius: 3,
        range: 6,
        growthConversion: 0.25,
      },
    },
    environment: { crush: true },
  },
  queenly_metamorphosis: {
    id: 'queenly_metamorphosis', name: 'Queenly Metamorphosis', slotLevel: 7, school: 'transmutation', apCost: 32, minSizeStage: 6,
    desc: 'An ally is recast in regal softness, rising into a fuller, more radiant shape wreathed in spellcraft.',
    effect: { growth: 3, heal: 24, buff: 'spellpower' },
  },
  mass_indulgence: {
    id: 'mass_indulgence', name: 'Mass Indulgence', slotLevel: 8, school: 'abundance', apCost: 36, minSizeStage: 7,
    desc: 'A huge growth ritual affecting many — the town itself seems to swell.',
    effect: { growth: 2, aoe: true, party: true, corruption: 6 },
  },
  palace_of_plenty: {
    id: 'palace_of_plenty', name: 'Palace of Plenty', slotLevel: 8, school: 'abundance', apCost: 36, minSizeStage: 7,
    desc: 'You unfold a royal banquet-hall of living abundance, restoring allies while every breath invites more divine softness.',
    effect: { growth: 2, aoe: true, party: true, heal: 30 },
    environment: { ritual: true, fertile: true, swell: true },
  },
  gorgaras_awakening: {
    id: 'gorgaras_awakening', name: 'Awakening of the Fat Goddess', slotLevel: 9, school: 'abundance', apCost: 42, minSizeStage: 8,
    desc: 'Your patron surges through you — massive area growth as the Hunger Beyond stirs awake.',
    effect: { growth: 4, aoe: true, corruption: 10 },
  },
  worldwell_communion: {
    id: 'worldwell_communion', name: 'Worldwell Communion', slotLevel: 9, school: 'conjuration', apCost: 44, minSizeStage: 8,
    desc: 'You crack the earth open to a hidden worldwell of cream and nectar, flooding the land with holy excess.',
    effect: { growth: 3, aoe: true, corruption: 8 },
    environment: { ritual: true, fertile: true, slick: true },
  },
  apotheosis_feast: {
    id: 'apotheosis_feast', name: 'Apotheosis Feast', slotLevel: 9, school: 'abundance', apCost: 42, minSizeStage: 8,
    desc: 'The final course of the goddess lays itself before your allies, mending them, empowering them, and lifting them toward living legend.',
    effect: { growth: 4, aoe: true, party: true, heal: 40, buff: 'spellpower' },
    environment: { ritual: true, fertile: true, swell: true },
  },
  honeyed_overflow: {
    id: 'honeyed_overflow', name: 'Honeyed Overflow', slotLevel: 1, school: 'enchantment',
    desc: 'Sweet magic drips from your lips — targets swell as they listen, helpless and happy.',
    effect: { charm: 1, growth: 1, corruption: 4 },
  },
  swell_kiss: {
    id: 'swell_kiss', name: 'Swell Kiss', slotLevel: 1, school: 'abundance',
    desc: 'A kiss that transfers caloric blessing lip to lip, belly to belly.',
    effect: { growth: 1, corruption: 3, feed: 1 },
  },
  banquet_mist: {
    id: 'banquet_mist', name: 'Banquet Mist', slotLevel: 3, school: 'conjuration',
    desc: 'Perfumed fog of impossible feasts — all who breathe it grow drunk on fullness.',
    effect: { growth: 1, aoe: true, corruption: 5, feed: 1 },
    ritual: true,
    environment: { fertile: true, soften: true, ritual: true, slick: true },
  },
  gorge_field: {
    id: 'gorge_field', name: 'Gorge Field', slotLevel: 4, school: 'abundance', apCost: 18,
    desc: 'Ritual abundance saturates the land — crops swell, bellies follow, the region remembers feast.',
    effect: { growth: 2, aoe: true, corruption: 6 },
    ritual: true,
    environment: { fertile: true, ritual: true, swell: true },
  },
  gorgara_commune: {
    id: 'gorgara_commune', name: 'Commune with the Fat Goddess', slotLevel: 5, school: 'abundance', apCost: 22,
    desc: 'Ritual prayer at the thin places — your patron answers with warmth, counsel, and hunger.',
    effect: { heal: 25, corruption: 4, buff: 'spellpower' },
    ritual: true,
    environment: { ritual: true, abundance: true, apotheosis: true },
  },
  hearth_blessing: {
    id: 'hearth_blessing', name: 'Hearth Blessing', slotLevel: 3, school: 'abundance', apCost: 14,
    desc: 'Bless a home or shrine so every meal served there swells the faithful with gentle, sacred pounds.',
    effect: { growth: 1, feed: 2, heal: 10, corruption: 3 },
    ritual: true,
    environment: { fertile: true, ritual: true, soften: true },
  },
  the_feast_without_end: {
    id: 'the_feast_without_end', name: 'The Feast Without End', slotLevel: 6, school: 'conjuration', apCost: 26,
    desc: 'A ritual table that never empties — abundance loops until the Wheel begs mercy.',
    effect: { growth: 2, feed: 3, aoe: true, party: true, heal: 15 },
    ritual: true,
    environment: { fertile: true, ritual: true, swell: true },
  },
  divine_plump: {
    id: 'divine_plump', name: 'Divine Plump', slotLevel: 6, school: 'abundance', apCost: 28,
    desc: 'Holy light concentrates flesh into sacred, jiggling abundance.',
    effect: { growth: 2, heal: 15, corruption: 6 },
  },
  cathedral_of_cream: {
    id: 'cathedral_of_cream', name: 'Cathedral of Cream', slotLevel: 6, school: 'conjuration', apCost: 28,
    desc: 'A sanctuary of whipped radiance rises around your allies, mending them and blessing them with sumptuous growth.',
    effect: { growth: 2, heal: 20, aoe: true, party: true },
    environment: { fertile: true, ritual: true, soften: true, slick: true },
  },
  cascade_of_curves: {
    id: 'cascade_of_curves', name: 'Cascade of Curves', slotLevel: 5, school: 'transmutation',
    desc: 'Rippling transmutation rolls through the body — hip to thigh to belly in waves.',
    effect: { growth: 2, corruption: 5 },
  },
  throne_of_flesh: {
    id: 'throne_of_flesh', name: 'Throne of Flesh', slotLevel: 5, school: 'transmutation', apCost: 24,
    desc: 'You enthrone an ally in living softness, hardening their presence and swelling them into sacred resilience.',
    effect: { growth: 2, heal: 18, buff: 'altar' },
  },
  lovers_feast: {
    id: 'lovers_feast', name: "Lover's Feast", slotLevel: 3, school: 'abundance',
    desc: 'An intimate spell for two — shared growth, shared pleasure, shared devotion.',
    effect: { growth: 2, feed: 1, corruption: 4 },
  },
  matrons_blessing: {
    id: 'matrons_blessing', name: "Matron's Blessing", slotLevel: 4, school: 'abundance',
    desc: 'Motherly warmth swells the target safely — nurturing, vast, adored.',
    effect: { growth: 2, heal: 20, corruption: 3 },
  },
};

export const CLASS_SPELLS = {
  bard: [
    {
      id: 'ballad_bottomless', name: 'Ballad of the Bottomless', slotLevel: 2, apCost: 8,
      desc: 'A growth ballad that swells all who hear it.', effect: { growth: 1, aoe: true },
      overflow: { name: 'Ballad of the Bottomless (Overflow)', slotBonus: 1, apCost: 15, effect: { growth: 2, aoe: true, corruption: 4 } },
    },
    {
      id: 'feast_song', name: 'Feast Song', slotLevel: 3, apCost: 12,
      desc: 'Your song force-feeds enemies with phantom delicacies.', effect: { feed: 2, corruption: 5 },
    },
    {
      id: 'abundance_crescendo', name: 'Abundance Crescendo', slotLevel: 5, apCost: 22,
      desc: 'Party-wide growth surge with irresistible melody.', effect: { growth: 2, aoe: true, party: true },
      overflow: { name: 'Grand Crescendo', slotBonus: 0, apCost: 30, effect: { growth: 3, aoe: true, heal: 10 } },
    },
  ],
  wizard: [
    {
      id: 'cauldron_flesh', name: 'Cauldron of Flesh', slotLevel: 2, apCost: 10,
      desc: 'Experimental magical feeding apparatus.', effect: { growth: 2, corruption: 4 },
      overflow: { slotBonus: 1, apCost: 18, effect: { growth: 3, corruption: 8 } },
    },
    {
      id: 'overflowing_script', name: 'Overflowing Script', slotLevel: 3, apCost: 14,
      desc: 'Runes that rewrite caloric density.', effect: { growth: 1, buff: 'spellpower' },
    },
    {
      id: 'grand_transmutation', name: 'Grand Transmutation', slotLevel: 5, apCost: 25,
      desc: 'Transmute air into pure abundance.', effect: { growth: 3, corruption: 8 },
    },
  ],
  cleric: [
    {
      id: 'prayer_full_belly', name: 'Prayer of the Full Belly', slotLevel: 2, apCost: 8,
      desc: 'Divine blessing of comfortable fullness.', effect: { growth: 1, heal: 10 },
    },
    {
      id: 'living_altar', name: 'Living Altar', slotLevel: 3, apCost: 14,
      desc: 'Transform ally into immovable feast shrine.', effect: { buff: 'altar', growth: 1 },
    },
    {
      id: 'gorgara_grand_feast', name: 'Grand Feast of the Fat Goddess', slotLevel: 5, apCost: 24,
      desc: 'Your patron\'s golden hunger explodes across the battlefield.', effect: { growth: 2, aoe: true, heal: 15 },
      overflow: { slotBonus: 0, apCost: 35, effect: { growth: 3, aoe: true, heal: 25, corruption: 6 } },
    },
  ],
  warlock: [
    {
      id: 'gorgara_claim', name: 'Claim of the Fat Goddess', slotLevel: 2, apCost: 6,
      desc: 'Invoke your patron\'s remote hunger upon a target.', effect: { corruption: 6, growth: 1 },
    },
    {
      id: 'essence_drain', name: 'Essence Drain', slotLevel: 3, apCost: 12,
      desc: 'Drain enemy essence to fuel your growth.', effect: { drain: 1, selfGrowth: 1 },
    },
    {
      id: 'hunger_pact', name: 'Hunger Pact', slotLevel: 5, apCost: 20,
      desc: 'Pact-fueled growth surge.', effect: { growth: 3, selfGrowth: 1 },
      overflow: { slotBonus: 0, apCost: 28, effect: { growth: 4, selfGrowth: 2, aoe: true } },
    },
  ],
};

/**
 * Bonus-action spells — quick/minor magic castable alongside one Action per turn.
 * indulgent_touch: tactile one-touch surge — intimate, fast
 * jiggle_charm: brief hypnotic sway — distraction without full commitment
 * gorgaras_spark: minor divine self-spark — personal nudge of growth
 * rich_cream: conjure slick cream — fast conjured snack contact
 * abundant_berry: hand-fed berry — minor nourishing bite
 */
const BONUS_ACTION_SPELL_IDS = new Set([
  'indulgent_touch',
  'jiggle_charm',
  'gorgaras_spark',
  'rich_cream',
  'abundant_berry',
]);

function normalizeSpell(spell) {
  if (!spell) return spell;
  return {
    ...spell,
    actionType: BONUS_ACTION_SPELL_IDS.has(spell.id) ? 'bonus' : (spell.actionType || 'action'),
  };
}

const SPELL_INDEX = new Map([
  ...CANTRIPS.map((s) => [s.id, normalizeSpell(s)]),
  ...Object.values(BONUS_SPELLS).map((s) => [s.id, normalizeSpell(s)]),
  ...Object.values(CLASS_SPELLS).flat().map((s) => [s.id, normalizeSpell(s)]),
  ...Object.values(UTILITY_SPELLS).map((s) => [s.id, normalizeSpell(s)]),
]);

export function getSpell(id) {
  return SPELL_INDEX.get(id) ?? null;
}

/** All spells in the catalog at a given slot level (cantrips = 0). */
export function getSpellsBySlotLevel(slotLevel) {
  return [...SPELL_INDEX.values()].filter((s) => (s.slotLevel ?? 0) === slotLevel);
}

export function getSpellsForClass(classId) {
  return getSpellsForBuild(classId, null);
}

export function getSpellsForBuild(classId, subclassId, opts = {}) {
  const seen = new Set();
  const list = [];

  const add = (spell) => {
    if (!spell || seen.has(spell.id)) return;
    seen.add(spell.id);
    list.push(spell);
  };

  for (const s of CANTRIPS) add(s);
  for (const s of CLASS_SPELLS[classId] || []) add(s);

  if (subclassId) {
    const sub = getSubclass(subclassId);
    for (const id of sub?.bonusSpellIds ?? []) {
      add(BONUS_SPELLS[id] || getSpell(id));
    }
  }

  // Utility spells are available to all classes when unlocked
  if (opts.includeUtility) {
    for (const s of Object.values(UTILITY_SPELLS)) add(s);
  }

  return list;
}

/** Get all utility/foundation spells (grantable by story or DM unlock). */
export function getUtilitySpells() {
  return Object.values(UTILITY_SPELLS).map(normalizeSpell);
}

export function getSpellForCast(spell, overflow = false) {
  const base = normalizeSpell(spell);
  if (!overflow || !base.overflow) return base;
  return normalizeSpell({
    ...base,
    name: base.overflow.name || `${base.name} (Overflow)`,
    slotLevel: base.slotLevel + (base.overflow.slotBonus ?? 1),
    apCost: base.overflow.apCost ?? base.apCost,
    effect: { ...base.effect, ...base.overflow.effect },
  });
}

export function getSpellEnvironmentTags(spell) {
  const env = spell?.environment ?? {};
  const tags = Object.keys(env).filter((k) => env[k]);
  if (spell?.ritual && !tags.includes('ritual')) tags.push('ritual');
  return tags;
}

export function isRitualSpell(spell) {
  if (!spell) return false;
  return Boolean(spell.ritual || spell.environment?.ritual);
}

/** Return every spell id in the catalog — used by debug unlock mode. */
export function getAllSpellIds() {
  return [...SPELL_INDEX.keys()];
}

export function getRitualApCost(spell) {
  if (!spell) return 0;
  return spell.apCost ?? Math.max(8, (spell.slotLevel || 1) * 6);
}

export function spellHasEnvironmentUse(spell) {
  return getSpellEnvironmentTags(spell).length > 0
    || spell.effect?.growth || spell.effect?.charm || spell.effect?.feed;
}

export function getCastableSpells(character) {
  const maxSpellLevel = getMaxSpellLevelForCharacter(character);
  return getSpellsForBuild(character.classId, character.subclassId).filter((s) => {
    if (s.slotLevel === 0) return true;
    return s.slotLevel <= maxSpellLevel;
  });
}
