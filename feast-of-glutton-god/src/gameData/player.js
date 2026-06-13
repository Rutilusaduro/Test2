import { getClass } from "./classes.js";
import { getStage } from "./stages.js";
import { getSpellsForClass } from "./spells.js";
import { createCompanionData, COMPANIONS } from "./companions.js";

export function createPlayer(name, classId) {
  const cls = getClass(classId);
  const stats = cls.stats;
  return {
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
    hp: stats.hp + 10,
    maxHp: stats.hp + 10,
    mp: stats.mp,
    maxMp: stats.mp,
    stats,
    ap: 20,
    xp: 0,
    level: 1,
    gender: "she",
    pronouns: "she",
    storyFlags: {},
    spells: getSpellsForClass(cls.id),
  };
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
  };
}

export function syncPlayerFromCombat(game, combat) {
  const p = combat.allies.find((a) => a.isPlayer);
  if (p) {
    game.player = { ...game.player, lbs: p.lbs, hp: p.hp, maxHp: p.maxHp, mp: p.mp, corruption: p.corruption };
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
  game.player.ap = (game.player.ap || 0) + amount;
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
