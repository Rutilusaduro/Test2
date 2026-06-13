export const REGIONS = [
  {
    id: "harvest_hearth",
    name: "Harvest's Hearth",
    desc: "A warm farming village where golden wheat fields stretch to the horizon. The scent of fresh bread fills every street.",
    connections: ["fertile_heartlands", "market_square"],
    encounters: ["harvest_harpy", "gluttonous_goblin"],
  },
  {
    id: "market_square",
    name: "Grand Market Square",
    desc: "Bustling stalls overflow with magical delicacies. Merchants compete to feed the faithful of Gorgara.",
    connections: ["harvest_hearth", "fertile_heartlands"],
    encounters: ["rival_adventurer"],
  },
  {
    id: "fertile_heartlands",
    name: "Fertile Heartlands",
    desc: "Rolling hills of impossible fertility. Vinebound dryads tend gardens that never empty.",
    connections: ["harvest_hearth", "gorgara_cradle", "ancient_temple"],
    encounters: ["vinebound_dryad", "harvest_harpy"],
  },
  {
    id: "gorgara_cradle",
    name: "Gorgara's Cradle",
    desc: "Sacred grotto where the Everfull Goddess first stirred. Golden light pulses from deep within.",
    connections: ["fertile_heartlands", "ancient_temple"],
    encounters: ["temple_guardian", "purity_inquisitor"],
  },
  {
    id: "ancient_temple",
    name: "Ancient Temple Ruins",
    desc: "Crumbling marble halls inscribed with feasting rituals. Power still hums in the feast halls.",
    connections: ["fertile_heartlands", "gorgara_cradle"],
    encounters: ["temple_guardian", "famine_hag"],
  },
];

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id) || REGIONS[0];
}
