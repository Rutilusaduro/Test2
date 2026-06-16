// ═══════════════════════════════════════════════════════════════
// SCENE: COMBAT CAST — spellcasting feedback (invoke / fizzle / block)
// School-flavored, action-economy aware, Mercer-grade sensory prose.
// ═══════════════════════════════════════════════════════════════
import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

// ── invoke school flavor (PARTICIPLE CLAUSE) ───────────────────
// Stacked after skeletons in dm.cast.invoke.

registerPool('dm.cast.invoke.school', [
  { when: { spellSchool: 'abundance' }, text: [
    'golden caloric light pooling in your palms',
    'warm abundance coiling like honeyed breath',
    'divine excess shimmering at your fingertips',
    'a swell of sacred calories answering your call',
    'goddess-blessed fullness gathering, eager to spill',
    'ripe warmth blooming through the verse',
    'soft golden pressure building under your skin',
    'the air thickening with edible radiance',
  ]},
  { when: { spellSchool: 'enchantment' }, text: [
    'sweet persuasion threading through the words',
    'charm-sugar dripping from each syllable',
    'a hypnotic warmth lacing your voice',
    'desire made audible, velvet and insistent',
    'temptation curling off your tongue like steam',
    'enchanted honey settling in the air',
    'whispered craving taking shape between you',
    'siren-soft suggestion wrapping the moment',
  ]},
  { when: { spellSchool: 'transmutation' }, text: [
    'flesh-magic rippling outward in visible waves',
    'curves rewriting themselves at your command',
    'transmuting warmth rolling through the weave',
    'bodies bending toward abundance on your breath',
    'soft matter answering with eager expansion',
    'the spell kneading reality like dough',
    'hip and belly and thigh reshaped mid-incantation',
    'golden metamorphosis sparking along the verse',
  ]},
  { when: { spellSchool: 'evocation' }, text: [
    'raw caloric force snapping into a hard edge',
    'voluptuous impact coiled and ready to release',
    'pressure building — delicious, dangerous, bright',
    'a bolt of indulgent violence taking form',
    'kinetic abundance crackling at the release',
    'force made of feast and frenzy',
    'the air bruising with pleasurable menace',
    'explosive softness hammered into a single point',
  ]},
  { when: { spellSchool: 'conjuration' }, text: [
    'summoned sweetness materializing from nothing',
    'cream and syrup and fruit phasing into being',
    'conjured indulgence dripping into existence',
    'a platter of impossible delicacies taking shape',
    'sticky abundance condensing mid-air',
    'feast-stuff woven from thin caloric thread',
    'golden food-mist solidifying at your gesture',
    'rich conjuration spilling warm across the field',
  ]},
  { when: {}, text: [
    'arcane warmth gathering at your command',
    'magic made tactile, heavy, hungry',
    'power swelling in time with your breath',
    'the weave answering with sensual certainty',
    'spell-light pooling, patient and obscene',
    'energy coiling — beautiful, deliberate, yours',
    'the verse finding flesh to lavish',
    'arcana thick as cream on your tongue',
  ]},
]);

// ── invoke payment flavor (PARTICIPLE CLAUSE) ──────────────────

registerPool('dm.cast.invoke.payment', [
  { when: { paidBy: 'ap' }, text: [
    'paid from your own Abundance — a little of yourself spent',
    'drawn from the well inside your belly, not a slot',
    'your personal reserve thinning to fuel the cast',
    'raw AP bleeding out as warm, willing sacrifice',
    'no slot opens — only your stored feast-light drains',
    'you spend of yourself, and the magic tastes like hunger',
    'internal abundance poured straight into the verse',
    'the cost taken from your curves, not your book',
  ]},
  { when: { paidBy: 'gift' }, text: [
    'paid from the divine gift — no slot, no cost, only grace',
    'a creation blessing spent, warm and weightless',
    'the Fat Goddess\'s gift opens the verse for free',
    'miracle-casting — one of your sacred free casts',
    'no purse touched; the gift remembers your name',
    'forbidden power lent at character\'s dawn, still yours',
    'a third-level miracle, freely given and freely spent',
    'the gift burns once more — sumptuous and unpriced',
  ]},
  { when: { paidBy: 'slot' }, text: [
    'a prepared slot snapping open, clean and sure',
    'ritual structure catching the power perfectly',
    'disciplined casting — slot-spent, no waste',
    'the verse riding a formal channel of stored grace',
    'your slot unwinds like a held breath released',
    'book-learned abundance unsealed in one motion',
    'structured magic, paid properly from the weave',
    'a crisp expenditure — slot gone, spell sure',
  ]},
  { when: {}, text: [
    'cantrip breath — no slot, only skill and appetite',
    'innate magic, practiced until it feels like touch',
    'the smallest verse, spent from habit not purse',
    'free of slots yet never free of effort',
    'a cantrip\'s easy warmth on your lips',
    'magic that costs only the action you give it',
    'the leanest cast — still delicious, still yours',
    'no purse opened; only will and warmth',
  ]},
]);

// ── invoke (FULL SENTENCE) ─────────────────────────────────────

registerPool('dm.cast.invoke', [
  { when: { castType: 'bonus', paidBy: 'ap' }, text: [
    'You steal a quick breath and spend of yourself — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Between heartbeats you bleed a little Abundance: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'A bonus verse, paid from your own reserves — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Fast magic, intimate cost: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'You flick the spell off your fingers before the moment passes — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'A swift indulgence, AP-drawn: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
  ]},
  { when: { castType: 'bonus' }, text: [
    'Quick as a stolen kiss — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'You spend your bonus breath on magic: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'A minor verse, major sensation: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Between larger moves you weave something small and wicked — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Bonus action, full appetite: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'The quick cast lands before they can blink — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
  ]},
  { when: { paidBy: 'ap' }, text: [
    'You open yourself instead of a slot — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Raw Abundance leaves your body to pay the verse: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'No slot left; you spend of yourself, and it feels obscene and right — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'The magic drinks from your personal feast-light: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'You cast on hunger alone — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'AP pours out like warm syrup as the spell takes — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
  ]},
  { when: {}, text: [
    'You speak the verse — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Magic leaves your lips heavy with intent: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'The weave answers, sensual and sure — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Your action becomes incantation: {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'Power gathers, releases, and the air sighs — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
    'You cast, and the battlefield feels it in its bones — {dm.cast.invoke.school|prefix:}{dm.cast.invoke.payment|prefix: }.',
  ]},
]);

// ── fizzle (FULL SENTENCE) ─────────────────────────────────────

registerPool('dm.cast.fizzle', [
  { when: { failCause: 'no_resource' }, text: [
    'The verse dies in your throat — you\'ve nothing left to spend it on.',
    'Your lips shape the words, but no slot opens and no Abundance answers.',
    'Magic stumbles, starved — empty purse, empty well, empty air.',
    'The incantation collapses, hungry for a cost you cannot pay.',
    'You reach for power and find only echo — no slot, no AP, no spark.',
    'The spell wilts before it blooms, bereft of fuel.',
    'A half-born warmth flickers out — you are tapped dry.',
    'Golden syllables fall flat, unpaid and unfinished.',
  ]},
  { when: { failCause: 'no_action' }, text: [
    'You try to cast again, but your action is already spent — the verse crumbles.',
    'The magic starts, then remembers you already moved — and refuses.',
    'One action per breath; yours is gone, and the spell knows it.',
    'Your hands lift, but the turn has no room left for a full casting.',
    'The incantation stutters against the economy of the moment.',
    'You cannot pour a second action into the same heartbeat.',
    'The weave slackens — you already spent the weight of this turn.',
    'Words form, then dissolve; your action was given elsewhere.',
  ]},
  { when: { failCause: 'no_bonus' }, text: [
    'A quick spell dies on your tongue — your bonus breath is already spent.',
    'You flick your fingers, but the minor verse has no opening left.',
    'The bonus action you need is gone; the magic fizzles, petulant.',
    'Too slow — you already spent that stolen heartbeat.',
    'The small cast collapses; no bonus remains in this turn.',
    'Your swift magic finds the door locked from inside.',
    'A bonus verse wants a bonus you no longer have.',
    'The flirtatious little spell sputters out, outpaced by your own haste.',
  ]},
  { when: {}, text: [
    'The magic gutters and fails, unsatisfied.',
    'Something essential is missing — the spell will not come.',
    'The verse folds in on itself, unfinished.',
  ]},
]);

// ── noaction / nobonus (FULL SENTENCE) ─────────────────────────

registerPool('dm.cast.noaction', [
  { when: {}, text: [
    'Your action is spent — the spell will not move until you breathe again.',
    'You already committed this turn\'s weight; the verse waits.',
    'One action only — yours is gone, and magic respects the rule.',
    'The incantation halts at your lips; no second action remains.',
    'You feel the spell strain against a turn already spent.',
    'The weave refuses — your action belongs to another choice now.',
  ]},
]);

registerPool('dm.cast.nobonus', [
  { when: {}, text: [
    'Your bonus breath is gone — the quick spell cannot fire.',
    'No minor action remains; the small magic folds away.',
    'You already spent that stolen heartbeat on something else.',
    'The bonus verse needs a opening you closed a moment ago.',
    'Swift magic demands a swift action you no longer have.',
    'The flirt of a spell dies quiet — bonus spent.',
  ]},
]);

// ── render API ─────────────────────────────────────────────────

function paidByFromCost(cost) {
  if (!cost?.ok) return null;
  if (cost.method === 'ap') return 'ap';
  if (cost.method === 'slot') return 'slot';
  if (cost.method === 'gift') return 'gift';
  return 'cantrip';
}

export function renderCastFeedback(kind, caster, spell, opts = {}) {
  const poolKey = `dm.cast.${kind}`;
  const globals = {
    spellSchool: spell?.school || 'abundance',
    castType: spell?.actionType === 'bonus' ? 'bonus' : 'action',
    paidBy: opts.paidBy ?? paidByFromCost(opts.cost),
    failCause: opts.failCause ?? null,
    spellName: spell?.name,
  };
  const ctx = createContext({
    subject: caster,
    globals,
    seed: opts.seed,
  });
  return render(`{${poolKey}}`, ctx, { trace: opts.trace }).trim();
}
