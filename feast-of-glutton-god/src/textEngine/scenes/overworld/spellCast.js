import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('overworld.spell.opening', [
  { when: { spellSchool: 'abundance' }, text: [
    'Golden caloric light pours from your hands toward {subject.name} — warm, sacred, irresistible.',
    'You channel Gorgara\'s overflow; the air itself grows thick with the scent of feasts unending.',
  ]},
  { when: { spellSchool: 'enchantment' }, text: [
    'Your magic coils around {subject.first} like honeyed words made visible — desire blooming in her eyes.',
    'Enchantment unfurls: she feels wanted, fed, destined to grow.',
  ]},
  { when: { spellSchool: 'transmutation' }, text: [
    'Runes of abundance rewrite {subject.name}\'s flesh — each curve a deliberate, delicious transmutation.',
    'Reality softens at the edges; her body accepts the change as holy.',
  ]},
  { when: { overflow: true }, text: [
    'You push past safe limits — overflow magic surges, reckless and glorious.',
    'Excess becomes sacrament; the spell hits like a tidal wave of cream and light.',
  ]},
  { when: {}, text: [
    'You weave spellcraft into the space between you — abundance answering your call.',
  ]},
]);

registerPool('overworld.spell.reaction', [
  { when: { relationship: [0, 1] }, text: [
    '{subject.first} gasps as magic takes hold — surprised, blushing, unable to resist the pleasure.',
    'She trembles under the unfamiliar swell of your power, already craving more.',
  ]},
  { when: { relationship: [2, 3] }, text: [
    '{subject.name} moans your name, trusting the swell — every inch feels like a gift from you.',
    'She leans into the magic, body yielding with familiar, hungry delight.',
  ]},
  { when: { relationship: [4, 5] }, text: [
    'Devotion meets divinity — {subject.first} welcomes your spell like a lover\'s touch, swelling openly.',
    'She cries out in ecstasy, growing for you without shame, radiant and ruined in the best way.',
  ]},
  { when: {}, text: [
    '{subject.first} shudders as abundance reshapes her — beautiful, willing, transformed.',
  ]},
]);

registerPool('overworld.spell.afterglow', [
  { when: { relationshipMin: 4 }, text: [
    'She pulls you close, plush and glowing. "Again," she breathes. "Make me more."',
  ]},
  { when: { relationshipMin: 2 }, text: [
    'She pats her new softness with wonder, smiling at you like you hung the stars.',
  ]},
  { when: {}, text: [
    'The magic settles like warm cream; {subject.first} is softer, fuller, blessed.',
  ]},
]);

export function renderOverworldSpellCast(npc, player, opts = {}) {
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      interaction: 'overworld_spell',
      spellSchool: opts.spell?.school,
      spellName: opts.spell?.name,
      overflow: opts.overflow,
    },
    seed: opts.seed,
    history: opts.history,
  });
  return render(
    '{overworld.spell.opening} {overworld.spell.reaction} {overworld.spell.afterglow}',
    ctx,
    { trace: opts.trace },
  );
}
