/**
 * Size stage ladder — Human to Tarrasque Matriarch.
 * Upper tiers shift play toward command, influence, and ritual rather than personal mobility.
 */

export const STAGE_BAND = {
  MORTAL: 'mortal',
  HEROIC: 'heroic',
  MYTHIC: 'mythic',
  COLOSSAL: 'colossal',
  WORLD: 'world',
};

export const WEIGHT_STAGES = [
  {
    id: 0, tier: 'human', band: STAGE_BAND.MORTAL, label: 'Human',
    min: 80, color: '#2a8070',
    desc: 'Slender and light — abundance has only begun to gather at the edges.',
  },
  {
    id: 1, tier: 'curvy', band: STAGE_BAND.MORTAL, label: 'Curvy',
    min: 110, color: '#3a8a3a',
    desc: 'Soft curves bloom — hips widen, belly pooching sweetly, cheeks fuller.',
  },
  {
    id: 2, tier: 'plump', band: STAGE_BAND.MORTAL, label: 'Plump',
    min: 140, color: '#6a9a20',
    desc: 'A real belly rounds outward. Thighs press together; clothes strain with pride.',
  },
  {
    id: 3, tier: 'voluptuous', band: STAGE_BAND.MORTAL, label: 'Voluptuous',
    min: 175, color: '#b0a000',
    desc: 'Voluptuous abundance — belly prominent, walk swaying, presence unmistakable.',
  },
  {
    id: 4, tier: 'massive', band: STAGE_BAND.HEROIC, label: 'Massive',
    min: 220, color: '#c07010',
    desc: 'Massive and magnificent — doorways feel narrower, appetite feels divine.',
  },
  {
    id: 5, tier: 'ogre', band: STAGE_BAND.HEROIC, label: 'Ogre',
    min: 280, color: '#b05010',
    desc: 'Ogre-scale softness — belly hangs heavy, strength and size entwined.',
  },
  {
    id: 6, tier: 'giant', band: STAGE_BAND.HEROIC, label: 'Giant',
    min: 350, color: '#982808',
    desc: 'Giant proportions — you tower over mortals, every step a gentle earthquake.',
  },
  {
    id: 7, tier: 'dragon', band: STAGE_BAND.MYTHIC, label: 'Dragon',
    min: 450, color: '#800000',
    desc: 'Dragon-scale immensity — hoarding flesh like treasure, breath warm with indulgence.',
  },
  {
    id: 8, tier: 'leviathan', band: STAGE_BAND.MYTHIC, label: 'Leviathan',
    min: 600, color: '#600000',
    desc: 'Leviathan bulk — halls shrink around you; abundance becomes geography.',
  },
  {
    id: 9, tier: 'behemoth', band: STAGE_BAND.MYTHIC, label: 'Behemoth',
    min: 800, color: '#500000',
    desc: 'Behemoth presence — movement labored, influence effortless, hunger sacred.',
  },
  {
    id: 10, tier: 'great_whale', band: STAGE_BAND.COLOSSAL, label: 'Great Whale',
    min: 1050, color: '#400000',
    desc: 'Great Whale vastness — nearly filling chambers, worship feels natural.',
  },
  {
    id: 11, tier: 'monolith', band: STAGE_BAND.COLOSSAL, label: 'Monolith',
    min: 1400, color: '#300000',
    desc: 'Monolith immensity — truly immobile without magic. Command replaces wandering.',
  },
  {
    id: 12, tier: 'titan', band: STAGE_BAND.WORLD, label: 'Titan',
    min: 1900, color: '#280000',
    desc: 'Titan scale — a landmark of flesh. Realms rearrange around your stillness.',
  },
  {
    id: 13, tier: 'world_mother', band: STAGE_BAND.WORLD, label: 'World Mother',
    min: 2600, color: '#180000',
    desc: 'World Mother — continents feel small. Cults rise in your shadow with quiet devotion.',
  },
  {
    id: 14, tier: 'tarrasque_matriarch', band: STAGE_BAND.WORLD, label: 'Tarrasque Matriarch',
    min: 3500, color: '#100000',
    desc: 'Tarrasque Matriarch — apotheosis of gluttony. Gorgara\'s rival, the world\'s new hunger.',
  },
];

export const STAGE_COUNT = WEIGHT_STAGES.length;
export const MAX_STAGE_ID = STAGE_COUNT - 1;

/** @deprecated Legacy alias — use tier id lookups */
export const LEGACY_STAGE_MAP = {
  slight: 0, slim: 1, soft: 2, chubby: 3, plump: 2, heavy: 4, fat: 5,
  enormous: 8, colossal: 9, blob: 10, leviathan: 8,
};

export function getStage(lbs) {
  for (let i = WEIGHT_STAGES.length - 1; i >= 0; i--) {
    if (lbs >= WEIGHT_STAGES[i].min) return WEIGHT_STAGES[i];
  }
  return WEIGHT_STAGES[0];
}

export function getStageById(id) {
  return WEIGHT_STAGES[Math.max(0, Math.min(id, MAX_STAGE_ID))];
}

export function getTileSize(stageId) {
  if (stageId >= 12) return 4;
  if (stageId >= 9) return 3;
  if (stageId >= 5) return 2;
  return 1;
}

export function getMovement(stageId) {
  if (stageId >= 11) return 0;
  if (stageId >= 9) return 1;
  if (stageId >= 6) return 2;
  if (stageId >= 3) return 3;
  return 4;
}

export function getHpBonus(stageId) {
  if (stageId <= 3) return 0;
  if (stageId <= 6) return 0.3;
  if (stageId <= 9) return 0.8;
  if (stageId <= 11) return 1.5;
  if (stageId <= 13) return 2.5;
  return 4;
}

export function lbsForStage(stageId) {
  const s = getStageById(stageId);
  return s.min + 5;
}

export function advanceStage(character, stages = 1, opts = {}) {
  const current = getStage(character.lbs).id;
  const defaultCap = character?.id === 'player' || character?.isPlayer
    ? (character.sizeCap ?? MAX_STAGE_ID)
    : MAX_STAGE_ID;
  const cap = opts.maxStage ?? defaultCap;
  const next = Math.min(current + stages, cap, MAX_STAGE_ID);
  const startStage = current;
  if (next <= current) {
    return { startStage, endStage: current, stagesJumped: 0, capped: true };
  }
  character.lbs = lbsForStage(next);
  return { startStage, endStage: next, stagesJumped: next - startStage, capped: next >= cap };
}

export function isAtSizeCap(character) {
  const cap = character.sizeCap ?? MAX_STAGE_ID;
  return getStage(character.lbs).id >= cap;
}

export function getNextStage(character) {
  const current = getStage(character.lbs).id;
  if (current >= MAX_STAGE_ID) return null;
  return getStageById(current + 1);
}

export function getStageProgress(lbs) {
  const stage = getStage(lbs);
  const next = getStageById(stage.id + 1);
  if (!next) return { stage, next: null, pct: 100, lbsToNext: 0 };
  const span = next.min - stage.min;
  const into = lbs - stage.min;
  return {
    stage,
    next,
    pct: Math.min(100, Math.round((into / span) * 100)),
    lbsToNext: Math.max(0, next.min - lbs),
  };
}
