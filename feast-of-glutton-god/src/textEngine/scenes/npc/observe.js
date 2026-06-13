import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.observe.pose', [
  { when: { pose: 'standing' }, text: [
    '{subject.name} stands before you, {word.size} and {word.movement}. {join:npc.observe.body,npc.observe.clothing|prefix: }',
    'You take in {subject.name} — {char.desc}. {join:npc.observe.body,npc.observe.clothing|prefix: }',
  ]},
  { when: { pose: 'sitting' }, text: [
    '{subject.name} sits heavily, {word.size}, her softness settled into the chair. {join:npc.observe.body,npc.observe.clothing|prefix: }',
    'Seated, {subject.name} is a picture of {word.size} comfort. {join:npc.observe.body,npc.observe.clothing|prefix: }',
  ]},
  { when: { pose: 'walking' }, text: [
    '{subject.name} {word.movement}, each step sending a gentle ripple through her {word.size} form.',
    'You watch {subject.name} pass — {word.size}, unhurried, beautifully heavy.',
  ]},
  { when: {}, text: [
    '{char.desc|cap}. {join:npc.observe.body,npc.observe.clothing|prefix: }',
  ]},
]);

registerPool('npc.observe.body', [
  { when: { stageMin: 0, stageMax: 2 }, text: [
    'Her figure is still slender, though softness gathers at her hips and belly.',
    'A gentle curve is beginning to claim her waist.',
  ]},
  { when: { stageMin: 3, stageMax: 5 }, text: [
    'Her belly rounds outward pleasantly, thighs pressing together when she shifts.',
    'Soft flesh strains at every seam — hips, bust, and belly all visibly fuller.',
    'She carries a plush, warm heaviness that makes every movement sensual.',
  ]},
  { when: { stageMin: 6, stageMax: 8 }, text: [
    'Her enormous softness dominates her silhouette — belly, breasts, and hips a landscape of abundance.',
    'Every breath sends a slow ripple through her vast, jiggling form.',
    'She is magnificently heavy, flesh spilling past every boundary of her clothing.',
  ]},
  { when: { stageMin: 9 }, text: [
    'She is colossal — a vast, warm presence that reshapes the space around her.',
    'Her body is a temple of abundance, impossibly soft and impossibly large.',
  ]},
  { when: {}, text: [
    'Her body speaks of Gorgara\'s blessing — soft, full, and beautiful.',
  ]},
]);

registerPool('npc.observe.clothing', [
  { when: { stageMin: 0, stageMax: 3 }, text: [
    'Her clothes fit well, though the fabric pulls slightly across her hips.',
    '{word.clothingFit|cap}.',
  ]},
  { when: { stageMin: 4, stageMax: 6 }, text: [
    'Fabric strains audibly when she moves — buttons threatening, seams whispering.',
    'Her outfit has given up pretending; it simply holds on where it can.',
  ]},
  { when: { stageMin: 7 }, text: [
    'What remains of her clothing is mostly decoration on an overwhelming body.',
    'Straps and scraps of fabric cling to curves far beyond their design.',
  ]},
  { when: {}, text: ['{word.clothingFit|cap}.'] },
]);

const POSES = ['standing', 'sitting', 'walking'];

export function renderObserve(npc, player, opts = {}) {
  const pose = opts.pose || POSES[Math.floor(Math.random() * POSES.length)];
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: { pose, location: opts.location, interaction: 'observe' },
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.observe.pose}', ctx);
}

export { POSES };
