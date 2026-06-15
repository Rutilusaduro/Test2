/**
 * Achievement Liturgy — church-themed completion hooks (Phase 10d).
 * Each unlock grants +1 prestige achievement point (see prestige.js).
 */
import { SCALING_SIDE_QUESTS, syncPrestigeRank } from './prestige.js';
import { COMPANION_MILESTONE_DEFS } from './companionMilestones.js';
import { renderAchievementUnlock } from '../textEngine/scenes/achievements/index.js';

export const ACHIEVEMENTS = [
  { id: 'liturgy_first_trivial', title: 'Beatified the Mundane', desc: 'Trivialize your first enemy in combat.', check: (g) => Boolean(g.player?.storyFlags?.first_trivialize) },
  { id: 'liturgy_six_apotheoses', title: 'Six Who Ascended', desc: 'Witness all companion apotheoses.', check: (g) => Boolean(g.worldFlags?.all_companions_apotheosis) },
  { id: 'liturgy_wheel_teeth', title: 'Dental Records of the Wheel', desc: 'Defeat the Wheel Incarnate.', check: (g) => Boolean(g.worldFlags?.defeated_wheel_incarnate) },
  { id: 'liturgy_no_conversion', title: 'Lean Heresy', desc: 'Complete Act III with zero cosmic conversions.', check: (g) => Boolean(g.worldFlags?.main_act3_complete) && (g.worldFlags?.cosmic_conversions ?? 0) === 0 },
  { id: 'liturgy_feast_100', title: 'Centurion of Seconds', desc: 'Hold 100 communal feasts.', check: (g) => (g.worldFlags?.feast_count_total ?? 0) >= 100 },
  { id: 'liturgy_act3_crown', title: 'Crown of the Reach', desc: 'Complete Act III.', check: (g) => Boolean(g.worldFlags?.main_act3_complete) },
  { id: 'liturgy_lean_saint', title: 'Scourge Unlaced', desc: 'Defeat the Lean Saint.', check: (g) => Boolean(g.worldFlags?.lean_saint_defeated) },
  { id: 'liturgy_first_companion', title: 'Second Chair at the Table', desc: 'Recruit a second companion.', check: (g) => (g.party?.length ?? 0) >= 2 },
  { id: 'liturgy_full_party', title: 'Table for Seven', desc: 'Travel with a full companion roster.', check: (g) => (g.party?.length ?? 0) >= 6 },
  { id: 'liturgy_prestige_3', title: 'Third Rank Pilgrim', desc: 'Reach prestige rank 3.', check: (g) => (g.worldFlags?.prestige_rank ?? 0) >= 3 },
  { id: 'liturgy_lyra_fate', title: 'Last Curve Written', desc: 'Complete The Last Duel of Curves.', check: (g) => Boolean(g.player?.storyFlags?.lyra_last_duel_complete) },
  { id: 'liturgy_cosmic_convert', title: 'Cosmic Satiety', desc: 'Convert a cosmic-tier foe.', check: (g) => Boolean(g.worldFlags?.cosmic_conversion_done) },
  { id: 'liturgy_region_transform', title: 'Continent Remade', desc: 'Transform any region to level 5.', check: (g) => Object.values(g.worldFlags?.regionTransformation ?? {}).some((r) => (r?.points ?? 0) >= 220) },
  { id: 'liturgy_heartland_unified', title: 'Heartland Concord', desc: 'Unify the heartlands through feast.', check: (g) => Boolean(g.worldFlags?.heartland_unified) },
  { id: 'liturgy_duel_curves', title: 'Duel of Curves', desc: 'Complete Lyra\'s first duel arc.', check: (g) => Boolean(g.player?.storyFlags?.duel_of_curves_complete) },
  { id: 'liturgy_level_20', title: 'Abundance Ascendant', desc: 'Reach level 20.', check: (g) => (g.player?.level ?? 1) >= 20 },
  { id: 'liturgy_gorgara_manifest', title: 'Patron Manifest', desc: 'Manifest the Fat Goddess in the cradle.', check: (g) => Boolean(g.worldFlags?.gorgara_manifest) },
  { id: 'liturgy_blooming_war', title: 'When Gods Bleed', desc: 'Complete the Blooming War.', check: (g) => Boolean(g.worldFlags?.blooming_war_complete) },
  { id: 'liturgy_dream_echo', title: 'Echo of Excess', desc: 'Face the dream echo.', check: (g) => Boolean(g.player?.storyFlags?.dream_echo_faced) },
  { id: 'liturgy_divine_vestibule', title: 'Illegal Presence', desc: 'Cross the divine threshold.', check: (g) => Boolean(g.worldFlags?.vestibule_crossed) },
  { id: 'liturgy_eternal_hall', title: 'Guest of the Eternal Table', desc: 'Enter the Eternal Feast Hall.', check: (g) => Boolean(g.worldFlags?.eternal_hall_visited) },
  { id: 'liturgy_first_pilgrimage', title: 'Second Pilgrimage', desc: 'Begin a second pilgrimage.', check: (g) => (g.pilgrimageMeta?.pilgrimageCount ?? g.worldFlags?.pilgrimage_count ?? 0) >= 2 },
  { id: 'liturgy_legacy_10', title: 'Legacy of Plenty', desc: 'Reach 10 legacy abundance.', check: (g) => (g.pilgrimageMeta?.legacyAbundance ?? g.worldFlags?.legacy_abundance ?? 0) >= 10 },
  { id: 'liturgy_ending_conversion', title: 'Conversion Crown', desc: 'Earn the conversion ending echo.', check: (g) => g.worldFlags?.ending_archetype === 'conversion_ending' },
  { id: 'liturgy_ending_devouring', title: 'Devouring Crown', desc: 'Earn the devouring ending echo.', check: (g) => g.worldFlags?.ending_archetype === 'devouring_ending' },
  { id: 'liturgy_companion_devotion', title: 'Miracle Surge Witness', desc: 'Raise any companion to 100 devotion.', check: (g) => (g.party ?? []).some((c) => (c.devotion ?? 0) >= 100) },
  { id: 'liturgy_scaling_quests_5', title: 'Half the Ladder', desc: 'Complete 5 scaling side quests.', check: (g) => SCALING_SIDE_QUESTS.filter((id) => (g.quests?.completed ?? []).includes(id)).length >= 5 },
  { id: 'liturgy_scaling_quests_10', title: 'Scaling Saint', desc: 'Complete all scaling side quests.', check: (g) => SCALING_SIDE_QUESTS.every((id) => (g.quests?.completed ?? []).includes(id)) },
  { id: 'liturgy_milestones_12', title: 'Companion Cantor', desc: 'Complete 12 companion milestones.', check: (g) => COMPANION_MILESTONE_DEFS.filter((d) => g.player?.storyFlags?.[`${d.companionId}_t${d.tier}_complete`]).length >= 12 },
  { id: 'liturgy_achievement_hoarder', title: 'Liturgical Hoarder', desc: 'Unlock 15 achievements.', check: (g) => countUnlockedAchievements(g) >= 15, dynamic: true },
  { id: 'liturgy_achievement_saint', title: 'Beatified Completionist', desc: 'Unlock every other achievement.', check: (g) => countUnlockedAchievements(g) >= ACHIEVEMENTS.length - 1, dynamic: true },
];

function ensureAchievementState(game) {
  game.pilgrimageMeta = game.pilgrimageMeta ?? {};
  if (!game.pilgrimageMeta.achievements) {
    game.pilgrimageMeta.achievements = {};
  }
  game.worldFlags = game.worldFlags ?? {};
  if (game.worldFlags.prestige_achievement_points == null) {
    game.worldFlags.prestige_achievement_points = 0;
  }
}

export function isAchievementUnlocked(game, id) {
  ensureAchievementState(game);
  return Boolean(game.pilgrimageMeta.achievements[id] ?? game.worldFlags?.[`achievement_${id}`]);
}

export function countUnlockedAchievements(game) {
  return ACHIEVEMENTS.filter((a) => isAchievementUnlocked(game, a.id)).length;
}

export function getAchievementList(game) {
  return ACHIEVEMENTS.map((def) => ({
    ...def,
    unlocked: isAchievementUnlocked(game, def.id),
  }));
}

/**
 * Check and unlock achievements. Returns newly unlocked entries.
 */
export function checkAchievements(game) {
  ensureAchievementState(game);
  const unlocked = [];

  for (const def of ACHIEVEMENTS) {
    if (isAchievementUnlocked(game, def.id)) continue;
    if (!def.check(game)) continue;

    game.pilgrimageMeta.achievements[def.id] = true;
    game.worldFlags[`achievement_${def.id}`] = true;
    game.worldFlags.prestige_achievement_points = (game.worldFlags.prestige_achievement_points ?? 0) + 1;

    const message = renderAchievementUnlock(game, def.id);
    unlocked.push({ ...def, message });
  }

  if (unlocked.length && game.worldFlags?.main_act3_complete) {
    syncPrestigeRank(game);
  }

  return unlocked;
}

export function recordTrivializeAchievement(game) {
  game.player.storyFlags = game.player.storyFlags ?? {};
  game.player.storyFlags.first_trivialize = true;
  return checkAchievements(game);
}

export function recordFeastForAchievements(game) {
  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.feast_count_total = (game.worldFlags.feast_count_total ?? 0) + 1;
  return checkAchievements(game);
}

export function recordCosmicConversion(game) {
  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.cosmic_conversions = (game.worldFlags.cosmic_conversions ?? 0) + 1;
  game.worldFlags.cosmic_conversion_done = true;
  return checkAchievements(game);
}
