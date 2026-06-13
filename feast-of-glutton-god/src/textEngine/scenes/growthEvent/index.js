// ═══════════════════════════════════════════════════════════════
// SCENE: GROWTH EVENT — public API + beat assembly
// Full multi-beat scenes for major weight-gain moments. Minor weekly
// ticks keep their one-liner (see scenes/deviceTick). Scene length
// scales with magnitude (notable → significant → dramatic).
// ═══════════════════════════════════════════════════════════════
import { registerPool, createContext, render } from '../../engine.js';
import { getStage } from '../../../gameData/stages.js';
import { getDeviceDependence, getDeviceDependenceTier } from '../../../gameData/deviceDependence.js';
import { resolveGrowthZone } from '../../growthLexicon.js';
import '../../growthLexicon.js';
import '../../modules.js';
import '../../lexicon.js';
import './fragments.js';
import './environment.js';
import './stageCrossings.js';
import './personas.js';

// ── beat skeletons ─────────────────────────────────────────────
// Each beat is a pool of FULL-SENTENCE skeletons; fragment slots live
// in the sibling files. The arc: onset → surge → strain → environment
// → crossing → reaction → settle.

registerPool('ge.onset', [
  { when: {}, text: [
    '{ge.causeAction} {ge.firstSensation}',
    '{ge.causeAction} {ge.firstSensation}',
  ] },
  { when: { isMalfunction: true }, weight: 2, text: [
    '{ge.causeAction} Something is off almost at once. {ge.firstSensation}',
  ] },
]);

registerPool('ge.surge', [
  { when: {}, text: [
    '{grow.sudden}{join:ge.surgeDetail|prefix: }',
  ] },
  { when: { stagesJumpedMin: 2 }, weight: 2, text: [
    '{grow.sudden} It does not stop where it should.{join:ge.surgeDetail|prefix: }',
  ] },
  { when: { isMalfunction: true }, weight: 2, text: [
    '{grow.sudden}{join:ge.surgeDetail|prefix: }',
  ] },
]);

registerPool('ge.strain', [
  { when: {}, text: [
    '{ge.garment|cap} {ge.clothingStrain}.{join:ge.clothingFail|prefix: }',
  ] },
]);

registerPool('ge.environmentBeat', [
  { when: {}, text: [
    '{ge.furnitureEvent}{join:ge.spaceEvent|prefix: }',
  ] },
]);

registerPool('ge.crossingBeat', [
  { when: {}, text: [
    '{grow.crossing}{join:grow.crossingDialogue|prefix: }',
  ] },
]);

registerPool('ge.reaction', [
  { when: {}, text: [
    '{ge.reactionBody} {ge.reactionDialogue}',
  ] },
]);

registerPool('ge.settle', [
  { when: {}, text: [
    '{ge.settleLine}{join:ge.permanentNote|prefix: }{join:ge.taliaCameo|prefix: }{join:ge.deviceWindDown|prefix: }',
  ] },
]);

// ── magnitude ──────────────────────────────────────────────────
function magnitudeTier({ stagesJumped = 0, malfunctionTier = null } = {}) {
  if (stagesJumped >= 2 || malfunctionTier === 'critical') return 'dramatic';
  if (stagesJumped >= 1 || malfunctionTier === 'major' || malfunctionTier === 'moderate') return 'significant';
  return 'notable';
}

// Which beats render at each magnitude. crossing only when a stage was crossed;
// environment joins 'significant' once the body is large (endStage ≥ 6).
function beatsForMagnitude(tier, { stagesJumped = 0, endStage = 0 } = {}) {
  const crossed = stagesJumped >= 1;
  if (tier === 'dramatic') {
    return ['ge.onset', 'ge.surge', 'ge.strain', 'ge.environmentBeat',
      ...(crossed ? ['ge.crossingBeat'] : []), 'ge.reaction', 'ge.settle'];
  }
  if (tier === 'significant') {
    return ['ge.onset', 'ge.surge', 'ge.strain',
      ...(endStage >= 6 ? ['ge.environmentBeat'] : []),
      ...(crossed ? ['ge.crossingBeat'] : []), 'ge.reaction', 'ge.settle'];
  }
  return ['ge.onset', 'ge.surge', 'ge.reaction'];
}

// ── context globals ────────────────────────────────────────────
export function buildGrowthGlobals(student, params = {}) {
  const {
    causeType = null, deviceId = null, featureId = null,
    gainLbs = 0, startStage = 0, endStage = 0,
    growthZone = null, growthMethod = null, growthIntensity = null, sensation = null,
    malfunctionTier = null, isMalfunction = false, isPermanent = false,
    locale = null, outfitHint = null,
  } = params;
  const depLevel = deviceId ? getDeviceDependence(student, deviceId) : 0;
  const depTier = getDeviceDependenceTier(depLevel).id;
  return {
    causeType, deviceId, featureId,
    gainLbs, gainLbsMin: gainLbs,
    startStage, endStage, stagesJumped: endStage - startStage,
    growthZone: growthZone || resolveGrowthZone(student),
    growthMethod, growthIntensity, sensation,
    malfunctionTier, isMalfunction, isPermanent,
    locale, outfitHint,
    weightBand: weightBandFromStage(endStage),
    bodyState: student?.bodyOverride?.stateType || null,
    deviceDependence: depLevel,
    deviceDependenceTier: depTier,
    equippedWaist: student?.equip?.waist?.defId || null,
    equippedHead: student?.equip?.head?.defId || null,
  };
}

function weightBandFromStage(stageId) {
  const bands = { lean: [0, 2], mid: [3, 5], heavy: [6, 8], extreme: [9, 11] };
  for (const [band, [lo, hi]] of Object.entries(bands)) {
    if (stageId >= lo && stageId <= hi) return band;
  }
  return 'lean';
}

/**
 * Render a full growth scene. Returns paragraphs joined by blank lines,
 * scaled to the event's magnitude.
 */
export function renderGrowthScene(student, params = {}, opts = {}) {
  if (!student) return '';
  const globals = buildGrowthGlobals(student, params);
  const ctx = createContext({ subject: student, week: params.week || 1, globals });
  const tier = magnitudeTier(globals);
  const beats = beatsForMagnitude(tier, globals);
  const paragraphs = beats
    .map(beat => render(`{${beat}}`, ctx, opts).trim())
    .filter(Boolean);
  return paragraphs.join('\n\n');
}

/** Standalone per-stage crossing line — reusable outside the full scene. */
export function renderStageCrossingLine(student, { endStage = null, week = 1 } = {}) {
  if (!student) return '';
  const end = endStage ?? getStage(student.lbs).id;
  const ctx = createContext({
    subject: student, week,
    globals: { endStage: end, startStage: Math.max(0, end - 1), stagesJumped: 1, weightBand: weightBandFromStage(end) },
  });
  return render('{grow.crossing}', ctx);
}

export { magnitudeTier };
