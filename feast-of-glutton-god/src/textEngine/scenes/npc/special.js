import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

// ── SPECIAL action (FULL SENTENCE) ─────────────────────────────

registerPool('npc.special.invoke', [
  { when: { playerClass: 'bard' }, text: [
    'You perform a private growth ballad. {subject.first}\'s body sways in time, swelling with each verse.',
    'Music and magic twine — every note lands on her hips like a caress.',
  ]},
  { when: { playerClass: 'wizard' }, text: [
    'You conjure a cauldron of experimental feast-magic. {subject.first} watches, fascinated, as the brew swells her.',
    'Arcane steam curls into her lungs; she grows drunk on formula and fullness.',
  ]},
  { when: { playerClass: 'cleric' }, text: [
    'You lead a prayer of abundance. Golden light pours into {subject.first}, belly rounding with divine pleasure.',
    'Sacred warmth pools where you aim it — worship made flesh.',
  ]},
  { when: { playerClass: 'warlock' }, text: [
    'You invoke Gorgara\'s Claim — hunger floods {subject.first} until she moans your name.',
    'Pact-light devours her resistance; curves arrive like tribute.',
  ]},
  { when: { consentState: 'forced' }, text: [
    'Your subclass gift becomes a brand — power she did not ask for reshapes {subject.first} anyway.',
    'The special rite completes; she is softer, and the softness is not her choice.',
    'Sacred technique meets unwilling flesh; the magic is exquisite, her fear is real.',
    'You pour your class into her; she receives it with shaking breath.',
  ]},
  { when: { gainDesireMin: 50 }, text: [
    '{subject.first} leans into your signature magic — subclass and desire singing the same song.',
    'She knew what your class does to bodies; she wanted you to show her.',
  ]},
  { when: {}, text: [
    'You unleash your class gift upon {subject.name} — intimate, dangerous, delicious.',
    'Subclass magic finds her skin and stays.',
    'The rite is personal; the growth is undeniable.',
  ]},
]);

export function renderSpecial(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      playerClass: opts.playerClass ?? player?.classId,
      consentState: opts.consentState ?? 'willing',
      severity: opts.severity ?? 0,
      gainDesire: opts.gainDesire,
    },
    history: opts.history,
    seed: opts.seed,
  });
  return render('{npc.special.invoke}', ctx, { trace: opts.trace });
}
