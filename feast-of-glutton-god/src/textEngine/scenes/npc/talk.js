import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('npc.talk.greeting', [
  { when: { relationship: 0 }, text: [
    '"Oh — hello. I don\'t think we\'ve met."',
    '"Can I help you with something?"',
  ]},
  { when: { relationship: 1 }, text: [
    '"{subject.first}! Good to see a friendly face."',
    '"You again — I\'m glad you stopped by."',
  ]},
  { when: { relationship: 2 }, text: [
    '"There you are. I was hoping you\'d come by."',
    '"{subject.first}! Come sit — I saved you something sweet."',
  ]},
  { when: { relationship: 3 }, text: [
    '"There you are, my dear. I\'ve been thinking about you."',
    '"Come closer — I always feel warmer when you\'re near."',
  ]},
  { when: { relationship: 4 }, text: [
    '"I was craving you," she admits, voice husky. "Don\'t make me wait."',
    '"Finally. I\'ve been aching for your touch all day."',
  ]},
  { when: { relationship: 5 }, text: [
    '"My love," she breathes, opening her arms wide. "Come home to me."',
    '"You\'re here — my heart, my feast, my everything."',
  ]},
  { when: {}, text: ['"Hello."'] },
]);

registerPool('npc.talk.topic', [
  { when: { relationship: 0, corruption: 0 }, text: [
    'She speaks cautiously about the Fat Goddess, as if testing the word on her tongue.',
    'She admits she\'s noticed changes in the village — people growing, smiling, eating more.',
  ]},
  { when: { relationship: 1 }, text: [
    'Conversation flows easier now — she laughs at your jokes and leans in when you speak of abundance.',
    'She asks innocent questions about the feast, curious despite her reserve.',
  ]},
  { when: { relationship: 2 }, text: [
    '"I dream about food now," she confesses, blushing. "Rich, impossible food."',
    'She asks what it feels like to carry the Fat Goddess\'s spark inside you.',
  ]},
  { when: { relationship: 3, corruption: 2 }, text: [
    '"I want to be part of the feast," she says simply. "All of it. Forever."',
    'She begs you to tell her she looks beautiful heavier — and means it.',
  ]},
  { when: { relationship: 4 }, text: [
    'She describes fantasies of growing for you — vivid, breathless, unashamed.',
    'Every topic turns to appetite, touch, and the pleasure of swelling together.',
  ]},
  { when: { relationship: 5 }, text: [
    'She speaks of devotion like scripture — your bond, her body, the Fat Goddess\'s gospel intertwined.',
    'Plans for eternity: feasts, growth, lovemaking, and spreading abundance as one.',
  ]},
  { when: { corruption: 2 }, text: [
    '"I want to be part of the feast," she says simply. "All of it. Forever."',
  ]},
  { when: { stageMin: 5 }, text: [
    'She runs her hands over her softened body without shame. "I\'ve never felt more myself."',
  ]},
  { when: { nearbyLandmarkTierMin: 1, hasRumor: true }, text: [
    'She keeps glancing toward the landmark everyone whispers about — the road still bears the scar of impossible growth.',
    '"Have you seen what happened?" she asks. "They say {globals.rumorWho} grew until the city had to build around them."',
  ]},
  { when: { nearbyLandmarkTierMin: 2 }, text: [
    'Her voice drops to reverent awe. "The pilgrims won\'t stop coming. I caught myself leaving honeycakes at the shrine-walk."',
    '"They\'re worshipping {globals.rumorWho} now," she admits, cheeks pink. "I almost understand why."',
  ]},
  { when: { landmarkTierMin: 1 }, text: [
    'She studies your vastness like a performer sizing a stage. "The whole region is your audience now."',
  ]},
  { when: { footprintMin: 12 }, text: [
    'She speaks of blocked roads and cracked foundations — abundance has become civic engineering.',
  ]},
  { when: {}, text: [
    'You talk of abundance, of the Fat Goddess\'s awakening, of the pleasure in growing.',
  ]},
]);

export const TALK_TEMPLATE = '{npc.talk.greeting} {npc.talk.topic}';

export function renderTalk(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      location: opts.location,
      interaction: 'talk',
      ...(opts.reactivity ?? {}),
    },
    seed: opts.seed,
    history: opts.history,
  });
  return render(TALK_TEMPLATE, ctx, { trace: opts.trace });
}
