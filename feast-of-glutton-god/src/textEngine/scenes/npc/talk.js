import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../dimensions/weightGain.js';

registerPool('npc.talk.greeting', [
  { when: { hasMet: true, relationship: 0 }, text: [
    '"Oh — {ref.first}, it\'s you again." She remembers you, even if the bond is still thin.',
    '"Back so soon, {ref.first}?" She eyes you with wary recognition — not strangers, not friends yet.',
    '"I remember you," she says quietly. "What do you want this time, {ref.first}?"',
  ]},
  { when: { hasMet: false, relationship: 0 }, text: [
    '"Oh — hello. I don\'t think we\'ve met."',
    '"Can I help you with something?"',
  ]},
  { when: { role: 'rival', hasMet: true }, text: [
    '"{ref.first}." Her jaw tightens. "Come to gloat?"',
    '"Still at it, {ref.first}?" She won\'t quite meet your eyes.',
    '"You again," she says. "What do you want?"',
  ]},
  { when: { relationship: 1 }, text: [
    '"{ref.first}! Good to see a friendly face."',
    '"You again — I\'m glad you stopped by, {ref.first}."',
  ]},
  { when: { relationship: 2 }, text: [
    '"There you are, {ref.first}. I was hoping you\'d come by."',
    '"{ref.first}! Come sit — I saved you something sweet."',
  ]},
  { when: { relationship: 3 }, text: [
    '"There you are, my dear. I\'ve been thinking about you, {ref.first}."',
    '"Come closer, {ref.first} — I always feel warmer when you\'re near."',
  ]},
  { when: { relationship: 4 }, text: [
    '"I was craving you," she admits, voice husky. "Don\'t make me wait, {ref.first}."',
    '"Finally, {ref.first}. I\'ve been aching for your touch all day."',
  ]},
  { when: { relationship: 5 }, text: [
    '"My love," she breathes, opening her arms wide. "Come home to me, {ref.first}."',
    '"You\'re here — my heart, my feast, my everything, {ref.first}."',
  ]},
  { when: {}, text: ['"Hello, {ref.first}."'] },
]);

registerPool('npc.talk.topic', [
  { when: { relationship: 0, corruption: 0 }, text: [
    'She speaks cautiously of the Fat Goddess — as if the name might summon Church warrants.',
    'She admits the Reach feels different lately — fuller tables, wider smiles, worried clergy.',
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
    'You talk of fullness, of the patron you feed, of the pleasure in growing past the Wheel\'s measure.',
  ]},
]);

export const TALK_TEMPLATE = '{npc.talk.greeting} {npc.talk.companion} {npc.companion.softeningTier} {npc.talk.antagonist} {npc.talk.topic}';

export function renderTalk(npc, player, opts = {}) {
  const wf = opts.game?.worldFlags ?? {};
  const act = wf.main_act3_complete || wf.act3_gates_unlocked ? 3
    : wf.main_act2_complete || wf.act2_gates_unlocked ? 2 : 1;
  const ref = player ?? opts.game?.player ?? null;
  const ctx = createContext({
    subject: npc,
    ref,
    globals: {
      location: opts.location,
      interaction: 'talk',
      role: npc.role,
      level: ref?.level ?? 1,
      escalationTier: wf.escalationTier ?? 0,
      act,
      hasMet: Boolean(opts.hasMet ?? npc.met),
      consentState: opts.consentState,
      gainDesire: opts.gainDesire ?? npc.gainDesire,
      ...(opts.reactivity ?? {}),
    },
    seed: opts.seed,
    history: opts.history,
  });
  return render(TALK_TEMPLATE, ctx, { trace: opts.trace });
}
