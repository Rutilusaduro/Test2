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
  // locale: Glutton God regions
  { when: { locale: 'village_inn', endStageMin: 6, endStageMax: 8 }, weight: 3, text: [
    'The taproom bench splinters; kegs wobble on the shelf behind her as the floor dips.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 9 }, weight: 3, text: [
    'The bar itself cracks under her — bottles cascade, and the hearth stones grind against new weight.',
  ] },
  { when: { locale: 'coastal_manor', endStageMin: 5, endStageMax: 7 }, weight: 3, text: [
    'An antique settee collapses beneath her; velvet tears with a sound like a sigh.',
  ] },
  { when: { locale: 'coastal_manor', endStageMin: 8 }, weight: 3, text: [
    'The dining table buckles when she leans — servants catch silverware mid-air and do not dare scold.',
  ] },
  { when: { locale: 'marble_hall', endStageMin: 6 }, weight: 2, text: [
    'A stone bench crumbles under her; dust blooms in the pillar light like incense.',
  ] },
  { when: { locale: 'grand_cathedral', endStageMin: 8 }, weight: 2, text: [
    'A carved pew snaps; hymnals slide across the nave in a papery whisper.',
  ] },
  { when: { locale: 'stone_hall', endStageMin: 6 }, weight: 2, text: [
    'The forge-side stool collapses; no one stops working, but everyone grins.',
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
  // ── Feast of the Glutton God locales ───────────────────────────
  { when: { locale: 'village_inn', endStageMin: 5, endStageMax: 7 }, weight: 3, text: [
    'The taproom bench cracks; ale sloshes as she settles heavier on boards that were never meant for this.',
  ] },
  { when: { locale: 'village_inn', endStageMin: 8 }, weight: 3, text: [
    'Hanging mugs rattle from their hooks; the bar rail bows as she takes up the whole common room aisle.',
  ] },
  { when: { locale: 'crowded_market', endStageMin: 5 }, weight: 2, text: [
    'A stall awning tears on her shoulder; apples scatter and the vendor curses, then laughs, then stares.',
  ] },
  { when: { locale: 'coastal_manor', endStageMin: 6, endStageMax: 8 }, weight: 3, text: [
    'A gilt chair splinters beneath her; servants freeze with trays still in hand, unsure where to stand now.',
  ] },
  { when: { locale: 'frontier_road', endStageMin: 9 }, weight: 3, text: [
    'Timber walls crack on both sides — she is wedged in the lane, and escape is a theory.',
  ] },
  { when: { locale: 'marble_hall', endStageMin: 7 }, weight: 2, text: [
    'Dust rains from the coffered ceiling; marble tiles spiderweb under her spreading weight.',
  ] },
  { when: { locale: 'sacred_grotto', endStageMin: 8 }, weight: 2, text: [
    'The ritual pool overflows as she swells; standing stones hum against her hips.',
  ] },
  { when: { locale: 'grand_cathedral', endStageMin: 9 }, weight: 2, text: [
    'Pews snap like kindling; stained glass rattles but holds — for now.',
  ] },
  { when: { locale: 'ducal_court', endStageMin: 8 }, weight: 2, text: [
    'Polished marble scars under her; courtiers press flat against tapestries to stay out of the swell.',
  ] },
  { when: { locale: 'stone_hall', endStageMin: 7 }, weight: 2, text: [
    'An ale bench collapses; miners cheer and slide another across the stone floor without comment.',
  ] },
  { when: { locale: 'open_field', endStageMin: 8 }, weight: 2, text: [
    'Wheat lies flat in a widening circle; fence posts lean outward where she kneels.',
  ] },
  { when: { endStageMin: 11 }, weight: 2, text: [
    'She cannot leave without negotiating with architecture that has already surrendered.',
    'Doorways are memories; the building\'s purpose is now to hold her.',
  ] },
  { when: { endStageMin: 13 }, weight: 2, text: [
    'The settlement rearranges around her stillness — roads detour, bells change their ring.',
  ] },
]);
