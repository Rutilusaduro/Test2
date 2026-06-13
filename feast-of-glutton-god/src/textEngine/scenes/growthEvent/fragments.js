// ═══════════════════════════════════════════════════════════════
// GROWTH EVENT — fragment pools (cause, sensation, surge, clothing,
// reaction, settle). Environment lives in environment.js, the
// per-stage crossing lexicon in stageCrossings.js, per-girl dialogue
// in personas.js. Every pool carries a tone-neutral wildcard.
//
// Tone rule: device-risk register rides growthIntensity / malfunctionTier
// (gradual/steady = warm, rapid = urgent, violent/critical = unsettling);
// corruption register rides the dialogue/reaction pools.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

// ── ge.causeAction ─────────────────────────────────────────────
// Shape: FULL SENTENCE. The mechanism/cause kicking in. Keyed per
// deviceId (specific) with growthMethod and featureId fallbacks.
registerPool('ge.causeAction', [
  { when: {}, text: [
    'It begins the way these things always do now — quietly, then all at once.',
    'Whatever was set in motion takes hold.',
    'The change starts before {subject.first} is quite ready for it.',
  ] },
  // method fallbacks
  { when: { growthMethod: 'feed' }, text: [
    'The feed runs steady, calories arriving faster than her body can file them away.',
    'Food keeps coming, and {subject.first}\'s body keeps finding room.',
  ] },
  { when: { growthMethod: 'bloat' }, text: [
    'Pressure builds at her middle, patient and relentless.',
    'The bloat cycle kicks up a notch, and her stomach answers.',
  ] },
  { when: { growthMethod: 'infuse' }, text: [
    'The infusion runs warm into her, dense and deliberate.',
    'Slurry pumps in, far heavier than anything she drank by choice.',
  ] },
  { when: { growthMethod: 'serum' }, text: [
    'The serum hits her bloodstream and goes to work immediately.',
    'Compound floods through {subject.first}, rewriting the rules of the next few minutes.',
  ] },
  { when: { growthMethod: 'radiation' }, text: [
    'The chamber seals with a hiss and the acceleration field spins up around her.',
    'Light floods the pod, and the field starts folding weeks of gaining into minutes.',
  ] },
  { when: { growthMethod: 'gas' }, text: [
    'The canister hisses open and the expansion gas finds her in a heartbeat.',
    'Gas blooms around {subject.first}, and her body drinks it in whether she likes it or not.',
  ] },
  { when: { growthMethod: 'sculpt' }, text: [
    'The rig hums to life, coaxing fat to migrate where it\'s told.',
    'Pressure nodes wake against her skin and start moving her softness around.',
  ] },
  { when: { growthMethod: 'stimulate' }, text: [
    'The collar pulses warm against her throat, and the loop closes.',
    'The stimulator fires, and every coming pound is wired straight into pleasure.',
  ] },
  { when: { growthMethod: 'limit_break' }, text: [
    'The override takes hold, and somewhere deep a ceiling simply lifts away.',
    'A switch she didn\'t know she had clicks off, and her body forgets its own limits.',
  ] },
  // deviceId specifics (marquee + key)
  { when: { deviceId: 'growth_accelerator_chamber' }, weight: 3, text: [
    'The chamber door locks. Through the fogging glass, {subject.first} is already starting to change.',
    'Fields ramp inside the pod, and she feels herself begin to swell against the curved walls.',
  ] },
  { when: { deviceId: 'growth_serum_sprayer' }, weight: 3, text: [
    'A fine mist settles over {subject.first}\'s skin and sinks in like it belongs there.',
    'The sprayer mists once, sweet and harmless-smelling, and then her body answers.',
  ] },
  { when: { deviceId: 'bloating_gas_canister' }, weight: 3, text: [
    'The canister empties in one long hiss and {subject.first} starts to round out fast.',
    'Gas floods the space and her middle begins to swell like something being filled.',
  ] },
  { when: { deviceId: 'growth_limit_remover' }, weight: 3, text: [
    'The limiter releases. {subject.first} feels the floor drop out from under her body\'s rules.',
    'The override fires, and there is suddenly no upper bound left to push against.',
  ] },
  { when: { deviceId: 'erogenous_growth_stimulator' }, weight: 3, text: [
    'The collar warms, and the first wave of feedback rolls through {subject.first} before a single pound lands.',
  ] },
  { when: { deviceId: 'growth_serum_injector' }, weight: 3, text: [
    'The injector empties into her and the volatile serum goes to work all at once.',
  ] },
  // feature causes
  { when: { causeType: 'feature', featureId: 'stream' }, weight: 3, text: [
    'The binge stream runs long past where it should have stopped, chat egging her on.',
    'On camera, plate after plate disappears, and the numbers — both kinds — keep climbing.',
  ] },
  { when: { causeType: 'feature', featureId: 'compound' }, weight: 3, text: [
    'The compound peaks fast, far stronger than the label suggested.',
    'Whatever Sophia mixed this time hits hard and immediate.',
  ] },
  { when: { causeType: 'feature', featureId: 'cultivator' }, weight: 3, text: [
    'The harvest comes due, and weeks of careful feeding cash out at once.',
    'Reneé\'s patient kitchen work pays off in one long, rich settling of weight.',
  ] },
  { when: { causeType: 'feature', featureId: 'contest' }, weight: 3, text: [
    'The contest table is a wasteland, and {subject.first} ate her way through most of it.',
    'The final plate goes down and the damage from the whole contest lands at once.',
  ] },
  { when: { causeType: 'digest_stageup' }, weight: 2, text: [
    'The week\'s feeding catches up to her all at once at the scale.',
    'Everything she packed away this week settles in, undeniable now.',
  ] },
]);

// ── ge.firstSensation ──────────────────────────────────────────
// Shape: FULL SENTENCE. Her body's first response. Keyed sensation ×
// intensity. Wildcard neutral.
registerPool('ge.firstSensation', [
  { when: {}, text: [
    'She feels it before she sees it.',
    'Her breath catches as her body starts to shift.',
    'Something low and warm spreads through her.',
  ] },
  { when: { sensation: 'pressure' }, text: [
    'Pressure builds behind her navel, firm and rising.',
    'She feels tight all over, like her skin is being asked for more room.',
  ] },
  { when: { sensation: 'fullness' }, text: [
    'A heavy, swimming fullness settles over her.',
    'She feels stuffed past anything she\'d have chosen, and still it climbs.',
  ] },
  { when: { sensation: 'warmth' }, text: [
    'Warmth blooms outward from her core, soft and insistent.',
    'A flush of heat moves under her skin, and the softness follows it.',
  ] },
  { when: { sensation: 'pleasure' }, text: [
    'The first wave of it lands as pure pleasure, and her knees go loose.',
    'It doesn\'t feel like gaining. It feels like being rewarded.',
  ] },
  { when: { sensation: 'stretch' }, text: [
    'She feels her body stretch to make room, and then keep stretching.',
    'Every inch of her seems to lengthen and soften at once.',
  ] },
  // intensity overrides (urgent / unsettling)
  { when: { growthIntensity: 'violent' }, weight: 2, text: [
    'It slams into her with no warm-up at all.',
    'There is no easing into this one — her whole body lurches into the change.',
  ] },
  { when: { sensation: 'pleasure', growthIntensity: 'violent' }, weight: 2, text: [
    'The pleasure crests so fast it\'s almost frightening, and she rides it anyway.',
  ] },
]);

// ── ge.surgeDetail ─────────────────────────────────────────────
// Shape: FULL SENTENCE. Extra detail layered onto {grow.sudden}.
// Wildcard weighted-empty so small events stay lean.
registerPool('ge.surgeDetail', [
  { when: {}, text: ['', '', ''] },
  { when: { growthMethod: 'sculpt' }, text: [
    'She can feel the fat travelling, settling where the rig decided it should go.',
  ] },
  { when: { growthMethod: 'gas' }, text: [
    'She rounds outward smoothly, taut as a filled balloon.',
  ] },
  { when: { growthZone: 'belly' }, text: [
    'Most of it lands at her middle, pushing her belly out and forward.',
  ] },
  { when: { growthZone: 'lower_body' }, text: [
    'Her hips and thighs take the brunt of it, spreading wider with each second.',
  ] },
  { when: { growthZone: 'curves' }, text: [
    'It pools into her curves, deepening every line of her at once.',
  ] },
  { when: { growthZone: 'bust' }, text: [
    'Her chest takes the lead, heavy and demanding new support.',
  ] },
  // malfunction escalation
  { when: { malfunctionTier: 'moderate' }, weight: 2, text: [
    'It overshoots the dose — more than anyone asked for, and faster.',
  ] },
  { when: { malfunctionTier: 'major' }, weight: 2, text: [
    'It blows well past the intended mark, and there\'s no obvious way to throttle it back.',
  ] },
  { when: { malfunctionTier: 'critical' }, weight: 3, text: [
    'It keeps going after it should have stopped — past alarming, into something her body simply accepts.',
    'The growth refuses every limit, climbing on its own logic now.',
  ] },
  { when: { stagesJumpedMin: 2 }, weight: 2, text: [
    'A whole size goes by, then most of another, before it finally eases.',
  ] },
]);

// ── ge.garment ─────────────────────────────────────────────────
// Shape: NOUN PHRASE (possessive, lowercase). Archetype outfit lexicon;
// outfitHint cells (weight 4) override for context. A future real outfit
// system can drive this purely by setting outfitHint.
registerPool('ge.garment', [
  { when: {}, text: ['her clothes', 'the waistband she put on this morning', 'the fabric across her middle'] },
  { when: { archetype: 'cheerleader' }, text: ['her cheer top', 'her practice shorts'] },
  { when: { archetype: 'athlete' }, text: ['her compression gear', 'her track kit'] },
  { when: { archetype: 'gamer' }, text: ['her oversized hoodie', 'her lounge shorts'] },
  { when: { archetype: 'sorority' }, text: ['her going-out top', 'her chapter tee'] },
  { when: { archetype: 'bookworm' }, text: ['her cardigan', 'her tucked-in blouse'] },
  { when: { archetype: 'influencer' }, text: ['her fit-check outfit', 'her cropped top'] },
  { when: { archetype: 'culinary' }, text: ['her chef\'s whites', 'her apron strings'] },
  { when: { archetype: 'nursing' }, text: ['her scrubs', 'her scrub top'] },
  { when: { archetype: 'farm_girl' }, text: ['her flannel', 'her denim'] },
  { when: { archetype: 'eced' }, text: ['her sundress', 'her cozy cardigan'] },
  { when: { archetype: 'predator' }, text: ['her dark blouse', 'her fitted dress'] },
  { when: { archetype: 'explorer' }, text: ['her field shirt', 'her khakis'] },
  { when: { archetype: 'psych' }, text: ['her blouse', 'her wrap top'] },
  { when: { archetype: 'artsy' }, text: ['her paint-flecked smock', 'her loose tunic'] },
  // outfitHint overrides
  { when: { outfitHint: 'casual' }, weight: 4, text: ['her comfy stream fit', 'her soft default outfit'] },
  { when: { outfitHint: 'revealing' }, weight: 4, text: ['her bold little outfit', 'the revealing fit she picked for chat'] },
  { when: { outfitHint: 'branded' }, weight: 4, text: ['her brand-deal outfit', 'her sponsor merch'] },
  { when: { outfitHint: 'contest' }, weight: 4, text: ['her contest stretch-pants', 'her competition tee'] },
]);

// ── ge.clothingStrain ──────────────────────────────────────────
// Shape: VERB PHRASE (lowercase predicate, no period). Follows {garment|cap}.
// Uses number-agnostic modal/base verbs so singular ("her top") and
// plural ("her scrubs") garments both read correctly.
registerPool('ge.clothingStrain', [
  { when: {}, text: ['won\'t last the minute', 'can\'t keep up with the new softness', 'can\'t win this one'] },
  { when: { growthZone: 'belly' }, text: ['can\'t cover her middle anymore', 'won\'t stay down over her belly'] },
  { when: { growthZone: 'lower_body' }, text: ['won\'t make it over her hips', 'can\'t stretch any further across her thighs'] },
  { when: { growthZone: 'curves' }, text: ['can\'t keep up with her curves', 'can\'t cover her on every side at once'] },
  { when: { growthZone: 'bust' }, text: ['won\'t stay buttoned over her chest', 'can\'t contain her bust any longer'] },
  { when: { startStageMin: 6 }, weight: 2, text: ['never stood a chance', 'lost this fight long ago'] },
]);

// ── ge.clothingFail ────────────────────────────────────────────
// Shape: FULL SENTENCE. Outright failure. Weighted-empty wildcard so
// small/early events usually skip it.
registerPool('ge.clothingFail', [
  { when: {}, text: ['', '', '', ''] },
  { when: { endStageMin: 4, stagesJumpedMin: 1 }, text: [
    'A seam lets go with a soft, final sound.',
    'Something gives at the waistband, and she stops pretending it still fits.',
  ] },
  { when: { growthZone: 'belly', endStageMin: 4 }, text: [
    'The hem surrenders and her belly settles into the open air.',
  ] },
  { when: { growthZone: 'bust', endStageMin: 4 }, text: [
    'A button gives up and pings off somewhere across the room.',
  ] },
  { when: { growthZone: 'lower_body', endStageMin: 4 }, text: [
    'A seam splits down one straining thigh.',
  ] },
  { when: { endStageMin: 6 }, weight: 2, text: [
    'Whatever she was wearing simply isn\'t clothing anymore — just strained fabric and open seams.',
  ] },
  { when: { outfitHint: 'revealing', endStageMin: 3 }, weight: 2, text: [
    'The bold little outfit gives out on camera, and chat absolutely loses it.',
  ] },
  { when: { outfitHint: 'contest', endStageMin: 3 }, weight: 2, text: [
    'The contest waistband finally lets go, and the crowd roars.',
  ] },
]);

// ── ge.reactionBody ────────────────────────────────────────────
// Shape: FULL SENTENCE. Her physical reaction, before she speaks.
registerPool('ge.reactionBody', [
  { when: {}, text: [
    '{subject.first} runs both hands down her new shape, taking stock.',
    '{subject.first} goes still, feeling the size of what just happened.',
    '{subject.first} presses a hand to herself and just breathes.',
  ] },
  { when: { shameTierMin: 2 }, weight: 2, text: [
    '{subject.first}\'s face goes hot, and she can\'t look directly at herself.',
    '{subject.first} covers her face, ears burning, but doesn\'t look away for long.',
  ] },
  { when: { fixationTierMin: 2 }, weight: 2, text: [
    '{subject.first}\'s hands move over the new softness like she can\'t get enough of it.',
  ] },
  { when: { sensation: 'pleasure' }, weight: 2, text: [
    '{subject.first} shivers through the last of it, flushed and unsteady.',
  ] },
  { when: { inWithdrawal: true }, weight: 2, text: [
    '{subject.first}\'s hands shake as they find the new weight, hungry for more of it already.',
  ] },
]);

// ── ge.reactionDialogue ────────────────────────────────────────
// Shape: DIALOGUE BEAT. Corruption-gated baseline; personas.js extends
// per girl. priority hard-gate keeps tiers from leaking in pool mode.
registerPool('ge.reactionDialogue', [
  { when: {}, priority: 1, text: [
    '"...okay," she manages. "That\'s — okay."',
    '"That just happened," she says, mostly to herself.',
  ] },
  { when: { corruption: 0 }, priority: 1, text: [
    '"I shouldn\'t — that\'s too much," she says, not quite believing it.',
    '"This is getting away from me," she whispers, hands not leaving her body.',
  ] },
  { when: { corruption: 1 }, priority: 1, text: [
    '"Okay. Okay, I felt that one," she admits, a little breathless.',
    '"I keep saying I\'ll stop," she says. "I keep not meaning it."',
  ] },
  { when: { corruption: 2 }, priority: 1, text: [
    '"More," she breathes, like it\'s the only word left. "God, more."',
    '"Look at me," she says, proud and unhurried. "Just look."',
  ] },
  { when: { corruption: 2, obsessionTierMin: 2 }, priority: 1, weight: 2, text: [
    '"I don\'t want it to stop," she says. "I don\'t think I could stand it if it did."',
  ] },
  { when: { causeType: 'device_malfunction', corruption: 0 }, priority: 1, weight: 2, text: [
    '"It\'s not stopping," she says, voice climbing. "Why isn\'t it stopping?"',
  ] },
]);

// ── ge.settleLine ──────────────────────────────────────────────
// Shape: FULL SENTENCE. The aftermath settling.
registerPool('ge.settleLine', [
  { when: {}, text: [
    'When it finally levels off, she\'s left to learn the shape of herself all over again.',
    'It eases, eventually, and leaves her heavier and quietly changed.',
    'The last of it settles, and the new size is simply hers now.',
  ] },
  { when: { growthIntensity: 'gradual' }, text: [
    'It tapers off as gently as it arrived, the weight just... staying.',
  ] },
  { when: { malfunctionTier: 'critical' }, weight: 2, text: [
    'It stops, finally — but no one is sure it stopped because it was finished.',
  ] },
  { when: { isMalfunction: true }, weight: 2, text: [
    'By the time the device cuts out, the damage is comfortably, permanently done.',
  ] },
]);

// ── ge.permanentNote ───────────────────────────────────────────
// Shape: FULL SENTENCE. The point-of-no-return register. Empty wildcard.
registerPool('ge.permanentNote', [
  { when: {}, text: ['', '', ''] },
  { when: { isPermanent: true }, weight: 2, text: [
    'This one isn\'t going anywhere. Her body has already decided to keep it.',
    'Whatever this added, it added for good.',
  ] },
  { when: { deviceId: 'growth_limit_remover' }, weight: 3, text: [
    'And the ceiling is still gone. Whatever comes next has nothing to push back against.',
  ] },
  { when: { limitRemoved: true }, weight: 3, text: [
    'Her body has stopped recognizing the idea of "enough" entirely.',
  ] },
]);

// ── ge.taliaCameo ──────────────────────────────────────────────
// Shape: DIALOGUE BEAT (Talia, the inventor). Mostly-empty wildcard;
// appears mainly for device causes, heavier in the lab.
registerPool('ge.taliaCameo', [
  { when: {}, text: ['', '', '', ''] },
  { when: { causeType: 'device_use', locale: 'lab' }, text: [
    'Talia checks a readout and nods once. "Within tolerance," she says, not looking up.',
    'Talia hums, tapping her tablet. "Good response curve. Logging it."',
  ] },
  { when: { causeType: 'device_malfunction', locale: 'lab' }, weight: 2, text: [
    'Talia frowns at a spiking graph. "Huh. That\'s new," she murmurs, already taking notes.',
    'Talia smacks the side of the console. "Okay, that wasn\'t supposed to do that. Noted."',
  ] },
  { when: { deviceId: 'growth_accelerator_chamber' }, weight: 2, text: [
    'Talia watches through the glass with frank engineer interest. "Beautiful field saturation," she says.',
  ] },
  { when: { malfunctionTier: 'critical', locale: 'lab' }, weight: 3, text: [
    'Talia\'s hand hovers over the kill switch, then drops. "Let\'s just see where it lands," she decides.',
  ] },
]);

// ── ge.deviceWindDown ──────────────────────────────────────────
// Shape: FULL SENTENCE. The hardware powering down. Empty wildcard.
registerPool('ge.deviceWindDown', [
  { when: {}, text: ['', '', ''] },
  { when: { deviceId: 'growth_accelerator_chamber' }, text: [
    'The chamber hisses open and lets her out, unsteady on newly heavier legs.',
  ] },
  { when: { deviceId: 'growth_serum_sprayer' }, text: [
    'The sprayer clicks empty, its work long since done.',
  ] },
  { when: { deviceId: 'bloating_gas_canister' }, text: [
    'The canister vents the last of itself and goes quiet.',
  ] },
  { when: { deviceId: 'erogenous_growth_stimulator' }, text: [
    'The collar dims back to a low, patient warmth, waiting for next time.',
  ] },
]);
