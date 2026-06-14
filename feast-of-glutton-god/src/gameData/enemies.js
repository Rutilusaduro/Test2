import { MAX_STAGE_ID } from "./stages.js";
import { getEnemyGrowthKind } from "./enemyGrowthKinds.js";
import { getNarrativeDepth } from "./worldTransformation.js";

const MUNDANE = { threatTier: "mundane" };
const MYTHIC = {
  threatTier: "mythic",
  conversion: 0.3,
  growthResist: 0.5,
};
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
    desc: "Winged farm-girls with feathered cleavage and greedy eyes — fast, predatory, and aching to be fed into softness.",
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
    desc: "Nature spirits bound in living vines — pear-soft hips, fertility magic dripping, territorial and deliciously swellable.",
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
    desc: "Curvy green-skinned girls packed into too-small leather — shameless, jiggling, and horny for seconds.",
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
    desc: "Stoic armored priestess-knights — disciplined curves behind blessed plate, denial polished until it shatters.",
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
    desc: "Proud slim rivals who hate what you're becoming — athletic fury masking envy and wet, secret curiosity.",
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
    desc: "Militant paladins of the orthodox Church — corseted discipline, hard stares, bodies begging to be unlaced by gospel.",
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
    desc: "Sylwen's Scourge — rail-thin saint flesh, famine blessed, terrifyingly elegant, and paradoxically hungry for what she denies.",
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
    desc: "Aurelan's god-champion — law made armored curves, scales burning, waist cinched, softness waiting behind oath-fire.",
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
    desc: "Sylwen's harvest-champion — pear-soft plenty weaponized, fertile hips tragic, breasts aching with measured restraint.",
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
    desc: "Korthak's frontier champion — lean valor in blessed plate, war-saint mass, honestly confused by how good your curves look.",
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
    desc: "Veshanne's death-champion — tomb-cold skin, fate in her eyes, straight severe lines trembling toward forbidden softness.",
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
    desc: "Lumen's divination-champion — lantern-light on ascetic curves, denial spells woven tight across breasts that betray her.",
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
    desc: "Tarn's trade-champion — hourglass lines in contract-silk, ledger-eyes measuring the profit in your abundance.",
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
    desc: "Six domains braided into one radiant executor — divine curves too perfect, hunger too unified, the pantheon's shared fist.",
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
    desc: "The Measured Wheel's final confrontation — voluptuous desperation, cosmic curves, law and fear made one last, edible shape.",
    cosmicAbility: "pantheon_denial",
    growthResist: 0.9,
    conversionImmune: true,
    phases: [
      { id: "council_wrath", hpPct: 0.66, label: "Council Wrath" },
      { id: "divine_suicide", hpPct: 0.33, label: "Divine Suicide" },
    ],
    ...COSMIC,
  },
  ascetic_monk: {
    id: "ascetic_monk",
    name: "Ascetic of the Measured Hand",
    bodyType: "straight",
    startLbs: 105,
    hp: 20,
    mp: 12,
    movement: 4,
    role: "disruptor",
    conversion: 0.75,
    growthResist: 0.4,
    desc: "Monastery devotee who fasts as devotion — roughspun robes gaping, denial aura, lips parted on forbidden breath.",
    ...MUNDANE,
  },
  lean_pilgrim: {
    id: "lean_pilgrim",
    name: "Penitent Pilgrim of Sylwen",
    bodyType: "straight",
    startLbs: 98,
    hp: 14,
    mp: 8,
    movement: 5,
    role: "swarmer",
    conversion: 0.9,
    desc: "Traveling penitent of Sylwen — slim hips, hollow belly, cheeks coloring where your swollen gospel touches her.",
    ...MUNDANE,
  },
  measure_priest: {
    id: "measure_priest",
    name: "Hedge-Priest of the Measure",
    bodyType: "athletic",
    startLbs: 120,
    hp: 24,
    mp: 18,
    movement: 3,
    role: "controller",
    conversion: 0.7,
    specialAbility: "growth_suppress",
    desc: "Local orthodox priestess — growth-suppression prayers on her lips, nipples betraying her beneath linen.",
    ...MUNDANE,
  },
  jealous_noble: {
    id: "jealous_noble",
    name: "Offended Noblewoman",
    bodyType: "athletic",
    startLbs: 118,
    hp: 16,
    mp: 10,
    movement: 3,
    role: "social",
    conversion: 0.95,
    socialAttack: "embarrassment",
    desc: "Tarn-connected merchant-noble — velvet outrage, corseted curves, jealousy hot in her cleavage and hotter between her thighs.",
    ...MUNDANE,
  },
  famine_cultist: {
    id: "famine_cultist",
    name: "Acolyte of the Lean Saint",
    bodyType: "straight",
    startLbs: 92,
    hp: 18,
    mp: 14,
    movement: 4,
    role: "debuffer",
    conversion: 0.8,
    specialAbility: "hunger_reversal",
    desc: "Lean Saint acolyte — emaciated cult beauty, hunger-reversal magic, guilt and appetite warring in her flush.",
    ...MUNDANE,
  },
  herald_of_starvation: {
    id: "herald_of_starvation",
    name: "Herald of the Lean Ascension",
    bodyType: "straight",
    startLbs: 110,
    hp: 48,
    mp: 22,
    movement: 3,
    role: "elite",
    desc: "Sylwen's divine messenger — scourge-light on starved curves, austerity shivering when your abundance brushes her skin.",
    cosmicAbility: "famine_aura",
    growthResist: 0.55,
    phases: [{ id: "scourge_shriek", hpPct: 0.5, label: "Scourge Shriek" }],
    ...MYTHIC,
  },
  void_appetite: {
    id: "void_appetite",
    name: "the Inverted Hunger",
    bodyType: "straight",
    startLbs: 100,
    hp: 44,
    mp: 20,
    movement: 4,
    role: "disruptor",
    desc: "Hunger twisted wrong — absence bulging into obscene curves, flesh erupting where emptiness was, slick and uncanny.",
    cosmicAbility: "growth_devour",
    growthResist: 0.7,
    conversionImmune: true,
    ...MYTHIC,
  },
  cathedral_golem: {
    id: "cathedral_golem",
    name: "Cathedral Golem of Aurelan",
    bodyType: "athletic",
    startLbs: 180,
    hp: 65,
    mp: 10,
    movement: 2,
    role: "tank",
    desc: "Aurelan's stone law-construct — marble breasts softening, sacred reliefs stretching, geometry surrendering to doughy idol-flesh.",
    cosmicAbility: "law_ward",
    growthResist: 0.6,
    conversionImmune: true,
    phases: [{ id: "law_shard", hpPct: 0.4, label: "Law Shard" }],
    ...MYTHIC,
  },
  divine_inquisitor_supreme: {
    id: "divine_inquisitor_supreme",
    name: "Supreme Inquisitor of the Measured Hand",
    bodyType: "athletic",
    startLbs: 130,
    hp: 60,
    mp: 28,
    movement: 3,
    role: "elite",
    desc: "Wheel-empowered Church apex — doctrinal fury in elite curves, corsetry punishing breasts that beg release.",
    cosmicAbility: "doctrinal_fury",
    growthResist: 0.65,
    phases: [{ id: "doctrinal_fury", hpPct: 0.5, label: "Doctrinal Fury" }],
    ...MYTHIC,
  },
  korthak_titan: {
    id: "korthak_titan",
    name: "Titan of Korthak's Frontier",
    bodyType: "athletic",
    startLbs: 170,
    hp: 72,
    mp: 12,
    movement: 3,
    role: "boss",
    conversion: 0.35,
    desc: "Frontier war-giant at mythic scale — siege-tower thighs, plate straining, honestly terrified of how good swelling might feel.",
    cosmicAbility: "valor_avalanche",
    growthResist: 0.55,
    phases: [
      { id: "frontier_resolve", hpPct: 0.6, label: "Frontier Resolve" },
      { id: "broken_oath", hpPct: 0.25, label: "Broken Oath" },
    ],
    ...MYTHIC,
  },
  avatar_aurelan: {
    id: "avatar_aurelan",
    name: "Aurelan Incarnate",
    bodyType: "athletic",
    startLbs: 145,
    hp: 95,
    mp: 40,
    movement: 3,
    role: "boss",
    desc: "Aurelan manifesting as partial avatar — law made voluptuous flesh, crown burning, scales tipping as her belly rounds.",
    cosmicAbility: "divine_law",
    legendaryActions: ["scales_of_judgment", "crown_of_order", "law_made_manifest"],
    legendaryResistances: 3,
    growthResist: 0.88,
    conversionImmune: true,
    phases: [
      { id: "measured_wrath", hpPct: 0.66, label: "Measured Wrath" },
      { id: "crown_shatter", hpPct: 0.33, label: "Crown Shatter" },
    ],
    ...COSMIC,
  },
  sylwen_revenant: {
    id: "sylwen_revenant",
    name: "Sylwen in Grief",
    bodyType: "pear",
    startLbs: 140,
    hp: 88,
    mp: 42,
    movement: 2,
    role: "boss",
    desc: "Harvest goddess in grief — pear-soft hips in mourning linen, barren aura failing, tears and nipples stiff with contradiction.",
    cosmicAbility: "harvest_grief",
    legendaryActions: ["barren_shriek", "harvest_inversion", "thorned_plenty"],
    legendaryResistances: 3,
    growthResist: 0.82,
    conversion: 0.05,
    phases: [
      { id: "wailing_harvest", hpPct: 0.6, label: "Wailing Harvest" },
      { id: "grief_breaks", hpPct: 0.2, label: "Grief Breaks" },
    ],
    ...COSMIC,
  },
  veshanne_unbound: {
    id: "veshanne_unbound",
    name: "Veshanne Unbound",
    bodyType: "straight",
    startLbs: 125,
    hp: 80,
    mp: 48,
    movement: 1,
    role: "boss",
    desc: "Death goddess unleashing fate — pale severe beauty, tomb-shroud clinging to thighs, arousal she calls doom.",
    cosmicAbility: "fated_strike",
    legendaryActions: ["barrow_wail", "fate_revision", "unwritten_end"],
    legendaryResistances: 2,
    growthResist: 0.78,
    conversionImmune: true,
    phases: [
      { id: "barrow_dark", hpPct: 0.5, label: "Barrow Dark" },
      { id: "fate_rewritten", hpPct: 0.25, label: "Fate Rewritten" },
    ],
    ...COSMIC,
  },
  bloom_sovereign: {
    id: "bloom_sovereign",
    name: "the Bloom Sovereign",
    bodyType: "voluptuous",
    startLbs: 165,
    hp: 100,
    mp: 44,
    movement: 2,
    role: "boss",
    desc: "Rival goddess / antithesis — voluptuous mirror-hunger, breasts and hips devouring light, wrong abundance made seductive.",
    cosmicAbility: "bloom_devour",
    legendaryActions: ["rival_bloom", "appetite_redirect", "sovereign_hunger"],
    legendaryResistances: 3,
    growthResist: 0.75,
    conversionImmune: true,
    phases: [
      { id: "mirror_bloom", hpPct: 0.7, label: "Mirror Bloom" },
      { id: "sovereign_revealed", hpPct: 0.4, label: "Sovereign Revealed" },
      { id: "final_appetite", hpPct: 0.1, label: "Final Appetite" },
    ],
    ...COSMIC,
  },
  wheel_incarnate: {
    id: "wheel_incarnate",
    name: "The Wheel Incarnate",
    bodyType: "athletic",
    startLbs: 155,
    hp: 120,
    mp: 50,
    movement: 1,
    role: "boss",
    desc: "Six domains compressed into one desperate god-shape — cosmic curves stacked, pre-final boss, theology made wet and radiant.",
    cosmicAbility: "six_domains",
    legendaryActions: ["domain_shift", "wheel_crush", "pantheon_roar"],
    legendaryResistances: 5,
    growthResist: 0.92,
    conversionImmune: true,
    phases: [
      { id: "domains_align", hpPct: 0.75, label: "Domains Align" },
      { id: "wheel_cracks", hpPct: 0.5, label: "The Wheel Cracks" },
      { id: "desperate_unity", hpPct: 0.25, label: "Desperate Unity" },
    ],
    ...COSMIC,
  },
  velvet_succubus: {
    id: "velvet_succubus",
    name: "Velvet Succubus",
    bodyType: "hourglass",
    startLbs: 132,
    hp: 34,
    mp: 28,
    movement: 4,
    role: "controller",
    conversion: 0.85,
    desc: "Shrine-leak temptation given flesh — horns, tail, lacework straining over infernal hourglass curves and a smile that promises ruinous, consensual pleasure.",
    cosmicAbility: "siren_feast",
    growthResist: 0.35,
    ...MUNDANE,
  },
  crimson_vampire: {
    id: "crimson_vampire",
    name: "Crimson Countess",
    bodyType: "pear",
    startLbs: 125,
    hp: 38,
    mp: 24,
    movement: 4,
    role: "elite",
    conversion: 0.7,
    desc: "Coastal undead nobility — pale throat offered, corset laced, fangs peeking, cold skin warming where your gospel touches her hidden hunger.",
    cosmicAbility: "blood_hunger",
    growthResist: 0.45,
    phases: [{ id: "crimson_thirst", hpPct: 0.45, label: "Crimson Thirst" }],
    ...MYTHIC,
  },
  living_feast_spirit: {
    id: "living_feast_spirit",
    name: "Living Feast Spirit",
    bodyType: "rotund",
    startLbs: 155,
    hp: 20,
    mp: 12,
    movement: 3,
    role: "celebrant",
    conversion: 0.98,
    desc: "Celestial abundance given giggling form — translucent curves dripping honey-light, arms open, begging to be fed fuller in worship.",
    growthResist: 0.1,
    ...MUNDANE,
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

export function isMythicThreat(enemyOrTypeId) {
  return getEnemyThreatTier(enemyOrTypeId) === "mythic";
}

export function isEliteThreat(enemyOrTypeId) {
  const tier = getEnemyThreatTier(enemyOrTypeId);
  return tier === "mythic" || tier === "cosmic";
}

export function getEnemyGrowthResist(enemyOrTypeId) {
  const def = getEnemyTypeDef(enemyOrTypeId);
  if (!def) return 0;
  const tier = def.threatTier ?? "mundane";
  if (tier === "mundane") return def.growthResist ?? 0;
  if (tier === "mythic" || tier === "cosmic") return def.growthResist ?? (tier === "cosmic" ? 0.65 : 0.5);
  return def.growthResist ?? 0;
}

export function getCosmicGrowthResist(enemyOrTypeId) {
  return getEnemyGrowthResist(enemyOrTypeId);
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
    growthKind: t.growthKind || getEnemyGrowthKind(t.id),
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
    legendaryResistances: t.legendaryResistances ?? undefined,
  };
}

export function pickEncounter(regionId, game = null) {
  const escalation = game?.worldFlags?.escalationTier ?? 0;
  const playerLevel = game?.player?.level ?? 1;
  const narrativeDepth = game ? getNarrativeDepth(game, regionId) : 0;

  let gorgaraCradle = escalation >= 3
    ? ["purity_inquisitor", "champion_lumen", "wheel_avatar"]
    : escalation >= 1
      ? ["temple_guardian", "purity_inquisitor", "velvet_succubus"]
      : ["temple_guardian", "purity_inquisitor", "ascetic_monk"];
  if (narrativeDepth >= 5) {
    gorgaraCradle = ["living_feast_spirit", "lean_pilgrim", "temple_guardian"];
  } else if (narrativeDepth >= 4) {
    gorgaraCradle = ["lean_pilgrim", "living_feast_spirit", "velvet_succubus", ...gorgaraCradle];
  }

  let ancientTemple = escalation >= 2
    ? ["purity_inquisitor", "famine_hag", "champion_sylwen", "crimson_vampire"]
    : ["temple_guardian", "purity_inquisitor", "famine_cultist"];
  if (narrativeDepth >= 5) {
    ancientTemple = ["living_feast_spirit", "lean_pilgrim", "void_appetite", "cathedral_golem"];
  } else if (narrativeDepth >= 4) {
    ancientTemple = ["vinebound_dryad", "lean_pilgrim", "famine_cultist", "living_feast_spirit"];
  }

  let gildedCitadel = escalation >= 2
    ? ["champion_aurelan", "champion_lumen", "purity_inquisitor", "cathedral_golem"]
    : ["purity_inquisitor", "rival_adventurer", "ascetic_monk"];
  if (narrativeDepth >= 5) {
    gildedCitadel = ["famine_cultist", "divine_inquisitor_supreme", "cathedral_golem", "lean_pilgrim"];
  } else if (narrativeDepth >= 4) {
    gildedCitadel = ["divine_inquisitor_supreme", "cathedral_golem", "champion_aurelan"];
  }

  const pools = {
    harvest_hearth: ["harvest_harpy", "gluttonous_goblin", "lean_pilgrim"],
    market_square: ["rival_adventurer", "gluttonous_goblin", "jealous_noble", "famine_cultist"],
    fertile_heartlands: ["vinebound_dryad", "harvest_harpy", "measure_priest"],
    gorgara_cradle: gorgaraCradle,
    ancient_temple: ancientTemple,
    gilded_citadel: gildedCitadel,
    ember_duchy: ["purity_inquisitor", "champion_korthak", "jealous_noble"],
    northern_marches: ["champion_korthak", "rival_adventurer", "lean_pilgrim"],
    sapphire_coast: ["rival_adventurer", "vinebound_dryad", "jealous_noble", "crimson_vampire"],
    iron_peak_hold: ["temple_guardian", "gluttonous_goblin", "ascetic_monk"],
    barrow_deeps: playerLevel >= 14
      ? ["void_appetite", "veshanne_unbound", "cathedral_golem"]
      : ["void_appetite", "cathedral_golem", "herald_of_starvation"],
    gilded_citadel_inner: playerLevel >= 15
      ? ["divine_inquisitor_supreme", "avatar_aurelan", "cathedral_golem"]
      : ["divine_inquisitor_supreme", "cathedral_golem", "champion_aurelan"],
    divine_plane_vestibule: escalation >= 4
      ? ["wheel_incarnate", "avatar_aurelan", "bloom_sovereign"]
      : escalation >= 3
        ? ["sylwen_revenant", "divine_inquisitor_supreme", "herald_of_starvation"]
        : ["divine_inquisitor_supreme", "herald_of_starvation", "void_appetite"],
  };
  const pool = pools[regionId] || ["harvest_harpy"];
  const id = pool[Math.floor(Math.random() * pool.length)];
  return createEnemy(id);
}
