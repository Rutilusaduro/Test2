import { MAX_STAGE_ID } from "./stages.js";

const MUNDANE = { threatTier: "mundane" };
const COSMIC = {
  threatTier: "cosmic",
  conversion: 0.05,
  growthResist: 0.65,
  conversionImmune: false,
};

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
    hp: 55,
    mp: 24,
    movement: 2,
    role: "boss",
    desc: "Sylwen's Scourge — a sanctioned divine instrument; famine as the answer to gluttony.",
    conversionImmune: true,
    growthResist: 0.8,
    cosmicAbility: "famine_drain",
    phases: [{ id: "hunger_wind", hpPct: 0.5, label: "Hunger Wind" }],
    ...COSMIC,
  },
  champion_aurelan: {
    id: "champion_aurelan",
    name: "Scale-Bearer of Aurelan",
    bodyType: "athletic",
    startLbs: 140,
    hp: 48,
    mp: 18,
    movement: 3,
    role: "elite",
    desc: "Aurelan's god-champion — law made armored, scales burning with measured justice.",
    cosmicAbility: "law_binding",
    growthResist: 0.7,
    phases: [{ id: "oath_seal", hpPct: 0.4, label: "Oath Seal" }],
    ...COSMIC,
  },
  champion_sylwen: {
    id: "champion_sylwen",
    name: "Warden of Measured Plenty",
    bodyType: "pear",
    startLbs: 135,
    hp: 46,
    mp: 20,
    movement: 3,
    role: "controller",
    desc: "Sylwen's harvest-champion — right-sized plenty weaponized against your excess.",
    cosmicAbility: "measured_harvest",
    growthResist: 0.7,
    phases: [{ id: "thresh_reversal", hpPct: 0.45, label: "Thresh Reversal" }],
    ...COSMIC,
  },
  champion_korthak: {
    id: "champion_korthak",
    name: "War-Saint of Korthak",
    bodyType: "athletic",
    startLbs: 150,
    hp: 52,
    mp: 14,
    movement: 4,
    role: "tank",
    desc: "Korthak's frontier champion — lean valor in blessed plate, sent to break your gospel.",
    cosmicAbility: "valor_surge",
    growthResist: 0.65,
    phases: [{ id: "last_stand", hpPct: 0.35, label: "Frontier Last Stand" }],
    ...COSMIC,
  },
  champion_veshanne: {
    id: "champion_veshanne",
    name: "Barrow-Voice of Veshanne",
    bodyType: "straight",
    startLbs: 120,
    hp: 44,
    mp: 22,
    movement: 2,
    role: "controller",
    desc: "Veshanne's death-champion — fate and barrow-dust given a body that refuses indulgence.",
    cosmicAbility: "fate_weight",
    growthResist: 0.75,
    phases: [{ id: "barrow_echo", hpPct: 0.5, label: "Barrow Echo" }],
    ...COSMIC,
  },
  champion_lumen: {
    id: "champion_lumen",
    name: "Lantern Ascetic of Lumen",
    bodyType: "straight",
    startLbs: 115,
    hp: 42,
    mp: 26,
    movement: 3,
    role: "elite",
    desc: "Lumen's divination-champion — star-charts and denial spells woven against your anomaly.",
    cosmicAbility: "lantern_deny",
    growthResist: 0.7,
    phases: [{ id: "pattern_break", hpPct: 0.45, label: "Pattern Break" }],
    ...COSMIC,
  },
  champion_tarn: {
    id: "champion_tarn",
    name: "Herald of Tarn's Scales",
    bodyType: "hourglass",
    startLbs: 128,
    hp: 40,
    mp: 18,
    movement: 4,
    role: "balanced",
    desc: "Tarn's trade-champion — contracts and fair measure turned into weapons against limitless feast.",
    cosmicAbility: "contract_tax",
    growthResist: 0.6,
    phases: [{ id: "ledger_due", hpPct: 0.4, label: "Ledger Due" }],
    ...COSMIC,
  },
  wheel_avatar: {
    id: "wheel_avatar",
    name: "Avatar of the Measured Wheel",
    bodyType: "athletic",
    startLbs: 160,
    hp: 70,
    mp: 30,
    movement: 2,
    role: "boss",
    desc: "Six domains braided into one radiant executor — the pantheon's shared fist.",
    cosmicAbility: "wheel_judgment",
    growthResist: 0.85,
    conversionImmune: true,
    phases: [
      { id: "domains_align", hpPct: 0.6, label: "Domains Align" },
      { id: "wheel_fracture", hpPct: 0.25, label: "Wheel Fracture" },
    ],
    ...COSMIC,
  },
  pantheon_last_stand: {
    id: "pantheon_last_stand",
    name: "The Wheel's Last Stand",
    bodyType: "voluptuous",
    startLbs: 180,
    hp: 90,
    mp: 36,
    movement: 1,
    role: "boss",
    desc: "The Measured Wheel's final confrontation — gods and law and fear made one last, desperate shape.",
    cosmicAbility: "pantheon_denial",
    growthResist: 0.9,
    conversionImmune: true,
    phases: [
      { id: "council_wrath", hpPct: 0.66, label: "Council Wrath" },
      { id: "divine_suicide", hpPct: 0.33, label: "Divine Suicide" },
    ],
    ...COSMIC,
  },
};

export const COSMIC_ENEMY_IDS = Object.keys(ENEMY_TYPES).filter(
  (id) => ENEMY_TYPES[id].threatTier === "cosmic",
);

export const GOD_CHAMPION_IDS = [
  "champion_aurelan",
  "champion_sylwen",
  "champion_korthak",
  "champion_veshanne",
  "champion_lumen",
  "champion_tarn",
];

export function getEnemyTypeDef(enemyOrTypeId) {
  if (!enemyOrTypeId) return null;
  const typeId = typeof enemyOrTypeId === "string"
    ? enemyOrTypeId
    : (enemyOrTypeId.typeId || enemyOrTypeId.type || enemyOrTypeId.id);
  return ENEMY_TYPES[typeId] ?? null;
}

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

export function getCosmicGrowthResist(enemyOrTypeId) {
  const def = getEnemyTypeDef(enemyOrTypeId);
  if (!def || def.threatTier !== "cosmic") return 0;
  return def.growthResist ?? 0.65;
}

export function isConversionImmune(enemyOrTypeId) {
  const def = getEnemyTypeDef(enemyOrTypeId);
  return Boolean(def?.conversionImmune);
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
    phaseFlags: {},
  };
}

export function pickEncounter(regionId, game = null) {
  const escalation = game?.worldFlags?.escalationTier ?? 0;
  const pools = {
    harvest_hearth: ["harvest_harpy", "gluttonous_goblin"],
    market_square: ["rival_adventurer", "gluttonous_goblin"],
    fertile_heartlands: ["vinebound_dryad", "harvest_harpy"],
    gorgara_cradle: escalation >= 3
      ? ["purity_inquisitor", "champion_lumen", "wheel_avatar"]
      : ["temple_guardian", "purity_inquisitor"],
    ancient_temple: escalation >= 2
      ? ["purity_inquisitor", "famine_hag", "champion_sylwen"]
      : ["temple_guardian", "purity_inquisitor", "famine_hag"],
    gilded_citadel: escalation >= 2
      ? ["champion_aurelan", "champion_lumen", "purity_inquisitor"]
      : ["purity_inquisitor", "rival_adventurer"],
    ember_duchy: ["purity_inquisitor", "champion_korthak"],
    northern_marches: ["champion_korthak", "rival_adventurer"],
  };
  const pool = pools[regionId] || ["harvest_harpy"];
  const id = pool[Math.floor(Math.random() * pool.length)];
  return createEnemy(id);
}
