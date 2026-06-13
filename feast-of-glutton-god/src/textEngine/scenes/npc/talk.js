import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('npc.talk.greeting', [
  { when: { relationship: 0 }, text: [
    '"Oh — hello. I don\'t think we\'ve met."',
    '"Can I help you with something?"',
  ]},
  { when: { relationship: [1, 2] }, text: [
    '"{subject.first}! Good to see you again."',
    '"I was hoping you\'d come by."',
  ]},
  { when: { relationship: [3, 4, 5] }, text: [
    '"There you are, my dear. I\'ve been thinking about you."',
    '"Come closer — I always feel warmer when you\'re near."',
  ]},
  { when: {}, text: ['"Hello."'] },
]);

registerPool('npc.talk.topic', [
  { when: { corruption: 0 }, text: [
    'She speaks cautiously about Gorgara, as if testing the word on her tongue.',
    'She admits she\'s noticed changes in the village — people growing, smiling, eating more.',
  ]},
  { when: { corruption: 1 }, text: [
    '"I dream about food now," she confesses, blushing. "Rich, impossible food."',
    'She asks what it feels like to carry Gorgara\'s spark inside you.',
  ]},
  { when: { corruption: 2 }, text: [
    '"I want to be part of the feast," she says simply. "All of it. Forever."',
    'She begs you to tell her she looks beautiful heavier — and means it.',
  ]},
  { when: { stageMin: 5 }, text: [
    'She runs her hands over her softened body without shame. "I\'ve never felt more myself."',
  ]},
  { when: {}, text: [
    'You talk of abundance, of Gorgara\'s awakening, of the pleasure in growing.',
  ]},
]);

export const TALK_TEMPLATE = '{npc.talk.greeting} {npc.talk.topic}';

export function renderTalk(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: { location: opts.location, interaction: 'talk' },
    seed: opts.seed,
    history: opts.history,
  });
  return render(TALK_TEMPLATE, ctx);
}
