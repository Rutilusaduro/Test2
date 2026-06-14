import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.intimate.opening', [
  { when: { relationship: 3 }, text: [
    'You draw {subject.first} close — hesitant heat blooming into trust as your hands find her waist.',
    'The air between you thickens with want. {subject.name} exhales your name like a prayer.',
  ]},
  { when: { relationship: 4 }, text: [
    '{subject.first} pulls you into her before you can speak, hungry and shameless, already swelling with anticipation.',
    'She guides your palms to her curves. "I\'ve been craving this," she breathes.',
  ]},
  { when: { relationship: 5 }, text: [
    'Devotion made flesh — {subject.name} welcomes you home into her softness, every inch of her body a temple built for your touch.',
    'You worship each other without hurry. She moans that she was always meant to grow for you.',
  ]},
  { when: {}, text: [
    'Warmth and desire intertwine as you share intimate abundance.',
  ]},
]);

registerPool('npc.intimate.acts', [
  { when: { relationship: 3, corruptionMax: 1 }, text: [
    'Kisses trail into feeding — pastries pressed to her lips between sighs of pleasure.',
    'You explore her body with reverent hands; she arches, blushing, begging for more.',
  ]},
  { when: { relationship: 3, corruption: 2 }, text: [
    'She straddles your lap, grinding slow while you hand-feed her until her belly rounds beneath you.',
    'Lovemaking and indulgence blur — every thrust punctuated by another sweet, swelling bite.',
  ]},
  { when: { relationship: 4 }, text: [
    'She rides you with glorious hunger, belly bouncing, demanding you make her bigger even as she climaxes.',
    'Your mouths never leave each other — food, kisses, and worship until she swells beneath you in ecstasy.',
  ]},
  { when: { relationship: 5 }, text: [
    'Sacred union: you feed her at the peak of pleasure, and the Fat Goddess\'s light blesses every new pound as holy.',
    'She cries out your name, devoted and delirious, body blossoming in waves timed to your touch.',
  ]},
  { when: {}, text: [
    'Pleasure and abundance merge — beautiful, breathless, and without shame.',
  ]},
]);

registerPool('npc.intimate.afterglow', [
  { when: { relationship: 3 }, text: [
    'She nestles against you, softer now, smiling with dazed gratitude.',
    '"That was… more than I imagined," she whispers, patting her new fullness.',
  ]},
  { when: { relationship: 4 }, text: [
    'She licks cream from your fingers, eyes bright with craving already returning.',
    '"Again soon," she promises, squeezing the plush curves you gave her.',
  ]},
  { when: { relationship: 5 }, text: [
    'Devoted afterglow — she holds you inside her abundance, whispering vows of eternal feast and growth.',
    'Your bond feels unbreakable: every curve she wears is proof of love made manifest.',
  ]},
  { when: {}, text: [
    'You linger in warm silence, bodies humming with shared satisfaction.',
  ]},
]);

export function renderIntimate(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: { interaction: 'intimate', location: opts.location },
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.intimate.opening} {npc.intimate.acts} {npc.intimate.afterglow}', ctx, {
    trace: opts.trace,
  });
}
