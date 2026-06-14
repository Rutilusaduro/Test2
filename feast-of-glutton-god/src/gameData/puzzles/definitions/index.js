import { PUZZLE_TYPE, SOLUTION_KIND } from '../constants.js';

/**
 * Region puzzles — multiple valid solutions per obstacle.
 * stateFlag in worldFlags marks completion; examinedFlag tracks discovery.
 */
export const REGION_PUZZLES = [
  {
    id: 'cellar_abundance_vault',
    regionId: 'harvest_hearth',
    featureId: 'hearth_cellar_door',
    title: 'The Abundance Cellar',
    type: PUZZLE_TYPE.ENVIRONMENTAL,
    stateFlag: 'puzzle_cellar_vault_solved',
    examinedFlag: 'puzzle_cellar_vault_examined',
    desc: 'A heavy oak door seals Elara\'s legendary reserve cellar — pastries too sacred for ordinary hands.',
    solutions: [
      {
        id: 'grace_pick',
        label: 'Pick the lock with velvet patience',
        hint: 'Grace and finesse can coax stubborn wood.',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'grace',
        dc: 13,
        onSolve: {
          textKey: 'puzzle.solve.cellar_grace',
          rewards: { ap: 5, xp: 25 },
        },
      },
      {
        id: 'rich_cream_soften',
        label: 'Soften the wood with Rich Cream',
        hint: 'Abundance magic makes oak yield like warm butter.',
        kind: SOLUTION_KIND.SPELL,
        spellIds: ['rich_cream', 'softening_ray'],
        environmentTags: ['soften'],
        onSolve: {
          textKey: 'puzzle.solve.cellar_cream',
          rewards: { ap: 3, xp: 20 },
        },
      },
      {
        id: 'shoulder_door',
        label: 'Shoulder the door with plush mass',
        hint: 'A truly plump body turns stubborn timber into suggestion.',
        kind: SOLUTION_KIND.PLAYER_STAGE_MIN,
        stage: 4,
        onSolve: {
          textKey: 'puzzle.solve.cellar_shoulder',
          rewards: { xp: 30 },
        },
      },
      {
        id: 'elara_key',
        label: 'Ask Elara for the cellar key',
        hint: 'A close bond with the innkeeper opens every pantry.',
        kind: SOLUTION_KIND.NPC_RELATIONSHIP_MIN,
        npcId: 'elara_inn',
        tier: 2,
        onSolve: {
          textKey: 'puzzle.solve.cellar_elara',
          rewards: { ap: 8 },
        },
      },
    ],
    onSolve: {
      worldFlags: { hearth_cellar_open: true },
    },
  },
  {
    id: 'vesperia_garden_gate',
    regionId: 'market_square',
    featureId: 'vesperia_iron_gate',
    title: 'Lady Vesperia\'s Iron Gate',
    type: PUZZLE_TYPE.SOCIAL,
    stateFlag: 'puzzle_vesperia_gate_solved',
    examinedFlag: 'puzzle_vesperia_gate_examined',
    desc: 'An ornate iron gate guards Vesperia\'s private garden of rare delicacies — only the charming or the clever pass.',
    solutions: [
      {
        id: 'persuade_guard',
        label: 'Persuade the gatekeeper with honeyed words',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'persuade',
        dc: 14,
        onSolve: {
          textKey: 'puzzle.solve.vesperia_persuade',
          rewards: { xp: 25 },
        },
      },
      {
        id: 'charm_spell',
        label: 'Charm the iron with enchantment',
        kind: SOLUTION_KIND.SPELL,
        spellIds: ['feasts_whisper', 'jiggle_charm', 'overflowing_charm', 'honeyed_overflow'],
        environmentTags: ['charm'],
        onSolve: {
          textKey: 'puzzle.solve.vesperia_charm',
          rewards: { xp: 30 },
        },
      },
      {
        id: 'vesperia_trust',
        label: 'Call upon Vesperia\'s growing trust',
        kind: SOLUTION_KIND.NPC_RELATIONSHIP_MIN,
        npcId: 'vesperia',
        tier: 2,
        onSolve: {
          textKey: 'puzzle.solve.vesperia_trust',
          rewards: { ap: 10 },
        },
      },
      {
        id: 'perform_distraction',
        label: 'Perform a dazzling distraction',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'perform',
        dc: 12,
        onSolve: {
          textKey: 'puzzle.solve.vesperia_perform',
          rewards: { xp: 20 },
        },
      },
    ],
    onSolve: {
      worldFlags: { vesperia_garden_open: true },
    },
  },
  {
    id: 'choked_ravine',
    regionId: 'fertile_heartlands',
    featureId: 'swollen_ravine',
    title: 'The Swollen Ravine',
    type: PUZZLE_TYPE.TRAVERSAL,
    stateFlag: 'puzzle_choked_ravine_solved',
    examinedFlag: 'puzzle_choked_ravine_examined',
    desc: 'A gorge choked with overgrown vines and swollen fruit blocks the path toward Gorgara\'s Cradle.',
    gateId: 'gate_heartlands_cradle',
    solutions: [
      {
        id: 'living_bridge',
        label: 'Span the gorge with your living bridge of flesh',
        hint: 'Grow enormous — your body becomes the crossing.',
        kind: SOLUTION_KIND.PLAYER_STAGE_MIN,
        stage: 6,
        onSolve: {
          textKey: 'puzzle.solve.ravine_bridge',
          rewards: { xp: 50 },
        },
      },
      {
        id: 'self_feed_grow',
        label: 'Self-feed until you can reach across',
        hint: 'Indulge yourself here and now — abundance answers hunger.',
        kind: SOLUTION_KIND.SELF_GROW,
        stages: 2,
        apCost: 10,
        minStage: 4,
        onSolve: {
          textKey: 'puzzle.solve.ravine_self_feed',
          rewards: { xp: 40 },
        },
      },
      {
        id: 'cream_slick',
        label: 'Flood the ravine with slick abundance',
        kind: SOLUTION_KIND.SPELL,
        spellIds: ['rich_cream', 'banquet_mist', 'glutinous_surge'],
        environmentTags: ['slick', 'soften', 'fertile'],
        onSolve: {
          textKey: 'puzzle.solve.ravine_cream',
          rewards: { xp: 35 },
        },
      },
      {
        id: 'lira_blessing',
        label: 'Ask Lira to bless a vine bridge',
        kind: SOLUTION_KIND.NPC_RELATIONSHIP_MIN,
        npcId: 'lira_priestess',
        tier: 2,
        onSolve: {
          textKey: 'puzzle.solve.ravine_lira',
          rewards: { ap: 8 },
        },
      },
      {
        id: 'endure_climb',
        label: 'Clamber through the swollen vines',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'endure_growth',
        dc: 15,
        onSolve: {
          textKey: 'puzzle.solve.ravine_climb',
          rewards: { xp: 30 },
        },
      },
    ],
    onSolve: {
      unlockRegions: [],
      worldFlags: { ravine_crossed: true },
    },
  },
  {
    id: 'sacred_pool_rite',
    regionId: 'gorgara_cradle',
    featureId: 'gorgara_sacred_pool',
    title: 'The Sacred Pool of First Hunger',
    type: PUZZLE_TYPE.RITUAL,
    stateFlag: 'puzzle_sacred_pool_solved',
    examinedFlag: 'puzzle_sacred_pool_examined',
    desc: 'Golden water stirs in the grotto pool — it waits for abundance to be poured into the world before it reveals its depths.',
    solutions: [
      {
        id: 'abundance_offering',
        label: 'Offer your spreading abundance to the pool',
        kind: SOLUTION_KIND.ABUNDANCE_MIN,
        points: 50,
        onSolve: {
          textKey: 'puzzle.solve.pool_abundance',
          rewards: { ap: 15, xp: 40 },
        },
      },
      {
        id: 'banquet_mist_rite',
        label: 'Perfume the grotto with Banquet Mist',
        kind: SOLUTION_KIND.SPELL,
        spellIds: ['banquet_mist', 'feast_of_the_goddess', 'divine_plump'],
        environmentTags: ['fertile', 'ritual'],
        onSolve: {
          textKey: 'puzzle.solve.pool_mist',
          rewards: { xp: 45 },
        },
      },
      {
        id: 'indulge_rite',
        label: 'Perform the indulgence rite at the water\'s edge',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'indulge',
        dc: 14,
        onSolve: {
          textKey: 'puzzle.solve.pool_indulge',
          rewards: { xp: 35 },
        },
      },
      {
        id: 'thalia_guidance',
        label: 'Let Thalia guide the rite',
        kind: SOLUTION_KIND.COMPANION_HELP,
        companionId: 'thalia',
        tier: 3,
        onSolve: {
          textKey: 'puzzle.solve.pool_thalia',
          rewards: { ap: 12 },
        },
      },
    ],
    onSolve: {
      worldFlags: { sacred_pool_awakened: true },
    },
  },
  {
    id: 'collapsed_feast_arch',
    regionId: 'ancient_temple',
    featureId: 'fallen_marble_arch',
    title: 'The Fallen Feast Arch',
    type: PUZZLE_TYPE.TRAVERSAL,
    stateFlag: 'puzzle_feast_arch_solved',
    examinedFlag: 'puzzle_feast_arch_examined',
    desc: 'A marble arch carved with feasting gods has collapsed, sealing the inner sanctum where rituals of growth still hum.',
    solutions: [
      {
        id: 'overwhelm_stone',
        label: 'Overwhelm the rubble with divine presence',
        kind: SOLUTION_KIND.SKILL_CHECK,
        skillId: 'overwhelm',
        dc: 14,
        onSolve: {
          textKey: 'puzzle.solve.arch_overwhelm',
          rewards: { xp: 35 },
        },
      },
      {
        id: 'pressure_crush',
        label: 'Crush stone with Pleasurable Pressure',
        kind: SOLUTION_KIND.SPELL,
        spellIds: ['pleasurable_pressure', 'form_of_abundance', 'true_overflow'],
        environmentTags: ['crush', 'swell'],
        onSolve: {
          textKey: 'puzzle.solve.arch_pressure',
          rewards: { xp: 45 },
        },
      },
      {
        id: 'greta_forge',
        label: 'Ask Greta to forge a breach',
        kind: SOLUTION_KIND.COMPANION_HELP,
        companionId: 'greta',
        tier: 2,
        onSolve: {
          textKey: 'puzzle.solve.arch_greta',
          rewards: { ap: 10 },
        },
      },
      {
        id: 'enormous_squeeze',
        label: 'Squeeze your enormous form through the gap',
        hint: 'Size has a price in tight halls — but immensity finds a way.',
        kind: SOLUTION_KIND.PLAYER_STAGE_MIN,
        stage: 8,
        onSolve: {
          textKey: 'puzzle.solve.arch_squeeze',
          rewards: { xp: 50 },
        },
      },
      {
        id: 'sylvie_lore',
        label: 'Recite the arch\'s feasting inscription with Sylvie',
        kind: SOLUTION_KIND.COMPANION_HELP,
        companionId: 'sylvie',
        tier: 2,
        onSolve: {
          textKey: 'puzzle.solve.arch_sylvie',
          rewards: { xp: 40 },
        },
      },
    ],
    onSolve: {
      worldFlags: { feast_arch_cleared: true },
    },
  },
];
