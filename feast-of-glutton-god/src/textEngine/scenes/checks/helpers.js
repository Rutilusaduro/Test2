/**
 * Shared helpers for check crit/fumble prose pools.
 *
 * Stage bands (0-indexed, 12 stages total):
 *   lean    0–2  — agile, intimate, precise
 *   mid     3–5  — rounded, confident abundance
 *   heavy   6–8  — grand, overwhelming presence
 *   extreme 9–11 — titanic, world-shaking power
 *
 * Relationship tiers (from relationships.js):
 *   distant  0–1  stranger / acquaintance
 *   warm     2–3  friend / close
 *   intimate 4–5  lover / devoted
 */
import { registerPool } from '../../engine.js';

export const STAGE_BANDS = [
  { name: 'lean', when: { stageMax: 2 } },
  { name: 'mid', when: { stageMin: 3, stageMax: 5 } },
  { name: 'heavy', when: { stageMin: 6, stageMax: 8 } },
  { name: 'extreme', when: { stageMin: 9 } },
];

export const REL_BANDS = [
  { name: 'distant', when: { relationship: [0, 1] } },
  { name: 'warm', when: { relationship: [2, 3] } },
  { name: 'intimate', when: { relationship: [4, 5] } },
];

/** @typedef {Record<string, Record<string, string[]>>} CheckProseMatrix */

/**
 * Register a check outcome pool keyed by stage band × relationship tier.
 * @param {string} key
 * @param {CheckProseMatrix} matrix
 * @param {string[]} [fallback]
 */
export function registerCheckPool(key, matrix, fallback = []) {
  const variants = [];

  for (const stage of STAGE_BANDS) {
    const band = matrix[stage.name];
    if (!band) continue;

    for (const rel of REL_BANDS) {
      const lines = band[rel.name];
      if (!lines?.length) continue;
      variants.push({
        when: { ...stage.when, ...rel.when },
        text: lines,
      });
    }

    if (band._any?.length) {
      variants.push({ when: stage.when, text: band._any });
    }
  }

  variants.push({
    when: {},
    text: fallback.length
      ? fallback
      : ['A perfect roll — abundance answers your hunger.'],
  });

  registerPool(key, variants);
}

/** Register identical prose under multiple pool keys (stat aliases, etc.). */
export function registerCheckPoolAliases(keys, matrix, fallback) {
  for (const key of keys) {
    registerCheckPool(key, matrix, fallback);
  }
}
