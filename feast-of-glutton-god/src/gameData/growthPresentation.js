/**
 * Growth presentation — combines growth scenes with concrete world reactions.
 */
import { advanceStage, getStage, lbsForStage } from './stages.js';
import { getEffectiveSizeCap } from './universalSize.js';
import { getLocaleKey, getLocaleForRegion } from './regionLocales.js';
import { countLargePresencesInRegion } from './growthCrowd.js';
import { renderGrowthScene, renderStageCrossingLine } from '../textEngine/scenes/growthEvent/index.js';
import { renderGrowthProse } from '../textEngine/scenes/growth/index.js';
import { renderWorldGrowthReaction } from '../textEngine/scenes/growthEvent/worldReactions.js';
import { notifyWorldReaction } from './worldReactivity.js';

/**
 * Advance size with universal cap rules and return narrative bundle.
 */
export function applyGrowthWithPresentation(character, game, stages = 1, opts = {}) {
  const startStage = getStage(character.lbs).id;
  const cap = getEffectiveSizeCap(character);
  const result = advanceStage(character, stages, { maxStage: cap });
  if (result.stagesJumped <= 0) {
    return { ...result, text: '', worldReaction: '' };
  }

  const regionId = opts.regionId ?? game?.region ?? 'harvest_hearth';
  const narrative = buildGrowthNarrative(character, game, {
    startStage: result.startStage,
    endStage: result.endStage,
    stagesJumped: result.stagesJumped,
    regionId,
    growthMethod: opts.growthMethod ?? opts.method ?? 'general',
    observer: opts.observer ?? null,
    week: game?.day ?? 1,
  });

  return { ...result, ...narrative };
}

export function buildGrowthNarrative(character, game, params) {
  const {
    startStage,
    endStage,
    stagesJumped,
    regionId,
    growthMethod,
    observer,
    week,
  } = params;

  const locale = getLocaleKey(regionId);
  const localeMeta = getLocaleForRegion(regionId);
  const crowd = game ? countLargePresencesInRegion(game, regionId, character?.id) : { count: 0 };

  const gainLbs = Math.max(0, lbsForStage(endStage) - lbsForStage(startStage));

  const scene = stagesJumped >= 1 && endStage >= 4
    ? renderGrowthScene(character, {
      growthMethod,
      startStage,
      endStage,
      stagesJumped,
      gainLbs,
      locale,
      week,
    })
    : '';

  const crossing = stagesJumped >= 1
    ? renderStageCrossingLine(character, { endStage, week })
    : '';

  const worldReaction = renderWorldGrowthReaction(character, {
    startStage,
    endStage,
    stagesJumped,
    locale,
    localeMeta,
    regionId,
    crowdCount: crowd.count,
    crowdStages: crowd.stages,
    week,
    observer,
  });

  let persistentReactionLines = [];
  if (endStage >= 10 && game) {
    const reaction = notifyWorldReaction(game, {
      type: 'growth',
      character,
      startStage,
      endStage,
      stagesJumped,
      regionId,
      growthMethod,
    });
    persistentReactionLines = reaction.lines ?? [];
  }

  const snippet = !scene && stagesJumped > 0
    ? renderGrowthProse(
      resolveGrowthPoolKey(growthMethod, stagesJumped),
      character,
      observer,
      { startStage, endStage, stagesJumped, growthMethod },
    )
    : '';

  const parts = [scene || snippet, crossing, worldReaction, ...persistentReactionLines].filter(Boolean);
  const text = parts.join('\n\n');

  return {
    text,
    worldReaction,
    persistentReactionLines,
    scene,
    crossing,
    snippet,
  };
}

function resolveGrowthPoolKey(method, stagesJumped) {
  if (stagesJumped >= 2) return 'growth.overflow';
  const map = {
    feed: 'growth.target.feeding',
    feeding: 'growth.target.feeding',
    spell: 'growth.target.spell',
    combat: 'growth.target.combat',
    intimate: 'growth.target.intimate',
    blessing: 'growth.target.blessing',
    feast: 'growth.target.feast',
  };
  return map[method] ?? 'growth.stage_up';
}

/** Re-export advance with cap for callers that only need mechanics. */
export function advanceStageUniversal(character, stages = 1, opts = {}) {
  const cap = getEffectiveSizeCap(character);
  return advanceStage(character, stages, { ...opts, maxStage: cap });
}
