/**
 * Dynamic environmental features — objects created by spells in the overworld.
 * Stored in game.worldFlags.dynamicFeatures[regionId].
 * Surfaced by getVisibleFeatures() alongside static region features.
 */

export function getDynamicFeatures(game, regionId) {
  return game.worldFlags?.dynamicFeatures?.[regionId] ?? [];
}

export function getDynamicFeature(game, regionId, featureId) {
  return getDynamicFeatures(game, regionId).find((f) => f.id === featureId) ?? null;
}

/** Return a new game state with the feature added (no-op if id already exists). */
export function withDynamicFeature(game, regionId, feature) {
  const existing = getDynamicFeatures(game, regionId);
  if (existing.some((f) => f.id === feature.id)) return game;
  return {
    ...game,
    worldFlags: {
      ...game.worldFlags,
      dynamicFeatures: {
        ...(game.worldFlags?.dynamicFeatures ?? {}),
        [regionId]: [...existing, feature],
      },
    },
  };
}
