import { registerPool } from '../../engine.js';

registerPool('levelup.tier', [
  { when: { levelTier: 'aspirant' }, text: [
    'You still stand near the feast\'s beginning, but even now your blessings carry the promise of something immense.',
    'This is the tender first tier of your ascent — local miracles, personal growth, hunger just learning its reach.',
  ]},
  { when: { levelTier: 'heroic' }, text: [
    'You have crossed into a hero\'s abundance. Villages, roads, and rivals will all feel the wake of your appetite now.',
    'The feast graduates from private ecstasy to public force; your power can no longer hide inside small rooms.',
  ]},
  { when: { levelTier: 'mythic' }, text: [
    'Myth gathers around you. The next spells you wield belong in legends, not cautionary tavern gossip.',
    'You have entered a mythic tier of abundance — the kind that bends battles, believers, and horizons alike.',
  ]},
  { when: { levelTier: 'apotheosis' }, text: [
    'This is apotheotic power now. Kingdoms are merely the table settings for the banquet you are becoming.',
    'The final tier opens beneath you like a throne. Mortal limits no longer describe what your abundance can do.',
  ]},
  { when: {}, text: [
    'Another tier of power yields to your hunger.',
  ]},
]);
