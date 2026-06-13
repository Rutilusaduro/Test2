import './pools.js';

import { createContext, render } from '../../engine.js';
import { getQuestDefinition } from '../../../gameData/quests/registry.js';
import '../../modules.js';

/**
 * Render quest prose from a pool key.
 * @param {string} poolKey
 * @param {object} game
 * @param {object} [opts]
 */
export function renderQuestText(poolKey, game, opts = {}) {
  const def = opts.questId ? getQuestDefinition(opts.questId) : null;
  const ctx = createContext({
    subject: game.player,
    week: game.day,
    globals: {
      questId: opts.questId ?? null,
      questType: opts.questType ?? def?.type ?? null,
      questTitle: def?.title ?? null,
      endingId: opts.endingId ?? null,
      stageId: opts.stageId ?? null,
      region: game.region,
      ...(opts.globals ?? {}),
    },
  });

  const key = poolKey.startsWith('quest.') ? poolKey : `quest.${poolKey}`;
  if (!key.includes('.')) return render(`{${key}}`, ctx);
  return render(`{${key}}`, ctx, { trace: opts.trace });
}

/** Resolve description for quest log — uses text key or falls back to title. */
export function getQuestDescription(def, game) {
  if (!def?.descriptionKey) return def?.title ?? '';
  return renderQuestText(def.descriptionKey, game, {
    questId: def.id,
    questType: def.type,
  });
}

export function getQuestStageDescription(def, stage, game) {
  if (!stage?.descriptionKey) return stage?.title ?? '';
  return renderQuestText(stage.descriptionKey, game, {
    questId: def.id,
    questType: def.type,
    stageId: stage.id,
  });
}
