import { QUEST_TYPE, QUEST_TAG, OBJECTIVE_TYPE, QUEST_APPROACH, QUEST_SCORE } from '../constants.js';

/**
 * Divine-response side chain — escalates as Divine Attention climbs (Prompt 3).
 */
export const DIVINE_OPPOSITION_QUESTS = [
  {
    id: 'divine_omen_warning',
    type: QUEST_TYPE.SIDE,
    title: 'Lantern Omen',
    titleKey: 'quest.divine.omen.title',
    descriptionKey: 'quest.divine.omen.desc',
    tags: [QUEST_TAG.ABUNDANCE],
    region: 'gilded_citadel',
    giverNpcId: 'lumen_diviner',
    hiddenUntilFlags: ['act2_gates_unlocked'],

    prerequisites: {
      minDivineAttention: 20,
      flags: [],
      questsCompleted: [],
    },

    stages: [
      {
        id: 'read_the_blank',
        title: 'Read the Blank Hunger',
        descriptionKey: 'quest.divine.omen.stage.read.desc',
        approaches: [QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'counsel_cael',
            label: 'Hear Brother Cael\'s divination of the wrongness',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'lumen_diviner',
            count: 2,
          },
          {
            id: 'witness_omen',
            label: 'Acknowledge the lantern omen (portent registered)',
            type: OBJECTIVE_TYPE.FLAG_SET,
            flag: 'portent_omen_lantern',
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 15, xp: 60 },
          worldFlags: { diviner_warning_heeded: true },
          textKey: 'quest.divine.omen.stage.read.complete',
        },
      },
    ],

    rewards: {
      ap: 20,
      xp: 80,
      textKey: 'quest.divine.omen.complete',
    },
  },

  {
    id: 'divine_inquisition_crackdown',
    type: QUEST_TYPE.SIDE,
    title: 'The Measured Hand Strikes',
    titleKey: 'quest.divine.inquisition.title',
    descriptionKey: 'quest.divine.inquisition.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.GROWTH],
    region: 'ember_duchy',
    giverNpcId: 'measured_inquisitor',
    hiddenUntilFlags: ['inquisition_whispers'],

    prerequisites: {
      minDivineAttention: 40,
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'crackdown',
        title: 'Crackdown',
        descriptionKey: 'quest.divine.inquisition.stage.crackdown.desc',
        approaches: [QUEST_APPROACH.COMBAT, QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'reach_ember',
            label: 'Reach the Ember Duchy checkpoints',
            type: OBJECTIVE_TYPE.VISIT_REGION,
            regionId: 'ember_duchy',
            count: 1,
          },
          {
            id: 'defeat_inquisitors',
            label: 'Break an Inquisition patrol (combat victory)',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'purity_inquisitor',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 2 },
          },
          {
            id: 'parley_verity',
            label: 'Face Sister Verity\'s indictment',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'measured_inquisitor',
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 20, xp: 90 },
          worldFlags: { inquisition_crackdown_survived: true },
          textKey: 'quest.divine.inquisition.stage.crackdown.complete',
        },
      },
    ],

    rewards: {
      ap: 25,
      xp: 100,
      textKey: 'quest.divine.inquisition.complete',
    },
  },

  {
    id: 'divine_sylwen_lament',
    type: QUEST_TYPE.SIDE,
    title: 'Sylwen\'s Tragic Foil',
    titleKey: 'quest.divine.sylwen.title',
    descriptionKey: 'quest.divine.sylwen.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.ROMANCE],
    region: 'fertile_heartlands',
    giverNpcId: 'harvest_priestess',
    hiddenUntilFlags: ['church_schism_rumor'],

    prerequisites: {
      minDivineAttention: 55,
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'measured_tears',
        title: 'Measured Tears',
        descriptionKey: 'quest.divine.sylwen.stage.tears.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.ROMANCE],
        objectives: [
          {
            id: 'maribel_confession',
            label: 'Hear Maribel\'s confession — Sylwen\'s priestess torn in two',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'harvest_priestess',
            count: 2,
            score: { [QUEST_SCORE.MERCY]: 1 },
          },
          {
            id: 'maribel_devotion',
            label: 'Win Maribel\'s conflicted trust (tier 3+)',
            type: OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
            npcId: 'harvest_priestess',
            tier: 3,
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
        ],
        onComplete: {
          rewards: { ap: 18, xp: 85 },
          worldFlags: { sylwen_foil_confronted: true },
          textKey: 'quest.divine.sylwen.stage.tears.complete',
        },
      },
    ],

    rewards: {
      ap: 22,
      xp: 95,
      textKey: 'quest.divine.sylwen.complete',
    },
  },

  {
    id: 'divine_champion_trials',
    type: QUEST_TYPE.SIDE,
    title: 'God-Champion Trials',
    titleKey: 'quest.divine.champions.title',
    descriptionKey: 'quest.divine.champions.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.GROWTH],
    region: 'ancient_temple',
    giverNpcId: 'thalia_witch',
    hiddenUntilFlags: ['refugee_tide'],

    prerequisites: {
      minDivineAttention: 70,
      questsCompleted: ['main_overflowing_temple'],
      flags: [],
    },

    stages: [
      {
        id: 'champions_fall',
        title: 'Champions Fall',
        descriptionKey: 'quest.divine.champions.stage.fall.desc',
        approaches: [QUEST_APPROACH.COMBAT],
        objectives: [
          {
            id: 'defeat_aurelan_champion',
            label: 'Defeat the Scale-Bearer of Aurelan',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'champion_aurelan',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 2 },
          },
          {
            id: 'defeat_lumen_champion',
            label: 'Defeat the Lantern Ascetic of Lumen',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'champion_lumen',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 2 },
          },
          {
            id: 'defeat_korthak_champion',
            label: 'Defeat the War-Saint of Korthak (optional)',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'champion_korthak',
            count: 1,
            optional: true,
            score: { [QUEST_SCORE.DOMINANCE]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 35, xp: 150 },
          worldFlags: { god_champions_broken: true },
          textKey: 'quest.divine.champions.stage.fall.complete',
        },
      },
    ],

    rewards: {
      ap: 40,
      xp: 180,
      textKey: 'quest.divine.champions.complete',
    },
  },

  {
    id: 'divine_council_stand',
    type: QUEST_TYPE.SIDE,
    title: 'The Divine Council Answers',
    titleKey: 'quest.divine.council.title',
    descriptionKey: 'quest.divine.council.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.GROWTH],
    region: 'gorgara_cradle',
    giverNpcId: 'thalia_witch',
    hiddenUntilFlags: ['divine_council'],

    prerequisites: {
      minDivineAttention: 85,
      questsCompleted: ['divine_champion_trials'],
      flags: ['act3_gates_unlocked'],
    },

    stages: [
      {
        id: 'avatar_breach',
        title: 'Avatar Breach',
        descriptionKey: 'quest.divine.council.stage.avatar.desc',
        approaches: [QUEST_APPROACH.COMBAT],
        objectives: [
          {
            id: 'defeat_wheel_avatar',
            label: 'Shatter the Avatar of the Measured Wheel',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'wheel_avatar',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 3 },
          },
        ],
        onComplete: {
          rewards: { ap: 45, xp: 200 },
          worldFlags: { wheel_avatar_shattered: true },
          textKey: 'quest.divine.council.stage.avatar.complete',
        },
      },
    ],

    rewards: {
      ap: 50,
      xp: 220,
      worldFlags: { divine_council_answered: true },
      textKey: 'quest.divine.council.complete',
    },
  },
];
