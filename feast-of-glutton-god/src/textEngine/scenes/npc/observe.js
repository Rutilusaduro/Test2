import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

// ── npc.observe.pose — SKELETON (beat module) ─────────────────────────────
// Slots: standingMovement (PARTICIPLE), body + clothing (each FULL SENTENCE, separate).

registerPool('npc.observe.pose', [
  { when: { pose: 'standing' }, text: [
    '{subject.name} stands before you, {word.standingMovement}. {npc.observe.body} {npc.observe.clothing}',
    'You take in {subject.name} — {char.desc}. {npc.observe.body} {npc.observe.clothing}',
  ]},
  { when: { pose: 'sitting' }, text: [
    '{subject.name} sits heavily, {word.size}, {their} softness settled into the chair. {npc.observe.body} {npc.observe.clothing}',
    'Seated, {subject.name} is a picture of {word.size} comfort. {npc.observe.body} {npc.observe.clothing}',
  ]},
  { when: { pose: 'walking' }, text: [
    '{subject.name} {word.movement}, each step sending a gentle ripple through {their} {word.size} form.',
    'You watch {subject.name} pass — {word.size}, unhurried, beautifully heavy.',
  ]},
  { when: {}, text: [
    '{char.desc|cap}. {npc.observe.body} {npc.observe.clothing}',
  ]},
]);

// ── npc.observe.body — FULL SENTENCE (no garment talk; clothing slot owns that) ─

registerPool('npc.observe.body', [
  { when: { stageMin: 0, stageMax: 2 }, text: [
    '{Their} figure is still slender, though softness gathers at {their} hips and belly.',
    'A gentle curve is beginning to claim {their} waist.',
  ]},
  { when: { stageMin: 3, stageMax: 5 }, text: [
    '{Their} belly rounds outward pleasantly, thighs pressing together when {they} {verb:shift}.',
    'Soft flesh swells at {their} hips, bust, and belly — visibly fuller with every glance.',
    '{They} {verb:carry} a plush, warm heaviness that makes every movement sensual.',
  ]},
  { when: { stageMin: 6, stageMax: 8 }, text: [
    '{Their} enormous softness dominates {their} silhouette — belly, breasts, and hips a landscape of abundance.',
    'Every breath sends a slow ripple through {their} vast, jiggling form.',
    '{They} {verb:be} magnificently heavy — warm flesh layered in deep, shifting abundance.',
  ]},
  { when: { stageMin: 9 }, text: [
    '{They} {verb:be} colossal — a vast, warm presence that reshapes the space around {them}.',
    '{Their} body is a temple of abundance, impossibly soft and impossibly large.',
  ]},
  { when: {}, text: [
    '{Their} body speaks of Gorgara\'s blessing — soft, full, and beautiful.',
  ]},
]);

// ── npc.observe.clothing — FULL SENTENCE (standalone; never joined with body) ───

registerPool('npc.observe.clothing', [
  { when: { stageMin: 0, stageMax: 2 }, text: [
    '{Their} clothes fit well, though the fabric pulls slightly across {their} hips.',
    '{Their} outfit still hangs easily, with only the faintest tug at the waist.',
    'Nothing strains yet — only the promise of curves testing the seams soon.',
  ]},
  { when: { stageMin: 3, stageMax: 5 }, text: [
    '{Their} outfit hugs {their} figure a little more honestly than it used to.',
    'Fabric settles closer at the middle, honest about new softness.',
    'Buttons and waistbands are working a little harder than last month.',
  ]},
  { when: { stageMin: 6, stageMax: 8 }, text: [
    'Fabric strains audibly when {they} {verb:move} — buttons threatening, seams whispering.',
    '{Their} outfit has given up pretending; it simply holds on where it can.',
    'Layers pull drum-tight across {their} middle, more suggestion than coverage.',
  ]},
  { when: { stageMin: 9 }, text: [
    'What remains of {their} clothing is mostly decoration on an overwhelming body.',
    'Straps and scraps of fabric cling to curves far beyond their design.',
    'Garments survive only where {their} abundance allows them room.',
  ]},
  { when: {}, text: [
    '{Their} clothes tell the story of recent growth — tighter, braver, more honest.',
    'Fabric and flesh negotiate in plain sight, and fabric is losing gracefully.',
  ]},
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
  return render('{npc.observe.pose}', ctx, { trace: opts.trace });
}

export { POSES };
