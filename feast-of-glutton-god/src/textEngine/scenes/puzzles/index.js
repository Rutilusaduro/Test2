import './pools.js';

import { createContext, render } from '../../engine.js';
import '../../modules.js';

/**
 * Render puzzle prose from a pool key.
 */
export function renderPuzzleText(poolKey, game, opts = {}) {
  const ctx = createContext({
    subject: game.player,
    week: game.day,
    globals: {
      region: game.region,
      ...(opts.globals ?? {}),
    },
  });

  const key = poolKey.startsWith('puzzle.') ? poolKey : `puzzle.${poolKey}`;
  return render(`{${key}}`, ctx, { trace: opts.trace });
}
