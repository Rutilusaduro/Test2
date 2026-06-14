/**
 * Extended spell catalog — growth-focused, modular by class and subclass.
 */
import { getSubclass } from './subclasses.js';
export const CANTRIPS = [
  { id: 'gentle_plump', name: 'Gentle Plump', slotLevel: 0, school: 'abundance', desc: 'Softly swell a willing target by one stage with a pleasurable surge.', effect: { growth: 1 } },
  { id: 'indulgent_touch', name: 'Indulgent Touch', slotLevel: 0, school: 'abundance', desc: 'Touch a willing creature and cause a small, pleasurable growth surge.', effect: { growth: 1, corruption: 1 } },
  { id: 'feasts_whisper', name: "Feast's Whisper", slotLevel: 0, school: 'enchantment', desc: 'Whisper temptations that make a target crave indulgence.', effect: { charm: 1, corruption: 2 }, environment: { charm: true } },
  { id: 'gorgaras_spark', name: "Gorgara's Spark", slotLevel: 0, school: 'abundance', desc: 'A minor divine spark of growth — can be upcast with higher slots.', effect: { growth: 1 } },
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
];

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
  overflow_cascade: {
    id: 'overflow_cascade', name: 'Overflow Cascade', slotLevel: 4, school: 'abundance',
    desc: 'Chain growth effect rippling across multiple targets.',
    effect: { growth: 1, aoe: true, corruption: 3 },
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
    id: 'true_overflow', name: 'True Overflow', slotLevel: 7, school: 'abundance', minSizeStage: 6,
    desc: 'Permanent or very long-term size stage increases through divine excess.',
    effect: { growth: 3, corruption: 8 },
  },
  mass_indulgence: {
    id: 'mass_indulgence', name: 'Mass Indulgence', slotLevel: 8, school: 'abundance', minSizeStage: 7,
    desc: 'A huge growth ritual affecting many — the town itself seems to swell.',
    effect: { growth: 2, aoe: true, party: true, corruption: 6 },
  },
  gorgaras_awakening: {
    id: 'gorgaras_awakening', name: "Gorgara's Awakening", slotLevel: 9, school: 'abundance', minSizeStage: 8,
    desc: 'Massive area growth event. Multiple characters may leap several size stages.',
    effect: { growth: 4, aoe: true, corruption: 10 },
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
    environment: { fertile: true, soften: true, ritual: true, slick: true },
  },
  divine_plump: {
    id: 'divine_plump', name: 'Divine Plump', slotLevel: 6, school: 'abundance',
    desc: 'Holy light concentrates flesh into sacred, jiggling abundance.',
    effect: { growth: 2, heal: 15, corruption: 6 },
  },
  cascade_of_curves: {
    id: 'cascade_of_curves', name: 'Cascade of Curves', slotLevel: 5, school: 'transmutation',
    desc: 'Rippling transmutation rolls through the body — hip to thigh to belly in waves.',
    effect: { growth: 2, corruption: 5 },
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
      id: 'gorgara_grand_feast', name: "Gorgara's Grand Feast", slotLevel: 5, apCost: 24,
      desc: 'Golden caloric energy explodes across the battlefield.', effect: { growth: 2, aoe: true, heal: 15 },
      overflow: { slotBonus: 0, apCost: 35, effect: { growth: 3, aoe: true, heal: 25, corruption: 6 } },
    },
  ],
  warlock: [
    {
      id: 'gorgara_claim', name: "Gorgara's Claim", slotLevel: 2, apCost: 6,
      desc: 'Remote hunger invocation on a target.', effect: { corruption: 6, growth: 1 },
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

const SPELL_INDEX = new Map([
  ...CANTRIPS.map((s) => [s.id, s]),
  ...Object.values(BONUS_SPELLS).map((s) => [s.id, s]),
  ...Object.values(CLASS_SPELLS).flat().map((s) => [s.id, s]),
]);

export function getSpell(id) {
  return SPELL_INDEX.get(id) ?? null;
}

export function getSpellsForClass(classId) {
  return getSpellsForBuild(classId, null);
}

export function getSpellsForBuild(classId, subclassId) {
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

  return list;
}

export function getSpellForCast(spell, overflow = false) {
  if (!overflow || !spell.overflow) return spell;
  return {
    ...spell,
    name: spell.overflow.name || `${spell.name} (Overflow)`,
    slotLevel: spell.slotLevel + (spell.overflow.slotBonus ?? 1),
    apCost: spell.overflow.apCost ?? spell.apCost,
    effect: { ...spell.effect, ...spell.overflow.effect },
  };
}

export function getSpellEnvironmentTags(spell) {
  const env = spell?.environment ?? {};
  return Object.keys(env).filter((k) => env[k]);
}

export function spellHasEnvironmentUse(spell) {
  return getSpellEnvironmentTags(spell).length > 0
    || spell.effect?.growth || spell.effect?.charm || spell.effect?.feed;
}

export function getCastableSpells(character) {
  return getSpellsForBuild(character.classId, character.subclassId).filter((s) => {
    if (s.slotLevel === 0) return true;
    return character.level >= s.slotLevel + 1 || s.slotLevel <= 1;
  });
}
