import './pools.js';
import { createContext, render } from '../../engine.js';
import { ACHIEVEMENTS } from '../../../gameData/achievements.js';

export function renderAchievementUnlock(game, achievementId, opts = {}) {
  const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
  const ctx = createContext({
    subject: game?.player,
    globals: {
      achievementId,
      achievementTitle: def?.title ?? achievementId,
      region: game?.region,
    },
    seed: opts.seed,
  });
  return render('{achievement.unlock}', ctx, { trace: opts.trace });
}
