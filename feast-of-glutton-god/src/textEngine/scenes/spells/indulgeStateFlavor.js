// ══════════════════════════════════════════════════════════════════
// INDULGE STATE FLAVOR — narrative pools for Phase 1 foundation spells
// (Mage Hand, Magic Mouth, Stone Shape, Suggestion, Quicksand)
// and their state interactions / combo resolutions.
//
// Wiring: import this file in scenes/index.js alongside namedSpellFlavor.js
// Pool shape: prose strings rendered by engine.js render(key, ctx).
// ══════════════════════════════════════════════════════════════════
import { registerPool, registerModuleVariants } from '../../engine.js';

// ── dm.cast.invoke.school extensions ────────────────────────────
// Participle-clause additions for combat use of the new spells.

registerModuleVariants('dm.cast.invoke.school', [
  { when: { spellName: 'Mage Hand' }, weight: 4, text: [
    'a translucent hand forming in the air and drifting toward its work with unsettling precision',
    'conjured fingers curling around the morsel with ghostly delicacy before delivering it',
    'no hands needed — the spectral one does the feeding, leaving you free to watch',
  ]},
  { when: { spellName: 'Magic Mouth' }, weight: 4, text: [
    'arcane lips forming on the surface of the food, binding it to a distant appetite',
    'the caloric covenant written in invisible ink — every bite paid elsewhere',
    'a whispered binding that turns the meal into a conduit, the distance into nothing',
  ]},
  { when: { spellName: 'Stone Shape' }, weight: 4, text: [
    'the earth answering your will the way obedient things do — heavy and immediate',
    'stone rising into the shape you named, unhurried and permanent',
    'your hands shaping reality as firmly as sculpture, the material yielding without argument',
  ]},
  { when: { spellName: 'Suggestion' }, weight: 4, text: [
    'the suggestion settling in like honey — sweet, quiet, and absolutely irresistible',
    'a thought placed so gently it feels native, as if the hunger was always theirs',
    'enchantment as soft as breath, as inescapable as appetite',
  ]},
  { when: { spellName: 'Quicksand' }, weight: 4, text: [
    'the ground shifting underfoot before they can react — mud rising, gripping, holding',
    'earth turning treacherous and thick, swallowing purchase and retreat together',
    'a patch of solid world becoming patient and hungry in its own right',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.mage_hand — cantrip (FULL SENTENCE)
// Remote feeding / object manipulation with state awareness.
// ─────────────────────────────────────────────────────────────────
registerPool('spell.cast.mage_hand', [
  { when: { isRestrained: true, hasSuggestion: true }, weight: 3, text: [
    'The hand drifts to the target without hurry — pinned and compelled, they can only watch it approach with the morsel. The suggestion ignites before the first bite lands.',
    'Restrained and already hungry from your whispered command, they open for the hand before it even reaches them. The spell does half the work; the enchantment does the rest.',
  ]},
  { when: { isRestrained: true }, weight: 2, text: [
    'The spectral hand floats toward them with serene efficiency. Stuck as they are, there\'s nowhere to go and nothing to do but accept what the hand brings.',
    'No escape, no refusal — just the hand arriving with purpose, feeding them at range with an intimacy that distance somehow amplifies.',
  ]},
  { when: { hasCalorieBond: true }, weight: 2, text: [
    'The hand finds the bound object and presses food to its surface. Somewhere else, someone swells. The magic works exactly as intended.',
    'A gesture — and the Calorie Bond activates. The hand never touches the linked creature, but the growth does.',
  ]},
  { when: {}, text: [
    'A translucent hand shimmers into being and drifts toward the food with eerie calm, delivering it to the target with the intimacy of a touch from across the room.',
    'The spectral hand is unhurried and precise — it picks, it carries, it delivers. The target has no say in the choreography.',
    'Mage Hand does exactly what the name implies, without drama or commentary. The morsel arrives. The mouth opens. The rest is biology.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.magic_mouth — Level 2 Illusion (FULL SENTENCE)
// Long-range binding; sets up a feeding scheme.
// ─────────────────────────────────────────────────────────────────
registerPool('spell.cast.magic_mouth', [
  { when: { hasSuggestion: true }, weight: 3, text: [
    'You bind the object and seal the covenant — now every bite delivered here arrives where you intended, and the suggestion you planted means they\'ll seek exactly this. Elegant.',
    'Magic Mouth on the food, Suggestion on the feeder — the scheme closes itself. You can walk away. It runs without you.',
  ]},
  { when: {}, text: [
    'Arcane lips trace themselves across the object\'s surface. You speak the linking name, and somewhere a thread of hungry magic stretches toward your chosen recipient.',
    'The binding sets without ceremony. Whoever feeds this object is feeding someone else — they just don\'t know it yet.',
    'Magic Mouth applied: an invisible agreement between the food and your target, written in caloric intent and sealed with a whispered name.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.stone_shape — Level 4 Transmutation (FULL SENTENCE)
// Form-aware prose based on `stoneForm` global.
// ─────────────────────────────────────────────────────────────────
registerPool('spell.cast.stone_shape', [
  { when: { stoneForm: 'cuffs' }, weight: 3, text: [
    'Stone answers the command, rising around the wrists and locking itself — decorative enough to seem intentional, inescapable enough to be honest.',
    'The cuffs form from the floor and close without drama. Solid, heavy, polished by magic into something that looks almost comfortable until you pull.',
    'Earth remembers shape. You give it a new one — circular, close-fitting, unyielding.',
  ]},
  { when: { stoneForm: 'basin' }, weight: 2, text: [
    'A basin scoops itself from the stone floor — wide-lipped, deep, and patient. It waits for whatever you\'ll fill it with.',
    'The hollow opens in the floor like a stone mouth, perfectly shaped to hold a feast, a flood, or whatever liquid magic you choose next.',
  ]},
  { when: { stoneForm: 'table' }, weight: 2, text: [
    'A feasting table rises from the earth — broad, flat, and stable enough for any weight you intend to place on it. Or at it.',
    'The stone shapes itself into a surface wide enough to serve from and strong enough to hold what you\'re planning.',
  ]},
  { when: {}, text: [
    'Stone obeys. Your command describes a shape and the material simply becomes it — deliberate, permanent, and heavy in all the right ways.',
    'The transmutation is quiet and complete. What was featureless earth is now exactly what you needed it to be.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.suggestion — Level 2 Enchantment (FULL SENTENCE)
// Context-aware: restrained targets, background targets.
// ─────────────────────────────────────────────────────────────────
registerPool('spell.cast.suggestion', [
  { when: { isQuicksandTrapped: true }, weight: 4, text: [
    'Pinned and helpless, they have no defense against the whispered suggestion — it enters through the fear and the stillness and closes like a trap. You\'ll barely need to wait.',
    'The enchantment finds no resistance. Trapped in quicksand with nowhere to look but up at you, the suggestion settles in as if it was their own thought from the start.',
    'You crouch to their level and speak softly — there\'s no drama needed when the target can\'t run. The Suggestion enters, warm and irresistible, and stays.',
  ]},
  { when: { isRestrained: true }, weight: 3, text: [
    'Restrained and already compromised, they can\'t move away from the suggestion — it settles in with unusual speed, finding no foothold for resistance.',
    'The magic lands easy on a target that can\'t flee. You murmur the compulsion and it takes.',
  ]},
  { when: { bgDensity: 'crowd' }, weight: 2, text: [
    'You push the suggestion outward like a slow exhale — not loud enough to be heard but wide enough to reach the nearest receptive mind in the crowd.',
    'A crowd this dense always has someone already half-inclined. The suggestion finds them without effort, settling in before they even know you spoke.',
  ]},
  { when: {}, text: [
    'The enchantment is everything the name promises — a suggestion, not a command. Subtle enough to feel native, strong enough to hold. They\'ll think it was their idea.',
    'You speak it quietly, just once. The magic does the rest: the thought arrives fully formed and already feels like hunger, like a preference, like their own desire.',
    'Suggestion cast — the thought is planted now, and it will bloom exactly when conditions are right. Patient magic for patient schemes.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.cast.quicksand — Level 3 Transmutation (FULL SENTENCE)
// Terrain control with combo setup.
// ─────────────────────────────────────────────────────────────────
registerPool('spell.cast.quicksand', [
  { when: { hasSuggestion: true }, weight: 4, text: [
    'The ground swallows their footing and holds. Pinned now, and already suggestible — the combo is closed. You take a step back and let the two spells do their work together.',
    'Restrained by earth, compelled by enchantment: the setup is complete. Whatever happens next happens on your terms entirely.',
  ]},
  { when: { bgDensity: 'crowd' }, weight: 2, text: [
    'A section of the plaza softens without warning. Two, three figures catch it mid-step and sink — confusion becoming struggle, struggle becoming stillness.',
    'The crowd parts around the sinking figures with the perfect instinct of bystanders encountering something too strange to approach.',
  ]},
  { when: { pullDepth: 'shoulders' }, weight: 2, text: [
    'They\'ve sunk further than intended — shoulders now, arms still free but barely. The quicksand is patient and you are not in a hurry.',
    'Shoulder-deep and running out of leverage: the target has accepted the situation even if they haven\'t said so yet.',
  ]},
  { when: {}, text: [
    'The ground gives way — not with drama, but with quiet inevitability. One step into soft earth, then another, and suddenly the floor is waist-deep and not letting go.',
    'Earth thickens underfoot like a living thing, pulling downward with polite insistence. Waist-deep in moments, going nowhere.',
    'The patch of quicksand opens like a question — and then insists on being answered. They sink to waist depth, then stop. For now.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.combo.suggestion_restraint — triggered by combo resolver
// ─────────────────────────────────────────────────────────────────
registerPool('spell.combo.suggestion_restraint', [
  { when: { isQuicksandTrapped: true }, weight: 3, text: [
    'The Suggestion detonates. Pinned in quicksand with nowhere to flee and a compulsion already eating at their willpower, they give up the pretense of resistance and reach for the food. Growth follows in waves.',
    'Restrained and compelled — the two states collide and the result is inevitable. They eat without ceremony, quickly, hungrily, the suggestion and the quicksand doing exactly what they were designed to do together.',
  ]},
  { when: {}, text: [
    'The combo resolves cleanly: restrained body, planted compulsion, and a trigger that needed only the right stimulus. Growth comes fast and generous.',
    'Suggestion + Restraint: a classic combination. The target indulges because they can\'t leave and they can\'t resist and somewhere, distantly, they\'re not sure they wanted to.',
  ]},
]);

// ─────────────────────────────────────────────────────────────────
// spell.state.quicksand_pull_deeper — time-tick narrative
// ─────────────────────────────────────────────────────────────────
registerPool('spell.state.quicksand_pull_deeper', [
  { when: {}, text: [
    'The quicksand settles into a new position — shoulders now, arms working uselessly above the surface.',
    'Time and gravity conspire. They\'ve sunk deeper, shoulder-deep, the earth claiming a little more with each passing hour.',
    'The pull is patient. Shoulder-deep now, and they\'ve stopped struggling. The quicksand noticed.',
  ]},
]);

/**
 * Render spell cast prose for a Phase 1 utility spell.
 * Falls back to generic text if no pool exists for the spellId.
 */
export function renderIndulgeStateCast(spellId, caster, target, opts = {}) {
  // Defer to engine's render — pools registered above will match
  // This function exists as a named import hook for external callers.
  return null; // caller should use engine render() directly with context globals
}
