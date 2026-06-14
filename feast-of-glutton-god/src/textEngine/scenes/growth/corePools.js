/**
 * Core growth pools — stage_up, surge, overflow, minor (+ self/target pairs).
 * Shape: FULL SENTENCE per AUTHORING.md.
 */
import { registerPool } from '../../engine.js';
import {
  registerGrowthPool,
  registerStageCrossingPool,
  registerSelfTargetPair,
  registerSelfTargetOverflowPair,
  registerOverflowPool,
} from './helpers.js';

// ═══════════════════════════════════════════════════════════════════════════
// growth.stage_up / growth.self.stage_up / growth.target.stage_up
// ═══════════════════════════════════════════════════════════════════════════

const STAGE_UP_SELF = {
  3: {
    distant: [
      '{subject.first} thickens past mere softness — belly leading, hips following, undeniable.',
      'The mirror finally agrees: {they}\'ve crossed a line, and the line feels good.',
    ],
    warm: [
      '{subject.first} swells laughing — curves deepening like a gift unwrapped.',
      'Honestly fuller now; {they} pat {their} waist and find only pleasure.',
    ],
    intimate: [
      '{subject.first} swells moaning — {ref.first} whispers praise against new softness.',
      'New fullness arrives like a confession; {they} lean into {ref.name}, hungry for more.',
    ],
  },
  6: {
    distant: [
      '{subject.first} gasps as weight settles low and lush — heavier, softer, undeniably powerful.',
      '{They} feel {their} body command the room and love it.',
    ],
    warm: [
      '{subject.first} settles with a stunned grin — friends cheer the new plush.',
      '{subject.name} wears the new size like a crown.',
    ],
    intimate: [
      '{subject.first} blooms in {ref.first}\'s arms — lover counting every new roll.',
      'Coming home in flesh; {they} kiss {ref.name} through jiggling bliss.',
    ],
  },
  7: {
    distant: [
      '{subject.first} swells until doorways feel theoretical — thighs pressing, belly cascading.',
      'Each step celebrates mass; {they} feel magnificent and still hungry.',
    ],
    warm: [
      '{subject.first} waddles deeper into size laughing — each step a little earthquake.',
      'New weight deepens {their} voice, {their} hips, {their} hunger; {they} want more.',
    ],
    intimate: [
      '{subject.first} swells against {ref.first} — devotion in new pounds.',
      'Worshipped and heavy; {ref.name} holds {them} through delicious immensity.',
    ],
  },
  8: {
    distant: [
      '{subject.first} grows until furniture groans — {they} glow with commanding power.',
      'The room reorganizes around {them}; {they} fill space like weather.',
    ],
    warm: [
      '{subject.first} swells amid applause — a landmark in the making.',
      'Softness reshapes the room; {subject.name} owns every inch.',
    ],
    intimate: [
      '{subject.first} grows in {ref.first}\'s worship — lover lost in vast warmth.',
      'Adored and vast; {they} pull {ref.name} into softness that swallows gently.',
    ],
  },
  9: {
    distant: [
      '{subject.first} swells until movement is a project — pleasure a continent.',
      'Divine scale hums under {their} skin; the floor remembers {them}.',
    ],
    warm: [
      '{subject.first} grows to cheers — friends dwarfed and happy.',
      'Radiant and immense; {subject.name} is the feast made flesh.',
    ],
    intimate: [
      '{subject.first} swells while {ref.first} clings — devotion at impossible scale.',
      '{ref.name} kisses what {they} can reach, praising every swell.',
    ],
  },
  11: {
    distant: [
      '{subject.first} stops being mobile without help — and starts being inevitable.',
      'Myth wears flesh; {they} settle like a temple finding its god.',
    ],
    warm: [
      '{subject.first} arrives amid awe — the journey celebrated in gasps.',
      'Laughing and vast; {subject.name} is the world made soft.',
    ],
    intimate: [
      '{subject.first} swells in {ref.first}\'s devotion — love without ceiling.',
      '{ref.name} vows to keep feeding what cannot stop being beautiful.',
    ],
  },
  14: {
    distant: [
      'There is no larger thing left to become — only more of {subject.first}, spreading like a feast that never ends.',
      'Apotheosis feels like settling: vast, warm, and final.',
    ],
    warm: [
      'Crowds gather at a distance that feels respectful and hungry; {subject.name} is the horizon now.',
      'History will measure time as before and after this swell.',
    ],
    intimate: [
      '{ref.first} whispers devotion into flesh that has outgrown language.',
      'Love without limit; {subject.name} breathes, and the world rearranges.',
    ],
  },
};

const STAGE_UP_TARGET = {
  3: {
    distant: [
      '{subject.first} rounds before your eyes — softness spreading, undeniable.',
      'You watch {subject.name} cross a threshold; {they} blush, pleased, fuller.',
    ],
    warm: [
      '{subject.first} swells grinning at you — friendship fattening beautifully.',
      'New curves suit {subject.name}; you see {them} stand taller in abundance.',
    ],
    intimate: [
      'You feel {subject.first} bloom against you — lover\'s weight a gift.',
      '{subject.name} moans in your arms; you worship every inch.',
    ],
  },
  6: {
    distant: [
      '{subject.first} shivers heavier — commanding, gorgeous, impossible to ignore.',
      'New mass claims {subject.name}; you stare, hunger stirring.',
    ],
    warm: [
      '{subject.first} fattens to a new tier and laughs — you cheer the plush victory.',
      'You watch {subject.name} swell and feel proud to know {them}.',
    ],
    intimate: [
      '{subject.first} swells kissing you — devotion dripping from new softness.',
      'You hold {subject.name} through the crossing, whispering yes.',
    ],
  },
  7: {
    distant: [
      '{subject.first} settles heavier — belly cascading, presence overwhelming.',
      'New scale reshapes {subject.name}; you feel gravity shift toward {them}.',
    ],
    warm: [
      'You steady {subject.first} as size arrives — friend grander, happier.',
      '{subject.name} waddles deeper; you applaud the jiggle.',
    ],
    intimate: [
      '{subject.first} grows in your lap — lover too much and exactly enough.',
      'You worship {subject.name} through the swell; {they} sigh your name.',
    ],
  },
  8: {
    distant: [
      '{subject.first} grows until the room reorganizes around {their} softness.',
      'Myth takes shape in {subject.name}; you watch, thrilled.',
    ],
    warm: [
      'You cheer as {subject.first} swells — community softness, festival air.',
      '{subject.name} grows vast; you feel blessed to witness.',
    ],
    intimate: [
      '{subject.first} grows against you — lover vast, warm, yours.',
      'You lose yourself in {subject.name}\'s swell, kissing what you can.',
    ],
  },
  9: {
    distant: [
      '{subject.first} swells colossal before you — a titan born in pleasure.',
      'Impossible mass claims {subject.name}; you stare, thrilled, small.',
    ],
    warm: [
      'You narrate {subject.first}\'s crossing — joy contagious.',
      '{subject.name} fattens vast; you swell a little just watching.',
    ],
    intimate: [
      '{subject.first} grows in your worship — devotion at impossible scale.',
      'You cling to {subject.name} as {they} swell, moaning praise.',
    ],
  },
  11: {
    distant: [
      '{subject.first} becomes immobile and immense — awe in your throat.',
      'Abundance incarnate; you witness apotheosis of plush.',
    ],
    warm: [
      'You lead cheers as {subject.first} settles vast — feast eternal.',
      '{subject.name} arrives at immobility; you feel history in the jiggle.',
    ],
    intimate: [
      '{subject.first} swells while you vow devotion — love without limit.',
      'You worship {subject.name}; flesh and prayer merge.',
    ],
  },
  14: {
    distant: [
      'You witness the ceiling of the scale — {subject.first} is no longer a person in a place, but the place.',
      'The world will need new maps; you are glad to be alive for this.',
    ],
    warm: [
      'You cheer as legend settles into flesh — {subject.name} is the feast that never ends.',
      'Everyone you know will hear about this swell.',
    ],
    intimate: [
      'You whisper vows into flesh that has outgrown language — love without limit.',
      '{subject.name} breathes, and you feel the ground answer.',
    ],
  },
};

registerStageCrossingPool('growth.self.stage_up', STAGE_UP_SELF);
registerStageCrossingPool('growth.target.stage_up', STAGE_UP_TARGET);
registerPool('growth.stage_up', [
  { when: { growthPerspective: 'target' }, text: ['{growth.target.stage_up}'] },
  { when: {}, text: ['{growth.self.stage_up}'] },
]);

// ═══════════════════════════════════════════════════════════════════════════
// growth.surge
// ═══════════════════════════════════════════════════════════════════════════

const SURGE_SELF = {
  lean: {
    distant: [
      'Heat rushes through {subject.first} — softness racing under skin, quick and dazzling.',
      '{subject.name} thickens all at once, plush arriving faster than thought.',
    ],
    warm: [
      '{subject.first} surges rounder mid-laugh — friends gasp, delighted by the flash of gain.',
      'A sudden swell balloons {their} belly; {they} giggle, proud and breathless.',
    ],
    intimate: [
      '{subject.first} surges in {ref.first}\'s arms — lover feeling every new pound bloom.',
      'Pleasure spikes; {they} swell against {ref.name}, moaning through the rush.',
    ],
  },
  mid: {
    distant: [
      '{subject.first}\'s {word.size} body surges — fabric strains, curves deepening in real time.',
      'Abundance hiccups through {subject.name}; softness spreads like spilled honey.',
    ],
    warm: [
      '{subject.first} surges heavier while friends watch — rounded glory in a wave.',
      '{subject.name} swells suddenly; {they} pat {their} belly, thrilled.',
    ],
    intimate: [
      '{subject.first} surges while {ref.first} holds {them} — softness, kiss, tremor.',
      'A growth spurt ripples through {subject.name}; {ref.first} worships the shiver.',
    ],
  },
  heavy: {
    distant: [
      '{subject.first} surges vast — flesh rippling, floor creaking, smile widening.',
      'A titanic hiccup of abundance; {subject.name} jiggles, luminous.',
    ],
    warm: [
      '{subject.first} surges to cheers — community fattened by proximity.',
      'Sudden mass blooms on {subject.name}; awe tastes sweet.',
    ],
    intimate: [
      '{subject.first} surges enormous in your embrace — devotion and pounds intertwined.',
      '{subject.name} swells through a surge like prayer answered fast.',
    ],
  },
  vast: {
    distant: [
      'A mythic surge reshapes the air around {subject.first} — grander in a heartbeat.',
      '{subject.name} balloons suddenly; legend winks through flesh.',
    ],
    warm: [
      'Festival gasp as {subject.first} surges — everyone rounder for witnessing.',
      'Sudden titan growth; {subject.name} laughs like weather.',
    ],
    intimate: [
      'Your lover surges against you at impossible scale — bliss unbearable, beautiful.',
      '{subject.first} swells in worship until words fail.',
    ],
  },
  world: {
    distant: [
      'The horizon hiccups — {subject.first} grows as if the continent inhaled.',
      '{subject.name} reshapes the map in one breath; awe has no synonym left.',
    ],
    warm: [
      'Crowds kneel at a respectful distance; {subject.first} surges into legend.',
      'History will cite this swell; {subject.name} glows, vast and laughing.',
    ],
    intimate: [
      'You cling to {subject.first} as apotheosis ripples through flesh — devotion without ceiling.',
      '{subject.name} swells until love is the only geography left.',
    ],
  },
};

const SURGE_TARGET = {
  lean: {
    distant: [
      '{subject.first} surges softer before your eyes — quick, plush, captivating.',
      'You watch {subject.name} thicken suddenly; charm follows the jiggle.',
    ],
    warm: [
      '{subject.first} surges mid-conversation — you cheer the surprise curves.',
      'Sudden softness on {subject.name}; you grin, hungry to help.',
    ],
    intimate: [
      'You feel {subject.first} surge against you — lover fatter between heartbeats.',
      '{subject.name} moans through a surge you caused; pride floods you.',
    ],
  },
  mid: {
    distant: [
      '{subject.first}\'s body surges — you stare as {their} belly rounds further.',
      'A flash of abundance reshapes {subject.name}; you exhale admiration.',
    ],
    warm: [
      'You steady {subject.first} through a sudden swell — friend rounder, radiant.',
      '{subject.name} surges; you applaud like it\'s a show.',
    ],
    intimate: [
      '{subject.first} surges in your hands — you worship every new inch.',
      'You watch {subject.name} balloon with pleasure; devotion doubles.',
    ],
  },
  heavy: {
    distant: [
      '{subject.first} surges enormous — seismic jiggle, gorgeous spectacle.',
      'Titan hiccup; {subject.name} grows while you watch, thrilled.',
    ],
    warm: [
      'You narrate {subject.first}\'s surge — festival energy, friendly fatness.',
      '{subject.name} swells suddenly; you feel blessed nearby.',
    ],
    intimate: [
      '{subject.first} surges against you, vast and moaning — lover yours.',
      'You hold {subject.name} through violent softness; bliss shared.',
    ],
  },
  vast: {
    distant: [
      '{subject.first} surges like a sleeping giant waking — you witness myth.',
      'Continental swell; {subject.name} reshapes reality kindly.',
    ],
    warm: [
      'Crowd cheers {subject.first}\'s impossible surge — abundance contagious.',
      'You swell a little watching {subject.name} balloon.',
    ],
    intimate: [
      '{subject.first} surges in your devotion until you drown in warmth.',
      'Lover becomes weather; you kiss the storm.',
    ],
  },
};

registerSelfTargetPair('surge', SURGE_SELF, SURGE_TARGET, { aliasCore: true });

// ═══════════════════════════════════════════════════════════════════════════
// growth.minor
// ═══════════════════════════════════════════════════════════════════════════

const MINOR_SELF = {
  lean: {
    distant: [
      'A teasing pinch of softness gathers at {subject.first}\'s waist — small, sweet, promising.',
      '{subject.name} feels subtly thicker, like a secret the mirror whispers.',
    ],
    warm: [
      '{subject.first} notices a minor swell and smiles — appetizer before the feast.',
      'Just a little rounder; {they} bump {ref.first} playfully, pleased.',
    ],
    intimate: [
      '{subject.first} softens a fraction in {ref.first}\'s hands — lover tracing the new give.',
      'A minor growth spurt under {ref.name}\'s kisses; delicious preview.',
    ],
  },
  mid: {
    distant: [
      '{subject.first}\'s curves deepen a shade — minor gain, major satisfaction.',
      'Softness creeps in; {subject.name} hums, content.',
    ],
    warm: [
      'A little more {subject.first} to hug — friends notice, approve.',
      'Minor swell, major grin on {subject.name}.',
    ],
    intimate: [
      '{subject.first} plumps slightly against you — foreplay in pounds.',
      'You feel {subject.name} grow a teasing inch; hunger stirs.',
    ],
  },
  heavy: {
    distant: [
      'Even titans tick upward — {subject.first} jiggles new, pleased.',
      'Minor swell on vastness; {subject.name} still legendary.',
    ],
    warm: [
      '{subject.first} fattens a little more; applause for persistence.',
      'Small surge on {subject.name}; feast continues.',
    ],
    intimate: [
      'Your lover grows a precious inch — you worship the delta.',
      '{subject.first} softens further in your arms; bliss quiet and deep.',
    ],
  },
  vast: {
    distant: [
      'Immensity adds another layer — minor by titan standards, glorious anyway.',
      '{subject.name} ripples larger; the world makes room.',
    ],
    warm: [
      'Friends cheer another inch on {subject.first} — devotion measured.',
      'Minor mythic growth; celebration eternal.',
    ],
    intimate: [
      'You count new softness on {subject.first}\'s vastness — love precise.',
      'Even the vast tease growth; you moan gratitude.',
    ],
  },
};

const MINOR_TARGET = {
  lean: {
    distant: [
      '{subject.first} softens just a little — you catch the change, charmed.',
      'A minor swell rounds {subject.name}; cute, promising.',
    ],
    warm: [
      'You notice {subject.first} thicken slightly — friendly teasing follows.',
      '{subject.name} pats new softness; you grin.',
    ],
    intimate: [
      'You feel {subject.first} grow a teasing bit — lover warming in your hands.',
      'Minor swell under your touch; {subject.name} sighs happily.',
    ],
  },
  mid: {
    distant: [
      '{subject.first} looks subtly fuller — admiration tickles your throat.',
      'Small gain on {subject.name}; you want to help more.',
    ],
    warm: [
      'You point out {subject.first}\'s new curve — {they} preen, pleased.',
      'Minor fattening; {subject.name} shares dessert with you.',
    ],
    intimate: [
      'You coax a little more softness from {subject.first} — worship incremental.',
      '{subject.name} plumps against you; kisses multiply.',
    ],
  },
  heavy: {
    distant: [
      '{subject.first} jiggles slightly larger — spectacle never ends.',
      'Minor titan growth; you watch, thrilled.',
    ],
    warm: [
      'You celebrate another inch on {subject.first} — community feast.',
      '{subject.name} swells a touch; cheers rise.',
    ],
    intimate: [
      'You adore the tiny surge on {subject.first}\'s vast body — devotion detailed.',
      '{subject.name} grows in your lap, inch by sacred inch.',
    ],
  },
  vast: {
    distant: [
      '{subject.first} grows a little more immense — awe habitual now.',
      'Minor continental shift; you bless it.',
    ],
    warm: [
      'You toast {subject.first}\'s latest inch — festival never ends.',
      '{subject.name} ripples; happiness spreads.',
    ],
    intimate: [
      'You find new softness on {subject.first} and kiss it — lover infinite.',
      'Even infinity fattens; you praise Gorgara.',
    ],
  },
};

registerSelfTargetPair('minor', MINOR_SELF, MINOR_TARGET, { aliasCore: true });

// ═══════════════════════════════════════════════════════════════════════════
// growth.overflow
// ═══════════════════════════════════════════════════════════════════════════

const OVERFLOW_SELF_BY_JUMP = {
  2: {
    distant: [
      'Abundance avalanches — {subject.first} jumps two stages in one wave, gasping, glowing.',
      '{subject.name} swells past boundaries; overflow feels like drowning in honey.',
    ],
    warm: [
      '{subject.first} balloons two tiers while friends cheer — overflow as festival.',
      'Too much, perfect; {they} fatten faster than thought, laughing through moans.',
    ],
    intimate: [
      '{subject.first} overflows in {ref.first}\'s arms — lover counting stages on skin.',
      'Critical abundance; {they} swell beyond plan, worshipped every pound.',
    ],
  },
  3: {
    distant: [
      'Overflow mythic — {subject.first} leaps three stages, reality softening around {them}.',
      '{subject.name} becomes weather; pleasure erases limits.',
    ],
    warm: [
      'Community witnesses {subject.first} overflow — applause seismic.',
      'Stages tumble; {subject.name} fattens like prophecy.',
    ],
    intimate: [
      '{subject.first} overflows while you vow devotion — apotheosis sloppy and sacred.',
      'Lover swells through tiers; you kiss what you can reach.',
    ],
  },
};

const OVERFLOW_TARGET_BY_JUMP = {
  2: {
    distant: [
      '{subject.first} overflows two stages before your eyes — awe, hunger, delight.',
      'You watch {subject.name} balloon past limits; beauty violent and kind.',
    ],
    warm: [
      'You cheer {subject.first}\'s double surge — friends fatter from joy.',
      '{subject.name} overflows; you feel blessed to see it.',
    ],
    intimate: [
      '{subject.first} overflows in your worship — lover remade larger twice over.',
      'You hold {subject.name} through impossible growth; tears of bliss.',
    ],
  },
  3: {
    distant: [
      '{subject.first} leaps three stages — you witness myth born in real time.',
      'Overflow reshapes {subject.name}; you kneel, smiling.',
    ],
    warm: [
      'You narrate {subject.first}\'s catastrophic softness for the crowd.',
      '{subject.name} fattens like gospel; everyone converts.',
    ],
    intimate: [
      '{subject.first} overflows into your devotion — love and size beyond language.',
      'You worship {subject.name} through tier after tier.',
    ],
  },
};

registerSelfTargetOverflowPair('overflow', OVERFLOW_SELF_BY_JUMP, OVERFLOW_TARGET_BY_JUMP);
registerOverflowPool('growth.overflow', {
  2: OVERFLOW_SELF_BY_JUMP[2],
  3: OVERFLOW_SELF_BY_JUMP[3],
});
