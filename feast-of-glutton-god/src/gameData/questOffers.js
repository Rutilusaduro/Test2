/**
 * NPC quest offers — dialogue-driven quest discovery (no auto-start on travel).
 */
import { getAllQuests } from './quests/registry.js';
import { canStartQuest, startQuest, isQuestVisible } from './questEngine.js';
import { QUEST_NPC_ALIASES } from './quests/constants.js';
import { renderQuestOffer } from '../textEngine/scenes/npc/questOffer.js';

export function npcMatchesGiver(npcId, giverNpcId) {
  if (npcId === giverNpcId) return true;
  for (const aliases of Object.values(QUEST_NPC_ALIASES)) {
    const set = new Set(aliases);
    if (set.has(npcId) && set.has(giverNpcId)) return true;
  }
  return false;
}

/** Quests this NPC can offer right now. */
export function getQuestOffersForNpc(game, npc) {
  const npcId = npc?.id;
  if (!npcId) return [];

  return getAllQuests().filter((def) => {
    if (!def.giverNpcId || !npcMatchesGiver(npcId, def.giverNpcId)) return false;
    if (game.quests?.completed?.includes(def.id)) return false;
    if (game.quests?.active?.[def.id]) return false;
    if (!isQuestVisible(game, def.id)) return false;
    return canStartQuest(game, def.id).ok;
  });
}

export function buildQuestOfferNarrative(npc, player, offers) {
  if (!offers?.length) return '';
  return offers.map((def) => renderQuestOffer(npc, player, { questDef: def })).join('\n\n');
}

export function acceptQuestFromNpc(game, questId) {
  return startQuest(game, questId);
}
