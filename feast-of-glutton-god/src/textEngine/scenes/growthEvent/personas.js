import { registerModuleVariants } from '../../engine.js';

const W = 4;

// Companion growth reaction voices — keyed on numericId (see companions.js).
registerModuleVariants('ge.reactionDialogue', [
  { when: { characterId: 0, corruption: 0 }, priority: 1, weight: W, text: [
    '"Look what you\'re doing to me…" Mira giggles breathlessly. "I\'m getting so soft already."',
  ]},
  { when: { characterId: 0, corruption: 1 }, priority: 1, weight: W, text: [
    '"Every note I play now carries the weight of my new body," she sings, patting her belly.',
  ]},
  { when: { characterId: 0, corruption: 2 }, priority: 1, weight: W, text: [
    '"Play it again — I want the whole hall to grow with me."',
  ]},

  { when: { characterId: 1, corruption: 0 }, priority: 1, weight: W, text: [
    '"Oh goddess… it\'s so warm… so right," Lira moans reverently.',
  ]},
  { when: { characterId: 1, corruption: 1 }, priority: 1, weight: W, text: [
    '"I feel… blessed." She places both hands on her new belly and shudders in pleasure.',
  ]},
  { when: { characterId: 1, corruption: 2 }, priority: 1, weight: W, text: [
    '"Make me your shrine. I want to be soft enough for everyone to worship."',
  ]},

  { when: { characterId: 2, corruption: 0 }, priority: 1, weight: W, text: [
    '"F-for the record, this was entirely scientific—" Sylvie squeaks as her curves balloon outward.',
  ]},
  { when: { characterId: 2, corruption: 1 }, priority: 1, weight: W, text: [
    '"The caloric density is… exceptional. I need more data."',
  ]},
  { when: { characterId: 2, corruption: 2 }, priority: 1, weight: W, text: [
    '"I\'ve cracked the formula. More input equals more perfection."',
  ]},

  { when: { characterId: 3, corruption: 0 }, priority: 1, weight: W, text: [
    '"Yes… more!" Thalia growls, voice thick with pleasure.',
  ]},
  { when: { characterId: 3, corruption: 1 }, priority: 1, weight: W, text: [
    '"Look at me. I\'m becoming a goddess in my own right."',
  ]},
  { when: { characterId: 3, corruption: 2 }, priority: 1, weight: W, text: [
    '"The pact demands tribute. Keep feeding your queen."',
  ]},

  { when: { characterId: 4, corruption: 0 }, priority: 1, weight: W, text: [
    '"That all you got?!" Greta bellows, patting her new gut proudly.',
  ]},
  { when: { characterId: 4, corruption: 1 }, priority: 1, weight: W, text: [
    '"I\'m just gettin\' started! Come on, keep feeding me!"',
  ]},
  { when: { characterId: 4, corruption: 2 }, priority: 1, weight: W, text: [
    '"Champion of the feast — and still climbing!"',
  ]},

  { when: { characterId: 5, corruption: 0 }, priority: 1, weight: W, text: [
    '"I\'m so big… I love it," Elara whimpers happily.',
  ]},
  { when: { characterId: 5, corruption: 1 }, priority: 1, weight: W, text: [
    '"Don\'t stop… make me even softer for you."',
  ]},
  { when: { characterId: 5, corruption: 2 }, priority: 1, weight: W, text: [
    '"The whole world should eat like this. Let me show them."',
  ]},
]);
