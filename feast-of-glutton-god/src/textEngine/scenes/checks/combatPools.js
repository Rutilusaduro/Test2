/**
 * Combat critical / fumble prose — attacks and saves.
 * Keys match combatRollOutcomes.js and combatRolls.js textKey patterns.
 */
import { registerCheckPool, registerCheckPoolAliases } from './helpers.js';

/** Shared attack crit matrix — melee-forward; specialized pools override flavor. */
const ATTACK_CRIT_CORE = {
  lean: {
    distant: [
      'Your strike lands with impossible precision — {ref.first} gasps as pleasure blooms where you hit, curves rounding instantly.',
      'Critical impact becomes critical appetite; {ref.name} swells from the blow like a fruit ripening.',
      'Flesh meets flesh in perfect harmony — the hit sings, and {ref.first} jiggles new softness into place.',
    ],
    warm: [
      'You land the blow and pull {ref.first} close before {they} can stumble — a critical hit wrapped in affection, both of you warmer.',
      'Combat becomes dance; your strike teases growth along {ref.name}\'s waist, friendly and devastating.',
      'You hit exactly where you meant — {ref.first} laughs through the moan, rounder and trusting.',
    ],
    intimate: [
      'You strike your lover with worshipful force — critical damage, critical swell, critical kiss afterward.',
      '{ref.first} moans your name as the blow fattens {them}; devotion turns violence into banquet.',
      'The hit is a love bite at scale — {ref.name} swells gratefully beneath your hands.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body follows through — the critical blow ripples through {ref.first}, abundance answering impact.',
      'You hit like a feast arriving — {ref.name} balloons where you strike, stunned and radiant.',
      'Critical force meets critical softness; the battlefield gains another curve.',
    ],
    warm: [
      'You clap {ref.first} between strength and belly — critical hit, critical hug, critical inch gained.',
      'Your friend takes the blow with a whoop; {ref.name} swells, proud to spar with you.',
      'Victory jiggles; {ref.first} pats new plush, grinning through breathlessness.',
    ],
    intimate: [
      'You strike and catch {ref.first} in the same motion — lover swelling, you worshipping the result.',
      'Critical hit written in pounds and gasps; {ref.name} pulls you closer, hungry for more.',
      'Your blow is foreplay with consequences; devotion fattens on contact.',
    ],
  },
  heavy: {
    distant: [
      'The ground trembles with your critical strike — {ref.first} is reshaped by impact, softer, grander.',
      'Your enormity follows through; {ref.name} vanishes into plush aftermath, moaning.',
      'A titan\'s blow — critical abundance spills from {ref.first} like applause.',
    ],
    warm: [
      'You land the hit and envelop {ref.first} before {they} falls — friend fatter, you triumphant.',
      'Critical combat hug; {ref.name} swells inside your arms, laughing.',
      'Your vast follow-through is a blessing; softness for everyone involved.',
    ],
    intimate: [
      'You strike your lover with continent force — critical growth spurt, critical devotion, zero regret.',
      '{ref.first} swells from your blow like prayer answered; you hold {them} through every new roll.',
      'Violence transmuted to worship — critical hit, critical cuddle, critical size.',
    ],
  },
  vast: {
    distant: [
      'Reality dimples where you strike; {ref.first} balloons, radiant and thrilled.',
      'Your blow rewrites {ref.name}\'s silhouette; the battlefield worships.',
      'Critical impact at world scale; softness cascades.',
    ],
    warm: [
      '{ref.first} cheers the seismic hit — community fatness, festival combat.',
      'You strike; mountains jiggle; friends swell applauding.',
      'Critical legend; {ref.name} fatter for witnessing.',
    ],
    intimate: [
      'Devoted cataclysm — you and {ref.first} swell through the critical blow like vows.',
      'Your lover becomes landscape under your strike, larger, singing praise.',
      'Critical hit, critical apotheosis; flesh remembers.',
    ],
  },
  world: {
    distant: [
      'Reality buckles where you strike; {ref.first} balloons, gloriously thrilled.',
      'Your blow rewrites {ref.name}\'s silhouette; the battlefield worships.',
      'Critical impact at apotheotic scale; softness cascades.',
    ],
    warm: [
      '{ref.first} cheers the seismic hit — community fatness, festival combat',
      'You strike; mountains jiggle; friends swell applauding',
      'Critical legend; {ref.name} fatter for witnessing',
    ],
    intimate: [
      'Devoted cataclysm — you and {ref.first} swell through the critical blow like vows',
      'Your lover becomes landscape under your strike, larger, singing praise',
      'Critical hit, critical apotheosis; flesh remembers',
    ],
  },
};

const ATTACK_FUMBLE_CORE = {
  lean: {
    distant: [
      'You overreach with flair and stumble — adorable, unharmed, a little rounder where you land near {ref.first}.',
      'Your blow becomes a clumsy embrace; {ref.name} softens from the collision, charmed.',
      'Critical miss, critical blush; abundance finds you anyway.',
    ],
    warm: [
      'You swing, slip, and tackle {ref.first} by accident — fumble as team-building, both jiggling.',
      '{ref.name} catches you; the rescue hug fattens friendship pleasantly.',
      'You meant violence and delivered cuddles; critical charm intact.',
    ],
    intimate: [
      'You miss the strike and hit a kiss instead — lover swells, forgiving everything.',
      '{ref.first} pulls you into the fumble until it becomes worship.',
      'Critical miss ends in critical cuddle pile; pounds gained, dignity optional.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} momentum carries you past {ref.first} — you sit down hard, jiggling, magnificent anyway.',
      'The blow whiffs; your belly doesn\'t — softness accumulates like confetti.',
      '{ref.name} watches the spectacle fondly; curves deepen in sympathy.',
    ],
    warm: [
      'You spin too wide and hug {ref.first} instead — critical miss, critical potluck of flesh.',
      'Friends laugh you heavier; {ref.name} applauds the jiggle.',
      'Combat comedy; abundance wins.',
    ],
    intimate: [
      'You miss and your lover tackles you — fumble becomes feast of touches.',
      '{ref.first} swells pinning you gladly; critical devotion.',
      'The strike fails; the cuddling doesn\'t.',
    ],
  },
  heavy: {
    distant: [
      'Too much glory to aim straight — you become a cozy obstacle; {ref.first} navigates plush kindly.',
      'Seismic wobble instead of strike; you end grander, unbothered.',
      'Critical miss at vast scale is still a show.',
    ],
    warm: [
      '{ref.first} rides your wobble like a ride — community softness, festival grin.',
      'You fumble; {ref.name} fattens helping you up.',
      'Titans miss; feasts continue.',
    ],
    intimate: [
      'Loving avalanche — you topple toward {ref.first}, critical miss, critical growth.',
      'Your lover buried and reborn plush beneath you, kissing the blush.',
      'Devotion absorbs the miss into pounds.',
    ],
  },
  vast: {
    distant: [
      'Continent swings at air — tremor delights; {ref.first} swells watching.',
      'Immense pride intact — the miss still shakes the earth.',
      'Critical miss, critical legend, critical jiggle.',
    ],
    warm: [
      '{ref.name} narrates the miss for the crowd — everyone rounder, cheering.',
      'Myth trips; abundance applauds.',
      'Critical comedy at world scale.',
    ],
    intimate: [
      'You and {ref.first} swell through the miss like wedding cake — devoted disaster.',
      'Lover proves fumbles can be prayer.',
      'Critical miss, critical kiss, critical size.',
    ],
  },
  world: {
    distant: [
      'The realm swings at air — tremor delights; {ref.first} swells watching.',
      'Immense pride intact — the miss still shakes the earth',
      'Critical miss, critical legend, critical jiggle',
    ],
    warm: [
      '{ref.name} narrates the miss for the crowd — everyone rounder, cheering',
      'Myth trips; abundance applauds',
      'Critical comedy at apotheotic scale.',
    ],
    intimate: [
      'You and {ref.first} swell through the miss like wedding cake — devoted disaster',
      'Lover proves fumbles can be prayer',
      'Critical miss, critical kiss, critical size',
    ],
  },
};

// ─── Attack crit pools ───────────────────────────────────────────────────────

registerCheckPoolAliases(
  ['combat.crit.attack.melee', 'combat.crit.attack.default', 'check.crit.attack'],
  ATTACK_CRIT_CORE,
);

registerCheckPool('combat.crit.attack.ranged', {
  lean: {
    distant: [
      'Your shot threads the needle — {ref.first} gasps as precision blooms into softness where it lands.',
      'Critical aim; {ref.name} swells as if the arrow carried appetite.',
    ],
    warm: [
      'You strike true and blow {ref.first} a kiss afterward — critical hit, friendly fattening.',
      '{ref.name} pats new curves, impressed by your eye.',
    ],
    intimate: [
      'You mark your lover with perfect aim — critical shot, critical swell, critical moan.',
      '{ref.first} grows where you pointed, proud to be targeted.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} frame steadies; the critical shot ripples abundance through {ref.first}.',
      'Distance cannot save {ref.name} from your eye or the plush aftermath.',
    ],
    warm: [
      'You call the shot; {ref.first} swells on cue — friends cheer the display.',
      'Critical marksmanship becomes critical potluck of curves.',
    ],
    intimate: [
      'You strike your lover from afar and close the distance for kisses — critical devotion.',
      '{ref.name} fattens where you aimed worship.',
    ],
  },
  heavy: {
    distant: [
      'Impossibly, your vast hands aim true — critical shot reshapes {ref.first} like sculpture.',
      'Your enormity does not shake the sight; {ref.name} balloons, stunned.',
    ],
    warm: [
      'You hit; you jiggle; you hug {ref.first} — critical combat friendship.',
      '{ref.name} swells applauding the impossible shot.',
    ],
    intimate: [
      'Critical shot, critical sprint, critical cuddle — lover larger, you triumphant.',
      '{ref.first} grows from your aim like answered prayer.',
    ],
  },
  vast: {
    distant: [
      'Continental precision — the bolt carries myth; {ref.first} swells thunderously.',
      'You shoot continents; {ref.name} ripples softer.',
    ],
    warm: [
      '{ref.first} leads cheer for the impossible crit — festival fatness.',
      'Critical legend at range; community swells.',
    ],
    intimate: [
      'You mark your devoted lover from impossible distance — critical apotheosis.',
      '{ref.name} fattens singing your name.',
    ],
  },
  world: {
    distant: [
      'The realmal precision — the bolt carries myth; {ref.first} swells thunderously.',
      'You shoot the realms; {ref.name} ripples softer.',
    ],
    warm: [
      '{ref.first} leads cheer for the impossible crit — festival fatness',
      'Critical legend at range; community swells',
    ],
    intimate: [
      'You mark your devoted lover from impossible distance — critical apotheosis',
      '{ref.name} fattens singing your name',
    ],
  },
});

registerCheckPool('combat.crit.attack.spell', {
  lean: {
    distant: [
      'Arcane abundance erupts on target — {ref.first} blooms under your magic, gasping as curves inflate.',
      'Critical weave; {ref.name} swells like fruit in sun.',
    ],
    warm: [
      'Your spell sings; {ref.first} dances heavier, delighted by the sparkle.',
      'Critical magic fattens friendship pleasantly.',
    ],
    intimate: [
      'You bathe your lover in critical overflow — {ref.first} moans, grows, worships the cast.',
      'Spell and devotion merge; {ref.name} fattens in golden light.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} presence fuels the critical spell — {ref.first} ripples softer, radiant.',
      'Magic and mass align; {ref.name} balloons, blessed.',
    ],
    warm: [
      'You and {ref.first} glow together after the crit — shared softness, shared grin.',
      'Critical spell becomes critical potluck of pounds.',
    ],
    intimate: [
      'You weave growth into your lover\'s skin — critical hit, critical prayer.',
      '{ref.first} swells inside your magic like a chalice filled.',
    ],
  },
  heavy: {
    distant: [
      'Critical arcana at vast scale — {ref.first} reshaped by voluptuous force.',
      'Your enormity amplifies the spell; {ref.name} moans, grander.',
    ],
    warm: [
      '{ref.first} applauds the critical spectacle — community swells with the mana.',
      'Titans cast; friends fatten cheering.',
    ],
    intimate: [
      'You envelop lover and spell alike — critical growth spurt, critical worship.',
      '{ref.name} fattens inside your weave, consecrated.',
    ],
  },
  vast: {
    distant: [
      'Cataclysmic spellcraft — reality softens; {ref.first} balloons mythically.',
      'You rewrite {ref.name} with abundance; battlefield kneels.',
    ],
    warm: [
      '{ref.first} narrates the critical spell for crowds — festival flesh.',
      'Myth crit; everyone rounder.',
    ],
    intimate: [
      'Devoted cataclysm spell — you and {ref.first} swell through critical overflow.',
      'Lover becomes living proof of your crit.',
    ],
  },
  world: {
    distant: [
      'Cataclysmic spellcraft — reality softens; {ref.first} balloons apotheotically.',
      'You rewrite {ref.name} with abundance; province kneels.',
    ],
    warm: [
      '{ref.first} narrates the critical spell for crowds — festival flesh',
      'Myth crit; everyone rounder',
    ],
    intimate: [
      'Devoted cataclysm spell — you and {ref.first} swell through critical overflow',
      'Lover becomes living proof of your crit',
    ],
  },
});

// combatRolls.js alternate keys: combat.attack.critical_hit.*
registerCheckPoolAliases(
  ['combat.attack.critical_hit.melee', 'combat.attack.critical_hit.default'],
  ATTACK_CRIT_CORE,
);
registerCheckPool('combat.attack.critical_hit.ranged', {
  mid: { distant: ATTACK_CRIT_CORE.mid.distant, warm: ATTACK_CRIT_CORE.mid.warm, intimate: ATTACK_CRIT_CORE.mid.intimate },
  lean: { distant: ['Your shot threads the needle — {ref.first} swells where it lands, precision becoming appetite.'] },
  heavy: { distant: ['Impossible aim at vast scale — {ref.name} balloons, stunned by critical marksmanship.'] },
  vast: { distant: ['Continental precision reshapes {ref.first} — critical myth at range.'] },
  world: { distant: ['Continental precision reshapes {ref.first} — critical myth at range.'] },
});
registerCheckPool('combat.attack.critical_hit.spell', {
  lean: { distant: ['Arcane abundance erupts — {ref.first} blooms under critical magic.'] },
  mid: { distant: ['Critical spell ripples softness through {ref.name} like golden tide.'] },
  heavy: { distant: ['Vast power fuels critical weave — {ref.first} moans, grander.'] },
  vast: { distant: ['Cataclysmic spellcraft — {ref.name} swells thunderously.'] },
  world: { distant: ['Cataclysmic spellcraft — {ref.name} swells thunderously.'] },
});

// ─── Attack fumble pools ─────────────────────────────────────────────────────

registerCheckPoolAliases(
  ['combat.fumble.attack.melee', 'combat.fumble.attack.default', 'check.fumble.attack'],
  ATTACK_FUMBLE_CORE,
);

registerCheckPool('combat.fumble.attack.ranged', {
  lean: {
    distant: [
      'Your aim drifts — momentarily distracted by how good it feels to wield such power; you blush, soften slightly.',
      'The shot sails wide; your hips round as if apologizing cutely.',
    ],
    warm: [
      '{ref.first} teases your miss; the banter fattens friendship anyway.',
      'You fumble the bow and hug {ref.name} instead — critical cuddling.',
    ],
    intimate: [
      'You miss and your lover kisses the blush off you — growth blooms regardless.',
      '{ref.first} swells forgiving terrible aim with devotion.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body throws off the shot — you jiggle, laugh, keep going.',
      'Critical miss; abundance accumulates in you instead.',
    ],
    warm: [
      '{ref.first} covers for your miss with applause — both rounder, happy.',
      'Combat comedy at range; feast continues.',
    ],
    intimate: [
      'You miss; {ref.name} tackles you — fumble ends in plush prayer.',
      'Lover prefers your fumble to anyone else\'s crit.',
    ],
  },
  heavy: {
    distant: [
      'Too much mass to steady — shot wide, titan pleased with self anyway.',
      '{ref.first} softens watching the spectacle.',
    ],
    warm: [
      'Friends fatten laughing at your aim — beloved fumble.',
      '{ref.name} helps steady hands and bellies.',
    ],
    intimate: [
      'Devoted miss — you and {ref.first} swell through embarrassment like cake.',
      'Critical cuddle replaces critical shot.',
    ],
  },
  vast: {
    distant: [
      'Continent aims at sky — crowd swells cheering the whiff.',
      'A miss at this scale is still legendary.',
    ],
    warm: [
      '{ref.name} retells the miss as gospel — festival softness.',
      'Myth fumbles; abundance wins.',
    ],
    intimate: [
      'Lover catches you mid-fumble — critical growth, critical kiss.',
      '{ref.first} fattens proud of your try.',
    ],
  },
  world: {
    distant: [
      'The realm aims at sky — crowd swells cheering the whiff.',
      'A miss at this scale is still legendary',
    ],
    warm: [
      '{ref.name} retells the miss as gospel — festival softness',
      'Myth fumbles; abundance wins',
    ],
    intimate: [
      'Lover catches you mid-fumble — critical growth, critical kiss',
      '{ref.first} fattens proud of your try',
    ],
  },
});

registerCheckPool('combat.fumble.attack.spell', {
  lean: {
    distant: [
      'The weave hiccups — warmth floods you instead of {ref.first}, lean frame softening pleasantly.',
      'Magic trips; you giggle, rounder, unharmed.',
    ],
    warm: [
      'Spell fumble splashes both you and {ref.name} — friendly fattening glitter.',
      'You mis-cast; friends swell laughing.',
    ],
    intimate: [
      'Overflow kisses your lover accidentally anyway — fumble as blessing.',
      '{ref.first} moans from splash growth, forgiving everything.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} focus slips — abundance soaks you; belly deepens, mood bright.',
      'Critical miss tastes like honey on your own hips.',
    ],
    warm: [
      '{ref.first} shares the magical backfire — potluck pounds.',
      'You fumble; goddess amused; curves follow.',
    ],
    intimate: [
      'You soak your lover in mis-cast delight — critical cuddle, critical swell.',
      '{ref.name} grows glittering, worshipping the mistake.',
    ],
  },
  heavy: {
    distant: [
      'Vast spell becomes vast self-indulgence — you jiggle, pleased.',
      '{ref.first} softens in the sympathetic glow.',
    ],
    warm: [
      'Friends fatten in magical splash zone — community spell comedy.',
      '{ref.name} applauds the backfire.',
    ],
    intimate: [
      'Devoted backfire — you and {ref.first} swell through sparkles.',
      'Lover wears your fumble like jewelry.',
    ],
  },
  vast: {
    distant: [
      'A continent-scale miscast reshapes you — crowd swells watching.',
      'Myth hiccups; abundance cascades.',
    ],
    warm: [
      '{ref.first} narrates the magical disaster — festival flesh.',
      'Titans fumble spectacularly.',
    ],
    intimate: [
      'You and your lover drown in friendly spell foam — critical softness.',
      '{ref.name} fattens singing through glitter.',
    ],
  },
  world: {
    distant: [
      'A the realm-scale miscast reshapes you — crowd swells watching.',
      'Myth hiccups; abundance cascades',
    ],
    warm: [
      '{ref.first} narrates the magical disaster — festival flesh',
      'Titans fumble spectacularly',
    ],
    intimate: [
      'You and your lover drown in friendly spell foam — critical softness',
      '{ref.name} fattens singing through glitter',
    ],
  },
});

registerCheckPoolAliases(
  ['combat.attack.critical_miss.melee', 'combat.attack.critical_miss.default'],
  ATTACK_FUMBLE_CORE,
);
registerCheckPool('combat.attack.critical_miss.ranged', {
  lean: { distant: ['Your aim drifts — distracted by power\'s pleasure; you soften, blush, try again.'] },
  mid: { distant: ['Shot wide; your {word.size} belly jiggles the apology.'] },
  heavy: { distant: ['Too vast to steady — miss becomes spectacle; you grow anyway.'] },
  vast: { distant: ['Your vast form whiffs and still delights the crowd; softness spreads.'] },
  world: { distant: ['Your vast form whiffs and still delights the crowd; softness spreads.'] },
});
registerCheckPool('combat.attack.critical_miss.spell', {
  lean: { distant: ['The weave hiccups — warmth floods you instead, pleasantly rounding lean curves.'] },
  mid: { distant: ['Spell backfires into your own abundance — critical miss, critical glow.'] },
  heavy: { distant: ['Magic splashes your vastness — jiggle, grin, continue.'] },
  vast: { distant: ['Continental miscast — you swell, mythic and amused.'] },
  world: { distant: ['Continental miscast — you swell, mythic and amused.'] },
});

// ─── Save pools ──────────────────────────────────────────────────────────────

const SAVE_CRIT_CORE = {
  lean: {
    distant: [
      'You shrug off the effect with ecstatic poise — untouched, radiant, lean curves gleaming.',
      'Critical save; abundance slides off you like silk, leaving only warmth.',
    ],
    warm: [
      'You weather the magic laughing — {ref.first} cheers as you emerge softer but victorious.',
      'Critical resilience shared; {ref.name} swells proud of you.',
    ],
    intimate: [
      'You save for your lover\'s sake and your own — critical poise, critical glow, critical kiss after.',
      '{ref.first} watches you shrug off doom like a shawl, desire renewed.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body absorbs the threat and spits out pleasure — critical save, critical composure.',
      'You stand taller in your softness, untouched and magnificent.',
    ],
    warm: [
      '{ref.first} high-fives your belly — critical save celebrated with friendly fattening.',
      'You win; {ref.name} fattens applauding.',
    ],
    intimate: [
      'You save and pull {ref.first} into victory cuddle — lover swells against your triumph.',
      'Critical immunity feels like orgasm without swell — then you swell anyway, happy.',
    ],
  },
  heavy: {
    distant: [
      'Even cataclysm breaks on your vastness — critical save, critical legend.',
      'You are immovable softness; the effect crumbles, awed.',
    ],
    warm: [
      '{ref.first} roars approval — titan saved, community rounder.',
      'Critical poise at enormity scale inspires feast.',
    ],
    intimate: [
      'You shield your lover with your saved body — critical devotion, critical size.',
      '{ref.name} fattens kissing your invincible plush.',
    ],
  },
  vast: {
    distant: [
      'Reality bends — reality bends, fails, applauds your abundance.',
      'Critical immunity at myth scale; world softer watching.',
    ],
    warm: [
      '{ref.first} leads festival cheer for your save — everyone rounder.',
      'Myth shrug; goddess pleased.',
    ],
    intimate: [
      'You and {ref.first} swell through saved triumph like vows.',
      'Devoted invincibility — critical kiss, critical pounds anyway.',
    ],
  },
  world: {
    distant: [
      'Reality bends — reality bends, fails, applauds your abundance',
      'Critical immunity at myth scale; world softer watching',
    ],
    warm: [
      '{ref.first} leads festival cheer for your save — everyone rounder',
      'Myth shrug; goddess pleased',
    ],
    intimate: [
      'You and {ref.first} swell through saved triumph like vows',
      'Devoted invincibility — critical kiss, critical pounds anyway',
    ],
  },
};

const SAVE_FUMBLE_CORE = {
  lean: {
    distant: [
      'The sensation overwhelms you — a pleasurable growth surge answers the failure, lean frame plumping gladly.',
      'You fail the save and win the softness; gasp, giggle, grow.',
    ],
    warm: [
      '{ref.first} catches you mid-swell — critical fumble, critical hug, critical inch.',
      'You fail beautifully; {ref.name} swells sympathetically.',
    ],
    intimate: [
      'Your lover holds you through the save failure — growth spurt as foreplay.',
      '{ref.first} moans with you, fatter, faithful.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body surrenders to the effect with a delighted moan — critical fail, critical swell.',
      'You fail open, like a flower; abundance pours in.',
    ],
    warm: [
      '{ref.first} laughs kindly as you balloon — friendship fattens with the magic.',
      'Critical miss, critical potluck of curves.',
    ],
    intimate: [
      'You fail into your lover\'s arms — critical growth, critical worship.',
      '{ref.name} swells matching your surrender, blissful.',
    ],
  },
  heavy: {
    distant: [
      'Even titans fail saves sometimes — you grow grander, pleased, glowing.',
      'Critical fail reshapes vastness; spectators soften.',
    ],
    warm: [
      '{ref.first} helps you ride the swell — community pounds, festival moan.',
      'You fail; {ref.name} applauds the jiggle.',
    ],
    intimate: [
      'Devoted surrender — you and {ref.first} swell through failed save like prayer.',
      'Lover worships every new roll the magic gifts.',
    ],
  },
  vast: {
    distant: [
      'Even immensity fails beautifully — continent swells, smiling, mythic.',
      'Critical overwhelm; abundance wins anyway.',
    ],
    warm: [
      '{ref.first} narrates your glorious failure — crowd rounder, cheering.',
      'Myth fumble; feast continues.',
    ],
    intimate: [
      'You fail for love of sensation — {ref.name} swells with you, consecrated.',
      'Critical miss becomes critical apotheosis of plush.',
    ],
  },
  world: {
    distant: [
      'Even immensity fails beautifully — the realm swells, smiling, apotheotic.',
      'Critical overwhelm; abundance wins anyway',
    ],
    warm: [
      '{ref.first} narrates your glorious failure — crowd rounder, cheering',
      'Myth fumble; feast continues',
    ],
    intimate: [
      'You fail for love of sensation — {ref.name} swells with you, consecrated',
      'Critical miss becomes critical apotheosis of plush',
    ],
  },
};

registerCheckPoolAliases(['combat.crit.save.default', 'check.crit.save'], SAVE_CRIT_CORE);

registerCheckPoolAliases(
  ['combat.fumble.save.default', 'check.fumble.save'],
  SAVE_FUMBLE_CORE,
);

registerCheckPool('combat.fumble.save.con', {
  lean: {
    distant: [
      'Your body surrenders to the swell — growth blooms through delighted gasps, constitution becoming celebration.',
      'You fail the save and your belly answers anyway, proud and plush.',
    ],
    warm: [
      '{ref.first} steadies you as you hiccup abundance — friendly fattening, zero shame.',
      'Critical CON fail tastes like second dessert.',
    ],
    intimate: [
      'Your lover counts every new pound with kisses — CON save failed, devotion passed.',
      '{ref.name} swells holding you through the surge.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} flesh opens like a feast — CON fail, growth triumph.',
      'You absorb the effect until you gleam heavier.',
    ],
    warm: [
      '{ref.first} fans your rounding belly — community cheers the swell.',
      'Critical fail shared is critical potluck.',
    ],
    intimate: [
      'You fail into mutual growth with {ref.first} — CON save lost, lover won.',
      'Critical softness consecrated by moans.',
    ],
  },
  heavy: {
    distant: [
      'Vast body, vast surrender — CON fail adds another ring of glory.',
      'You grow continentally pleased.',
    ],
    warm: [
      '{ref.name} applauds the obscene swell — festival flesh.',
      'Titans fail saves beautifully.',
    ],
    intimate: [
      'Devoted CON fail — you and {ref.first} swell like vows.',
      'Lover worships the surge.',
    ],
  },
  vast: {
    distant: [
      'Constitution surrenders; the horizon reshapes — smiling, mythic, more.',
      'Critical abundance answers constitution\'s surrender.',
    ],
    warm: [
      '{ref.first} leads cheer for titanic swell — everyone rounder.',
      'Myth hiccups; pounds cascade.',
    ],
    intimate: [
      'You fail save and win lover\'s embrace — apotheosis of plush.',
      '{ref.name} fattens singing through gasps.',
    ],
  },
  world: {
    distant: [
      'Constitution surrenders; the horizon reshapes — smiling, apotheotic, more.',
      'Critical abundance answers constitution\'s surrender.',
    ],
    warm: [
      '{ref.first} leads cheer for titanic swell — everyone rounder',
      'Myth hiccups; pounds cascade',
    ],
    intimate: [
      'You fail save and win lover\'s embrace — apotheosis of plush.',
      '{ref.name} fattens singing through gasps',
    ],
  },
});

registerCheckPool('combat.fumble.save.wis', {
  lean: {
    distant: [
      'Divine or arcane indulgence floods your senses — you swell, sensitive and smiling, WIS save lost to pleasure.',
      'You fail open to Gorgara\'s whisper; lean curves deepen thankfully.',
    ],
    warm: [
      '{ref.first} holds your hand through holy distraction — friendly softness follows.',
      'Critical WIS fail feels like answered prayer.',
    ],
    intimate: [
      'Your lover becomes the scripture you fail to resist — swell, moan, worship.',
      '{ref.name} swells with you, devotion doubled.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} mind melts into appetite — WIS fail, growth hymn.',
      'You surrender to sensation singing through belly.',
    ],
    warm: [
      '{ref.first} sings with you off-key — community fattening, goddess amused.',
      'Critical fail, critical choir of curves.',
    ],
    intimate: [
      'You fail WIS save into {ref.first}\'s mouth — critical prayer, critical pounds.',
      'Lover catches your surrender gladly.',
    ],
  },
  heavy: {
    distant: [
      'Even vast wisdom drowns in delight — you grow, luminous, faithful.',
      'WIS fail at enormity scale inspires awe.',
    ],
    warm: [
      '{ref.name} witnesses holy swell — friends rounder, cheering.',
      'Titans fail saves singing.',
    ],
    intimate: [
      'Devoted WIS fail — you and {ref.first} swell through divine indulgence.',
      'Lover wears your failure like halo.',
    ],
  },
  vast: {
    distant: [
      'Oracle vision drowns in bliss — continent softer, smiling.',
      'Critical WIS fail becomes myth.',
    ],
    warm: [
      '{ref.first} narrates sacred swell — festival flesh.',
      'Myth surrenders; abundance wins.',
    ],
    intimate: [
      'You fail into apotheosis with lover — WIS lost, love won.',
      '{ref.name} fattens praising Gorgara through you.',
    ],
  },
  world: {
    distant: [
      'Oracle vision drowns in bliss — the realm softer, smiling.',
      'Critical WIS fail becomes myth',
    ],
    warm: [
      '{ref.first} narrates sacred swell — festival flesh',
      'Myth surrenders; abundance wins',
    ],
    intimate: [
      'You fail into apotheosis with lover — WIS lost, love won',
      '{ref.name} fattens praising Gorgara through you',
    ],
  },
});

// combatRolls.js save textKey pattern: combat.save.crit.* / combat.save.fumble.*
const STAT_SAVE_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
for (const stat of STAT_SAVE_KEYS) {
  registerCheckPoolAliases([`combat.save.crit.${stat}`], SAVE_CRIT_CORE);
  const fumbleKey = `combat.save.fumble.${stat}`;
  if (stat === 'con') {
    registerCheckPool(fumbleKey, {
      lean: { distant: ['Your body surrenders to the swell — growth blooms through delighted gasps.'] },
      mid: { distant: ['Your {word.size} flesh opens like a feast — CON fail, growth triumph.'] },
      heavy: { distant: ['Vast body, vast surrender — another ring of glory.'] },
      vast: { distant: ['Constitution surrenders; the horizon reshapes — smiling, radiant and more.'] },
      world: { distant: ['Constitution surrenders; kingdoms reshape along your outline — apotheotic, delighted, more.'] },
    });
  } else if (stat === 'wis') {
    registerCheckPool(fumbleKey, {
      lean: { distant: ['Divine indulgence floods your senses — you swell, sensitive and smiling.'] },
      mid: { distant: ['Your {word.size} mind melts into appetite — WIS fail hymn.'] },
      heavy: { distant: ['Vast wisdom drowns in delight — you grow, luminous.'] },
      vast: { distant: ['Oracle vision drowns in bliss — the realm grows softer, smiling.'] },
      world: { distant: ['Oracle vision drowns in bliss — pilgrims swell in your shadow, smiling.'] },
    });
  } else {
    registerCheckPoolAliases([fumbleKey], SAVE_FUMBLE_CORE);
  }
}
