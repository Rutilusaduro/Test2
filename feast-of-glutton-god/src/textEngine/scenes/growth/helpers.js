/**
 * Growth prose pool helpers — follows AUTHORING.md pool conventions.
 *
 * Perspective:
 *   growth.self.*   — subject is the one growing ({subject}, {they})
 *   growth.target.* — subject grows; ref is observer/causer ({ref.first} reacts)
 *
 * Stage selectors (globals on ctx):
 *   startStage, endStage, stagesJumped — use endStage / startStageMin+Max / stagesJumpedMin
 *
 * Relationship tiers (subject.relationship → getTier().id):
 *   distant 0–1 · warm 2–3 · intimate 4–5
 */
import { registerPool, registerModule } from '../../engine.js';
import { WEIGHT_STAGES } from '../../../gameData/stages.js';

export const REL_BANDS = [
  { name: 'distant', when: { relationship: [0, 1] } },
  { name: 'warm', when: { relationship: [2, 3] } },
  { name: 'intimate', when: { relationship: [4, 5] } },
];

export const START_BANDS = [
  { name: 'lean', when: { startStageMax: 2 } },
  { name: 'mid', when: { startStageMin: 3, startStageMax: 5 } },
  { name: 'heavy', when: { startStageMin: 6, startStageMax: 8 } },
  { name: 'extreme', when: { startStageMin: 9 } },
];

function stageLabel(id) {
  return WEIGHT_STAGES[Math.min(Math.max(0, id ?? 0), 11)]?.label ?? 'larger';
}

// ─── Dynamic slots for growth templates ─────────────────────────────────────

registerModule('growth.endLabel', [
  { when: {}, text: [(ctx) => stageLabel(ctx.globals?.endStage ?? ctx.d?.stage ?? 0)] },
]);

registerModule('growth.startLabel', [
  { when: {}, text: [(ctx) => stageLabel(ctx.globals?.startStage ?? ctx.d?.stage ?? 0)] },
]);

registerModule('growth.stagesJumped', [
  { when: {}, text: [(ctx) => String(ctx.globals?.stagesJumped ?? 1)] },
]);

registerModule('growth.gainLbs', [
  { when: {}, text: [(ctx) => String(Math.round(ctx.globals?.gainLbs ?? 0))] },
]);

/** @typedef {Record<string, Record<string, string[]>>} GrowthProseMatrix */

/**
 * Register pool with start-stage band × relationship matrix.
 * @param {string} key
 * @param {GrowthProseMatrix} matrix
 * @param {string[]} [fallback]
 */
export function registerGrowthPool(key, matrix, fallback = []) {
  const variants = [];

  for (const band of START_BANDS) {
    const content = matrix[band.name];
    if (!content) continue;

    for (const rel of REL_BANDS) {
      const lines = content[rel.name];
      if (!lines?.length) continue;
      variants.push({
        when: { ...band.when, ...rel.when },
        text: lines,
      });
    }

    if (content._any?.length) {
      variants.push({ when: band.when, text: content._any });
    }
  }

  variants.push({
    when: {},
    text: fallback.length
      ? fallback
      : ['Softness spreads — abundance arrives, beautiful and welcome.'],
  });

  registerPool(key, variants);
}

/**
 * Register stage-crossing pool keyed on endStage × relationship.
 * @param {string} key
 * @param {Record<number, Record<string, string[]>>} byEndStage - endStage id → rel bands
 * @param {string[]} [fallback]
 */
export function registerStageCrossingPool(key, byEndStage, fallback = []) {
  const variants = [];

  for (const [endStr, relMap] of Object.entries(byEndStage)) {
    const endStage = Number(endStr);
    for (const rel of REL_BANDS) {
      const lines = relMap[rel.name];
      if (!lines?.length) continue;
      variants.push({
        when: { endStage, ...rel.when },
        text: lines,
      });
    }
    if (relMap._any?.length) {
      variants.push({ when: { endStage }, text: relMap._any });
    }
  }

  variants.push({
    when: {},
    text: fallback.length
      ? fallback
      : ['{subject.first} crosses into {growth.endLabel} — softer, fuller, radiant.'],
  });

  registerPool(key, variants);
}

/** Register growth.self.* and growth.target.* from paired matrices. */
export function registerSelfTargetPair(baseKey, selfMatrix, targetMatrix, opts = {}) {
  registerGrowthPool(`growth.self.${baseKey}`, selfMatrix, opts.selfFallback);
  registerGrowthPool(`growth.target.${baseKey}`, targetMatrix, opts.targetFallback);
  if (opts.aliasCore) {
    registerPool(`growth.${baseKey}`, [
      { when: { growthPerspective: 'self' }, text: [`{growth.self.${baseKey}}`] },
      { when: { growthPerspective: 'target' }, text: [`{growth.target.${baseKey}}`] },
      { when: {}, text: [`{growth.self.${baseKey}}`] },
    ]);
  }
}

/** Overflow / multi-stage pools — keyed on stagesJumpedMin. */
export function registerOverflowPool(key, matrix, fallback = []) {
  const variants = [];

  for (const [jumpStr, relMap] of Object.entries(matrix)) {
    const stagesJumpedMin = Number(jumpStr);
    for (const rel of REL_BANDS) {
      const lines = relMap[rel.name];
      if (!lines?.length) continue;
      variants.push({
        when: { stagesJumpedMin, ...rel.when },
        text: lines,
      });
    }
    if (relMap._any?.length) {
      variants.push({ when: { stagesJumpedMin }, text: relMap._any });
    }
  }

  variants.push({
    when: {},
    text: fallback.length
      ? fallback
      : ['Abundance avalanches — {subject.first} swells beyond expectation, glorious and gasping.'],
  });

  registerPool(key, variants);
}

export function registerSelfTargetOverflowPair(baseKey, selfMatrix, targetMatrix, opts = {}) {
  registerOverflowPool(`growth.self.${baseKey}`, selfMatrix, opts.selfFallback);
  registerOverflowPool(`growth.target.${baseKey}`, targetMatrix, opts.targetFallback);
  registerPool(`growth.${baseKey}`, [
    { when: { growthPerspective: 'target' }, text: [`{growth.target.${baseKey}}`] },
    { when: {}, text: [`{growth.self.${baseKey}}`] },
  ]);
}
