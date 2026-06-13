import { getClass } from "./classes.js";
import { getStage } from "./stages.js";
import { getSpellsForClass } from "./spells.js";
import { createCompanionData, COMPANIONS } from "./companions.js";
import { initSpellSlots } from "./spellSlots.js";
import { getMaxAbundancePoints, hpPerLevel, getArmorClass } from "./stats.js";
import { getSizeCapForLevel } from "./leveling.js";
import { CLASS_SKILL_PROFICIENCIES } from "./skills.js";

export function createPlayer(name, classId) {
  const cls = getClass(classId);
  const stats = { ...cls.stats };
  const level = 1;
  const maxHp = (cls.hitDie || 8) + Math.floor((stats.con - 10) / 2) + 10;

  const player = {
    id: "player",
    name: name || "Chosen of Gorgara",
    classId: cls.id,
    className: cls.name,
    subclass: cls.subclass,
    lbs: cls.startLbs,
    corruption: 10,
    relationship: 0,
    bodyType: "hourglass",
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
    spells: getSpellsForClass(cls.id),
    levelUpsPending: [],
  };

  initSpellSlots(player);
  player.ap = Math.min(player.ap, getMaxAbundancePoints(player));
  return player;
}

export function createNewGame(name, classId) {
  const player = createPlayer(name, classId);
  const elara = createCompanionData(COMPANIONS.find((c) => c.id === "elara"));
  return {
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
    },
    lastQuestMessage: null,
  };
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
