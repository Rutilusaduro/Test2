/**
 * Softening tiers — player-facing "corruption" as genre conversion / willing fullness.
 * Code field remains `corruption`; labels reflavored for Wrong-Genre fiction (Phase 4).
 */
export const CORRUPTION_TIERS = [
  {
    id: 0,
    min: 0,
    label: "Still Measured",
    color: "#7a8a9a",
    desc: "Still clinging to the Wheel's idea of her body — embarrassed when appetite wins.",
  },
  {
    id: 1,
    min: 34,
    label: "Softening",
    color: "#c8860a",
    desc: "The earnest world-view is bending. She knows she shouldn't enjoy this. She does anyway.",
  },
  {
    id: 2,
    min: 67,
    label: "Genre-Converted",
    color: "#c03050",
    desc: "Open, eager, proud — your feast is her truth now, not Sylwen's measure.",
  },
];

export const getCorruptionTier = (c = 0) =>
  [...CORRUPTION_TIERS].reverse().find((t) => c >= t.min) || CORRUPTION_TIERS[0];

export function addCorruption(character, amount) {
  character.corruption = Math.min(100, (character.corruption || 0) + amount);
  return getCorruptionTier(character.corruption);
}
