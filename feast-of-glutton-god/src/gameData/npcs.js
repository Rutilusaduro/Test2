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
    desc: "The warm-hearted innkeeper whose kitchen never closes.",
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
    desc: "A playful wandering musician with a voice that makes hips sway.",
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
    desc: "A boisterous smith who treats eating like forging — hammer, heat, and hunger.",
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
    desc: "A gentle priestess whose prayers taste like warm bread and honey.",
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
    desc: "A curious wizard who studies growth the way others study stars.",
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
    desc: "A hedonistic warlock whose pact hunger is contagious and delicious.",
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
    desc: "A temple priestess torn between purity vows and Gorgara's call.",
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
    desc: "A proud slim adventurer who despises your spreading gospel.",
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
  const npcs = WORLD_NPCS
    .filter((n) => n.location === regionId)
    .filter((n) => !n.companionId || !recruitedCompanionIds.has(n.companionId))
    .map(createNpc);
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
