import { registerPool } from '../../engine.js';

registerPool('seasonal.event', [
  { when: { seasonalEvent: 'event_harvest_inversion' }, text: [
    '★ Wheel Event — Harvest Inversion. Heartland crops swell; Sylwen\'s heralds spawn like inconvenient hymnals.',
    '★ Seasonal inversion: measured plenty doubles. Farmers cheer; wardens file paperwork with trembling hands.',
  ]},
  { when: { seasonalEvent: 'event_guild_audit' }, text: [
    '★ Wheel Event — Guild Audit. Tarn factors discount puzzles; market hostility rises one polite notch.',
    '★ Seasonal audit season: contracts reviewed, pastries itemized, abundance taxed as luxury.',
  ]},
  { when: { seasonalEvent: 'event_dream_feast' }, text: [
    '★ Wheel Event — Dream Feast. Echoes walk the roads; victory tastes like frosting and bonus XP.',
    '★ Seasonal dream-feast: mirror-hunger stirs in random encounters. Sleep optional; seconds mandatory.',
  ]},
  { text: [
    '★ A seasonal Wheel event turns — the continent shifts appetite again.',
  ]},
]);
