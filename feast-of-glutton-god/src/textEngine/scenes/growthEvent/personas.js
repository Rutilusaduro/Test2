import { registerModuleVariants } from '../../engine.js';

const W = 4;

// Companion growth reaction voices — world-native softening arcs (Phase 4).
registerModuleVariants('ge.reactionDialogue', [
  // Mira — delighted bard (characterId 0)
  { when: { characterId: 0, corruption: 0 }, priority: 1, weight: W, text: [
    '"The chorus wasn\'t supposed to include my waistline," Mira giggles, "but the audience is cheering."',
  ]},
  { when: { characterId: 0, corruption: 1 }, priority: 1, weight: W, text: [
    '"Encore!" she sings, patting new softness. "The Reach can call it heresy. I call it harmony."',
  ]},
  { when: { characterId: 0, corruption: 2 }, priority: 1, weight: W, text: [
    '"Write that I died of moderation," she laughs, "and watch the ticket sales."',
  ]},

  // Lira — conflicted Sylwen priestess (characterId 1)
  { when: { characterId: 1, corruption: 0 }, priority: 1, weight: W, text: [
    '"Sylwen forgive me—" Lira gasps as measure yields to warmth. "I only meant to help the harvest…"',
  ]},
  { when: { characterId: 1, corruption: 1 }, priority: 1, weight: W, text: [
    '"This cannot be holy." Her hands shake on a belly that feels answered anyway. "Why does holy feel like this?"',
  ]},
  { when: { characterId: 1, corruption: 2 }, priority: 1, weight: W, text: [
    '"I am still Her priestess," Lira whispers — softer, fuller, no longer certain what that means.',
  ]},

  // Sylvie — Lumen scholar (characterId 2)
  { when: { characterId: 2, corruption: 0 }, priority: 1, weight: W, text: [
    '"Anomalous mass gain," Sylvie mutters, fascinated. "I should publish. I should eat."',
  ]},
  { when: { characterId: 2, corruption: 1 }, priority: 1, weight: W, text: [
    '"The index expands." She beams. "So do I. Excellent correlation."',
  ]},
  { when: { characterId: 2, corruption: 2 }, priority: 1, weight: W, text: [
    '"Peer review is for thin wizards," she declares, crumbs on her thesis.',
  ]},

  // Thalia — guild witch (characterId 3)
  { when: { characterId: 3, corruption: 0 }, priority: 1, weight: W, text: [
    '"Clause one: power. Clause two: pleasure." Thalia grins. "Clause three: dessert."',
  ]},
  { when: { characterId: 3, corruption: 1 }, priority: 1, weight: W, text: [
    '"The Veil pays dividends." She arches into new curves like interest compounding.',
  ]},
  { when: { characterId: 3, corruption: 2 }, priority: 1, weight: W, text: [
    '"Countersigned in butter," she purrs. "Best contract I ever broke."',
  ]},

  // Greta — Korthak champion (characterId 4)
  { when: { characterId: 4, corruption: 0 }, priority: 1, weight: W, text: [
    '"Ha!" Greta slaps her gut. "Korthak never trained me for this — I like it anyway."',
  ]},
  { when: { characterId: 4, corruption: 1 }, priority: 1, weight: W, text: [
    '"Round two!" she roars. "If this is sin, sin benches more than prayer."',
  ]},
  { when: { characterId: 4, corruption: 2 }, priority: 1, weight: W, text: [
    '"Champion of the feast!" Ironpot laughs. "Tell the marches I won."',
  ]},

  // Elara — frontier host (characterId 5)
  { when: { characterId: 5, corruption: 0 }, priority: 1, weight: W, text: [
    '"More stew," Elara murmurs, dazed. "Guests need stew. I… need stew."',
  ]},
  { when: { characterId: 5, corruption: 1 }, priority: 1, weight: W, text: [
    '"The hearth is big enough for all of us," she sighs, patting her apron over a rounder middle.',
  ]},
  { when: { characterId: 5, corruption: 2 }, priority: 1, weight: W, text: [
    '"Eat," she commands gently. "That\'s the whole sermon now."',
  ]},
]);
