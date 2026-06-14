/**
 * Track multiple large characters in one location for crowd growth reactions.
 */
import { getStage } from './stages.js';
import { getNpcsInRegion } from './npcs.js';
import { getNpcState } from './player.js';

const LARGE_THRESHOLD = 6;

export function countLargePresencesInRegion(game, regionId, excludeId = null) {
  const stages = [];
  const player = game.player;
  if (player?.id !== excludeId && game.region === regionId) {
    const ps = getStage(player.lbs).id;
    if (ps >= LARGE_THRESHOLD) stages.push(ps);
  }
  for (const companion of game.party ?? []) {
    if (companion.id === excludeId) continue;
    if (game.region === regionId) {
      const s = getStage(companion.lbs).id;
      if (s >= LARGE_THRESHOLD) stages.push(s);
    }
  }
  for (const template of getNpcsInRegion(regionId, game)) {
    if (template.id === excludeId) continue;
    const npc = getNpcState(game, template);
    const s = getStage(npc.lbs).id;
    if (s >= LARGE_THRESHOLD) stages.push(s);
  }
  return { count: stages.length, stages, threshold: LARGE_THRESHOLD };
}
