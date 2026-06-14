import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('dm.arrival', [
  { when: { firstVisit: true, region: 'harvest_hearth' }, text: [
    'You step into Harvest\'s Hearth — ovens breathing, wheat gold in every window. A good place to learn appetite.',
    'The village greets you with bread-smoke and curious eyes. They don\'t know you yet. You will fix that.',
  ]},
  { when: { firstVisit: true, region: 'gorgara_cradle' }, text: [
    'Gorgara\'s Cradle hums beneath your feet — sacred, hungry, patient. The goddess has been waiting.',
    'Golden light pools in the grotto air. Whatever you came to become, it starts listening here.',
  ]},
  { when: { firstVisit: true }, text: [
    'A new stretch of the Everfull Continent opens before you — unfamiliar roads, unfamiliar hungers.',
    'You arrive somewhere you have never stood. Take it in. The world will remember what you do next.',
  ]},
  { when: { regionTransformLevelMin: 3 }, text: [
    'You return to {regionName}, and the land itself seems fatter with devotion — streets softer, bellies braver.',
    'Familiar ground, but abundance has rewritten the scenery since your last visit. Good.',
  ]},
  { when: {}, text: [
    'You find yourself in {regionName} again — same roads, new appetites stirring.',
    'Back in {regionName}. The feast never truly pauses here; it only changes course.',
  ]},
]);

registerPool('dm.event', [
  { when: { dmKind: 'levelup' }, text: [
    'Power settles into your bones — level gained, and the world takes notice.',
    'You feel yourself swell with more than flesh: experience, certainty, appetite sharpened.',
  ]},
  { when: { dmKind: 'quest' }, text: [
    'A thread of purpose tugs at you — someone\'s need, or your own ambition, has turned.',
    'The story shifts. Mark it, or let it slip — but the continent is paying attention.',
  ]},
  { when: { dmKind: 'growth' }, text: [
    'Growth ripples outward — not quietly, never quietly on this continent.',
    'Bodies change, landscapes lean — abundance leaves fingerprints.',
  ]},
  { when: { dmKind: 'devotion' }, text: [
    'Devotion deepens somewhere nearby. The goddess likes what she sees.',
    'Faith and flesh intertwine — a sweet, dangerous braid.',
  ]},
  { when: {}, text: [
    'Something shifts in the tale you are living. Stay alert — and stay hungry.',
  ]},
]);

registerPool('dm.idle', [
  { when: { region: 'harvest_hearth' }, text: [
    'The hearth crackles. Strangers linger. The day is young and the ovens are warm.',
    'Bread cools on windowsills. You could talk, travel, or simply feast on the moment.',
  ]},
  { when: { region: 'market_square' }, text: [
    'Merchants hawk sweets you haven\'t tasted yet. The square bustles with possibility.',
    'Coin changes hands, hips sway between stalls — abundance wears a merchant\'s smile today.',
  ]},
  { when: {}, text: [
    'A quiet beat — the continent exhales. No rush. Appetite is patient.',
    'The world waits, amused. You have time to choose your next delicious move.',
  ]},
]);

registerPool('dm.hint', [
  { when: { hintKind: 'travel' }, text: [
    'The {exitName} road still waits, you know — untraveled paths keep their secrets.',
    'If you\'re wondering where to go next, {exitName} hasn\'t seen your footprints yet.',
  ]},
  { when: { hintKind: 'quest' }, text: [
    'Someone nearby might have work for you — if you\'re willing to listen.',
    'A quest lingers unclaimed. Pride won\'t finish it for you.',
  ]},
  { when: {}, text: [
    'The obvious next step is only obvious once you take it.',
    'When in doubt: eat, grow, or go somewhere new. Usually all three.',
  ]},
]);

export function renderDmLine(kind, game, params = {}) {
  const poolKey = `dm.${kind}`;
  const region = params.regionId ?? game.region;
  const ctx = createContext({
    subject: game.player,
    globals: {
      region,
      regionName: params.regionName,
      firstVisit: params.firstVisit,
      regionTransformLevel: params.regionTransformLevel,
      dmKind: params.dmKind,
      hintKind: params.hintKind,
      exitName: params.exitName,
      eventText: params.text,
      ...(params.globals ?? {}),
    },
    seed: params.seed,
  });
  const line = render(`{${poolKey}}`, ctx, { trace: params.trace });
  if (params.text && kind === 'event') {
    return params.text;
  }
  return line;
}
