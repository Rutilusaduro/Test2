// ═══════════════════════════════════════════════════════════════
// GROWTH EVENT — environment & destruction pools. Keyed on locale ×
// stage band × bodyType. Style ledger: no big-scale / stuck refs
// below endStage 7.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

// ── ge.furnitureEvent ──────────────────────────────────────────
// Shape: FULL SENTENCE. What the furniture does as she grows. Bands:
// 4-5 creak, 6-8 break, 9+ furniture is hopeless.
registerPool('ge.furnitureEvent', [
  { when: {}, text: [
    'The chair under her gives a quiet, uncertain creak.',
    'Something in the room shifts to accommodate her, or tries to.',
    'The seat beneath her complains softly about the new arrangement.',
  ] },
  // light-to-mid: creaking
  { when: { endStageMin: 4, endStageMax: 5 }, text: [
    'The chair creaks in earnest now, legs splaying a fraction wider.',
    'Whatever she\'s sitting on protests the new weight with a long groan.',
  ] },
  // heavy: breaking
  { when: { endStageMin: 6, endStageMax: 8 }, text: [
    'The chair gives out under her with a sharp crack, and she settles to a lower, sturdier surface.',
    'A leg snaps clean off whatever she was on, and the rest follows.',
    'The seat splinters beneath her; she barely seems to notice.',
  ] },
  // vast: nothing holds
  { when: { endStageMin: 9 }, text: [
    'There\'s nothing in the room built to hold her anymore, and the floor will have to do.',
    'Furniture stopped being an option for her a while ago; she lowers herself carefully to the reinforced floor.',
  ] },
  // locale: stream gaming chair (Destiny et al.)
  { when: { locale: 'stream_setup', endStageMin: 4, endStageMax: 7 }, weight: 3, text: [
    'The gaming chair shrieks under her, armrests bowing outward, hydraulics whining in defeat.',
    'Her stream chair bottoms out with a hydraulic hiss and refuses to rise again.',
  ] },
  { when: { locale: 'stream_setup', endStageMin: 8 }, weight: 3, text: [
    'The gaming chair finally explodes under her on camera — the clip will outlive the channel.',
  ] },
  // locale: dining hall (contest)
  { when: { locale: 'dining_hall', endStageMin: 5 }, weight: 2, text: [
    'The contest bench groans, then buckles, and the crowd loses its mind.',
  ] },
  // locale: kitchen (cultivator)
  { when: { locale: 'kitchen', endStageMin: 5 }, weight: 2, text: [
    'The prep stool gives out under her, and Reneé just slides over a reinforced one without comment.',
  ] },
  // bodyType flavor at break bands
  { when: { bodyType: 'pear', endStageMin: 6 }, weight: 2, text: [
    'Her spreading hips crack the seat sideways before it gives entirely.',
  ] },
  { when: { bodyType: 'apple', endStageMin: 6 }, weight: 2, text: [
    'Her belly settles into her lap heavy enough that the chair simply folds beneath the load.',
  ] },
]);

// ── ge.spaceEvent ──────────────────────────────────────────────
// Shape: FULL SENTENCE. Doorways, desks, getting stuck. endStageMin 7
// only — never reference scale-of-space below heavy.
registerPool('ge.spaceEvent', [
  { when: {}, text: ['', '', ''] },
  { when: { endStageMin: 7 }, text: [
    'She makes a mental note that the doorway is going to be a problem now.',
    'The gap between her and the desk has quietly closed to nothing.',
  ] },
  { when: { endStageMin: 8 }, weight: 2, text: [
    'Getting up will mean turning sideways through every door from here on.',
    'She tests the armchair she came in by and finds she no longer fits it at all.',
  ] },
  { when: { endStageMin: 9 }, weight: 2, text: [
    'The room itself feels smaller around her now — walls closer, doorways theoretical.',
  ] },
  { when: { locale: 'stream_setup', endStageMin: 7 }, weight: 2, text: [
    'She has to angle herself to keep her whole frame in the camera, and gives up halfway.',
  ] },
]);
