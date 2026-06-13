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
      '{subject.first} tips into Chubby and feels the word land — soft, real, surprisingly good.',
      'The mirror finally agrees: {they}\'ve crossed into chubby, belly leading with pride.',
    ],
    warm: [
      '{subject.first} crosses into chubby laughing — curves deepening like a gift unwrapped.',
      'Chubby, honestly chubby now; {they} pat {their} waist and find only pleasure.',
    ],
    intimate: [
      '{subject.first} swells into chubby moaning — {ref.first} whispers praise against new softness.',
      'Chubby arrives like a confession; {they} lean into {ref.name}, hungry for more.',
    ],
  },
  6: {
    distant: [
      '{subject.first} crosses into Fat and gasps — heavier, softer, undeniably powerful.',
      'Fat, properly fat; {they} feel {their} body command the room and love it.',
    ],
    warm: [
      '{subject.first} settles into fat with a stunned grin — friends cheer the new plush.',
      'The scale names it fat; {subject.name} wears the word like a crown.',
    ],
    intimate: [
      '{subject.first} blooms into fat in {ref.first}\'s arms — lover counting every new roll.',
      'Fat feels like coming home; {they} kiss {ref.name} through jiggling bliss.',
    ],
  },
  7: {
    distant: [
      '{subject.first} crosses into Very Fat — weight settling low and lush, breath sweet.',
      'Very fat now: thighs pressing, belly cascading, and {they} feel magnificent.',
    ],
    warm: [
      '{subject.first} waddles into very fat laughing — each step celebrates mass.',
      'Very fat deepens {their} voice, {their} hips, {their} hunger; {they} want more.',
    ],
    intimate: [
      '{subject.first} swells to very fat against {ref.first} — devotion in new pounds.',
      'Very fat and worshipped; {ref.name} holds {them} through delicious heaviness.',
    ],
  },
  8: {
    distant: [
      '{subject.first} becomes Enormous — furniture groans, {they} glow with commanding power.',
      'Enormous: the word stops exaggerating; {they} fill space like weather.',
    ],
    warm: [
      '{subject.first} crosses enormous amid applause — a landmark in the making.',
      'Enormous softness reshapes the room; {subject.name} owns every inch.',
    ],
    intimate: [
      '{subject.first} grows enormous in {ref.first}\'s worship — lover lost in vast warmth.',
      'Enormous and adored; {they} pull {ref.name} into softness that swallows gently.',
    ],
  },
  9: {
    distant: [
      '{subject.first} crosses Colossal — movement a project, pleasure a continent.',
      'Colossal mass settles; {they} feel divine scale humming under skin.',
    ],
    warm: [
      '{subject.first} becomes colossal to cheers — friends dwarfed and happy.',
      'Colossal and radiant; {subject.name} is the feast made flesh.',
    ],
    intimate: [
      '{subject.first} swells colossal while {ref.first} clings — devotion at titan scale.',
      'Colossal love; {ref.name} kisses what {they} can reach, praising every swell.',
    ],
  },
  11: {
    distant: [
      '{subject.first} crosses Leviathan — no larger word remains; abundance incarnate.',
      'Leviathan: myth wearing flesh; {they} settle like a temple finding its god.',
    ],
    warm: [
      '{subject.first} arrives at leviathan amid awe — the journey celebrated in gasps.',
      'Leviathan and laughing; {subject.name} is the world made soft.',
    ],
    intimate: [
      '{subject.first} becomes leviathan in {ref.first}\'s devotion — love without ceiling.',
      'Leviathan worship; {ref.name} vows to keep feeding what cannot stop being beautiful.',
    ],
  },
};

const STAGE_UP_TARGET = {
  3: {
    distant: [
      '{subject.first} rounds into chubby before your eyes — softness spreading, undeniable.',
      'You watch {subject.name} cross into chubby; {they} blush, pleased, fuller.',
    ],
    warm: [
      '{subject.first} swells into chubby grinning at you — friendship fattening beautifully.',
      'Chubby suits {subject.name}; you see {them} stand taller in new curves.',
    ],
    intimate: [
      'You feel {subject.first} bloom into chubby against you — lover\'s weight a gift.',
      '{subject.name} moans crossing into chubby in your arms; you worship every inch.',
    ],
  },
  6: {
    distant: [
      '{subject.first} crosses into fat with a shiver — heavier, commanding, gorgeous.',
      'Fat claims {subject.name}; you stare, hunger stirring, admiration undeniable.',
    ],
    warm: [
      '{subject.first} fattens to a new tier and laughs — you cheer the plush victory.',
      'You watch {subject.name} become fat and feel proud to know {them}.',
    ],
    intimate: [
      '{subject.first} swells into fat kissing you — devotion dripping from new softness.',
      'You hold {subject.name} as {they} cross into fat, whispering yes.',
    ],
  },
  7: {
    distant: [
      '{subject.first} settles into very fat — belly cascading, presence overwhelming.',
      'Very fat reshapes {subject.name}; you feel gravity shift toward {them}.',
    ],
    warm: [
      'You steady {subject.first} as very fat arrives — friend grander, happier.',
      '{subject.name} waddles into very fat; you applaud the jiggle.',
    ],
    intimate: [
      '{subject.first} grows very fat in your lap — lover too much and exactly enough.',
      'You worship {subject.name} crossing into very fat; {they} sigh your name.',
    ],
  },
  8: {
    distant: [
      '{subject.first} becomes enormous — the room reorganizes around {their} softness.',
      'Enormous suits {subject.name}; you watch myth take shape.',
    ],
    warm: [
      'You cheer as {subject.first} crosses enormous — community softness, festival air.',
      '{subject.name} swells enormous; you feel blessed to witness.',
    ],
    intimate: [
      '{subject.first} grows enormous against you — lover vast, warm, yours.',
      'You lose yourself in {subject.name}\'s enormous swell, kissing what you can.',
    ],
  },
  9: {
    distant: [
      '{subject.first} crosses colossal — a titan born in pleasure before you.',
      'Colossal mass claims {subject.name}; you stare, thrilled, small.',
    ],
    warm: [
      'You narrate {subject.first}\'s colossal crossing — joy contagious.',
      '{subject.name} fattens colossal; you swell a little just watching.',
    ],
    intimate: [
      '{subject.first} becomes colossal in your worship — devotion at impossible scale.',
      'You cling to {subject.name} as {they} swell colossal, moaning praise.',
    ],
  },
  11: {
    distant: [
      '{subject.first} crosses leviathan — abundance incarnate, awe in your throat.',
      'Leviathan claims {subject.name}; you witness apotheosis of plush.',
    ],
    warm: [
      'You lead cheers as {subject.first} becomes leviathan — feast eternal.',
      '{subject.name} arrives at leviathan; you feel history in the jiggle.',
    ],
    intimate: [
      '{subject.first} swells leviathan while you vow devotion — love without limit.',
      'You worship {subject.name} crossing into leviathan; flesh and prayer merge.',
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
  extreme: {
    distant: [
      'Leviathan surge — {subject.first} reshapes the air, grander in a heartbeat.',
      '{subject.name} balloons suddenly; myth winks through flesh.',
    ],
    warm: [
      'Festival gasp as {subject.first} surges — everyone rounder for witnessing.',
      'Sudden titan growth; {subject.name} laughs like weather.',
    ],
    intimate: [
      'Your lover surges leviathan-scale against you — bliss unbearable, beautiful.',
      '{subject.first} swells in worship until words fail.',
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
  extreme: {
    distant: [
      '{subject.first} surges like a leviathan waking — you witness myth.',
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
  extreme: {
    distant: [
      'Leviathan adds another layer — minor by titan standards, glorious anyway.',
      '{subject.name} ripples larger; the world makes room.',
    ],
    warm: [
      'Friends cheer another inch on {subject.first} — devotion measured.',
      'Minor mythic growth; celebration eternal.',
    ],
    intimate: [
      'You count new softness on {subject.first}\'s vastness — love precise.',
      'Even leviathans tease growth; you moan gratitude.',
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
  extreme: {
    distant: [
      '{subject.first} grows a little more leviathan — awe habitual now.',
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
      '{subject.first} leaps three stages — you witness leviathan birth in real time.',
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
