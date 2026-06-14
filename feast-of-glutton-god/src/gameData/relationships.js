/**
 * Relationship system — 6-tier per-NPC bonds with growth synergy and interaction unlocks.
 *
 * Tiers: Neutral → Friendly → Close → Intimate → Craving → Devoted
 * Points: 0–100 (strongly favors upward progression; penalties are rare).
 */

export const RELATIONSHIP_MAX = 100;

export const RELATIONSHIP_TIERS = [
  {
    id: 0,
    min: 0,
    label: 'Neutral',
    desc: 'Polite distance — abundance has not yet woven you together.',
  },
  {
    id: 1,
    min: 15,
    label: 'Friendly',
    desc: 'Warm rapport — she smiles when you arrive and lingers when you speak.',
  },
  {
    id: 2,
    min: 35,
    label: 'Close',
    desc: 'Fond affection — feeding and flirting land with delicious certainty.',
  },
  {
    id: 3,
    min: 55,
    label: 'Intimate',
    desc: 'Open desire — touch, trust, and growth feel sacred between you.',
  },
  {
    id: 4,
    min: 75,
    label: 'Craving',
    desc: 'Passionate hunger — she seeks your touch, your food, your magic.',
  },
  {
    id: 5,
    min: 90,
    label: 'Devoted',
    desc: 'Deeply loved — an unbreakable bond of pleasure, growth, and devotion.',
  },
];

/** Points awarded by action source (tune progression speed here). */
export const RELATIONSHIP_AWARDS = {
  talk: 3,
  observe: 1,
  flirt_success: 5,
  flirt_crit: 8,
  flirt_fumble: 1,
  feed: 4,
  feed_magical: 5,
  bless_minor: 6,
  bless_major: 8,
  bless_targeted: 7,
  feast: 10,
  intimate: 5,
  special: 5,
  growth_witnessed: 2,
  quest_personal: 15,
  quest_romance: 20,
  spell_bless: 4,
  compliment: 2,
  gift: 3,
};

/** Minimum relationship tier id required per interaction. */
export const INTERACTION_UNLOCKS = {
  talk: 0,
  observe: 0,
  feed: 0,
  flirt: 1,
  bless: 1,
  special: 2,
  corrupt: 2,
  recruit: 2,
  feast: 3,
  intimate: 3,
};

/** Growth stage bonus added on top of base advanceStage() calls. */
export const GROWTH_STAGE_BONUS = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 1,
  5: 1,
};

/** Extra stages on feast/intimate at Craving+ */
export const PASSION_GROWTH_BONUS = 1;

export const getTier = (points = 0) =>
  [...RELATIONSHIP_TIERS].reverse().find((t) => points >= t.min) || RELATIONSHIP_TIERS[0];

export function getNextTier(points = 0) {
  const current = getTier(points);
  return RELATIONSHIP_TIERS.find((t) => t.id === current.id + 1) ?? null;
}

export function getRelationshipProgress(points = 0) {
  const tier = getTier(points);
  const next = getNextTier(points);
  if (!next) return { tier, points, next: null, pct: 100, toNext: 0 };
  const span = next.min - tier.min;
  const into = points - tier.min;
  return {
    tier,
    points,
    next,
    pct: Math.min(100, Math.round((into / span) * 100)),
    toNext: next.min - points,
  };
}

export function pointsForTier(tierId) {
  return RELATIONSHIP_TIERS.find((t) => t.id === tierId)?.min ?? 0;
}

export function canUnlockInteraction(npc, interactionId) {
  const required = INTERACTION_UNLOCKS[interactionId] ?? 0;
  return getTier(npc?.relationship ?? 0).id >= required;
}

export function getFlirtBonus(npc) {
  const tier = getTier(npc?.relationship ?? 0).id;
  if (tier >= 4) return 3;
  if (tier >= 2) return 2;
  if (tier >= 1) return 1;
  return 0;
}

export function getGrowthStageBonus(npc, method = 'feed') {
  const tier = getTier(npc?.relationship ?? 0).id;
  let bonus = GROWTH_STAGE_BONUS[tier] ?? 0;
  if (tier >= 4 && (method === 'intimate' || method === 'feast' || method === 'blessing')) {
    bonus += PASSION_GROWTH_BONUS;
  }
  return bonus;
}

export function getRelationshipAwardMultiplier(npc) {
  const tier = getTier(npc?.relationship ?? 0).id;
  if (tier >= 5) return 1.5;
  if (tier >= 3) return 1.2;
  if (tier >= 2) return 1.1;
  return 1;
}

/**
 * Award relationship points from a named source.
 * @returns {{ gained: number, tier: object, tierUp: boolean, oldTier: object, devoted: boolean }}
 */
export function awardRelationship(npc, source, amountOverride) {
  const oldPoints = npc.relationship ?? 0;
  const oldTier = getTier(oldPoints);
  const base = amountOverride ?? RELATIONSHIP_AWARDS[source] ?? 0;
  const gained = Math.round(base * getRelationshipAwardMultiplier(npc));
  npc.relationship = Math.min(RELATIONSHIP_MAX, Math.max(0, oldPoints + gained));
  const tier = getTier(npc.relationship);
  const tierUp = tier.id > oldTier.id;

  let devoted = false;
  if (tierUp && tier.id === 5) {
    devoted = applyDevotedMilestone(npc);
  }

  return { gained, tier, tierUp, oldTier, devoted };
}

/** Rare downward adjustment — only for explicit story betrayal, etc. */
export function reduceRelationship(npc, amount) {
  const oldTier = getTier(npc.relationship ?? 0);
  npc.relationship = Math.max(0, (npc.relationship ?? 0) - amount);
  const tier = getTier(npc.relationship);
  return { lost: amount, tier, tierDown: tier.id < oldTier.id, oldTier };
}

function applyDevotedMilestone(npc) {
  npc.bondFlags = npc.bondFlags || {};
  if (npc.bondFlags.devoted) return false;
  npc.bondFlags.devoted = true;
  npc.bondFlags.devotedAt = Date.now();
  if (npc.isCompanion || npc.companionId) {
    npc.bondFlags.romanceComplete = true;
    npc.maxHp = (npc.maxHp ?? 30) + 5;
    if (npc.hp != null) npc.hp = Math.min(npc.maxHp, (npc.hp ?? 0) + 5);
  }
  return true;
}

export function getTierUpMessage(npc, result) {
  if (!result?.tierUp) return '';
  const { tier, oldTier } = result;
  if (tier.id === 5) {
    return `★ ${npc.name} is now Devoted — your bond is complete, sacred, and endlessly pleasurable.`;
  }
  return `♥ Your bond with ${npc.name} deepens: ${oldTier.label} → ${tier.label}.`;
}

export function getInteractionLockReason(npc, interactionId) {
  const required = INTERACTION_UNLOCKS[interactionId] ?? 0;
  const tier = getTier(npc?.relationship ?? 0);
  if (tier.id >= required) return null;
  const need = RELATIONSHIP_TIERS.find((t) => t.id === required);
  return `Requires ${need?.label ?? 'higher'} bond (${need?.min ?? '?'}+ pts)`;
}

/** @deprecated Use awardRelationship — kept for gradual migration */
export function addRelationship(character, amount) {
  return awardRelationship(character, null, amount).tier;
}
