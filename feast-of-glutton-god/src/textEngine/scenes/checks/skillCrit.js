/**
 * Critical success prose for named skills (see skillCheckOutcomes.js).
 * Shape: FULL SENTENCE.
 */
import { registerCheckPool } from './helpers.js';

registerCheckPool('check.crit.seduce', {
  lean: {
    distant: [
      'Your allure strikes like summer lightning — {ref.first} forgets every reason to resist, softness blooming where your gaze lingers.',
      'You do not seduce so much as invite; {ref.name} accepts, hips rounding as if the yes were physical.',
    ],
    warm: [
      'You flirt with critical perfection and {ref.first} answers with hungry eyes — friendship ripens into appetite.',
      'Every word lands on {ref.name}\'s skin like a touch; {they} swells, pleased you know {them} so well.',
    ],
    intimate: [
      'You seduce your lover with devastating tenderness — {ref.first} moans, grows, and pulls you deeper into worship.',
      'Critical charm becomes critical growth: {ref.name} swells in your arms, proud to be undone by you.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body sells the fantasy better than words — {ref.first} surrenders, plush and breathless.',
      'Desire is a tide you command; {ref.name} floats higher on it, heavier and happier.',
    ],
    warm: [
      'You tease {ref.first} into a growth spurt with nothing but voice and smile — victory tastes like honey.',
      '{ref.name} presses against you before {they} realize {they}\'ve grown; you laugh together, delighted.',
    ],
    intimate: [
      'You know every switch in {ref.first}\'s body — critical seduction triggers a lover\'s swell, sacred and sloppy.',
      '{ref.name} whispers your name like a prayer as {they} fattens under your mouth.',
    ],
  },
  heavy: {
    distant: [
      'Your enormity is the seduction — {ref.first} stares, softens, and swells as if commanded by gravity.',
      'You need not chase; your glorious mass beckons, and {ref.name} obeys with a shiver of new curves.',
    ],
    warm: [
      'You draw {ref.first} into your warmth until resistance is a memory — both of you rounder, radiant.',
      'Charisma at vast scale: {ref.name} grows hugging you, grateful for the overwhelm.',
    ],
    intimate: [
      'You envelop your lover in seduction made flesh — critical success shared in pounds and kisses.',
      '{ref.first} swells inside your worship until devotion and size are the same confession.',
    ],
  },
  vast: {
    distant: [
      'Impossible allure reshapes the room — {ref.first} balloons in your shadow, thrilled and claimed.',
      'Myth seduces mortal; {ref.name} grows simply from being chosen by you.',
    ],
    warm: [
      '{ref.first} cheers as your charm topples the world — community softness, festival energy.',
      'You are the feast and the invitation; {ref.name} fattens, blessed.',
    ],
    intimate: [
      'Devoted seduction at titan scale — you and {ref.first} swell through a critical apotheosis of want.',
      'Your lover becomes your masterpiece, larger with every praised inch.',
    ],
  },
  world: {
    distant: [
      'World-breaking allure reshapes the room — {ref.first} balloons in your shadow, thrilled and claimed.',
      'Myth seduces mortal; {ref.name} grows simply from being chosen by you',
    ],
    warm: [
      '{ref.first} cheers as your charm topples the world — community softness, festival energy',
      'You are the feast and the invitation; {ref.name} fattens, blessed',
    ],
    intimate: [
      'Devoted seduction at titan scale — you and {ref.first} swell through a critical apotheosis of want',
      'Your lover becomes your masterpiece, larger with every praised inch',
    ],
  },
});

registerCheckPool('check.crit.overwhelm', {
  lean: {
    distant: [
      'You press your lean strength where it matters — {ref.first} yields with a gasp, body rounding under your sudden dominance.',
      'Overwhelm becomes invitation; {ref.name} softens, stunned by how good it feels to lose.',
    ],
    warm: [
      'You tackle {ref.first} with affectionate force — the grapple ends in laughter, plushness, and mutual growth.',
      'Your friend surrenders to your critical hold; {ref.name} swells, trusting you completely.',
    ],
    intimate: [
      'You pin your lover gently, gloriously — {ref.first} moans as devotion and new softness answer your strength.',
      'Critical overwhelm is worship: {ref.name} grows beneath you, begging for more weight.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} mass rolls over {ref.first} like velvet thunder — resistance melts into abundance.',
      'You dominate without cruelty; {ref.name} emerges rounder, radiant, grateful.',
    ],
    warm: [
      'You scoop {ref.first} into an embrace that becomes a growth event — friendly, fierce, victorious.',
      '{ref.name} sprawls across your lap, heavier already, proud to be conquered by you.',
    ],
    intimate: [
      'You claim {ref.first} with overwhelming love — bodies swell together, critical and consecrated.',
      'Your lover disappears under your abundance and blooms there, moaning praise.',
    ],
  },
  heavy: {
    distant: [
      'The ground shakes when you assert yourself — {ref.first} is buried in glory and remade softer.',
      'Your enormity is law; {ref.name} swells as if the verdict were pleasure.',
    ],
    warm: [
      'You roll your vast softness over {ref.first} like a blessing — {they} emerge flushed and fatter, laughing.',
      'A hug from you is a landscape; {ref.name} is lost and found rounder.',
    ],
    intimate: [
      'You envelop {ref.first} completely — titan\'s embrace, lover\'s growth spurt, perfect roll.',
      'Critical overwhelm writes itself in flesh; {ref.name} swells inside your worship.',
    ],
  },
  vast: {
    distant: [
      'Commanding dominance needs no contest — {ref.first} reshapes under your presence alone.',
      'You move worlds; {ref.name} grows as collateral beauty.',
    ],
    warm: [
      '{ref.first} rides your critical victory like a festival — community swells cheering.',
      'Friends become pilgrims to your mass; softness distributed freely.',
    ],
    intimate: [
      'Devotion and gravity merge — you cradle {ref.first} inside immensity until {they} nearly match your worship.',
      'Your lover is swallowed by love and remade larger, breathless and yours.',
    ],
  },
  world: {
    distant: [
      'Commanding dominance needs no contest — {ref.first} reshapes under your presence alone',
      'You move worlds; {ref.name} grows as collateral beauty',
    ],
    warm: [
      '{ref.first} rides your critical victory like a festival — community swells cheering',
      'Friends become pilgrims to your mass; softness distributed freely',
    ],
    intimate: [
      'Devotion and gravity merge — you cradle {ref.first} inside immensity until {they} nearly match your worship',
      'Your lover is swallowed by love and remade larger, breathless and yours',
    ],
  },
});

registerCheckPool('check.crit.endure_growth', {
  lean: {
    distant: [
      'The swell crests and you ride it laughing — lean frame softening beautifully, poise intact, pleasure paramount.',
      'You endure like a blessing receiving itself; growth ripples through you, small and perfect.',
    ],
    warm: [
      '{ref.first} watches you weather the wave with critical grace — you emerge rounder, steadier, grinning.',
      'Shared endurance: you and {ref.name} swell together, proud of the appetite you carry.',
    ],
    intimate: [
      'You swell in {ref.first}\'s arms with ecstatic composure — lover\'s praise, lover\'s matching growth.',
      'Critical endurance becomes critical devotion; {ref.name} holds you through every new inch.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} body absorbs the surge without flinching — another ring of softness, another victory moan.',
      'You turn overflow into ornament; flesh yields gladly beneath your composure.',
    ],
    warm: [
      'You and {ref.first} brace each other — when the swell passes, both heavier, happier.',
      'Constitution as celebration: you take everything and wear it gorgeously.',
    ],
    intimate: [
      'You grow through the crest with {ref.first} pressed to your heart — mutual swell, mutual worship.',
      'The spurt would fell others; you moan through it, devoting pounds to {ref.name}.',
    ],
  },
  heavy: {
    distant: [
      'Your vast body drinks the sensation — enormity deepens, plush and unbowed.',
      'You endure like a temple wall; the tide leaves you more sacred, more soft.',
    ],
    warm: [
      '{ref.first} awes at your resilience — you absorb what breaks others and grow grander.',
      'Critical endurance at vast scale inspires; {ref.name} swells admiring.',
    ],
    intimate: [
      'Your lover clings as you grow through the peak — both larger, steadier, drunk on fullness.',
      'You transmute overflow into worship; {ref.first} matches your triumphant appetite.',
    ],
  },
  vast: {
    distant: [
      'Sacred resilience: the world throws abundance and you only become more legendary.',
      'You are immovable softness — the swell deposits another halo of mass.',
    ],
    warm: [
      '{ref.first} cheers a growth surge that would reshape cities — you emerge vaster, laughing.',
      'Friendship steadies titans; you endure, expand, win.',
    ],
    intimate: [
      'Devoted and enormous, you ride transformation with {ref.first} — bodies remade, unbreakable.',
      'Feast and altar merge; critical endurance until worship and size are one.',
    ],
  },
  world: {
    distant: [
      'Sacred resilience: the world throws abundance and you only become more legendary',
      'You are immovable softness — the swell deposits another halo of mass',
    ],
    warm: [
      '{ref.first} cheers a growth surge that would reshape cities — you emerge vaster, laughing',
      'Friendship steadies titans; you endure, expand, win',
    ],
    intimate: [
      'Devoted and enormous, you ride transformation with {ref.first} — bodies remade, unbreakable',
      'Feast and altar merge; critical endurance until worship and size are one',
    ],
  },
});

registerCheckPool('check.crit.indulge', {
  lean: {
    distant: [
      'Every bite becomes revelation — you indulge with critical joy, lean curves deepening bite by bite.',
      'Hunger and grace align; your body thanks you with plush, immediate reward.',
    ],
    warm: [
      'You feast with {ref.first} and the table surrenders — both of you rounder, laughing through crumbs.',
      'Critical indulgence is contagious; {ref.name} swells matching your appetite.',
    ],
    intimate: [
      'You feed each other to critical excess — {ref.first} moans, grows, worships your mouth.',
      'Lover\'s feast: {ref.name} fattens on your devotion, sacred and sloppy.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} appetite commands the moment — plates empty, belly swells, victory tastes like cream.',
      'You indulge until abundance spills outward, softening the air itself.',
    ],
    warm: [
      'You and {ref.first} demolish the feast together — friendship fattens, goddess pleased.',
      'Critical indulgence leaves {ref.name} patting a new curve, grateful.',
    ],
    intimate: [
      'You worship {ref.first} with food and hunger — critical success written in shared pounds.',
      'Your lover swells from your indulgence until {they} are the dessert.',
    ],
  },
  heavy: {
    distant: [
      'You consume like a legend — vast belly deepening, every flavor a coronation.',
      'Critical indulgence at enormity scale is a weather event; softness follows.',
    ],
    warm: [
      '{ref.first} tries to keep pace and fails beautifully — both grander, happier.',
      'You feast; {ref.name} fattens cheering; abundance wins.',
    ],
    intimate: [
      'Devoted gluttony — you and {ref.first} swell through critical courses of kisses and cake.',
      'Your lover is the feast you finish last; {they} grow, blissful.',
    ],
  },
  vast: {
    distant: [
      'Divine indulgence reshapes the banquet — you drink oceans, wear the tide proudly.',
      'Critical appetite becomes critical myth; the world softens watching.',
    ],
    warm: [
      '{ref.first} witnesses titanic hunger and swells in sympathy — community feast energy.',
      'You indulge until friends rounder; victory shared.',
    ],
    intimate: [
      'You and your devoted lover transcend via critical feast — apotheosis of appetite and flesh.',
      '{ref.first} swells inside your worship until size is prayer.',
    ],
  },
  world: {
    distant: [
      'Divine indulgence reshapes the banquet — you drink oceans, wear the tide proudly',
      'Critical appetite becomes critical myth; the world softens watching',
    ],
    warm: [
      '{ref.first} witnesses titanic hunger and swells in sympathy — community feast energy',
      'You indulge until friends rounder; victory shared',
    ],
    intimate: [
      'You and your devoted lover transcend via critical feast — apotheosis of appetite and flesh',
      '{ref.first} swells inside your worship until size is prayer',
    ],
  },
});

registerCheckPool('check.crit.persuade', {
  lean: {
    distant: [
      'Your words land like honeyed thunder — {ref.first}\'s resistance melts, appetite stirred awake.',
      'Persuasion becomes prophecy; {ref.name} nods, hips softening as if the argument were physical.',
    ],
    warm: [
      'You convince {ref.first} with critical warmth — friendship deepens, curves follow the new conviction.',
      '{ref.name} repeats your thesis with hands on a fuller belly, grinning.',
    ],
    intimate: [
      'You preach abundance into {ref.first}\'s mouth — lover converted, lover swelling, lover yours.',
      'Critical persuasion is foreplay; {ref.name} bodies your gospel gladly.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} presence backs every syllable — {ref.first} surrenders to the sermon of softness.',
      'Hearts and appetites open; {ref.name} grows persuaded in every sense.',
    ],
    warm: [
      'You and {ref.first} find agreement that tastes like dessert — both rounder for the truth.',
      'Critical charm of ideas; {ref.name} swells celebrating the shared belief.',
    ],
    intimate: [
      'You persuade your lover to want more — critical success triggers critical growth, moaned consent.',
      '{ref.first} swells whispering yes before you finish the sentence.',
    ],
  },
  heavy: {
    distant: [
      'Even your enormity speaks — {ref.first} listens, softens, converts to appetite.',
      'Persuasion at vast scale is gravity; {ref.name} orbits your belly, heavier.',
    ],
    warm: [
      'You convince {ref.first} with laughter and mass — friends fatter, faith stronger.',
      'Critical rhetoric jiggles; {ref.name} approves every pound.',
    ],
    intimate: [
      'You preach devotion into flesh — {ref.first} swells accepting your critical blessing.',
      'Lover and convert merge; {ref.name} grows praising the Fat Goddess through you.',
    ],
  },
  vast: {
    distant: [
      'World-moving eloquence moves crowds — {ref.first} balloons persuaded, thrilled.',
      'You speak continents softer; {ref.name} is first converted.',
    ],
    warm: [
      '{ref.first} carries your critical sermon into festival fatness — community swells.',
      'Titans persuade; friends feast; abundance wins.',
    ],
    intimate: [
      'Devoted persuasion at mythic scale — you and {ref.first} swell through shared creed.',
      'Your lover becomes living proof of your words, larger with every amen.',
    ],
  },
  world: {
    distant: [
      'World-moving eloquence moves crowds — {ref.first} balloons persuaded, thrilled',
      'You speak the realms softer; {ref.name} is first converted.',
    ],
    warm: [
      '{ref.first} carries your critical sermon into festival fatness — community swells',
      'Titans persuade; friends feast; abundance wins',
    ],
    intimate: [
      'Devoted persuasion at apotheotic scale — you and {ref.first} swell through shared creed.',
      'Your lover becomes living proof of your words, larger with every amen',
    ],
  },
});

registerCheckPool('check.crit.default', {
  lean: {
    distant: [
      'Fortune favors your hunger — the moment bends, {ref.first} softens, and you glow with critical triumph.',
      'A perfect roll; abundance answers like applause along your lean frame.',
    ],
    warm: [
      'You succeed so cleanly that {ref.first} laughs and swells with you — shared victory, shared softness.',
      'Critical luck tastes sweet; {ref.name} toasts your win with a pat on new curves.',
    ],
    intimate: [
      'The goddess winks through you — {ref.first} moans, grows, and kisses your critical success.',
      'Devotion amplifies fortune; your lover fattens celebrating you.',
    ],
  },
  mid: {
    distant: [
      'Your {word.size} excellence lands flush — pleasure ripples outward, rounding edges everywhere.',
      'Critical success is a feast; {ref.first} is invited by proximity.',
    ],
    warm: [
      'You win beautifully; {ref.name} hugs you heavier for it.',
      'Abundance follows excellence — friends rounder, moods brighter.',
    ],
    intimate: [
      'Critical victory becomes critical cuddling — {ref.first} swells against you, proud.',
      'Your lover wears your success like jewelry, flesh and all.',
    ],
  },
  heavy: {
    distant: [
      'Even at vast scale you nail it — the world jiggles approving; {ref.first} grows watching.',
      'Critical triumph shakes plush mountains; softness for everyone nearby.',
    ],
    warm: [
      '{ref.first} cheers your impossible win — community softness, festival grin.',
      'You succeed; {ref.name} fattens applauding.',
    ],
    intimate: [
      'Devoted celebration of your roll — you and {ref.first} swell together, blissful.',
      'Your lover is the prize and grows like one.',
    ],
  },
  vast: {
    distant: [
      'Fortune bends continents — reality softens to congratulate you; {ref.first} balloons in the wake.',
      'Critical success at myth scale; abundance cascades.',
    ],
    warm: [
      '{ref.name} leads the cheer as titans triumph — everyone rounder.',
      'You win; the feast continues; friends swell.',
    ],
    intimate: [
      'Devotion meets destiny — critical roll, critical growth, critical kiss.',
      '{ref.first} worships your luck until it becomes flesh.',
    ],
  },
  world: {
    distant: [
      'Fortune bends the realms — reality softens to congratulate you; {ref.first} balloons in the wake.',
      'Critical success at myth scale; abundance cascades',
    ],
    warm: [
      '{ref.name} leads the cheer as titans triumph — everyone rounder',
      'You win; the feast continues; friends swell',
    ],
    intimate: [
      'Devotion meets destiny — critical roll, critical growth, critical kiss',
      '{ref.first} worships your luck until it becomes flesh',
    ],
  },
});
