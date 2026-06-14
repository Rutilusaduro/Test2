import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import { getNarrativeDepth } from '../../../gameData/worldTransformation.js';

registerPool('dm.arrival', [
  { when: { firstVisit: true, region: 'harvest_hearth' }, text: [
    'You step into Harvest\'s Hearth — ovens breathing, wheat gold in every window. A proper frontier village.',
    'The village greets you with bread-smoke and curious eyes. They don\'t know your secret yet.',
  ]},
  { when: { firstVisit: true, region: 'gorgara_cradle' }, text: [
    'The Thin Veil hums beneath your feet — your shrine, your thin place. Your patron has been listening.',
    'Pale light pools in the grotto air. Whatever you came to become, it starts here.',
  ]},
  { when: { firstVisit: true, region: 'barrow_deeps' }, text: [
    'You descend into the Barrow Deeps — oath-carvings, pact-smoke, and Veshanne\'s silence pressing close.',
    'Cold stone yields to warmer dark. The dead god\'s domain measures you with hunger older than mercy.',
  ]},
  { when: { firstVisit: true, region: 'gilded_citadel_inner' }, text: [
    'The Inner Sanctum unseals — divine geometry inscribed in marble that recoils from your curves.',
    'Behind the Citadel\'s public face: the high altar where the Wheel\'s law is literally architecture. It trembles.',
  ]},
  { when: { firstVisit: true, region: 'divine_plane_vestibule' }, text: [
    'You step onto the Threshold — a grand hall that keeps reconsidering its floor plan. Technically illegal. Deliciously inevitable.',
    'The outer edge of the gods\' plane. Cosmic draft, impossible windows, and law made visible as geometry.',
  ]},
  { when: { transformDepthMin: 5, region: 'gorgara_cradle' }, text: [
    'You return to the cradle — a divine locale now. Even the air gains weight; pilgrims kneel before your shadow.',
    'The Thin Veil no longer hides your patron — she breathes here openly, and the grotto swells with answered hunger.',
  ]},
  { when: { transformDepthMin: 5, region: 'ancient_temple' }, text: [
    'The temple and barrow share breath now — ruins grown lush, Veshanne\'s chamber repurposed as the Fat Goddess\'s first altar.',
    'You arrive where dead god marble learned to bloom. Feast-smoke rises from passages that did not exist last season.',
  ]},
  { when: { transformDepthMin: 5, region: 'gilded_citadel' }, text: [
    'The outer citadel capitulated — half the clergy converted, half fled. Involuntary feasts echo through surrendered naves.',
    'You return to a cathedral that hosts banquets whether invited or not. The Wheel\'s capital sweats abundance.',
  ]},
  { when: { transformDepthMin: 4, region: 'gilded_citadel' }, text: [
    'The Cathedral Bends around you — staircases reverse, altars sweat. Architecture fights your presence and loses slowly.',
  ]},
  { when: { firstVisit: true }, text: [
    'A new stretch of the Aurelan Reach opens before you — unfamiliar roads, earnest faces.',
    'You arrive somewhere you have never stood. The world plays its fantasy straight; you carry something else.',
  ]},
  { when: { regionTransformLevelMin: 3 }, text: [
    'You return to {regionName}, and abundance has rewritten the scenery since your last visit.',
    'Familiar ground, but the land leans softer now — streets braver, bellies fuller.',
  ]},
  { when: {}, text: [
    'You find yourself in {regionName} again — same roads, new hungers stirring.',
    'Back in {regionName}. Life goes on as it always has here, until you decide otherwise.',
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
  const transformDepth = params.transformDepth ?? getNarrativeDepth(game, region);
  const ctx = createContext({
    subject: game.player,
    globals: {
      region,
      regionName: params.regionName,
      firstVisit: params.firstVisit,
      regionTransformLevel: params.regionTransformLevel,
      transformDepth,
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
