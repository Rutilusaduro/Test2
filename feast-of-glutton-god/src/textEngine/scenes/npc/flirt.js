import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.flirt.line', [
  { when: { relationship: 0, stageMin: 0, stageMax: 3 }, text: [
    'You offer a careful compliment about her figure. She blinks, surprised but not displeased.',
    '"You have a lovely smile," you say — testing the waters of desire.',
  ]},
  { when: { relationship: 1, stageMin: 0, stageMax: 3 }, text: [
    '"You have such a lovely figure already — I can\'t wait to see you softer."',
    'You trace a finger along her waist. She shivers. "You think I\'d look good bigger?"',
  ]},
  { when: { relationship: [2, 3], stageMin: 0, stageMax: 3 }, text: [
    '"Every inch of you deserves to be cherished — and fed."',
    'You whisper praise against her ear. She melts, leaning into your warmth.',
  ]},
  { when: { stageMin: 4, stageMax: 6 }, text: [
    '"Every curve on you is perfection. I want to make them all fuller."',
    'You cup her rounded belly. She moans. "Keep talking like that…"',
  ]},
  { when: { stageMin: 7 }, text: [
    '"You\'re magnificent," you breathe, hands lost in her vast softness.',
    'She pulls you against her enormous body. "Then worship me properly."',
  ]},
  { when: {}, text: [
    'Your compliment lands like a blessing — she glows with pleasure.',
  ]},
]);

registerPool('npc.flirt.response', [
  { when: { checkCritical: 'success' }, text: [
    'She gasps, knees weakening — desire floods her faster than any meal could.',
    'Critical spark: she kisses you before she thinks, body already yielding to abundance.',
  ]},
  { when: { checkSuccess: true, relationship: [0, 1] }, text: [
    'She blushes furiously but doesn\'t pull away.',
    '"You shouldn\'t say things like that…" She doesn\'t sound like she means it.',
  ]},
  { when: { checkSuccess: true, corruption: 0 }, text: [
    'She blushes but leans closer, hungry for more words like those.',
    '"You really think so?" Wonder and want war in her eyes.',
  ]},
  { when: { checkSuccess: true, corruption: 1 }, text: [
    '"You really think so?" She preens, turning to show off her curves.',
    'She bites her lip, already imagining your hands feeding her.',
  ]},
  { when: { checkSuccess: true, corruption: 2 }, text: [
    '"Then prove it. Feed me. Make me yours."',
    'She kisses you hungrily, pressing her growing body against you.',
  ]},
  { when: { checkCritical: 'failure' }, text: [
    'She giggles at your flustered delivery — charmed rather than offended.',
    'Your stumble earns a fond squeeze. "You\'re adorable when you blush."',
  ]},
  { when: { checkSuccess: false }, text: [
    'She smiles shyly — not ready yet, but warmed by the attempt.',
    'The moment passes gently; she still likes that you tried.',
  ]},
  { when: {}, text: ['Her eyes darken with want.'] },
]);

export function renderFlirt(npc, player, opts = {}) {
  const globals = {
    interaction: 'flirt',
    checkSuccess: opts.checkResult === 'success' || opts.checkResult === 'critical_success',
    checkCritical: opts.checkCritical ?? null,
    ...(opts.globals || {}),
  };
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals,
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.flirt.line} {npc.flirt.response}', ctx, { trace: opts.trace });
}
