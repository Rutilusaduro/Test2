/**
 * Leveling — abundance-driven progression with class-specific spell learning.
 */
import { hpPerLevel } from "./stats.js";
import { getClass } from "./classes.js";
import { initSpellSlots, recoverAllSpellSlots } from "./spellSlots.js";
import { getMaxAbundancePoints } from "./stats.js";
import { getStage } from "./stages.js";
import { getFeaturesForLevel } from "./levelFeatures.js";
import {
  resolveSpellLearning,
  buildStartingSpells,
  ensureSpellState,
  getCharacterSpells,
} from "./spellLearning.js";
import { buildLevelUpMessage } from "../textEngine/scenes/leveling/index.js";
import { isCosmicThreat } from "./enemies.js";
import {
  ASI_LEVELS,
  buildAsiOptions,
  getRoleplayOptions,
} from "./levelUpChoices.js";
import { autoPrepareSpells } from "./spellPreparation.js";
import { restoreFavorFromRest } from "./favor.js";
import { tickRegionHostility } from "./regionHostility.js";
import { buildMulticlassSpellOptions } from "./spellLearning.js";
import { resetDivineResonance } from "./divineResonance.js";

export const MAX_LEVEL = 20;

/** XP required to reach each level (cumulative) */
export const XP_THRESHOLDS = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 115000, 132000, 150000, 170000, 192000, 215000, 240000, 265000,
];

export const XP_SOURCES = {
  combat_win: 50,
  combat_convert: 80,
  feed_npc: 15,
  bless_npc: 20,
  feast_npc: 40,
  recruit_companion: 200,
  major_story: 500,
  npc_growth_milestone: 25,
  fatten_stage: 20,
  quest_complete: 100,
  cosmic_conversion: 200,
  divine_attention_milestone: 150,
};

/** Size stage caps unlocked by level milestones (tier ids on new ladder) */
export const SIZE_CAP_BY_LEVEL = {
  1: 3,
  3: 5,
  5: 7,
  7: 9,
  9: 11,
  12: 12,
  13: 12,
  15: 13,
  16: 14,
};

const LEVEL_UP_FLAVOR = [
  null,
  "the Fat Goddess's spark kindles within you — the feast has only begun.",
  "Your body carries abundance more easily now; every curve feels intentional.",
  "Power settles into your softness like warm honey.",
  "You have become a vessel worthy of greater indulgence.",
  "The Fat Goddess smiles — your growth is her gospel.",
  "Milestones of flesh and faith align in glorious harmony.",
  "You radiate plenty; the world leans closer to be fed.",
  "A divine heaviness blesses every step.",
  "Legends will speak of the softness you wield.",
  "You are abundance incarnate — beautiful, vast, unstoppable.",
  "Titanic presence gathers beneath your skin; the feast now bends kingdoms around you.",
  "Near apotheosis of the eternal feast.",
  "World-shaping hunger answers when you whisper. Reality grows softer at your command.",
  "Pilgrims would call this impossible. You call it another exquisite becoming.",
  "The Fat Goddess no longer feels distant — her pulse and yours beat in the same golden rhythm.",
  "You cross into legend with every breath, every step, every glorious pound.",
  "At the edge of divinity, your abundance remakes allies, foes, and lands alike.",
  "A living avatar of the Fat Goddess's endless, pleasurable fullness.",
  "Level twenty: the feast crowns you. Even gods must reckon with your inexhaustible plenty.",
];

export function getXpForNextLevel(character) {
  const level = character.level || 1;
  if (level >= MAX_LEVEL) return null;
  return XP_THRESHOLDS[level + 1] ?? null;
}

export function getXpProgress(character) {
  const level = character.level || 1;
  const current = XP_THRESHOLDS[level] ?? 0;
  if (level >= MAX_LEVEL) {
    return { current, next: null, xp: character.xp ?? 0, pct: 100, maxLevel: true };
  }
  const next = XP_THRESHOLDS[level + 1] ?? current;
  return {
    current,
    next,
    xp: character.xp ?? 0,
    pct: next > current ? ((character.xp - current) / (next - current)) * 100 : 100,
    maxLevel: false,
  };
}

export function getLevelUpFlavor(level) {
  return LEVEL_UP_FLAVOR[level] || LEVEL_UP_FLAVOR[LEVEL_UP_FLAVOR.length - 1];
}

export function getSizeCapForLevel(level) {
  let cap = 5;
  for (const [lvl, stageCap] of Object.entries(SIZE_CAP_BY_LEVEL)) {
    if (level >= Number(lvl)) cap = stageCap;
  }
  return cap;
}

/**
 * Apply a single level up with spell learning, features, and celebratory metadata.
 * @param {object} character
 * @param {{ growthLevelUp?: boolean }} [context]
 */
export function applyLevelUp(character, context = {}) {
  ensureSpellState(character);
  const oldLevel = character.level || 1;
  const oldSizeCap = character.sizeCap ?? getSizeCapForLevel(oldLevel);
  const oldStage = getStage(character.lbs).id;

  character.level = oldLevel + 1;
  const cls = getClass(character.classId);
  const hitDie = cls.hitDie || 8;

  const hpGain = hpPerLevel(character, hitDie);
  character.maxHp = (character.maxHp || 10) + hpGain;
  character.hp = character.maxHp;

  let asi = false;
  if (ASI_LEVELS.includes(character.level)) {
    asi = true;
  }

  initSpellSlots(character);
  recoverAllSpellSlots(character);

  const maxAp = getMaxAbundancePoints(character);
  character.ap = Math.min((character.ap || 0) + 10, maxAp);

  character.sizeCap = getSizeCapForLevel(character.level);
  const sizeCapIncreased = character.sizeCap > oldSizeCap;

  const features = getFeaturesForLevel(
    character.classId,
    character.subclassId,
    character.level,
  );
  character.features = character.features || [];
  for (const feat of features) {
    if (!character.features.find((f) => f.id === feat.id)) {
      character.features.push({ ...feat, grantedAt: character.level });
    }
  }

  const spellResult = resolveSpellLearning(character, character.level);
  character.spells = getCharacterSpells(character);

  const growthLevelUp = context.growthLevelUp
    || getStage(character.lbs).id > oldStage
    || sizeCapIncreased;

  const result = {
    level: character.level,
    hpGain,
    flavor: getLevelUpFlavor(character.level),
    asi,
    sizeCap: character.sizeCap,
    sizeCapIncreased,
    features,
    autoGrantedSpells: spellResult.autoGranted,
    growthHighlights: spellResult.growthHighlights,
    growthLevelUp,
    spellChoices: spellResult.choices,
    narrative: null,
  };

  result.narrative = buildLevelUpMessage(character, result);

  const pending = [];
  if (spellResult.choices) {
    pending.push({
      level: character.level,
      type: 'spell_choice',
      narrative: result.narrative,
      ...spellResult.choices,
    });
  } else {
    pending.push({
      level: character.level,
      type: 'celebration',
      narrative: result.narrative,
    });
  }

  if (asi) {
    pending.push({
      level: character.level,
      type: 'asi_choice',
      pickCount: 1,
      options: buildAsiOptions(character),
      description: 'Ability Score Improvement — channel +2 into one stat that reflects your abundance.',
    });
  }

  if (growthLevelUp || sizeCapIncreased) {
    pending.push({
      level: character.level,
      type: 'roleplay',
      options: getRoleplayOptions(growthLevelUp),
      description: 'How do you mark this milestone of growth and power? (Optional flavor)',
      optional: true,
    });
  }

  if (character.level === 13) {
    const mcOptions = buildMulticlassSpellOptions(character);
    if (mcOptions.length) {
      pending.push({
        level: 13,
        type: 'multiclass_spell_choice',
        pickCount: 1,
        options: mcOptions,
        description: 'Pact of Shared Hunger — choose one spell from another class\'s curriculum (slot level ≤ 7).',
      });
    }
  }

  if (pending.length) {
    character.levelUpsPending = [...(character.levelUpsPending || []), ...pending];
  }

  return result;
}

export function addExperience(character, amount, source = "general", context = {}) {
  character.xp = (character.xp || 0) + amount;
  const levelUps = [];
  while ((character.level || 1) < MAX_LEVEL && character.xp >= (XP_THRESHOLDS[character.level + 1] ?? Infinity)) {
    levelUps.push(applyLevelUp(character, context));
  }
  return { character, levelUps, source, amount };
}

/** Award XP when the player fattens someone else (overworld or combat). */
export function awardFatteningXp(player, stagesGained = 1, source = 'fatten_other') {
  if (!player || stagesGained <= 0) return { levelUps: [], amount: 0 };
  const amount = (XP_SOURCES.fatten_stage ?? 20) * stagesGained;
  return addExperience(player, amount, source);
}

/** Award XP from combat results */
export function awardCombatXp(player, combat) {
  if (!combat?.victory || combat.victory === "lose") return { xp: 0, levelUps: [] };
  let xp = XP_SOURCES.combat_win;
  if (combat.victory === "converted") {
    const hasCosmic = (combat.enemies ?? []).some((e) => isCosmicThreat(e));
    xp = hasCosmic ? XP_SOURCES.cosmic_conversion : XP_SOURCES.combat_convert;
  }
  xp += combat.enemies.length * 10;
  const growthLevelUp = combat.allies?.some((a) => a.isPlayer && a.grewThisCombat);
  return addExperience(player, xp, "combat", { growthLevelUp });
}

/** Long rest — full HP, slots, some AP, favor top-up */
export function longRest(character, game = null) {
  character.hp = character.maxHp;
  recoverAllSpellSlots(character);
  autoPrepareSpells(character);
  const maxAp = getMaxAbundancePoints(character);
  character.ap = Math.min(maxAp, (character.ap || 0) + 15);
  if (character.restFlags) {
    character.restFlags.hungerForMoreUsed = false;
    character.restFlags.indulgeUsed = false;
  }
  if (game) {
    restoreFavorFromRest(character);
    resetDivineResonance(character);
    tickRegionHostility(game, { longRest: true });
  }
  return character;
}

/** Initialize spell knowledge at character creation. */
export function initializeStartingSpells(character) {
  const start = buildStartingSpells(character.classId, character.subclassId);
  character.spellsKnown = start.spellsKnown;
  if (character.classId === 'wizard') character.spellbook = [...start.spellsKnown];
  autoPrepareSpells(character);
  character.spells = getCharacterSpells(character);
  return start;
}
