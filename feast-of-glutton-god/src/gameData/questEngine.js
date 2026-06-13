/**
 * Quest engine — unified tracking, advancement, rewards for main & side quests.
 */
import { getQuestDefinition, getAllQuests } from './quests/registry.js';
import { QUEST_TYPE, OBJECTIVE_TYPE, QUEST_SCORE } from './quests/constants.js';
import { getTier } from './relationships.js';
import { getCorruptionTier } from './corruption.js';
import { getStage, advanceStage } from './stages.js';
import { addAbundancePoints } from './player.js';
import { addExperience, XP_SOURCES } from './leveling.js';
import { getNpcState, applyNpcState } from './player.js';
import { findNpc } from './npcs.js';
import { getRegion } from './regions.js';
import { renderGrowthProse } from '../textEngine/scenes/growth/index.js';
import { renderQuestText } from '../textEngine/scenes/quests/index.js';

const DEFAULT_UNLOCKED_REGIONS = [
  'harvest_hearth',
  'market_square',
  'fertile_heartlands',
];

/** @typedef {import('./quests/constants.js').QUEST_TYPE} QuestType */

export function ensureQuestState(game) {
  if (!game.quests) {
    game.quests = { active: {}, completed: [], failed: [] };
  }
  if (!game.worldFlags) {
    game.worldFlags = {
      regions_unlocked: [...DEFAULT_UNLOCKED_REGIONS],
    };
  }
  if (!game.player.storyFlags) {
    game.player.storyFlags = {};
  }
  return game;
}

function createActiveQuest(questDef) {
  const objectives = {};
  for (const stage of questDef.stages) {
    for (const obj of stage.objectives) {
      objectives[obj.id] = { progress: 0, completed: false };
    }
  }
  return {
    stageIndex: 0,
    objectives,
    abundanceScore: 0,
    conversionScore: 0,
    startedDay: null,
    endingId: null,
  };
}

function hasFlag(game, flag) {
  if (game.worldFlags?.[flag]) return true;
  if (game.player?.storyFlags?.[flag]) return true;
  const qFlags = Object.values(game.quests?.active ?? {}).flatMap(() => []);
  void qFlags;
  for (const q of Object.values(game.quests?.active ?? {})) {
    if (q.flags?.[flag]) return true;
  }
  return Boolean(game.quests?.completed?.includes(flag));
}

function getPlayerFlag(game, flag) {
  return Boolean(game.player?.storyFlags?.[flag]);
}

function meetsPrerequisites(game, questDef) {
  const pre = questDef.prerequisites ?? {};
  if (pre.minPlayerLevel && (game.player.level || 1) < pre.minPlayerLevel) return false;
  if (pre.minPlayerStage != null) {
    if (getStage(game.player.lbs).id < pre.minPlayerStage) return false;
  }
  for (const flag of pre.flags ?? []) {
    if (!hasFlag(game, flag) && !getPlayerFlag(game, flag)) return false;
  }
  for (const qid of pre.questsCompleted ?? []) {
    if (!game.quests.completed.includes(qid)) return false;
  }
  if (questDef.hiddenUntilFlags?.length) {
    const visible = questDef.hiddenUntilFlags.some(
      (f) => hasFlag(game, f) || getPlayerFlag(game, f),
    );
    if (!visible) return false;
  }
  return true;
}

export function isQuestVisible(game, questId) {
  const def = getQuestDefinition(questId);
  if (!def) return false;
  if (game.quests.completed.includes(questId)) return false;
  if (game.quests.active[questId]) return true;
  return meetsPrerequisites(game, def);
}

export function canStartQuest(game, questId) {
  ensureQuestState(game);
  const def = getQuestDefinition(questId);
  if (!def) return { ok: false, reason: 'Unknown quest.' };
  if (game.quests.active[questId]) return { ok: false, reason: 'Already active.' };
  if (game.quests.completed.includes(questId)) return { ok: false, reason: 'Already completed.' };
  if (!meetsPrerequisites(game, def)) return { ok: false, reason: 'Requirements not met.' };

  if (def.type === QUEST_TYPE.MAIN) {
    const activeMain = Object.keys(game.quests.active).filter(
      (id) => getQuestDefinition(id)?.type === QUEST_TYPE.MAIN,
    );
    if (activeMain.length > 0) {
      return { ok: false, reason: 'A main quest is already in progress.' };
    }
  }

  const maxSide = 5;
  if (def.type === QUEST_TYPE.SIDE) {
    const activeSide = Object.keys(game.quests.active).filter(
      (id) => getQuestDefinition(id)?.type === QUEST_TYPE.SIDE,
    );
    if (activeSide.length >= maxSide) {
      return { ok: false, reason: 'Too many active side quests (max 5).' };
    }
  }

  return { ok: true };
}

export function startQuest(game, questId) {
  const check = canStartQuest(game, questId);
  if (!check.ok) return { ok: false, message: check.reason, game };

  const def = getQuestDefinition(questId);
  const instance = createActiveQuest(def);
  instance.startedDay = game.day;
  game.quests.active[questId] = instance;

  const message = renderQuestText('quest.start', game, {
    questId,
    questType: def.type,
    globals: { questId, questType: def.type },
  });

  return { ok: true, game, questId, message, def };
}

/** Auto-start quests when entering a region with an available giver. */
export function offerQuestsInRegion(game, regionId) {
  ensureQuestState(game);
  const offered = [];
  for (const def of getAllQuests()) {
    if (def.region !== regionId) continue;
    if (!isQuestVisible(game, def.id)) continue;
    const check = canStartQuest(game, def.id);
    if (check.ok) {
      const result = startQuest(game, def.id);
      if (result.ok) offered.push(def.id);
    }
  }
  return offered;
}

export function getActiveQuests(game, type = null) {
  ensureQuestState(game);
  return Object.entries(game.quests.active)
    .map(([id, state]) => ({ id, state, def: getQuestDefinition(id) }))
    .filter((q) => q.def && (!type || q.def.type === type));
}

export function getCurrentStage(questDef, instance) {
  return questDef.stages[instance.stageIndex] ?? null;
}

function objectiveTargetMet(game, obj) {
  const count = obj.count ?? 1;

  switch (obj.type) {
    case OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN: {
      const npc = findNpc(obj.npcId, game);
      if (!npc) return false;
      const merged = getNpcState(game, npc);
      return getTier(merged.relationship || 0).id >= (obj.tier ?? 1);
    }
    case OBJECTIVE_TYPE.NPC_CORRUPTION_MIN: {
      const npc = findNpc(obj.npcId, game);
      if (!npc) return false;
      const merged = getNpcState(game, npc);
      return getCorruptionTier(merged.corruption || 0).id >= (obj.tier ?? 1);
    }
    case OBJECTIVE_TYPE.NPC_STAGE_MIN: {
      const npc = findNpc(obj.npcId, game);
      if (!npc) return false;
      const merged = getNpcState(game, npc);
      return getStage(merged.lbs).id >= (obj.stage ?? 1);
    }
    case OBJECTIVE_TYPE.PLAYER_STAGE_MIN:
      return getStage(game.player.lbs).id >= (obj.stage ?? 1);
    case OBJECTIVE_TYPE.VISIT_REGION:
      return game.region === obj.regionId;
    case OBJECTIVE_TYPE.FLAG_SET:
      return hasFlag(game, obj.flag) || getPlayerFlag(game, obj.flag);
    default:
      return false;
  }
}

function isObjectiveComplete(instance, obj) {
  const rec = instance.objectives[obj.id];
  if (!rec) return false;
  if (rec.completed) return true;
  const count = obj.count ?? 1;
  if ([
    OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
    OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
    OBJECTIVE_TYPE.NPC_STAGE_MIN,
    OBJECTIVE_TYPE.PLAYER_STAGE_MIN,
    OBJECTIVE_TYPE.VISIT_REGION,
    OBJECTIVE_TYPE.FLAG_SET,
  ].includes(obj.type)) {
    return rec.progress >= count;
  }
  return rec.progress >= count;
}

function stageObjectivesMet(game, stage, instance) {
  const required = stage.objectives.filter((o) => !o.optional);
  return required.every((obj) => {
    if ([
      OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
      OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
      OBJECTIVE_TYPE.NPC_STAGE_MIN,
      OBJECTIVE_TYPE.PLAYER_STAGE_MIN,
      OBJECTIVE_TYPE.VISIT_REGION,
      OBJECTIVE_TYPE.FLAG_SET,
    ].includes(obj.type)) {
      return objectiveTargetMet(game, obj);
    }
    return isObjectiveComplete(instance, obj);
  });
}

function applyScores(instance, scoreMap = {}) {
  for (const [key, val] of Object.entries(scoreMap)) {
    if (key === QUEST_SCORE.ABUNDANCE) instance.abundanceScore += val;
    if (key === QUEST_SCORE.CONVERSION) instance.conversionScore += val;
  }
}

function applyRewardBundle(game, bundle = {}) {
  const messages = [];
  if (bundle.ap) {
    addAbundancePoints(game, bundle.ap);
    messages.push(`+${bundle.ap} AP`);
  }
  if (bundle.xp) {
    const source = bundle.xpSource && XP_SOURCES[bundle.xpSource] ? bundle.xpSource : 'general';
    const amount = bundle.xpSource && XP_SOURCES[bundle.xpSource]
      ? XP_SOURCES[bundle.xpSource]
      : bundle.xp;
    const { levelUps } = addExperience(game.player, amount, source);
    messages.push(`+${amount} XP`);
    if (levelUps.length) {
      game.lastLevelUpMessage = levelUps.map((lu) => `Level ${lu.level}! ${lu.flavor}`).join('\n');
    }
  }
  for (const flag of Object.keys(bundle.flags ?? {})) {
    game.worldFlags[flag] = bundle.flags[flag];
  }
  for (const flag of Object.keys(bundle.worldFlags ?? {})) {
    game.worldFlags[flag] = bundle.worldFlags[flag];
  }
  for (const flag of Object.keys(bundle.playerFlags ?? {})) {
    game.player.storyFlags[flag] = bundle.playerFlags[flag];
  }
  for (const regionId of bundle.unlockRegions ?? []) {
    if (!game.worldFlags.regions_unlocked.includes(regionId)) {
      game.worldFlags.regions_unlocked.push(regionId);
      messages.push(`Region unlocked: ${regionId}`);
    }
  }
  for (const qid of bundle.unlockQuests ?? []) {
    game.worldFlags[`quest_unlock_${qid}`] = true;
  }
  return messages;
}

function pickEnding(questDef, instance) {
  for (const ending of questDef.endings ?? []) {
    const mins = ending.condition?.minScores ?? {};
    let ok = true;
    for (const [scoreKey, min] of Object.entries(mins)) {
      const val = scoreKey === QUEST_SCORE.ABUNDANCE
        ? instance.abundanceScore
        : instance.conversionScore;
      if (val < min) ok = false;
    }
    if (ok) return ending;
  }
  return null;
}

function runGrowthTrigger(game, player, growthSpec, npc) {
  if (!growthSpec) return '';
  const targetNpc = growthSpec.npcId ? getNpcState(game, findNpc(growthSpec.npcId, game) || npc) : npc;
  if (!targetNpc) return '';
  const startStage = getStage(targetNpc.lbs).id;
  const stages = growthSpec.stages ?? 1;
  advanceStage(targetNpc, stages);
  applyNpcState(game, targetNpc.id, targetNpc);
  const proseKey = growthSpec.proseKey ?? 'growth.target.minor';
  return renderGrowthProse(proseKey, targetNpc, player, {
    startStage,
    endStage: getStage(targetNpc.lbs).id,
    stagesJumped: stages,
    growthPerspective: growthSpec.target === 'player' ? 'self' : 'target',
  });
}

/**
 * Notify the quest engine of a game event. Returns summary lines for UI.
 * @param {object} game
 * @param {object} event
 */
export function notifyQuestEvent(game, event = {}) {
  ensureQuestState(game);
  const lines = [];
  const growthSnippets = [];

  for (const [questId, instance] of Object.entries(game.quests.active)) {
    const def = getQuestDefinition(questId);
    if (!def) continue;
    const stage = getCurrentStage(def, instance);
    if (!stage) continue;

    let stageChanged = false;

    for (const obj of stage.objectives) {
      if (isObjectiveComplete(instance, obj) && ![
        OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
        OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
        OBJECTIVE_TYPE.NPC_STAGE_MIN,
      ].includes(obj.type)) continue;

      let matched = false;

      if (obj.type === OBJECTIVE_TYPE.NPC_INTERACTION) {
        matched = event.type === 'npc_interaction'
          && event.npcId === obj.npcId
          && event.interaction === obj.interaction
          && (!obj.interactionMeta || matchMeta(obj.interactionMeta, event.meta));
      } else if (obj.type === OBJECTIVE_TYPE.VISIT_REGION) {
        matched = event.type === 'visit_region' && event.regionId === obj.regionId;
      } else if (obj.type === OBJECTIVE_TYPE.COMBAT_VICTORY) {
        matched = event.type === 'combat_end'
          && (!obj.victoryType || event.victoryType === obj.victoryType);
      } else if (obj.type === OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN
        || obj.type === OBJECTIVE_TYPE.NPC_CORRUPTION_MIN
        || obj.type === OBJECTIVE_TYPE.NPC_STAGE_MIN
        || obj.type === OBJECTIVE_TYPE.PLAYER_STAGE_MIN
        || obj.type === OBJECTIVE_TYPE.FLAG_SET) {
        if (objectiveTargetMet(game, obj)) {
          instance.objectives[obj.id].progress = obj.count ?? 1;
          instance.objectives[obj.id].completed = true;
          matched = true;
        }
      }

      if (matched && obj.type === OBJECTIVE_TYPE.NPC_INTERACTION) {
        const rec = instance.objectives[obj.id];
        rec.progress += 1;
        if (rec.progress >= (obj.count ?? 1)) rec.completed = true;
        applyScores(instance, obj.score);
        if (obj.growth && event.npc) {
          const snippet = runGrowthTrigger(game, game.player, obj.growth, event.npc);
          if (snippet) growthSnippets.push(snippet);
        }
        lines.push(`Quest progress: ${def.title} — ${obj.id.replace(/_/g, ' ')}`);
      }
    }

  // Re-check passive objectives
    for (const obj of stage.objectives) {
      if ([
        OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
        OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
        OBJECTIVE_TYPE.NPC_STAGE_MIN,
        OBJECTIVE_TYPE.PLAYER_STAGE_MIN,
        OBJECTIVE_TYPE.VISIT_REGION,
        OBJECTIVE_TYPE.FLAG_SET,
      ].includes(obj.type) && objectiveTargetMet(game, obj)) {
        const rec = instance.objectives[obj.id];
        if (!rec.completed) {
          rec.progress = obj.count ?? 1;
          rec.completed = true;
          applyScores(instance, obj.score);
        }
      }
    }

    if (stageObjectivesMet(game, stage, instance)) {
      const stageResult = advanceQuestStage(game, questId);
      if (stageResult.message) lines.push(stageResult.message);
      if (stageResult.completed) lines.push(stageResult.completionMessage);
      stageChanged = true;
    }

    void stageChanged;
  }

  return { lines, growthSnippets };
}

function matchMeta(spec, meta = {}) {
  return Object.entries(spec).every(([k, v]) => meta[k] === v);
}

export function advanceQuestStage(game, questId) {
  const def = getQuestDefinition(questId);
  const instance = game.quests.active[questId];
  if (!def || !instance) return { ok: false };

  const stage = getCurrentStage(def, instance);
  const bundle = stage?.onComplete ?? {};
  applyRewardBundle(game, bundle);
  if (bundle.flags) {
    instance.flags = { ...(instance.flags ?? {}), ...bundle.flags };
  }

  const message = bundle.textKey
    ? renderQuestText(bundle.textKey, game, { questId, questType: def.type })
    : renderQuestText('quest.stage_complete', game, { questId, stageId: stage.id });

  instance.stageIndex += 1;
  if (instance.stageIndex >= def.stages.length) {
    return completeQuest(game, questId, { stageMessage: message });
  }

  return { ok: true, message, completed: false };
}

export function completeQuest(game, questId, opts = {}) {
  const def = getQuestDefinition(questId);
  const instance = game.quests.active[questId];
  if (!def || !instance) return { ok: false };

  const ending = pickEnding(def, instance);
  const rewardBundle = ending?.rewards ?? def.rewards ?? {};
  instance.endingId = ending?.id ?? null;

  const rewardMsgs = applyRewardBundle(game, rewardBundle);
  delete game.quests.active[questId];
  game.quests.completed.push(questId);

  const textKey = ending?.textKey ?? rewardBundle.textKey ?? 'quest.complete';
  const completionMessage = opts.stageMessage
    ? `${opts.stageMessage}\n\n${renderQuestText(textKey, game, { questId, endingId: ending?.id })}`
    : renderQuestText(textKey, game, { questId, endingId: ending?.id });

  return {
    ok: true,
    completed: true,
    questId,
    ending,
    completionMessage,
    rewardMsgs,
  };
}

export function getObjectiveProgressText(game, questId) {
  const def = getQuestDefinition(questId);
  const instance = game.quests.active[questId];
  if (!def || !instance) return '';
  const stage = getCurrentStage(def, instance);
  if (!stage) return '';

  return stage.objectives.map((obj) => {
    const rec = instance.objectives[obj.id];
    const done = isObjectiveComplete(instance, obj)
      || ([
        OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
        OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
        OBJECTIVE_TYPE.NPC_STAGE_MIN,
      ].includes(obj.type) && objectiveTargetMet(game, obj));
    const prog = rec?.progress ?? 0;
    const need = obj.count ?? 1;
    const opt = obj.optional ? ' (optional)' : '';
    return `${done ? '✓' : '○'} ${obj.id.replace(/_/g, ' ')} ${prog}/${need}${opt}`;
  }).join('\n');
}

export function isRegionUnlocked(game, regionId) {
  ensureQuestState(game);
  return (game.worldFlags.regions_unlocked ?? DEFAULT_UNLOCKED_REGIONS).includes(regionId);
}

export function getUnlockedConnections(game, regionId) {
  const region = getRegion(regionId);
  return region.connections.filter((id) => isRegionUnlocked(game, id));
}

export function getDiscoverableQuests(game, regionId) {
  ensureQuestState(game);
  return getAllQuests().filter((def) => {
    if (def.region !== regionId) return false;
    if (game.quests.completed.includes(def.id)) return false;
    if (game.quests.active[def.id]) return false;
    return isQuestVisible(game, def.id) && canStartQuest(game, def.id).ok;
  });
}