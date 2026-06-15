import './echo.js';
import { createContext, render } from '../../engine.js';

export function renderEndingEchoStamp(game, archetype, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    globals: {
      endingArchetype: archetype,
      endingId: archetype,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{ending.echo.stamp}', ctx, { trace: opts.trace });
}

export function renderEndingEchoArrival(game, regionId, opts = {}) {
  const archetype = game?.worldFlags?.ending_archetype;
  if (!archetype) return '';
  const ctx = createContext({
    subject: game?.player,
    globals: {
      endingArchetype: archetype,
      endingId: archetype,
      region: regionId ?? game?.region,
    },
    seed: opts.seed,
  });
  return render('{ending.echo.arrival}', ctx, { trace: opts.trace });
}
