/**
 * Continent regions — full sandbox map nodes with transformation hooks.
 */
export const CONTINENT_NAME = 'The Everfull Continent';

export const REGIONS = [
  {
    id: 'harvest_hearth',
    name: "Harvest's Hearth",
    zone: 'heartlands',
    desc: 'A warm farming village where golden wheat fields stretch to the horizon. The scent of fresh bread fills every street.',
    connections: ['fertile_heartlands', 'market_square', 'northern_marches'],
    encounters: ['harvest_harpy', 'gluttonous_goblin'],
    transformKey: 'hearth',
  },
  {
    id: 'market_square',
    name: 'Grand Market Square',
    zone: 'heartlands',
    desc: 'Bustling stalls overflow with magical delicacies. Merchants compete to feed the faithful of Gorgara.',
    connections: ['harvest_hearth', 'fertile_heartlands', 'sapphire_coast', 'ember_duchy'],
    encounters: ['rival_adventurer', 'gluttonous_goblin'],
    transformKey: 'market',
  },
  {
    id: 'fertile_heartlands',
    name: 'Fertile Heartlands',
    zone: 'heartlands',
    desc: 'Rolling hills of impossible fertility. Vinebound dryads tend gardens that never empty.',
    connections: ['harvest_hearth', 'gorgara_cradle', 'ancient_temple', 'iron_peak_hold'],
    encounters: ['vinebound_dryad', 'harvest_harpy'],
    transformKey: 'heartlands',
  },
  {
    id: 'gorgara_cradle',
    name: "Gorgara's Cradle",
    zone: 'sacred',
    desc: 'Sacred grotto where the Everfull Goddess first stirred. Golden light pulses from deep within.',
    connections: ['fertile_heartlands', 'ancient_temple', 'iron_peak_hold'],
    encounters: ['temple_guardian', 'purity_inquisitor'],
    transformKey: 'cradle',
  },
  {
    id: 'ancient_temple',
    name: 'Ancient Temple Ruins',
    zone: 'sacred',
    desc: 'Crumbling marble halls inscribed with feasting rituals. Power still hums in the feast halls.',
    connections: ['fertile_heartlands', 'gorgara_cradle'],
    encounters: ['temple_guardian', 'famine_hag'],
    transformKey: 'temple',
  },
  {
    id: 'northern_marches',
    name: 'Northern Marches',
    zone: 'frontier',
    desc: 'Wind-scoured borderlands where lean soldiers grumble about "excess" — and secretly crave it.',
    connections: ['harvest_hearth', 'iron_peak_hold'],
    encounters: ['harvest_harpy', 'rival_adventurer'],
    transformKey: 'marches',
    unlockFlag: 'unlock_northern_marches',
  },
  {
    id: 'sapphire_coast',
    name: 'Sapphire Coast',
    zone: 'coastal',
    desc: 'Salt air and spice markets. Nobles parade slim figures while private kitchens overflow.',
    connections: ['market_square', 'ember_duchy'],
    encounters: ['rival_adventurer', 'vinebound_dryad'],
    transformKey: 'coast',
    unlockFlag: 'unlock_sapphire_coast',
  },
  {
    id: 'iron_peak_hold',
    name: 'Iron Peak Hold',
    zone: 'mountain',
    desc: 'A dwarven-human hold in the peaks — forges run hot, ale flows heavy, bellies grow proud.',
    connections: ['fertile_heartlands', 'gorgara_cradle', 'northern_marches', 'ember_duchy'],
    encounters: ['temple_guardian', 'gluttonous_goblin'],
    transformKey: 'iron_peak',
    unlockFlag: 'unlock_iron_peak',
  },
  {
    id: 'ember_duchy',
    name: 'Ember Duchy',
    zone: 'political',
    desc: 'The ducal seat where law and luxury collide. Courtiers hunger behind velvet masks.',
    connections: ['market_square', 'sapphire_coast', 'iron_peak_hold', 'gilded_citadel'],
    encounters: ['rival_adventurer', 'purity_inquisitor'],
    transformKey: 'ember',
    unlockFlag: 'unlock_ember_duchy',
  },
  {
    id: 'gilded_citadel',
    name: 'Gilded Citadel',
    zone: 'religious',
    desc: 'The continent\'s greatest temple-city — where Gorgara\'s church holds absolute sway… for now.',
    connections: ['ember_duchy'],
    encounters: ['purity_inquisitor', 'temple_guardian', 'famine_hag'],
    transformKey: 'citadel',
    unlockFlag: 'unlock_gilded_citadel',
  },
];

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id) || REGIONS[0];
}

export function getRegionsByZone(zone) {
  return REGIONS.filter((r) => r.zone === zone);
}

export function isRegionLocked(game, regionId) {
  const region = getRegion(regionId);
  if (!region.unlockFlag) return false;
  return !game.worldFlags?.[region.unlockFlag]
    && !(game.worldFlags?.regions_unlocked ?? []).includes(regionId);
}
