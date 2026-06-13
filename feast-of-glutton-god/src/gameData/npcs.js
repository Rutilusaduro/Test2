import { COMPANIONS } from "./companions.js";

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
  };
}

export function getNpcsInRegion(regionId, gameState) {
  const npcs = WORLD_NPCS.filter((n) => n.location === regionId).map(createNpc);
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
