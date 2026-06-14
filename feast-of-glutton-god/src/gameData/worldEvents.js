/**
 * World events unlocked by Abundance Spread milestones.
 * Celebrations of your patron's growing presence across the earnest world.
 */
import { getAbundanceSpread, awardAbundanceSpread } from './abundanceSpread.js';
import { addAbundancePoints } from './player.js';
import { getRegion } from './regions.js';
import { renderWorldEvent } from '../textEngine/scenes/world/events.js';

export const MILESTONE_WORLD_EVENTS = {
  50: {
    id: 'warm_hearth_festival',
    label: 'Warm Hearth Festival',
    rewards: { ap: 15 },
    worldFlags: { warm_hearth_festival: true },
    playerFlags: { witnessed_hearth_festival: true },
  },
  120: {
    id: 'feast_tide',
    label: 'Feast Tide',
    rewards: { ap: 20 },
    worldFlags: { feast_tide_active: true, unlock_northern_marches: true },
    unlockRegions: ['northern_marches'],
  },
  250: {
    id: 'golden_overflow',
    label: 'Golden Overflow',
    rewards: { ap: 30 },
    worldFlags: { golden_overflow_blessing: true, unlock_sapphire_coast: true, unlock_iron_peak: true },
    unlockRegions: ['sapphire_coast', 'iron_peak_hold'],
    playerFlags: { golden_overflow_witness: true },
  },
  500: {
    id: 'gorgaras_dawn',
    label: "Patron's Stirring",
    rewards: { ap: 50 },
    worldFlags: { gorgaras_dawn: true, unlock_ember_duchy: true },
    unlockRegions: ['ember_duchy'],
    playerSizeCapBonus: 2,
    playerFlags: { dawn_of_gorgara: true },
  },
  900: {
    id: 'continental_surge',
    label: 'Reach-Wide Surge',
    rewards: { ap: 75 },
    worldFlags: { continental_surge: true, unlock_gilded_citadel: true },
    unlockRegions: ['gilded_citadel'],
    playerSizeCapBonus: 1,
  },
  1500: {
    id: 'matriarch_shadow',
    label: "Matriarch's Shadow",
    rewards: { ap: 100 },
    worldFlags: { matriarch_shadow: true },
    playerSizeCapBonus: 1,
    playerFlags: { rival_goddess_rising: true },
  },
};

/**
 * Trigger world event when abundance milestone is crossed.
 * @returns {{ triggered: boolean, event?: object, message?: string }}
 */
export function checkMilestoneWorldEvent(game, spreadResult) {
  if (!spreadResult?.milestoneUp) return { triggered: false };

  const milestonePoints = spreadResult.milestone?.points ?? 0;
  const eventDef = MILESTONE_WORLD_EVENTS[milestonePoints];
  if (!eventDef) return { triggered: false };

  game.worldFlags = game.worldFlags || {};
  const flagKey = `world_event_${eventDef.id}`;
  if (game.worldFlags[flagKey]) return { triggered: false };

  game.worldFlags[flagKey] = true;
  game.worldFlags.lastWorldEvent = eventDef.id;

  if (eventDef.rewards?.ap) addAbundancePoints(game, eventDef.rewards.ap);
  for (const [k, v] of Object.entries(eventDef.worldFlags ?? {})) {
    game.worldFlags[k] = v;
  }
  game.player.storyFlags = game.player.storyFlags || {};
  for (const [k, v] of Object.entries(eventDef.playerFlags ?? {})) {
    game.player.storyFlags[k] = v;
  }
  if (eventDef.playerSizeCapBonus) {
    game.player.sizeCap = (game.player.sizeCap || 5) + eventDef.playerSizeCapBonus;
  }
  for (const regionId of eventDef.unlockRegions ?? []) {
    if (!game.worldFlags.regions_unlocked.includes(regionId)) {
      game.worldFlags.regions_unlocked.push(regionId);
    }
    const region = getRegion(regionId);
    if (region?.unlockFlag) {
      game.worldFlags[region.unlockFlag] = true;
    }
  }

  const message = renderWorldEvent(game, eventDef);
  return { triggered: true, event: eventDef, message };
}

/** Award abundance spread and fire world event if milestone crossed. */
export function awardAbundanceSpreadWithEvents(game, source, amountOverride) {
  const spread = awardAbundanceSpread(game, source, amountOverride);
  const worldEvent = spread.milestoneUp ? checkMilestoneWorldEvent(game, spread) : { triggered: false };
  return { ...spread, worldEvent };
}

export function getTriggeredWorldEvents(game) {
  return Object.keys(MILESTONE_WORLD_EVENTS)
    .map((pts) => MILESTONE_WORLD_EVENTS[pts])
    .filter((e) => game.worldFlags?.[`world_event_${e.id}`]);
}
