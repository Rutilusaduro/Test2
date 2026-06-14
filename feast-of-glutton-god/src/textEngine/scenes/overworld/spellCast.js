import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('overworld.spell.opening', [
  { when: { spellSchool: 'abundance' }, text: [
    'Golden caloric light pours from your palms onto {subject.name} — warm, thick, obscene with promise.',
    'You channel Gorgara\'s overflow; the air grows heavy with the scent of cream, sugar, and inevitable swelling.',
    'Sacred calories spiral around {subject.first}, seeking every curve to lavish and enlarge.',
  ]},
  { when: { spellSchool: 'enchantment' }, text: [
    'Your magic coils around {subject.first} like a lover\'s whisper made visible — desire pooling in her belly before the spell even lands.',
    'Enchantment unfurls across her skin: she feels wanted, fed, *destined* to grow fat and radiant for you.',
  ]},
  { when: { spellSchool: 'transmutation' }, text: [
    'Runes of abundance rewrite {subject.name}\'s flesh — hips widening, belly rounding, breasts heavy with deliberate pleasure.',
    'Reality yields; her body accepts transmutation as the most delicious kind of worship.',
  ]},
  { when: { overflow: true }, text: [
    'You push past safe limits — overflow magic crashes into {subject.first} like a tidal wave of cream and light.',
    'Excess becomes sacrament; she gasps as power floods places that were only dreaming of softness.',
  ]},
  { when: {}, text: [
    'Spellcraft slides between you like a hungry tongue — abundance answering your call without shame.',
  ]},
]);

registerPool('overworld.spell.growth', [
  { when: { stagesJumpedMin: 2 }, text: [
    'Her body *surges* — a glorious, helpless expansion. Belly blooming, thighs thickening, breasts straining as pounds arrive in ecstatic waves.',
    '{subject.first} moans through the leap of flesh, riding each new inch like climax after climax.',
  ]},
  { when: { stagesJumpedMin: 1, relationship: [0, 1] }, text: [
    'Softness spreads through {subject.name} — waist rounding, ass swelling, a shy gasp as her clothes grow taut and obscene.',
    'She clutches her new belly in wonder; the spell leaves her warmer, heavier, hungry for more.',
  ]},
  { when: { stagesJumpedMin: 1, relationship: [2, 3] }, text: [
    'Growth blooms across {subject.first} with wet, audible pleasure — belly pushing outward, hips flaring, skin glowing.',
    'She arches into the swell, trusting every pound you gift her. "Yes," she whispers. "More."',
  ]},
  { when: { stagesJumpedMin: 1, relationship: [4, 5] }, text: [
    'She *welcomes* the swell — belly surging against you, thighs rubbing thicker, moans raw and devotional as she fattens for you.',
    'Growth and desire merge: {subject.name} grows openly, shamelessly, crying out as curves arrive like kisses.',
  ]},
  { when: {}, text: [
    'Pleasurable weight settles into {subject.first} — beautiful, willing, already craving the next spell.',
  ]},
]);

registerPool('overworld.spell.reaction', [
  { when: { relationship: [0, 1] }, text: [
    '{subject.first} gasps as magic takes hold — surprised, blushing, thighs pressing together as heat pools low.',
    'She trembles under your power, already slick with want, already imagining how good bigger would feel.',
  ]},
  { when: { relationship: [2, 3] }, text: [
    '{subject.name} moans your name, hands flying to her swelling belly — every inch feels like your touch made permanent.',
    'She leans into the magic, body yielding with hungry delight. "Don\'t stop," she breathes.',
  ]},
  { when: { relationship: [4, 5] }, text: [
    'Devotion meets divinity — {subject.first} welcomes your spell like worship, spreading her thighs as she fattens for you.',
    'She cries out in ecstasy, growing without shame, pulling you closer to feel every jiggle of new flesh.',
  ]},
  { when: {}, text: [
    '{subject.first} shudders as abundance reshapes her — beautiful, willing, transformed and grateful.',
  ]},
]);

registerPool('overworld.spell.afterglow', [
  { when: { relationshipMin: 4, stagesJumpedMin: 1 }, text: [
    'She pulls you into her new softness, plush and glowing. "Again," she pants, grinding slow. "Make me enormous."',
    'Fingers sink into fresh curves; she kisses you sloppy and grateful, already begging for the next swell.',
  ]},
  { when: { relationshipMin: 2, stagesJumpedMin: 1 }, text: [
    'She pats her rounded belly with wonder, smiling at you like you hung the stars. "I feel… incredible."',
    'New weight settles warm between you. She doesn\'t hide it — she *shows* you, proud and pink.',
  ]},
  { when: { relationshipMin: 4 }, text: [
    '"Cast on me whenever you want," she murmurs, voice thick with lust. "I love growing for you."',
  ]},
  { when: {}, text: [
    'The magic settles like warm cream on her skin; {subject.first} is softer, fuller, blessed — and already hungry.',
  ]},
]);

export function renderOverworldSpellCast(npc, player, opts = {}) {
  const growth = opts.growth;
  const ctx = createContext({
    subject: npc,
    ref: player,
    globals: {
      interaction: 'overworld_spell',
      spellSchool: opts.spell?.school,
      spellName: opts.spell?.name,
      overflow: opts.overflow,
      stagesJumped: growth?.stagesJumped ?? 0,
      stagesJumpedMin: growth?.stagesJumped ?? 0,
      endStage: growth?.endStage,
      startStage: growth?.startStage,
    },
    seed: opts.seed,
    history: opts.history,
  });
  const template = growth?.stagesJumped > 0
    ? '{overworld.spell.opening} {overworld.spell.growth} {overworld.spell.reaction} {overworld.spell.afterglow}'
    : '{overworld.spell.opening} {overworld.spell.reaction} {overworld.spell.afterglow}';
  return render(template, ctx, { trace: opts.trace });
}
