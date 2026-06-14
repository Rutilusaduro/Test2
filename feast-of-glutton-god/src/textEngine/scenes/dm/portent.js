import { registerPool, createContext, render } from '../../engine.js';

// ── dm.portent — divine attention portents (FULL SENTENCE) ───────
registerPool('dm.portent', [
  { when: { portentId: 'omen_lantern' }, text: [
    '★ A Lumen lantern gutters without wind — diviners wake sweating, muttering of appetite outside the Wheel.',
    '★ Star-charts show a blank hunger where no god should be. Someone in the Reach is breaking the story.',
    '★ Lantern-oracles record the omen: excess that does not belong to Sylwen\'s measured plenty.',
  ]},
  { when: { portentId: 'inquisition_whispers' }, text: [
    '★ Whispers reach the Measured Hand — heresy that fattens instead of kills. Inquisitors sharpen their questions.',
    '★ Church couriers ride faster. The orthodox world has heard your name, if not your joke.',
    '★ Confessionals fill with rumors of a native who feeds what should not exist.',
  ]},
  { when: { portentId: 'schism_rumor' }, text: [
    '★ Schism stirs in Aurelan\'s clergy — some call your excess plague, others temptation they cannot name.',
    '★ Temple debates turn bitter: is limitless fullness sin, or a test the Wheel failed to foresee?',
    '★ Two sermons, one Sunday: the Church frays at the seams while you grow.',
  ]},
  { when: { portentId: 'refugee_tide' }, text: [
    '★ Refugees flee border villages — not from war, but from kitchens that never empty and waists that will not stay small.',
    '★ A tide of frightened folk carries word of your gospel to cities that would rather not listen.',
    '★ The roads clog with wagons and worry. Your abundance leaves footprints in panic.',
  ]},
  { when: { portentId: 'divine_council' }, text: [
    '★ The divine council convenes — Aurelan, Sylwen, and the Wheel\'s high gods in rare, frightened accord.',
    '★ Apotheosis weather: the pantheon names you crisis, heresy, and the punchline they cannot stop.',
    '★ Act III knocks. The gods have noticed; your patron purrs in answer.',
  ]},
  { when: {}, text: [
    '★ Something shifts in the celestial machinery — a portent, a warning, a story bending.',
    '★ The Wheel creaks. The earnest world does not know why yet. You do.',
    '★ Divine attention gathers like storm-light. The narrator stops smirking quite so much.',
  ]},
]);

export function renderPortentBeat(game, portentId, opts = {}) {
  const ctx = createContext({
    subject: game?.player,
    globals: {
      portentId,
      escalationTier: game?.worldFlags?.escalationTier ?? 0,
      region: game?.region,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render('{dm.portent}', ctx, { trace: opts.trace });
}
