/**
 * Mechanical outcomes for combat crit hits, fumbles, and save extremes.
 * Narrative hooks via textKey; prose lives in the text engine.
 */

export const ATTACK_CRIT_EFFECTS = {
  melee: {
    textKey: 'combat.crit.attack.melee',
    growthOnTarget: 1,
    corruption: 3,
    description: 'The blow lands with voluptuous force — flesh swells where you strike.',
  },
  ranged: {
    textKey: 'combat.crit.attack.ranged',
    growthOnTarget: 0,
    apGain: 1,
    description: 'A perfect shot — precision and desire intertwine.',
  },
  spell: {
    textKey: 'combat.crit.attack.spell',
    growthOnTarget: 1,
    corruption: 4,
    description: 'Arcane abundance erupts — the target blooms under your magic.',
  },
  default: {
    textKey: 'combat.crit.attack.default',
    growthOnTarget: 1,
    description: 'Critical hit — pleasure and power in equal measure.',
  },
};

export const ATTACK_FUMBLE_EFFECTS = {
  melee: {
    textKey: 'combat.fumble.attack.melee',
    selfGrowth: 1,
    description: 'You overreach with glorious mass — a wobble, a blush, a little extra softness.',
  },
  ranged: {
    textKey: 'combat.fumble.attack.ranged',
    description: 'Your aim drifts — momentarily distracted by how good it feels to wield such power.',
  },
  spell: {
    textKey: 'combat.fumble.attack.spell',
    selfGrowth: 1,
    apCost: 1,
    description: 'The weave hiccups — warmth floods you instead of your target.',
  },
  default: {
    textKey: 'combat.fumble.attack.default',
    selfGrowth: 1,
    description: 'A charming misstep — abundance finds you anyway.',
  },
};

export const SAVE_CRIT_SUCCESS_EFFECTS = {
  default: {
    textKey: 'combat.crit.save.default',
    apGain: 1,
    advantageNext: true,
    description: 'You shrug off the effect with ecstatic poise — untouched and radiant.',
  },
};

export const SAVE_CRIT_FAILURE_EFFECTS = {
  default: {
    textKey: 'combat.fumble.save.default',
    selfGrowth: 1,
    corruption: 2,
    description: 'The sensation overwhelms you — a pleasurable growth surge answers the failure.',
  },
  con: {
    textKey: 'combat.fumble.save.con',
    selfGrowth: 1,
    corruption: 3,
    description: 'Your body surrenders to the swell — growth blooms through delighted gasps.',
  },
  wis: {
    textKey: 'combat.fumble.save.wis',
    selfGrowth: 1,
    corruption: 2,
    description: 'Divine or arcane indulgence floods your senses — you swell, sensitive and smiling.',
  },
};
