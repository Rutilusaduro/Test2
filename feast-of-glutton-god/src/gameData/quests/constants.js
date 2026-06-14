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
  /** Win by trivializing a mundane foe (OPM gag). */
  COMBAT_TRIVIALIZE: 'combat_trivialize',
  FLAG_SET: 'flag_set',
  /** Cumulative: N distinct NPCs gained minStagesGained since quest start. */
  NPC_GROWTH_QUOTA: 'npc_growth_quota',
  /** Any feast interaction in a region (communal abundance). */
  COMMUNAL_FEAST: 'communal_feast',
  /** Solve a region puzzle or feature obstacle. */
  PUZZLE_SOLVED: 'puzzle_solved',
  /** Examine a world feature / place of mystery. */
  FEATURE_EXAMINED: 'feature_examined',
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
  DOMINANCE: 'dominanceScore',
  MERCY: 'mercyScore',
};

/** NPC id aliases for companion ↔ world npc matching in objectives. */
export const QUEST_NPC_ALIASES = {
  elara: ['elara', 'elara_inn'],
  lyra: ['lyra', 'rival_lyra'],
  thalia: ['thalia', 'thalia_witch'],
  mira: ['mira', 'mira_bard'],
  lira: ['lira', 'lira_priestess'],
  sylvie: ['sylvie', 'sylvie_scholar', 'baker_sylvie'],
  greta: ['greta', 'greta_smith'],
  cael: ['cael', 'lumen_diviner'],
  verity: ['verity', 'measured_inquisitor'],
  maribel: ['maribel', 'harvest_priestess'],
};
