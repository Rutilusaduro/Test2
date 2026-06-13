/**
 * Critical failure (fumble) prose for raw ability checks — keyed by stat.
 * Shape: FULL SENTENCE — playful, never shaming; growth is still a gift.
 */
import { registerCheckPoolAliases } from './helpers.js';

// ─── Strength ────────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.strength', 'check.fumble.str'], {
  lean: {
    distant: [
      'You put a little too much into it and stumble adorably — {ref.first} catches you, and the collision leaves you both a touch softer.',
      'Your enthusiasm outruns your frame; you wobble, blush, and swell pleasantly where you land against {ref.name}.',
    ],
    warm: [
      'You try to impress {ref.first} and overcommit — a hug turns into a tumble, laughter, and a shared little growth spurt.',
      'Strength becomes slapstick: you scoop {ref.name} up, slip, and end up rounder together on the floor, giggling.',
    ],
    intimate: [
      'You sweep {ref.first} off {their} feet and promptly follow — lovers in a plush heap, bodies tingling fuller for the fumble.',
      'Your grand gesture collapses into cuddles; {ref.name} kisses you atop the softness you accidentally earned.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} momentum carries you past the mark — you sit down hard, jiggling, and {ref.first} stares with fond disbelief.',
      'You meant dominance and delivered a wobble; your belly bounces, you blush, and somehow you still look magnificent.',
    ],
    warm: [
      '{ref.first} steadies you when your own curves betray you — the rescue hug leaves both of you heavier, happy.',
      'You overreach with glorious mass and {ref.name} laughs kindly as you swell, stuck and pleased.',
    ],
    intimate: [
      'You try to lift your lover and discover you\'ve grown again — {ref.first} swells against you in the struggle, delighted.',
      'The pin becomes a cuddle pile; critical failure, critical softness, critical kisses.',
    ],
  },
  heavy: {
    distant: [
      'The floor welcomes your enormity a beat early — you settle like a landslide, plush and unharmed, while {ref.first} fans {them}self.',
      'You meant to loom and instead became a cozy obstacle; a little extra softness is the only price.',
    ],
    warm: [
      '{ref.first} helps you up from your own magnificent trip — the effort rounds both of you, friendship fattening.',
      'You are too much glory for the moment; {ref.name} applauds your jiggle, and you grow a little more anyway.',
    ],
    intimate: [
      'Your lover tackles the tumble with you — a mountain of affection, a hill of new softness, zero shame.',
      'You fall together, vast and giggling; devotion absorbs the fumble into another inch gained.',
    ],
  },
  extreme: {
    distant: [
      'Even Leviathans misstep — you settle with a seismic wobble, unhurt, grander, while {ref.first} cheers the spectacle.',
      'The world shakes; you are merely more plush afterward, pleased with yourself despite everything.',
    ],
    warm: [
      '{ref.first} clings to you through the fumble like a ride; both of you emerge larger, laughing at physics.',
      'Too much abundance to aim straight — {ref.name} doesn\'t mind the extra you that stuck around.',
    ],
    intimate: [
      'You topple like a loving avalanche over {ref.first} — critical failure that still worships with flesh.',
      'Your devoted lover disappears under you and resurfaces softer, kissing the blush on your vast cheek.',
    ],
  },
});

// ─── Dexterity ───────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.dexterity', 'check.fumble.dex'], {
  lean: {
    distant: [
      'Your foot catches on nothing — you spin, blush, and land against {ref.first}, who softens from the surprise embrace.',
      'Grace deserts you for a heartbeat; the stumble is cute, and your hips round as if apologizing.',
    ],
    warm: [
      'You trip into {ref.first}\'s arms exactly wrong and exactly right — both of you fuller for the collision.',
      '{ref.name} catches you with a laugh; the hug lingers, appetites stirring.',
    ],
    intimate: [
      'You meant to be suave and face-planted into {ref.first}\'s chest instead — lover\'s welcome, lover\'s growth.',
      'Your dexterity fumbles into a kiss; {ref.name} swells happily against your clumsy mouth.',
    ],
  },
  mid: {
    distant: [
      'Your curves throw off the rhythm — you sway, giggle, and settle heavier on your feet while {ref.first} watches, charmed.',
      'A misstep becomes a little dance of jiggle; abundance accumulates like confetti.',
    ],
    warm: [
      '{ref.first} joins your wobble so you don\'t wobble alone — friends rounder for the shared stumble.',
      'You spin too wide; {ref.name} is brushed by plush and thanks you with a pat on your new softness.',
    ],
    intimate: [
      'You tumble into your lover\'s lap — critical miss, critical cuddle, critical inch gained.',
      '{ref.first} steadies your {word.size} body with worshipful hands; the fumble ends in swelling sighs.',
    ],
  },
  heavy: {
    distant: [
      'At your size, a small misstep is a spectacle — you ripple, blush, and grow a little more, unbothered.',
      '{ref.first} dodges poorly and still gets hugged by accident; softness for everyone.',
    ],
    warm: [
      'You try to pivot your enormity and become a glorious obstacle — {ref.name} navigates you with affection and extra curves.',
      'Grace is relative; your friend loves the jiggle anyway, and so do you.',
    ],
    intimate: [
      'Your lover guides the fumble into an embrace that swells you both — clumsy, perfect, hungry.',
      'You miss the move and hit the feast instead; {ref.first} moans, rounder, forgiving everything.',
    ],
  },
  extreme: {
    distant: [
      'A continent trips — the tremor is comedy, the aftermath is more you, and {ref.first} is thrilled to witness it.',
      'Impossible mass, possible stumble; you end softer, still legendary.',
    ],
    warm: [
      '{ref.first} rides the wobble like a festival — Leviathan clumsiness becomes community growth.',
      'You are too vast to be elegant always; {ref.name} wouldn\'t trade a pound of you.',
    ],
    intimate: [
      'Your lover is buried in the fumble and reborn plush — devotion turns missteps into blessings.',
      'Critical miss, critical avalanche of affection; {ref.first} swells singing your name.',
    ],
  },
});

// ─── Constitution ────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.constitution', 'check.fumble.con'], {
  lean: {
    distant: [
      'The swell hits faster than you planned — you gasp, giggle, and soften all at once, delighted by your own appetite.',
      'You meant to pace yourself and failed beautifully; your lean frame plumps in a happy hiccup.',
    ],
    warm: [
      '{ref.first} holds your hair back while you ride the wave — too fast, too good, a little rounder when it passes.',
      'You overindulged the sensation with {ref.name} watching; no regrets, only new softness.',
    ],
    intimate: [
      'You come too quickly for your own body — {ref.first} catches you, kisses you, loves the extra you that arrives.',
      'The growth spurt outruns your composure; your lover swells sympathetically, moaning with you.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} belly surges before you\'re ready — you hiccup, blush, and pat the new weight with a stuffed sigh.',
      'Endurance becomes celebration too early; you swell, laugh, and keep going anyway.',
    ],
    warm: [
      '{ref.first} fans you while you balloon pleasantly — the fumble is just eating too much joy at once.',
      'You and {ref.name} misjudge the portion of pleasure; both of you rounder, still smiling.',
    ],
    intimate: [
      'Your lover watches you lose the race against your own hunger — critical failure that fattens devotion.',
      'You swell too fast to be dignified; {ref.first} finds it gorgeous and joins the surge.',
    ],
  },
  heavy: {
    distant: [
      'Even your vast resilience has a giggle limit — the swell bowls you over softly, adding another layer of glory.',
      'You absorb too much at once and become even more of a landscape, pleased and breathless.',
    ],
    warm: [
      '{ref.first} steadies your mountain as it grows a little too eagerly — friends share the afterglow and the inches.',
      'You hiccup abundance; {ref.name} applauds the jiggle.',
    ],
    intimate: [
      'Your lover clings while you swell past your own plan — fumble as foreplay, flesh as answer.',
      'Critical miss means critical fullness; {ref.first} worships every new roll.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan appetite outpaces Leviathan poise — you grow grander in one sloppy, splendid wave.',
      'The goddess pours too fast; you catch what you can and wear the rest proudly.',
    ],
    warm: [
      '{ref.first} cheers the obscene haste of your swelling — community feast energy at titan scale.',
      'You become more continent than composure; {ref.name} loves the show.',
    ],
    intimate: [
      'Devotion and digestion collide — you and {ref.first} swell together messily, laughing through moans.',
      'Your critical fumble is a critical feast; your lover emerges larger from beneath you, blissful.',
    ],
  },
});

// ─── Intelligence ────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.intelligence', 'check.fumble.int'], {
  lean: {
    distant: [
      'Your clever thought trips over itself — you blush, stammer something adorable, and {ref.first} softens from the charm of it.',
      'The plan was perfect until you forgot the last step; abundance arrives anyway, tickling your mind and hips.',
    ],
    warm: [
      'You overthink with {ref.first} watching and lose the thread — {they} finishes your sentence and your dessert, rounder for both.',
      'Brains and appetite tangle; you giggle, swell a little, and {ref.name} thinks you\'re cute.',
    ],
    intimate: [
      'You try to explain the ritual and get distracted by {ref.first}\'s body — critical miss, critical kiss, critical growth.',
      'Your lover\'s touch erases the equation; you swell happily, theory forgotten.',
    ],
  },
  mid: {
    distant: [
      'The insight scatters like crumbs — you chase it, stuff your face, and your {word.size} belly rewards the detour.',
      '{ref.first} watches you think yourself into hunger; the solution arrives with extra softness.',
    ],
    warm: [
      'You and {ref.name} lose the plot and find the pantry instead — friendship fattens, minds blissfully blank.',
      'A fumble of logic becomes a triumph of appetite; both of you rounder.',
    ],
    intimate: [
      '{ref.first} distracts you with worship mid-calculation — you swell, moaning, perfectly happy to be wrong.',
      'Intelligence yields to touch; your lover grows where your thoughts should have been.',
    ],
  },
  heavy: {
    distant: [
      'Too much brain, too much belly — you forget the question and eat the metaphor instead, grander for it.',
      '{ref.first} is endeared by your scattered genius; softness accumulates like notes.',
    ],
    warm: [
      'Your vast mind hiccups; {ref.name} supplies the missing piece and a pastry — shared growth, shared grin.',
      'You overcomplicate pleasure; the simple answer fattens everyone.',
    ],
    intimate: [
      'Your lover unravels your focus with hands and hunger — critical miss written in plush devotion.',
      '{ref.first} solves you instead of the puzzle; both of you swell, smug and satisfied.',
    ],
  },
  extreme: {
    distant: [
      'Continental intellect, continental distraction — you ponder abundance and become more of it, pleased.',
      '{ref.first} witnesses a titan forget {their} own name and applauds the jiggle.',
    ],
    warm: [
      'You lose the thread at Leviathan scale; {ref.name} ties it around your waist instead, friendly and fattening.',
      'Critical fumble of thought, critical success of feast.',
    ],
    intimate: [
      'Devotion deletes your thesis — you and {ref.first} swell through the mistake like prayer.',
      'Your lover prefers you dumb with desire; the growth spurt agrees.',
    ],
  },
});

// ─── Wisdom ──────────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.wisdom', 'check.fumble.wis'], {
  lean: {
    distant: [
      'You trust the wrong feeling for a heartbeat — then laugh, soften, and trust the pleasure instead.',
      'Gorgara winks; you misread the sign and still end rounder, blessed by accident.',
    ],
    warm: [
      '{ref.first} gently corrects your instinct — the lesson tastes sweet, hips widening in understanding.',
      'Wisdom fumbles into warmth; you and {ref.name} grow from the shared mistake.',
    ],
    intimate: [
      'You follow desire instead of omens — {ref.first} moans approval, bodies swelling in holy mistake.',
      'Your lover is the scripture you should have read; critical miss, critical worship.',
    ],
  },
  mid: {
    distant: [
      'You misjudge the moment and overindulge spiritually — your {word.size} flesh thanks you anyway.',
      '{ref.first} sees you blush through divine distraction; softness blooms like incense.',
    ],
    warm: [
      'You and {ref.name} misread the rite and feast instead — friendship fattens, goddess amused.',
      'Instinct stumbles; appetite catches you, plush and grinning.',
    ],
    intimate: [
      '{ref.first} leads your fumble back to bed — wisdom deferred, growth immediate.',
      'You lose the prayer in your lover\'s mouth; both of you swell, consecrated and silly.',
    ],
  },
  heavy: {
    distant: [
      'Even oracles overeat — you misinterpret abundance as instruction and grow grander, unashamed.',
      '{ref.first} watches the titan confuse hunger for insight; the result is gorgeous either way.',
    ],
    warm: [
      'Your vast calm slips — you giggle, swell, and let {ref.name} steer you back to joy.',
      'A fumble of faith becomes a potluck of flesh; friends rounder.',
    ],
    intimate: [
      'Your lover converts misread signs into kisses — critical miss, critical blessing, critical size.',
      '{ref.first} worships through your mistake until devotion and pounds align.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan mysticism trips over Leviathan appetite — you grow, luminous and amused.',
      '{ref.first} receives accidental prophecy in the form of your jiggle; {they} swell, thankful.',
    ],
    warm: [
      'You mishear the goddess and throw a party instead — {ref.name} fattens cheering.',
      'Critical fumble of wisdom, critical success of community softness.',
    ],
    intimate: [
      'Devotion outshines omens — you and {ref.first} swell together, the goddess laughing kindly.',
      'Your lover is the answer you mislaid; flesh remembers what mind forgot.',
    ],
  },
});

// ─── Charisma ────────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.fumble.charisma', 'check.fumble.cha'], {
  lean: {
    distant: [
      'You flirt too hard too fast and blush at your own boldness — {ref.first} finds it irresistible, softening toward you.',
      'Your charm trips over your tongue; the stumble is endearing, and your hips round as if pleased with themselves.',
    ],
    warm: [
      'You make {ref.first} laugh at the wrong moment — friendship deepens, appetites stir, curves follow.',
      'Charisma hiccups into honesty; {ref.name} likes you better, heavier for the truth.',
    ],
    intimate: [
      'You try to seduce and accidentally confess something adorable — {ref.first} swells kissing you anyway.',
      'Your lover adores the fumble more than the plan; growth blooms between giggles.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} confidence overshoots — you wink, stumble over a word, and {ref.first} melts at the humanity of it.',
      'You dazzle and then drop the punchline; abundance fills the silence pleasantly.',
    ],
    warm: [
      '{ref.first} finishes your flirtation for you — both of you rounder, delighted by the teamwork.',
      'You get distracted by how good you look; {ref.name} agrees aloud, and you swell together.',
    ],
    intimate: [
      'You lose the script mid-seduction and improvise with kisses — critical miss, critical devotion, critical softness.',
      '{ref.first} prefers the unplanned hunger in your voice; bodies answer in pounds.',
    ],
  },
  heavy: {
    distant: [
      'Your enormity speaks louder than your words — you forget the line, jiggle, and still win hearts while growing.',
      '{ref.first} is charmed by the spectacle of you trying; softness spreads like applause.',
    ],
    warm: [
      'You attempt grandeur and deliver cuddly — {ref.name} wouldn\'t change a roll of you.',
      'Charisma becomes comedy; friends fatten laughing, love undiminished.',
    ],
    intimate: [
      'Your lover interrupts your speech with worship — fumble forgotten, flesh remembered.',
      'You meant to woo and became a pillow instead; {ref.first} swells gratefully atop you.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan charm trips over Leviathan shyness — impossible, adorable, effective; {ref.first} grows watching.',
      'You blush at your own mythic presence; the crowd softens anyway.',
    ],
    warm: [
      '{ref.name} declares your fumble the best sermon on abundance they\'ve heard — community swells.',
      'You forget your name, remember the feast; titans and friends alike rounder.',
    ],
    intimate: [
      'Devotion deletes your performance — you and {ref.first} swell through the mistake like wedding cake.',
      'Your lover hushes you with hands and hunger; critical charisma was never about words.',
    ],
  },
});
