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
    id: 'hearth_windmill_wheel',
    regionId: 'harvest_hearth',
    name: 'Jammed Windmill Wheel',
    shortDesc: 'The village mill groans — seized with dough and stubborn gears.',
    puzzleId: 'hearth_windmill_jam',
    icon: '⚙',
  },
  {
    id: 'hearth_festival_shrine',
    regionId: 'harvest_hearth',
    name: 'Festival Shrine Bell',
    shortDesc: 'A bronze bell too heavy to ring — the abundance festival waits.',
    puzzleId: 'hearth_shrine_bell',
    icon: '🔔',
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
    id: 'market_spice_vault',
    regionId: 'market_square',
    name: 'Locked Spice Vault',
    shortDesc: 'Underground vault reeking of saffron — rare spices within.',
    puzzleId: 'market_spice_vault',
    icon: '🏺',
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
    id: 'heartlands_thorn_hedge',
    regionId: 'fertile_heartlands',
    name: 'Dryad\'s Thorn Hedge',
    shortDesc: 'Living thorns guard a hidden grove swollen with impossible fruit.',
    puzzleId: 'dryad_thorn_hedge',
    icon: '🌹',
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
    id: 'cradle_hunger_altar',
    regionId: 'gorgara_cradle',
    name: 'Altar of First Hunger',
    shortDesc: 'Stone altar pulsing with the goddess\'s original appetite.',
    puzzleId: 'cradle_hunger_altar',
    icon: '🕯',
  },
  {
    id: 'fallen_marble_arch',
    regionId: 'ancient_temple',
    name: 'Fallen Feast Arch',
    shortDesc: 'Collapsed marble carved with feasting gods seals the inner sanctum.',
    puzzleId: 'collapsed_feast_arch',
    icon: '🏛',
  },
  {
    id: 'temple_sealed_feast_hall',
    regionId: 'ancient_temple',
    name: 'Sealed Feast Hall',
    shortDesc: 'Marble doors seal a hall where ancient feasts never ended.',
    puzzleId: 'temple_sealed_hall',
    icon: '🚪',
  },
  {
    id: 'temple_cursed_font',
    regionId: 'ancient_temple',
    name: 'Cursed Hunger Font',
    shortDesc: 'A feast-fountain curdled by famine magic — hunger made liquid.',
    puzzleId: 'temple_hunger_font',
    icon: '⛲',
  },

  // ─── Frontier & political regions (Task Group 3) ───────────────────────────

  {
    id: 'marches_landslide_pass',
    regionId: 'northern_marches',
    name: 'Blocked Mountain Pass',
    shortDesc: 'Ice and landslide choke the road to Iron Peak — soldiers watch with lean suspicion.',
    puzzleId: 'marches_blocked_pass',
    icon: '🏔',
  },
  {
    id: 'peak_collapsed_bridge',
    regionId: 'iron_peak_hold',
    name: 'Collapsed Forge-Bridge',
    shortDesc: 'Rusted dwarven iron spans a chasm toward the sacred cradle.',
    puzzleId: 'peak_forge_bridge',
    icon: '🌉',
  },
  {
    id: 'coast_velvet_gate',
    regionId: 'sapphire_coast',
    name: 'Velvet Road Seal',
    shortDesc: 'Masked courtiers block the highway to Ember Duchy.',
    puzzleId: 'coast_velvet_seal',
    icon: '🎭',
  },
  {
    id: 'ember_hungry_court',
    regionId: 'ember_duchy',
    name: 'Starving Ducal Court',
    shortDesc: 'Nobles hunger behind pride — the hall waits for a true feast.',
    puzzleId: 'ember_starving_court',
    icon: '👑',
  },
  {
    id: 'ember_contested_gate',
    regionId: 'ember_duchy',
    name: 'Contested Citadel Road',
    shortDesc: 'Purity zealots and cultists clash on the road to the Gilded Citadel.',
    puzzleId: 'ember_contested_approach',
    icon: '⚔',
  },
  {
    id: 'citadel_purity_door',
    regionId: 'gilded_citadel',
    name: 'Purity Grand Seal',
    shortDesc: 'The cathedral-city\'s last seal rejects indulgence — or demands apotheosis.',
    puzzleId: 'citadel_purity_seal',
    icon: '✝',
  },
];

export function getFeature(featureId) {
  return REGION_FEATURES.find((f) => f.id === featureId) ?? null;
}

export function getFeaturesInRegion(regionId) {
  return REGION_FEATURES.filter((f) => f.regionId === regionId);
}
