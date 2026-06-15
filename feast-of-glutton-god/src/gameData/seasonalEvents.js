/**
 * Seasonal Wheel Events — light live-ops scaffold (Phase 10e).
 */
import { renderSeasonalBeat } from '../textEngine/scenes/seasonal/index.js';

export const SEASONAL_EVENTS = {
  event_harvest_inversion: {
    id: 'event_harvest_inversion',
    label: 'Harvest Inversion',
    durationDays: 14,
    desc: 'Growth doubled in heartlands; Sylwen heralds spawn more often.',
    growthMultiplier: { fertile_heartlands: 2, harvest_hearth: 1.5 },
    encounterBonus: { fertile_heartlands: ['herald_of_starvation'] },
  },
  event_guild_audit: {
    id: 'event_guild_audit',
    label: 'Guild Audit',
    durationDays: 14,
    desc: 'Tarn NPCs offer discount puzzles; market hostility +1.',
    hostilityBonus: { market_square: 1 },
    puzzleDiscount: true,
  },
  event_dream_feast: {
    id: 'event_dream_feast',
    label: 'Dream Feast',
    durationDays: 14,
    desc: 'Dream echoes in random encounters; bonus XP from conversions.',
    encounterBonus: { global: ['dream_echo'] },
    xpBonus: 1.25,
  },
};

const EVENT_CYCLE = ['event_dream_feast', 'event_harvest_inversion', 'event_guild_audit'];
const CYCLE_LENGTH = 84; // ~12 weeks
const EVENT_LENGTH = 14;

export function getSeasonalEventForDay(day = 1) {
  const cycleDay = ((day - 1) % CYCLE_LENGTH);
  const eventIndex = Math.floor(cycleDay / EVENT_LENGTH) % EVENT_CYCLE.length;
  const eventId = EVENT_CYCLE[eventIndex];
  const dayInEvent = cycleDay % EVENT_LENGTH;
  return {
    eventId,
    def: SEASONAL_EVENTS[eventId],
    dayInEvent,
    daysRemaining: EVENT_LENGTH - dayInEvent,
  };
}

export function syncSeasonalEvent(game) {
  const { eventId, def } = getSeasonalEventForDay(game.day ?? 1);
  const prev = game.worldFlags?.seasonal_event_active ?? null;

  game.worldFlags = game.worldFlags ?? {};
  game.worldFlags.seasonal_event_active = eventId;

  if (prev !== eventId) {
    const message = renderSeasonalBeat(game, eventId);
    return { changed: true, eventId, def, message };
  }

  return { changed: false, eventId, def };
}

export function isSeasonalEventActive(game, eventId) {
  return game?.worldFlags?.seasonal_event_active === eventId;
}

export function getSeasonalGrowthMultiplier(game, regionId) {
  const eventId = game?.worldFlags?.seasonal_event_active;
  const def = SEASONAL_EVENTS[eventId];
  if (!def?.growthMultiplier) return 1;
  return def.growthMultiplier[regionId] ?? 1;
}

export function getSeasonalXpMultiplier(game) {
  const eventId = game?.worldFlags?.seasonal_event_active;
  const def = SEASONAL_EVENTS[eventId];
  return def?.xpBonus ?? 1;
}

export function applySeasonalEncounterSwap(pool, regionId, game) {
  const eventId = game?.worldFlags?.seasonal_event_active;
  const def = SEASONAL_EVENTS[eventId];
  if (!def?.encounterBonus) return pool;

  const bonus = def.encounterBonus[regionId] ?? def.encounterBonus.global;
  if (!bonus?.length) return pool;

  const extra = bonus[Math.floor(Math.random() * bonus.length)];
  if (!extra || pool.includes(extra)) return pool;
  return [...pool, extra, extra];
}
