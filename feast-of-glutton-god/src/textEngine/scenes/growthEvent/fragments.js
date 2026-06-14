// ═══════════════════════════════════════════════════════════════
// GROWTH EVENT — fragment pools (cause, sensation, surge, clothing,
// reaction, settle). Environment lives in environment.js, the
// per-stage crossing lexicon in stageCrossings.js, companion dialogue
// in personas.js. Every pool carries a tone-neutral wildcard.
//
// Tone: sensual abundance, the Fat Goddess's blessing, high fantasy — no
// modern/college register. Ritual overflow uses malfunctionTier when
// a spell or relic exceeds its intended strength.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

// ── ge.causeAction ─────────────────────────────────────────────
registerPool('ge.causeAction', [
  { when: {}, text: [
    'It begins the way these things always do now — quietly, then all at once.',
    'Whatever was set in motion takes hold.',
    'The change starts before {subject.first} is quite ready for it.',
  ] },
  { when: { growthMethod: 'feed' }, text: [
    'The feed runs steady, delicacies arriving faster than her body can file them away.',
    'Food keeps coming, and {subject.first}\'s body keeps finding room — blessed, eager, grateful.',
  ] },
  { when: { growthMethod: 'blessing' }, text: [
    'Golden light pours into {subject.first}, and abundance answers like a prayer finally heard.',
    'the Fat Goddess\'s warmth settles over her skin; the blessing does not ask permission before it swells.',
  ] },
  { when: { growthMethod: 'spell' }, text: [
    'Arcane sweetness coils through {subject.first} — a spell cast in hunger, not malice.',
    'The working lands all at once; magic and appetite braid together until flesh obeys both.',
  ] },
  { when: { growthMethod: 'feast' }, text: [
    'Course after course finds her, and the feast refuses the idea of stopping.',
    'The hall fills with steam and moans; {subject.first} eats like devotion made appetite.',
  ] },
  { when: { growthMethod: 'intimate' }, text: [
    'Pleasure and fullness arrive together — touch becoming weight, weight becoming worship.',
    'What began as closeness deepens into swelling; {subject.first} gasps and does not pull away.',
  ] },
  { when: { growthMethod: 'combat' }, text: [
    'Growth Damage ripples through {subject.first} mid-clash — violence transmuted into plush abundance.',
    'Each blow leaves softness behind; the battlefield itself seems to feed her.',
  ] },
  { when: { growthMethod: 'quest' }, text: [
    'The ritual completes, and the promised abundance cashes out at once.',
    'Whatever oath or quest bound this moment, {subject.first} feels it settle into flesh.',
  ] },
  { when: { growthMethod: 'bloat' }, text: [
    'Pressure builds at her middle, patient and relentless as rising dough.',
    'The bloat cycle kicks up a notch, and her stomach answers with sacred fullness.',
  ] },
  { when: { growthMethod: 'infuse' }, text: [
    'The infusion runs warm into her — honeyed, dense, deliberate as temple wine.',
    'Rich brew pumps through the ritual chalice, far heavier than anything she drank by choice.',
  ] },
  { when: { causeType: 'feature', featureId: 'contest' }, weight: 3, text: [
    'The feast-day table is a wasteland, and {subject.first} ate her way through most of it.',
    'The final trencher goes down and the whole contest lands in her body at once.',
  ] },
  { when: { causeType: 'feature', featureId: 'compound' }, weight: 3, text: [
    'Sylvie\'s experimental elixir peaks fast — far stronger than the label suggested.',
    'Whatever the scholar mixed this time hits hard and immediate, alchemical and hungry.',
  ] },
  { when: { causeType: 'feature', featureId: 'cultivator' }, weight: 3, text: [
    'The harvest ritual comes due, and weeks of careful feeding cash out at once.',
    'Elara\'s patient kitchen work pays off in one long, rich settling of weight.',
  ] },
  { when: { causeType: 'digest_stageup' }, weight: 2, text: [
    'The week\'s indulgence catches up to her all at once before the temple scales.',
    'Everything she packed away this week settles in, undeniable now — a tithe of flesh.',
  ] },
  { when: { locale: 'sacred_grotto' }, weight: 2, text: [
    'The grotto hums approval; standing stones warm as abundance rises through {subject.first}.',
  ] },
  { when: { locale: 'grand_cathedral' }, weight: 2, text: [
    'Incense thickens; the nave seems to hold its breath as {subject.first} begins to change.',
  ] },
]);

// ── ge.firstSensation ──────────────────────────────────────────
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
  { when: { growthIntensity: 'violent' }, weight: 2, text: [
    'It slams into her with no warm-up at all.',
    'There is no easing into this one — her whole body lurches into the change.',
  ] },
  { when: { sensation: 'pleasure', growthIntensity: 'violent' }, weight: 2, text: [
    'The pleasure crests so fast it\'s almost frightening, and she rides it anyway.',
  ] },
]);

// ── ge.surgeDetail ─────────────────────────────────────────────
registerPool('ge.surgeDetail', [
  { when: {}, text: ['', '', ''] },
  { when: { growthMethod: 'blessing' }, text: [
    'Golden warmth pools wherever the Fat Goddess\'s favor touches — belly, hips, chest in generous order.',
  ] },
  { when: { growthMethod: 'spell' }, text: [
    'Arcane light stipples her skin; each pulse leaves her softer, fuller, more luminous.',
  ] },
  { when: { growthMethod: 'gas' }, text: [
    'She rounds outward smoothly, taut as a festival balloon blessed by the goddess.',
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
  { when: { malfunctionTier: 'moderate' }, weight: 2, text: [
    'The blessing overshoots the dose — more than anyone asked for, and faster.',
  ] },
  { when: { malfunctionTier: 'major' }, weight: 2, text: [
    'It blows well past the intended mark, and there\'s no obvious way to throttle it back.',
  ] },
  { when: { malfunctionTier: 'critical' }, weight: 3, text: [
    'It keeps going after it should have stopped — past alarming, into something her body simply accepts.',
    'The growth refuses every limit, climbing on its own sacred logic now.',
  ] },
  { when: { stagesJumpedMin: 2 }, weight: 2, text: [
    'A whole threshold goes by, then most of another, before it finally eases.',
  ] },
]);

// ── ge.garment ─────────────────────────────────────────────────
registerPool('ge.garment', [
  { when: {}, text: ['her clothes', 'the waistband she laced this morning', 'the fabric across her middle'] },
  { when: { archetype: 'nurturing' }, text: ['her apron strings', 'her matron\'s dress'] },
  { when: { archetype: 'performer' }, text: ['her travel bodice', 'her bard\'s laced corset'] },
  { when: { archetype: 'devout' }, text: ['her vestments', 'her prayer shawl'] },
  { when: { archetype: 'scholar' }, text: ['her spell-worn robe', 'her scholar\'s sash'] },
  { when: { archetype: 'dominant' }, text: ['her pact-gown', 'her dark velvet bodice'] },
  { when: { archetype: 'competitive' }, text: ['her smith\'s leathers', 'her feast-day harness'] },
  { when: { archetype: 'haughty' }, text: ['her noble stomacher', 'her embroidered bodice'] },
  { when: { archetype: 'shy' }, text: ['her hooded cloak', 'her modest linen dress'] },
  { when: { archetype: 'greedy' }, text: ['her merchant silks', 'her coin-laced belt'] },
  { when: { archetype: 'ancient' }, text: ['her vine-wrapped linen', 'her living-bark shawl'] },
  { when: { archetype: 'proud' }, text: ['her ceremonial armor', 'her guard\'s pauldrons'] },
  { when: { archetype: 'chosen' }, text: ['her chosen\'s raiment', 'her blessing-wrap'] },
  { when: { role: 'innkeeper' }, text: ['her innkeeper\'s apron', 'her hearth-side dress'] },
  { when: { role: 'bard' }, text: ['her performance silks', 'her lute-slung bodice'] },
  { when: { role: 'blacksmith' }, text: ['her soot-soft leathers', 'her forge apron'] },
  { when: { role: 'priestess' }, text: ['her linen vestments', 'her dawnwell stole'] },
  { when: { outfitHint: 'casual' }, weight: 4, text: ['her tavern-day dress', 'her soft everyday gown'] },
  { when: { outfitHint: 'revealing' }, weight: 4, text: ['her festival gown', 'her daring feast-day silks'] },
  { when: { outfitHint: 'branded' }, weight: 4, text: ['her house livery', 'her noble house colors'] },
  { when: { outfitHint: 'contest' }, weight: 4, text: ['her feast-day garb', 'her competition sash and stretch-laced skirt'] },
]);

// ── ge.clothingStrain ──────────────────────────────────────────
registerPool('ge.clothingStrain', [
  { when: {}, text: ['won\'t last the minute', 'can\'t keep up with the new softness', 'can\'t win this one'] },
  { when: { growthZone: 'belly' }, text: ['can\'t cover her middle anymore', 'won\'t stay down over her belly'] },
  { when: { growthZone: 'lower_body' }, text: ['won\'t make it over her hips', 'can\'t stretch any further across her thighs'] },
  { when: { growthZone: 'curves' }, text: ['can\'t keep up with her curves', 'can\'t cover her on every side at once'] },
  { when: { growthZone: 'bust' }, text: ['won\'t stay laced over her chest', 'can\'t contain her bust any longer'] },
  { when: { startStageMin: 6 }, weight: 2, text: ['never stood a chance', 'lost this fight long ago'] },
]);

// ── ge.clothingFail ────────────────────────────────────────────
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
    'A lace point gives up and pings off somewhere across the room.',
  ] },
  { when: { growthZone: 'lower_body', endStageMin: 4 }, text: [
    'A seam splits down one straining thigh.',
  ] },
  { when: { endStageMin: 6 }, weight: 2, text: [
    'Whatever she was wearing simply isn\'t clothing anymore — just strained fabric and open seams.',
  ] },
  { when: { outfitHint: 'revealing', endStageMin: 3 }, weight: 2, text: [
    'The festival gown gives out before the musicians finish their second song, and the hall erupts in delighted gasps.',
  ] },
  { when: { outfitHint: 'contest', endStageMin: 3 }, weight: 2, text: [
    'The feast-day sash finally snaps, and the crowd roars like the Fat Goddess herself applauded.',
  ] },
]);

// ── ge.reactionBody ────────────────────────────────────────────
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
    '"More," she breathes, like it\'s the only word left. "the Fat Goddess, more."',
    '"Look at me," she says, proud and unhurried. "Just look."',
  ] },
  { when: { corruption: 2, obsessionTierMin: 2 }, priority: 1, weight: 2, text: [
    '"I don\'t want it to stop," she says. "I don\'t think I could stand it if it did."',
  ] },
  { when: { malfunctionTier: 'critical', corruption: 0 }, priority: 1, weight: 2, text: [
    '"It\'s not stopping," she says, voice climbing. "Why isn\'t it stopping?"',
  ] },
]);

// ── ge.settleLine ──────────────────────────────────────────────
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
  { when: { growthMethod: 'blessing' }, weight: 2, text: [
    'The golden warmth fades to a low hum, and abundance remains like incense in the air.',
  ] },
]);

// ── ge.permanentNote ───────────────────────────────────────────
registerPool('ge.permanentNote', [
  { when: {}, text: ['', '', ''] },
  { when: { isPermanent: true }, weight: 2, text: [
    'This one isn\'t going anywhere. Her body has already decided to keep it.',
    'Whatever this added, it added for good — a gift the goddess does not recall.',
  ] },
  { when: { limitRemoved: true }, weight: 3, text: [
    'Her body has stopped recognizing the idea of "enough" entirely.',
  ] },
]);

// ── ge.scholarAside ─────────────────────────────────────────────
// Sylvie or scholarly observers — mostly empty; fires in temple/lab contexts.
registerPool('ge.scholarAside', [
  { when: {}, text: ['', '', '', ''] },
  { when: { growthMethod: 'spell', locale: 'marble_hall' }, text: [
    'Sylvie murmurs a measurement under her breath and smiles like a woman vindicated.',
    '"Fascinating curve," the scholar whispers, already scribbling notes by candlelight.',
  ] },
  { when: { causeType: 'feature', featureId: 'compound' }, weight: 2, text: [
    'Sylvie watches the elixir\'s work with naked delight. "Hypothesis confirmed," she breathes.',
  ] },
  { when: { malfunctionTier: 'critical', growthMethod: 'spell' }, weight: 3, text: [
    'Sylvie\'s hand hovers over the counterspell, then drops. "Let\'s see where the Fat Goddess takes this," she decides.',
  ] },
]);

// ── ge.ritualFade ──────────────────────────────────────────────
registerPool('ge.ritualFade', [
  { when: {}, text: ['', '', ''] },
  { when: { growthMethod: 'blessing' }, text: [
    'The last gold motes drift away, leaving only warmth and new weight behind.',
  ] },
  { when: { growthMethod: 'spell' }, text: [
    'The working\'s light gutters out; the swell remains, sacred and satisfied.',
  ] },
  { when: { growthMethod: 'feast' }, text: [
    'Empty trenchers steam in the silence; {subject.first} sighs, gloriously full.',
  ] },
  { when: { locale: 'sacred_grotto' }, text: [
    'The standing stones cool; the grotto returns to its hush, changed around her.',
  ] },
]);
