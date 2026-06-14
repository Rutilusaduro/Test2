/** Puzzle classification — drives UI hints and prose pools. */
export const PUZZLE_TYPE = {
  TRAVERSAL: 'traversal',
  ENVIRONMENTAL: 'environmental',
  SOCIAL: 'social',
  INFORMATION: 'information',
  RITUAL: 'ritual',
};

/** How a solution is attempted — evaluated by puzzleEngine. */
export const SOLUTION_KIND = {
  SKILL_CHECK: 'skill_check',
  SPELL: 'spell',
  PLAYER_STAGE_MIN: 'player_stage_min',
  NPC_RELATIONSHIP_MIN: 'npc_relationship_min',
  COMPANION_HELP: 'companion_help',
  SELF_GROW: 'self_grow',
  AP_SPEND: 'ap_spend',
  FLAG_SET: 'flag_set',
  ABUNDANCE_MIN: 'abundance_min',
};
