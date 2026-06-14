import { registerPool, createContext, render } from '../../engine.js';

// ── favor low warning (FULL SENTENCE) ──────────────────────────
registerPool('dm.favor.low', [
  { when: { favorState: 'low', action: 'growth' }, text: [
    'Gorgara\'s attention thins — your next swell may need to wait for a sweeter offering.',
    'The goddess still watches, but her favor pools shallow; eat before you lavish more growth.',
    'Magic strains at the edge of refusal — not denial, but a hungry god asking you to refuel.',
  ]},
  { when: { favorState: 'low' }, text: [
    'You feel the Everfull\'s gaze grow distant — favor ebbs like tide before feast.',
    'Your spark still burns, but Gorgara withholds the easy miracles until you indulge yourself.',
    'Abundance is not infinite today; the goddess whispers: *feed yourself first.*',
  ]},
  { when: {}, text: [
    'Favor runs low — the path of plenty demands reciprocity.',
    'Even chosen vessels must eat; Gorgara\'s gift is not a bottomless well.',
    'Rest, feast, indulge — then return to the work of swelling willing flesh.',
  ]},
]);

// ── favor empty (FULL SENTENCE) ────────────────────────────────
registerPool('dm.favor.empty', [
  { when: { action: 'special' }, text: [
    'Your subclass sigil sputters — no favor left to sign another forced miracle today.',
    'The signature swell refuses you; Gorgara will not spend what you have not replenished.',
    'Even your pact-grown talent needs the goddess\'s attention — and she is not listening yet.',
  ]},
  { when: { action: 'bless' }, text: [
    'Blessing magic will not rise — your favor cup is empty, and the goddess waits to be fed.',
    'Holy swell-stuff stays dormant until you restore what reckless growth spent.',
    'No divine surplus remains for blessings; indulge, then try again.',
  ]},
  { when: {}, text: [
    'Gorgara turns her face away — no favor remains for overworld growth until you eat.',
    'The magic will not come; your daily ceiling is spent, and the goddess is hungry too.',
    'Empty favor — not punishment, but rhythm: feast yourself, then feast the world.',
  ]},
]);

// ── special per-NPC cooldown (DIALOGUE BEAT) ───────────────────
registerPool('dm.special.cooldown', [
  { when: { archetype: 'performer' }, text: [
    '"Not again today," she laughs softly — "even stars need intervals between encores."',
    '"You already wrote your verse on my body this morning — come back when the song resets."',
    '"Darling, once a day is plenty for that kind of spotlight."',
  ]},
  { when: { archetype: 'nurturing' }, text: [
    '"Sweetheart, I\'m still digesting the last blessing — give me till tomorrow."',
    '"Even willing bellies need rest between your miracles, love."',
    '"Patience — you\'ve had your special moment with me today."',
  ]},
  { when: { archetype: 'devout' }, text: [
    '"The rite has been sung upon me once today — sacred things are not spammed."',
    '"Gorgara\'s mark still warms my skin; return when the day turns."',
    '"One divine signature per dawn — that is enough holiness for now."',
  ]},
  { when: {}, text: [
    '"Not today — your special touch already found me once this day."',
    '"I\'m still glowing from earlier; try again after the sun moves on."',
    '"Once per day for that kind of magic — even I have limits."',
  ]},
]);

export function renderFavorWarning(player, game, opts = {}) {
  const pool = opts.favorState === 'empty' ? 'dm.favor.empty' : 'dm.favor.low';
  const ctx = createContext({
    subject: player,
    globals: {
      favorState: opts.favorState ?? 'low',
      action: opts.action ?? 'growth',
      region: game?.region,
    },
  });
  return render(`{${pool}}`, ctx, { trace: opts.trace });
}

export function renderSpecialCooldown(npc, player, game, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      archetype: npc?.archetype,
      region: game?.region,
    },
  });
  return render('{dm.special.cooldown}', ctx, { trace: opts.trace });
}
