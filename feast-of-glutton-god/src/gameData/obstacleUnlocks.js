/**
 * Multi-solution obstacle unlocks — any satisfied path clears gates & puzzles.
 */
import { getStage } from './stages.js';
import { getRegionTransformation } from './worldTransformation.js';
import { getAbundanceSpread } from './abundanceSpread.js';
import { getNpcState } from './player.js';
import { findNpc, getNpcsInRegion } from './npcs.js';
import { getTier } from './relationships.js';
import { getSpell, getSpellEnvironmentTags } from './spells.js';
import { getLandmarksInRegion, getLivingLandmarkCount } from './worldReactivity.js';
import { getPuzzleDefinition } from './puzzles/registry.js';

function isPuzzleSolvedById(game, puzzleId) {
  const def = getPuzzleDefinition(puzzleId);
  if (!def) return false;
  return Boolean(game.worldFlags?.[def.stateFlag]);
}

export const UNLOCK_METHOD = {
  PUZZLE_SOLVED: 'puzzle_solved',
  PLAYER_SIZE_MIN: 'player_size_min',
  NPC_STAGE_MIN: 'feed_npc_to_stage',
  NPC_RELATIONSHIP_MIN: 'persuade',
  PLACE_GIANT: 'place_giant',
  BLESS_REGION: 'bless_region',
  ABUNDANCE_MIN: 'abundance_min',
  CAST_SPELL: 'cast_spell',
  COMBAT: 'combat',
  FLAG_SET: 'flag_set',
  COMMUNAL_FEAST: 'communal_feast',
  SKILL_SUCCESS: 'skill_check',
};

/** Parse `cast_spell:soften` shorthand into structured unlock. */
export function normalizeUnlock(entry) {
  if (typeof entry === 'string') {
    if (entry.startsWith('cast_spell:')) {
      return { method: UNLOCK_METHOD.CAST_SPELL, tags: [entry.split(':')[1]] };
    }
    return { method: entry };
  }
  return entry;
}

function getNpcStage(game, npcId) {
  const template = findNpc(npcId, game);
  if (!template) {
    const companion = (game.party ?? []).find((c) => c.id === npcId || c.companionId === npcId);
    if (companion) return getStage(companion.lbs).id;
    return 0;
  }
  return getStage(getNpcState(game, template).lbs).id;
}

function getNpcRelationshipTier(game, npcId) {
  const template = findNpc(npcId, game);
  if (template) return getTier(getNpcState(game, template).relationship || 0).id;
  const companion = (game.party ?? []).find((c) => c.id === npcId);
  if (companion) return getTier(companion.relationship || 0).id;
  return 0;
}

/**
 * @param {object} game
 * @param {object} unlock normalized unlock entry
 * @param {object} context optional { spellId, regionId, recentSkillSuccess }
 */
export function isUnlockSatisfied(game, rawUnlock, context = {}) {
  const unlock = normalizeUnlock(rawUnlock);
  const flags = game.worldFlags ?? {};
  const regionId = unlock.regionId ?? context.regionId ?? game.region;

  switch (unlock.method) {
    case UNLOCK_METHOD.PUZZLE_SOLVED:
      return isPuzzleSolvedById(game, unlock.puzzleId);

    case UNLOCK_METHOD.PLAYER_SIZE_MIN:
      return getStage(game.player?.lbs ?? 0).id >= (unlock.stage ?? 1);

    case UNLOCK_METHOD.NPC_STAGE_MIN:
    case 'feed_npc_to_stage':
      return getNpcStage(game, unlock.npcId) >= (unlock.stage ?? 1);

    case UNLOCK_METHOD.NPC_RELATIONSHIP_MIN:
    case 'persuade':
      return getNpcRelationshipTier(game, unlock.npcId) >= (unlock.tier ?? 2);

    case UNLOCK_METHOD.PLACE_GIANT: {
      const landmarks = getLandmarksInRegion(game, regionId);
      const minStage = unlock.minStage ?? unlock.stage ?? 11;
      const who = unlock.characterId;
      return landmarks.some((l) => {
        if (who && l.characterId !== who) return false;
        return l.stage >= minStage;
      });
    }

    case UNLOCK_METHOD.BLESS_REGION: {
      const transform = getRegionTransformation(game, regionId);
      if (unlock.transformationMin != null) {
        return transform.level.level >= unlock.transformationMin;
      }
      if (unlock.abundanceMin != null) {
        return getAbundanceSpread(game) >= unlock.abundanceMin;
      }
      return transform.points >= (unlock.points ?? 15);
    }

    case UNLOCK_METHOD.ABUNDANCE_MIN:
      return getAbundanceSpread(game) >= (unlock.points ?? 50);

    case UNLOCK_METHOD.CAST_SPELL: {
      const spellId = context.spellId ?? unlock.spellId;
      if (!spellId) return Boolean(flags[`spell_unlock_${unlock.id}`]);
      const spell = getSpell(spellId);
      const tags = getSpellEnvironmentTags(spell);
      const need = unlock.tags ?? [];
      if (!need.length) return Boolean(spell);
      return need.some((t) => tags.includes(t));
    }

    case UNLOCK_METHOD.COMBAT: {
      const enemyId = unlock.enemyId;
      if (!enemyId) return false;
      return Boolean(flags[`defeated_${enemyId}`] || flags[`combat_won_${enemyId}`]);
    }

    case UNLOCK_METHOD.FLAG_SET:
      return Boolean(flags[unlock.flag] ?? game.player?.storyFlags?.[unlock.flag]);

    case UNLOCK_METHOD.COMMUNAL_FEAST:
      return Boolean(flags[`feast_held_${regionId}`] || flags.communal_feast_done);

    case UNLOCK_METHOD.SKILL_SUCCESS:
      return Boolean(flags[`skill_success_${unlock.skillId}_${unlock.id ?? regionId}`]);

    default:
      return false;
  }
}

export function getSatisfiedUnlocks(game, unlocks = [], context = {}) {
  return unlocks.filter((u) => isUnlockSatisfied(game, u, context));
}

export function isAnyUnlockSatisfied(game, unlocks = [], context = {}) {
  if (!unlocks?.length) return false;
  return getSatisfiedUnlocks(game, unlocks, context).length > 0;
}

export function recordSpellUnlock(game, unlockId, spellId) {
  if (!game.worldFlags) game.worldFlags = {};
  game.worldFlags[`spell_unlock_${unlockId}`] = spellId;
}

export function recordCombatVictory(game, enemyId) {
  if (!game.worldFlags) game.worldFlags = {};
  game.worldFlags[`defeated_${enemyId}`] = true;
}

export function recordSkillUnlock(game, skillId, unlockId) {
  if (!game.worldFlags) game.worldFlags = {};
  game.worldFlags[`skill_success_${skillId}_${unlockId}`] = true;
}

export function tryClearObstacle(game, obstacle, context = {}) {
  if (!obstacle?.unlocks?.length) return null;
  if (obstacle.solvedFlag && game.worldFlags?.[obstacle.solvedFlag]) return null;
  const satisfied = getSatisfiedUnlocks(game, obstacle.unlocks, context);
  if (!satisfied.length) return null;

  game.worldFlags = game.worldFlags ?? {};
  if (obstacle.solvedFlag) {
    game.worldFlags[obstacle.solvedFlag] = true;
  }
  if (obstacle.puzzleId) {
    const def = getPuzzleDefinition(obstacle.puzzleId);
    if (def?.stateFlag) game.worldFlags[def.stateFlag] = true;
  }

  return {
    method: satisfied[0].method ?? satisfied[0],
    label: satisfied[0].label ?? obstacle.id,
    message: obstacle.clearMessage ?? null,
  };
}

export function syncAllObstacleUnlocks(game, context = {}) {
  const results = [];
  // Gates synced via regionObstacles.syncGateUnlocks
  return results;
}

export function describeUnlockOptions(unlocks = []) {
  return unlocks.map((u) => {
    const n = normalizeUnlock(u);
    switch (n.method) {
      case UNLOCK_METHOD.PLAYER_SIZE_MIN:
        return `Grow to stage ${n.stage}+`;
      case UNLOCK_METHOD.PLACE_GIANT:
        return `Place a stage-${n.minStage ?? n.stage ?? 11}+ landmark here`;
      case UNLOCK_METHOD.NPC_STAGE_MIN:
      case 'feed_npc_to_stage':
        return `Grow ${n.npcId ?? 'an ally'} to stage ${n.stage}+`;
      case UNLOCK_METHOD.CAST_SPELL:
        return `Cast ${(n.tags ?? []).join('/')} magic on the obstacle`;
      case UNLOCK_METHOD.COMBAT:
        return `Defeat ${n.enemyId ?? 'the guardian'}`;
      case UNLOCK_METHOD.BLESS_REGION:
        return `Bless the region with abundance`;
      default:
        return n.label ?? n.method;
    }
  });
}
