/**
 * Leveling — abundance-driven progression.
 * XP from spreading Gorgara's gift; level-ups feel celebratory.
 * Flavor strings are data-only for future text-engine hooks.
 */
import { hpPerLevel } from "./stats.js";
import { getClass } from "./classes.js";
import { initSpellSlots, getMaxSpellSlots, recoverAllSpellSlots } from "./spellSlots.js";
import { getMaxAbundancePoints } from "./stats.js";
import { getStage } from "./stages.js";

export const MAX_LEVEL = 12;

/** XP required to reach each level (cumulative) */
export const XP_THRESHOLDS = [
  0, 0, 300, 900, 1800, 3000, 4500, 6500, 9000, 12000, 15500, 19500, 24000,
];

export const XP_SOURCES = {
  combat_win: 50,
  combat_convert: 80,
  feed_npc: 15,
  bless_npc: 20,
  feast_npc: 40,
  recruit_companion: 200,
  major_story: 500,
};

/** Size stage caps unlocked by level milestones */
export const SIZE_CAP_BY_LEVEL = {
  1: 5, 3: 7, 6: 9, 9: 11, 12: 11,
};

export function getXpForNextLevel(character) {
  const level = character.level || 1;
  if (level >= MAX_LEVEL) return null;
  return XP_THRESHOLDS[level + 1] ?? null;
}

export function getXpProgress(character) {
  const level = character.level || 1;
  const current = XP_THRESHOLDS[level] ?? 0;
  const next = XP_THRESHOLDS[level + 1] ?? current;
  return { current, next, xp: character.xp ?? 0, pct: next > current ? ((character.xp - current) / (next - current)) * 100 : 100 };
}

export function addExperience(character, amount, source = "general") {
  character.xp = (character.xp || 0) + amount;
  const levelUps = [];
  while ((character.level || 1) < MAX_LEVEL && character.xp >= (XP_THRESHOLDS[character.level + 1] ?? Infinity)) {
    levelUps.push(applyLevelUp(character));
  }
  return { character, levelUps, source, amount };
}

/** ASI at levels 4, 8, 12 — +2 one stat or +1 two stats (simplified: +1 primary) */
const ASI_LEVELS = [4, 8, 12];

const LEVEL_UP_FLAVOR = [
  null,
  "Gorgara's spark kindles within you — the feast has only begun.",
  "Your body carries abundance more easily now; every curve feels intentional.",
  "Power settles into your softness like warm honey.",
  "You have become a vessel worthy of greater indulgence.",
  "The Everfull smiles — your growth is her gospel.",
  "Milestones of flesh and faith align in glorious harmony.",
  "You radiate plenty; the world leans closer to be fed.",
  "A divine heaviness blesses every step.",
  "Legends will speak of the softness you wield.",
  "You are abundance incarnate — beautiful, vast, unstoppable.",
  "Near apotheosis of the eternal feast.",
  "A living avatar of Gorgara's endless, pleasurable fullness.",
];

export function getLevelUpFlavor(level) {
  return LEVEL_UP_FLAVOR[level] || LEVEL_UP_FLAVOR[LEVEL_UP_FLAVOR.length - 1];
}

export function applyLevelUp(character) {
  const oldLevel = character.level || 1;
  character.level = oldLevel + 1;
  const cls = getClass(character.classId);
  const hitDie = cls.hitDie || 8;

  const hpGain = hpPerLevel(character, hitDie);
  character.maxHp = (character.maxHp || 10) + hpGain;
  character.hp = character.maxHp;

  if (ASI_LEVELS.includes(character.level)) {
    const primary = cls.primaryStat || "cha";
    character.stats = character.stats || {};
    character.stats[primary] = (character.stats[primary] || 10) + 1;
  }

  initSpellSlots(character);
  recoverAllSpellSlots(character);

  const maxAp = getMaxAbundancePoints(character);
  character.ap = Math.min((character.ap || 0) + 10, maxAp);

  character.sizeCap = getSizeCapForLevel(character.level);

  return {
    level: character.level,
    hpGain,
    flavor: getLevelUpFlavor(character.level),
    asi: ASI_LEVELS.includes(character.level),
    sizeCap: character.sizeCap,
  };
}

export function getSizeCapForLevel(level) {
  let cap = 5;
  for (const [lvl, stageCap] of Object.entries(SIZE_CAP_BY_LEVEL)) {
    if (level >= Number(lvl)) cap = stageCap;
  }
  return cap;
}

/** Award XP from combat results */
export function awardCombatXp(player, combat) {
  if (!combat?.victory || combat.victory === "lose") return { xp: 0, levelUps: [] };
  let xp = XP_SOURCES.combat_win;
  if (combat.victory === "converted") xp = XP_SOURCES.combat_convert;
  xp += combat.enemies.length * 10;
  return addExperience(player, xp, "combat");
}

/** Long rest — full HP, slots, some AP */
export function longRest(character) {
  character.hp = character.maxHp;
  recoverAllSpellSlots(character);
  const maxAp = getMaxAbundancePoints(character);
  character.ap = Math.min(maxAp, (character.ap || 0) + 15);
  return character;
}
