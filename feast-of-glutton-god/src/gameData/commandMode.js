/**
 * Command-mode play — immobile high-tier characters act through delegation & ritual.
 */
import { getStageMechanics, isImmobile, requiresMagicalMobility } from './stageMechanics.js';
import { getStage } from './stages.js';

export const COMMAND_ACTIONS = {
  DELEGATE_TRAVEL: 'delegate_travel',
  RITUAL_PROJECTION: 'ritual_projection',
  FEAST_DECREE: 'feast_decree',
  INSTITUTION_DIRECT: 'institution_direct',
};

export function getCommandMode(game) {
  const player = game.player;
  const mech = getStageMechanics(player);
  const hasCompanion = (game.party ?? []).length > 0;
  const hasRitualSupport = Boolean(
    game.player.storyFlags?.ritual_projection_unlocked
    || game.influence?.institutions?.some((i) => i.type === 'temple' && i.level >= 2)
    || player.spellsKnown?.includes('mass_indulgence')
    || player.spellsKnown?.includes('gorgaras_awakening'),
  );

  if (!mech.immobile) {
    return {
      active: false,
      canTravelPersonally: true,
      mechanics: mech,
    };
  }

  return {
    active: true,
    canTravelPersonally: false,
    canDelegate: hasCompanion,
    canRitualProject: hasRitualSupport,
    delegateApCost: 5,
    ritualApCost: 15,
    mechanics: mech,
    message: hasCompanion
      ? 'Your body is a sacred landmark now — companions carry your will across the continent.'
      : 'You are immobile as a mountain of flesh. Unlock ritual projection or recruit companions to reach distant lands.',
  };
}

export function canPersonalTravel(game) {
  return !isImmobile(getStage(game.player.lbs).id);
}

export function resolveTravelMethod(game, targetRegionId) {
  const mode = getCommandMode(game);
  if (!mode.active) return { ok: true, method: 'personal', apCost: 0 };

  if (mode.canDelegate && (game.party ?? []).length > 0) {
    return {
      ok: true,
      method: COMMAND_ACTIONS.DELEGATE_TRAVEL,
      apCost: mode.delegateApCost,
      flavor: `Your companions journey to ${targetRegionId.replace(/_/g, ' ')} bearing your decree of abundance.`,
    };
  }
  if (mode.canRitualProject) {
    return {
      ok: true,
      method: COMMAND_ACTIONS.RITUAL_PROJECTION,
      apCost: mode.ritualApCost,
      flavor: 'Your consciousness rides a tide of caloric magic — distant lands feel close and hungry.',
    };
  }

  return {
    ok: false,
    method: null,
    message: mode.message,
  };
}

export function needsMagicalInfrastructure(character) {
  return requiresMagicalMobility(getStage(character.lbs).id);
}
