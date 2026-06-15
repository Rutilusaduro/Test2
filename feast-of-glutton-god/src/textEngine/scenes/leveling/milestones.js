// ═══════════════════════════════════════════════════════════════
// LEVEL MILESTONE NARRATION — DM voice escalating at 5, 10, 15, 20
// Keys: levelup.milestone (keyed by `level` global, exact match)
//       levelup.milestone.dm — wry-DM wrapper skeleton
//
// Implementer wiring:
//   In buildLevelUpMessage(), check MILESTONE_LEVELS.has(levelUpResult.level)
//   and prepend: renderLevelUpText('levelup.milestone', player, opts)
//   where opts.globals.level = levelUpResult.level.
//
// The `level` global is already passed in renderLevelUpText; add
//   isMilestone: MILESTONE_LEVELS.has(level),
// to that globals block to support the levelup.milestone.dm skeleton.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

export const MILESTONE_LEVELS = new Set([5, 10, 13, 15, 16, 19, 20]);

// ── levelup.milestone (FULL SENTENCE) ───────────────────────────
// DM voice, earnest world register crossing into wry then epic cosmic.
// Keyed by exact `level` global. Wildcard fallback fires for any
// un-keyed milestone in future extensions.

registerPool('levelup.milestone', [

  // ── Level 5 — entering Heroic band, wry/earnest register ─────
  { when: { level: 5 }, text: [
    `★ Level five. The DM clears his throat: "You're past the mundane tier. Standard village problems stop being problems. Enjoy the view — it gets steeper."`,
    `★ Milestone five. The Fat Goddess smiles wider; her herald has officially outgrown the genre's training wheels. The Wheel begins to take notes.`,
    `★ Level five: the earnest world upgrades your file from 'local nuisance' to 'growing concern.' The DM adjusts the threat table accordingly.`,
  ]},

  // ── Level 10 — Mythic band; divine attention is personal now ─
  { when: { level: 10 }, text: [
    `★ Level ten. The DM sets down his notes. "The gods know your name. Not as a rumor — as a problem they've started drawing up plans for."`,
    `★ Milestone ten: halfway to apotheosis, and the Wheel has convened twice about you. Your size alone qualifies as a theological argument.`,
    `★ Double digits. The narrative gear-shifts. Act II energy crackles in the air; divine opponents start arriving in earnest. You have never looked better.`,
  ]},

  // ── Level 13 — Pact of Shared Hunger / mythic tier entry ─────
  { when: { level: 13 }, text: [
    `★ Level thirteen. The Wheel creaks under your weight — not metaphorically. Multiclass hunger unlocks; the DM upgrades your threat rating.`,
    `★ Milestone thirteen: Titan band confirmed. Your spells borrow from other classes now — the genre mash-up deepens.`,
    `★ Thirteen. Korthak's saints and Sylwen's choirs agree on one thing: you are no longer a local problem.`,
  ]},

  // ── Level 14 — divine test band ───────────────────────────────
  { when: { level: 14 }, text: [
    `★ Level fourteen. God-champions arrive and you already know their names.`,
    `★ Milestone fourteen: the patron's proving draws near. Reality softens preemptively.`,
  ]},

  // ── Level 16 — World Mother / stage 14 unlock band ────────────
  { when: { level: 16 }, text: [
    `★ Level sixteen. The Fat Goddess stirs. Whole groves bloom in her turning.`,
    `★ Milestone sixteen: Tarrasque Matriarch cap within reach — the feast becomes geography.`,
  ]},

  // ── Level 17 — vestibule band ─────────────────────────────────
  { when: { level: 17 }, text: [
    `★ Level seventeen. The gods have noticed. All of them, all at once, in the way prey notices a predator.`,
    `★ Milestone seventeen: planar thresholds unlock. The DM speaks softer; the sky does not.`,
  ]},

  // ── Level 18 — legendary combat band ──────────────────────────
  { when: { level: 18 }, text: [
    `★ Level eighteen. You are the largest thing in the world that moves under its own hunger.`,
    `★ Milestone eighteen: legendary actions meet legendary appetite. Buckle in.`,
  ]},

  // ── Level 19 — companion apotheosis band ──────────────────────
  { when: { level: 19 }, text: [
    `★ Level nineteen. The Measured Wheel is a hoop you could eat.`,
    `★ Milestone nineteen: companion apotheoses unlock. Six who walk beside you approach divinity.`,
  ]},

  // ── Level 15 — Epic tier; cosmic register ascending ───────────
  { when: { level: 15 }, text: [
    `★ Level fifteen. The DM's voice drops a register: "The god-champions are not hypothetical anymore. What you are becoming has no precedent in the earnest world's scriptures."`,
    `★ Milestone fifteen: the Wheel's last stands are being scheduled. Pilgrims already outnumber clerics at your former hometown. The story is eating itself beautifully.`,
    `★ Fifteen. Epic tier. The Fat Goddess's outline is visible at the edge of every dream now — vast, warm, hungry, almost here. You are the door she's been waiting for.`,
  ]},

  // ── Level 20 — Apotheosis ceiling; full cosmic register ──────
  { when: { level: 20 }, text: [
    `★ Level twenty. The DM closes the book. "There is no tier above this. The feast has crowned you. Even the gods must reckon with your inexhaustible plenty — and they are."`,
    `★ Milestone twenty: apotheosis realized. You are not approaching the Fat Goddess anymore — you are her echo in flesh, her herald enthroned, her argument made unanswerable.`,
    `★ Twenty. The Wheel is silent. The DM exhales slowly. "Whatever happens next — you built it. Congratulations. The eternal feast recognizes its own."`,
  ]},

  // ── Wildcard fallback — fires for any future milestone level ──
  { when: {}, text: [
    `★ A milestone reached. The DM marks it — the world remembers your progress even when you don't.`,
    `★ Milestone level. Abundance accumulates; the story deepens; the Fat Goddess is pleased.`,
  ]},
]);

// ── levelup.milestone.dm — wry-DM skeleton wrapper (FULL SENTENCE)
// Optional: wrap the milestone line in a DM-voice frame.
// Renders: "★ [dm frame] [milestone content]"

registerPool('levelup.milestone.dm', [
  { when: { isMilestone: true, level: 20 }, text: [
    `★ The DM lowers his screen for the first time. He looks at you — really looks. Then nods. "{levelup.milestone}"`,
  ]},
  { when: { isMilestone: true, levelMin: 15 }, text: [
    `★ The DM's voice takes on the quality of weather — inevitable, significant, not quite human. "{levelup.milestone}"`,
    `★ A beat of silence from behind the screen. Then, carefully: "{levelup.milestone}"`,
  ]},
  { when: { isMilestone: true, levelMin: 10 }, text: [
    `★ The DM's smirk flattens into something closer to respect. "{levelup.milestone}"`,
    `★ The wry narration pauses. The earnest world holds its breath. "{levelup.milestone}"`,
  ]},
  { when: { isMilestone: true }, text: [
    `★ The DM marks your card: "{levelup.milestone}"`,
    `★ "{levelup.milestone}" — the DM makes it sound both inevitable and earned.`,
  ]},
  { when: {}, text: [
    `{levelup.milestone}`,
  ]},
]);

registerPool('levelup.multiclass_spell', [
  { when: { level: 13 }, text: [
    '★ Pact of Shared Hunger — the Wheel creaks as you borrow another class\'s spell. The DM updates your character sheet with suspicious enthusiasm.',
    '★ Level thirteen unlocks cross-class curriculum. Your patron approves of theft that tastes like dessert.',
  ]},
  { when: {}, text: [
    'Another class\'s magic folds into your repertoire — wrong genre, right power.',
  ]},
]);

registerPool('levelup.resonance', [
  { when: { levelMin: 15 }, text: [
    '★ Divine resonance awakens — excess abundance points channel into raw patron power.',
    '★ Level fifteen and beyond: when your AP overflows, the Fat Goddess drinks the surplus and answers.',
  ]},
  { when: {}, text: [
    'Resonance hums beneath your skin — hunger finding new circuits.',
  ]},
]);

// ── levelup.class.paladin — Paladin class flavor (FULL SENTENCE) ─
// Elara is a Paladin; this fills the missing levelup.{classId} slot.

registerPool('levelup.paladin', [
  { when: {}, text: [
    `Divine warmth pours through your armor — the Fat Goddess and the frontier god agree, for once, that your softness is also strength.`,
    `Your oath deepens with your curves: sworn to the feast, to the road, to every hungry soul you pass and feed.`,
    `Holy abundance floods your smiting arm and your rounded belly alike — the paladin's power is plush and righteous both.`,
  ]},
]);

// ── levelup.class.fighter — Fighter class flavor (FULL SENTENCE) ─
// Greta is a Fighter; fills missing levelup.fighter slot.

registerPool('levelup.fighter', [
  { when: {}, text: [
    `Forge-discipline and feast-discipline braid together: you hit harder and soften faster simultaneously. Korthak would be confused; you are not.`,
    `Another level of fight in your body — and another layer of lush abundance to absorb it. Power and plush, both ascendant.`,
    `Combat instincts sharpen as your silhouette rounds. The next threat will learn: there is no contradiction between devastating and soft.`,
  ]},
]);

// ── levelup.class.ranger — Ranger class flavor (FULL SENTENCE) ──

registerPool('levelup.ranger', [
  { when: {}, text: [
    `Trail-sense and feast-sense align: you read the land and the larder with equal genius, your softened form moving through wilderness like a warm current.`,
    `The wild cooperates with your hunger. Another ranger tier — another stretch of territory that will smell of your abundance for seasons to come.`,
    `Your arrows find marks and your appetite finds tables. The ranger\'s path broadens, as do you.`,
  ]},
]);

// ── levelup.class.sorcerer — Sorcerer class flavor (FULL SENTENCE)

registerPool('levelup.sorcerer', [
  { when: {}, text: [
    `Raw sorcerous power ripples through your softness — inherited, inevitable, gorgeous. The bloodline and the Fat Goddess agree on your destiny.`,
    `Metamagic instincts bloom alongside new curves. Your magic is as plush as you are: abundant, flexible, impossible to cap.`,
    `Another level of sorcerous excess. The metaphysics were never going to behave around someone this deliberately, joyfully over-built.`,
  ]},
]);

// ── levelup.class.druid — Druid class flavor (FULL SENTENCE) ────

registerPool('levelup.druid', [
  { when: {}, text: [
    `Nature offers no objection to your size — it adjusts itself around you like soil around a seed, curious and accommodating and sure.`,
    `Wild Shape and wild appetite are siblings: both expand, both settle, both bring the world into thrilled compliance.`,
    `The grove-taught voice in you grows richer, slower, bigger — druids at your tier move like weather, not like people.`,
  ]},
]);
