/**
 * Companion devotion — ideological alignment with the Fat Goddess (0–100).
 * Separate from relationship (emotional closeness).
 */
export const DEVOTION_THRESHOLDS = {
  25: {
    id: 'growth_ally',
    label: 'Growth Ally',
    desc: '+1 stage on player growth in combat when companions are present.',
    growthBonus: 1,
  },
  50: {
    id: 'corruption_aura',
    label: 'Corruption Aura',
    desc: 'Enemies gain +2 corruption at the start of your turns.',
    corruptionPulse: 2,
  },
  75: {
    id: 'miracle_surge',
    label: 'Miracle Surge',
    desc: 'Once per combat: first growth spell costs no action.',
    freeGrowthCast: true,
  },
  100: {
    id: 'apotheosis_bond',
    label: 'Apotheosis Bond',
    desc: 'Companion apotheosis passive — legendary devotion in battle.',
    apotheosis: true,
  },
};

export function ensureCompanionDevotion(companion) {
  if (companion.devotion == null) companion.devotion = 0;
  return companion.devotion;
}

export function getDevotionTier(devotion = 0) {
  let tier = 0;
  for (const threshold of Object.keys(DEVOTION_THRESHOLDS).map(Number).sort((a, b) => a - b)) {
    if (devotion >= threshold) tier = threshold;
  }
  return tier;
}

export function awardCompanionDevotion(companion, amount, source = 'general') {
  if (!companion || amount <= 0) return 0;
  const before = ensureCompanionDevotion(companion);
  companion.devotion = Math.min(100, before + amount);
  return companion.devotion - before;
}

export function awardPartyDevotion(game, amount, source = 'quest') {
  const messages = [];
  for (const companion of game.party ?? []) {
    const gained = awardCompanionDevotion(companion, amount, source);
    if (gained > 0) {
      messages.push(`${companion.name} devotion +${gained} (${companion.devotion}/100)`);
    }
  }
  return messages;
}

/** Summarize active devotion passives from recruited party in combat. */
export function summarizePartyDevotion(allies = []) {
  const companions = allies.filter((a) => a.isCompanion && !a.isPlayer);
  let maxDevotion = 0;
  let growthBonus = 0;
  let corruptionPulse = 0;
  let freeGrowthCast = false;
  let apotheosis = false;

  for (const c of companions) {
    const d = ensureCompanionDevotion(c);
    maxDevotion = Math.max(maxDevotion, d);
    if (d >= 25) growthBonus = DEVOTION_THRESHOLDS[25].growthBonus;
    if (d >= 50) corruptionPulse = Math.max(corruptionPulse, DEVOTION_THRESHOLDS[50].corruptionPulse);
    if (d >= 75) freeGrowthCast = true;
    if (d >= 100) apotheosis = true;
  }

  return { maxDevotion, growthBonus, corruptionPulse, freeGrowthCast, apotheosis, companions };
}

export function tickDevotionCorruptionAura(combat, player) {
  const bonus = combat.devotionBonuses;
  if (!bonus?.corruptionPulse || !player?.isPlayer) return [];
  const lines = [];
  for (const enemy of combat.enemies) {
    if (enemy.hp <= 0 || enemy.converted) continue;
    enemy.corruption = Math.min(100, (enemy.corruption ?? 0) + bonus.corruptionPulse);
    lines.push(`${enemy.name} wavers under companion devotion (+${bonus.corruptionPulse} corruption).`);
  }
  return lines;
}
