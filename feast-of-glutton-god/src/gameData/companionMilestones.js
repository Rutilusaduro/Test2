/**
 * Companion arc milestones — tiers 1–4 per companion (Part 9).
 * Fires narrative scenes + devotion +20 when gates are met.
 */
import { COMPANIONS } from './companions.js';
import { ensureCompanionDevotion, awardCompanionDevotion } from './companionDevotion.js';
import { renderCompanionMilestone } from '../textEngine/scenes/companion/index.js';

export const COMPANION_MILESTONE_DEFS = [
  // ── Mira ──────────────────────────────────────────────────────
  { id: 'mira_t1_first_performance', companionId: 'mira', tier: 1, title: 'The Wrong Hymn', minLevel: 3, minRelationship: 30 },
  { id: 'mira_t2_banned_songs', companionId: 'mira', tier: 2, title: 'Songs the Church Won\'t Sing', minLevel: 7, flags: ['lean_saint_defeated'] },
  { id: 'mira_t3_voice_goddess', companionId: 'mira', tier: 3, title: 'The Voice Between the Notes', minLevel: 13, minDevotion: 50 },
  { id: 'mira_t4_song_without_end', companionId: 'mira', tier: 4, title: 'The Infinite Set', minLevel: 19, flags: ['gorgara_origin_revealed'] },

  // ── Lira ──────────────────────────────────────────────────────
  { id: 'lira_t1_torn_covenant', companionId: 'lira', tier: 1, title: 'Prayer Gone Wrong', minLevel: 3, minRelationship: 30 },
  { id: 'lira_t2_second_gospel', companionId: 'lira', tier: 2, title: 'The Heretical Ordination', minLevel: 8, flags: ['temple_bloomed'] },
  { id: 'lira_t3_priestess', companionId: 'lira', tier: 3, title: 'Ordained by Hunger', minLevel: 14, minDevotion: 75 },
  { id: 'lira_t4_living_altar', companionId: 'lira', tier: 4, title: 'She Who Holds the Door', minLevel: 19, requireAllTier3: true },

  // ── Sylvie ────────────────────────────────────────────────────
  { id: 'sylvie_t1_equations_change', companionId: 'sylvie', tier: 1, title: 'Caloric Cosmology', minLevel: 4, minRelationship: 30 },
  { id: 'sylvie_t2_expelled', companionId: 'sylvie', tier: 2, title: 'Banned from the Index', minLevel: 9, flags: ['lumen_apostate_complete'] },
  { id: 'sylvie_t3_anomaly_architect', companionId: 'sylvie', tier: 3, title: 'A New Mathematics', minLevel: 14, minDevotion: 50 },
  { id: 'sylvie_t4_beyond_wheel', companionId: 'sylvie', tier: 4, title: 'The 7th Domain', minLevel: 19, flags: ['gorgara_origin_revealed'] },

  // ── Thalia ────────────────────────────────────────────────────
  { id: 'thalia_t1_pact_acknowledged', companionId: 'thalia', tier: 1, title: 'The First True Word', minLevel: 4, minRelationship: 40 },
  { id: 'thalia_t2_guild_war', companionId: 'thalia', tier: 2, title: 'The Tarn Guild\'s Mistake', minLevel: 9, flags: ['tarn_neutral_pact'] },
  { id: 'thalia_t3_herald', companionId: 'thalia', tier: 3, title: 'Named Herald', minLevel: 14, minDevotion: 75 },
  { id: 'thalia_t4_pact_fulfilled', companionId: 'thalia', tier: 4, title: 'The Pact Was Always Eternal', minLevel: 19, flags: ['gorgara_manifest'] },

  // ── Greta ─────────────────────────────────────────────────────
  { id: 'greta_t1_forge_trial', companionId: 'greta', tier: 1, title: 'The New Forge Trial', minLevel: 4, minRelationship: 30 },
  { id: 'greta_t2_korthak_rebuke', companionId: 'greta', tier: 2, title: 'Stripped of the Saint\'s Blessing', minLevel: 8, flags: ['main_act2_complete'] },
  { id: 'greta_t3_warrior_gospel', companionId: 'greta', tier: 3, title: 'Iron That Grows', minLevel: 14, flags: ['korthak_respect'] },
  { id: 'greta_t4_iron_soft', companionId: 'greta', tier: 4, title: 'The Final Forge', minLevel: 19, flags: ['korthak_titan_converted'] },

  // ── Elara ─────────────────────────────────────────────────────
  { id: 'elara_t1_inn_as_temple', companionId: 'elara', tier: 1, title: 'The Inn That Became a Shrine', minLevel: 3, minRelationship: 30 },
  { id: 'elara_t2_holy_order', companionId: 'elara', tier: 2, title: 'The Order of the Open Table', minLevel: 7, minFeastsHeld: 2 },
  { id: 'elara_t3_divine_mandate', companionId: 'elara', tier: 3, title: 'The Mandate of the Overflowing Cup', minLevel: 13, minDevotion: 75 },
  { id: 'elara_t4_mother_new_age', companionId: 'elara', tier: 4, title: 'The Mother of What Comes Next', minLevel: 19, requireAllTier3: true },
];

function hasFlag(game, flag) {
  if (game.worldFlags?.[flag]) return true;
  if (game.player?.storyFlags?.[flag]) return true;
  return false;
}

function milestoneComplete(game, def) {
  return Boolean(game.player?.storyFlags?.[`${def.companionId}_t${def.tier}_complete`]);
}

function countFeastsHeld(game) {
  let n = 0;
  if (game.worldFlags?.communal_feast_held) n += 1;
  if (game.worldFlags?.communal_feast_done) n += 1;
  for (const key of Object.keys(game.worldFlags ?? {})) {
    if (key.startsWith('feast_held_') && game.worldFlags[key]) n += 1;
  }
  return n;
}

function allOtherCompanionsTier3Complete(game, companionId) {
  const others = COMPANIONS.filter((c) => c.id !== companionId);
  return others.every((c) => {
    const recruited = (game.party ?? []).some((p) => p.id === c.id);
    if (!recruited) return true;
    return game.player?.storyFlags?.[`${c.id}_t3_complete`];
  });
}

function getCompanionInParty(game, companionId) {
  return (game.party ?? []).find((c) => c.id === companionId) ?? null;
}

export function meetsMilestoneGates(game, def) {
  const companion = getCompanionInParty(game, def.companionId);
  if (!companion) return false;

  const level = game.player?.level ?? 1;
  if (def.minLevel && level < def.minLevel) return false;

  if (def.minRelationship != null && (companion.relationship ?? 0) < def.minRelationship) return false;

  if (def.minDevotion != null && ensureCompanionDevotion(companion) < def.minDevotion) return false;

  for (const flag of def.flags ?? []) {
    if (!hasFlag(game, flag)) return false;
  }

  if (def.minFeastsHeld != null && countFeastsHeld(game) < def.minFeastsHeld) return false;

  if (def.requireAllTier3 && !allOtherCompanionsTier3Complete(game, def.companionId)) return false;

  return true;
}

function markMilestoneComplete(game, def) {
  game.player.storyFlags = game.player.storyFlags || {};
  game.player.storyFlags[`${def.companionId}_t${def.tier}_complete`] = true;
  game.player.storyFlags[def.id] = true;
  if (def.tier === 4) {
    game.player.storyFlags[`${def.companionId}_apotheosis_complete`] = true;
  }
}

/**
 * Check and fire any newly eligible companion milestones.
 * @returns {{ id: string, title: string, message: string, devotionGained: number }[]}
 */
export function checkCompanionMilestones(game) {
  if (!game?.party?.length) return [];

  const fired = [];
  for (const def of COMPANION_MILESTONE_DEFS) {
    if (milestoneComplete(game, def)) continue;
    if (!meetsMilestoneGates(game, def)) continue;

    const companion = getCompanionInParty(game, def.companionId);
    const message = renderCompanionMilestone(game, def.companionId, def.tier, companion, {
      milestoneId: def.id,
      title: def.title,
    });
    const devotionGained = awardCompanionDevotion(companion, 20, 'milestone');
    markMilestoneComplete(game, def);

    fired.push({
      id: def.id,
      title: def.title,
      companionId: def.companionId,
      tier: def.tier,
      message: devotionGained > 0
        ? `${message}\n\n★ ${companion.name} devotion +${devotionGained} (${companion.devotion}/100)`
        : message,
      devotionGained,
    });
  }
  return fired;
}

export function formatCompanionMilestoneMessages(fired = []) {
  return fired.map((f) => f.message).filter(Boolean).join('\n\n---\n\n');
}
