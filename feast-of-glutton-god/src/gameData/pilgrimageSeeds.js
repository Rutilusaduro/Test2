/**
 * Pilgrimage Seeds — roguelite meta carry-over (Phase 10a).
 */
import { createCompanionData, COMPANIONS } from './companions.js';
import { COMPANION_MILESTONE_DEFS } from './companionMilestones.js';
import { learnSpell } from './spellLearning.js';
import { TRANSFORMATION_LEVELS } from './worldTransformation.js';

export const SEED_TYPES = {
  companion_echo: {
    id: 'companion_echo',
    name: 'Companion Echo',
    desc: 'One companion starts recruited with tier-1 milestone complete.',
  },
  region_memory: {
    id: 'region_memory',
    name: 'Region Memory',
    desc: 'One region starts at transformation level 2 (Softening).',
  },
  spell_remnant: {
    id: 'spell_remnant',
    name: 'Spell Remnant',
    desc: 'One spell from your previous run at level 1 potency.',
  },
};

export const SEED_LIST = Object.values(SEED_TYPES);

/** Seeds earned from prestige rank on pilgrimage end. */
export function getSeedsEarnedFromRank(prestigeRank = 0) {
  if (prestigeRank >= 5) return 3;
  if (prestigeRank >= 3) return 2;
  if (prestigeRank >= 2) return 1;
  return 0;
}

export function getAvailableSeedsForPilgrimage(meta = {}, game = null) {
  const rank = meta.lastPrestigeRank ?? game?.worldFlags?.prestige_rank ?? 0;
  const earned = getSeedsEarnedFromRank(rank);
  const carried = meta.pendingSeeds ?? [];
  return Math.max(earned, carried.length);
}

export function getCompanionEchoOptions(game) {
  const recruited = new Set((game?.party ?? []).map((c) => c.id));
  return COMPANIONS.filter((c) => recruited.has(c.id) || game?.player?.storyFlags?.[`${c.id}_recruited`]);
}

export function getSpellRemnantOptions(game) {
  const ids = game?.player?.spellsKnown ?? [];
  return ids.filter(Boolean).slice(0, 12);
}

export function getRegionMemoryOptions() {
  return ['harvest_hearth', 'market_square', 'fertile_heartlands', 'ember_duchy', 'sapphire_coast'];
}

/** Apply chosen seeds to a fresh game. */
export function applyPilgrimageSeeds(game, seedChoices = {}) {
  const { companionId, regionId, spellId } = seedChoices;

  if (companionId) {
    const template = COMPANIONS.find((c) => c.id === companionId);
    if (template && !(game.party ?? []).some((c) => c.id === companionId)) {
      const companion = createCompanionData(template);
      companion.location = game.region;
      game.party = [...(game.party ?? []), companion];
      game.player.storyFlags = game.player.storyFlags ?? {};
      game.player.storyFlags[`${companionId}_t1_complete`] = true;
      const t1 = COMPANION_MILESTONE_DEFS.find((d) => d.companionId === companionId && d.tier === 1);
      if (t1) game.player.storyFlags[t1.id] = true;
    }
  }

  if (regionId) {
    const points = TRANSFORMATION_LEVELS[2]?.minPoints ?? 40;
    game.worldFlags = game.worldFlags ?? {};
    game.worldFlags.regionTransformation = game.worldFlags.regionTransformation ?? {};
    game.worldFlags.regionTransformation[regionId] = {
      points,
      ...(game.worldFlags.regionTransformation[regionId] ?? {}),
    };
  }

  if (spellId && game.player) {
    learnSpell(game.player, spellId);
  }

  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.pilgrimage_seeds_applied = true;
  return game;
}

export function buildSeedChoicesFromPayload(payload = {}) {
  const choices = {};
  for (const pick of payload.seeds ?? []) {
    if (pick.type === 'companion_echo') choices.companionId = pick.companionId;
    if (pick.type === 'region_memory') choices.regionId = pick.regionId;
    if (pick.type === 'spell_remnant') choices.spellId = pick.spellId;
  }
  return choices;
}
