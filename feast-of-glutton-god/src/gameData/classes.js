export const PLAYER_CLASSES = [
  {
    id: "bard",
    name: "Bard",
    subclass: "Feast-Singer",
    desc: "Weave songs of abundance. Your performances swell allies and charm enemies into surrender.",
    stats: { hp: 28, mp: 20, dex: 14, con: 12, cha: 18, wis: 10, int: 10 },
    startLbs: 130,
    color: "#d4a017",
  },
  {
    id: "wizard",
    name: "Wizard",
    subclass: "School of Overflow",
    desc: "Master arcane caloric manipulation. Transmute magic into irresistible growth.",
    stats: { hp: 22, mp: 28, dex: 10, con: 10, cha: 10, wis: 12, int: 18 },
    startLbs: 125,
    color: "#6b4fc7",
  },
  {
    id: "cleric",
    name: "Cleric",
    subclass: "Domain of Plenty",
    desc: "Channel Gorgara's divine abundance. Bless, heal, and swell the faithful.",
    stats: { hp: 30, mp: 22, dex: 10, con: 14, cha: 14, wis: 18, int: 10 },
    startLbs: 135,
    color: "#c9a227",
  },
  {
    id: "warlock",
    name: "Warlock",
    subclass: "Pact of the Everfull",
    desc: "Draw power from Gorgara's hunger. Drain essence and fuel explosive growth.",
    stats: { hp: 24, mp: 24, dex: 12, con: 12, cha: 16, wis: 10, int: 14 },
    startLbs: 128,
    color: "#8b2252",
  },
];

export function getClass(id) {
  return PLAYER_CLASSES.find((c) => c.id === id) || PLAYER_CLASSES[0];
}
