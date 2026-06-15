import './pools.js';
import { createContext, render } from '../../engine.js';

export function renderSeasonalBeat(game, eventId, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    week: game?.day ?? 1,
    globals: {
      seasonalEvent: eventId,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{seasonal.event}', ctx, { trace: opts.trace });
}
