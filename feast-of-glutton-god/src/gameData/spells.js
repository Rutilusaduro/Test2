export const CANTRIPS = [
  { id: "gentle_plump", name: "Gentle Plump", mp: 0, ap: 0, desc: "Softly swell a target by one stage.", effect: { growth: 1 } },
  { id: "flavor_burst", name: "Flavor Burst", mp: 0, ap: 0, desc: "Conjure delicious food that tempts and feeds.", effect: { feed: 1, corruption: 3 } },
  { id: "jiggle_charm", name: "Jiggle Charm", mp: 0, ap: 0, desc: "Hypnotic sway that charms and distracts.", effect: { charm: 1 } },
  { id: "softening_ray", name: "Softening Ray", mp: 0, ap: 0, desc: "A ray of plush caloric energy.", effect: { growth: 1, corruption: 2 } },
];

export const CLASS_SPELLS = {
  bard: [
    { id: "ballad_bottomless", name: "Ballad of the Bottomless", level: 2, mp: 6, ap: 5, desc: "A growth ballad that swells all who hear it.", effect: { growth: 1, aoe: true } },
    { id: "feast_song", name: "Feast Song", level: 3, mp: 8, ap: 8, desc: "Your song forces-feeds enemies with phantom delicacies.", effect: { feed: 2, corruption: 5 } },
    { id: "abundance_crescendo", name: "Abundance Crescendo", level: 5, mp: 14, ap: 15, desc: "Party-wide growth surge with irresistible melody.", effect: { growth: 2, aoe: true, party: true } },
  ],
  wizard: [
    { id: "cauldron_flesh", name: "Cauldron of Flesh", level: 2, mp: 7, ap: 6, desc: "Experimental magical feeding apparatus.", effect: { growth: 2, corruption: 4 } },
    { id: "overflowing_script", name: "Overflowing Script", level: 3, mp: 9, ap: 10, desc: "Runes that rewrite caloric density.", effect: { growth: 1, buff: "spellpower" } },
    { id: "grand_transmutation", name: "Grand Transmutation", level: 5, mp: 15, ap: 18, desc: "Transmute air into pure abundance.", effect: { growth: 3, corruption: 8 } },
  ],
  cleric: [
    { id: "prayer_full_belly", name: "Prayer of the Full Belly", level: 2, mp: 6, ap: 5, desc: "Divine blessing of comfortable fullness.", effect: { growth: 1, heal: 10 } },
    { id: "living_altar", name: "Living Altar", level: 3, mp: 10, ap: 12, desc: "Transform ally into immovable feast shrine.", effect: { buff: "altar", growth: 1 } },
    { id: "gorgara_grand_feast", name: "Gorgara's Grand Feast", level: 5, mp: 16, ap: 20, desc: "Golden caloric energy explodes across the battlefield.", effect: { growth: 2, aoe: true, heal: 15 } },
  ],
  warlock: [
    { id: "gorgara_claim", name: "Gorgara's Claim", level: 2, mp: 5, ap: 4, desc: "Remote hunger invocation on a target.", effect: { corruption: 6, growth: 1 } },
    { id: "essence_drain", name: "Essence Drain", level: 3, mp: 8, ap: 10, desc: "Drain enemy essence to fuel your growth.", effect: { drain: 1, selfGrowth: 1 } },
    { id: "hunger_pact", name: "Hunger Pact", level: 5, mp: 12, ap: 15, desc: "Violent pact-fueled growth surge.", effect: { growth: 3, selfGrowth: 1 } },
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
