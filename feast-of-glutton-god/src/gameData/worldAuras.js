/**
 * World auras — bonuses from abundance milestones and quest rewards.
 */
import { getAbundanceProgress } from './abundanceSpread.js';

export function getWorldAura(game, regionId) {
  return game.worldFlags?.worldAuras?.[regionId] ?? null;
}

export function hasWorldAura(game, regionId) {
  return Boolean(getWorldAura(game, regionId));
}

/** Skill check DC reduction and spell potency from regional abundance aura. */
export function getAuraPuzzleBonuses(game, regionId) {
  const aura = getWorldAura(game, regionId);
  if (!aura) return { dcReduction: 0, spellBonus: 0, label: null };

  return {
    dcReduction: aura.dcReduction ?? 2,
    spellBonus: aura.spellBonus ?? 1,
    label: aura.name ?? 'Aura of Plenty',
  };
}

/** Abundance spread tier can soften puzzle requirements narratively. */
export function getAbundancePuzzleBonus(game) {
  const progress = getAbundanceProgress(game);
  const tier = progress.current?.id ?? 0;
  return {
    dcReduction: Math.floor(tier / 2),
    apDiscount: tier >= 2 ? 2 : 0,
    label: progress.current?.label ?? null,
  };
}

export function getCombinedPuzzleBonuses(game, regionId) {
  const aura = getAuraPuzzleBonuses(game, regionId);
  const abundance = getAbundancePuzzleBonus(game);
  return {
    dcReduction: aura.dcReduction + abundance.dcReduction,
    spellBonus: aura.spellBonus,
    apDiscount: abundance.apDiscount,
    auraLabel: aura.label,
    abundanceLabel: abundance.label,
  };
}
