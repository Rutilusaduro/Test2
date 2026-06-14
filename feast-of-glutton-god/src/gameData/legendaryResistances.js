/**
 * Legendary resistances — Tier 4+ bosses auto-succeed failed saves by spending one.
 */

export function getLegendaryResistancesLeft(defender) {
  if (defender?.legendaryResistancesLeft != null) {
    return defender.legendaryResistancesLeft;
  }
  if (defender?.legendaryResistances != null) {
    return defender.legendaryResistances;
  }
  return 0;
}

export function spendLegendaryResistance(defender) {
  const left = getLegendaryResistancesLeft(defender);
  if (left <= 0) return false;
  defender.legendaryResistancesLeft = left - 1;
  defender.legendaryResistances = left - 1;
  return true;
}

/**
 * If a save failed, boss may spend legendary resistance to succeed instead.
 * @returns {object} save result (possibly upgraded to success)
 */
export function applyLegendarySaveResistance(defender, saveResult) {
  if (!defender || !saveResult) return saveResult;
  if (saveResult.success || saveResult.critical === 'success') return saveResult;
  if (saveResult.critical === 'failure') return saveResult;

  if (!spendLegendaryResistance(defender)) return saveResult;

  return {
    ...saveResult,
    success: true,
    outcomeKey: 'success',
    legendaryResistanceUsed: true,
    margin: Math.max(0, saveResult.dc - saveResult.total),
    textKey: `${saveResult.textKey}.legendary_resist`,
  };
}
