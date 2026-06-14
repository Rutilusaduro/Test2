import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('world.event', [
  { when: { eventId: 'warm_hearth_festival' }, text: [
    '★ The Warm Hearth Festival erupts across the land — every oven blazing, every belly invited to swell with joy.',
    'Laughter and moans drift from open windows. Abundance has become celebration.',
  ]},
  { when: { eventId: 'feast_tide' }, text: [
    '★ Feast Tide rolls through the villages — a wave of appetite so powerful that strangers feed strangers, hips widen, and no one apologizes.',
    'The tide is rising. So is everyone else.',
  ]},
  { when: { eventId: 'golden_overflow' }, text: [
    '★ Golden Overflow — streets gleam with caloric light, temples steam with eternal banquets, flesh becomes scripture.',
    'The Fat Goddess\'s influence is undeniable now: beautiful, vast, hungry.',
  ]},
  { when: { eventId: 'gorgaras_dawn' }, text: [
    '★ Patron\'s Stirring breaks — the Fat Goddess stirs, and the world answers with a collective, euphoric swell.',
    'You feel her smile on your skin. There will be no more thin days.',
  ]},
  { when: {}, text: [
    'Abundance ripples outward — the world grows softer, fuller, more divine.',
  ]},
]);

export function renderWorldEvent(game, eventDef, opts = {}) {
  const ctx = createContext({
    subject: game.player,
    globals: { eventId: eventDef?.id, eventLabel: eventDef?.label },
    seed: opts.seed,
  });
  return render('{world.event}', ctx, { trace: opts.trace });
}
