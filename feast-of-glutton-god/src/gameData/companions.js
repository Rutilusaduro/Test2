import { MAX_STAGE_ID } from "./stages.js";

/**
 * Recruitable party — world-natives of the Aurelan Reach, drawn into the off-genre feast.
 * Code ids and class kits unchanged; persona/backstory reflavored (Phase 4).
 */
export const COMPANIONS = [
  {
    id: "mira",
    numericId: 0,
    name: "Mira Silverstring",
    class: "Bard",
    subclass: "Roadhouse Balladeer",
    bodyType: "hourglass",
    archetype: "performer",
    personality: "Aurelan Reach tavern bard — witty, flirtatious, delighted as the world softens around her songs",
    startLbs: 128,
    recruited: false,
    location: "harvest_hearth",
    ability: "Song of Abundance — performances grant party-wide growth",
    backstory: "She toured honest farm-taverns singing harvest hymns to Sylwen until your roadhouse ballads made hips sway for stranger reasons.",
  },
  {
    id: "lira",
    numericId: 1,
    name: "Lira Dawnwell",
    class: "Cleric",
    subclass: "Sylwen's Measure",
    bodyType: "pear",
    archetype: "devout",
    personality: "Sylwen priestess of measured plenty — gentle, conflicted, terrified that fullness feels like answered prayer",
    startLbs: 132,
    recruited: false,
    location: "fertile_heartlands",
    ability: "Divine Aura — passively spreads weight gain nearby",
    backstory: "Ordained in Sylwen's grove-temples to bless right-sized harvests. Your gospel is blasphemy — and her body keeps saying amen.",
  },
  {
    id: "sylvie",
    numericId: 2,
    name: 'Sylvara "Sylvie" Thorne',
    class: "Wizard",
    subclass: "Lumen Index",
    bodyType: "apple",
    archetype: "scholar",
    personality: "Lumen court-wizard — curious, bookish, secretly thrilled that the anomaly fits her equations",
    startLbs: 126,
    recruited: false,
    location: "ancient_temple",
    ability: "Arcane Analysis — predict growth and exploit weak points",
    backstory: "Seconded from the Gilded Citadel to catalog temple relics. She came to measure the Wheel — and stayed to measure herself.",
  },
  {
    id: "thalia",
    numericId: 3,
    name: "Thalia Blackfeast",
    class: "Warlock",
    subclass: "Pact of the Fat Goddess",
    bodyType: "voluptuous",
    archetype: "dominant",
    personality: "Guild factor turned hedge-witch at the Thin Veil — bold, hedonistic, first to call your hunger holy",
    startLbs: 140,
    recruited: false,
    location: "gorgara_cradle",
    ability: "Hunger Pact — drain abundance for massive growth",
    backstory: "Once enforced Tarn's contracts in the market quarter. The shrine's wrongness paid better — in power, pleasure, and pounds.",
  },
  {
    id: "greta",
    numericId: 4,
    name: "Greta Ironpot",
    class: "Fighter",
    subclass: "Korthak's Anvil",
    bodyType: "athletic",
    archetype: "competitive",
    personality: "Korthak-blessed frontier smith-champion — boisterous, competitive, treats swelling like a forge trial",
    startLbs: 155,
    recruited: false,
    location: "harvest_hearth",
    ability: "Iron Belly — consume hazards for healing and growth",
    backstory: "Northern march smith who prayed Korthak for lean strength. Your feasts are the hardest contest she ever won — and she wants a rematch.",
  },
  {
    id: "elara",
    numericId: 5,
    name: "Elara Warmbelly",
    class: "Paladin",
    subclass: "Frontier Host",
    bodyType: "rotund",
    archetype: "nurturing",
    personality: "Frontier tavern matron and Korthak-touched host — motherly, earnest, feeds pilgrims because that's what the road demands",
    startLbs: 148,
    recruited: true,
    location: "harvest_hearth",
    ability: "Feast Matron — creates healing feast camps in combat",
    backstory: "Her inn was a honest border stop before you made it a temple of second helpings. She still thinks she's just being hospitable.",
  },
];

export function createCompanionData(template) {
  return {
    ...template,
    lbs: template.startLbs,
    corruption: template.recruited ? 20 : 0,
    relationship: template.recruited ? 40 : 0,
    devotion: template.recruited ? 15 : 0,
    hp: 30,
    maxHp: 30,
    mp: 15,
    maxMp: 15,
    hunger: 0,
    gender: "she",
    pronouns: "she",
    isCompanion: true,
    sizeCap: MAX_STAGE_ID,
    role: template.class?.toLowerCase() || "companion",
  };
}

export function getCompanion(id) {
  const t = COMPANIONS.find((c) => c.id === id);
  return t ? createCompanionData(t) : null;
}
