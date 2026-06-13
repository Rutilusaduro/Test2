export const CORRUPTION_TIERS = [
  { id: 0, min: 0, label: "Resistant", color: "#7a8a9a", desc: "Still fighting the pull of abundance — embarrassed, uncertain." },
  { id: 1, min: 34, label: "Curious", color: "#c8860a", desc: "Acceptance is winning. She knows she shouldn't enjoy this. She does anyway." },
  { id: 2, min: 67, label: "Enthusiastic Gainer", color: "#c03050", desc: "Open, eager, proud. She asks for more now." },
];

export const getCorruptionTier = (c = 0) =>
  [...CORRUPTION_TIERS].reverse().find((t) => c >= t.min) || CORRUPTION_TIERS[0];

export function addCorruption(character, amount) {
  character.corruption = Math.min(100, (character.corruption || 0) + amount);
  return getCorruptionTier(character.corruption);
}
