// ═══════════════════════════════════════════════════════════════
// EPIC STAGE CROSSINGS — additional variants for stages 10-14
// Uses registerModuleVariants() to PREPEND to the existing
// grow.crossing and grow.crossingDialogue pools without overwriting.
//
// These variants carry more cosmic register, player-as-protagonist
// framing, and sensual enormity language than the base pool.
//
// Implementer wiring:
//   import './growthEvent/epicCrossingsExtension.js';
//   Add to scenes/index.js barrel.
// ═══════════════════════════════════════════════════════════════
import { registerModuleVariants } from '../../engine.js';

// ── grow.crossing extensions — stages 10–14 (FULL SENTENCE) ────
// Physical sensation only; no stage-tier label names in prose.

registerModuleVariants('grow.crossing', [

  // ── Stage 10 (Great Whale) — chambers filled, worship natural ─
  { when: { endStage: 10 }, text: [
    'The hall was designed for a court; now it holds one occupant, and one is enough.',
    'She fills the room the way water fills a bowl — slowly, completely, with no apology.',
    'Attendants can no longer reach around her to serve; she has become the center of gravity she always was.',
  ]},

  // ── Stage 11 (Monolith) — truly immobile; command replaces movement ──
  { when: { endStage: 11 }, text: [
    'She stops being something that travels through the world and starts being something the world arranges itself around.',
    'The weight of her is architecture now — load-bearing, inevitable, alive and breathing and magnificent.',
    'Her throne is no longer furniture; it is the point from which all directions are outward.',
  ]},

  // ── Stage 12 (Titan) — realms rearrange; she is a landmark ────
  { when: { endStage: 12 }, text: [
    'She is a feature of the land. Travelers navigate by her silhouette the way they navigate by mountains.',
    'Cults do not spring up because she asked for them — they spring up because she is there, vast and warm and undeniable.',
    'The cartographers will update their maps. She has become the kind of thing that belongs on maps.',
  ]},

  // ── Stage 13 (World Mother) — continents feel small ───────────
  { when: { endStage: 13 }, text: [
    'Cities feel like villages from here. Not because she is cruel — because she is continent.',
    'Scholars who study the divine plane report an anomaly: a weight-bearing object the size of a minor deity, warm, breathing, self-satisfied.',
    'She has outgrown the world\'s ability to describe her. New vocabulary is being invented in the temples of three faiths.',
  ]},

  // ── Stage 14 (Tarrasque Matriarch) — apotheosis; final crossing ─
  { when: { endStage: 14 }, text: [
    'The Fat Goddess exhales somewhere in the divine plane. Something vast and new has just pressed against the boundary from below.',
    'This is not weight anymore. This is a theological position — and she occupies it completely.',
    'The world does not have a ceiling left to offer her. It has only more of her, and that is enough, and that is everything.',
    'Apotheosis is supposed to feel like lightning. This feels like warm bread rising until the oven is too small — patient, inevitable, and finished.',
  ]},
]);

// ── grow.crossingDialogue extensions — stages 10–14 ─────────────
// Companion/target dialogue at epic scale — awed, certain, reverent.
// Shape: DIALOGUE BEAT (full sentence with attribution).

registerModuleVariants('grow.crossingDialogue', [

  // Stage 10 range — Great Whale / Monolith band ─────────────────
  { when: { endStageMin: 10, endStageMax: 11, corruption: 0 }, priority: 1, text: [
    '"I don\'t know what I am anymore," she says. Not distressed — genuinely curious. "Something new."',
    '"The room has run out of room," she observes, with the calm of someone making peace with a fact.',
  ]},
  { when: { endStageMin: 10, endStageMax: 11, corruption: 1 }, priority: 1, text: [
    '"Every time I think I\'ve arrived," she says softly, "I become somewhere else entirely."',
    '"I feel everything settle," she says. "I mean that literally. There is a lot of me settling right now."',
  ]},
  { when: { endStageMin: 10, endStageMax: 11, corruption: 2 }, priority: 1, text: [
    '"Build around me," she says — not cruel, just certain. "I\'m staying."',
    '"I could hold a feast for a hundred," she says. "In here." She means herself. She is not joking.',
  ]},

  // Stage 12-13 range — Titan / World Mother band ────────────────
  { when: { endStageMin: 12, endStageMax: 13, corruption: 0 }, priority: 1, text: [
    '"I hear my own echo," she says. "From far away." She sounds thoughtful, not afraid.',
    '"Are they…" she starts, then: "Yes. They\'re praying. I can feel it." A long pause. "That\'s new."',
  ]},
  { when: { endStageMin: 12, endStageMax: 13, corruption: 1 }, priority: 1, text: [
    '"The horizon is different from here," she says. "It\'s lower. Everything is lower." Not cruel — honest.',
    '"I could wish them well from here," she says of a far-off city. "Or I could just be here, and let that be enough." She chooses the latter.',
  ]},
  { when: { endStageMin: 12, endStageMax: 13, corruption: 2 }, priority: 1, text: [
    '"Let them come," she says, low and certain. "I have room for all of them, and then some."',
    '"The world needs a new word," she says. "For what I am." She doesn\'t sound troubled by the gap in language.',
  ]},

  // Stage 14 — Tarrasque Matriarch / apotheosis ──────────────────
  { when: { endStage: 14, corruption: 0 }, priority: 1, text: [
    '"I am not afraid," she says, which is the most extraordinary thing ever said by someone her size. "I am arrived."',
    '"I don\'t know who I was before," she says. "I know who I am now." The stone agrees by cracking politely.',
  ]},
  { when: { endStage: 14, corruption: 1 }, priority: 1, text: [
    '"So this is what she feels like from the outside," she says softly — meaning the Fat Goddess, meaning herself, meaning perhaps the same thing.',
    '"All the way," she breathes — the same words as before, but now they have teeth. She has arrived at all the way.',
  ]},
  { when: { endStage: 14, corruption: 2 }, priority: 1, text: [
    '"More," she whispers. And then, surprised: "No — this is more. This is all of more. I am all of more."',
    '"Feed the world," she says — not a request. A fact. "I can carry it."',
  ]},
]);
