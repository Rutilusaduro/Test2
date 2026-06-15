/**
 * Living World Digest — weekly continent bulletins (Phase 9d).
 * Three events per in-game week, keyed to worldFlags and transform depth.
 */
import { getRegionTransformation } from './worldTransformation.js';
import { REGIONS } from './regions.js';
import { renderDigestBullet, renderDigestHeader } from '../textEngine/scenes/digest/index.js';

export const DIGEST_INTERVAL = 7;

/** Digest topic ids — matched against pool `when: { digestTopic }`. */
export const DIGEST_TOPICS = [
  { id: 'ember_belts', flag: 'tarn_converted', regionId: 'ember_duchy', minTransform: 2 },
  { id: 'verity_appeal', flag: 'main_act1_complete' },
  { id: 'greta_order', flag: 'korthak_respect' },
  { id: 'sylwen_harvest', flag: 'sylwen_converted', regionId: 'fertile_heartlands', minTransform: 2 },
  { id: 'lumen_index', flag: 'lumen_converted' },
  { id: 'church_crackdown', flag: 'main_act2_complete' },
  { id: 'heartland_feast', flag: 'heartland_unified' },
  { id: 'lyra_rivalry', flag: 'duel_of_curves_complete' },
  { id: 'lyra_ascended', flag: 'lyra_last_duel_complete' },
  { id: 'cosmic_attention', flag: 'main_act3_complete' },
  { id: 'companion_apotheosis', flag: 'all_companions_apotheosis' },
  { id: 'blooming_war', flag: 'blooming_war_complete' },
  { id: 'prestige_pilgrim', minPrestige: 2 },
  { id: 'eternal_hall', flag: 'eternal_hall_unlocked' },
  { id: 'coast_velvet', regionId: 'sapphire_coast', minTransform: 3 },
  { id: 'citadel_bend', regionId: 'gilded_citadel', minTransform: 4 },
  { id: 'cradle_bloom', regionId: 'gorgara_cradle', minTransform: 3 },
  { id: 'marches_forge', regionId: 'northern_marches', minTransform: 2 },
  { id: 'market_abundance', regionId: 'market_square', minTransform: 3 },
  { id: 'barrow_whispers', flag: 'barrow_deeps_explored' },
  { id: 'vestibule_illegal', flag: 'vestibule_crossed' },
  { id: 'dream_echo', flag: 'dream_echo_faced' },
  { id: 'wheel_incarnate', flag: 'defeated_wheel_incarnate' },
  { id: 'guild_audit', flag: 'tarn_neutral_pact' },
  { id: 'inn_shrine', minFeasts: 3 },
  { id: 'seasonal_harvest', seasonal: 'event_harvest_inversion' },
  { id: 'seasonal_dream', seasonal: 'event_dream_feast' },
  { id: 'pilgrimage_legend', minPilgrimage: 2 },
  { id: 'legacy_abundance', minLegacy: 5 },
  { id: 'generic_abundance' },
];

function countFeasts(game) {
  let n = 0;
  const wf = game.worldFlags ?? {};
  if (wf.communal_feast_done) n += 1;
  if (wf.communal_feast_held) n += 1;
  for (const key of Object.keys(wf)) {
    if (key.startsWith('feast_held_') && wf[key]) n += 1;
  }
  return n;
}

function hasFlag(game, flag) {
  if (!flag) return true;
  return Boolean(game.worldFlags?.[flag] ?? game.player?.storyFlags?.[flag]);
}

function regionTransformLevel(game, regionId) {
  if (!regionId) return 0;
  return getRegionTransformation(game, regionId).level.level ?? 0;
}

export function getDigestWeek(game) {
  return Math.floor(((game?.day ?? 1) - 1) / DIGEST_INTERVAL);
}

export function getEligibleDigestTopics(game) {
  const wf = game.worldFlags ?? {};
  const prestige = wf.prestige_rank ?? 0;
  const legacy = game.pilgrimageMeta?.legacyAbundance ?? wf.legacy_abundance ?? 0;
  const pilgrimage = game.pilgrimageMeta?.pilgrimageCount ?? wf.pilgrimage_count ?? 0;
  const seasonal = wf.seasonal_event_active ?? null;
  const feasts = countFeasts(game);

  const eligible = [];
  for (const topic of DIGEST_TOPICS) {
    if (topic.flag && !hasFlag(game, topic.flag)) continue;
    if (topic.minPrestige != null && prestige < topic.minPrestige) continue;
    if (topic.minLegacy != null && legacy < topic.minLegacy) continue;
    if (topic.minPilgrimage != null && pilgrimage < topic.minPilgrimage) continue;
    if (topic.minFeasts != null && feasts < topic.minFeasts) continue;
    if (topic.minTransform != null && regionTransformLevel(game, topic.regionId) < topic.minTransform) continue;
    if (topic.seasonal && topic.seasonal !== seasonal) continue;
    eligible.push(topic.id);
  }

  if (!eligible.includes('generic_abundance')) {
    eligible.push('generic_abundance');
  }
  return eligible;
}

function seededPick(list, seed) {
  const arr = [...list];
  const picks = [];
  let s = seed;
  while (arr.length && picks.length < 3) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % arr.length;
    picks.push(arr.splice(idx, 1)[0]);
  }
  return picks;
}

export function generateWeeklyDigest(game, opts = {}) {
  const week = getDigestWeek(game);
  const lastWeek = game.worldFlags?.digest_week ?? -1;
  if (!opts.force && week <= lastWeek) {
    return game.worldFlags?.last_digest ?? null;
  }

  const eligible = getEligibleDigestTopics(game);
  const topics = seededPick(eligible, week * 997 + (game.day ?? 1));
  const bullets = topics.map((topic, i) => renderDigestBullet(game, topic, {
    seed: week * 100 + i,
  }));

  const header = renderDigestHeader(game, week + 1, { seed: week });
  const digest = {
    week,
    day: game.day ?? 1,
    header,
    bullets,
    topics,
  };

  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.digest_week = week;
  game.worldFlags.last_digest = digest;
  if (!Array.isArray(game.worldFlags.digest_archive)) {
    game.worldFlags.digest_archive = [];
  }
  game.worldFlags.digest_archive.push({
    week,
    day: game.day,
    topics,
  });

  return digest;
}

export function tickWeeklyDigest(game) {
  const week = getDigestWeek(game);
  const lastWeek = game.worldFlags?.digest_week ?? -1;
  if (week <= lastWeek) return null;
  return generateWeeklyDigest(game);
}

export function getLatestDigest(game) {
  return game.worldFlags?.last_digest ?? null;
}

export function formatDigest(digest) {
  if (!digest) return '';
  const lines = [digest.header, ...digest.bullets.map((b) => `• ${b}`)];
  return lines.join('\n\n');
}
