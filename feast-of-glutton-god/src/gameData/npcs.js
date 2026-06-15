import { COMPANIONS } from "./companions.js";
import { MAX_STAGE_ID } from "./stages.js";

export const WORLD_NPCS = [
  {
    id: "elara_inn",
    name: "Elara Warmbelly",
    role: "innkeeper",
    bodyType: "rotund",
    archetype: "nurturing",
    startLbs: 168,
    location: "harvest_hearth",
    companionId: "elara",
    desc: "Harvest's Hearth innkeeper — frontier host who never stops cooking for the road.",
  },
  {
    id: "mira_bard",
    name: "Mira Silverstring",
    role: "bard",
    bodyType: "hourglass",
    archetype: "performer",
    startLbs: 128,
    location: "harvest_hearth",
    companionId: "mira",
    desc: "A Reach tavern bard whose ballads once praised Sylwen's measure — now they praise softer things.",
  },
  {
    id: "greta_smith",
    name: "Greta Ironpot",
    role: "blacksmith",
    bodyType: "athletic",
    archetype: "competitive",
    startLbs: 155,
    location: "harvest_hearth",
    companionId: "greta",
    desc: "Korthak-blessed smith of the marches — competitive, armored, hungry for the next forge-feast.",
  },
  {
    id: "lira_priestess",
    name: "Lira Dawnwell",
    role: "priestess",
    bodyType: "pear",
    archetype: "devout",
    startLbs: 132,
    location: "fertile_heartlands",
    companionId: "lira",
    desc: "Sylwen priestess sworn to measured plenty — prayers taste like bread, guilt tastes like your cooking.",
  },
  {
    id: "sylvie_scholar",
    name: 'Sylvara "Sylvie" Thorne',
    role: "scholar",
    bodyType: "apple",
    archetype: "scholar",
    startLbs: 126,
    location: "ancient_temple",
    companionId: "sylvie",
    desc: "Lumen court-wizard cataloging temple relics — star-charts in one hand, pastry in the other.",
  },
  {
    id: "thalia_witch",
    name: "Thalia Blackfeast",
    role: "witch",
    bodyType: "voluptuous",
    archetype: "dominant",
    startLbs: 140,
    location: "gorgara_cradle",
    companionId: "thalia",
    desc: "Guild factor turned hedge-witch at the Thin Veil — contracts, pacts, and contagious appetite.",
  },
  {
    id: "vesperia",
    name: "Lady Vesperia",
    role: "noble",
    bodyType: "hourglass",
    archetype: "haughty",
    startLbs: 125,
    location: "market_square",
    desc: "A slim, haughty noblewoman who secretly craves abundance.",
  },
  {
    id: "baker_sylvie",
    name: "Sylvie",
    role: "baker",
    bodyType: "pear",
    archetype: "shy",
    startLbs: 138,
    location: "market_square",
    desc: "The cute baker's daughter with flour-dusted cheeks.",
  },
  {
    id: "harvest_priestess",
    name: "Sister Maribel",
    role: "priestess",
    bodyType: "apple",
    archetype: "devout",
    startLbs: 145,
    location: "fertile_heartlands",
    desc: "A temple priestess torn between Sylwen's measured vows and the pull of fullness.",
  },
  {
    id: "goblin_queen",
    name: "Grikka",
    role: "goblin",
    bodyType: "rotund",
    archetype: "greedy",
    startLbs: 175,
    location: "harvest_hearth",
    desc: "A curvy goblin feast-queen who rules the cellar kitchens.",
  },
  {
    id: "dryad_elder",
    name: "Rootmother Ash",
    role: "dryad",
    bodyType: "pear",
    archetype: "ancient",
    startLbs: 195,
    location: "fertile_heartlands",
    desc: "An ancient dryad bound in living vines, swelling with fertility magic.",
  },
  {
    id: "rival_lyra",
    name: "Lyra Swiftblade",
    role: "rival",
    bodyType: "athletic",
    archetype: "proud",
    startLbs: 122,
    location: "market_square",
    desc: "A proud slim adventurer who despises the heresy you carry.",
  },
  {
    id: "lumen_diviner",
    name: "Brother Cael",
    role: "diviner",
    bodyType: "slim",
    archetype: "scholar",
    startLbs: 118,
    location: "gilded_citadel",
    desc: "A Lumen-temple diviner who reads star-charts and frowns at patterns that should not exist.",
  },
  {
    id: "measured_inquisitor",
    name: "Sister Verity",
    role: "inquisitor",
    bodyType: "athletic",
    archetype: "devout",
    startLbs: 122,
    location: "ember_duchy",
    desc: "Inquisitor of the Measured Hand — Javert-earnest, lean, horrified that you make famine lose.",
    antagonist: true,
    antagonistAct: 2,
  },
  {
    id: "jorvald_smith",
    name: "Master Jorvald Ironpot",
    role: "blacksmith",
    bodyType: "athletic",
    archetype: "proud",
    startLbs: 162,
    location: "iron_peak_hold",
    desc: "Iron Peak forge-master — Korthak-blessed, lean as oath-steel, furious that Greta chose softness over the anvil.",
  },
  {
    id: "pensha_arbiter",
    name: "Pensha Ledgerwise",
    role: "merchant",
    bodyType: "hourglass",
    archetype: "calculating",
    startLbs: 128,
    location: "market_square",
    desc: "Tarn guild-arbiter — measures appetite in ledgers, not sermons. Fair deals, sharp eyes, secretly curious about your market disruption.",
  },
  {
    id: "theodric_ashwall",
    name: "Theodric Ashwall",
    role: "scholar",
    bodyType: "slim",
    archetype: "scholar",
    startLbs: 120,
    location: "ancient_temple",
    desc: "Lumen Index apostate — detected your patron's signature and wants to understand it before the Inquisition files a warrant.",
  },
  {
    id: "sylwen_herald",
    name: "Sister Amaran",
    role: "herald",
    bodyType: "pear",
    archetype: "devout",
    startLbs: 130,
    location: "fertile_heartlands",
    desc: "Sylwen's harvest-herald — tragic foil in green vestments, voice gentle, verdict terrible.",
  },
  {
    id: "sylwen_converted_guest",
    name: "Sylwen, Converted",
    role: "divine_guest",
    bodyType: "pear",
    archetype: "softened",
    startLbs: 165,
    location: "eternal_feast_hall",
    desc: "Harvest-goddess of measured plenty — converted, dining, finally allowing seconds.",
    guestFlag: "sylwen_converted",
  },
  {
    id: "tarn_converted_guest",
    name: "Tarn, Converted",
    role: "divine_guest",
    bodyType: "hourglass",
    archetype: "merchant",
    startLbs: 158,
    location: "eternal_feast_hall",
    desc: "Guild-god of contracts — converted, auditing dessert instead of souls.",
    guestFlag: "tarn_converted",
  },
  {
    id: "lumen_converted_guest",
    name: "Lumen, Converted",
    role: "divine_guest",
    bodyType: "slim",
    archetype: "scholar",
    startLbs: 142,
    location: "eternal_feast_hall",
    desc: "Star-god of the Index — converted, charting caloric constellations between bites.",
    guestFlag: "lumen_converted",
  },
];

export function createNpc(template) {
  return {
    ...template,
    lbs: template.startLbs,
    corruption: 0,
    relationship: 0,
    hunger: 0,
    gender: "she",
    pronouns: "she",
    isCompanion: false,
    sizeCap: MAX_STAGE_ID,
  };
}

export function getNpcsInRegion(regionId, gameState) {
  const recruitedCompanionIds = new Set((gameState.party || []).map((c) => c.id));
  let worldNpcs = WORLD_NPCS
    .filter((n) => n.location === regionId)
    .filter((n) => !n.companionId || !recruitedCompanionIds.has(n.companionId))
    .filter((n) => !n.guestFlag || gameState?.worldFlags?.[n.guestFlag]);

  if (
    regionId === 'divine_plane_vestibule'
    && gameState?.worldFlags?.main_act3_complete
    && !gameState?.quests?.completed?.includes('side_lyra_last_duel')
    && !worldNpcs.some((n) => n.id === 'rival_lyra')
  ) {
    const lyra = WORLD_NPCS.find((n) => n.id === 'rival_lyra');
    if (lyra) worldNpcs = [...worldNpcs, { ...lyra, location: regionId }];
  }

  const npcs = worldNpcs.map(createNpc);
  const recruited = (gameState.party || [])
    .filter((c) => c.location === regionId || !c.location)
    .map((c) => ({ ...c, isCompanion: true }));
  return [...npcs, ...recruited];
}

export function findNpc(id, gameState) {
  const world = WORLD_NPCS.find((n) => n.id === id);
  if (world) return createNpc(world);
  return (gameState.party || []).find((c) => c.id === id) || null;
}

export function getCompanionTemplate(id) {
  return COMPANIONS.find((c) => c.id === id);
}
