/**
 * Prestige Pilgrimage — post-Act III paragon track (Phase 9b).
 * Rank 0–5 from scaling side quests, companion milestones, and ending archive.
 */
import { COMPANION_MILESTONE_DEFS } from './companionMilestones.js';
import { awardPartyDevotion } from './companionDevotion.js';
import { CONNECTION_GATES } from './regionObstacles.js';
import { isCosmicThreat } from './enemies.js';
import { addAbundancePoints } from './player.js';
import { renderPrestigeRankUp, renderPrestigeTalentPick } from '../textEngine/scenes/prestige/index.js';

export const SCALING_SIDE_QUESTS = [
  'side_sapphire_indulgence',
  'side_iron_forge_master',
  'side_lumen_apostate',
  'side_tarn_ledger',
  'side_barrow_voice',
  'side_twin_feasts',
  'side_divine_test',
  'side_korthak_respect',
  'side_the_blooming_war',
  'side_companion_apotheosis',
];

export const PRESTIGE_TALENTS = {
  feast_momentum: {
    id: 'feast_momentum',
    name: 'Feast Momentum',
    desc: 'The first communal feast each day grants +2 devotion party-wide.',
  },
  cosmic_satiety: {
    id: 'cosmic_satiety',
    name: 'Cosmic Satiety',
    desc: 'Converting a cosmic foe grants +25 AP once per rest.',
  },
  wheel_splinter: {
    id: 'wheel_splinter',
    name: 'Wheel Splinter',
    desc: 'Permanently ignore one region connection gate.',
  },
};

export const PRESTIGE_TALENT_LIST = Object.values(PRESTIGE_TALENTS);

function ensurePrestigeState(game) {
  game.worldFlags = game.worldFlags ?? {};
  if (!Array.isArray(game.worldFlags.prestige_talents)) {
    game.worldFlags.prestige_talents = [];
  }
  if (!Array.isArray(game.worldFlags.ending_archive)) {
    game.worldFlags.ending_archive = [];
  }
  game.player = game.player ?? {};
  game.player.restFlags = game.player.restFlags ?? {};
}

export function isPrestigeUnlocked(game) {
  return Boolean(game?.worldFlags?.main_act3_complete);
}

export function countScalingQuestsComplete(game) {
  const completed = game?.quests?.completed ?? [];
  return SCALING_SIDE_QUESTS.filter((id) => completed.includes(id)).length;
}

export function countMilestonesComplete(game) {
  const flags = game?.player?.storyFlags ?? {};
  return COMPANION_MILESTONE_DEFS.filter((def) => flags[`${def.companionId}_t${def.tier}_complete`]).length;
}

export function getEndingArchive(game) {
  ensurePrestigeState(game);
  return [...game.worldFlags.ending_archive];
}

/** Record an ending archetype into the archive (idempotent). */
export function recordEndingArchive(game, archetype) {
  if (!archetype) return;
  ensurePrestigeState(game);
  const archive = game.worldFlags.ending_archive;
  if (!archive.includes(archetype)) {
    archive.push(archetype);
    game.worldFlags[`ending_archive_${archetype}`] = true;
  }
}

export function getPrestigeProgress(game) {
  const scaling = countScalingQuestsComplete(game);
  const milestones = countMilestonesComplete(game);
  const archive = getEndingArchive(game).length;
  return {
    scaling,
    scalingMax: SCALING_SIDE_QUESTS.length,
    milestones,
    milestonesMax: COMPANION_MILESTONE_DEFS.length,
    archive,
    archiveTarget: 3,
    rank: calculatePrestigeRank(game),
    talents: getPrestigeTalents(game),
    talentsChosen: getPrestigeTalents(game).length,
    talentsAvailable: Math.max(0, calculatePrestigeRank(game) - getPrestigeTalents(game).length),
  };
}

/** Rank 1 on Act III crown; +2 from scaling, +2 from milestones, +1 from archive depth. */
export function calculatePrestigeRank(game) {
  if (!isPrestigeUnlocked(game)) return 0;

  let rank = 1;
  const scaling = countScalingQuestsComplete(game);
  const milestones = countMilestonesComplete(game);
  const archive = getEndingArchive(game).length;

  if (scaling >= 5) rank += 1;
  if (scaling >= 10) rank += 1;
  if (milestones >= 12) rank += 1;
  if (milestones >= 24) rank += 1;
  if (archive >= 3) rank += 1;

  return Math.min(5, rank);
}

export function getPrestigeRank(game) {
  return game?.worldFlags?.prestige_rank ?? 0;
}

export function getPrestigeTalents(game) {
  ensurePrestigeState(game);
  return [...game.worldFlags.prestige_talents];
}

export function hasPrestigeTalent(game, talentId) {
  return getPrestigeTalents(game).includes(talentId);
}

export function getWheelSplinterGateId(game) {
  return game?.worldFlags?.prestige_wheel_splinter_gate ?? null;
}

export function isGateIgnoredByPrestige(game, gateId) {
  if (!gateId || !hasPrestigeTalent(game, 'wheel_splinter')) return false;
  return getWheelSplinterGateId(game) === gateId;
}

export function getAvailablePrestigeTalents(game) {
  const chosen = new Set(getPrestigeTalents(game));
  return PRESTIGE_TALENT_LIST.filter((t) => !chosen.has(t.id));
}

export function getWheelSplinterOptions() {
  return CONNECTION_GATES.map((gate) => ({
    id: gate.id,
    label: `${gate.from.replace(/_/g, ' ')} → ${gate.to.replace(/_/g, ' ')}`,
    from: gate.from,
    to: gate.to,
  }));
}

/**
 * Apply a prestige talent pick. Returns { ok, message }.
 */
export function applyPrestigeTalentPick(game, talentId, opts = {}) {
  ensurePrestigeState(game);
  const progress = getPrestigeProgress(game);
  if (progress.talentsAvailable <= 0) {
    return { ok: false, message: 'No prestige talent picks remain.' };
  }

  const talent = PRESTIGE_TALENTS[talentId];
  if (!talent) return { ok: false, message: 'Unknown prestige talent.' };
  if (hasPrestigeTalent(game, talentId)) {
    return { ok: false, message: 'You already claimed that talent.' };
  }

  if (talentId === 'wheel_splinter') {
    const gateId = opts.gateId;
    const valid = getWheelSplinterOptions().some((g) => g.id === gateId);
    if (!valid) return { ok: false, message: 'Choose which gate the Wheel Splinter ignores.' };
    game.worldFlags.prestige_wheel_splinter_gate = gateId;
  }

  game.worldFlags.prestige_talents.push(talentId);
  const message = renderPrestigeTalentPick(game, talentId, opts);
  return { ok: true, message, talentId };
}

/**
 * Recompute rank after quest/milestone/archive changes.
 * @returns {{ rankUp?: boolean, oldRank: number, newRank: number, message?: string, pickPending?: boolean }}
 */
export function syncPrestigeRank(game) {
  ensurePrestigeState(game);
  if (!isPrestigeUnlocked(game)) {
    return { oldRank: 0, newRank: 0 };
  }

  const oldRank = game.worldFlags.prestige_rank ?? 0;
  const newRank = calculatePrestigeRank(game);
  game.worldFlags.prestige_rank = newRank;

  const talentsChosen = getPrestigeTalents(game).length;
  const pickPending = newRank > talentsChosen;

  if (newRank > oldRank) {
    const message = renderPrestigeRankUp(game, newRank, oldRank);
    return { rankUp: true, oldRank, newRank, message, pickPending };
  }

  return { oldRank, newRank, pickPending };
}

/** First feast of the day — +2 devotion party-wide (feast_momentum). */
export function applyFeastMomentum(game) {
  if (!hasPrestigeTalent(game, 'feast_momentum')) return null;

  const day = game.day ?? 1;
  if (game.worldFlags.prestige_feast_momentum_day === day) return null;

  game.worldFlags.prestige_feast_momentum_day = day;
  const messages = awardPartyDevotion(game, 2, 'feast_momentum');
  if (!messages.length) return null;
  return `★ Feast Momentum — ${messages.join(' · ')}`;
}

/** Cosmic conversion AP bonus once per rest (cosmic_satiety). */
export function applyCosmicSatiety(game, combat) {
  if (!hasPrestigeTalent(game, 'cosmic_satiety')) return null;
  if (combat?.victory !== 'converted') return null;

  const hasCosmic = (combat.enemies ?? []).some((e) => isCosmicThreat(e));
  if (!hasCosmic) return null;

  ensurePrestigeState(game);
  if (game.player.restFlags.prestige_cosmic_satiety_used) return null;

  game.player.restFlags.prestige_cosmic_satiety_used = true;
  addAbundancePoints(game, 25);
  return '★ Cosmic Satiety — converting the impossible leaves you +25 AP fuller.';
}

export function resetCosmicSatietyOnRest(character) {
  if (!character?.restFlags) return;
  character.restFlags.prestige_cosmic_satiety_used = false;
}
