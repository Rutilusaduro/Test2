import { QUEST_TYPE, QUEST_TAG, OBJECTIVE_TYPE, QUEST_APPROACH, QUEST_SCORE } from '../constants.js';

/**
 * Main quests — world-shaping abundance arcs. One active main quest recommended
 * at a time; engine does not hard-block multiples but UI prioritizes the earliest.
 */
export const MAIN_QUESTS = [
  {
    id: 'main_everfull_awakening',
    type: QUEST_TYPE.MAIN,
    title: 'The Everfull Awakening',
    titleKey: 'quest.main.awakening.title',
    descriptionKey: 'quest.main.awakening.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.GROWTH, QUEST_TAG.CONVERSION],
    region: 'fertile_heartlands',
    giverNpcId: 'harvest_priestess',
    maxActiveSideQuests: null,

    prerequisites: {
      minPlayerLevel: 1,
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'hear_the_call',
        title: 'Hear the Call',
        descriptionKey: 'quest.main.awakening.stage.hear.desc',
        approaches: [QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'talk_maribel',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'harvest_priestess',
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
          {
            id: 'observe_maribel',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'observe',
            npcId: 'harvest_priestess',
            count: 1,
            optional: true,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 10, xp: 50 },
          flags: { heard_gorgara_call: true },
          textKey: 'quest.main.awakening.stage.hear.complete',
        },
      },
      {
        id: 'spread_the_gospel',
        title: 'Spread the Gospel',
        descriptionKey: 'quest.main.awakening.stage.spread.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.GROWTH, QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'bless_maribel',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'bless',
            npcId: 'harvest_priestess',
            count: 1,
            growth: { target: 'npc', npcId: 'harvest_priestess', stages: 1, proseKey: 'growth.target.blessing' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
          {
            id: 'feed_grikka',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'goblin_queen',
            count: 1,
            growth: { target: 'npc', npcId: 'goblin_queen', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.CONVERSION]: 1 },
          },
          {
            id: 'maribel_friend',
            type: OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
            npcId: 'harvest_priestess',
            tier: 2,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 20, xp: 100 },
          flags: { heartlands_blessed: true },
          textKey: 'quest.main.awakening.stage.spread.complete',
        },
      },
      {
        id: 'awaken_the_cradle',
        title: 'Awaken the Cradle',
        descriptionKey: 'quest.main.awakening.stage.cradle.desc',
        approaches: [QUEST_APPROACH.GROWTH, QUEST_APPROACH.COMBAT],
        objectives: [
          {
            id: 'visit_cradle',
            type: OBJECTIVE_TYPE.VISIT_REGION,
            regionId: 'gorgara_cradle',
            count: 1,
          },
          {
            id: 'bless_maribel_major',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'bless',
            npcId: 'harvest_priestess',
            interactionMeta: { blessType: 'major' },
            count: 1,
            growth: { target: 'npc', npcId: 'harvest_priestess', stages: 2, proseKey: 'growth.target.blessing' },
            score: { [QUEST_SCORE.ABUNDANCE]: 3 },
          },
        ],
        onComplete: {
          rewards: { ap: 30 },
          textKey: 'quest.main.awakening.stage.cradle.complete',
        },
      },
    ],

    endings: [
      {
        id: 'abundant_gospel',
        label: 'Abundant Gospel',
        condition: { minScores: { [QUEST_SCORE.ABUNDANCE]: 5 } },
        rewards: {
          ap: 50,
          xp: 500,
          xpSource: 'major_story',
          unlockRegions: ['gorgara_cradle', 'ancient_temple'],
          worldFlags: { cradle_awakened: true, gorgara_stirring: true },
          playerFlags: { main_act1_abundant: true },
        },
        textKey: 'quest.main.awakening.ending.abundant',
      },
      {
        id: 'converted_hearts',
        label: 'Converted Hearts',
        condition: { minScores: { [QUEST_SCORE.CONVERSION]: 2 } },
        rewards: {
          ap: 40,
          xp: 450,
          xpSource: 'major_story',
          unlockRegions: ['gorgara_cradle'],
          worldFlags: { cradle_awakened: true },
          playerFlags: { main_act1_converted: true },
        },
        textKey: 'quest.main.awakening.ending.converted',
      },
    ],

    rewards: {
      ap: 25,
      xp: 400,
      xpSource: 'major_story',
      unlockRegions: ['gorgara_cradle'],
      worldFlags: { main_act1_complete: true },
      textKey: 'quest.main.awakening.complete.default',
    },
  },
];
