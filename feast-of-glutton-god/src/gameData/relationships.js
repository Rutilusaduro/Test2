export const RELATIONSHIP_TIERS = [
  { id: 0, min: 0, label: "Stranger" },
  { id: 1, min: 15, label: "Acquaintance" },
  { id: 2, min: 35, label: "Friend" },
  { id: 3, min: 55, label: "Close" },
  { id: 4, min: 75, label: "Lover" },
  { id: 5, min: 90, label: "Devoted" },
];

export const getTier = (r = 0) =>
  [...RELATIONSHIP_TIERS].reverse().find((t) => r >= t.min) || RELATIONSHIP_TIERS[0];

export function addRelationship(character, amount) {
  character.relationship = Math.min(100, (character.relationship || 0) + amount);
  return getTier(character.relationship);
}
