import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.feed.opening', [
  { when: { feedType: 'magical' }, text: [
    'You conjure a shimmering platter of golden delicacies. {subject.first}\'s eyes widen with hunger.',
    'Magical aromas swirl around {subject.name}, and her lips part eagerly.',
  ]},
  { when: { feedType: 'hand' }, text: [
    'You lift a honeyed pastry to {subject.name}\'s lips. She leans in without hesitation.',
    'Hand-feeding {subject.first}, you watch her cheeks flush with pleasure.',
  ]},
  { when: { feedType: 'feast' }, text: [
    'The feast table groans under impossible bounty. {subject.name} moans at the sight.',
    'Course after course appears — {subject.first} can barely wait to begin.',
  ]},
  { when: {}, text: [
    'You offer food to {subject.name}, and abundance answers.',
  ]},
]);

registerPool('npc.feed.reaction', [
  { when: { corruption: 0 }, text: [
    '"I… shouldn\'t," she murmurs, but her mouth is already full.',
    'She eats with guilty pleasure, unable to stop.',
  ]},
  { when: { corruption: 1 }, text: [
    '"It feels so good," she whispers, voice husky with pleasure.',
    'She catches herself reaching for more and doesn\'t stop.',
  ]},
  { when: { corruption: 2 }, text: [
    '"More," she breathes. "Don\'t stop — make me bigger."',
    'She pats her swelling belly with open pride and opens wide for another bite.',
  ]},
  { when: {}, text: [
    '{subject.first} moans softly as the food settles into new softness.',
  ]},
]);

registerPool('npc.feed.growth', [
  { when: { stageMin: 0, stageMax: 3 }, text: [
    'Her stomach pushes outward, rounding into a soft pot belly that fills your palm.',
    'Her thighs thicken noticeably, hips widening with a gentle creak of her belt.',
  ]},
  { when: { stageMin: 4, stageMax: 6 }, text: [
    'Her belly blooms outward in a smooth, heavy wave, breasts straining against fabric.',
    'Her hips and rear expand dramatically, seams splitting along delighted curves.',
  ]},
  { when: { stageMin: 7 }, text: [
    'Her body surges violently — belly exploding into a massive apron, breasts and hips ballooning to match.',
    'She dominates the space now, every inch of her jiggling with newfound mass.',
  ]},
  { when: {}, text: [
    'Weight settles into {subject.first} visibly, reshaping her in real time.',
  ]},
]);

export const FEED_TEMPLATE = '{npc.feed.opening} {npc.feed.reaction} {npc.feed.growth}';

export function renderFeed(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      feedType: opts.feedType || 'hand',
      growthMethod: 'feed',
      location: opts.location,
    },
    seed: opts.seed,
    history: opts.history,
  });
  return render(FEED_TEMPLATE, ctx);
}
