import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

// ── forced / unwilling growth (FULL SENTENCE) ──────────────────

registerPool('npc.growth.forced', [
  { when: { severityMin: 3 }, text: [
    'Magic slams into {subject.name} and she *screams* — not pleasure, not yet — fear and fullness colliding.',
    '{subject.first} thrashes as the spell takes hold; growth that does not feel like a gift.',
    'She begs you to stop; the verse does not listen. Her body swells anyway, against her will.',
    'Terror and flesh race together — she is larger, and she is not grateful.',
  ]},
  { when: { severityMin: 2 }, text: [
    '{subject.name} recoils, but the abundance is already inside her — unwelcome heat spreading.',
    'She tries to step back; the magic follows, padding her hips with cruel gentleness.',
    '"No —" The word breaks as her belly rounds despite it.',
    '{subject.first} shakes, angry and afraid, curves blooming where she refused them.',
  ]},
  { when: { archetype: 'proud' }, text: [
    '{subject.first} spits fury through tears — humiliated, enlarged, still magnificent against her will.',
    'Pride cracks as her waist thickens; she hates that part of her moans anyway.',
  ]},
  { when: { archetype: 'shy' }, text: [
    '{subject.first} curls inward, sobbing as hidden softness becomes impossible to hide.',
    'She whispers apologies to no one — her body growing while she shrinks inside it.',
  ]},
  { when: {}, text: [
    'The spell meets resistance — and wins. {subject.first} swells with a shudder that is not joy.',
    'Magic pushes through her reluctance; she feels every unwilling inch.',
    'Her discomfort is legitimate; the narration does not mock it — only witnesses.',
    'Growth lands heavy and wrong-for-her; she pulls away too late.',
    'She is softer now, and the softness hurts her pride more than her skin.',
    'Abundance does not ask twice; {subject.first} learns that with a gasp.',
  ]},
]);

// ── willing rapture by gainDesire (FULL SENTENCE) ──────────────

registerPool('npc.growth.rapture', [
  { when: { gainDesireMin: 75 }, text: [
    '{subject.first} *arches* into the swell — ravenous, worshipful, begging the magic to finish her.',
    'Insatiable hunger meets your power; she is choir and altar in one trembling body.',
    '"Yes — yes — make me proof," she sobs, delighted to be ruined into softness.',
  ]},
  { when: { gainDesireMin: 50 }, text: [
    'She welcomes the growth like a lover\'s hands — eager, vocal, shameless.',
    '{subject.first} laughs through moans; every new roll of flesh is answered with gratitude.',
    'Desire and spell braid together; she is hungry, and you are feeding the right god.',
  ]},
  { when: { gainDesireMin: 25 }, text: [
    'Surprise melts into pleasure — {subject.first} discovers she wanted this more than she admitted.',
    'She exhales, trembling, as appetite opens like a flower under your care.',
  ]},
  { when: {}, text: [
    'Growth settles into {subject.first} — complicated, real, hers to feel.',
    'She breathes through the swell, finding her own meaning in it.',
    'Warmth spreads; her story with size continues.',
  ]},
]);

export function renderForcedGrowth(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      consentState: 'forced',
      severity: opts.severity ?? 1,
      growthMethod: opts.method ?? 'feed',
    },
    history: opts.history,
    seed: opts.seed,
  });
  return render('{npc.growth.forced}', ctx, { trace: opts.trace });
}

export function renderWillingRapture(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      consentState: 'willing',
      gainDesire: opts.gainDesire,
      growthMethod: opts.method ?? 'feed',
    },
    history: opts.history,
    seed: opts.seed,
  });
  return render('{npc.growth.rapture}', ctx, { trace: opts.trace });
}
