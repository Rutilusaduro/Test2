/**
 * Continent regions — full sandbox map nodes with transformation hooks.
 */
export const CONTINENT_NAME = 'the Aurelan Reach';

export const REGIONS = [
  {
    id: 'harvest_hearth',
    name: "Harvest's Hearth",
    zone: 'heartlands',
    desc: 'A warm frontier farming village where golden wheat rolls to the horizon and every oven competes with the next.',
    connections: ['fertile_heartlands', 'market_square', 'northern_marches'],
    encounters: ['harvest_harpy', 'gluttonous_goblin'],
    transformKey: 'hearth',
  },
  {
    id: 'market_square',
    name: 'Grand Market Square',
    zone: 'heartlands',
    desc: 'A classic trade city — guild law, spice routes, and merchants who measure coin and consequence with equal care.',
    connections: ['harvest_hearth', 'fertile_heartlands', 'sapphire_coast', 'ember_duchy'],
    encounters: ['rival_adventurer', 'gluttonous_goblin'],
    transformKey: 'market',
  },
  {
    id: 'fertile_heartlands',
    name: 'Fertile Heartlands',
    zone: 'heartlands',
    desc: 'Rolling pastoral countryside and a sacred grove of Sylwen, harvest-goddess of measured plenty.',
    connections: ['harvest_hearth', 'gorgara_cradle', 'ancient_temple', 'iron_peak_hold'],
    encounters: ['vinebound_dryad', 'harvest_harpy'],
    transformKey: 'heartlands',
  },
  {
    id: 'gorgara_cradle',
    name: 'Shrine of the Thin Veil',
    zone: 'sacred',
    desc: 'Your hidden shrine — a thin place where the Measured Wheel leaks and your patron listens closest.',
    connections: ['fertile_heartlands', 'ancient_temple', 'iron_peak_hold', 'divine_plane_vestibule'],
    encounters: ['temple_guardian', 'purity_inquisitor'],
    transformKey: 'cradle',
  },
  {
    id: 'ancient_temple',
    name: 'Ancient Temple Ruins',
    zone: 'sacred',
    desc: 'A dead god\'s barrow — crumbling marble halls, classic dungeon silence, and oaths to Veshanne carved deep.',
    connections: ['fertile_heartlands', 'gorgara_cradle', 'barrow_deeps'],
    encounters: ['temple_guardian', 'famine_hag'],
    transformKey: 'temple',
  },
  {
    id: 'northern_marches',
    name: 'Northern Marches',
    zone: 'frontier',
    desc: 'Wind-scoured frontier warholds where Korthak\'s soldiers drill, patrol, and pray for measured strength.',
    connections: ['harvest_hearth', 'iron_peak_hold'],
    encounters: ['harvest_harpy', 'rival_adventurer'],
    transformKey: 'marches',
    unlockFlag: 'unlock_northern_marches',
  },
  {
    id: 'sapphire_coast',
    name: 'Sapphire Coast',
    zone: 'coastal',
    desc: 'Prim coastal nobility — salt air, spice markets, and courtly intrigue behind gilded balconies.',
    connections: ['market_square', 'ember_duchy'],
    encounters: ['rival_adventurer', 'vinebound_dryad'],
    transformKey: 'coast',
    unlockFlag: 'unlock_sapphire_coast',
  },
  {
    id: 'iron_peak_hold',
    name: 'Iron Peak Hold',
    zone: 'mountain',
    desc: 'A dwarven forge-hold in the peaks — hammers ring, ale flows, and the mountain keeps its own honest laws.',
    connections: ['fertile_heartlands', 'gorgara_cradle', 'northern_marches', 'ember_duchy'],
    encounters: ['temple_guardian', 'gluttonous_goblin'],
    transformKey: 'iron_peak',
    unlockFlag: 'unlock_iron_peak',
  },
  {
    id: 'ember_duchy',
    name: 'Ember Duchy',
    zone: 'political',
    desc: 'The ducal seat where succession, law, and velvet-masked politics decide who rules the heartlands.',
    connections: ['market_square', 'sapphire_coast', 'iron_peak_hold', 'gilded_citadel'],
    encounters: ['rival_adventurer', 'purity_inquisitor'],
    transformKey: 'ember',
    unlockFlag: 'unlock_ember_duchy',
  },
  {
    id: 'gilded_citadel',
    name: 'Gilded Citadel',
    zone: 'religious',
    desc: 'The pantheon\'s temple-capital — Aurelan\'s high cathedral, the Church\'s law, and the Wheel\'s orthodox heart.',
    connections: ['ember_duchy', 'gilded_citadel_inner'],
    encounters: ['purity_inquisitor', 'temple_guardian', 'famine_hag'],
    transformKey: 'citadel',
    unlockFlag: 'unlock_gilded_citadel',
  },
  {
    id: 'barrow_deeps',
    name: 'The Barrow Deeps',
    zone: 'sacred',
    desc: 'The underground extension of the Ancient Temple — Veshanne\'s true domain. Narrow tunnels, oath-carvings, old pact-smoke.',
    connections: ['ancient_temple'],
    encounters: ['void_appetite', 'cathedral_golem', 'veshanne_unbound'],
    transformKey: 'barrow',
    unlockFlag: 'unlock_barrow_deeps',
  },
  {
    id: 'gilded_citadel_inner',
    name: 'Inner Sanctum of the Measured Wheel',
    zone: 'religious',
    desc: 'Behind the Citadel\'s public face — the high altar where the Wheel\'s law is inscribed in divine geometry that recoils from your curves.',
    connections: ['gilded_citadel'],
    encounters: ['divine_inquisitor_supreme', 'cathedral_golem', 'avatar_aurelan'],
    transformKey: 'citadel_inner',
    unlockFlag: 'unlock_citadel_inner',
  },
  {
    id: 'divine_plane_vestibule',
    name: 'Threshold of the Measured Wheel',
    zone: 'planar',
    desc: 'The outer edge of the gods\' plane — a grand hall that keeps reconsidering its floor plan. Your presence is technically illegal.',
    connections: ['gorgara_cradle'],
    encounters: ['avatar_aurelan', 'sylwen_revenant', 'wheel_incarnate'],
    transformKey: 'vestibule',
    unlockFlag: 'unlock_divine_vestibule',
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
