/**
 * Region features — interactable world objects linked to puzzles.
 */
export const REGION_FEATURES = [
  {
    id: 'hearth_cellar_door',
    regionId: 'harvest_hearth',
    name: 'Abundance Cellar Door',
    shortDesc: 'A heavy oak door sealed with iron bands.',
    puzzleId: 'cellar_abundance_vault',
    icon: '🚪',
  },
  {
    id: 'vesperia_iron_gate',
    regionId: 'market_square',
    name: 'Vesperia\'s Garden Gate',
    shortDesc: 'Ornate ironwork guards a garden of forbidden delicacies.',
    puzzleId: 'vesperia_garden_gate',
    icon: '⛩',
  },
  {
    id: 'swollen_ravine',
    regionId: 'fertile_heartlands',
    name: 'The Swollen Ravine',
    shortDesc: 'A gorge choked with vines and swollen fruit blocks the cradle path.',
    puzzleId: 'choked_ravine',
    icon: '🌿',
  },
  {
    id: 'gorgara_sacred_pool',
    regionId: 'gorgara_cradle',
    name: 'Sacred Pool of First Hunger',
    shortDesc: 'Golden water stirs in the grotto — waiting for abundance.',
    puzzleId: 'sacred_pool_rite',
    icon: '✨',
  },
  {
    id: 'fallen_marble_arch',
    regionId: 'ancient_temple',
    name: 'Fallen Feast Arch',
    shortDesc: 'Collapsed marble carved with feasting gods seals the inner sanctum.',
    puzzleId: 'collapsed_feast_arch',
    icon: '🏛',
  },
];

export function getFeature(featureId) {
  return REGION_FEATURES.find((f) => f.id === featureId) ?? null;
}

export function getFeaturesInRegion(regionId) {
  return REGION_FEATURES.filter((f) => f.regionId === regionId);
}
