import './pools.js';
import { createContext, render } from '../../engine.js';

export function renderPrestigeRankUp(game, newRank, oldRank, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    globals: {
      prestigeRank: newRank,
      oldPrestigeRank: oldRank,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{prestige.rank_up}', ctx, { trace: opts.trace });
}

export function renderPrestigeTalentPick(game, talentId, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    globals: {
      prestigeTalent: talentId,
      prestigeGate: opts.gateId ?? null,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{prestige.talent_pick}', ctx, { trace: opts.trace });
}
