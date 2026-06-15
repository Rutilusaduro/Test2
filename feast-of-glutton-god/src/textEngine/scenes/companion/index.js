import { createContext, render } from '../../engine.js';
import './milestones.js';

export function renderCompanionMilestone(game, companionId, tier, companion, opts = {}) {
  const poolKey = `companion.${companionId}.t${tier}`;
  const ctx = createContext({
    subject: companion ?? game?.player,
    ref: game?.player,
    globals: {
      companionId,
      companionTier: tier,
      milestoneId: opts.milestoneId,
      milestoneTitle: opts.title,
      region: game?.region,
      level: game?.player?.level,
      devotion: companion?.devotion ?? 0,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render(`{${poolKey}}`, ctx, { trace: opts.trace });
}
