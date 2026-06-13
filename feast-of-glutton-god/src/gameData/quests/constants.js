/** Quest classification — drives UI grouping and design expectations. */
export const QUEST_TYPE = {
  MAIN: 'main',
  SIDE: 'side',
};

/** Tags surfaced in the quest log for player clarity. */
export const QUEST_TAG = {
  ABUNDANCE: 'abundance',
  CONVERSION: 'conversion',
  ROMANCE: 'romance',
  GROWTH: 'growth',
  COMPANION: 'companion',
};

/** Objective kinds the quest engine resolves via notifyQuestEvent(). */
export const OBJECTIVE_TYPE = {
  NPC_INTERACTION: 'npc_interaction',
  VISIT_REGION: 'visit_region',
  PLAYER_STAGE_MIN: 'player_stage_min',
  NPC_RELATIONSHIP_MIN: 'npc_relationship_min',
  NPC_CORRUPTION_MIN: 'npc_corruption_min',
  NPC_STAGE_MIN: 'npc_stage_min',
  COMBAT_VICTORY: 'combat_victory',
  FLAG_SET: 'flag_set',
};

/** Approach hints for UI — not mechanically enforced. */
export const QUEST_APPROACH = {
  SOCIAL: 'social',
  FEEDING: 'feeding',
  GROWTH: 'growth',
  COMBAT: 'combat',
  ROMANCE: 'romance',
};

/** Scoring axes for branching endings. */
export const QUEST_SCORE = {
  ABUNDANCE: 'abundanceScore',
  CONVERSION: 'conversionScore',
};
