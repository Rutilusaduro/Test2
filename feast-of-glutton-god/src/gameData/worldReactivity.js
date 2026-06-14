/**
 * Persistent world reactivity — growth leaves durable marks on regions, travel, and politics.
 * Mirror pattern: notifyQuestEvent → notifyWorldReaction.
 */
import { getStage, getStageById, getTileSize, STAGE_BAND } from './stages.js';
import { getRegion, getRegion as getRegionDef } from './regions.js';
import { getLocaleKey } from './regionLocales.js';
import { awardRegionTransformation } from './worldTransformation.js';
import { applyNpcState } from './player.js';
import { renderLandmarkReaction } from '../textEngine/scenes/world/landmarkReactions.js';

export const FOOTPRINT_CROWDED = 6;
export const FOOTPRINT_BLOCK_EXIT = 12;
export const FOOTPRINT_IMPASSABLE = 20;
export const LANDMARK_STAGE_MIN = 11;
export const WORLD_REACTION_STAGE_MIN = 10;
export const SETTLE_DAYS_PER_TICK = 3;
export const RUMOR_BUFFER_MAX = 12;

const FACTION_REGIONS = ['gilded_citadel', 'ember_duchy'];
const LEDGER_MAX = 40;

export function ensureReactivityState(game) {
  if (!game.worldFlags) game.worldFlags = {};
  if (!game.worldFlags.landmarks) game.worldFlags.landmarks = {};
  if (!game.worldFlags.regionFootprint) game.worldFlags.regionFootprint = {};
  if (!game.worldFlags.rumors) game.worldFlags.rumors = [];
  if (!game.worldFlags.livingLedger) game.worldFlags.livingLedger = [];
  if (game.worldFlags.disableGiantBlocks == null) game.worldFlags.disableGiantBlocks = false;
  return game.worldFlags;
}

export function getCharacterId(character) {
  if (!character) return 'unknown';
  if (character.id === 'player' || character.isPlayer) return 'player';
  return character.id ?? character.characterId ?? 'unknown';
}

function ensureRegionFootprint(game, regionId) {
  const state = ensureReactivityState(game);
  if (!state.regionFootprint[regionId]) {
    state.regionFootprint[regionId] = {
      footprint: 0,
      giants: [],
      maxStage: 0,
      blockedExits: [],
      impassableToSmall: false,
      settleState: 0,
      lastGrowthDay: game.day ?? 1,
    };
  }
  return state.regionFootprint[regionId];
}

export function getRegionFootprint(game, regionId) {
  return ensureRegionFootprint(game, regionId);
}

export function getLandmarksInRegion(game, regionId) {
  const landmarks = ensureReactivityState(game).landmarks;
  return Object.values(landmarks).filter((l) => l.regionId === regionId);
}

export function getLivingLandmarkCount(game, regionId = null) {
  const landmarks = Object.values(ensureReactivityState(game).landmarks);
  return landmarks.filter((l) => l.landmarkTier >= 1 && (!regionId || l.regionId === regionId)).length;
}

function footprintGain(stageId, stagesJumped = 1) {
  return Math.pow(getTileSize(stageId), 2) * Math.max(1, stagesJumped);
}

function resolveLandmarkTier(stageId) {
  if (stageId >= 12) return 2;
  if (stageId >= LANDMARK_STAGE_MIN) return 1;
  return 0;
}

function mirrorLandmarkTier(game, characterId, character, tier, extra = {}) {
  if (characterId === 'player') {
    Object.assign(character, { landmarkTier: tier, ...extra });
    return;
  }
  applyNpcState(game, characterId, { landmarkTier: tier, ...extra });
  Object.assign(character, { landmarkTier: tier, ...extra });
}

function recordRumor(game, entry) {
  const rumors = ensureReactivityState(game).rumors;
  rumors.push({
    what: entry.what,
    who: entry.who ?? null,
    regionId: entry.regionId,
    day: game.day ?? 1,
  });
  while (rumors.length > RUMOR_BUFFER_MAX) rumors.shift();
}

function addLedgerEntry(game, entry) {
  const ledger = ensureReactivityState(game).livingLedger;
  ledger.push({
    id: `${entry.type}_${entry.characterId}_${game.day ?? 1}`,
    day: game.day ?? 1,
    ...entry,
  });
  while (ledger.length > LEDGER_MAX) ledger.shift();
}

function pickExitToBlock(game, regionId, footprint) {
  const region = getRegionDef(regionId);
  const fp = ensureRegionFootprint(game, regionId);
  const already = new Set(fp.blockedExits.map((b) => b.toId));
  const candidates = region.connections.filter((toId) => !already.has(toId));
  if (!candidates.length) return null;
  // Prefer blocking an exit that still leaves at least one open route.
  const openAfter = region.connections.filter((toId) => !already.has(toId));
  if (openAfter.length <= 1) return null;
  return candidates[0];
}

function blockExit(game, regionId, toId, source) {
  const fp = ensureRegionFootprint(game, regionId);
  if (fp.blockedExits.some((b) => b.toId === toId)) return false;
  fp.blockedExits.push({
    toId,
    source,
    blockedDay: game.day ?? 1,
    reasonKey: 'blockade',
  });
  return true;
}

function applyPhysicalEffects(game, event, lines, effects) {
  const { character, characterId, endStage, stagesJumped, regionId } = event;
  const fp = ensureRegionFootprint(game, regionId);
  const gain = footprintGain(endStage, stagesJumped);
  fp.footprint += gain;
  fp.lastGrowthDay = game.day ?? 1;
  fp.settleState = 0;
  fp.maxStage = Math.max(fp.maxStage ?? 0, endStage);

  if (endStage >= 6 && !fp.giants.includes(characterId)) {
    fp.giants.push(characterId);
  }

  effects.footprintGained = gain;
  effects.footprintTotal = fp.footprint;

  if (fp.footprint >= FOOTPRINT_CROWDED && !fp.flags?.crowdedNoted) {
    fp.flags = { ...(fp.flags ?? {}), crowdedNoted: true };
    const prose = renderLandmarkReaction(game, {
      reactionType: 'crowded',
      regionId,
      footprint: fp.footprint,
      characterName: character.name,
      endStage,
    });
    if (prose) lines.push(prose);
  }

  const shouldBlock = !game.worldFlags.disableGiantBlocks
    && fp.settleState < 2
    && (fp.footprint >= FOOTPRINT_BLOCK_EXIT || endStage >= 12);

  if (shouldBlock && !fp.flags?.exitBlocked) {
    const toId = pickExitToBlock(game, regionId, fp);
    if (toId && blockExit(game, regionId, toId, characterId)) {
      fp.flags = { ...(fp.flags ?? {}), exitBlocked: true };
      effects.exitBlocked = toId;
      const prose = renderLandmarkReaction(game, {
        reactionType: 'blockade',
        regionId,
        toRegionId: toId,
        characterName: character.name,
        endStage,
        footprint: fp.footprint,
      });
      if (prose) lines.push(prose);
      recordRumor(game, {
        what: `road_blocked_${toId}`,
        who: character.name,
        regionId,
      });
    }
  }

  if (fp.footprint >= FOOTPRINT_IMPASSABLE && !fp.impassableToSmall) {
    fp.impassableToSmall = true;
    effects.impassableToSmall = true;
  }
}

function applyLandmarkBirth(game, event, lines, effects) {
  const { character, characterId, endStage, regionId } = event;
  const landmarks = ensureReactivityState(game).landmarks;
  const existing = landmarks[characterId];
  const stage = getStageById(endStage);
  const tier = resolveLandmarkTier(endStage);

  if (endStage < LANDMARK_STAGE_MIN) return;

  const snapshot = {
    characterId,
    name: character.name ?? 'Unknown',
    regionId,
    locale: getLocaleKey(regionId),
    stage: endStage,
    band: stage.band,
    landmarkTier: tier,
    role: character.role ?? character.archetype ?? 'traveler',
    becameLandmarkDay: game.day ?? 1,
    lastGrowthDay: game.day ?? 1,
    settleState: 0,
    cult: tier >= 2,
    flags: { ...(existing?.flags ?? {}) },
  };

  const isNew = !existing;
  landmarks[characterId] = { ...existing, ...snapshot };
  mirrorLandmarkTier(game, characterId, character, tier, { cult: snapshot.cult });

  if (isNew && !snapshot.flags.birthProseShown) {
    snapshot.flags.birthProseShown = true;
    landmarks[characterId] = snapshot;
    effects.landmarkChanged = true;
    effects.landmarkBirth = true;

    const prose = renderLandmarkReaction(game, {
      reactionType: 'birth',
      landmark: snapshot,
      regionId,
    });
    if (prose) lines.push(prose);

    recordRumor(game, {
      what: `landmark_birth_${characterId}`,
      who: character.name,
      regionId,
    });

    addLedgerEntry(game, {
      type: 'landmark_birth',
      characterId,
      name: character.name,
      regionId,
      stage: endStage,
      label: `Raised ${character.name} to a living landmark in ${getRegionDef(regionId).name}`,
    });

    applyPoliticalEffects(game, event, lines, effects, snapshot);
  } else if (!isNew) {
    landmarks[characterId] = {
      ...snapshot,
      becameLandmarkDay: existing.becameLandmarkDay,
      lastGrowthDay: game.day ?? 1,
      settleState: 0,
    };
    if (tier > (existing.landmarkTier ?? 0)) {
      effects.landmarkChanged = true;
      mirrorLandmarkTier(game, characterId, character, tier, { cult: snapshot.cult });
    }
  }

  if (tier >= 2 && !snapshot.flags.worshipProseShown) {
    snapshot.flags.worshipProseShown = true;
    landmarks[characterId] = { ...landmarks[characterId], flags: snapshot.flags };
    const worship = renderLandmarkReaction(game, {
      reactionType: 'worship',
      landmark: landmarks[characterId],
      regionId,
    });
    if (worship) lines.push(worship);
    effects.cultFormed = true;
  }
}

function applyPoliticalEffects(game, event, lines, effects, landmark) {
  const { character, regionId } = event;
  if (!landmark || landmark.flags?.politicsApplied) return;

  const stage = getStageById(landmark.stage);
  const amount = stage.band === STAGE_BAND.WORLD ? 25 : 8;
  const transform = awardRegionTransformation(game, regionId, 'institution_action', amount);
  if (transform.gained) {
    effects.transformationGained = transform.gained;
    if (transform.message) lines.push(transform.message);
  }

  landmark.flags = { ...landmark.flags, politicsApplied: true };
  ensureReactivityState(game).landmarks[landmark.characterId] = landmark;

  if (FACTION_REGIONS.includes(regionId) && !game.worldFlags.faction_purity_weakened) {
    game.worldFlags.faction_purity_weakened = true;
    effects.factionShift = 'purity_weakened';
    lines.push(
      `✦ Purity hardliners in ${getRegionDef(regionId).name} falter — ${character.name}'s immensity makes restraint look absurd.`,
    );
  }
}

function applyMechanicalUnlocks(game, event, effects) {
  const { characterId, endStage } = event;
  const landmarks = ensureReactivityState(game).landmarks;
  const lm = landmarks[characterId];
  if (!lm || endStage < LANDMARK_STAGE_MIN) return;

  if (!lm.flags?.interactionsUnlocked) {
    lm.flags = {
      ...lm.flags,
      interactionsUnlocked: true,
      worship: true,
      climb: endStage >= 11,
      petition: endStage >= 12,
    };
    landmarks[characterId] = lm;
    effects.interaction_unlocked = ['worship', 'climb', 'petition'].filter((k) => lm.flags[k]);
  }
}

/**
 * @returns {{ lines: string[], effects: object, landmarkChanged: boolean }}
 */
export function notifyWorldReaction(game, event = {}) {
  ensureReactivityState(game);
  const lines = [];
  const effects = {};
  let landmarkChanged = false;

  const {
    type = 'growth',
    character,
    startStage = 0,
    endStage = 0,
    stagesJumped = 1,
    regionId = game.region,
  } = event;

  if (type !== 'growth' || endStage < WORLD_REACTION_STAGE_MIN) {
    return { lines, effects, landmarkChanged };
  }

  const characterId = event.characterId ?? getCharacterId(character);
  const fullEvent = {
    ...event,
    character,
    characterId,
    regionId,
    endStage,
    startStage,
    stagesJumped,
  };

  applyPhysicalEffects(game, fullEvent, lines, effects);
  applyLandmarkBirth(game, fullEvent, lines, effects);
  if (effects.landmarkChanged) landmarkChanged = true;
  applyMechanicalUnlocks(game, fullEvent, effects);

  return { lines: lines.filter(Boolean), effects, landmarkChanged };
}

export function isExitBlockedByGiant(game, fromRegionId, toId) {
  if (game.worldFlags?.disableGiantBlocks) return { blocked: false };
  const fp = game.worldFlags?.regionFootprint?.[fromRegionId];
  if (!fp || fp.settleState >= 2) return { blocked: false };
  const block = fp.blockedExits?.find((b) => b.toId === toId);
  if (!block) return { blocked: false };
  const landmark = game.worldFlags?.landmarks?.[block.source];
  const prose = renderLandmarkReaction(game, {
    reactionType: 'blockade',
    regionId: fromRegionId,
    toRegionId: toId,
    characterName: landmark?.name ?? 'a living landmark',
    endStage: landmark?.stage ?? fp.maxStage,
    footprint: fp.footprint,
  });
  return { blocked: true, reason: prose, source: block.source };
}

export function isImpassableToSmall(game, regionId) {
  if (game.worldFlags?.disableGiantBlocks) return false;
  const fp = game.worldFlags?.regionFootprint?.[regionId];
  if (!fp || fp.settleState >= 2) return false;
  return Boolean(fp.impassableToSmall);
}

export function isSmallTraveler(game) {
  const player = game.player;
  if (!player) return true;
  return getStage(player.lbs).id < 6;
}

export function advanceWorldSettling(game) {
  ensureReactivityState(game);
  const day = game.day ?? 1;
  const lines = [];

  for (const [regionId, fp] of Object.entries(game.worldFlags.regionFootprint ?? {})) {
    const daysSinceGrowth = day - (fp.lastGrowthDay ?? day);
    if (daysSinceGrowth < SETTLE_DAYS_PER_TICK) continue;

    const ticks = Math.floor(daysSinceGrowth / SETTLE_DAYS_PER_TICK);
    const next = Math.min(2, (fp.settleState ?? 0) + ticks);
    if (next === fp.settleState) continue;

    fp.settleState = next;
    const prose = renderLandmarkReaction(game, {
      reactionType: 'settle',
      regionId,
      settleState: next,
      footprint: fp.footprint,
    });
    if (prose) lines.push(prose);

    if (next >= 2) {
      fp.blockedExits = [];
      fp.impassableToSmall = false;
      fp.flags = { ...(fp.flags ?? {}), exitBlocked: false, crowdedNoted: fp.flags?.crowdedNoted };
    }
  }

  for (const landmark of Object.values(game.worldFlags.landmarks ?? {})) {
    const daysSince = day - (landmark.lastGrowthDay ?? landmark.becameLandmarkDay ?? day);
    if (daysSince < SETTLE_DAYS_PER_TICK) continue;
    const next = Math.min(2, (landmark.settleState ?? 0) + 1);
    if (next > landmark.settleState) {
      landmark.settleState = next;
    }
  }

  return { lines: lines.filter(Boolean) };
}

export function getReactivityGlobals(game, regionId = game?.region) {
  const fp = game?.worldFlags?.regionFootprint?.[regionId] ?? {};
  const landmarks = getLandmarksInRegion(game, regionId);
  const rumors = game?.worldFlags?.rumors ?? [];
  const latestRumor = rumors.filter((r) => r.regionId === regionId).slice(-1)[0];
  return {
    footprint: fp.footprint ?? 0,
    giantCount: fp.giants?.length ?? landmarks.length,
    landmarkTier: game?.player?.landmarkTier ?? 0,
    nearbyLandmarkTier: landmarks.reduce((m, l) => Math.max(m, l.landmarkTier ?? 0), 0),
    settleState: fp.settleState ?? 0,
    band: getStage(game?.player?.lbs ?? 130).band,
    reactionType: latestRumor?.what ?? null,
    hasRumor: Boolean(latestRumor),
    rumorWhat: latestRumor?.what ?? null,
    rumorWho: latestRumor?.who ?? null,
    factionPurityWeakened: Boolean(game?.worldFlags?.faction_purity_weakened),
  };
}

export function getRegionReactivitySummary(game, regionId) {
  const fp = getRegionFootprint(game, regionId);
  const landmarks = getLandmarksInRegion(game, regionId);
  const region = getRegion(regionId);
  const blocked = (fp.blockedExits ?? []).map((b) => ({
    toId: b.toId,
    toName: getRegion(b.toId).name,
    source: b.source,
    sourceName: game.worldFlags?.landmarks?.[b.source]?.name ?? b.source,
  }));

  return {
    regionId,
    regionName: region.name,
    footprint: fp.footprint ?? 0,
    maxStage: fp.maxStage ?? 0,
    giantCount: fp.giants?.length ?? 0,
    settleState: fp.settleState ?? 0,
    impassableToSmall: Boolean(fp.impassableToSmall),
    blockedExits: blocked,
    landmarks: landmarks.map((l) => ({
      id: l.characterId,
      name: l.name,
      stage: l.stage,
      tier: l.landmarkTier,
      cult: l.cult,
      settleState: l.settleState ?? 0,
      role: l.role,
    })),
    factionPurityWeakened: Boolean(game.worldFlags?.faction_purity_weakened),
    livingLandmarkCount: getLivingLandmarkCount(game, regionId),
  };
}
