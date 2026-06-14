import { getClass } from "./classes.js";
import { getStage } from "./stages.js";
import { createCompanionData, COMPANIONS } from "./companions.js";
import { ensurePartyUniversalSize } from "./universalSize.js";
import { initSpellSlots } from "./spellSlots.js";
import { getMaxAbundancePoints, getArmorClass } from "./stats.js";
import { getSizeCapForLevel, initializeStartingSpells } from "./leveling.js";
import { CLASS_SKILL_PROFICIENCIES } from "./skills.js";
import { applyRaceStatBonuses, getRace } from "./races.js";
import { getSubclass, getDefaultSubclassId } from "./subclasses.js";
import { getStartLbsWithRace } from "./raceFeatures.js";

/**
 * @param {string} name
 * @param {string} classId
 * @param {{ raceId?: string, subclassId?: string, humanStatPicks?: string[] }} [options]
 */
export function createPlayer(name, classId, options = {}) {
  const cls = getClass(classId);
  const raceId = options.raceId || 'human';
  const race = getRace(raceId);
  const subclassId = options.subclassId || getDefaultSubclassId(classId);
  const subclass = getSubclass(subclassId);

  const humanPicks = options.humanStatPicks || [cls.primaryStat, 'con'];
  const stats = applyRaceStatBonuses({ ...cls.stats }, raceId, {
    humanStatPicks: humanPicks,
  });

  const level = 1;
  const maxHp = (cls.hitDie || 8) + Math.floor((stats.con - 10) / 2) + 10;
  const startLbs = getStartLbsWithRace(cls.startLbs, raceId);

  const player = {
    id: "player",
    name: name || "Chosen of Gorgara",
    classId: cls.id,
    className: cls.name,
    subclassId,
    subclass: subclass?.name || 'Unknown',
    raceId,
    raceName: race.name,
    lbs: startLbs,
    corruption: 10,
    relationship: 0,
    bodyType: race.bodyType || "hourglass",
    archetype: "chosen",
    hp: maxHp,
    maxHp,
    stats,
    proficientSaves: cls.proficientSaves || [],
    skillProficiencies: CLASS_SKILL_PROFICIENCIES[cls.id] || [],
    ap: 20,
    xp: 0,
    level,
    sizeCap: getSizeCapForLevel(level),
    gender: "she",
    pronouns: "she",
    storyFlags: {},
    raceFeatures: race.features?.map((f) => f.id) || [],
    subclassFeatures: subclass?.features || [],
    spellsKnown: [],
    spellbook: classId === 'wizard' ? [] : undefined,
    spellsPrepared: classId === 'wizard' ? [] : undefined,
    features: [],
    spells: [],
    levelUpsPending: [],
    tempFlags: {},
    restFlags: { hungerForMoreUsed: false },
  };

  initSpellSlots(player);
  initializeStartingSpells(player);
  player.ap = Math.min(player.ap, getMaxAbundancePoints(player));
  return player;
}

export function createNewGame(name, classId, options = {}) {
  const player = createPlayer(name, classId, options);
  const elara = createCompanionData(COMPANIONS.find((c) => c.id === "elara"));
  const game = {
    player,
    party: [elara],
    region: "harvest_hearth",
    day: 1,
    npcStates: {},
    history: null,
    endingsSeen: [],
    newGamePlus: false,
    combat: null,
    lastLevelUpMessage: null,
    quests: { active: {}, completed: [], failed: [] },
    worldFlags: {
      regions_unlocked: ['harvest_hearth', 'market_square', 'fertile_heartlands'],
      abundanceSpread: 0,
      regionTransformation: {},
    },
    influence: {
      political: 0,
      religious: 0,
      cultural: 0,
      holdings: [],
      institutions: [],
      titles: [],
    },
    lastQuestMessage: null,
  };
  return ensurePartyUniversalSize(game);
}

export function syncPlayerFromCombat(game, combat) {
  const p = combat.allies.find((a) => a.isPlayer);
  if (p) {
    game.player = {
      ...game.player,
      lbs: p.lbs,
      hp: p.hp,
      maxHp: p.maxHp,
      corruption: p.corruption,
      spellSlots: p.spellSlots,
      ap: p.ap,
    };
  }
  game.party = combat.allies
    .filter((a) => !a.isPlayer)
    .map((a) => ({ ...a }));
  return game;
}

export function getPlayerStage(player) {
  return getStage(player.lbs);
}

export function addAbundancePoints(game, amount) {
  const max = getMaxAbundancePoints(game.player);
  game.player.ap = Math.min(max, (game.player.ap || 0) + amount);
  return game;
}

export function spendAP(game, amount) {
  if ((game.player.ap || 0) < amount) return false;
  game.player.ap -= amount;
  return true;
}

export function applyNpcState(game, npcId, updates) {
  game.npcStates = game.npcStates || {};
  game.npcStates[npcId] = { ...(game.npcStates[npcId] || {}), ...updates };
  return game;
}

export function getNpcState(game, npc) {
  const saved = game.npcStates?.[npc.id] || {};
  return { ...npc, ...saved };
}

export function getPlayerDerivedStats(player) {
  return {
    ac: getArmorClass(player),
    stage: getStage(player.lbs),
    maxAp: getMaxAbundancePoints(player),
  };
}
