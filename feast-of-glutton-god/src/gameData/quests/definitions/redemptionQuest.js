import { QUEST_TYPE, QUEST_TAG, OBJECTIVE_TYPE, QUEST_APPROACH, QUEST_SCORE } from '../constants.js';

/**
 * Redemption side-quest — unlocked when a region crackdown triggers.
 * Completing it clears crackdown and lowers hostility.
 */
export const REDEMPTION_QUESTS = [
  {
    id: 'side_hostility_redemption',
    type: QUEST_TYPE.SIDE,
    title: 'Amends to the Hearth',
    titleKey: 'quest.side.redemption.title',
    descriptionKey: 'quest.side.redemption.desc',
    tags: [QUEST_TAG.ABUNDANCE, QUEST_TAG.GROWTH],
    region: 'harvest_hearth',
    giverNpcId: 'elara_inn',
    hiddenUntilFlags: ['crackdown_active'],
    prerequisites: {
      questsCompleted: [],
      flags: ['crackdown_active'],
    },
    stages: [
      {
        id: 'earn_trust_again',
        title: 'Earn Trust Again',
        descriptionKey: 'quest.side.redemption.stage.earn.desc',
        approaches: [QUEST_APPROACH.SOCIAL, QUEST_APPROACH.FEEDING, QUEST_APPROACH.COMBAT],
        objectives: [
          {
            id: 'communal_amends',
            label: 'Hold a communal feast as amends',
            type: OBJECTIVE_TYPE.COMMUNAL_FEAST,
            count: 1,
            score: { [QUEST_SCORE.MERCY]: 2, [QUEST_SCORE.ABUNDANCE]: 1 },
          },
          {
            id: 'defeat_inquisitor',
            label: 'Defeat a Purity Inquisitor who hunts you',
            type: OBJECTIVE_TYPE.COMBAT_VICTORY,
            enemyId: 'purity_inquisitor',
            count: 1,
            score: { [QUEST_SCORE.DOMINANCE]: 1 },
          },
          {
            id: 'mend_bonds',
            label: 'Speak gently with locals (talk three times)',
            type: OBJECTIVE_TYPE.NPC_INTERACTION,
            interaction: 'talk',
            count: 3,
            score: { [QUEST_SCORE.MERCY]: 1 },
          },
        ],
        onComplete: {
          rewards: { ap: 12, xp: 40 },
          textKey: 'quest.side.redemption.stage.earn.complete',
        },
      },
    ],
    rewards: {
      ap: 15,
      xp: 60,
      worldFlags: { crackdown_active: false },
      textKey: 'quest.side.redemption.complete',
    },
  },
];
