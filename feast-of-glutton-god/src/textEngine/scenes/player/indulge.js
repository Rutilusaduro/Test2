import { registerPool, createContext, render } from '../../engine.js';
import { getStage } from '../../../gameData/stages.js';

// ── indulge frame (FULL SENTENCE) ──────────────────────────────
registerPool('player.indulge.frame', [
  { when: { stageMin: 7, region: 'market_square' }, text: [
    'You claim a corner of the market where spice and honey run reckless — and eat like royalty.',
    'Stalls blur into a private feast; you feed yourself with the same hunger you lavish on others.',
  ]},
  { when: { stageMin: 5, region: 'harvest_hearth' }, text: [
    'The inn sets bread and stew before you without asking — you eat until warmth pools in your belly.',
    'Harvest\'s Hearth remembers how to host; tonight, you are the guest of honor at your own table.',
  ]},
  { when: { region: 'gorgara_cradle' }, text: [
    'Sacred fruit and cream appear as if the grotto itself insisted — you indulge with reverent greed.',
    'Golden light sweetens every bite; eating here feels like prayer answered on the tongue.',
  ]},
  { when: { stageMin: 9 }, text: [
    'Servants scramble to keep pace as you eat — a living feast commanding its own refills.',
    'You settle into indulgence vast enough to match your size; every bite restores divine favor.',
  ]},
  { when: {}, text: [
    'You find food, privacy, and permission — then eat until the Fat Goddess\'s attention returns.',
    'The meal is unhurried, sensual, deserved; favor seeps back with every swallowed sweetness.',
    'You feast on your own behalf for once — warm, full, and briefly, purely yours.',
  ]},
]);

// ── indulge sensation (PARTICIPLE CLAUSE) ──────────────────────
registerPool('player.indulge.sensation', [
  { when: { stageMin: 6 }, text: [
    'butter melting slow across your tongue, hips shifting heavier in the chair',
    'each swallow rounding you softer while pleasure uncoils low in your belly',
    'sauce on your fingers, breath deepening as fullness becomes bliss',
  ]},
  { when: { stageMin: 3 }, text: [
    'pastry flaking against your lips, warmth spreading through your middle',
    'cream sweet enough to moan for, belly easing outward with contentment',
    'spiced wine heating your cheeks while appetite turns tender',
  ]},
  { when: {}, text: [
    'honeyed bites lingering on your palate',
    'comfort pooling warm beneath your ribs',
    'the simple animal joy of eating well after giving so much away',
  ]},
]);

// ── indulge coda (FULL SENTENCE) ───────────────────────────────
registerPool('player.indulge.coda', [
  { when: { stageMin: 8 }, text: [
    'You lean back vast and sated — the Fat Goddess\'s favor floods back like afterglow.',
    'The goddess purrs approval; your body and your magic both feel fed.',
  ]},
  { when: {}, text: [
    'Sated, you feel her attention return — favor restored, appetite balanced.',
    'You wipe your lips smiling; the Fat Goddess shares her power with those who eat.',
    'Fullness becomes fuel again — you may lavish growth once more.',
  ]},
]);

export function renderIndulge(player, game, opts = {}) {
  const stage = opts.stage ?? (player?.lbs != null ? getStage(player.lbs).id : 3);
  const ctx = createContext({
    subject: player,
    globals: {
      region: game?.region ?? 'harvest_hearth',
      stage,
    },
  });
  const frame = render('{player.indulge.frame}', ctx, { trace: opts.trace });
  const sensation = render('{player.indulge.sensation}', ctx, { trace: opts.trace });
  const coda = render('{player.indulge.coda}', ctx, { trace: opts.trace });
  return [frame, sensation ? `— ${sensation} —` : '', coda].filter(Boolean).join('\n\n');
}
