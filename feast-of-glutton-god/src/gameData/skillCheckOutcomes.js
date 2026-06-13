/**
 * Mechanical outcomes for critical skill check results.
 * Narrative prose is resolved separately via textKey + toTextContext().
 */

import { advanceStage } from './stages.js';
import { addAbundancePoints } from './player.js';

export const CRIT_SUCCESS_EFFECTS = {
  seduce: {
    textKey: 'check.crit.seduce',
    apGain: 2,
    growthOnTarget: 1,
    relationshipBoost: 2,
    description: 'Irresistible charm — pleasure and growth bloom in the wake of your success.',
  },
  overwhelm: {
    textKey: 'check.crit.overwhelm',
    apGain: 1,
    growthOnTarget: 1,
    description: 'Your abundant mass rolls over resistance like a tide of velvet power.',
  },
  endure_growth: {
    textKey: 'check.crit.endure_growth',
    apGain: 2,
    description: 'You ride the swell of transformation with ecstatic grace.',
  },
  indulge: {
    textKey: 'check.crit.indulge',
    apGain: 3,
    selfGrowth: 1,
    description: 'Every bite becomes a celebration — abundance answers your hunger.',
  },
  persuade: {
    textKey: 'check.crit.persuade',
    apGain: 1,
    relationshipBoost: 2,
    description: 'Your words land like honeyed thunder — hearts and appetites open wide.',
  },
  default: {
    textKey: 'check.crit.default',
    apGain: 1,
    description: 'Fortune favors the gloriously abundant.',
  },
};

export const CRIT_FAILURE_EFFECTS = {
  seduce: {
    textKey: 'check.fumble.seduce',
    selfGrowth: 1,
    description: 'You blush adorably — a little extra softness only makes you more enchanting.',
  },
  overwhelm: {
    textKey: 'check.fumble.overwhelm',
    selfGrowth: 1,
    apCost: 1,
    description: 'Your glorious bulk shifts awkwardly — you wobble, but you are still magnificent.',
  },
  endure_growth: {
    textKey: 'check.fumble.endure_growth',
    selfGrowth: 1,
    apGain: 1,
    description: 'The swell comes too fast — you gasp, swell, and laugh through the pleasure.',
  },
  indulge: {
    textKey: 'check.fumble.indulge',
    selfGrowth: 1,
    apGain: 1,
    description: 'You overindulged too quickly — a happy, stuffed sigh escapes you.',
  },
  persuade: {
    textKey: 'check.fumble.persuade',
    description: 'You stumble over your words, flustered and endearing.',
  },
  default: {
    textKey: 'check.fumble.default',
    description: 'A charming misstep on the road to greater abundance.',
  },
};

function applyGrowth(entity, stages) {
  if (!entity || stages <= 0) return entity;
  const copy = { ...entity };
  advanceStage(copy, stages);
  return copy;
}

/**
 * Apply mechanical effects from a critical result. Does not render text.
 * @param {object} entity - Acting creature (mutated copy returned)
 * @param {object} effects - From CRIT_*_EFFECTS tables
 * @param {{ target?: object, game?: object }} ctx
 */
export function applyCheckEffects(entity, effects, { target, game } = {}) {
  if (!effects) return { entity, target, game };

  let next = { ...entity };
  let nextTarget = target ? { ...target } : null;

  if (effects.apGain) {
    next.ap = (next.ap ?? 0) + effects.apGain;
    if (game?.player && next.id === 'player') {
      game.player.ap = next.ap;
    }
  }
  if (effects.apCost) {
    next.ap = Math.max(0, (next.ap ?? 0) - effects.apCost);
    if (game?.player && next.id === 'player') {
      game.player.ap = next.ap;
    }
  }
  if (effects.selfGrowth) {
    next = applyGrowth(next, effects.selfGrowth);
  }
  if (effects.growthOnTarget && nextTarget) {
    nextTarget = applyGrowth(nextTarget, effects.growthOnTarget);
  }
  if (effects.relationshipBoost != null && nextTarget) {
    nextTarget.relationship = Math.min(100, (nextTarget.relationship ?? 0) + effects.relationshipBoost);
  }

  return { entity: next, target: nextTarget, game };
}
