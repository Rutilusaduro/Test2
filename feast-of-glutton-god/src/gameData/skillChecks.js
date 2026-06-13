/**
 * Skill Check Resolution System — Feast of the Glutton God
 *
 * Core formula: d20 + stat mod + proficiency (if proficient) + categorized bonuses
 * Success when total >= DC. Nat 20 always succeeds; Nat 1 always fails.
 *
 * Math is separated from narrative via textKey / toTextContext() hooks.
 */

import { getStage } from './stages.js';
import { getEffectiveStatMod, proficiencyBonus } from './stats.js';
import { SKILLS, SKILL_SIZE_ROLL, DC, isSkillProficient } from './skills.js';
import {
  CRIT_SUCCESS_EFFECTS,
  CRIT_FAILURE_EFFECTS,
  applyCheckEffects,
} from './skillCheckOutcomes.js';

// ─── Dice ────────────────────────────────────────────────────────────────────

export function rollD20(rng = Math.random) {
  return Math.floor(rng() * 20) + 1;
}

/**
 * Roll with advantage/disadvantage. Multiple sources do not stack.
 * Advantage + disadvantage cancel → single d20.
 */
export function rollD20WithAdvantage({ advantage = false, disadvantage = false, rng = Math.random } = {}) {
  const hasAdv = Boolean(advantage);
  const hasDis = Boolean(disadvantage);

  if (hasAdv && hasDis) {
    const roll = rollD20(rng);
    return { rolls: [roll], chosen: roll, mode: 'normal' };
  }
  if (hasAdv) {
    const a = rollD20(rng);
    const b = rollD20(rng);
    return { rolls: [a, b], chosen: Math.max(a, b), mode: 'advantage' };
  }
  if (hasDis) {
    const a = rollD20(rng);
    const b = rollD20(rng);
    return { rolls: [a, b], chosen: Math.min(a, b), mode: 'disadvantage' };
  }
  const roll = rollD20(rng);
  return { rolls: [roll], chosen: roll, mode: 'normal' };
}

export function detectCritical(naturalRoll) {
  if (naturalRoll === 20) return 'success';
  if (naturalRoll === 1) return 'failure';
  return null;
}

// ─── Bonus categories (extensible) ───────────────────────────────────────────

export const BONUS_TYPES = {
  STAT: 'stat',
  PROFICIENCY: 'proficiency',
  SIZE: 'size',
  ABUNDANCE: 'abundance',
  FEATURE: 'feature',
  CIRCUMSTANTIAL: 'circumstantial',
  PENALTY: 'penalty',
};

function getEntityStageId(entity) {
  if (entity.lbs != null) return getStage(entity.lbs).id;
  return entity.sizeStage ?? 0;
}

/** Size-stage advantage/disadvantage per skill definition. */
export function evaluateSizeRollModifiers(skillId, stageId) {
  const rule = SKILL_SIZE_ROLL[skillId];
  if (!rule) return { advantage: false, disadvantage: false };

  let advantage = false;
  let disadvantage = false;

  if (rule.advantageMin != null && stageId >= rule.advantageMin) advantage = true;
  if (rule.advantageMax != null && stageId <= rule.advantageMax) advantage = true;
  if (rule.disadvantageMin != null && stageId >= rule.disadvantageMin) disadvantage = true;
  if (rule.disadvantageMax != null && stageId <= rule.disadvantageMax) disadvantage = true;

  return { advantage, disadvantage };
}

/** Map crit/fumble results to text engine pool keys. */
export function resolveCheckTextKey({ critical, skillId, stat, critEffects, outcomeKey }) {
  if (critEffects?.textKey) return critEffects.textKey;
  if (critical === 'success') {
    if (skillId) return `check.crit.${skillId}`;
    if (stat) return `check.crit.${stat}`;
    return 'check.crit.default';
  }
  if (critical === 'failure') {
    if (skillId) return `check.fumble.${skillId}`;
    if (stat) return `check.fumble.${stat}`;
    return 'check.fumble.default';
  }
  return `check.${outcomeKey}.${skillId ?? stat ?? 'generic'}`;
}

/**
 * Build modifier breakdown. Same BONUS_TYPE stacks additively unless tagged noStack.
 */
export function calculateModifiers(entity, options = {}) {
  const {
    skillId,
    stat: statOverride,
    proficient: proficientOverride,
    bonuses = [],
    includeSizeSkillBonus = true,
  } = options;

  const skill = skillId ? SKILLS[skillId] : null;
  const stat = statOverride ?? skill?.stat ?? 'cha';
  const breakdown = [];

  const statMod = getEffectiveStatMod(entity, stat);
  breakdown.push({
    type: BONUS_TYPES.STAT,
    label: `${stat.toUpperCase()} modifier`,
    value: statMod,
    source: stat,
  });

  const proficient =
    proficientOverride !== undefined
      ? proficientOverride
      : skillId
        ? isSkillProficient(entity, skillId)
        : false;

  if (proficient) {
    const prof = proficiencyBonus(entity.level ?? 1);
    breakdown.push({
      type: BONUS_TYPES.PROFICIENCY,
      label: 'Proficiency',
      value: prof,
      source: 'proficiency',
    });
  }

  let sizeAdvantage = false;
  let sizeDisadvantage = false;

  if (includeSizeSkillBonus && skillId) {
    const stageId = getEntityStageId(entity);
    const sizeRoll = evaluateSizeRollModifiers(skillId, stageId);
    sizeAdvantage = sizeRoll.advantage;
    sizeDisadvantage = sizeRoll.disadvantage;

    if (sizeAdvantage) {
      breakdown.push({
        type: BONUS_TYPES.SIZE,
        label: 'Size advantage',
        value: 0,
        source: 'size_stage',
        grantsAdvantage: true,
      });
    }
    if (sizeDisadvantage) {
      breakdown.push({
        type: BONUS_TYPES.SIZE,
        label: 'Size disadvantage',
        value: 0,
        source: 'size_stage',
        grantsDisadvantage: true,
      });
    }
  }

  for (const bonus of bonuses) {
    breakdown.push({
      type: bonus.type ?? BONUS_TYPES.CIRCUMSTANTIAL,
      label: bonus.label ?? 'Bonus',
      value: bonus.value ?? 0,
      source: bonus.source ?? 'circumstantial',
      noStack: bonus.noStack ?? false,
      sizeStageMin: bonus.sizeStageMin,
      sizeStageMax: bonus.sizeStageMax,
    });
  }

  const stageId = getEntityStageId(entity);
  const filtered = breakdown.filter((b) => {
    if (b.sizeStageMin != null && stageId < b.sizeStageMin) return false;
    if (b.sizeStageMax != null && stageId > b.sizeStageMax) return false;
    return true;
  });

  const numericTotal = filtered.reduce((sum, b) => sum + (b.value ?? 0), 0);

  return {
    breakdown: filtered,
    numericTotal,
    stat,
    proficient,
    sizeAdvantage,
    sizeDisadvantage,
    stageId,
  };
}

function mergeRollMode(explicit, fromModifiers) {
  const adv = Boolean(explicit.advantage) || fromModifiers.sizeAdvantage;
  const dis = Boolean(explicit.disadvantage) || fromModifiers.sizeDisadvantage;
  return { advantage: adv, disadvantage: dis };
}

// ─── Core resolution ───────────────────────────────────────────────────────────

/**
 * @returns {SkillCheckResult}
 */
export function resolveSkillCheck(entity, options = {}) {
  const {
    skillId,
    dc,
    stat: statOverride,
    proficient: proficientOverride,
    bonuses = [],
    advantage = false,
    disadvantage = false,
    rng = Math.random,
    applyCriticalEffects = false,
    target = null,
    label = null,
  } = options;

  const skill = skillId ? SKILLS[skillId] : null;
  const modifiers = calculateModifiers(entity, {
    skillId,
    stat: statOverride,
    proficient: proficientOverride,
    bonuses,
  });

  const rollMode = mergeRollMode({ advantage, disadvantage }, modifiers);
  const { rolls, chosen: naturalRoll, mode: rollModeLabel } = rollD20WithAdvantage({
    ...rollMode,
    rng,
  });

  const total = naturalRoll + modifiers.numericTotal;
  const critical = detectCritical(naturalRoll);

  let success;
  if (critical === 'success') success = true;
  else if (critical === 'failure') success = false;
  else success = total >= dc;

  let critEffects = null;
  let updatedEntity = entity;
  let updatedTarget = target;

  if (applyCriticalEffects && critical) {
    const table = critical === 'success' ? CRIT_SUCCESS_EFFECTS : CRIT_FAILURE_EFFECTS;
    critEffects = table[skillId] ?? table.default;
    const applied = applyCheckEffects(entity, critEffects, { target });
    updatedEntity = applied.entity;
    updatedTarget = applied.target;
  }

  const outcomeKey =
    critical === 'success'
      ? 'critical_success'
      : critical === 'failure'
        ? 'critical_failure'
        : success
          ? 'success'
          : 'failure';

  return {
    type: 'skill_check',
    skillId,
    skillName: skill?.label ?? label ?? 'Check',
    label: label ?? skill?.label ?? 'Skill Check',
    dc,
    entity: updatedEntity,
    target: updatedTarget,

    rolls,
    naturalRoll,
    rollMode: rollModeLabel,
    modifierTotal: modifiers.numericTotal,
    total,
    breakdown: modifiers.breakdown,
    stat: modifiers.stat,
    proficient: modifiers.proficient,
    stageId: modifiers.stageId,

    success,
    critical,
    outcomeKey,
    margin: total - dc,

    critEffects,
    textKey: resolveCheckTextKey({
      critical,
      skillId,
      stat: modifiers.stat,
      critEffects,
      outcomeKey,
    }),
    description: skill?.desc ?? null,
  };
}

/**
 * Contested check — higher total wins; ties go to defender by default.
 */
export function resolveContestedCheck(attacker, defender, options = {}) {
  const {
    attackerSkillId,
    defenderSkillId,
    attackerBonuses = [],
    defenderBonuses = [],
    attackerAdvantage = false,
    attackerDisadvantage = false,
    defenderAdvantage = false,
    defenderDisadvantage = false,
    defenderWinsTies = true,
    rng = Math.random,
    applyCriticalEffects = false,
    label = null,
  } = options;

  const attackerResult = resolveSkillCheck(attacker, {
    skillId: attackerSkillId,
    dc: 0,
    bonuses: attackerBonuses,
    advantage: attackerAdvantage,
    disadvantage: attackerDisadvantage,
    rng,
    applyCriticalEffects: false,
    label,
  });

  const defenderResult = resolveSkillCheck(defender, {
    skillId: defenderSkillId,
    dc: 0,
    bonuses: defenderBonuses,
    advantage: defenderAdvantage,
    disadvantage: defenderDisadvantage,
    rng,
    applyCriticalEffects: false,
  });

  let attackerWins;
  if (attackerResult.critical === 'success') attackerWins = true;
  else if (attackerResult.critical === 'failure') attackerWins = false;
  else if (defenderResult.critical === 'success') attackerWins = false;
  else if (defenderResult.critical === 'failure') attackerWins = true;
  else if (attackerResult.total === defenderResult.total) {
    attackerWins = !defenderWinsTies;
  } else {
    attackerWins = attackerResult.total > defenderResult.total;
  }

  let critEffects = null;
  let updatedAttacker = attacker;
  let updatedDefender = defender;

  if (applyCriticalEffects) {
    const winnerCrit = attackerWins ? attackerResult.critical : defenderResult.critical;
    if (winnerCrit) {
      const table = winnerCrit === 'success' ? CRIT_SUCCESS_EFFECTS : CRIT_FAILURE_EFFECTS;
      const skillKey = attackerWins ? attackerSkillId : defenderSkillId;
      critEffects = table[skillKey] ?? table.default;
      const winner = attackerWins ? attacker : defender;
      const loser = attackerWins ? defender : attacker;
      const applied = applyCheckEffects(winner, critEffects, { target: loser });
      if (attackerWins) {
        updatedAttacker = applied.entity;
        updatedDefender = applied.target ?? defender;
      } else {
        updatedDefender = applied.entity;
        updatedAttacker = applied.target ?? attacker;
      }
    }
  }

  return {
    type: 'contested_check',
    label: label ?? 'Contested Check',
    attacker: updatedAttacker,
    defender: updatedDefender,
    attackerResult,
    defenderResult,
    success: attackerWins,
    attackerWins,
    margin: attackerResult.total - defenderResult.total,
    critEffects,
    outcomeKey: attackerWins ? 'success' : 'failure',
    textKey: `check.contested.${attackerWins ? 'win' : 'lose'}.${attackerSkillId ?? 'generic'}`,
  };
}

/** Saving throw — uses same pipeline; proficiency from proficientSaves. */
export function resolveSavingThrow(entity, stat, dc, options = {}) {
  return resolveSkillCheck(entity, {
    ...options,
    stat,
    skillId: null,
    dc,
    proficient: options.proficient ?? entity.proficientSaves?.includes?.(stat),
    label: options.label ?? `${stat.toUpperCase()} Save`,
  });
}

/** Raw ability check without a named skill. */
export function resolveAbilityCheck(entity, stat, dc, options = {}) {
  return resolveSkillCheck(entity, {
    ...options,
    stat,
    skillId: null,
    dc,
    proficient: options.proficient ?? false,
    label: options.label ?? `${stat.toUpperCase()} Check`,
  });
}

// ─── Text engine bridge ────────────────────────────────────────────────────────

export function toTextContext(checkResult) {
  return {
    checkResult: checkResult.outcomeKey,
    checkSuccess: checkResult.success,
    checkCritical: checkResult.critical,
    checkSkill: checkResult.skillId,
    checkSkillName: checkResult.skillName,
    checkNaturalRoll: checkResult.naturalRoll,
    checkTotal: checkResult.total,
    checkDC: checkResult.dc,
    checkMargin: checkResult.margin,
    checkRollMode: checkResult.rollMode,
    checkTextKey: checkResult.textKey,
    checkDescription: checkResult.description,
  };
}

export function formatCheckSummary(result) {
  const crit =
    result.critical === 'success'
      ? ' ★ CRITICAL SUCCESS'
      : result.critical === 'failure'
        ? ' ✦ charming fumble'
        : '';
  const mode =
    result.rollMode === 'advantage'
      ? ' (advantage)'
      : result.rollMode === 'disadvantage'
        ? ' (disadvantage)'
        : '';
  const rollDetail =
    result.rolls.length > 1 ? `[${result.rolls.join(', ')} → ${result.naturalRoll}]` : `${result.naturalRoll}`;
  return `${result.label}: ${rollDetail}${mode} + ${result.modifierTotal} = ${result.total} vs DC ${result.dc} — ${
    result.success ? 'SUCCESS' : 'FAIL'
  }${crit}`;
}

// ─── Convenience wrappers ──────────────────────────────────────────────────────

export function checkOverwhelm(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'overwhelm', dc, ...options });
}

export function checkSeduce(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'seduce', dc, ...options });
}

export function checkEndureGrowth(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'endure_growth', dc, ...options });
}

export function checkIndulge(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'indulge', dc, ...options });
}

export function checkPersuade(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'persuade', dc, ...options });
}

export function checkPerform(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'perform', dc, ...options });
}

export function checkSneak(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'sneak', dc, ...options });
}

export function checkGrace(entity, dc, options = {}) {
  return resolveSkillCheck(entity, { skillId: 'grace', dc, ...options });
}

export function checkWithAP(entity, skillId, dc, apSpent, options = {}) {
  const bonusPerAP = options.bonusPerAP ?? 1;
  return resolveSkillCheck(entity, {
    skillId,
    dc,
    bonuses: [
      {
        type: BONUS_TYPES.ABUNDANCE,
        label: `AP expenditure (${apSpent})`,
        value: apSpent * bonusPerAP,
        source: 'abundance_points',
      },
      ...(options.bonuses ?? []),
    ],
    ...options,
  });
}

export { DC, SKILLS };
