export const WEIGHT_STAGES = [
  { id: 0, label: "Slight", min: 80, color: "#2a8070", desc: "Slender and light — clothes hang loosely, limbs angular, a frame barely touched by abundance." },
  { id: 1, label: "Slim", min: 120, color: "#3a8a3a", desc: "Still slender with softness beginning at the edges. Narrow waist, hips starting to curve." },
  { id: 2, label: "Soft", min: 135, color: "#6a9a20", desc: "Gentle softness settling in. Belly pooching slightly, cheeks fuller, thighs pressing together." },
  { id: 3, label: "Chubby", min: 162, color: "#b0a000", desc: "Rounded belly pushing at waistbands. Face rounder, hips wider. Clothes noticeably tighter." },
  { id: 4, label: "Plump", min: 195, color: "#c07010", desc: "A real belly rounding outward. Thighs rubbing together. Shirts riding up." },
  { id: 5, label: "Heavy", min: 238, color: "#b05010", desc: "Belly hangs forward prominently. Arms thick, legs chunky. Walks with a slight waddle." },
  { id: 6, label: "Fat", min: 285, color: "#982808", desc: "A clear rolling waddle. Belly past the hips. Breathing audible on stairs." },
  { id: 7, label: "Very Fat", min: 360, color: "#800000", desc: "Belly cascades toward the knees. Needs wide doorways. Movement slow and deliberate." },
  { id: 8, label: "Enormous", min: 465, color: "#600000", desc: "Fills an entire couch. Belly rests on thighs. Getting up requires leverage." },
  { id: 9, label: "Colossal", min: 595, color: "#400000", desc: "Too wide for standard hallways. Shuffles a few steps at most." },
  { id: 10, label: "Blob", min: 820, color: "#200000", desc: "Nearly immobile — belly, breasts, and thighs one warm landscape." },
  { id: 11, label: "Leviathan", min: 1000, color: "#100000", desc: "Transcended human scale — impossibly vast, divine in sheer size." },
];

export function getStage(lbs) {
  for (let i = WEIGHT_STAGES.length - 1; i >= 0; i--) {
    if (lbs >= WEIGHT_STAGES[i].min) return WEIGHT_STAGES[i];
  }
  return WEIGHT_STAGES[0];
}

export function getTileSize(stageId) {
  if (stageId >= 10) return 3;
  if (stageId >= 7) return 2;
  return 1;
}

export function getMovement(stageId) {
  if (stageId <= 3) return 4;
  if (stageId <= 6) return 3;
  if (stageId <= 9) return 2;
  return 1;
}

export function getHpBonus(stageId) {
  if (stageId <= 3) return 0;
  if (stageId <= 6) return 0.3;
  if (stageId <= 9) return 0.8;
  return 1.5;
}

export function lbsForStage(stageId) {
  const s = WEIGHT_STAGES[Math.min(stageId, WEIGHT_STAGES.length - 1)];
  return s.min + 5;
}

/**
 * Advance size stages with optional cap (player.sizeCap or explicit maxStage).
 * @param {object} character
 * @param {number} stages
 * @param {{ maxStage?: number }} [opts]
 */
export function advanceStage(character, stages = 1, opts = {}) {
  const current = getStage(character.lbs).id;
  const cap = opts.maxStage ?? character.sizeCap ?? WEIGHT_STAGES.length - 1;
  const next = Math.min(current + stages, cap, WEIGHT_STAGES.length - 1);
  const startStage = current;
  if (next <= current) {
    return { startStage, endStage: current, stagesJumped: 0, capped: true };
  }
  character.lbs = lbsForStage(next);
  return { startStage, endStage: next, stagesJumped: next - startStage, capped: next >= cap };
}

export function isAtSizeCap(character) {
  const cap = character.sizeCap ?? WEIGHT_STAGES.length - 1;
  return getStage(character.lbs).id >= cap;
}
