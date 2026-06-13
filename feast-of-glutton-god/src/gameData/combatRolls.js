/**
 * Combat Roll Resolution — Feast of the Glutton God
 *
 * Attack rolls, damage rolls, and saving throws reuse skill-check dice logic
 * (advantage/disadvantage, Nat 20 / Nat 1) while adding size-stage combat rules.
 *
 * Critical hit damage: **double damage dice** (not max damage) — keeps variance exciting.
 * Growth damage: thematic types can convert portion of damage into size stages.
 */

import { getStage, advanceStage } from './stages.js';
import {
  getEffectiveStatMod,
  proficiencyBonus,
  getSpellcastingStat,
  getArmorClass,
} from './stats.js';
import {
  rollD20WithAdvantage,
  detectCritical,
  BONUS_TYPES,
} from './skillChecks.js';
import { resolveSavingThrow } from './skillChecks.js';
import {
  ATTACK_CRIT_EFFECTS,
  ATTACK_FUMBLE_EFFECTS,
  SAVE_CRIT_SUCCESS_EFFECTS,
  SAVE_CRIT_FAILURE_EFFECTS,
} from './combatRollOutcomes.js';

// ─── Constants ───────────────────────────────────────────────────────────────

export const ATTACK_TYPES = {
  MELEE: 'melee',
  RANGED: 'ranged',
  SPELL: 'spell',
};

export const DAMAGE_TYPES = {
  PHYSICAL: 'physical',
  OVERINDULGENCE: 'overindulgence',
  PLEASURABLE_PRESSURE: 'pleasurable_pressure',
  ABUNDANCE_OVERLOAD: 'abundance_overload',
};

/** Thematic types convert more damage into growth */
export const GROWTH_DAMAGE_TYPES = new Set([
  DAMAGE_TYPES.OVERINDULGENCE,
  DAMAGE_TYPES.PLEASURABLE_PRESSURE,
  DAMAGE_TYPES.ABUNDANCE_OVERLOAD,
]);

// ─── Dice helpers ────────────────────────────────────────────────────────────

export function rollDice(count, sides, rng = Math.random) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(rng() * sides) + 1);
  }
  return rolls;
}

export function sumDice(rolls) {
  return rolls.reduce((s, r) => s + r, 0);
}

function getEntityStageId(entity) {
  if (entity?.lbs != null) return getStage(entity.lbs).id;
  return entity?.sizeStage ?? 0;
}

function mergeRollMode(explicit, ...sources) {
  const adv = Boolean(explicit.advantage) || sources.some((s) => s.advantage);
  const dis = Boolean(explicit.disadvantage) || sources.some((s) => s.disadvantage);
  return { advantage: adv, disadvantage: dis };
}

// ─── Size-stage combat modifiers ─────────────────────────────────────────────

/**
 * Flat attack bonus from mass (melee/ranged).
 * Larger bodies hit harder in melee; ranged uses half bonus.
 */
export function getSizeAttackBonus(stageId, attackType = ATTACK_TYPES.MELEE) {
  const base = Math.floor(stageId / 4);
  if (attackType === ATTACK_TYPES.RANGED) return Math.floor(base / 2);
  if (attackType === ATTACK_TYPES.SPELL) return 0;
  return base;
}

/** Extra damage dice from attacker size (one die per 3 stages, melee only). */
export function getSizeDamageDice(stageId, attackType = ATTACK_TYPES.MELEE) {
  if (attackType !== ATTACK_TYPES.MELEE) return 0;
  if (stageId >= 10) return 2;
  if (stageId >= 7) return 1;
  return 0;
}

/** Reach in tiles (for UI / range checks) */
export function getAttackReach(attacker, attackType = ATTACK_TYPES.MELEE) {
  const stageId = getEntityStageId(attacker);
  const base = attackType === ATTACK_TYPES.RANGED ? 6 : 1;
  if (attackType === ATTACK_TYPES.MELEE) {
    return base + Math.floor(stageId / 5);
  }
  return base + Math.floor(stageId / 6);
}

/**
 * Size difference drives advantage/disadvantage on attacks.
 * - 3+ stages larger → advantage
 * - Huge attacker vs much smaller agile target → disadvantage
 * - Tiny attacker vs colossal target → disadvantage
 */
export function evaluateSizeAttackRoll(attacker, target) {
  const atkStage = getEntityStageId(attacker);
  const defStage = getEntityStageId(target);
  const diff = atkStage - defStage;

  let advantage = false;
  let disadvantage = false;

  if (diff >= 3) advantage = true;
  if (atkStage >= 7 && diff <= -3) disadvantage = true;
  if (atkStage <= 2 && defStage >= 6) disadvantage = true;

  return { advantage, disadvantage, stageDiff: diff, atkStage, defStage };
}

/**
 * Save modifiers from size — Str/Con bonus at large stages, Dex penalty when massive.
 */
export function getSizeSaveModifiers(entity, stat) {
  const stageId = getEntityStageId(entity);
  const bonuses = [];
  let advantage = false;
  let disadvantage = false;

  if (stat === 'str' || stat === 'con') {
    const bonus = Math.floor(stageId / 4);
    if (bonus > 0) {
      bonuses.push({
        type: BONUS_TYPES.SIZE,
        label: `${stat.toUpperCase()} save (mass)`,
        value: bonus,
        source: 'size_stage',
      });
    }
    if (stageId >= 8 && (stat === 'str' || stat === 'con')) {
      advantage = true;
    }
  }

  if (stat === 'dex' && stageId >= 6) {
    const penalty = Math.floor((stageId - 4) / 3);
    if (penalty > 0) {
      bonuses.push({
        type: BONUS_TYPES.SIZE,
        label: 'DEX save (bulk)',
        value: -penalty,
        source: 'size_stage',
      });
    }
    if (stageId >= 9) disadvantage = true;
  }

  return { bonuses, advantage, disadvantage, stageId };
}

// ─── Attack roll modifiers ───────────────────────────────────────────────────

export function buildAttackModifiers(attacker, options = {}) {
  const {
    attackType = ATTACK_TYPES.MELEE,
    stat: statOverride,
    finesse = false,
    bonuses = [],
    includeProficiency = true,
  } = options;

  const stageId = getEntityStageId(attacker);
  let attackStat = statOverride;
  if (!attackStat) {
    if (attackType === ATTACK_TYPES.SPELL) {
      attackStat = getSpellcastingStat(attacker.classId);
    } else if (attackType === ATTACK_TYPES.RANGED) {
      attackStat = 'dex';
    } else {
      attackStat = finesse ? 'dex' : 'str';
    }
  }

  const breakdown = [];

  breakdown.push({
    type: BONUS_TYPES.STAT,
    label: `${attackStat.toUpperCase()} modifier`,
    value: getEffectiveStatMod(attacker, attackStat),
    source: attackStat,
  });

  if (includeProficiency) {
    breakdown.push({
      type: BONUS_TYPES.PROFICIENCY,
      label: 'Proficiency',
      value: proficiencyBonus(attacker.level ?? 1),
      source: 'proficiency',
    });
  }

  const sizeAtk = getSizeAttackBonus(stageId, attackType);
  if (sizeAtk > 0) {
    breakdown.push({
      type: BONUS_TYPES.SIZE,
      label: 'Massive presence',
      value: sizeAtk,
      source: 'size_stage',
    });
  }

  for (const b of bonuses) {
    breakdown.push({
      type: b.type ?? BONUS_TYPES.CIRCUMSTANTIAL,
      label: b.label ?? 'Bonus',
      value: b.value ?? 0,
      source: b.source ?? 'circumstantial',
    });
  }

  const numericTotal = breakdown.reduce((s, b) => s + (b.value ?? 0), 0);

  return { breakdown, numericTotal, attackStat, stageId, attackType };
}

/**
 * Resolve an attack roll vs target AC.
 */
export function resolveAttackRoll(attacker, target, options = {}) {
  const {
    attackType = ATTACK_TYPES.MELEE,
    bonuses = [],
    advantage = false,
    disadvantage = false,
    rng = Math.random,
    label = null,
  } = options;

  const modifiers = buildAttackModifiers(attacker, { ...options, attackType, bonuses });
  const sizeRoll = target ? evaluateSizeAttackRoll(attacker, target) : { advantage: false, disadvantage: false };
  const rollMode = mergeRollMode({ advantage, disadvantage }, sizeRoll);

  const { rolls, chosen: naturalRoll, mode: rollModeLabel } = rollD20WithAdvantage({
    ...rollMode,
    rng,
  });

  const ac = target?.ac ?? getArmorClass(target);
  const total = naturalRoll + modifiers.numericTotal;
  const critical = detectCritical(naturalRoll);

  let hit;
  if (critical === 'success') hit = true;
  else if (critical === 'failure') hit = false;
  else hit = total >= ac;

  const outcomeKey = critical === 'success'
    ? 'critical_hit'
    : critical === 'failure'
      ? 'critical_miss'
      : hit
        ? 'hit'
        : 'miss';

  const critTable = ATTACK_CRIT_EFFECTS[attackType] ?? ATTACK_CRIT_EFFECTS.default;
  const fumbleTable = ATTACK_FUMBLE_EFFECTS[attackType] ?? ATTACK_FUMBLE_EFFECTS.default;

  return {
    type: 'attack_roll',
    label: label ?? `${attackType} attack`,
    attacker,
    target,
    attackType,

    rolls,
    naturalRoll,
    rollMode: rollModeLabel,
    modifierTotal: modifiers.numericTotal,
    total,
    breakdown: modifiers.breakdown,
    attackStat: modifiers.attackStat,
    stageId: modifiers.stageId,

    ac,
    hit,
    isCriticalHit: critical === 'success',
    isCriticalMiss: critical === 'failure',
    critical,
    outcomeKey,
    margin: total - ac,

    sizeRoll,
    critEffects: critical === 'success' ? critTable : null,
    fumbleEffects: critical === 'failure' ? fumbleTable : null,
    textKey: `combat.attack.${outcomeKey}.${attackType}`,
  };
}

// ─── Damage rolls ──────────────────────────────────────────────────────────────

/**
 * Roll damage. On critical hit, **double the number of dice** (design choice).
 *
 * @param {object} spec - { dice: { count, sides }, flatBonus, stat, damageType, growthConversion }
 */
export function resolveDamageRoll(attacker, spec = {}, options = {}) {
  const {
    dice = { count: 1, sides: 8 },
    flatBonus = 0,
    stat = null,
    damageType = DAMAGE_TYPES.PHYSICAL,
    growthConversion = 0,
    attackType = ATTACK_TYPES.MELEE,
  } = spec;

  const { critical = false, rng = Math.random, bonuses = [] } = options;
  const stageId = getEntityStageId(attacker);

  let diceCount = dice.count ?? 1;
  if (critical) diceCount *= 2;

  const sizeDice = getSizeDamageDice(stageId, attackType);
  const mainRolls = rollDice(diceCount, dice.sides ?? 8, rng);
  const sizeRolls = sizeDice > 0 ? rollDice(sizeDice, dice.sides ?? 8, rng) : [];

  const statMod = stat ? getEffectiveStatMod(attacker, stat) : 0;
  const bonusTotal = bonuses.reduce((s, b) => s + (b.value ?? 0), 0);
  const diceTotal = sumDice(mainRolls) + sumDice(sizeRolls);
  const total = Math.max(1, diceTotal + flatBonus + statMod + bonusTotal);

  const autoGrowthConversion = GROWTH_DAMAGE_TYPES.has(damageType) ? 0.25 : 0;
  const effectiveGrowthConversion = growthConversion || autoGrowthConversion;

  return {
    type: 'damage_roll',
    damageType,
    attackType,
    critical,
    mainRolls,
    sizeRolls,
    dice: { count: diceCount, sides: dice.sides ?? 8 },
    flatBonus,
    statMod,
    bonusTotal,
    total,
    growthConversion: effectiveGrowthConversion,
    stageId,
    textKey: `combat.damage.${damageType}${critical ? '.crit' : ''}`,
  };
}

/** Default melee weapon damage for the game. */
export function resolveMeleeDamage(attacker, options = {}) {
  const stageId = getEntityStageId(attacker);
  const baseSides = 8;
  const baseCount = 1 + Math.floor(stageId / 6);

  return resolveDamageRoll(
    attacker,
    {
      dice: { count: baseCount, sides: baseSides },
      flatBonus: Math.floor(stageId / 3),
      stat: 'str',
      damageType: DAMAGE_TYPES.PLEASURABLE_PRESSURE,
      attackType: ATTACK_TYPES.MELEE,
      growthConversion: 0.15,
    },
    options,
  );
}

/** Spell damage that may allow a save for half. */
export function resolveSpellDamage(caster, spec, options = {}) {
  return resolveDamageRoll(caster, {
    dice: spec.dice ?? { count: 2, sides: 6 },
    flatBonus: spec.flatBonus ?? 0,
    stat: getSpellcastingStat(caster.classId),
    damageType: spec.damageType ?? DAMAGE_TYPES.ABUNDANCE_OVERLOAD,
    growthConversion: spec.growthConversion ?? 0.3,
    attackType: ATTACK_TYPES.SPELL,
    ...spec,
  }, options);
}

// ─── Apply damage & growth ─────────────────────────────────────────────────────

/**
 * Apply damage to target, optionally converting some to growth stages.
 * Mutates target in place. Returns breakdown for logging.
 */
export function applyCombatDamage(target, damageResult, options = {}) {
  const {
    growthPerStage = 10,
    minHpDamage = 1,
    applyGrowthFn = null,
  } = options;

  let hpDamage = damageResult.total;
  let growthStages = 0;

  const conversion = damageResult.growthConversion ?? 0;
  if (conversion > 0) {
    const growthHp = Math.floor(hpDamage * conversion);
    growthStages = Math.floor(growthHp / growthPerStage);
    hpDamage -= growthStages * growthPerStage;
  }

  if (GROWTH_DAMAGE_TYPES.has(damageResult.damageType) && growthStages === 0 && hpDamage >= growthPerStage) {
    growthStages = Math.floor(hpDamage / (growthPerStage * 2));
    if (growthStages > 0) {
      hpDamage -= growthStages * growthPerStage;
    }
  }

  hpDamage = Math.max(damageResult.total > 0 ? minHpDamage : 0, hpDamage);
  if (damageResult.total === 0) hpDamage = 0;

  const prevHp = target.hp ?? 0;
  target.hp = Math.max(0, prevHp - hpDamage);

  let growth = null;
  if (growthStages > 0) {
    if (applyGrowthFn) {
      growth = applyGrowthFn(target, growthStages);
    } else {
      const copy = { ...target };
      advanceStage(copy, growthStages);
      target.lbs = copy.lbs;
      growth = { stages: growthStages, endStage: getStage(target.lbs).id };
    }
  }

  return {
    hpDamage,
    growthStages,
    growth,
    damageType: damageResult.damageType,
    totalRolled: damageResult.total,
    critical: damageResult.critical,
  };
}

/** Apply crit/fumble side effects from attack roll tables. */
export function applyAttackCritEffects(attacker, target, attackResult, { applyGrowthFn } = {}) {
  const effects = attackResult.isCriticalHit
    ? attackResult.critEffects
    : attackResult.isCriticalMiss
      ? attackResult.fumbleEffects
      : null;
  if (!effects) return { attacker, target, effects: null };

  if (effects.apGain) attacker.ap = (attacker.ap ?? 0) + effects.apGain;
  if (effects.apCost) attacker.ap = Math.max(0, (attacker.ap ?? 0) - effects.apCost);

  if (effects.selfGrowth && effects.selfGrowth > 0) {
    if (applyGrowthFn) applyGrowthFn(attacker, effects.selfGrowth);
    else advanceStage(attacker, effects.selfGrowth);
  }

  if (effects.growthOnTarget && target && effects.growthOnTarget > 0) {
    if (applyGrowthFn) applyGrowthFn(target, effects.growthOnTarget);
    else advanceStage(target, effects.growthOnTarget);
  }

  if (effects.corruption && target) {
    target.corruption = Math.min(100, (target.corruption ?? 0) + effects.corruption);
  }

  return { attacker, target, effects };
}

// ─── Saving throws ─────────────────────────────────────────────────────────────

/**
 * Combat saving throw with size-stage modifiers and save-specific crit rules.
 */
export function resolveCombatSave(defender, stat, dc, options = {}) {
  const {
    bonuses = [],
    advantage = false,
    disadvantage = false,
    rng = Math.random,
    label = null,
  } = options;

  const sizeMods = getSizeSaveModifiers(defender, stat);
  const rollMode = mergeRollMode({ advantage, disadvantage }, sizeMods);

  const result = resolveSavingThrow(defender, stat, dc, {
    bonuses: [...sizeMods.bonuses, ...bonuses],
    advantage: rollMode.advantage,
    disadvantage: rollMode.disadvantage,
    rng,
    label: label ?? `${stat.toUpperCase()} Save`,
  });

  const critSuccess = result.critical === 'success';
  const critFail = result.critical === 'failure';

  const saveEffects = critSuccess
    ? SAVE_CRIT_SUCCESS_EFFECTS.default
    : critFail
      ? (SAVE_CRIT_FAILURE_EFFECTS[stat] ?? SAVE_CRIT_FAILURE_EFFECTS.default)
      : null;

  return {
    ...result,
    type: 'saving_throw',
    saveStat: stat,
    saveImmune: critSuccess,
    saveCritFail: critFail,
    saveEffects,
    sizeMods,
    outcomeKey: critSuccess
      ? 'critical_success'
      : critFail
        ? 'critical_failure'
        : result.success
          ? 'success'
          : 'failure',
    textKey: `combat.save.${critSuccess ? 'crit' : critFail ? 'fumble' : result.success ? 'pass' : 'fail'}.${stat}`,
  };
}

/**
 * Compute final damage after a save.
 * - Nat 20: no damage (even if effect normally deals half on success)
 * - Success + halfOnSuccess: half damage
 * - Success + noneOnSuccess: no damage
 * - Fail: full damage; crit fail may trigger extra effects separately
 */
export function applySaveDamage(fullDamage, saveResult, options = {}) {
  const { halfOnSuccess = true, noneOnSuccess = false } = options;

  if (saveResult.saveImmune || saveResult.critical === 'success') return 0;
  if (!saveResult.success) return fullDamage;
  if (noneOnSuccess) return 0;
  if (halfOnSuccess) return Math.floor(fullDamage / 2);
  return fullDamage;
}

/** Apply save crit success/failure side effects. */
export function applySaveCritEffects(defender, saveResult, { applyGrowthFn } = {}) {
  const effects = saveResult.saveEffects;
  if (!effects) return defender;

  if (effects.apGain) defender.ap = (defender.ap ?? 0) + effects.apGain;
  if (effects.selfGrowth && effects.selfGrowth > 0) {
    if (applyGrowthFn) applyGrowthFn(defender, effects.selfGrowth);
    else advanceStage(defender, effects.selfGrowth);
  }
  if (effects.corruption) {
    defender.corruption = Math.min(100, (defender.corruption ?? 0) + effects.corruption);
  }
  if (effects.advantageNext) {
    defender.tempAdvantage = true;
  }

  return defender;
}

/**
 * Full spell/effect pipeline: save → damage → optional growth.
 */
export function resolveEffectWithSave(defender, spec, options = {}) {
  const {
    saveStat = 'dex',
    dc,
    damage,
    halfOnSuccess = true,
    noneOnSuccess = false,
    rng = Math.random,
    applyGrowthFn,
  } = options;

  const save = resolveCombatSave(defender, saveStat, dc, { rng, ...options });
  const finalDamage = damage != null
    ? applySaveDamage(damage, save, { halfOnSuccess, noneOnSuccess })
    : 0;

  let damageResult = null;
  let applied = null;

  if (finalDamage > 0) {
    damageResult = {
      total: finalDamage,
      damageType: spec.damageType ?? DAMAGE_TYPES.ABUNDANCE_OVERLOAD,
      growthConversion: spec.growthConversion ?? 0.35,
      critical: false,
    };
    applied = applyCombatDamage(defender, damageResult, { applyGrowthFn, ...options });
  }

  if (save.saveImmune || save.saveCritFail) {
    applySaveCritEffects(defender, save, { applyGrowthFn });
  }

  return { save, damageResult, applied, finalDamage };
}

// ─── Formatting & text engine ──────────────────────────────────────────────────

export function formatAttackSummary(attack, damage = null, applied = null) {
  const crit = attack.isCriticalHit ? ' ★ CRIT' : attack.isCriticalMiss ? ' ✦ fumble' : '';
  const mode = attack.rollMode !== 'normal' ? ` (${attack.rollMode})` : '';
  const rollDetail = attack.rolls.length > 1
    ? `[${attack.rolls.join(', ')} → ${attack.naturalRoll}]`
    : `${attack.naturalRoll}`;
  let line = `${attack.label}: ${rollDetail}${mode} + ${attack.modifierTotal} = ${attack.total} vs AC ${attack.ac} — ${
    attack.hit ? 'HIT' : 'MISS'
  }${crit}`;

  if (damage && applied) {
    line += ` | ${applied.hpDamage} HP`;
    if (applied.growthStages > 0) line += `, +${applied.growthStages} growth stage(s)`;
    if (damage.critical) line += ' (double dice)';
  }
  return line;
}

export function formatSaveSummary(save) {
  const crit = save.saveImmune ? ' ★ CRITICAL SAVE' : save.saveCritFail ? ' ✦ overwhelmed' : '';
  const mode = save.rollMode !== 'normal' ? ` (${save.rollMode})` : '';
  return `${save.label}: ${save.naturalRoll}${mode} + ${save.modifierTotal} = ${save.total} vs DC ${save.dc} — ${
    save.success ? 'PASS' : 'FAIL'
  }${crit}`;
}

export function toCombatTextContext(rollResult) {
  return {
    combatRollType: rollResult.type,
    combatOutcome: rollResult.outcomeKey,
    combatCritical: rollResult.critical ?? null,
    combatTextKey: rollResult.textKey,
    combatNaturalRoll: rollResult.naturalRoll,
    combatTotal: rollResult.total,
    combatHit: rollResult.hit ?? null,
    combatDC: rollResult.dc ?? rollResult.ac ?? null,
  };
}
