import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.flirt.line', [
  { when: { stageMin: 0, stageMax: 3 }, text: [
    '"You have such a lovely figure already — I can\'t wait to see you softer."',
    'You trace a finger along her waist. She shivers. "You think I\'d look good bigger?"',
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
  { when: { corruption: 0 }, text: [
    'She blushes furiously but doesn\'t pull away.',
    '"You shouldn\'t say things like that…" She doesn\'t sound like she means it.',
  ]},
  { when: { corruption: 1 }, text: [
    '"You really think so?" She preens, turning to show off her curves.',
  ]},
  { when: { corruption: 2 }, text: [
    '"Then prove it. Feed me. Make me yours."',
    'She kisses you hungrily, pressing her growing body against you.',
  ]},
  { when: {}, text: ['Her eyes darken with want.'] },
]);

export function renderFlirt(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: { interaction: 'flirt' },
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.flirt.line} {npc.flirt.response}', ctx, { trace: opts.trace });
}
