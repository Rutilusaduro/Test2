import { registerPool } from '../../engine.js';

registerPool('prestige.rank_up', [
  { when: { prestigeRank: 5 }, text: [
    '★ Prestige V — the continent kneels in paperwork and pastry. You have walked every scaling quest, every companion apotheosis, and the Wheel itself keeps a chair warm for you.',
    '★ Fifth rank of the crowned pilgrimage — abundance made curriculum. Even the gods take notes when you enter a room.',
  ]},
  { when: { prestigeRank: 4 }, text: [
    '★ Prestige IV — scaling quests fall like dominoes, companion milestones glow like votives. The Fat Goddess adds your name to the eternal menu.',
    '★ Fourth rank ascends — you are no longer post-game. You are post-argument. The world agrees.',
  ]},
  { when: { prestigeRank: 3 }, text: [
    '★ Prestige III — half the scaling ladder, half the companion hymns. The continent remembers you in thirds now.',
    '★ Third rank — denouement thickens. Side quests bow; devotion deepens; Lyra checks her blade twice.',
  ]},
  { when: { prestigeRank: 2 }, text: [
    '★ Prestige II — the pilgrimage begins in earnest. Scaling quests and companion arcs answer your knock.',
    '★ Second rank — Act III was the crown. This is the feast that follows the feast.',
  ]},
  { text: [
    '★ Prestige I — the crown still warm, the kitchen still open. Your pilgrimage track unlocks.',
    '★ First rank of prestige — the Fat Goddess winks. "Again, but hungrier."',
  ]},
]);

registerPool('prestige.talent_pick', [
  { when: { prestigeTalent: 'feast_momentum' }, text: [
    '★ Feast Momentum claimed — the first table you bless each day ripples devotion through every companion who walks beside you.',
    '★ You bind momentum to communion: one feast per dawn, party-wide devotion +2. Abundance loves a habit.',
  ]},
  { when: { prestigeTalent: 'cosmic_satiety' }, text: [
    '★ Cosmic Satiety claimed — when you convert the impossible, the Wheel pays you in AP. Once per rest. Gluttony with receipts.',
    '★ Cosmic foes converted leave a satiety echo: +25 AP, once between rests. Even heresy should be filling.',
  ]},
  { when: { prestigeTalent: 'wheel_splinter' }, text: [
    '★ Wheel Splinter claimed — one gate forever ignored. Geography learns your appetite does not queue.',
    '★ You drive a splinter through measured law — one connection gate will never block you again. The road remembers who ate first.',
  ]},
  { text: [
    '★ A permanent prestige talent settles into your legend.',
  ]},
]);
