import { QUEST_TYPE, QUEST_TAG, OBJECTIVE_TYPE, QUEST_APPROACH, QUEST_SCORE } from '../constants.js';

/**
 * Side quests — intimate, personal abundance stories.
 */
export const SIDE_QUESTS = [
  {
    id: 'side_bakers_indulgence',
    type: QUEST_TYPE.SIDE,
    title: "The Baker's Indulgence",
    titleKey: 'quest.side.baker.title',
    descriptionKey: 'quest.side.baker.desc',
    tags: [QUEST_TAG.ROMANCE, QUEST_TAG.GROWTH, QUEST_TAG.ABUNDANCE],
    region: 'market_square',
    giverNpcId: 'baker_sylvie',

    prerequisites: {
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'hidden_cravings',
        title: 'Hidden Cravings',
        descriptionKey: 'quest.side.baker.stage.cravings.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.ROMANCE],
        objectives: [
          {
            id: 'talk_sylvie',
            label: 'Spend time talking with Sylvie',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'baker_sylvie',
            count: 2,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
          {
            id: 'flirt_sylvie',
            label: 'Flirt until her cheeks flush sweeter than shame',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'flirt',
            npcId: 'baker_sylvie',
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 8, xp: 30 },
          textKey: 'quest.side.baker.stage.cravings.complete',
        },
      },
      {
        id: 'decadent_creations',
        title: 'Decadent Creations',
        descriptionKey: 'quest.side.baker.stage.decadent.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'feed_sylvie',
            label: 'Feed Sylvie decadent pastries',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'baker_sylvie',
            count: 3,
            growth: { target: 'npc', npcId: 'baker_sylvie', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
          {
            id: 'sylvie_first_growth',
            label: 'Guide Sylvie to soft fullness (stage 2+)',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'baker_sylvie',
            stage: 2,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 12, xp: 45 },
          flags: { sylvie_embracing_appetite: true },
          textKey: 'quest.side.baker.stage.decadent.complete',
        },
      },
      {
        id: 'joyful_release',
        title: 'Joyful Release',
        descriptionKey: 'quest.side.baker.stage.release.desc',
        approaches: [QUEST_APPROACH.ROMANCE, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'intimate_sylvie',
            label: 'Share intimacy among rising dough',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'intimate',
            npcId: 'baker_sylvie',
            count: 1,
            growth: { target: 'npc', npcId: 'baker_sylvie', stages: 2, proseKey: 'growth.target.intimate' },
            score: { [QUEST_SCORE.ABUNDANCE]: 3 },
          },
          {
            id: 'sylvie_chubby',
            label: 'Help Sylvie reach chubby joy (stage 3+)',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'baker_sylvie',
            stage: 3,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 15 },
          textKey: 'quest.side.baker.stage.release.complete',
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
          playerFlags: { sylvie_romance: true, sylvie_vendor_unlocked: true },
          npcRelationship: { npcId: 'baker_sylvie', source: 'quest_romance', amount: 20 },
        },
        textKey: 'quest.side.baker.ending.romance',
      },
    ],

    rewards: {
      ap: 20,
      xp: 100,
      playerFlags: { sylvie_quest_complete: true },
      textKey: 'quest.side.baker.complete.default',
    },
  },

  {
    id: 'side_duel_of_curves',
    type: QUEST_TYPE.SIDE,
    title: 'The Duel of Curves',
    titleKey: 'quest.side.duel.title',
    descriptionKey: 'quest.side.duel.desc',
    tags: [QUEST_TAG.GROWTH, QUEST_TAG.ABUNDANCE],
    region: 'market_square',
    giverNpcId: 'rival_lyra',

    prerequisites: {
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'challenge_issued',
        title: 'Challenge Issued',
        descriptionKey: 'quest.side.duel.stage.challenge.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.COMBAT],
        objectives: [
          {
            id: 'provoke_lyra',
            label: 'Trade words with Lyra Swiftblade',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'rival_lyra',
            count: 2,
          },
          {
            id: 'observe_lyra',
            label: 'Study her lean, proud frame',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'observe',
            npcId: 'rival_lyra',
            count: 1,
            optional: true,
          },
        ],
        onComplete: {
          rewards: { ap: 5, xp: 25 },
          textKey: 'quest.side.duel.stage.challenge.complete',
        },
      },
      {
        id: 'the_duel',
        title: 'The Duel',
        descriptionKey: 'quest.side.duel.stage.duel.desc',
        approaches: [QUEST_APPROACH.COMBAT, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'defeat_lyra',
            label: 'Win or convert Lyra in combat',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'rival_adventurer',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 2 },
          },
        ],
        onComplete: {
          rewards: { ap: 15, xp: 80 },
          textKey: 'quest.side.duel.stage.duel.complete',
        },
      },
      {
        id: 'soft_power',
        title: 'Soft Power',
        descriptionKey: 'quest.side.duel.stage.after.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'feed_lyra',
            label: 'Help Lyra savor her new softness',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'rival_lyra',
            count: 2,
            growth: { target: 'npc', npcId: 'rival_lyra', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2, [QUEST_SCORE.MERCY]: 1 },
          },
          {
            id: 'lyra_softened',
            label: 'Guide Lyra to soft abundance (stage 2+)',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'rival_lyra',
            stage: 2,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 12 },
          flags: { lyra_training_unlocked: true },
          textKey: 'quest.side.duel.stage.after.complete',
        },
      },
    ],

    endings: [
      {
        id: 'rival_lover',
        label: 'Rival Lover',
        condition: { minScores: { [QUEST_SCORE.ABUNDANCE]: 2, [QUEST_SCORE.MERCY]: 1 } },
        rewards: {
          ap: 20,
          xp: 100,
          playerFlags: { lyra_romance: true },
        },
        textKey: 'quest.side.duel.ending.lover',
      },
      {
        id: 'worthy_rival',
        label: 'Worthy Rival',
        condition: { minScores: { [QUEST_SCORE.DOMINANCE]: 2 } },
        rewards: {
          ap: 18,
          xp: 90,
          playerFlags: { lyra_ally: true },
        },
        textKey: 'quest.side.duel.ending.rival',
      },
    ],

    rewards: {
      ap: 15,
      xp: 75,
      playerFlags: { duel_of_curves_complete: true },
      textKey: 'quest.side.duel.complete.default',
    },
  },

  {
    id: 'side_night_shared_abundance',
    type: QUEST_TYPE.SIDE,
    title: 'A Night of Shared Abundance',
    titleKey: 'quest.side.night.title',
    descriptionKey: 'quest.side.night.desc',
    tags: [QUEST_TAG.ROMANCE, QUEST_TAG.GROWTH, QUEST_TAG.COMPANION],
    region: 'harvest_hearth',
    giverNpcId: 'elara_inn',

    prerequisites: {
      minPlayerStage: 2,
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'quiet_invitation',
        title: 'Quiet Invitation',
        descriptionKey: 'quest.side.night.stage.invite.desc',
        approaches: [QUEST_APPROACH.ROMANCE, QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'elara_trust',
            label: 'Deepen trust with Elara',
            type: OBJECTIVE_TYPE.NPC_RELATIONSHIP_MIN,
            npcId: 'elara',
            tier: 3,
            count: 1,
          },
          {
            id: 'talk_elara',
            label: 'Accept her private invitation to talk',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'elara',
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 8, xp: 35 },
          textKey: 'quest.side.night.stage.invite.complete',
        },
      },
      {
        id: 'evening_of_indulgence',
        title: 'Evening of Indulgence',
        descriptionKey: 'quest.side.night.stage.evening.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.ROMANCE, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'feast_with_elara',
            label: 'Share a private feast together',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feast',
            npcId: 'elara',
            count: 1,
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
          {
            id: 'feed_elara',
            label: 'Feed Elara with devoted care',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'elara',
            count: 2,
            growth: { target: 'npc', npcId: 'elara', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 12, xp: 50 },
          textKey: 'quest.side.night.stage.evening.complete',
        },
      },
      {
        id: 'mutual_growth',
        title: 'Mutual Growth',
        descriptionKey: 'quest.side.night.stage.mutual.desc',
        approaches: [QUEST_APPROACH.ROMANCE, QUEST_APPROACH.GROWTH],
        objectives: [
          {
            id: 'intimate_elara',
            label: 'Share vulnerable, pleasurable intimacy',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'intimate',
            npcId: 'elara',
            count: 1,
            growth: { target: 'npc', npcId: 'elara', stages: 2, proseKey: 'growth.target.intimate' },
            score: { [QUEST_SCORE.ABUNDANCE]: 3 },
          },
          {
            id: 'elara_new_stage',
            label: 'Help Elara reach a new size stage joyfully',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'elara',
            stage: 4,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 18 },
          textKey: 'quest.side.night.stage.mutual.complete',
        },
      },
    ],

    rewards: {
      ap: 25,
      xp: 110,
      playerFlags: { elara_romance_advanced: true, shared_abundance_complete: true },
      npcRelationship: { npcId: 'elara', source: 'quest_romance', amount: 15 },
      textKey: 'quest.side.night.complete.default',
    },
  },

  {
    id: 'side_reluctant_noblewoman',
    type: QUEST_TYPE.SIDE,
    title: 'The Reluctant Noblewoman',
    titleKey: 'quest.side.noblewoman.title',
    descriptionKey: 'quest.side.noblewoman.desc',
    tags: [QUEST_TAG.CONVERSION, QUEST_TAG.GROWTH, QUEST_TAG.ABUNDANCE],
    region: 'market_square',
    giverNpcId: 'vesperia',

    prerequisites: {
      questsCompleted: [],
      flags: [],
    },

    stages: [
      {
        id: 'haughty_gates',
        title: 'Haughty Gates',
        descriptionKey: 'quest.side.noblewoman.stage.gates.desc',
        approaches: [QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'talk_vesperia',
            label: 'Gain audience with Lady Vesperia',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            npcId: 'vesperia',
            count: 2,
            score: { [QUEST_SCORE.ABUNDANCE]: 1 },
          },
          {
            id: 'flatter_vesperia',
            label: 'Flatter her poise until cracks show',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'flirt',
            npcId: 'vesperia',
            count: 1,
            score: { [QUEST_SCORE.CONVERSION]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 10, xp: 35 },
          textKey: 'quest.side.noblewoman.stage.gates.complete',
        },
      },
      {
        id: 'escalating_encounters',
        title: 'Escalating Encounters',
        descriptionKey: 'quest.side.noblewoman.stage.escalate.desc',
        approaches: [QUEST_APPROACH.FEEDING, QUEST_APPROACH.GROWTH, QUEST_APPROACH.SOCIAL],
        objectives: [
          {
            id: 'feed_vesperia',
            label: 'Feed Vesperia in secret',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'feed',
            npcId: 'vesperia',
            count: 2,
            growth: { target: 'npc', npcId: 'vesperia', stages: 1, proseKey: 'growth.target.feeding' },
            score: { [QUEST_SCORE.ABUNDANCE]: 2 },
          },
          {
            id: 'corrupt_vesperia',
            label: 'Whisper Gorgara\'s gospel past her pride',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'corrupt',
            npcId: 'vesperia',
            count: 1,
            score: { [QUEST_SCORE.CONVERSION]: 2, [QUEST_SCORE.DOMINANCE]: 1 },
          },
          {
            id: 'vesperia_curious',
            label: 'Stir Vesperia\'s curiosity',
            type: OBJECTIVE_TYPE.NPC_CORRUPTION_MIN,
            npcId: 'vesperia',
            tier: 1,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 15, xp: 55 },
          flags: { vesperia_estate_open: true },
          textKey: 'quest.side.noblewoman.stage.escalate.complete',
        },
      },
      {
        id: 'dramatic_transformation',
        title: 'Dramatic Transformation',
        descriptionKey: 'quest.side.noblewoman.stage.transform.desc',
        approaches: [QUEST_APPROACH.GROWTH, QUEST_APPROACH.ROMANCE],
        objectives: [
          {
            id: 'bless_vesperia',
            label: 'Bless Vesperia with decadent abundance',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'bless',
            npcId: 'vesperia',
            interactionMeta: { blessType: 'major' },
            count: 1,
            growth: { target: 'npc', npcId: 'vesperia', stages: 2, proseKey: 'growth.target.blessing' },
            score: { [QUEST_SCORE.ABUNDANCE]: 3 },
          },
          {
            id: 'vesperia_plump',
            label: 'Guide her to plump, pleasurable softness',
            type: OBJECTIVE_TYPE.NPC_STAGE_MIN,
            npcId: 'vesperia',
            stage: 4,
            count: 1,
          },
        ],
        onComplete: {
          rewards: { ap: 18 },
          textKey: 'quest.side.noblewoman.stage.transform.complete',
        },
      },
    ],

    rewards: {
      ap: 30,
      xp: 150,
      playerFlags: { vesperia_converted: true, vesperia_political_ally: true },
      textKey: 'quest.side.noblewoman.complete.default',
    },
  },
];
