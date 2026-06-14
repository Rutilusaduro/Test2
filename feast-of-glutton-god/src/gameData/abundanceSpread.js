/**
 * Abundance Spread — tracks how Gorgara's influence grows across the world.
 * Feeds quest scoring, region auras, and celebratory milestones.
 */

export const ABUNDANCE_MILESTONES = [
  { points: 0, label: 'First Spark', desc: 'A single flame of indulgence flickers.' },
  { points: 50, label: 'Warm Hearth', desc: 'Homes grow softer; kitchens never empty.' },
  { points: 120, label: 'Feast Tide', desc: 'Whole neighborhoods swell with shared appetite.' },
  { points: 250, label: 'Golden Overflow', desc: 'Abundance spills into streets and temples alike.' },
  { points: 500, label: 'Gorgara\'s Dawn', desc: 'The goddess stirs — the world hungers beautifully.' },
];

export const ABUNDANCE_AWARDS = {
  npc_feed: 3,
  npc_bless: 4,
  npc_feast: 8,
  npc_intimate: 5,
  npc_growth_stage: 5,
  quest_complete_main: 25,
  quest_complete_side: 12,
  combat_convert: 6,
  combat_win: 3,
  overworld_spell_growth: 4,
  companion_devoted: 20,
};

export function getAbundanceSpread(game) {
  return game.worldFlags?.abundanceSpread ?? 0;
}

export function getAbundanceMilestone(points) {
  let current = ABUNDANCE_MILESTONES[0];
  for (const m of ABUNDANCE_MILESTONES) {
    if (points >= m.points) current = m;
  }
  const next = ABUNDANCE_MILESTONES.find((m) => m.points > points) ?? null;
  return { current, next, points };
}

export function awardAbundanceSpread(game, source, amountOverride) {
  game.worldFlags = game.worldFlags || {};
  const base = amountOverride ?? ABUNDANCE_AWARDS[source] ?? 0;
  if (base <= 0) return { gained: 0, total: getAbundanceSpread(game), milestoneUp: false };
  const old = getAbundanceSpread(game);
  const oldMilestone = getAbundanceMilestone(old).current;
  game.worldFlags.abundanceSpread = old + base;
  const total = game.worldFlags.abundanceSpread;
  const newMilestone = getAbundanceMilestone(total).current;
  return {
    gained: base,
    total,
    milestoneUp: newMilestone.points > oldMilestone.points,
    milestone: newMilestone,
    oldMilestone,
  };
}

export function getAbundanceProgress(game) {
  const points = getAbundanceSpread(game);
  const { current, next } = getAbundanceMilestone(points);
  if (!next) return { points, current, next: null, pct: 100 };
  const span = next.points - current.points;
  const into = points - current.points;
  return { points, current, next, pct: Math.min(100, Math.round((into / span) * 100)) };
}
