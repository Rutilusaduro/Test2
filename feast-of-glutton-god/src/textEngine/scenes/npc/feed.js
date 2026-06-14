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
  { when: { consentState: 'forced', severityMin: 2 }, text: [
    '{subject.first} tries to twist away — food and magic follow anyway.',
    '"Don\'t," she chokes out, mouth still wet with your offering.',
    'Her eyes flash anger and fear; she swallows because her body insists.',
    'She hates that she can taste how good it is while hating that it happens.',
  ]},
  { when: { consentState: 'forced' }, text: [
    'She eats because the spell leaves her no graceful exit — shame hot on her cheeks.',
    '{subject.first} trembles; pleasure and protest war in the same breath.',
    '"Why," she whispers, not asking for food — asking for mercy.',
    'Resistance thins; fullness arrives like a verdict.',
  ]},
  { when: { gainDesireMin: 75 }, text: [
    '"More," {subject.first} moans before you offer the next bite — insatiable, adored.',
    'She feeds from your hand like worship, hips rolling with each swallow.',
    'Her hunger is holy; every crumb is communion.',
  ]},
  { when: { gainDesireMin: 50 }, text: [
    'She eats with eager grace — appetite an open door you are welcome to walk through.',
    '{subject.first} purrs around your fingers, already asking with her eyes.',
  ]},
  { when: { relationship: [0, 1], corruption: 0 }, text: [
    '"I… shouldn\'t," she murmurs, but her mouth is already full.',
    'She eats with guilty pleasure, unable to stop.',
  ]},
  { when: { relationship: 2, corruption: 0 }, text: [
    'She trusts you enough to savor without shame — cheeks flushing as she chews.',
    '"You always know what I need," she sighs between bites.',
  ]},
  { when: { relationship: [3, 4, 5], corruption: 0 }, text: [
    'She eats from your hand like a lover, eyes locked on yours.',
    '"Feed me," she whispers — not a request, but a gift she gives you.',
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
      consentState: opts.consentState || 'willing',
      severity: opts.severity ?? 0,
      gainDesire: opts.gainDesire ?? npc.gainDesire,
    },
    seed: opts.seed,
    history: opts.history,
  });
  const main = render(FEED_TEMPLATE, ctx, { trace: opts.trace });
  if (opts.consentState === 'forced') {
    const forced = render('{npc.growth.forced}', ctx, { trace: opts.trace });
    return [main, forced].filter(Boolean).join(' ');
  }
  if ((opts.gainDesire ?? npc.gainDesire ?? 0) >= 50 && opts.consentState !== 'forced') {
    const rapture = render('{npc.growth.rapture}', ctx, { trace: opts.trace });
    return [main, rapture].filter(Boolean).join(' ');
  }
  return main;
}
