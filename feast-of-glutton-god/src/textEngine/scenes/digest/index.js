import './pools.js';
import { createContext, render } from '../../engine.js';

export function renderDigestHeader(game, weekNum, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    week: game?.day ?? 1,
    globals: {
      digestWeek: weekNum,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{world.digest.header}', ctx, { trace: opts.trace });
}

export function renderDigestBullet(game, digestTopic, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    week: game?.day ?? 1,
    globals: {
      digestTopic,
      region: game?.region,
      prestigeRank: game?.worldFlags?.prestige_rank ?? 0,
      legacyAbundance: game?.pilgrimageMeta?.legacyAbundance ?? game?.worldFlags?.legacy_abundance ?? 0,
    },
    seed: opts.seed,
  });
  return render('{world.digest}', ctx, { trace: opts.trace });
}
