import { QUEST_TYPE, QUEST_TAG, OBJECTIVE_TYPE, QUEST_APPROACH, QUEST_SCORE } from '../constants.js';

/**
 * Side quests — intimate, personal abundance stories. Multiple may be active.
 */
export const SIDE_QUESTS = [
  {
    id: 'side_sylvie_flour_and_fullness',
    type: QUEST_TYPE.SIDE,
    title: "Flour and Fullness",
    titleKey: 'quest.side.sylvie.title',
    descriptionKey: 'quest.side.sylvie.desc',
    tags: [QUEST_TAG.ROMANCE, QUEST_TAG.GROWTH, QUEST_TAG.ABUNDANCE],
    region: 'market_square',
    giverNpcId: 'baker_sylvie',

    prerequisites: {
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'shy_cravings',
        title: 'Shy Cravings',
        descriptionKey: 'quest.side.sylvie.stage.shy.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.ROMANCE],
        objectives: [
          {
            id: 'talk_sylvie',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'baker_sylvie',
            count: 2,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
          {
            id: 'flirt_sylvie',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'flirt',
            npcId: 'baker_sylvie',
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 1, [QUEST_SCORE.CONVERSION]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 8, xp: 30 },
          textKey: 'quest.side.sylvie.stage.shy.complete',
        },
      },
      {
        id: 'sweet_indulgence',
        title: 'Sweet Indulgence',
        descriptionKey: 'quest.side.sylvie.stage.sweet.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'feed_sylvie',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'baker_sylvie',
            count: 2,
            growth: { target: 'npc', npcId: 'baker_sylvie', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
          {
            id: 'sylvie_acquaintance',
            type: OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
            npcId: 'baker_sylvie',
            tier: 1,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 12, xp: 40 },
          flags: { sylvie_embracing_appetite: true },
          textKey: 'quest.side.sylvie.stage.sweet.complete',
        },
      },
      {
        id: 'oven_warmth',
        title: 'Oven Warmth',
        descriptionKey: 'quest.side.sylvie.stage.oven.desc',
        approaches: [QUEST_APPROACH.ROMANCE, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'intimate_sylvie',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'intimate',
            npcId: 'baker_sylvie',
            count: 1,
            growth: { target: 'npc', npcId: 'baker_sylvie', stages: 2, proseKey: 'growth.target.intimate' },
            score: { [QUEST_SCORE.ABUNDANCE]: 3 },
          },
          {
            id: 'sylvie_soft',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'baker_sylvie',
            stage: 3,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 15 },
          textKey: 'quest.side.sylvie.stage.oven.complete',
        },
      },
    ],

    endings: [
      {
        id: 'romance_bloom',
        label: 'Romance in Rising Dough',
        condition: { minScores: { [QUEST_SCORE.ABUNDANCE]: 5 } },
        rewards: {
          ap: 25,
          xp: 120,
          playerFlags: { sylvie_romance: true },
          unlockQuests: ['side_vesperia_mask'],
        },
        textKey: 'quest.side.sylvie.ending.romance',
      },
    ],

    rewards: {
      ap: 20,
      xp: 100,
      playerFlags: { sylvie_quest_complete: true },
      textKey: 'quest.side.sylvie.complete.default',
    },
  },

  {
    id: 'side_vesperia_mask',
    type: QUEST_TYPE.SIDE,
    title: 'The Noble Mask',
    titleKey: 'quest.side.vesperia.title',
    descriptionKey: 'quest.side.vesperia.desc',
    tags: [QUEST_TAG.CONVERSION, QUEST_TAG.GROWTH],
    region: 'market_square',
    giverNpcId: 'vesperia',
    hiddenUntilFlags: ['sylvie_romance'],

    prerequisites: {
      flags: ['sylvie_romance'],
      questsCompleted: [],
    },

    stages: [
      {
        id: 'haughty_resistance',
        title: 'Haughty Resistance',
        descriptionKey: 'quest.side.vesperia.stage.haughty.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.FEEDING],
        objectives: [
          {
            id: 'talk_vesperia',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'vesperia',
            count: 2,
          },
          {
            id: 'corrupt_vesperia',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'corrupt',
            npcId: 'vesperia',
            count: 1,
            score: { [QUEST_SCORE.CONVERSION]: 3 },
          },
        ],
        onComplete: {
          rewards: { ap: 10, xp: 35 },
          textKey: 'quest.side.vesperia.stage.haughty.complete',
        },
      },
      {
        id: 'cracked_poise',
        title: 'Cracked Poise',
        descriptionKey: 'quest.side.vesperia.stage.cracked.desc',
        approaches: [QUEST_APPROACH.GROWTH, QUEST_APPROACH.FEEDING],
        objectives: [
          {
            id: 'feed_vesperia',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'vesperia',
            count: 2,
            growth: { target: 'npc', npcId: 'vesperia', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2, [QUEST_SCORE.CONVERSION]: 1 },
          },
          {
            id: 'vesperia_curious',
            type: OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
            npcId: 'vesperia',
            tier: 1,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 15, xp: 50 },
          flags: { vesperia_mask_cracked: true },
          textKey: 'quest.side.vesperia.stage.cracked.complete',
        },
      },
    ],

    rewards: {
      ap: 30,
      xp: 150,
      playerFlags: { vesperia_converted: true },
      textKey: 'quest.side.vesperia.complete.default',
    },
  },
];
