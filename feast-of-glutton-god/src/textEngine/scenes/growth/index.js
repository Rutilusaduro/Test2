/**
 * Growth prose pools — lightweight snippets for any growth trigger.
 * Complements full multi-beat scenes in growthEvent/ (ge.*).
 *
 * Usage:
 *   renderGrowthProse('growth.combat', grower, observer, { startStage, endStage })
 *   renderGrowthProse('growth.self.surge', grower, null, { startStage: 2 })
 */
import './helpers.js';
import './corePools.js';
import './contextPools.js';
import './speciesCombatGrowth.js';

import { createContext, render } from '../../engine.js';
import { getStage } from '../../../gameData/stages.js';
import '../../modules.js';
import '../../lexicon.js';

/**
 * Build globals for growth pool selectors.
 * @param {object} params
 * @param {number} [params.startStage]
 * @param {number} [params.endStage]
 * @param {number} [params.stagesJumped]
 * @param {number} [params.gainLbs]
 * @param {string} [params.growthType] - combat, spell, feeding, etc.
 * @param {'self'|'target'} [params.growthPerspective]
 * @param {string} [params.growthMethod] - alias for growthType (growthEvent compat)
 */
export function buildGrowthProseGlobals(params = {}) {
  const startStage = params.startStage ?? 0;
  const endStage = params.endStage ?? startStage;
  const stagesJumped = params.stagesJumped ?? Math.max(0, endStage - startStage);
  return {
    startStage,
    endStage,
    stagesJumped,
    gainLbs: params.gainLbs ?? 0,
    growthType: params.growthType ?? params.growthMethod ?? null,
    growthPerspective: params.growthPerspective ?? (params.observer ? 'target' : 'self'),
    growthMethod: params.growthMethod ?? params.growthType ?? null,
  };
}

/**
 * Render a growth prose pool.
 * @param {string} poolKey - e.g. growth.stage_up, growth.self.combat, growth.target.feeding
 * @param {object} grower - Character gaining size (ctx.subject)
 * @param {object|null} [observer] - Other party (ctx.ref) — causer or witness
 * @param {object} [params] - Passed to buildGrowthProseGlobals
 * @param {object} [opts] - seed, trace, history
 */
export function renderGrowthProse(poolKey, grower, observer = null, params = {}, opts = {}) {
  if (!grower || !poolKey) return '';

  const startStage = params.startStage ?? getStage(grower.lbs).id - (params.stagesJumped ?? 1);
  const endStage = params.endStage ?? getStage(grower.lbs).id;
  const globals = buildGrowthProseGlobals({
    ...params,
    startStage: params.startStage ?? Math.max(0, startStage),
    endStage,
    observer,
  });

  const ctx = createContext({
    subject: grower,
    ref: observer,
    globals,
    seed: opts.seed,
    history: opts.history,
  });

  return render(`{${poolKey}}`, ctx, { trace: opts.trace });
}

/**
 * Pick the best pool key for a growth event.
 * @param {object} options
 * @param {'self'|'target'} [options.perspective]
 * @param {string} [options.context] - combat, spell, feeding, intimate, blessing, crit, concentration_break
 * @param {number} [options.stagesJumped]
 * @param {boolean} [options.stageCrossing]
 */
export function resolveGrowthPoolKey({
  perspective = 'self',
  context = null,
  stagesJumped = 1,
  stageCrossing = false,
} = {}) {
  if (stagesJumped >= 2) {
    return perspective === 'target' ? 'growth.target.overflow' : 'growth.self.overflow';
  }
  if (stageCrossing || stagesJumped >= 1) {
    if (context) {
      return `growth.${perspective}.${context}`;
    }
    return perspective === 'target' ? 'growth.target.stage_up' : 'growth.self.stage_up';
  }
  if (context) {
    return `growth.${perspective}.${context}`;
  }
  return perspective === 'target' ? 'growth.target.minor' : 'growth.self.minor';
}

export {
  START_BANDS as GROWTH_START_BANDS,
  REL_BANDS as GROWTH_REL_BANDS,
  registerGrowthPool,
  registerStageCrossingPool,
  registerSelfTargetPair,
} from './helpers.js';
