/**
 * The Measured Wheel — homebrew pantheon of balance and moderation.
 * Gorgara is reframed as the Hunger Beyond the Wheel (outside this cosmology).
 */

export const PANTHEON_NAME = 'the Measured Wheel';

export const GORGARA_LORE_TITLE = 'the Hunger Beyond the Wheel';

export const GORGARA_LORE_SHORT =
  'A patron from outside the Wheel whom devotees feed into existence — limitless excess made divine.';

export const PANTHEON_GODS = [
  {
    id: 'aurelan',
    name: 'Aurelan',
    domain: 'Law, kingship, oaths',
    role: 'Leads orthodox opposition; the Church crowns his authority across the Reach.',
    descShort:
      'The high king of gods — scales, crown, and measured justice. His faithful believe excess unbalances the world.',
  },
  {
    id: 'sylwen',
    name: 'Sylwen',
    domain: 'Harvest, measured plenty',
    role: 'Tragic foil; the Fat Goddess is her blasphemous excess made manifest.',
    descShort:
      'Goddess of the harvest and the right-sized meal. Her groves bless fields; her Lean Saint scourges gluttony.',
  },
  {
    id: 'korthak',
    name: 'Korthak',
    domain: 'War, valor, frontier',
    role: 'Patron of the northern marches and soldier-saints who guard the border.',
    descShort:
      'The war-god of disciplined strength — lean, armored, honored in border forts and campaign shrines.',
  },
  {
    id: 'veshanne',
    name: 'Veshanne',
    domain: 'Death, fate, balance',
    role: 'Keeper of barrows, oaths, and the dead god\'s dungeon halls.',
    descShort:
      'She weighs lives and endings. Temples to her mark tombs where old divinity sleeps beneath stone.',
  },
  {
    id: 'lumen',
    name: 'Lumen',
    domain: 'Knowledge, magic, divination',
    role: 'Diviners who first detect the player\'s off-genre anomaly.',
    descShort:
      'God of lantern-light and star-charts. Oracles in his name read what should not fit the Wheel\'s pattern.',
  },
  {
    id: 'tarn',
    name: 'Tarn',
    domain: 'Trade, roads, contracts',
    role: 'Neutral merchant law; courtable when politics need a third party.',
    descShort:
      'Patron of caravans and fair measure. Guild-halls hang his scales above the counting table.',
  },
];

export const GORGARA_PATRON = {
  id: 'gorgara',
  name: 'Gorgara the Everfull',
  loreTitle: GORGARA_LORE_TITLE,
  domain: 'Limitless abundance, pleasurable growth',
  role: 'The player\'s knowingly-fed patron — a hunger from beyond the Wheel, not one of its gods.',
  descShort:
    'Obscure, hungry, adored by you alone at first. The orthodox call her blasphemy; you call her dinner\'s destination.',
};

export function getPantheonGod(id) {
  return PANTHEON_GODS.find((g) => g.id === id) ?? null;
}

export function getPantheon() {
  return {
    name: PANTHEON_NAME,
    gods: PANTHEON_GODS,
    outsider: GORGARA_PATRON,
  };
}
