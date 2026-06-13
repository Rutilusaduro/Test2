/**
 * Example skill check usage — reference for designers and programmers.
 * Not imported by runtime game code.
 */
import { DC } from './skills.js';
import {
  checkSeduce,
  checkOverwhelm,
  checkEndureGrowth,
  checkIndulge,
  checkPersuade,
  checkWithAP,
  resolveContestedCheck,
  resolveSavingThrow,
  formatCheckSummary,
  toTextContext,
  BONUS_TYPES,
} from './skillChecks.js';

/** Charisma (Seduce) vs DC 12 — flirt, tempt, command attention */
export function exampleSeduce(player, npc) {
  return checkSeduce(player, DC.medium, {
    target: npc,
    bonuses: [
      {
        type: BONUS_TYPES.CIRCUMSTANTIAL,
        label: 'Feast atmosphere',
        value: 1,
        source: 'environment',
      },
    ],
    applyCriticalEffects: true,
  });
}

/** Strength (Overwhelm) — force-feed / grapple in combat */
export function exampleOverwhelm(attacker, target) {
  return checkOverwhelm(attacker, DC.hard, {
    advantage: attacker.sizeBuffed,
    applyCriticalEffects: true,
    target,
  });
}

/** Constitution (Endure Growth) — withstand intense swelling */
export function exampleEndureGrowth(character) {
  return checkEndureGrowth(character, DC.formidable, {
    applyCriticalEffects: true,
  });
}

/** Spend AP for a bonus on Indulge checks */
export function exampleIndulgeWithAP(player, apSpent = 3) {
  return checkWithAP(player, 'indulge', DC.medium, apSpent, {
    bonusPerAP: 1,
    applyCriticalEffects: true,
  });
}

/** Contested Overwhelm vs Athletics — force-feed resolution */
export function exampleForceFeed(attacker, defender) {
  return resolveContestedCheck(attacker, defender, {
    attackerSkillId: 'overwhelm',
    defenderSkillId: 'athletics',
    applyCriticalEffects: true,
    label: 'Force Feed',
  });
}

/** Wisdom save vs spell DC */
export function exampleGrowthSave(target, spellDc) {
  return resolveSavingThrow(target, 'wis', spellDc, {
    label: 'Resist Overflow',
  });
}

/** Hook check result into modular text engine */
export function exampleTextHook(checkResult, renderFn, subject, ref) {
  const globals = toTextContext(checkResult);
  const prose = renderFn(checkResult.textKey, {
    subject,
    ref,
    globals,
    checkResult: checkResult.outcomeKey,
    checkCritical: checkResult.critical,
  });
  return { summary: formatCheckSummary(checkResult), prose };
}
