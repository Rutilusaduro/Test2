/**
 * Core stats — rules only. Flavor hooks live in leveling.js / text engine scenes.
 *
 * Str: melee, force-feed, carrying massive targets
 * Dex: initiative, AC, ranged, stealth (penalized at high size)
 * Con: HP, concentration, growth endurance
 * Int: Wizard spell DC / attack
 * Wis: Cleric spell DC / saves, perception
 * Cha: Bard/Warlock casting, social, conversion
 */
import { getStage } from "./stages.js";

export const STAT_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

export const STAT_LABELS = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

/** D&D-style ability modifier */
export function statMod(score = 10) {
  return Math.floor((score - 10) / 2);
}

/**
 * Size-stage modifiers — abundance is power, but mass has trade-offs.
 * Applied on top of base stats during combat / checks.
 */
export function getSizeStatModifiers(stageId = 0) {
  const m = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (stageId >= 4) { m.str += 1; m.cha += 1; }
  if (stageId >= 6) { m.con += 1; m.dex -= 1; }
  if (stageId >= 7) { m.str += 1; m.cha += 1; m.dex -= 1; }
  if (stageId >= 9) { m.con += 1; m.str += 1; m.dex -= 1; }
  if (stageId >= 10) { m.str += 1; m.con += 1; m.dex -= 1; }
  return m;
}

export function getEffectiveStat(character, statKey) {
  const base = character.stats?.[statKey] ?? 10;
  const stageId = getStage(character.lbs).id;
  const sizeMod = getSizeStatModifiers(stageId)[statKey] ?? 0;
  const temp = character.tempStatMods?.[statKey] ?? 0;
  return base + sizeMod + temp;
}

export function getEffectiveStatMod(character, statKey) {
  return statMod(getEffectiveStat(character, statKey));
}

/** Primary spellcasting stat per class */
export function getSpellcastingStat(classId) {
  const map = { wizard: "int", cleric: "wis", bard: "cha", warlock: "cha" };
  return map[classId] || "cha";
}

export function getSpellSaveDC(character) {
  const key = getSpellcastingStat(character.classId);
  const prof = proficiencyBonus(character.level || 1);
  return 8 + prof + getEffectiveStatMod(character, key);
}

export function getSpellAttackBonus(character) {
  const key = getSpellcastingStat(character.classId);
  const prof = proficiencyBonus(character.level || 1);
  return prof + getEffectiveStatMod(character, key);
}

export function proficiencyBonus(level = 1) {
  return Math.floor((level - 1) / 4) + 2;
}

/** Armor class — 10 + dex mod (capped by size at very large stages) */
export function getArmorClass(character) {
  const dex = getEffectiveStatMod(character, "dex");
  const stageId = getStage(character.lbs).id;
  const dexCap = stageId >= 9 ? 0 : stageId >= 6 ? 1 : Infinity;
  const dexContrib = Math.min(dex, dexCap === Infinity ? dex : dexCap);
  return 10 + dexContrib + Math.floor(stageId / 4);
}

/** Melee attack roll bonus */
export function getMeleeAttackBonus(character) {
  return proficiencyBonus(character.level || 1) + getEffectiveStatMod(character, "str");
}

/** Melee damage bonus */
export function getMeleeDamageBonus(character) {
  return getEffectiveStatMod(character, "str") + Math.floor(getStage(character.lbs).id / 3);
}

/** Initiative: d20 + dex mod + size adjustment */
export function rollInitiative(character, rng = Math.random) {
  const dex = getEffectiveStatMod(character, "dex");
  const stageId = getStage(character.lbs).id;
  const sizeInit = stageId <= 3 ? 1 : stageId <= 6 ? 0 : stageId <= 9 ? -1 : -2;
  const roll = Math.floor(rng() * 20) + 1;
  return { roll, total: roll + dex + sizeInit, dex, sizeInit };
}

/** HP per level from hit die + con mod */
export function hpPerLevel(character, hitDie = 8) {
  const con = getEffectiveStatMod(character, "con");
  const stageId = getStage(character.lbs).id;
  const sizeHp = stageId >= 6 ? 2 : stageId >= 3 ? 1 : 0;
  return Math.max(1, hitDie + con + sizeHp);
}

/** Skill / save check — returns { roll, mod, total, dc, success } */
export function abilityCheck(character, statKey, dc = 10, rng = Math.random) {
  const roll = Math.floor(rng() * 20) + 1;
  const mod = getEffectiveStatMod(character, statKey);
  const prof = character.proficientSkills?.includes(statKey) ? proficiencyBonus(character.level || 1) : 0;
  const total = roll + mod + prof;
  return { roll, mod, prof, total, dc, success: total >= dc };
}

export function savingThrow(character, statKey, dc = 10, rng = Math.random) {
  const prof = character.proficientSaves?.includes(statKey) ? proficiencyBonus(character.level || 1) : 0;
  const roll = Math.floor(rng() * 20) + 1;
  const mod = getEffectiveStatMod(character, statKey) + prof;
  const total = roll + mod;
  return { roll, mod, total, dc, success: total >= dc };
}

/** Force-feed / grapple style check — Str vs target's Str or Dex */
export function forceFeedCheck(attacker, target, rng = Math.random) {
  const atk = abilityCheck(attacker, "str", 0, rng);
  const defStat = getEffectiveStatMod(target, "str") >= getEffectiveStatMod(target, "dex") ? "str" : "dex";
  const def = abilityCheck(target, defStat, 0, rng);
  return {
    success: atk.total >= def.total,
    attacker: atk.total,
    defender: def.total,
  };
}

/** Max AP scales with Cha and level */
export function getMaxAbundancePoints(character) {
  const base = 20 + (character.level || 1) * 5;
  const cha = getEffectiveStatMod(character, "cha");
  return base + cha * 2;
}
