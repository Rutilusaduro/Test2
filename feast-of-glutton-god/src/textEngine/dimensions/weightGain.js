import { getStage } from '../../gameData/stages.js';
import { getCorruptionTier } from '../../gameData/corruption.js';
import { getTier } from '../../gameData/relationships.js';
import { getHungerTier, getAddictionLevel, isInWithdrawal } from '../../gameData/hungerAddiction.js';
import {
  getFixationTier, getObsessionTier, getDependenceTier, getShameTier,
} from '../../gameData/psychState.js';
import { registerDimensions, relSize } from '../engine.js';

let registered = false;

const attitudeOf = (s) => getCorruptionTier(s.corruption || 0).id;

export function registerWeightGainDimensions() {
  if (registered) return;
  registered = true;
  registerDimensions({
    stage:         { derive: (s) => getStage(s.lbs).id, range: true },
    attitude:      { derive: attitudeOf, range: true },
    bodyType:      { derive: (s) => s.bodyType || null },
    archetype:     { derive: (s) => s.archetype || null },
    mood:          { derive: (s) => s.mood || null },
    characterId:   { derive: (s) => s.numericId ?? s.id ?? null },
    hungerTier:    { derive: (s) => getHungerTier(s), range: true },
    inWithdrawal:  { derive: (s) => isInWithdrawal(s) },
    addictionLevel:{ derive: (s) => getAddictionLevel(s), range: true },
    relSize:       { derive: (s, env) => (env.ref ? relSize(s, env.ref) : null) },
    refStage:      { derive: (s, env) => (env.ref ? getStage(env.ref.lbs).id : null), range: true },
    corruption:    { derive: attitudeOf, range: true },
    relationship:  { derive: (s) => getTier(s.relationship || 0).id, range: true },
    studentId:     { derive: (s) => s.numericId ?? null },
    role:          { derive: (s) => s.role || null },
    fixationTier:  { derive: (s) => getFixationTier(s.psych?.fixation ?? 0).id, range: true },
    obsessionTier: { derive: (s) => getObsessionTier(s.psych?.obsession ?? 0).id, range: true },
    dependenceTier:{ derive: (s) => getDependenceTier(s.psych?.dependence ?? 0).id, range: true },
    shameTier:     { derive: (s) => getShameTier(s.psych?.shame ?? 0).id, range: true },
    hasDeviceEquipped: { derive: () => false },
  });
}

registerWeightGainDimensions();
