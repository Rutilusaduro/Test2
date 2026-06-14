/**
 * Command-mode play — immobile high-tier characters act through delegation & ritual.
 * Enthroned epilogue after Act III apotheosis (Prompt 3).
 */
import { getStageMechanics, isImmobile, requiresMagicalMobility } from './stageMechanics.js';
import { getStage } from './stages.js';

export const COMMAND_ACTIONS = {
  DELEGATE_TRAVEL: 'delegate_travel',
  RITUAL_PROJECTION: 'ritual_projection',
  FEAST_DECREE: 'feast_decree',
  INSTITUTION_DIRECT: 'institution_direct',
};

export function isEnthronedEpilogue(game) {
  if (!game) return false;
  const wf = game.worldFlags ?? {};
  const pf = game.player?.storyFlags ?? {};
  return Boolean(
    wf.main_act3_complete
    || wf.gorgara_avatar
    || wf.apotheosis_right_hand
    || wf.apotheosis_co_ascendant
    || wf.apotheosis_devouring
    || pf.enthroned_epilogue
  );
}

export function getCommandMode(game) {
  const player = game.player;
  const mech = getStageMechanics(player);
  const enthroned = isEnthronedEpilogue(game);
  const hasCompanion = (game.party ?? []).length > 0;
  const hasRitualSupport = Boolean(
    game.player.storyFlags?.ritual_projection_unlocked
    || game.influence?.institutions?.some((i) => i.type === 'temple' && i.level >= 2)
    || player.spellsKnown?.includes('mass_indulgence')
    || player.spellsKnown?.includes('gorgaras_awakening'),
  );

  if (!mech.immobile && !enthroned) {
    return {
      active: false,
      enthroned: false,
      canTravelPersonally: true,
      mechanics: mech,
    };
  }

  const enthronedMessage = enthroned
    ? 'You reign enthroned — the Reach is hers, and yours by right of feeding. The Measured Wheel lies broken; your decrees are gospel.'
    : null;

  return {
    active: true,
    enthroned,
    canTravelPersonally: false,
    canDelegate: hasCompanion,
    canRitualProject: hasRitualSupport || enthroned,
    canFeastDecree: enthroned || mech.immobile,
    delegateApCost: enthroned ? 3 : 5,
    ritualApCost: enthroned ? 10 : 15,
    mechanics: mech,
    message: enthronedMessage
      || (hasCompanion
        ? 'Your body is a sacred landmark now — companions carry your will across the continent.'
        : 'You are immobile as a mountain of flesh. Unlock ritual projection or recruit companions to reach distant lands.'),
  };
}

export function canPersonalTravel(game) {
  if (isEnthronedEpilogue(game)) return false;
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
      flavor: mode.enthroned
        ? `Your herald-companions ride to ${targetRegionId.replace(/_/g, ' ')} bearing the Fat Goddess's decree of endless feast.`
        : `Your companions journey to ${targetRegionId.replace(/_/g, ' ')} bearing your decree of abundance.`,
    };
  }
  if (mode.canRitualProject) {
    return {
      ok: true,
      method: COMMAND_ACTIONS.RITUAL_PROJECTION,
      apCost: mode.ritualApCost,
      flavor: mode.enthroned
        ? 'Your consciousness spans the enthroned Reach — distant lands kneel under caloric projection.'
        : 'Your consciousness rides a tide of caloric magic — distant lands feel close and hungry.',
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
