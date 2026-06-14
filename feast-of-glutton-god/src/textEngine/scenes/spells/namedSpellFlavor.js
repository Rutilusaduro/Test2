// ═══════════════════════════════════════════════════════════════
// NAMED SPELL FLAVOR — high-level spell cast prose (L5 / L7 / L9)
// Registers five spell.cast.{id} pools (FULL SENTENCE shape) used
// by renderNamedSpellCast(), plus participle-clause extensions to
// dm.cast.invoke.school via registerModuleVariants for combat.
//
// Implementer wiring:
//   import './spells/namedSpellFlavor.js';   ← add to scenes/index.js
//   Call renderNamedSpellCast(spellId, caster, targets, opts) for
//   overworld / cutscene spell moments.
// ═══════════════════════════════════════════════════════════════
import { registerPool, registerModuleVariants, createContext, render } from '../../engine.js';
import '../../modules.js';

// ── dm.cast.invoke.school extensions (PARTICIPLE CLAUSE) ────────
// Prepended at higher specificity than generic school lines.
// Fire when spellName matches — weight 4 keeps them dominant.

registerModuleVariants('dm.cast.invoke.school', [
  { when: { spellName: 'Abundance Crescendo' }, weight: 4, text: [
    'your voice curling golden and unstoppable, melody bending reality toward flesh',
    'the crescendo gathering like a tide of honey in the air before it breaks',
    'sacred song crystallising into caloric force at the apex of the verse',
  ]},
  { when: { spellName: 'Grand Crescendo' }, weight: 4, text: [
    'divine anthem tearing through the air like sound made holy and obscene',
    'the overflow melody detonating at pitch, pulling flesh toward its own potential',
  ]},
  { when: { spellName: 'Grand Transmutation' }, weight: 4, text: [
    'the grand formula rewriting matter at your command, curves blooming on the spoken word',
    'alchemical authority in each syllable, flesh rearranging itself toward abundance',
    'transmutation at the scale where reality stops arguing and simply complies',
  ]},
  { when: { spellName: 'True Overflow' }, weight: 4, text: [
    'permanent divine excess pooling in your palms like a kept promise',
    'the overflow not seeking a return — settling, irrevocable, holy',
    'seven-layer caloric authority inscribed into flesh from the inside out',
  ]},
  { when: { spellName: 'Mass Indulgence' }, weight: 4, text: [
    'the ritual radius expanding outward, a whole district\'s worth of hunger made real',
    'mass sacrament unfurling in a circle — no target spared the Fat Goddess\'s reach',
    'eighth-level abundance saturating the air until every body in range answers',
  ]},
  { when: { spellName: 'Awakening of the Fat Goddess' }, weight: 4, text: [
    'the patron\'s roar in your chest, her hunger finding a door in you and opening wide',
    'apotheotic overflow — the patron not speaking through you but rushing through you',
    'ninth-level divine eruption: the Wheel\'s teeth chip on this one',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.abundance_crescendo — Bard L5 (FULL SENTENCE)
// Party-wide growth song; mass effect, overflowable.
// ─────────────────────────────────────────────────────────────────

registerPool('spell.cast.abundance_crescendo', [
  { when: { overflow: true }, weight: 2, text: [
    `★ Grand Crescendo detonates at divine pitch. Enemies reel; allies erupt through two stages of ecstatic growth — the world rings with fat and joy.`,
    `★ The overflow melody breaks the scale. Allies surge through two full stages, crying out as flesh arrives in ecstatic waves. The DM is impressed.`,
  ]},
  { when: { stagesJumpedMin: 1, relationship: [2, 3, 4, 5] }, weight: 2, text: [
    `The note crests and they open to it. Your allies cross a full stage together, moaning in unison — the song riding their ecstasy like a wave finding shore.`,
    `At the apex their bodies answer before their minds can — full stage of gorgeous growth blooming across the party in one shuddering, grateful breath.`,
  ]},
  { when: { stagesJumpedMin: 1 }, text: [
    `The crescendo peaks. Each ally gasps as their body surges past a threshold — full stage of growth, given freely by your voice, received with joy.`,
    `One glorious note and the party crosses a line. New softness settles on them all; the song made flesh, permanent and warm.`,
  ]},
  { when: { stageMin: 5 }, text: [
    `At your current enormity the crescendo shakes the ground before it swells the flesh. Allies feel the vibration in their bones — then in their hips.`,
  ]},
  { when: {}, text: [
    `Your voice hits a pitch the air has no word for — golden music crests, and all around you allies bloom, bodies swelling one gorgeous degree in answer.`,
    `The crescendo breaks like a tide of honey. Every ally sighs as flesh rounds outward — hips wider, bellies fuller, a chorus of involuntary pleasure.`,
    `Song made sacrament: the party swells together, your melody turning appetite into curve, every new inch freely offered to the Fat Goddess.`,
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.grand_transmutation — Wizard L5 (FULL SENTENCE)
// Rewrite flesh directly; massive growth + corruption surge.
// ─────────────────────────────────────────────────────────────────

registerPool('spell.cast.grand_transmutation', [
  { when: { overflow: true }, weight: 2, text: [
    `★ Overflow tears the formula wide open: three full stages erupt into the target in a single world-altering instant. Reality has no recourse.`,
    `★ Grand Transmutation at overflow pitch — the target's body rewrites itself across three thresholds, flesh obeying the theorem faster than thought.`,
  ]},
  { when: { stagesJumpedMin: 2 }, weight: 2, text: [
    `Two thresholds collapse in sequence. The transmutation is total and unhurried — it simply insists, and flesh agrees, swelling through each new stage.`,
    `The formula cascades: stage, then stage again. The target's body isn't fighting it; it's been rewritten to want this, and the math is elegant.`,
  ]},
  { when: { corruption: 2 }, weight: 2, text: [
    `She receives the transmutation the way she receives everything now — with both hands, leaning in, moaning when the flesh begins to move and not stopping.`,
  ]},
  { when: { stageMin: 4 }, text: [
    `At your scale even transmutation feels vast — the grand formula reshaping the target the way tides reshape coastline: inevitable, immense, beautiful.`,
  ]},
  { when: {}, text: [
    `You speak the grand formula and reality edits itself. Flesh rewrites in real time — belly blooming, hips flaring, fat arriving like the universe correcting an error.`,
    `The transmutation is total: matter bends at your will, curves appearing where none existed, abundance filling the body's every quiet promise.`,
    `Alchemical certainty: the spell names what the target should become, and the flesh obeys — softening, rounding, surrendering in joyful capitulation.`,
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.true_overflow — Bonus L7 (FULL SENTENCE)
// Permanent multi-stage growth; requires stageMin 6 to cast.
// ─────────────────────────────────────────────────────────────────

registerPool('spell.cast.true_overflow', [
  { when: { stagesJumpedMin: 3 }, weight: 2, text: [
    `★ Three stages in a heartbeat — impossible, divine, laughing at the laws of flesh and physics. The patron approves. The target cannot stop smiling.`,
    `★ True Overflow cascades three thresholds deep before it settles. The body finds its new level like water finds flat ground — there, and done.`,
  ]},
  { when: { stagesJumpedMin: 2 }, weight: 2, text: [
    `Two stages arrive and refuse to leave. True Overflow doesn't negotiate; it simply states the new size and waits for reality to catch up.`,
    `The overflow cascades through two thresholds before it calms — the target settling into vastness the way royalty settles into a throne.`,
  ]},
  { when: { corruption: 2 }, weight: 2, text: [
    `She receives the permanence like a coronation — not growth but investiture. Her new enormity is settled, sure, and utterly holy.`,
    `"Again," she breathes — but the overflow is already permanent. She'll wear this stage for the rest of her story, and she knows it and loves it.`,
  ]},
  { when: { corruption: [0, 1] }, text: [
    `She looks down at the new size and stays very still. True Overflow doesn't offer a return trip. After a long moment, she stops wanting one.`,
  ]},
  { when: {}, text: [
    `True Overflow settles into the body like a permanent thing — not a gift but a fact. The new size is irrevocable, divine, and gloriously done.`,
    `The spell writes itself into flesh at the cellular level: permanent softness, permanent size, permanent devotion to the Fat Goddess's plenty.`,
    `Divine excess made law. Three stages arrive and refuse to leave — the body accepts its new shape the way it accepts breathing.`,
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.mass_indulgence — Bonus L8 (FULL SENTENCE)
// Area ritual; requires stageMin 7. Whole districts swell.
// ─────────────────────────────────────────────────────────────────

registerPool('spell.cast.mass_indulgence', [
  { when: { stagesJumpedMin: 1, escalationTierMin: 2 }, weight: 2, text: [
    `★ Against the Wheel's fractured attention, Mass Indulgence is catastrophic. A full district crosses a threshold together. The gods register this.`,
    `★ The ritual reaches every soul in range. In the Wheel's weakened state, not one resists — a whole neighborhood swells through one full stage.`,
  ]},
  { when: { stagesJumpedMin: 1 }, weight: 2, text: [
    `Mass reach, mass results: the district crosses a threshold together, a collective gasp of pleasurable expansion shaking the rafters clean off.`,
    `Every target in range blooms a full stage in the same breath — a synchronized swell that leaves the whole area smelling of cream and joy.`,
  ]},
  { when: { stageMin: 7 }, text: [
    `At your colossal scale, Mass Indulgence doesn't feel like a spell so much as a decree. The area sighs in collective compliance.`,
  ]},
  { when: {}, text: [
    `Mass Indulgence rolls outward like weather. The whole area breathes wrong — thicker, sweeter, heavier — then the swelling begins, slow and total.`,
    `Every soul in range is touched: the town itself seems to sigh as hips round, waistbands surrender, and faces go soft with wonder and new weight.`,
    `The ritual concludes. Abundance radiates outward — walls hold new sizes in place, streets remember wider shapes, and the air stays sweet for days.`,
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.gorgaras_awakening — Bonus L9 (FULL SENTENCE)
// Patron erupts through caster; requires stageMin 8. Apotheotic.
// ─────────────────────────────────────────────────────────────────

registerPool('spell.cast.gorgaras_awakening', [
  { when: { escalationTierMin: 3 }, weight: 2, text: [
    `★ Against a collapsing Wheel, Awakening is apocalyptic. The patron doesn't filter through you — she rushes through, and the world's resistance crumbles like wet bread.`,
    `★ Act III, ninth-level, the patron fully awake: four stages, area-wide, immediate. The DM stops smirking; this is the story's divine pivot.`,
  ]},
  { when: { stagesJumpedMin: 3 }, weight: 2, text: [
    `★ Three stages in a single, shuddering instant. The patron laughs inside you — loud, satisfied, vast. Every target in range is reshaped by her joy.`,
    `★ The Awakening cascades through three thresholds in one breath: the area erupts, flesh surging, the sound of clothing giving up its fight.`,
  ]},
  { when: { stagesJumpedMin: 1 }, text: [
    `The patron surges through you and the world gains weight — all of it, at once, shuddering into new and glorious proportion. You are her instrument and she is playing.`,
  ]},
  { when: {}, text: [
    `The Fat Goddess stirs behind your ribcage. When she speaks through you the world gains weight — all of it, at once, reshaped into glorious proportion.`,
    `Awakening is the right word. She doesn't arrive quietly: four stages, entire area, every target at once. The Wheel's teeth chip on this.`,
    `The veil tears. Your patron floods through you like light through cracked stone, and every body in range erupts into ecstatic, reverent abundance.`,
  ]},
]);

// ── render API ─────────────────────────────────────────────────

/**
 * Render the named-spell cast prose for overworld / cutscene moments.
 * @param {string} spellId  — e.g. 'abundance_crescendo'
 * @param {object} caster   — player or companion
 * @param {object} opts     — { targets, spell, growth, overflow, seed, trace, globals }
 */
export function renderNamedSpellCast(spellId, caster, opts = {}) {
  const growth = opts.growth ?? {};
  const ctx = createContext({
    subject: caster,
    globals: {
      spellId,
      spellName: opts.spell?.name,
      spellSchool: opts.spell?.school ?? 'abundance',
      overflow: opts.overflow ?? false,
      stagesJumped: growth.stagesJumped ?? 0,
      stagesJumpedMin: growth.stagesJumped ?? 0,
      endStage: growth.endStage,
      startStage: growth.startStage,
      escalationTier: opts.escalationTier ?? 0,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
    history: opts.history,
  });
  const key = `spell.cast.${spellId}`;
  return render(`{${key}}`, ctx, { trace: opts.trace });
}
