// ═══════════════════════════════════════════════════════════════
// GROWTH LEXICON — registers mined sudden-growth prose pools
// ═══════════════════════════════════════════════════════════════
import { registerPool } from './engine.js';
import {
  GROWTH_LEXICON_CHUNKS,
  GROWTH_ZONE_BY_BODY_TYPE,
  SUDDEN_GROWTH_LBS_MIN,
} from './growthLexiconData.js';
import { ENEMY_SPECIES_GROWTH_CHUNKS } from './enemyGrowthLexiconData.js';
import { resolveGrowthKind } from '../gameData/enemyGrowthKinds.js';

function buildVariants(chunks) {
  const variants = [];
  for (const chunk of chunks) {
    for (const bodyType of chunk.bodyTypes) {
      variants.push({
        when: { bodyType, growthZone: chunk.zone },
        text: chunk.texts,
      });
    }
  }
  variants.push({
    when: {},
    text: [
      "{subject.name}'s body swelled with sudden, unmistakable softness — the gain visible before she could name it.",
      "Weight settled rapidly into {subject.first}'s frame, thickening her in quiet, visible inches.",
      "{subject.name} thickened all at once — plush fat accumulating where the surge hit hardest.",
      "Soft fat built up on {subject.first} faster than the week should allow, reshaping her silhouette in real time.",
    ],
  });
  return variants;
}

function buildSpeciesVariants(chunks) {
  const variants = [];
  for (const chunk of chunks) {
    const when = { growthKind: chunk.growthKind };
    if (chunk.zone) when.growthZone = chunk.zone;
    variants.push({
      when,
      weight: chunk.zone ? 10 : 8,
      text: chunk.texts,
    });
  }
  return variants;
}

registerPool('grow.sudden', [
  ...buildSpeciesVariants(ENEMY_SPECIES_GROWTH_CHUNKS),
  ...buildVariants(GROWTH_LEXICON_CHUNKS),
]);

export function resolveGrowthZone(student) {
  const bt = student?.bodyOverride?.bodyTypeOverride || student?.bodyType || 'default';
  return GROWTH_ZONE_BY_BODY_TYPE[bt] || GROWTH_ZONE_BY_BODY_TYPE.default;
}

export function resolveGrowthKindFor(student) {
  return resolveGrowthKind(student);
}

export function isSuddenGrowth(gainLbs) {
  return (gainLbs ?? 0) >= SUDDEN_GROWTH_LBS_MIN;
}

export { SUDDEN_GROWTH_LBS_MIN, GROWTH_ZONE_BY_BODY_TYPE };
