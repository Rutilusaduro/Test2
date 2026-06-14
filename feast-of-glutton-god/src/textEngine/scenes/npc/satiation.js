import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

// ── satiation pushback (FULL SENTENCE) ─────────────────────────

registerPool('npc.satiation.pushback', [
  { when: { satiationTier: 1 }, text: [
    '{subject.first} exhales slow — full, but not finished with you. Growth lands softer now.',
    'She moans through the swell, pleasantly heavy. "Easy," she breathes. "I\'m still yours."',
    'The magic still works, but her body meets it like a full cup — spillage gentler, slower.',
    'A dazed smile; she is sated, not starving, and the next inch takes patience.',
    'She cradles new curves with trembling delight. "More — but not so fast."',
    'Fullness lingers in her voice; growth continues, muffled by contentment.',
  ]},
  { when: { satiationTier: 2 }, text: [
    '{subject.first} groans — stuffed, overwhelmed, still hungry for you but not for size.',
    'She doubles over her own belly, breath shallow. The spell works; she wishes it didn\'t.',
    '"Too much," she whimpers — not refusal, but a plea for mercy between gasps.',
    'Growth fights a body already victorious; she shudders, tears and pleasure mixed.',
    'Her hands push weakly at the air, as if she could slow the magic by wanting to.',
    'She is magnificent and miserable at once — full past comfort, still swelling.',
  ]},
  { when: { archetype: 'shy' }, text: [
    '{subject.first} blushes furious, mortified by how much she already holds.',
    'She hides her face in her hands, body betraying her with another soft inch.',
  ]},
  { when: { archetype: 'proud' }, text: [
    '"I am not a bottomless vessel," {subject.first} snaps — pride bruised, breath short.',
    'She straightens what she can, dignity warring with the plush truth of her body.',
  ]},
  { when: {}, text: [
    '{subject.first} breathes through the pressure — growth slows but does not stop.',
    'She is full; the magic respects it only a little.',
    'Satiety tempers the swell — less dramatic, more trembling.',
  ]},
]);

// ── satiation refusal (DIALOGUE BEAT) ───────────────────────────

registerPool('npc.refusal', [
  { when: { satiationTierMin: 3, archetype: 'nurturing' }, text: [
    '"Sweetheart, no — I\'m fit to burst. Hold me instead of feeding me."',
    '"Not another bite, love. I need your arms, not your magic."',
  ]},
  { when: { satiationTierMin: 3, archetype: 'performer' }, text: [
    '"The show\'s over — I can\'t take a bigger costume tonight."',
    '"Darling, I\'m stuffed past my best angle. Let me breathe."',
  ]},
  { when: { satiationTierMin: 3, archetype: 'devout' }, text: [
    '"The goddess gave enough for one vigil. I must rest in her warmth."',
    '"Sacred fullness has found me. Do not ask more until I have prayed."',
  ]},
  { when: { satiationTierMin: 3, archetype: 'shy' }, text: [
    '"P-please — I can\'t… not another inch. I\'ll break."',
    'She shakes her head, eyes wet. "I want you. I don\'t want more size."',
  ]},
  { when: { satiationTierMin: 3, archetype: 'haughty' }, text: [
    '"Absolutely not. I am not your endless feast."',
    '"You will wait until I am presentable again."',
  ]},
  { when: { satiationTierMin: 3 }, text: [
    '"Stop — I *can\'t*, not another bite."',
    '"No more magic. I\'m overflowing."',
    'She holds up a trembling hand. "I need rest, not growth."',
    '"Please," she gasps, "let me be full in peace."',
    'Her voice breaks: "I\'m yours — but I\'m done swelling today."',
    '"Enough," she whispers, belly tight. "Enough."',
  ]},
  { when: {}, text: [
    '{subject.first} refuses gently — body full, spirit frayed.',
    'She cannot take more right now.',
    'Rest is the only appetite she has left.',
  ]},
]);

export function renderSatiationRefusal(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      satiationTier: opts.tier?.id ?? 3,
      interaction: 'refusal',
    },
    history: opts.history,
    seed: opts.seed,
  });
  const push = render('{npc.satiation.pushback}', ctx, { trace: opts.trace });
  const refuse = render('{npc.refusal}', ctx, { trace: opts.trace });
  return [push, refuse].filter(Boolean).join('\n\n');
}

export function renderSatiationPushback(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: { satiationTier: opts.tier?.id ?? 1 },
    history: opts.history,
    seed: opts.seed,
  });
  return render('{npc.satiation.pushback}', ctx, { trace: opts.trace });
}
