/**
 * Graduated consent for NPC/companion growth.
 * Budget = min(gainDesire, relationship) — the lower axis dominates willingness.
 */
import { getGainDesire, addGainDesire } from './gainDesire.js';
import { reduceRelationship } from './relationships.js';
import { recordForcedGrowth } from './forcedGrowth.js';

/** 0–100 comfort budget; both desire for growth AND bond with you must be high. */
export function getConsentBudget(npc) {
  const desire = getGainDesire(npc);
  const rel = npc.relationship ?? 0;
  return Math.min(desire, rel);
}

/** How many stages she comfortably accepts at this budget. */
function comfortableStageLimit(budget) {
  if (budget >= 80) return 4;
  if (budget >= 60) return 3;
  if (budget >= 40) return 2;
  if (budget >= 15) return 1;
  return 0;
}

/**
 * @returns {{ willing: boolean, overreach: number, severity: 0|1|2|3, consentState: 'willing'|'forced', appliedStages: number }}
 */
export function evaluateGrowthConsent(npc, stages) {
  const budget = getConsentBudget(npc);
  const comfortLimit = comfortableStageLimit(budget);
  const requested = Math.max(0, stages);

  if (requested <= comfortLimit) {
    return {
      willing: true,
      overreach: 0,
      severity: 0,
      consentState: 'willing',
      appliedStages: requested,
    };
  }

  const overreach = requested - comfortLimit;
  const severity = overreach >= 3 ? 3 : overreach >= 2 ? 2 : 1;
  return {
    willing: false,
    overreach,
    severity,
    consentState: 'forced',
    appliedStages: comfortLimit,
  };
}

/** Apply relationship + desire penalties and log forced growth for region hostility (Part 2). */
export function applyForcedGrowthPenalties(game, npc, consent, regionId) {
  if (!consent?.overreach) return null;
  const amount = 3 * consent.severity + consent.overreach;
  const relLoss = reduceRelationship(npc, amount);
  const desireLoss = addGainDesire(npc, -amount);
  recordForcedGrowth(game, regionId ?? game?.region, consent.severity);
  return { relLoss, desireLoss, amount };
}
