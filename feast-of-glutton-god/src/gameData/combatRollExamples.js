/**
 * Example combat roll calculations — reference only, not imported at runtime.
 */
import { DC } from './skills.js';
import { getArmorClass, getSpellSaveDC } from './stats.js';
import {
  ATTACK_TYPES,
  DAMAGE_TYPES,
  resolveAttackRoll,
  resolveMeleeDamage,
  resolveSpellDamage,
  resolveCombatSave,
  resolveEffectWithSave,
  applyCombatDamage,
  applySaveDamage,
  getSizeAttackBonus,
  getSizeDamageDice,
  evaluateSizeAttackRoll,
  getSizeSaveModifiers,
  formatAttackSummary,
  formatSaveSummary,
} from './combatRolls.js';

/** Stage 8 melee attacker vs stage 3 defender — size advantage + flat bonus */
export function exampleSizedMeleeAttack(attacker, defender) {
  const sizeAdv = evaluateSizeAttackRoll(attacker, defender);
  // stage 8 vs 3 → diff 5 → advantage
  const attack = resolveAttackRoll(attacker, defender, {
    attackType: ATTACK_TYPES.MELEE,
    advantage: sizeAdv.advantage,
    disadvantage: sizeAdv.disadvantage,
  });
  // getSizeAttackBonus(8, 'melee') → floor(8/4) = +2
  return attack;
}

/** Full melee pipeline with crit doubling dice */
export function exampleMeleeHit(attacker, target) {
  const attack = resolveAttackRoll(attacker, target, { attackType: ATTACK_TYPES.MELEE });
  if (!attack.hit) return { attack, damage: null };

  const damage = resolveMeleeDamage(attacker, { critical: attack.isCriticalHit });
  // Crit: dice count doubled; size dice added separately
  const targetCopy = { ...target };
  const applied = applyCombatDamage(targetCopy, damage);
  return {
    attack,
    damage,
    applied,
    summary: formatAttackSummary(attack, damage, applied),
  };
}

/** Dex save vs area abundance overload — half damage on success */
export function exampleAreaSave(defender, caster, damageTotal = 24) {
  const dc = getSpellSaveDC(caster);
  const save = resolveCombatSave(defender, 'dex', dc);
  const final = applySaveDamage(damageTotal, save, { halfOnSuccess: true });
  // Nat 20 save → final = 0 regardless of half rule
  return { save, finalDamage: final, summary: formatSaveSummary(save) };
}

/** Spell with save + growth conversion */
export function exampleOverflowBurst(caster, defender) {
  const damage = resolveSpellDamage(caster, {
    dice: { count: 3, sides: 6 },
    damageType: DAMAGE_TYPES.ABUNDANCE_OVERLOAD,
    growthConversion: 0.4,
  });
  return resolveEffectWithSave(defender, damage, {
    saveStat: 'con',
    dc: getSpellSaveDC(caster),
    damage: damage.total,
    halfOnSuccess: true,
  });
}

/** Size modifiers reference */
export function exampleSizeModifiers(stageId) {
  return {
    attackBonus: getSizeAttackBonus(stageId, ATTACK_TYPES.MELEE),
    extraDamageDice: getSizeDamageDice(stageId, ATTACK_TYPES.MELEE),
    strSave: getSizeSaveModifiers({ lbs: 0, sizeStage: stageId }, 'str'),
    dexSave: getSizeSaveModifiers({ lbs: 0, sizeStage: stageId }, 'dex'),
  };
}

// Example calculation (stage 9 attacker, level 5, Str mod +4):
// Attack: d20 + 4 (str) + 3 (prof) + 2 (size) = d20 + 9 vs AC
// Damage: 2d8 (doubled on crit) + 1d8 size + 3 flat + 4 str = substantial
// Dex save at stage 9: -1 to -2 penalty, disadvantage on dex saves
