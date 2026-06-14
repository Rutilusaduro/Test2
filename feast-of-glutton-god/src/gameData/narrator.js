import { getRegion } from './regions.js';
import { getRegionTransformation } from './worldTransformation.js';
import { getTravelOptions } from './regionObstacles.js';
import { getNpcsInRegion } from './npcs.js';
import { getNpcState, ensureDmState } from './player.js';
import { getQuestOffersForNpc } from './questOffers.js';
import { renderDmLine } from '../textEngine/scenes/dm/index.js';
import { renderGenreBeat } from '../textEngine/scenes/dm/genre.js';
import { syncEscalationTier } from '../gameData/divineAttention.js';

const IDLE_ACTION_THRESHOLD = 5;

export { ensureDmState };

/** Clear stale UI text on navigation or modal close. */
export function clearTransient(game) {
  game.lastQuestMessage = null;
  game.lastLevelUpMessage = null;
  if (game.dm) {
    game.dm.eventLine = null;
  }
}

/** Scripted DM narration — single choke point for scene/event/idle/hint lines. */
export function narrate(game, kind, params = {}) {
  const dm = ensureDmState(game);
  const regionId = params.regionId ?? game.region;
  const region = getRegion(regionId);
  const transform = getRegionTransformation(game, regionId);
  syncEscalationTier(game);

  if (kind === 'arrival') {
    const visited = dm.visitedRegions || {};
    const firstVisit = !visited[regionId];
    if (firstVisit) {
      dm.visitedRegions = { ...visited, [regionId]: true };
    }
    const arrivalLine = renderDmLine('arrival', game, {
      regionId,
      regionName: region?.name ?? regionId,
      firstVisit,
      regionTransformLevel: transform.level.id,
    });
    const genreLine = renderGenreBeat(game, 'frame', {
      regionId,
      escalationTier: game.worldFlags?.escalationTier ?? 0,
    });
    const line = genreLine ? `${arrivalLine} ${genreLine}` : arrivalLine;
    dm.sceneLine = line;
    dm.eventLine = null;
    dm.lastKind = 'arrival';
    dm.actionCount = 0;
    dm.idleSince = game.day ?? 1;
    return line;
  }

  if (kind === 'event') {
    const line = params.text || renderDmLine('event', game, {
      regionId,
      dmKind: params.dmKind ?? 'generic',
      text: params.text,
    });
    dm.eventLine = line;
    dm.lastKind = 'event';
    dm.actionCount = 0;
    if (params.text) {
      game.lastQuestMessage = params.text;
    }
    return line;
  }

  if (kind === 'idle') {
    const line = renderDmLine('idle', game, {
      regionId,
      regionName: region?.name ?? regionId,
    });
    dm.sceneLine = line;
    dm.lastKind = 'idle';
    dm.actionCount = 0;
    return line;
  }

  if (kind === 'hint') {
    const line = renderDmLine('hint', game, {
      regionId,
      hintKind: params.hintKind,
      exitName: params.exitName,
    });
    dm.eventLine = line;
    dm.lastKind = 'hint';
    return line;
  }

  return '';
}

/** Route quest/level/growth notifications through the DM banner. */
export function narrateEvent(game, text, dmKind = 'quest') {
  if (!text) return '';
  return narrate(game, 'event', { text, dmKind });
}

/** Bump idle counter; maybe emit ambient or hint lines. */
export function tickDmAction(game, reason = 'action') {
  const dm = ensureDmState(game);
  dm.actionCount = (dm.actionCount || 0) + 1;

  if (dm.actionCount >= IDLE_ACTION_THRESHOLD && dm.lastKind !== 'idle') {
    narrate(game, 'idle');
    return;
  }

  if (dm.actionCount >= IDLE_ACTION_THRESHOLD * 2) {
    maybeEmitHint(game);
    dm.actionCount = 0;
  }
}

function maybeEmitHint(game) {
  const dm = ensureDmState(game);
  const day = game.day ?? 1;
  if (dm.lastHintDay === day) return;

  const travel = getTravelOptions(game, game.region);
  const untried = travel.find((opt) => !opt.blocked);
  if (untried && Math.random() < 0.4) {
    dm.lastHintDay = day;
    narrate(game, 'hint', { hintKind: 'travel', exitName: untried.name });
    return;
  }

  const npcs = getNpcsInRegion(game.region, game);
  const hasQuestOffer = npcs.some((n) => {
    const state = getNpcState(game, n);
    if (!state.met) return false;
    return getQuestOffersForNpc(game, state).length > 0;
  });
  if (hasQuestOffer && Math.random() < 0.35) {
    dm.lastHintDay = day;
    narrate(game, 'hint', { hintKind: 'quest' });
  }
}
