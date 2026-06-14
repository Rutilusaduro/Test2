import { MAIN_QUESTS } from './definitions/mainQuests.js';
import { SIDE_QUESTS } from './definitions/sideQuests.js';
import { REDEMPTION_QUESTS } from './definitions/redemptionQuest.js';
import { DIVINE_OPPOSITION_QUESTS } from './definitions/divineOppositionQuests.js';
import { QUEST_TYPE } from './constants.js';

const ALL_QUESTS = [...MAIN_QUESTS, ...SIDE_QUESTS, ...REDEMPTION_QUESTS, ...DIVINE_OPPOSITION_QUESTS];
const BY_ID = Object.fromEntries(ALL_QUESTS.map((q) => [q.id, q]));

export function getQuestDefinition(questId) {
  return BY_ID[questId] ?? null;
}

export function getAllQuests() {
  return ALL_QUESTS;
}

export function getQuestsByType(type) {
  return ALL_QUESTS.filter((q) => q.type === type);
}

export function getMainQuests() {
  return getQuestsByType(QUEST_TYPE.MAIN);
}

export function getSideQuests() {
  return getQuestsByType(QUEST_TYPE.SIDE);
}

export function getQuestsForRegion(regionId) {
  return ALL_QUESTS.filter((q) => q.region === regionId);
}

export function getQuestGiverIds() {
  return [...new Set(ALL_QUESTS.map((q) => q.giverNpcId).filter(Boolean))];
}
