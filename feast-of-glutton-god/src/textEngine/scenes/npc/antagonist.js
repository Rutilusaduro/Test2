/**
 * Recurring antagonists — Sister Verity (Inquisition) & Sylwen herald.
 * Earnest voices only; escalation via divineAttention / escalationTier.
 */
import { registerPool, createContext, render } from '../../engine.js';

const W = 4;

// ── Verity talk (role: inquisitor) ───────────────────────────────

registerPool('npc.talk.antagonist', [
  { when: { role: 'inquisitor', escalationTier: 0 }, weight: W, text: [
    'Sister Verity\'s warrant crackles with Aurelan\'s seal. "You will measure yourself, heretic, or we will measure you."',
    '"The Church has names for what you do." Her eyes are tired, sincere, afraid of you. "I intend to use them."',
  ]},
  { when: { role: 'inquisitor', escalationTier: 1 }, weight: W, text: [
    '"Lantern-oracles dream of you." Verity\'s voice hardens. "I do not dream. I indict."',
    'She cites Sylwen\'s harvest law like a blade. "Plenty has a portion. You are the portion that should not exist."',
  ]},
  { when: { role: 'inquisitor', escalationTier: 2 }, weight: W, text: [
    'White flame rims her armor — miracle now, not metaphor. "The Measured Hand no longer sends patrols alone. It sends me."',
    '"I have buried parishioners who ate at your tables." Verity does not blink. "I will bury your gospel next."',
  ]},
  { when: { role: 'inquisitor', escalationTierMin: 3 }, weight: W, text: [
    'Saint-blessed radiance pours from Verity — earnest horror made luminous. "The council convenes because of you. I am its verdict."',
    '"I do not hate you." Her jaw trembles. "I fear what you make holy. That is worse."',
  ]},

  // Sylwen herald — tragic foil
  { when: { role: 'herald' }, weight: W, text: [
    'Sister Amaran\'s voice is harvest-gentle. "Sylwen weeps for measured plenty. You are the flood She cannot cup in Her hands."',
    '"I was sent to plead, not to punish." Amaran\'s eyes shine. "Please — stop before the Lean Saint must."',
    'Green vestments, soft vowels, terrible sincerity — the goddess\'s herald sounds like spring and reads like winter.',
  ]},

  { when: {}, text: [
    'The exchange ends — measured silence, earnest eyes.',
    'Words hang between you like incense.',
    'Neither of you pretends this is an ordinary road anymore.',
  ]},
]);

// ── Per-act confrontations (narrator / event beats) ──────────────

registerPool('npc.antagonist.verity.act', [
  { when: { act: 1, escalationTierMax: 1 }, text: [
    '★ Act I — Sister Verity serves warrants in Harvest\'s Hearth, face pale with honest disgust. "Cease this… feeding heresy."',
    '★ A beat-cop inquisitor at the village edge — earnest, outmatched, still writing your name in the Church ledger.',
  ]},
  { when: { act: 2, escalationTierMin: 1, escalationTierMax: 2 }, text: [
    '★ Act II — Verity leads a checkpoint column. "The Wheel will balance you," she vows — and means every syllable.',
    '★ Propaganda broadsheets flutter: heretic-anomaly, feast-cult, your face sketched by frightened clerks. Verity signs each one.',
  ]},
  { when: { act: 3, escalationTierMin: 3 }, text: [
    '★ Act III — Miracle-fire crowns Verity at the Citadel gate. "I will not convert. I will not swell. I will end you."',
    '★ Javert\'s last stand — except she believes the law is good, and you are the story that broke it.',
  ]},
  { when: {}, text: [
    '★ Sister Verity finds you again — same oath, harder eyes, holier steel.',
    '★ The Inquisition\'s earnest face returns. No wink. Only judgment.',
  ]},
]);

// ── God-herald ultimatums (in-world, not DM) ─────────────────────

registerPool('npc.herald.pantheon', [
  { when: { heraldId: 'sylwen', escalationTierMin: 2 }, text: [
    '"Sylwen offers one measure still," Amaran says. "Kneel. Fast. Beg Her forgiveness before the Saint arrives."',
    'The herald\'s hands shake around her sickle-symbol. "She does not want your death. She wants you… small again."',
  ]},
  { when: { heraldId: 'aurelan', escalationTierMin: 3 }, text: [
    'Aurelan\'s messenger reads a crown-edict without looking at you. "Law names you crisis. Law will digest you."',
  ]},
  { when: { heraldId: 'lumen', escalationTierMin: 2 }, text: [
    'Brother Cael does not bow. "The charts are clear. You are outside the Wheel. Please — before the council acts."',
  ]},
  { when: {}, text: [
    'A herald of the Measured Wheel delivers ultimatum — earnest, frightened, still believing the gods are just.',
    'The gods speak through a mortal mouth — polite, terrified, sincere.',
    'Ultimatum without irony: kneel, measure, stop — before the Wheel breaks you.',
  ]},
]);

export function renderVerityConfrontation(game, opts = {}) {
  const act = opts.act ?? inferAct(game);
  const ctx = createContext({
    subject: game?.player,
    globals: {
      act,
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      divineAttentionTier: game?.worldFlags?.divineAttentionTier ?? 0,
      region: game?.region,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{npc.antagonist.verity.act}', ctx, { trace: opts.trace });
}

export function renderHeraldUltimatum(game, heraldId = 'sylwen', opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    globals: {
      heraldId,
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      region: game?.region,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{npc.herald.pantheon}', ctx, { trace: opts.trace });
}

function inferAct(game) {
  const wf = game?.worldFlags ?? {};
  if (wf.main_act3_complete || wf.act3_gates_unlocked) return 3;
  if (wf.main_act2_complete || wf.act2_gates_unlocked) return 2;
  return 1;
}
