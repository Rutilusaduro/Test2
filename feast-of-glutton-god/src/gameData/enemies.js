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
  },
  purity_inquisitor: {
    id: "purity_inquisitor",
    name: "Purity Inquisitor",
    bodyType: "athletic",
    startLbs: 120,
    hp: 32,
    mp: 16,
    movement: 4,
    role: "elite",
    conversion: 0.6,
    desc: "Fanatical slim paladins who hunt abundance cultists.",
  },
  famine_hag: {
    id: "famine_hag",
    name: "Famine Hag",
    bodyType: "straight",
    startLbs: 95,
    hp: 45,
    mp: 20,
    movement: 2,
    role: "boss",
    conversion: 0.5,
    desc: "Ancient rail-thin crone who curses with eternal hunger.",
  },
};

export function createEnemy(typeId) {
  const t = ENEMY_TYPES[typeId] || ENEMY_TYPES.harvest_harpy;
  return {
    ...t,
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
