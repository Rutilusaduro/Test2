/**
 * Critical failure (fumble) prose for named skills.
 * Shape: FULL SENTENCE — playful, endearing, abundance-friendly.
 */
import { registerCheckPool } from './helpers.js';

registerCheckPool('check.fumble.seduce', {
  lean: {
    distant: [
      'You flirt too hard and blush at your own boldness — {ref.first} finds it adorable, softening toward you anyway.',
      'Your charm trips over your tongue; the stumble is endearing, hips rounding as if pleased.',
    ],
    warm: [
      '{ref.first} laughs at the wrong moment and likes you more — friendship fattens, appetite stirred.',
      'You get flustered mid-compliment; {ref.name} finishes it for you, both of you rounder.',
    ],
    intimate: [
      'You try to seduce and accidentally confess something darling — {ref.first} swells kissing you anyway.',
      'Critical miss, critical honesty; your lover grows between giggles.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} confidence wobbles on a word — {ref.first} melts at the humanity, curves deepening.',
      'You dazzle, stumble, jiggle; abundance fills the silence pleasantly.',
    ],
    warm: [
      '{ref.first} rescues your flirtation — teamwork rounds both bellies, delight intact.',
      'You get distracted by how good you look; {ref.name} agrees, and you swell together.',
    ],
    intimate: [
      'You lose the script and improvise with kisses — fumble forgotten, flesh remembered.',
      '{ref.first} prefers the unplanned hunger in your voice; bodies answer in pounds.',
    ],
  },
  heavy: {
    distant: [
      'Your enormity speaks louder than your words — you forget the line and still win hearts while growing.',
      '{ref.first} is charmed by the spectacle of you trying; softness spreads like applause.',
    ],
    warm: [
      'Grand flirtation becomes cuddly — {ref.name} wouldn\'t trade a roll of you.',
      'Charisma comedy; friends fatten laughing.',
    ],
    intimate: [
      'Your lover hushes you with worship — fumble becomes pillow, growth becomes prayer.',
      'You meant to woo and became furniture; {ref.first} swells gratefully atop you.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan charm trips over shyness — impossible, effective; {ref.first} grows watching.',
      'You blush at your own myth; the crowd softens anyway.',
    ],
    warm: [
      '{ref.name} declares your fumble the best sermon on abundance — community swells.',
      'Titans forget lines, remember feasts.',
    ],
    intimate: [
      'Devotion deletes performance — you and {ref.first} swell through the mistake like cake.',
      'Your lover proves charisma was never only words.',
    ],
  },
});

registerCheckPool('check.fumble.overwhelm', {
  lean: {
    distant: [
      'You lunge with heart and misjudge the grip — tumble into {ref.first}, both softer for the collision.',
      'Overwhelm becomes hug; {ref.name} catches you, curves rounding kindly.',
    ],
    warm: [
      'You try to tackle {ref.first} and wobble together — friendship fattens on the floor, laughing.',
      'Critical miss, critical cuddle; {ref.name} loves the try.',
    ],
    intimate: [
      'You sweep {ref.first} up and sit down hard together — lovers plush, pleased, growing.',
      'Your grand grapple collapses into kisses; fumble as foreplay.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} mass moves too soon — you jiggle, blush, and somehow look magnificent.',
      'You meant dominance and delivered a wobble; {ref.first} fans {them}self fondly.',
    ],
    warm: [
      '{ref.first} steadies your glorious trip — rescue hug leaves both heavier.',
      'You overreach; {ref.name} applauds the jiggle.',
    ],
    intimate: [
      'You try to pin your lover and discover new softness — struggle fattens devotion.',
      'Critical miss ends in a heap of worship and pounds.',
    ],
  },
  heavy: {
    distant: [
      'The floor welcomes you early — landslide cuddle, zero shame, little extra you.',
      '{ref.first} helps a titan up; both rounder for the effort.',
    ],
    warm: [
      'You become a cozy obstacle instead of a conqueror — friends laugh, flesh accumulates.',
      'Too much glory to aim straight; {ref.name} doesn\'t mind.',
    ],
    intimate: [
      'Loving avalanche — you topple over {ref.first}, critical failure, critical softness.',
      'Your lover resurfaces beneath you, kissing the blush on vast cheek.',
    ],
  },
  extreme: {
    distant: [
      'Continent missteps — seismic wobble, grander aftermath; {ref.first} cheers.',
      'Physics fumbles; abundance wins.',
    ],
    warm: [
      '{ref.name} rides the wobble like a festival — community growth.',
      'Leviathan clumsiness beloved.',
    ],
    intimate: [
      'Devotion absorbs the fall — you and {ref.first} swell giggling in ruin.',
      'Critical miss written in plush prayer.',
    ],
  },
});

registerCheckPool('check.fumble.endure_growth', {
  lean: {
    distant: [
      'The swell hits too fast — you gasp, giggle, and soften all at once, delighted anyway.',
      'You meant to pace and failed beautifully; lean frame plumps in a hiccup.',
    ],
    warm: [
      '{ref.first} holds your hair while you ride the wave too eagerly — rounder after, no regrets.',
      'You overindulge sensation with {ref.name} watching; shared softness.',
    ],
    intimate: [
      'Growth outruns composure — {ref.first} catches you, loves the extra you.',
      'Critical miss, critical swell; lover swells sympathetically.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} belly surges before you\'re ready — stuffed sigh, proud pat.',
      'Endurance becomes premature celebration; you keep going anyway.',
    ],
    warm: [
      '{ref.first} fans you while you balloon pleasantly — too much joy at once.',
      'You misjudge the portion; both rounder, smiling.',
    ],
    intimate: [
      'Your lover watches you lose the race against hunger — gorgeous failure.',
      '{ref.first} joins the surge, fumble as worship.',
    ],
  },
  heavy: {
    distant: [
      'Even vast resilience giggles — swell bowls you softly, another layer of glory.',
      'You absorb too much at once and become more landscape, pleased.',
    ],
    warm: [
      '{ref.first} steadies your mountain as it grows eagerly — shared inches.',
      'Abundance hiccup; applause for jiggle.',
    ],
    intimate: [
      'You swell past your plan — lover clings, worships every roll.',
      'Critical miss means critical fullness for both.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan appetite outpaces poise — one sloppy splendid wave, prouder after.',
      'Goddess pours fast; you catch what you can.',
    ],
    warm: [
      '{ref.name} cheers obscene haste of swelling — festival fatness.',
      'More continent than composure; beloved anyway.',
    ],
    intimate: [
      'Devotion and digestion collide — messy mutual swell, laughing moans.',
      'Critical fumble, critical feast beneath you.',
    ],
  },
});

registerCheckPool('check.fumble.indulge', {
  lean: {
    distant: [
      'You overindulge too quickly — a happy stuffed sigh escapes as lean curves plump further.',
      'The feast wins the race; you blush, pat belly, keep smiling.',
    ],
    warm: [
      '{ref.first} steals a bite of your shameless joy — both rounder, crumbs everywhere.',
      'You meant pacing; {ref.name} meant celebration; celebration wins.',
    ],
    intimate: [
      'You feed each other past the point of dignity — lover moans, fumble as sacrament.',
      'Critical miss tastes like frosting; {ref.first} swells grateful.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} appetite hiccups — you double down, jiggling, victorious in spirit.',
      'Too much too soon; belly thanks you anyway.',
    ],
    warm: [
      'You and {ref.first} demolish dessert before the main — friendship fattens, zero regret.',
      'Indulgence comedy; {ref.name} applauds burp and all.',
    ],
    intimate: [
      'Your lover encourages the fumble — critical miss becomes critical second helping.',
      '{ref.first} swells feeding you feeding {them}.',
    ],
  },
  heavy: {
    distant: [
      'You attempt restraint at vast scale and fail adorably — more you, more feast.',
      'Critical gluttony hiccup; spectators soften.',
    ],
    warm: [
      '{ref.name} tries to help pace you and also fails — shared grandness.',
      'Titans and pastries; friends rounder.',
    ],
    intimate: [
      'Devoted overeating — you and {ref.first} swell through charming excess.',
      'Lover wears cream and new curves proudly.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan tries one bite, achieves legend — fumble as folklore.',
      'The banquet surrenders; you jiggle, pleased.',
    ],
    warm: [
      '{ref.first} narrates the spectacle for the crowd — community swells cheering.',
      'Critical miss, critical myth, critical crumbs.',
    ],
    intimate: [
      'You and your devoted lover drown in dessert — apotheosis of happy failure.',
      '{ref.first} swells inside your indulgence anyway.',
    ],
  },
});

registerCheckPool('check.fumble.persuade', {
  lean: {
    distant: [
      'You stumble over your words, flustered and endearing — {ref.first} softens listening anyway.',
      'The sermon trips; honesty rounds your hips, charm intact.',
    ],
    warm: [
      '{ref.first} finishes your sentence and steals your dessert — friendship fattens.',
      'You lose the thread; {ref.name} likes the real you better.',
    ],
    intimate: [
      'You try to preach and kiss instead — lover converts via lips, fumble forgiven.',
      'Critical miss, critical confession; {ref.first} swells saying yes.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} rhetoric hiccups — abundance fills the pause pleasantly.',
      'You convince yourself mid-speech; {ref.first} giggles, curves follow.',
    ],
    warm: [
      'You and {ref.name} forget the point and remember the pantry — rounder truths.',
      'Persuasion becomes potluck; everyone wins pounds.',
    ],
    intimate: [
      'Your lover hushes your argument with hands — growth replaces thesis.',
      '{ref.first} bodies agreement before words return.',
    ],
  },
  heavy: {
    distant: [
      'Even titans tongue-tie — you jiggle through it, magnificent, persuasive by accident.',
      '{ref.first} persuaded by spectacle more than syntax.',
    ],
    warm: [
      'Friends translate your fumble into feast — community softness.',
      'Critical miss, critical potluck sermon.',
    ],
    intimate: [
      'Devotion outtalks eloquence — swell replaces speech.',
      '{ref.first} grows nodding at your blush.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan oratory collapses into burp — crowd swells applauding.',
      'Words fail; abundance speaks; {ref.first} converts anyway.',
    ],
    warm: [
      '{ref.name} retells the fumble as gospel — festival fatness.',
      'Myth stumbles; feast continues.',
    ],
    intimate: [
      'You and {ref.first} persuade each other with mouths full — critical cuddling.',
      'Lover prefers your stumble to any sermon.',
    ],
  },
});

registerCheckPool('check.fumble.default', {
  lean: {
    distant: [
      'A charming misstep on the road to greater abundance — you blush, soften, carry on gloriously.',
      'Fortune trips you kindly; lean curves catch the fall.',
    ],
    warm: [
      '{ref.first} laughs with you, not at you — friendship rounds both bellies.',
      'Critical fumble, critical grace; {ref.name} steadies your glow.',
    ],
    intimate: [
      'Your lover kisses the mistake off your mouth — growth blooms anyway.',
      'Devotion turns misstep into cuddle; pounds follow.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} excellence wobbles — jiggle, grin, continue.',
      'Abundance loves a fumble; softness accumulates like confetti.',
    ],
    warm: [
      'You miss perfectly; {ref.first} hugs you heavier for trying.',
      'Shared fumble, shared dessert, shared curves.',
    ],
    intimate: [
      'Critical miss ends in critical cuddle — {ref.name} swells proud of you.',
      'Lover wears your failure like jewelry.',
    ],
  },
  heavy: {
    distant: [
      'Even mountains stumble — you settle plush, pleased, grander.',
      '{ref.first} applauds the seismic charm of trying.',
    ],
    warm: [
      'Friends fatten laughing you up — community love.',
      'Titans fumble; feasts continue.',
    ],
    intimate: [
      'Devoted disaster — you and {ref.first} swell through the mistake.',
      'Your lover proves fumbles can be worship.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan luck hiccups — reality softens to cushion you; {ref.first} grows watching.',
      'Critical miss at myth scale still tastes sweet.',
    ],
    warm: [
      '{ref.name} leads cheer for beautiful failure — everyone rounder.',
      'Abundance applauds the try.',
    ],
    intimate: [
      'Destiny trips; devotion catches — critical growth, critical kiss.',
      '{ref.first} fattens celebrating your humanity.',
    ],
  },
});
