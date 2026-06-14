/**
 * Gain-Desire — per-NPC willingness to grow (0–100).
 * Distinct from relationship (feelings about YOU) and corruption (legacy acceptance stat).
 * The portable "feelings about gaining" axis; `attitude` in the text engine derives from this.
 */

export const GAIN_DESIRE_MAX = 100;

export const GAIN_DESIRE_TIERS = [
  { id: 0, min: 0, label: 'Reluctant', desc: 'Growth frightens or shames her — appetite is a battle.' },
  { id: 1, min: 25, label: 'Open', desc: 'Curious warmth — she could learn to want this.' },
  { id: 2, min: 50, label: 'Eager', desc: 'Hungry for more — swelling feels like coming home.' },
  { id: 3, min: 75, label: 'Insatiable', desc: 'Devoted to abundance — every inch gained is worship.' },
];

/** Innate starting desire by archetype / bodyType (seeded once per NPC). */
const ARCHETYPE_SEED = {
  nurturing: 55,
  performer: 50,
  fertility_goddess: 70,
  devout: 40,
  scholar: 35,
  shy: 28,
  competitive: 32,
  dominant: 38,
  haughty: 22,
  proud: 25,
  greedy: 48,
  ancient: 30,
};

const BODYTYPE_SEED = {
  hourglass: 45,
  pear: 50,
  rotund: 55,
  athletic: 30,
  straight: 25,
};

export function getGainDesireTier(points = 0) {
  return [...GAIN_DESIRE_TIERS].reverse().find((t) => points >= t.min) || GAIN_DESIRE_TIERS[0];
}

export function seedGainDesire(npc) {
  if (npc.gainDesire != null) return npc.gainDesire;
  const archetype = ARCHETYPE_SEED[npc.archetype] ?? 35;
  const body = BODYTYPE_SEED[npc.bodyType] ?? 35;
  return Math.min(GAIN_DESIRE_MAX, Math.round((archetype + body) / 2));
}

export function getGainDesire(npc) {
  if (npc.gainDesire == null) npc.gainDesire = seedGainDesire(npc);
  return npc.gainDesire;
}

export function addGainDesire(npc, amount) {
  const before = getGainDesire(npc);
  npc.gainDesire = Math.min(GAIN_DESIRE_MAX, Math.max(0, before + amount));
  return { before, after: npc.gainDesire, tier: getGainDesireTier(npc.gainDesire) };
}

export function ensureGainDesire(npc) {
  getGainDesire(npc);
  return npc;
}
