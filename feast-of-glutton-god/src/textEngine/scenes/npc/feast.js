import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('npc.feast.intro', [
  { when: {}, text: [
    'The feast hall fills with golden light and impossible aromas.',
    'Tables groan under enchanted delicacies — every dish a prayer to Gorgara.',
  ]},
]);

registerPool('npc.feast.eating', [
  { when: { corruption: 0 }, text: [
    '{subject.name} eats with widening eyes, each bite undoing another reservation.',
  ]},
  { when: { corruption: 1 }, text: [
    '{subject.first} moans around every mouthful, surrendering to the endless courses.',
  ]},
  { when: { corruption: 2 }, text: [
    '{subject.name} devours with religious fervor, belly swelling course by course.',
  ]},
  { when: {}, text: [
    'The feast works its magic — fullness becoming pleasure becoming growth.',
  ]},
]);

registerPool('npc.feast.climax', [
  { when: { stageMin: 7 }, text: [
    'By the final course, {subject.first} is nearly unrecognizable — vastly, beautifully obese.',
  ]},
  { when: {}, text: [
    'When the last plate clears, {subject.name} sits in blissful, heavy satisfaction.',
  ]},
]);

export function renderFeast(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    group: opts.group || null,
    globals: { growthMethod: 'feast', locale: 'feast_hall' },
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.feast.intro} {npc.feast.eating} {npc.feast.climax}', ctx, { trace: opts.trace });
}
