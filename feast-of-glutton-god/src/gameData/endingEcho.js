/**
 * Ending Echo — post-Act III world mutations keyed to which apotheosis path you walked.
 * Phase 9a: stamp archetype on main_act3_complete, apply passive modifiers.
 */
import { GORGARA_MANIFEST_SPELLS } from './worldTransformation.js';
import { isCosmicThreat } from './enemies.js';
import { addCorruption } from './corruption.js';
import {
  renderEndingEchoStamp,
  renderEndingEchoArrival,
} from '../textEngine/scenes/endings/index.js';

export const ENDING_ARCHETYPE_LABELS = {
  conversion_ending: 'The Conversion Crown',
  right_hand_ending: 'Right Hand of the Fat Goddess',
  co_ascendant_ending: 'Co-Ascendant',
  devouring_ending: 'The Devouring Crown',
  default_ending: 'The Crowned Feast',
};

function hasFlag(game, flag) {
  if (!flag) return false;
  if (game.worldFlags?.[flag]) return true;
  if (game.player?.storyFlags?.[flag]) return true;
  return false;
}

/** Resolve archetype from ending flags (priority: devouring > co-ascendant > right_hand > conversion). */
export function resolveEndingArchetype(game) {
  if (hasFlag(game, 'apotheosis_devouring')) return 'devouring_ending';
  if (hasFlag(game, 'apotheosis_co_ascendant')) return 'co_ascendant_ending';
  if (hasFlag(game, 'apotheosis_right_hand')) return 'right_hand_ending';
  if (hasFlag(game, 'all_companions_apotheosis') && hasFlag(game, 'heartland_unified')) {
    return 'conversion_ending';
  }
  return 'default_ending';
}

export function getEndingArchetype(game) {
  return game?.worldFlags?.ending_archetype ?? null;
}

export function isPostApotheosis(game) {
  return Boolean(game?.worldFlags?.main_act3_complete && getEndingArchetype(game));
}

function applyArchetypeMutations(game, archetype) {
  switch (archetype) {
    case 'conversion_ending':
      game.worldFlags.conversion_depth_cap_bonus = 1;
      break;
    case 'right_hand_ending':
      game.worldFlags.gorgara_manifest_cooldown_halved = true;
      break;
    case 'co_ascendant_ending':
      game.worldFlags.patron_shared_vitality = true;
      break;
    case 'devouring_ending':
      game.worldFlags.cosmic_corruption_echo = true;
      break;
    default:
      break;
  }
  game.worldFlags[`ending_echo_${archetype}`] = true;
}

/**
 * Stamp ending archetype when Act III completes. Idempotent.
 * @returns {{ archetype: string, message?: string, newlyStamped?: boolean } | null}
 */
export function stampEndingEchoIfNeeded(game) {
  if (!game?.worldFlags?.main_act3_complete) return null;

  const existing = getEndingArchetype(game);
  if (existing) {
    return { archetype: existing, alreadyStamped: true };
  }

  const archetype = resolveEndingArchetype(game);
  game.worldFlags.ending_archetype = archetype;
  applyArchetypeMutations(game, archetype);

  const message = renderEndingEchoStamp(game, archetype);
  return { archetype, message, newlyStamped: true };
}

/** +1 effective transform depth cap for conversion ending. */
export function getEndingTransformBonus(game) {
  if (!isPostApotheosis(game)) return 0;
  if (getEndingArchetype(game) === 'conversion_ending') {
    return game.worldFlags?.conversion_depth_cap_bonus ?? 1;
  }
  return 0;
}

/** Halve manifest spell AP costs for right-hand ending. */
export function getManifestApCostMultiplier(game, spellId) {
  if (!spellId || !GORGARA_MANIFEST_SPELLS.has(spellId)) return 1;
  if (!isPostApotheosis(game)) return 1;
  if (getEndingArchetype(game) === 'right_hand_ending') return 0.5;
  return 1;
}

export function getEffectiveSpellApCost(game, spellId, baseAp) {
  const ap = baseAp ?? 0;
  if (ap <= 0) return 0;
  return Math.max(1, Math.floor(ap * getManifestApCostMultiplier(game, spellId)));
}

/** Divine attention gain modifier by ending path. */
export function getEndingAttentionMultiplier(game) {
  if (!isPostApotheosis(game)) return 1;
  switch (getEndingArchetype(game)) {
    case 'devouring_ending': return 1.2;
    case 'conversion_ending': return 0.85;
    default: return 1;
  }
}

/** Combat-start mutations: shared HP pool, cosmic corruption seed. */
export function applyEndingEchoCombatStart(game, combat) {
  const archetype = getEndingArchetype(game);
  if (!archetype || !combat) return;

  if (archetype === 'co_ascendant_ending') {
    const player = combat.allies?.find((a) => a.isPlayer);
    if (player) {
      const base = player.maxHp ?? 30;
      const bonus = Math.max(4, Math.floor(base * 0.25));
      player.maxHp = base + bonus;
      player.hp = Math.min((player.hp ?? base) + bonus, player.maxHp);
      combat.log.push('★ Co-Ascendant echo — you and your patron share one overflowing life-pool.');
    }
  }

  if (archetype === 'devouring_ending') {
    let seeded = false;
    for (const enemy of combat.enemies ?? []) {
      const typeId = enemy.typeId || enemy.type || enemy.id;
      if (!isCosmicThreat(typeId)) continue;
      const before = enemy.corruption ?? 0;
      enemy.corruption = Math.max(before, 34);
      if (before < 34) addCorruption(enemy, 10);
      seeded = true;
    }
    if (seeded) {
      combat.log.push('★ Devouring echo — cosmic foes arrive already softened, already afraid.');
    }
  }
}

export function getEndingEchoArrivalLine(game, regionId) {
  if (!isPostApotheosis(game)) return '';
  return renderEndingEchoArrival(game, regionId);
}
