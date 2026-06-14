/**
 * Quest engine — unified tracking, advancement, rewards for main & side quests.
 */
import { getQuestDefinition, getAllQuests } from './quests/registry.js';
import { QUEST_TYPE, OBJECTIVE_TYPE, QUEST_SCORE, QUEST_NPC_ALIASES } from './quests/constants.js';
import { getTier, awardRelationship, getTierUpMessage } from './relationships.js';
import { awardAbundanceSpreadWithEvents } from './worldEvents.js';
import { getCorruptionTier } from './corruption.js';
import { getStage, advanceStage } from './stages.js';
import { applyGrowthWithPresentation } from './growthPresentation.js';
import { addAbundancePoints } from './player.js';
import { addExperience, XP_SOURCES } from './leveling.js';
import { getNpcState, applyNpcState } from './player.js';
import { findNpc, WORLD_NPCS, createNpc } from './npcs.js';
import { getRegion } from './regions.js';
import { renderGrowthProse } from '../textEngine/scenes/growth/index.js';
import { renderQuestText } from '../textEngine/scenes/quests/index.js';
import { onRedemptionQuestComplete } from '../hooks/questHooks.js';

const DEFAULT_UNLOCKED_REGIONS = [
  'harvest_hearth',
  'market_square',
  'fertile_heartlands',
];

const PASSIVE_OBJECTIVE_TYPES = [
  OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
  OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
  OBJECTIVE_TYPE.NPC_STAGE_MIN,
  OBJECTIVE_TYPE.PLAYER_STAGE_MIN,
  OBJECTIVE_TYPE.VISIT_REGION,
  OBJECTIVE_TYPE.FLAG_SET,
  OBJECTIVE_TYPE.NPC_GROWTH_QUOTA,
];

const SCORE_FIELD_MAP = {
  [QUEST_SCORE.ABUNDANCE]: 'abundanceScore',
  [QUEST_SCORE.CONVERSION]: 'conversionScore',
  [QUEST_SCORE.DOMINANCE]: 'dominanceScore',
  [QUEST_SCORE.MERCY]: 'mercyScore',
};

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
  if (!game.worldFlags.worldAuras) {
    game.worldFlags.worldAuras = {};
  }
  return game;
}

function resolveNpcAliases(npcId) {
  if (!npcId) return [];
  if (QUEST_NPC_ALIASES[npcId]) return QUEST_NPC_ALIASES[npcId];
  for (const aliases of Object.values(QUEST_NPC_ALIASES)) {
    if (aliases.includes(npcId)) return aliases;
  }
  return [npcId];
}

function npcIdsMatch(questNpcId, eventNpcId) {
  if (!questNpcId || !eventNpcId) return false;
  const a = new Set(resolveNpcAliases(questNpcId));
  return resolveNpcAliases(eventNpcId).some((id) => a.has(id));
}

function snapshotGrowthBaselines(game) {
  const baselines = {};
  for (const template of WORLD_NPCS) {
    const npc = createNpc(template);
    const merged = getNpcState(game, npc);
    baselines[template.id] = getStage(merged.lbs).id;
  }
  for (const companion of game.party ?? []) {
    baselines[companion.id] = getStage(companion.lbs).id;
  }
  return baselines;
}

function getNpcForObjective(game, npcId) {
  for (const id of resolveNpcAliases(npcId)) {
    const npc = findNpc(id, game);
    if (npc) return getNpcState(game, npc);
  }
  return null;
}

function createActiveQuest(questDef, game) {
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
    dominanceScore: 0,
    mercyScore: 0,
    growthBaselines: snapshotGrowthBaselines(game),
    growthQualified: [],
    startedDay: null,
    endingId: null,
  };
}

function hasFlag(game, flag) {
  if (game.worldFlags?.[flag]) return true;
  if (game.player?.storyFlags?.[flag]) return true;
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
  const instance = createActiveQuest(def, game);
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

function getGrowthQuotaTarget(obj) {
  return obj.npcCount ?? obj.count ?? 4;
}

function getNpcBaseline(instance, npcId) {
  for (const id of resolveNpcAliases(npcId)) {
    if (instance.growthBaselines?.[id] != null) return { id, stage: instance.growthBaselines[id] };
  }
  return { id: npcId, stage: null };
}

function refreshGrowthQuota(game, instance, obj) {
  const minGain = obj.minStagesGained ?? 2;
  const target = getGrowthQuotaTarget(obj);
  const qualified = [];

  const candidates = new Set([
    ...Object.keys(instance.growthBaselines ?? {}),
    ...(game.party ?? []).map((c) => c.id),
  ]);

  for (const npcId of candidates) {
    const merged = getNpcForObjective(game, npcId);
    if (!merged) continue;
    const { id: trackId, stage: baseline } = getNpcBaseline(instance, npcId);
    if (baseline == null) continue;
    const current = getStage(merged.lbs).id;
    if (current - baseline >= minGain) qualified.push(trackId);
  }

  instance.growthQualified = [...new Set(qualified)];
  const rec = instance.objectives[obj.id];
  rec.progress = instance.growthQualified.length;
  rec.completed = rec.progress >= target;
  return rec.completed;
}

function objectiveTargetMet(game, obj, instance = null) {
  switch (obj.type) {
    case OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN: {
      const merged = getNpcForObjective(game, obj.npcId);
      if (!merged) return false;
      return getTier(merged.relationship || 0).id >= (obj.tier ?? 1);
    }
    case OBJECTIVE_TYPE.NPC_CORRUPTION_MIN: {
      const merged = getNpcForObjective(game, obj.npcId);
      if (!merged) return false;
      return getCorruptionTier(merged.corruption || 0).id >= (obj.tier ?? 1);
    }
    case OBJECTIVE_TYPE.NPC_STAGE_MIN: {
      const merged = getNpcForObjective(game, obj.npcId);
      if (!merged) return false;
      return getStage(merged.lbs).id >= (obj.stage ?? 1);
    }
    case OBJECTIVE_TYPE.PLAYER_STAGE_MIN:
      return getStage(game.player.lbs).id >= (obj.stage ?? 1);
    case OBJECTIVE_TYPE.VISIT_REGION:
      return game.region === obj.regionId;
    case OBJECTIVE_TYPE.FLAG_SET:
      return hasFlag(game, obj.flag) || getPlayerFlag(game, obj.flag);
    case OBJECTIVE_TYPE.NPC_GROWTH_QUOTA:
      return instance ? refreshGrowthQuota(game, instance, obj) : false;
    default:
      return false;
  }
}

function isObjectiveComplete(game, instance, obj) {
  const rec = instance.objectives[obj.id];
  if (!rec) return false;
  if (rec.completed) return true;
  if (PASSIVE_OBJECTIVE_TYPES.includes(obj.type)) {
    return objectiveTargetMet(game, obj, instance);
  }
  const count = obj.count ?? 1;
  return rec.progress >= count;
}

function stageObjectivesMet(game, stage, instance) {
  const required = stage.objectives.filter((o) => !o.optional);
  return required.every((obj) => isObjectiveComplete(game, instance, obj));
}

function applyScores(instance, scoreMap = {}) {
  for (const [key, val] of Object.entries(scoreMap)) {
    const field = SCORE_FIELD_MAP[key] ?? key;
    instance[field] = (instance[field] ?? 0) + val;
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
      game.lastLevelUpMessage = levelUps.map((lu) => lu.narrative || `Level ${lu.level}! ${lu.flavor}`).join('\n\n---\n\n');
      game.lastLevelUpResult = levelUps[levelUps.length - 1];
    }
    if (bundle.xpSource === 'major_story') {
      const spread = awardAbundanceSpreadWithEvents(game, 'quest_complete_main');
      if (spread.gained) messages.push(`+${spread.gained} abundance influence`);
      if (spread.worldEvent?.triggered) messages.push(spread.worldEvent.message);
    } else if (bundle.xp && bundle.xp >= 50) {
      const spread = awardAbundanceSpreadWithEvents(game, 'quest_complete_side');
      if (spread.gained) messages.push(`+${spread.gained} abundance influence`);
      if (spread.worldEvent?.triggered) messages.push(spread.worldEvent.message);
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
  if (bundle.playerSizeCapBonus) {
    game.player.sizeCap = (game.player.sizeCap || 5) + bundle.playerSizeCapBonus;
    messages.push(`Maximum size stage increased by ${bundle.playerSizeCapBonus}`);
  }
  if (bundle.worldAura) {
    const aura = typeof bundle.worldAura === 'string'
      ? { regionId: bundle.worldAura, name: 'Aura of Plenty' }
      : bundle.worldAura;
    game.worldFlags.worldAuras[aura.regionId] = aura;
    messages.push(`${aura.name || 'Aura of Plenty'} settles over ${aura.regionId.replace(/_/g, ' ')}`);
  }
  if (bundle.recruitCompanionNpcId) {
    const template = findNpc(bundle.recruitCompanionNpcId, game);
    const companionId = template?.companionId || bundle.recruitCompanionNpcId;
    const exists = (game.party ?? []).find((c) => c.id === companionId);
    if (!exists && template) {
      const companion = {
        ...getNpcState(game, template),
        id: companionId,
        recruited: true,
        isCompanion: true,
      };
      game.party = game.party || [];
      game.party.push(companion);
      messages.push(`${companion.name} joins your pilgrimage!`);
    } else if (!exists) {
      game.player.storyFlags[`companion_unlock_${companionId}`] = true;
      messages.push(`Companion recruitment unlocked: ${companionId}`);
    }
  }
  for (const cid of bundle.unlockCompanionIds ?? []) {
    game.player.storyFlags[`companion_unlock_${cid}`] = true;
    messages.push(`Companion available: ${cid.replace(/_/g, ' ')}`);
  }
  const relRewards = bundle.npcRelationships
    ? bundle.npcRelationships
    : bundle.npcRelationship
      ? [bundle.npcRelationship]
      : [];
  for (const rel of relRewards) {
    if (!rel?.npcId) continue;
    const template = findNpc(rel.npcId, game);
    const npc = template ? getNpcState(game, template) : getNpcState(game, { id: rel.npcId });
    const result = awardRelationship(npc, rel.source || 'quest_personal', rel.amount);
    applyNpcState(game, npc.id, npc);
    if (npc.isCompanion) {
      game.party = (game.party ?? []).map((c) => (c.id === npc.id ? { ...npc } : c));
    }
    messages.push(`+${result.gained} bond with ${npc.name}`);
    if (result.tierUp) messages.push(getTierUpMessage(npc, result));
  }
  return messages;
}

function getScoreValue(instance, scoreKey) {
  const field = SCORE_FIELD_MAP[scoreKey] ?? scoreKey;
  return instance[field] ?? 0;
}

function pickEnding(questDef, instance) {
  for (const ending of questDef.endings ?? []) {
    const mins = ending.condition?.minScores ?? {};
    let ok = true;
    for (const [scoreKey, min] of Object.entries(mins)) {
      if (getScoreValue(instance, scoreKey) < min) ok = false;
    }
    if (ok) return ending;
  }
  return null;
}

function runGrowthTrigger(game, player, growthSpec, npc) {
  if (!growthSpec) return '';
  const targetNpc = growthSpec.npcId
    ? getNpcForObjective(game, growthSpec.npcId)
    : npc;
  if (!targetNpc) return '';
  const stages = growthSpec.stages ?? 1;
  const presentation = applyGrowthWithPresentation(targetNpc, game, stages, {
    growthMethod: 'quest',
    regionId: game?.region,
  });
  applyNpcState(game, targetNpc.id, targetNpc);
  if (presentation.text) return presentation.text;
  const proseKey = growthSpec.proseKey ?? 'growth.target.minor';
  return renderGrowthProse(proseKey, targetNpc, player, {
    startStage: presentation.startStage,
    endStage: presentation.endStage,
    stagesJumped: presentation.stagesJumped,
    growthPerspective: growthSpec.target === 'player' ? 'self' : 'target',
  });
}

function objectiveLabel(obj) {
  return obj.label || obj.id.replace(/_/g, ' ');
}

function recordGrowthQuotaProgress(game, instance, obj, event) {
  const minGain = obj.minStagesGained ?? 2;
  const { id: trackId, stage: baseline } = getNpcBaseline(instance, event.npcId);
  if (baseline == null) return false;

  const gained = event.endStage - baseline;
  if (gained >= minGain && !instance.growthQualified.includes(trackId)) {
    instance.growthQualified.push(trackId);
  }

  const rec = instance.objectives[obj.id];
  const target = getGrowthQuotaTarget(obj);
  rec.progress = instance.growthQualified.length;
  rec.completed = rec.progress >= target;
  return rec.completed;
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

    for (const obj of stage.objectives) {
      if (isObjectiveComplete(game, instance, obj)) continue;

      let matched = false;

      if (obj.type === OBJECTIVE_TYPE.NPC_INTERACTION) {
        matched = event.type === 'npc_interaction'
          && npcIdsMatch(obj.npcId, event.npcId)
          && event.interaction === obj.interaction
          && (!obj.interactionMeta || matchMeta(obj.interactionMeta, event.meta));
      } else if (obj.type === OBJECTIVE_TYPE.VISIT_REGION) {
        matched = event.type === 'visit_region' && event.regionId === obj.regionId;
      } else if (obj.type === OBJECTIVE_TYPE.COMBAT_VICTORY) {
        matched = event.type === 'combat_end'
          && (!obj.victoryType || event.victoryType === obj.victoryType)
          && (!obj.enemyId || (event.defeatedEnemyIds ?? []).includes(obj.enemyId));
      } else if (obj.type === OBJECTIVE_TYPE.COMMUNAL_FEAST) {
        matched = event.type === 'npc_interaction'
          && event.interaction === 'feast'
          && (!obj.regionId || event.regionId === obj.regionId || game.region === obj.regionId);
      } else if (obj.type === OBJECTIVE_TYPE.PUZZLE_SOLVED) {
        matched = event.type === 'puzzle_solved'
          && (!obj.puzzleId || event.puzzleId === obj.puzzleId)
          && (!obj.regionId || event.regionId === obj.regionId);
      } else if (obj.type === OBJECTIVE_TYPE.FEATURE_EXAMINED) {
        matched = event.type === 'feature_examined'
          && (!obj.featureId || event.featureId === obj.featureId)
          && (!obj.regionId || event.regionId === obj.regionId);
      } else if (obj.type === OBJECTIVE_TYPE.NPC_GROWTH_QUOTA) {
        if (event.type === 'npc_growth') {
          recordGrowthQuotaProgress(game, instance, obj, event);
          matched = instance.objectives[obj.id].completed;
        }
      } else if (PASSIVE_OBJECTIVE_TYPES.includes(obj.type) && obj.type !== OBJECTIVE_TYPE.NPC_GROWTH_QUOTA) {
        if (objectiveTargetMet(game, obj, instance)) {
          instance.objectives[obj.id].progress = obj.count ?? 1;
          instance.objectives[obj.id].completed = true;
          matched = true;
        }
      }

      if (matched && [
        OBJECTIVE_TYPE.NPC_INTERACTION,
        OBJECTIVE_TYPE.COMBAT_VICTORY,
        OBJECTIVE_TYPE.COMMUNAL_FEAST,
        OBJECTIVE_TYPE.PUZZLE_SOLVED,
        OBJECTIVE_TYPE.FEATURE_EXAMINED,
      ].includes(obj.type)) {
        const rec = instance.objectives[obj.id];
        rec.progress += 1;
        if (rec.progress >= (obj.count ?? 1)) rec.completed = true;
        applyScores(instance, obj.score);
        if (obj.growth && event.npc) {
          const snippet = runGrowthTrigger(game, game.player, obj.growth, event.npc);
          if (snippet) growthSnippets.push(snippet);
        }
        lines.push(`Quest progress: ${def.title} — ${objectiveLabel(obj)}`);
      } else if (matched && obj.type === OBJECTIVE_TYPE.NPC_GROWTH_QUOTA) {
        applyScores(instance, obj.score);
        lines.push(`Quest progress: ${def.title} — ${objectiveLabel(obj)} (${instance.growthQualified.length}/${getGrowthQuotaTarget(obj)})`);
      }
    }

    for (const obj of stage.objectives) {
      if (obj.type === OBJECTIVE_TYPE.NPC_GROWTH_QUOTA) {
        const rec = instance.objectives[obj.id];
        const wasComplete = rec.completed;
        refreshGrowthQuota(game, instance, obj);
        if (!wasComplete && rec.completed) {
          applyScores(instance, obj.score);
          lines.push(`Quest progress: ${def.title} — ${objectiveLabel(obj)} (${instance.growthQualified.length}/${getGrowthQuotaTarget(obj)})`);
        }
        continue;
      }
      if (PASSIVE_OBJECTIVE_TYPES.includes(obj.type) && objectiveTargetMet(game, obj, instance)) {
        const rec = instance.objectives[obj.id];
        if (!rec.completed) {
          rec.progress = obj.count ?? 1;
          rec.completed = true;
          applyScores(instance, obj.score);
          lines.push(`Quest progress: ${def.title} — ${objectiveLabel(obj)}`);
        }
      }
    }

    if (stageObjectivesMet(game, stage, instance)) {
      const stageResult = advanceQuestStage(game, questId);
      if (stageResult.message) lines.push(stageResult.message);
      if (stageResult.completed) lines.push(stageResult.completionMessage);
    }
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

  if (questId === 'side_hostility_redemption') {
    onRedemptionQuestComplete(game);
  }

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
    const done = isObjectiveComplete(game, instance, obj);
    const prog = obj.type === OBJECTIVE_TYPE.NPC_GROWTH_QUOTA
      ? (instance.growthQualified?.length ?? instance.objectives[obj.id]?.progress ?? 0)
      : (instance.objectives[obj.id]?.progress ?? 0);
    const need = obj.type === OBJECTIVE_TYPE.NPC_GROWTH_QUOTA
      ? getGrowthQuotaTarget(obj)
      : (obj.count ?? 1);
    const opt = obj.optional ? ' (optional)' : '';
    return `${done ? '✓' : '○'} ${objectiveLabel(obj)} ${prog}/${need}${opt}`;
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
