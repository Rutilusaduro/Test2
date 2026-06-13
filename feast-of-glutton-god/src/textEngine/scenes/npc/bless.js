import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

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
    globals: { growthZone: opts.zone || 'belly', growthMethod: 'blessing' },
    seed: opts.seed,
    history: opts.history,
  });
  return render(`{${slot}}`, ctx, { trace: opts.trace });
}
