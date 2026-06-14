import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('npc.unmet.descriptor', [
  { when: { role: 'innkeeper' }, text: [
    'A {bodyType.desc} woman tends the bar, wiping mugs with practiced warmth.',
    'Someone {word.body} works the hearth — apron dusted with flour, voice low and welcoming.',
  ]},
  { when: { role: 'bard' }, text: [
    'A {bodyType.desc} musician tunes a lute in the corner, humming under her breath.',
    'A lively figure {word.body} strums idle chords — you catch a flash of silver strings.',
  ]},
  { when: { role: 'blacksmith' }, text: [
    'A {bodyType.desc} smith hammers at the anvil, sparks and sweat in equal measure.',
    'Someone sturdy and {word.body} works the forge — muscles and appetite both on display.',
  ]},
  { when: { role: 'priestess' }, text: [
    'A {bodyType.desc} priestess arranges bread on a shrine shelf, lips moving in quiet prayer.',
    'A gentle, {word.body} figure in pale vestments tends a small altar.',
  ]},
  { when: { role: 'scholar' }, text: [
    'A {bodyType.desc} scholar hunches over scrolls, ink-stained fingers tracing old diagrams.',
    'Someone {word.body} mutters over a ledger — curiosity written in every restless gesture.',
  ]},
  { when: { role: 'witch' }, text: [
    'A {bodyType.desc} witch stirs a cauldron that smells of honey and forbidden spice.',
    'A {word.body} figure in dark silks watches the steam rise — amused, unhurried.',
  ]},
  { when: { role: 'noble' }, text: [
    'A {bodyType.desc} noblewoman surveys the crowd with cool appraisal.',
    'Someone {word.body} in fine fabrics pretends not to notice you — and fails.',
  ]},
  { when: { role: 'merchant' }, text: [
    'A {bodyType.desc} merchant counts coins behind a stall piled with sweets.',
    'A {word.body} trader calls out prices, voice rich as caramel.',
  ]},
  { when: { role: 'guard' }, text: [
    'A {bodyType.desc} guard stands watch, hand resting on a well-fed belt.',
    'Someone {word.body} in worn leathers scans the road with bored vigilance.',
  ]},
  { when: { role: 'inquisitor' }, text: [
    'A lean {bodyType.desc} inquisitor reads a Church warrant — white trim, harder eyes, no smile.',
    'Someone {word.body} in measured-mail watches you like a problem that must be solved.',
  ]},
  { when: { role: 'herald' }, text: [
    'A {bodyType.desc} herald in Sylwen\'s green tends a sickle-shrine — gentle face, terrible errand.',
    'Someone {word.body} in harvest vestments carries a goddess\'s plea like a blade wrapped in silk.',
  ]},
  { when: { role: 'diviner' }, text: [
    'A {bodyType.desc} diviner frowns at star-charts that will not balance — lantern ink, sleepless eyes.',
    'Someone {word.body} in Lumen\'s grey mutters numbers that should not exist in the Wheel.',
  ]},
  { when: {}, text: [
    'A {bodyType.desc} stranger goes about their business nearby.',
    'Someone {word.body} lingers in the scene — nameless for now, but not forgettable.',
  ]},
]);

export function renderUnmetDescriptor(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      role: npc.role,
      bodyType: npc.bodyType,
      interaction: 'unmet',
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{npc.unmet.descriptor}', ctx, { trace: opts.trace });
}
