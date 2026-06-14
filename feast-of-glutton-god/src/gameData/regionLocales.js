/**
 * Maps game regions to growth-event locale tags for concrete environmental prose.
 */
export const REGION_LOCALES = {
  harvest_hearth: {
    primary: 'village_inn',
    tags: ['tavern', 'village', 'wooden_building'],
    structure: 'wooden',
    density: 'cozy',
  },
  market_square: {
    primary: 'crowded_market',
    tags: ['market', 'plaza', 'stalls'],
    structure: 'mixed',
    density: 'crowded',
  },
  fertile_heartlands: {
    primary: 'open_field',
    tags: ['outdoors', 'vine', 'dirt_path'],
    structure: 'open',
    density: 'sparse',
  },
  gorgara_cradle: {
    primary: 'sacred_grotto',
    tags: ['grotto', 'stone', 'ritual'],
    structure: 'stone',
    density: 'intimate',
  },
  ancient_temple: {
    primary: 'marble_hall',
    tags: ['ruins', 'marble', 'pillared_hall'],
    structure: 'marble',
    density: 'hollow',
  },
  northern_marches: {
    primary: 'frontier_road',
    tags: ['outdoors', 'wind', 'narrow_lane'],
    structure: 'wooden',
    density: 'sparse',
  },
  sapphire_coast: {
    primary: 'coastal_manor',
    tags: ['manor', 'noble', 'parlor'],
    structure: 'stone',
    density: 'ornate',
  },
  iron_peak_hold: {
    primary: 'stone_hall',
    tags: ['forge', 'stone', 'ale_hall'],
    structure: 'stone',
    density: 'cozy',
  },
  ember_duchy: {
    primary: 'ducal_court',
    tags: ['court', 'throne', 'polished_floor'],
    structure: 'stone',
    density: 'formal',
  },
  gilded_citadel: {
    primary: 'grand_cathedral',
    tags: ['cathedral', 'marble', 'vast_nave'],
    structure: 'marble',
    density: 'vast',
  },
};

export function getLocaleForRegion(regionId) {
  return REGION_LOCALES[regionId] ?? {
    primary: 'generic_room',
    tags: ['indoors'],
    structure: 'wooden',
    density: 'cozy',
  };
}

export function getLocaleKey(regionId) {
  return getLocaleForRegion(regionId).primary;
}
