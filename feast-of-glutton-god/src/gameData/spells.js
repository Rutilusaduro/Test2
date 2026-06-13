/**
 * Spell definitions — slotLevel 0 = cantrip (at-will).
 * apCost: cast using AP when slots exhausted.
 * overflow: heightened "gluttonous" version (+slot, +AP, +growth).
 */
export const CANTRIPS = [
  { id: "gentle_plump", name: "Gentle Plump", slotLevel: 0, school: "abundance", desc: "Softly swell a target by one stage.", effect: { growth: 1 } },
  { id: "flavor_burst", name: "Flavor Burst", slotLevel: 0, school: "abundance", desc: "Conjure delicious food that tempts and feeds.", effect: { feed: 1, corruption: 3 } },
  { id: "jiggle_charm", name: "Jiggle Charm", slotLevel: 0, school: "enchantment", desc: "Hypnotic sway that charms and distracts.", effect: { charm: 1 } },
  { id: "softening_ray", name: "Softening Ray", slotLevel: 0, school: "abundance", desc: "A ray of plush caloric energy.", effect: { growth: 1, corruption: 2 } },
];

export const CLASS_SPELLS = {
  bard: [
    {
      id: "ballad_bottomless", name: "Ballad of the Bottomless", slotLevel: 2, apCost: 8,
      desc: "A growth ballad that swells all who hear it.", effect: { growth: 1, aoe: true },
      overflow: { name: "Ballad of the Bottomless (Overflow)", slotBonus: 1, apCost: 15, effect: { growth: 2, aoe: true, corruption: 4 } },
    },
    {
      id: "feast_song", name: "Feast Song", slotLevel: 3, apCost: 12,
      desc: "Your song force-feeds enemies with phantom delicacies.", effect: { feed: 2, corruption: 5 },
    },
    {
      id: "abundance_crescendo", name: "Abundance Crescendo", slotLevel: 5, apCost: 22,
      desc: "Party-wide growth surge with irresistible melody.", effect: { growth: 2, aoe: true, party: true },
      overflow: { name: "Grand Crescendo", slotBonus: 0, apCost: 30, effect: { growth: 3, aoe: true, heal: 10 } },
    },
  ],
  wizard: [
    {
      id: "cauldron_flesh", name: "Cauldron of Flesh", slotLevel: 2, apCost: 10,
      desc: "Experimental magical feeding apparatus.", effect: { growth: 2, corruption: 4 },
      overflow: { slotBonus: 1, apCost: 18, effect: { growth: 3, corruption: 8 } },
    },
    {
      id: "overflowing_script", name: "Overflowing Script", slotLevel: 3, apCost: 14,
      desc: "Runes that rewrite caloric density.", effect: { growth: 1, buff: "spellpower" },
    },
    {
      id: "grand_transmutation", name: "Grand Transmutation", slotLevel: 5, apCost: 25,
      desc: "Transmute air into pure abundance.", effect: { growth: 3, corruption: 8 },
    },
  ],
  cleric: [
    {
      id: "prayer_full_belly", name: "Prayer of the Full Belly", slotLevel: 2, apCost: 8,
      desc: "Divine blessing of comfortable fullness.", effect: { growth: 1, heal: 10 },
    },
    {
      id: "living_altar", name: "Living Altar", slotLevel: 3, apCost: 14,
      desc: "Transform ally into immovable feast shrine.", effect: { buff: "altar", growth: 1 },
    },
    {
      id: "gorgara_grand_feast", name: "Gorgara's Grand Feast", slotLevel: 5, apCost: 24,
      desc: "Golden caloric energy explodes across the battlefield.", effect: { growth: 2, aoe: true, heal: 15 },
      overflow: { slotBonus: 0, apCost: 35, effect: { growth: 3, aoe: true, heal: 25, corruption: 6 } },
    },
  ],
  warlock: [
    {
      id: "gorgara_claim", name: "Gorgara's Claim", slotLevel: 2, apCost: 6,
      desc: "Remote hunger invocation on a target.", effect: { corruption: 6, growth: 1 },
    },
    {
      id: "essence_drain", name: "Essence Drain", slotLevel: 3, apCost: 12,
      desc: "Drain enemy essence to fuel your growth.", effect: { drain: 1, selfGrowth: 1 },
    },
    {
      id: "hunger_pact", name: "Hunger Pact", slotLevel: 5, apCost: 20,
      desc: "Pact-fueled growth surge.", effect: { growth: 3, selfGrowth: 1 },
      overflow: { slotBonus: 0, apCost: 28, effect: { growth: 4, selfGrowth: 2, aoe: true } },
    },
  ],
};

export function getSpellsForClass(classId) {
  return [...CANTRIPS, ...(CLASS_SPELLS[classId] || [])];
}

export function getSpell(id) {
  for (const list of Object.values(CLASS_SPELLS)) {
    const found = list.find((s) => s.id === id);
    if (found) return found;
  }
  return CANTRIPS.find((s) => s.id === id);
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

/** Spells castable with current slots (or cantrips / AP) */
export function getCastableSpells(character) {
  return getSpellsForClass(character.classId).filter((s) => {
    if (s.slotLevel === 0) return true;
    return character.level >= s.slotLevel + 1 || s.slotLevel <= 1;
  });
}
