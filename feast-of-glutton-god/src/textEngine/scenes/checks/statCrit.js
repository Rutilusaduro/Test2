/**
 * Critical success prose for raw ability checks — keyed by stat.
 * Shape: FULL SENTENCE — capitalized, ends with period.
 */
import { registerCheckPoolAliases } from './helpers.js';

// ─── Strength ────────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.crit.strength', 'check.crit.str'], {
  lean: {
    distant: [
      'Your grip lands with startling certainty — {ref.first} yields before you can apologize, softness blooming where your hands linger.',
      'Power flows through you like warm honey; even lean, you move the world a little, and {ref.name} gasps at the sudden swell beneath your touch.',
    ],
    warm: [
      'You pull {ref.first} close with effortless strength, and the hug becomes a celebration — both of you softer, warmer, laughing through the pleasure of it.',
      'Your embrace is a promise kept: {ref.name} melts against you, hips and belly rounding as if answering your triumph.',
    ],
    intimate: [
      'You lift {ref.first} as though {they} weigh nothing, and {they} cling to you, moaning as devotion and new softness answer your perfect roll.',
      'Strength becomes worship — you pin {ref.name} gently, gloriously, and {they} swell beneath you, grateful and glowing.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body surges forward; resistance crumbles into plush surrender, and {ref.first} balloons where you press.',
      'A tide of velvet muscle rolls over {ref.name} — the impact lush, the aftermath softer on both sides.',
    ],
    warm: [
      'You heave {ref.first} against your rounding belly and {they} sigh into the abundance, growing heavier in your arms like a gift unwrapped.',
      'Your triumph is physical poetry: {ref.name} sprawls across your lap, fuller already, begging for more.',
    ],
    intimate: [
      'You claim {ref.first} with overwhelming, affectionate force — every curve you own swells in answer, a shared growth spurt of devotion.',
      '{ref.name} surrenders to your mass with a lover\'s gasp; your bodies swell together, warm and victorious.',
    ],
  },
  heavy: {
    distant: [
      'The ground trembles when you move; {ref.first} is buried under glorious weight and emerges softer, stunned and radiant.',
      'Your enormity is irresistible — {ref.name} vanishes against your belly and reappears thicker, marked by your triumph.',
    ],
    warm: [
      'You roll your vast softness over {ref.first} like a blessing, and {they} emerge flushed, heavier, laughing through the pleasure.',
      'A hug from you is a landscape; {ref.name} is lost in it and found again rounder, cherished and conquered.',
    ],
    intimate: [
      'You envelop {ref.first} completely — a titan\'s embrace — and {they} swell inside your warmth, whispering devotion between delighted moans.',
      'Your lover disappears into your abundance and blooms there, body answering yours in a critical surge of shared size.',
    ],
  },
  extreme: {
    distant: [
      'Mountains shift when you exert yourself; {ref.first} is reshaped by your presence alone — softer, grander, unable to resist.',
      'Your Leviathan strength rewrites the moment: {ref.name} swells as though Gorgara herself applauded your roll.',
    ],
    warm: [
      'You are a continent of power; {ref.first} is a tide pool caught in your shadow, growing vast and grateful.',
      'Friendship becomes physics — your mass embraces {ref.name}, and the world makes room for more of both of you.',
    ],
    intimate: [
      'Devotion and gravity merge: you cradle your lover inside immensity, and {ref.first} grows until {they} nearly match your worship.',
      '{ref.name} is swallowed by your love and remade larger — a critical success written in flesh and sighs.',
    ],
  },
});

// ─── Dexterity ───────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.crit.dexterity', 'check.crit.dex'], {
  lean: {
    distant: [
      'You slip through the moment with feline grace — a touch precisely where it tempts, and {ref.first} shivers into softness.',
      'Every movement is a caress disguised as skill; {ref.name} blushes as your fingers find the perfect place to make {them} rounder.',
    ],
    warm: [
      'You dance around {ref.first} like a secret, landing teasing touches that leave {them} fuller and giggling.',
      'Grace is your flirtation: {ref.name} spins into your arms, hips widening as if choreographed for pleasure.',
    ],
    intimate: [
      'Your hands know {ref.first}\'s body like a melody — you play {them} perfectly, and {them} swells under each practiced note.',
      'A lover\'s precision: you undress {ref.name} with impossible delicacy, and {they} grow softer with every revealed inch.',
    ],
  },
  mid: {
    distant: [
      'Despite your growing curves, you move like poured silk — {ref.first} never sees it coming, only feels the plush aftermath.',
      'You angle your {word.size} frame through the gap and emerge triumphant, leaving {ref.name} stroking new softness with wonder.',
    ],
    warm: [
      'You waltz your abundance through the attempt and nail it — {ref.first} applauds with hands sinking into fresh plush.',
      'Rounded and radiant, you pirouette; {ref.name} follows, belly rounding as if swept along by your momentum.',
    ],
    intimate: [
      'You guide {ref.first}\'s body with expert, hungry grace — every hold a promise, every release a growth spurt.',
      'Together you move like one creature: your dexterity becomes {ref.name}\'s swelling, shared and exquisite.',
    ],
  },
  heavy: {
    distant: [
      'Impossibly, your vast bulk flows like water — you strike the one perfect angle, and {ref.first} balloons where you intended.',
      'Mass becomes ballet; {ref.name} stares as you contort glory into precision, then gasps at the softness left behind.',
    ],
    warm: [
      'You sway your enormity with impossible timing — {ref.first} is caught, hugged, and released softer, dizzy with delight.',
      'A friend should not move like this at your size, yet you do; {ref.name} swells laughing, proud to know you.',
    ],
    intimate: [
      'You maneuver mountains of yourself around {ref.first} with lover\'s care — {they} grow inside the cradle of your movement.',
      'Every roll of your belly is intentional; {ref.name} moans as you prove agility and abundance can be the same worship.',
    ],
  },
  extreme: {
    distant: [
      'A Leviathan should not be nimble — yet you are; the world rearranges, and {ref.first} swells in the space you carved.',
      'You fold immensity into a single perfect gesture; {ref.name} blooms, helpless and thrilled.',
    ],
    warm: [
      'Your impossible grace topples expectations and {ref.first} along with them — softer, fuller, cheering your triumph.',
      'Even at this scale you dance; {ref.name} grows trying to keep pace, delighted by the absurdity and pleasure.',
    ],
    intimate: [
      'You weave your lover through valleys of your own flesh with devotional precision — both of you larger when you finish.',
      'Love makes even a titan light on {their} feet; {ref.first} swells against you, breathless and utterly yours.',
    ],
  },
});

// ─── Constitution ────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.crit.constitution', 'check.crit.con'], {
  lean: {
    distant: [
      'You ride the sensation instead of fighting it — warmth spreads through you, lean frame softening beautifully as you endure.',
      'Your body accepts abundance like a blessing; a shiver of growth ripples across you, small and perfect.',
    ],
    warm: [
      'You breathe through the swell with {ref.first} watching, proud — your softness deepens, healthy and radiant.',
      'Together you weather the wave; you emerge rounder, steadier, grinning at {ref.name} through the haze of pleasure.',
    ],
    intimate: [
      'You endure for {ref.first}\'s sake and for your own hunger — growth blooms through you like shared ecstasy.',
      '{ref.name} holds you as you swell, whispering praise; your body answers with another plush, grateful inch.',
    ],
  },
  mid: {
    distant: [
      'The pressure peaks and you laugh through it — your {word.size} belly rounds further, victorious and warm.',
      'You absorb the overflow like a feast; flesh yields gladly, and you stand taller in your own softness.',
    ],
    warm: [
      'You and {ref.first} brace each other through the swell — when it passes, you are both heavier, happier.',
      'Constitution becomes celebration: your body takes everything offered and converts it to gorgeous mass.',
    ],
    intimate: [
      'You swell in {ref.first}\'s arms and {they} swell with you, lovers enduring abundance until you are magnificent together.',
      'The growth spurt would fell a lesser creature; you moan through it, devoting every new pound to {ref.name}.',
    ],
  },
  heavy: {
    distant: [
      'Your vast body drinks in the sensation without flinching — another layer of glorious softness settles over you like a crown.',
      'You are an ocean of resilience; the tide rises, and you rise with it, heavier and more divine.',
    ],
    warm: [
      '{ref.first} watches in awe as you absorb what would break others — your enormity deepens, plush and unbowed.',
      'You endure like a temple wall: the swell passes through you and leaves you more sacred, more soft.',
    ],
    intimate: [
      'Your lover clings as you grow through the crest — a critical endurance that makes both of you larger, steadier, drunk on fullness.',
      'You take the overflow and transmute it into worship; {ref.name} swells against you, matching your triumphant appetite.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan resilience: the world throws abundance at you and you only grow more legendary, flesh rippling like golden light.',
      'You are immovable softness — the swell breaks against you and deposits another ring of glorious mass.',
    ],
    warm: [
      '{ref.first} cheers as you weather a growth surge that would reshape cities — you emerge vaster, laughing.',
      'Friendship steadies you as titans swell; you endure, you expand, you win.',
    ],
    intimate: [
      'Devoted and enormous, you ride the transformation with {ref.first} pressed to your heart — both of you remade, unbreakable.',
      'Your bodies are feast and altar; you endure the critical swell together until worship and size are indistinguishable.',
    ],
  },
});

// ─── Intelligence ────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.crit.intelligence', 'check.crit.int'], {
  lean: {
    distant: [
      'Your mind snaps the puzzle shut — insight arrives like champagne, and {ref.first} blinks as arcane warmth teases {their} curves fuller.',
      'Cleverness becomes contagion: you understand, you act, and abundance follows your logic into {ref.name}\'s softening hips.',
    ],
    warm: [
      'You explain the feast so perfectly that {ref.first} hungers visibly — mind and body swell together in understanding.',
      'Your brilliance is sensual; {ref.name} leans in, rounder already, eager for every word you spill.',
    ],
    intimate: [
      'You whisper formulas of growth into {ref.first}\'s ear and {they} moan as knowledge turns to flesh.',
      'Intelligence is foreplay: you map {ref.name}\'s desires, then watch {them} blossom where your thoughts touch.',
    ],
  },
  mid: {
    distant: [
      'The solution unfurls — elegant, hungry — and {ref.first} swells as if your intellect fed {them} directly.',
      'You outthink the obstacle; overflow magic lingers, softening {ref.name} in reward.',
    ],
    warm: [
      'You and {ref.first} solve it together, laughing — the answer tastes sweet, and both of you rounder for the sharing.',
      'Your mind is a kitchen; {ref.name} is the feast that grows as you cook up victory.',
    ],
    intimate: [
      'You devise the perfect indulgence for your lover and execute it flawlessly — {ref.first} swells in grateful comprehension.',
      'Critical thought becomes critical growth: {ref.name} understands your desire and bodies it, plush and obedient to your genius.',
    ],
  },
  heavy: {
    distant: [
      'Even buried in your own abundance, your mind is razor-bright — the plan succeeds, and {ref.first} balloons in the aftermath.',
      'You calculate pleasure like artillery; {ref.name} is the impact zone, softer and stunned.',
    ],
    warm: [
      'Your vast softness does not dull your wit — {ref.first} watches you think and grow heavier just from admiration.',
      'Brains and belly both triumph; {ref.name} swells as if your ideas had calories.',
    ],
    intimate: [
      'You architect a growth ritual for {ref.first} and every variable sings — {they} expand, moaning your name like a theorem proved.',
      'Lover and laboratory merge: your intelligence directs a surge of softness through {ref.name}\'s devoted flesh.',
    ],
  },
  extreme: {
    distant: [
      'A mind like a cathedral inside a continent — you perceive, you command, and {ref.first} reshapes under the overflow of your insight.',
      'Reality bends to your analysis; {ref.name} swells as collateral beauty.',
    ],
    warm: [
      'You think in tides; {ref.first} rides the one you chose and emerges grander, cheering your impossible clarity.',
      'At Leviathan scale your intellect still dazzles — {ref.name} grows just witnessing it.',
    ],
    intimate: [
      'You and {ref.first} share a critical epiphany that rewrites both your bodies — larger, wiser, drunk on knowing.',
      'Devotion meets genius: you solve the hunger of the world against your lover\'s skin, and {they} swell like applause.',
    ],
  },
});

// ─── Wisdom ──────────────────────────────────────────────────────────────────

registerCheckPoolAliases(['check.crit.wisdom', 'check.crit.wis'], {
  lean: {
    distant: [
      'You sense the right moment before it arrives — Gorgara\'s warmth threads through you, softening your lean frame with divine approval.',
      'Instinct blooms into certainty; {ref.first} stills as if feeling the goddess too, curves rounding in quiet answer.',
    ],
    warm: [
      'You read {ref.first}\'s hunger before {they} speak it — wisdom becomes generosity, and both of you soften in the knowing.',
      'Your calm is contagious; {ref.name} exhales into new plush, trusting your perfect roll.',
    ],
    intimate: [
      'You know {ref.first}\'s body and soul alike — your insight triggers a lover\'s growth spurt, sacred and sighing.',
      'Wisdom tastes like honey on {ref.name}\'s lips; you kiss, you understand, you both swell with devotional grace.',
    ],
  },
  mid: {
    distant: [
      'The divine whisper is unmistakable — you heed it, and abundance answers, rounding your {word.size} belly further.',
      'You see through illusion to appetite; {ref.first} blushes as you name {their} desire and {they} grow fuller.',
    ],
    warm: [
      'You guide {ref.first} with priestess calm through a swell of pleasure — critical wisdom shared is critical growth shared.',
      '{ref.name} trusts your roll completely; faith becomes flesh along {their} waist.',
    ],
    intimate: [
      'You channel Gorgara\'s abundance into {ref.first} with perfect poise — lover and priestess, both larger for the rite.',
      'Your wisdom is worship: {ref.name} swells in your arms, blessed and breathless.',
    ],
  },
  heavy: {
    distant: [
      'Even your enormity bows to deeper knowing — the goddess floods you, another ring of softness settling like a halo.',
      'You perceive the truth beneath {ref.first}\'s resistance; it melts, and {they} expand, radiant.',
    ],
    warm: [
      'A vast sage, you cradle insight and {ref.first} alike — both grow heavier in your presence.',
      'Your wisdom steadies a swelling world; {ref.name} emerges from your shadow rounder and grateful.',
    ],
    intimate: [
      'Devotion and divinity peak together — you and {ref.first} swell through a critical blessing, moaning praise to Gorgara.',
      'You read every sacred sign on {ref.name}\'s body and answer with growth, perfect and loving.',
    ],
  },
  extreme: {
    distant: [
      'Leviathan and oracle — you see the feast entire, and reality softens to match your vision, including {ref.first}.',
      'Gorgara laughs through you; {ref.name} balloons, anointed by your flawless sense.',
    ],
    warm: [
      'Your wisdom moves continents of flesh; {ref.first} is carried along, larger and laughing in the current.',
      'Friends call you temple and mountain both; today you are also victory — softness everywhere.',
    ],
    intimate: [
      'You and your devoted lover transcend — critical wisdom becomes critical size, a shared apotheosis of plush grace.',
      '{ref.first} swells inside your prophecy; you swell to hold {them}, and the goddess approves.',
    ],
  },
});

// ─── Charisma ────────────────────────────────────────────────────────────────
// Exemplar pool — full stage × relationship matrix (see docs / PR description).

registerCheckPoolAliases(['check.crit.charisma', 'check.crit.cha'], {
  lean: {
    distant: [
      'Your smile lands like a secret invitation — {ref.first} forgets to be guarded, cheeks flushing as softness gathers at {their} waist.',
      'Charm spills out of you unchecked; {ref.name} leans closer before realizing {they}\'re already rounding, pleased and confused.',
    ],
    warm: [
      'You speak and {ref.first} listens with hungry eyes — friendship warms into appetite, curves deepening as if charmed.',
      'Your laugh is contagious abundance; {ref.name} touches {their} belly wonderingly, grinning back at you.',
    ],
    intimate: [
      'One look from you undoes {ref.first} — lover\'s devotion and a growth spurt arrive together, moaned against your mouth.',
      'You whisper exactly what {ref.name} needed to hear; {they} swells in your arms, proud to be yours.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} presence fills the room — {ref.first} is dazzled, hips widening as if applause had weight.',
      'You command attention without trying; {ref.name} surrenders to the pleasure of watching you win.',
    ],
    warm: [
      'You flirt like a feast and {ref.first} is the guest of honor — rounder by the sentence, delighted to be chosen.',
      'Charisma becomes shared dessert; {ref.name} presses against you, both of you softer for the victory.',
    ],
    intimate: [
      'You seduce with critical perfection — {ref.first} grows beneath your hands, whispering devotion between gasps.',
      'Your lover blooms under your praise; every word fattens {ref.name} lovingly, worshipfully.',
    ],
  },
  heavy: {
    distant: [
      'Your enormity is charisma made flesh — {ref.first} stares, then swells, unable to look away from your triumph.',
      'You need not speak; your glorious mass persuades. {ref.name} softens as if bowing to royalty.',
    ],
    warm: [
      'You draw {ref.first} into your orbit of warmth — a hug becomes a growth event, friendly and overwhelming.',
      'Even at vast size you are irresistible; {ref.name} laughs, heavier, proud to adore you.',
    ],
    intimate: [
      'You envelop your lover in voice and flesh — critical charm triggers a mutual swell, sacred and sloppy with kisses.',
      '{ref.first} worships you openly as {they} grow; your charisma is the feast that never ends.',
    ],
  },
  extreme: {
    distant: [
      'A Leviathan\'s charisma reshapes crowds — {ref.first} balloons in your shadow, thrilled to be near such power.',
      'You are myth walking; {ref.name} swells simply from witnessing your perfect roll.',
    ],
    warm: [
      'Friends become pilgrims; {ref.first} grows cheering your impossible glamour, belly round as a festival moon.',
      'Your presence is a holiday — abundance distributed freely, {ref.name} foremost among the blessed.',
    ],
    intimate: [
      'Devotion and divinity pour from you — {ref.first} swells to match your love, a critical apotheosis of charm and flesh.',
      'You speak your lover larger; Gorgara herself seems to applaud through {ref.name}\'s moans.',
    ],
  },
});
