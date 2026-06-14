import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';

registerPool('npc.quest.offer', [
  { when: { questType: 'main', relationship: [0, 1] }, text: [
    '"There is something you must do," {subject.first} says, voice low with urgency and warmth. "Will you help me spread the feast?"',
    '{subject.name} leans close. "the Fat Goddess\'s gospel needs a champion. I have a task — sacred, sensual, necessary."',
  ]},
  { when: { questType: 'main', relationship: [2, 3, 4, 5] }, text: [
    '"My dear," {subject.first} breathes, "I\'ve been saving this for you." Her eyes shine. "A quest worthy of our bond — and bodies that will grow glorious together."',
    '"You feel it too, don\'t you?" {subject.name} cups your cheek. "The world is ready to swell. Let me guide you."',
  ]},
  { when: { questType: 'side', relationship: [0, 1, 2] }, text: [
    '{subject.first} blushes, then steels herself. "I… need your help. Something personal. Something hungry."',
    '"Would you walk with me?" {subject.name} asks softly. "There\'s a story here — and I want you in it."',
  ]},
  { when: { questType: 'side', relationship: [3, 4, 5] }, text: [
    '"For you, anything," {subject.first} purrs. "I have a secret wish — indulge me? Let us grow closer in every sense."',
    '{subject.name} traces your wrist. "Stay with me for this. Pleasure and purpose, woven together."',
  ]},
  { when: {}, text: [
    '{subject.first} shares a task that promises abundance, intimacy, and delicious growth.',
  ]},
]);

registerPool('npc.quest.offer.title', [
  { when: {}, text: [(ctx) => `📜 ${ctx.globals?.questTitle || 'A New Quest'}`] },
]);

export function renderQuestOffer(npc, player, opts = {}) {
  const def = opts.questDef;
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      questType: def?.type === 'main' ? 'main' : 'side',
      questTitle: def?.title,
      questId: def?.id,
    },
    seed: opts.seed,
    history: opts.history,
  });
  return render('{npc.quest.offer} {npc.quest.offer.title}', ctx, { trace: opts.trace });
}
