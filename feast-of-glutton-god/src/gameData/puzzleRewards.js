/**
 * Puzzle reward application — mirrors quest reward bundles.
 */
import { addAbundancePoints } from './player.js';
import { addExperience, XP_SOURCES } from './leveling.js';
import { awardAbundanceSpreadWithEvents } from './worldEvents.js';

export function applyPuzzleRewards(game, bundle = {}) {
  const messages = [];
  if (bundle.ap) {
    addAbundancePoints(game, bundle.ap);
    messages.push(`+${bundle.ap} AP`);
  }
  if (bundle.xp) {
    const source = bundle.xpSource && XP_SOURCES[bundle.xpSource] ? bundle.xpSource : 'general';
    const amount = bundle.xpSource && XP_SOURCES[bundle.xpSource]
      ? XP_SOURCES[bundle.xpSource]
      : bundle.xp;
    const { levelUps } = addExperience(game.player, amount, source);
    messages.push(`+${amount} XP`);
    if (levelUps.length) {
      game.lastLevelUpMessage = levelUps.map((lu) => lu.narrative || `Level ${lu.level}! ${lu.flavor}`).join('\n\n---\n\n');
      game.lastLevelUpResult = levelUps[levelUps.length - 1];
    }
  }
  for (const flag of Object.keys(bundle.flags ?? {})) {
    game.worldFlags[flag] = bundle.flags[flag];
  }
  for (const flag of Object.keys(bundle.worldFlags ?? {})) {
    game.worldFlags[flag] = bundle.worldFlags[flag];
  }
  for (const flag of Object.keys(bundle.playerFlags ?? {})) {
    game.player.storyFlags[flag] = bundle.playerFlags[flag];
  }
  for (const regionId of bundle.unlockRegions ?? []) {
    if (!game.worldFlags.regions_unlocked.includes(regionId)) {
      game.worldFlags.regions_unlocked.push(regionId);
      messages.push(`Region unlocked: ${regionId.replace(/_/g, ' ')}`);
    }
  }
  if (bundle.abundanceSpread) {
    const spread = awardAbundanceSpreadWithEvents(game, bundle.abundanceSpread);
    if (spread.gained) messages.push(`+${spread.gained} abundance influence`);
  }
  return messages;
}
