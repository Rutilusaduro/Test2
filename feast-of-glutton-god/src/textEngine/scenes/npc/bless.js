import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('npc.bless.forced', [
  { when: { severityMin: 2 }, text: [
    'Divine light does not ask permission — {subject.first} screams as sacred weight invades her.',
    'The blessing burns through reluctance; she grows beneath gold she did not invite.',
  ]},
  { when: {}, text: [
    'Holy warmth pools in {subject.first} despite her flinch — growth that feels like trespass.',
    'She tries to pray it away; the goddess answers with inches.',
    'Blessing becomes burden; her body swells while her spirit recoils.',
    'The rite completes on flesh that was not ready to receive it.',
  ]},
]);

registerPool('npc.bless.minor', [
  { when: {}, text: [
    'Golden light blooms across {subject.name}\'s skin. She gasps as warmth pools in her belly.',
    'Gorgara\'s power flows through you into {subject.first} — a gentle, pleasurable swell.',
  ]},
]);

registerPool('npc.bless.major', [
  { when: {}, text: [
    'Divine abundance erupts around {subject.name}. She cries out in ecstasy as her body surges.',
    'The blessing hits like a wave — {subject.first}\'s form thickens visibly, flesh rippling outward.',
  ]},
]);

registerPool('npc.bless.targeted', [
  { when: { growthZone: 'belly' }, text: [
    'Her belly surges forward, rounding into a heavy dome that she cradles with both hands.',
  ]},
  { when: { growthZone: 'hips' }, text: [
    'Her hips widen dramatically, rear swelling into thick, plush orbs.',
  ]},
  { when: { growthZone: 'breasts' }, text: [
    'Her breasts surge forward, growing heavy and full, straining hard against fabric.',
  ]},
  { when: {}, text: [
    'Targeted divine energy reshapes {subject.first} exactly where you will it.',
  ]},
]);

export function renderBless(npc, player, opts = {}) {
  const type = opts.blessType || 'minor';
  const slot = type === 'major' ? 'npc.bless.major' : type === 'targeted' ? 'npc.bless.targeted' : 'npc.bless.minor';
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      growthZone: opts.zone || 'belly',
      growthMethod: 'blessing',
      consentState: opts.consentState || 'willing',
      severity: opts.severity ?? 0,
      gainDesire: opts.gainDesire ?? npc.gainDesire,
    },
    seed: opts.seed,
    history: opts.history,
  });
  const main = render(`{${slot}}`, ctx, { trace: opts.trace });
  if (opts.consentState === 'forced') {
    const forced = render('{npc.bless.forced}', ctx, { trace: opts.trace });
    return [main, forced].filter(Boolean).join(' ');
  }
  if ((opts.gainDesire ?? npc.gainDesire ?? 0) >= 50) {
    const rapture = render('{npc.growth.rapture}', ctx, { trace: opts.trace });
    return [main, rapture].filter(Boolean).join(' ');
  }
  return main;
}
