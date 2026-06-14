import { MAX_STAGE_ID } from "./stages.js";

const MUNDANE = { threatTier: "mundane" };
const COSMIC = { threatTier: "cosmic", conversion: 0.05 };

export const ENEMY_TYPES = {
  harvest_harpy: {
    id: "harvest_harpy",
    name: "Harvest Harpy",
    bodyType: "athletic",
    startLbs: 130,
    hp: 22,
    mp: 8,
    movement: 5,
    role: "skirmisher",
    conversion: 0.8,
    desc: "Winged farm girls with feathered accents — fast and greedy.",
    ...MUNDANE,
  },
  vinebound_dryad: {
    id: "vinebound_dryad",
    name: "Vinebound Dryad",
    bodyType: "pear",
    startLbs: 145,
    hp: 26,
    mp: 14,
    movement: 3,
    role: "controller",
    conversion: 0.9,
    desc: "Nature spirits bound in living vines, swelling with fertility.",
    ...MUNDANE,
  },
  gluttonous_goblin: {
    id: "gluttonous_goblin",
    name: "Gluttonous Goblin",
    bodyType: "rotund",
    startLbs: 140,
    hp: 18,
    mp: 6,
    movement: 4,
    role: "swarmer",
    conversion: 0.95,
    desc: "Curvy, greedy green-skinned girls who live to eat.",
    ...MUNDANE,
  },
  temple_guardian: {
    id: "temple_guardian",
    name: "Temple Guardian",
    bodyType: "athletic",
    startLbs: 155,
    hp: 35,
    mp: 10,
    movement: 3,
    role: "tank",
    conversion: 0.7,
    desc: "Stoic armored priestess-knights guarding ancient halls.",
    ...MUNDANE,
  },
  rival_adventurer: {
    id: "rival_adventurer",
    name: "Rival Adventurer",
    bodyType: "athletic",
    startLbs: 125,
    hp: 28,
    mp: 12,
    movement: 4,
    role: "balanced",
    conversion: 0.85,
    desc: "Proud slim rivals who hate what you're becoming.",
    ...MUNDANE,
  },
  purity_inquisitor: {
    id: "purity_inquisitor",
    name: "Inquisitor of the Measured Hand",
    bodyType: "athletic",
    startLbs: 120,
    hp: 32,
    mp: 16,
    movement: 4,
    role: "elite",
    conversion: 0.6,
    desc: "Militant paladins of the orthodox Church who enforce divine moderation and hunt heresy.",
    ...MUNDANE,
  },
  famine_hag: {
    id: "famine_hag",
    name: "the Lean Saint",
    bodyType: "straight",
    startLbs: 95,
    hp: 45,
    mp: 20,
    movement: 2,
    role: "boss",
    desc: "Sylwen's Scourge — a sanctioned divine instrument; famine as the answer to gluttony.",
    ...COSMIC,
  },
};

export function getEnemyThreatTier(enemyOrTypeId) {
  if (!enemyOrTypeId) return "mundane";
  if (typeof enemyOrTypeId === "string") {
    return ENEMY_TYPES[enemyOrTypeId]?.threatTier ?? "mundane";
  }
  const typeId = enemyOrTypeId.typeId || enemyOrTypeId.type || enemyOrTypeId.id;
  return enemyOrTypeId.threatTier ?? ENEMY_TYPES[typeId]?.threatTier ?? "mundane";
}

export function isCosmicThreat(enemyOrTypeId) {
  return getEnemyThreatTier(enemyOrTypeId) === "cosmic";
}

export function createEnemy(typeId) {
  const t = ENEMY_TYPES[typeId] || ENEMY_TYPES.harvest_harpy;
  return {
    ...t,
    typeId: t.id,
    lbs: t.startLbs,
    corruption: 0,
    hunger: 0,
    maxHp: t.hp,
    maxMp: t.mp,
    x: 0,
    y: 0,
    converted: false,
    gender: "she",
    pronouns: "she",
    isEnemy: true,
    sizeCap: MAX_STAGE_ID,
  };
}

export function pickEncounter(regionId) {
  const pools = {
    harvest_hearth: ["harvest_harpy", "gluttonous_goblin"],
    market_square: ["rival_adventurer", "gluttonous_goblin"],
    fertile_heartlands: ["vinebound_dryad", "harvest_harpy"],
    gorgara_cradle: ["temple_guardian", "purity_inquisitor"],
    ancient_temple: ["temple_guardian", "purity_inquisitor", "famine_hag"],
  };
  const pool = pools[regionId] || ["harvest_harpy"];
  const id = pool[Math.floor(Math.random() * pool.length)];
  return createEnemy(id);
}
