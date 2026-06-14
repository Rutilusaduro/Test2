/**
 * Playable races — each interacts with size stages or growth.
 */
export const RACES = [
  {
    id: 'human',
    name: 'Human',
    epithet: 'The Adaptable',
    desc: 'Versatile and quick to embrace new pleasures. Humans adapt faster than any folk to Gorgara\'s glorious gospel.',
    bodyType: 'hourglass',
    statBonuses: { flexible: 2 },
    features: [
      {
        id: 'hunger_for_more',
        name: 'Hunger for More',
        desc: 'Once per long rest, gain advantage on a growth-related check or save after indulging.',
      },
    ],
  },
  {
    id: 'elf',
    name: 'Elf',
    epithet: 'The Eternal Bloom',
    desc: 'Long-lived beings who view growth as a beautiful, slow unfolding. They trance instead of sleep, dreaming of divine feasts.',
    bodyType: 'pear',
    statBonuses: { dex: 2, cha: 1 },
    features: [
      {
        id: 'graceful_expansion',
        name: 'Graceful Expansion',
        desc: 'At size stage 5+, retain more Dexterity than other races (reduced size penalties).',
      },
    ],
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    epithet: 'The Deep Indulgers',
    desc: 'Sturdy folk who treat feasting and craftsmanship as sacred. Their bellies are temples of patience and pleasure.',
    bodyType: 'apple',
    statBonuses: { con: 2 },
    features: [
      {
        id: 'stout_belly',
        name: 'Stout Belly',
        desc: 'Advantage on Constitution saves related to overindulgence or growth.',
      },
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    epithet: 'The Lucky Curvy Ones',
    desc: 'Small but famously bottom-heavy and lucky at the table. Their curves are blessings, not burdens.',
    bodyType: 'pear',
    statBonuses: { dex: 2, con: 1 },
    features: [
      {
        id: 'lucky_roll',
        name: 'Lucky Roll',
        desc: 'Reroll 1s on growth-related d20 rolls (uses the new roll).',
      },
      {
        id: 'bottom_heavy_blessing',
        name: 'Bottom-Heavy Blessing',
        desc: 'At size stage 5+, gain +1 effective Strength for carrying and stability.',
      },
    ],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    epithet: 'The Mischievous Expanders',
    desc: 'Playful inventors who brew concoctions that cause delightful, giggling growth.',
    bodyType: 'apple',
    statBonuses: { int: 2 },
    features: [
      {
        id: 'tinkerers_indulgence',
        name: 'Tinkerer\'s Indulgence',
        desc: 'Can craft minor growth-inducing items during rests (flavor + future crafting hook).',
      },
    ],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    epithet: 'The Infernal Gluttons',
    desc: 'Descended from beings of excess. Their growth often manifests with pleasurable heat and impossible richness.',
    bodyType: 'voluptuous',
    statBonuses: { cha: 2, int: 1 },
    features: [
      {
        id: 'hellish_appetite',
        name: 'Hellish Appetite',
        desc: 'Food you bless tastes impossibly rich. Resistance to fire damage.',
      },
    ],
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    epithet: 'The Draconic Hoarders',
    desc: 'Proud beings who hoard softness and power instead of gold. Their breath can exhale growth-inducing mist.',
    bodyType: 'athletic',
    statBonuses: { str: 2, cha: 1 },
    features: [
      {
        id: 'draconic_gluttony',
        name: 'Draconic Gluttony',
        desc: 'After a large meal or major growth event, gain +1 temporary size-stage bonus to Strength checks until your next rest.',
      },
    ],
  },
  {
    id: 'half_orc',
    name: 'Half-Orc',
    epithet: 'The Powerful Soft',
    desc: 'Warriors who discover that luxurious size is its own savage strength. Intimidation grows with every sumptuous curve.',
    bodyType: 'athletic',
    statBonuses: { str: 2, con: 1 },
    features: [
      {
        id: 'savage_indulgence',
        name: 'Savage Indulgence',
        desc: 'Can enter a pleasurable overflow rage that boosts growth effects on your next growth action.',
      },
    ],
  },
  {
    id: 'bloomkin',
    name: 'Bloomkin',
    epithet: 'Touched by Gorgara',
    desc: 'Curvy humanoids with floral motifs, born where the Everfull stirs. Living abundance made flesh.',
    bodyType: 'pear',
    statBonuses: { con: 2, cha: 1 },
    features: [
      {
        id: 'living_abundance',
        name: 'Living Abundance',
        desc: 'Begin one size stage fuller than usual. Hit Dice spent on short rests can trigger minor pleasurable growth.',
      },
    ],
    startStageBonus: 1,
  },
];

export function getRace(id) {
  return RACES.find((r) => r.id === id) || RACES[0];
}

export function applyRaceStatBonuses(baseStats, raceId, options = {}) {
  const race = getRace(raceId);
  const stats = { ...baseStats };
  const bonuses = race.statBonuses || {};

  if (bonuses.flexible) {
    const picks = options.humanStatPicks || ['con', 'cha'];
    for (const key of picks.slice(0, bonuses.flexible)) {
      if (stats[key] != null) stats[key] += 1;
    }
  }

  for (const [key, val] of Object.entries(bonuses)) {
    if (key === 'flexible') continue;
    if (stats[key] != null) stats[key] += val;
  }

  return stats;
}
