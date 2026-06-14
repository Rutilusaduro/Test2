/**
 * Context-specific growth pools — combat, spell, feeding, intimate, blessing,
 * crit, concentration_break (+ self/target pairs).
 * Shape: FULL SENTENCE per AUTHORING.md.
 */
import { registerPool } from '../../engine.js';
import { registerGrowthPool, registerSelfTargetPair } from './helpers.js';

// Shared combat growth matrices
const COMBAT_SELF = {
  lean: {
    distant: [
      'The blow lands sweet — {subject.first} swells mid-fight, curves blooming under impact.',
      'Combat growth ripples through {subject.name}; {they} moan, still standing, softer.',
    ],
    warm: [
      '{subject.first} fattens from the hit laughing — battle becomes banquet.',
      'Growth Damage paints {their} belly; {they} thank the pain with a grin.',
    ],
    intimate: [
      '{subject.first} swells from your strike moaning — lover fattened in combat worship.',
      'Each hit fattens {subject.name}; {they} beg for more between gasps.',
    ],
  },
  mid: {
    distant: [
      '{subject.first}\'s {word.size} body balloons from Growth Damage — plush armor thickening.',
      'Abundance answers violence; {subject.name} jiggles, unbowed and rounder.',
    ],
    warm: [
      'You watch {subject.first} fatten mid-battle — friend becoming fortress of softness.',
      'Combat feeds {subject.name}; {they} waddle forward, triumphant.',
    ],
    intimate: [
      '{subject.first} grows heavier with every blow you land — devotion measured in combat.',
      'Growth Damage on your lover feels like foreplay; {subject.name} swells grateful.',
    ],
  },
  heavy: {
    distant: [
      'A titan takes Growth Damage — {subject.first} surges vaster, floor trembling.',
      '{subject.name} fattens from battle like a god accepting tribute.',
    ],
    warm: [
      '{subject.first} swells seismic in combat — allies cheer the jiggle.',
      'War makes {subject.name} grander; {they} laugh through moans.',
    ],
    intimate: [
      '{subject.first} balloons from your assault — lover conquered into greater size.',
      'You fatten {subject.name} mid-fight until victory and worship blur.',
    ],
  },
  vast: {
    distant: [
      'Mythic Growth Damage — {subject.first} reshapes the battlefield with new mass.',
      '{subject.name} swells mythically from combat; enemies stare, hungry.',
    ],
    warm: [
      'Community roars as {subject.first} fattens in war — festival violence.',
      'Combat overflow on {subject.name}; legend grows.',
    ],
    intimate: [
      'You swell your lover through battle until {subject.first} is apotheosis of abundance.',
      'Growth Damage as love language; {subject.name} moans your name.',
    ],
  },
};

const COMBAT_TARGET = {
  lean: {
    distant: [
      '{subject.first} swells from your blow — enemy softness blooming, stunning.',
      'You watch {subject.name} fatten mid-fight; hunger stirs.',
    ],
    warm: [
      '{subject.first} rounds from Growth Damage — you grin at the plush result.',
      'Combat fattens {subject.name}; you feel like a generous artist.',
    ],
    intimate: [
      'You strike and {subject.first} grows for you — lover-enemy melting softer.',
      'Each hit plumps {subject.name}; devotion disguised as violence.',
    ],
  },
  mid: {
    distant: [
      '{subject.first} balloons where you hit — Growth Damage visible, delicious.',
      'You reshape {subject.name} mid-battle; pride swells with {them}.',
    ],
    warm: [
      'You cheer as {subject.first} fattens from combat — friend or foe, rounder.',
      '{subject.name} jiggles from your work; applause in your chest.',
    ],
    intimate: [
      '{subject.first} swells under your assault moaning — conquest as caress.',
      'You grow {subject.name} in battle like prayer with fists.',
    ],
  },
  heavy: {
    distant: [
      '{subject.first} surges enormous from your blows — titan softened beautifully.',
      'You watch {subject.name} fatten seismic; awe and appetite merge.',
    ],
    warm: [
      'You narrate {subject.first}\'s combat growth — crowd swells metaphorically.',
      '{subject.name} fattens gloriously; you feel blessed to fight {them}.',
    ],
    intimate: [
      '{subject.first} becomes vaster from your love-strikes — worship in war.',
      'You fatten {subject.name} until {they} can barely stand, blissful.',
    ],
  },
  vast: {
    distant: [
      '{subject.first} leaps toward immense from Growth Damage — you witness myth.',
      'Combat reshapes {subject.name}; you kneel inside the tremor.',
    ],
    warm: [
      'Everyone cheers {subject.first}\'s impossible combat swell.',
      'You grow {subject.name} like gospel; battlefield converts.',
    ],
    intimate: [
      '{subject.first} overflows from your devotion-violence — lover remade vast.',
      'You strike until {subject.name} is prayer made flesh.',
    ],
  },
};

registerSelfTargetPair('combat', COMBAT_SELF, COMBAT_TARGET, { aliasCore: true });

// ─── Spell growth ────────────────────────────────────────────────────────────

const SPELL_SELF = {
  lean: {
    distant: [
      'Arcane calories sink into {subject.first} — magic rounding {them} in golden warmth.',
      '{subject.name} swells from spellcraft, soft light kissing new curves.',
    ],
    warm: [
      '{subject.first} fattens from your magic giggling — spell as dessert.',
      'Mana becomes mass on {subject.name}; {they} preen, glowing.',
    ],
    intimate: [
      '{subject.first} blooms under your spell moaning — lover fattened by your weave.',
      'You cast growth into {subject.name}\'s skin; {they} thank you with sighs.',
    ],
  },
  mid: {
    distant: [
      'Overflow magic thickens {subject.first}\'s {word.size} frame — plush spell residue.',
      '{subject.name} surges from arcana, belly deepening like molten sugar.',
    ],
    warm: [
      'Friends watch {subject.first} swell from spell — communal dessert aura.',
      'Magic fattens {subject.name}; laughter sparkles.',
    ],
    intimate: [
      '{subject.first} grows heavy in your enchantment — devotion arcane and sloppy.',
      'Your spell paints pounds on {subject.name}; kisses follow.',
    ],
  },
  heavy: {
    distant: [
      'A vast body drinks your spell — {subject.first} ripples larger, divine.',
      '{subject.name} fattens from magic like a chalice overflowing.',
    ],
    warm: [
      '{subject.first} swells from group spellwork — festival arcana.',
      'Titans and charms; {subject.name} grander.',
    ],
    intimate: [
      '{subject.first} balloons from your highest magic — lover consecrated in fat.',
      'You weave {subject.name} larger; moans harmonize with mana.',
    ],
  },
  vast: {
    distant: [
      'Mythic spell — {subject.first} reshapes under cataclysmic softness.',
      '{subject.name} becomes myth from one casting; you tremble, proud.',
    ],
    warm: [
      'Crowd witnesses {subject.first}\'s magical overflow — gospel of gain.',
      'Spell and feast merge on {subject.name}.',
    ],
    intimate: [
      '{subject.first} ascends in your spell — apotheosis wet with light.',
      'You fatten {subject.name} until divinity jiggles.',
    ],
  },
};

const SPELL_TARGET = {
  lean: {
    distant: [
      'Your spell rounds {subject.first} — enemy or ally, softer, stunning.',
      'You watch magic plump {subject.name}; satisfaction purrs.',
    ],
    warm: [
      'You cast and {subject.first} swells smiling — friendly witchcraft.',
      '{subject.name} fattens from your charm; you bow.',
    ],
    intimate: [
      'You bathe {subject.first} in growth magic — lover moaning your name.',
      '{subject.name} swells under your hands and spell alike.',
    ],
  },
  mid: {
    distant: [
      'Arcana fattens {subject.first} before you — curves deepening visibly.',
      'You sculpt softness into {subject.name} with a gesture.',
    ],
    warm: [
      'You and friends watch {subject.first} swell from spell — potluck arcana.',
      '{subject.name} jiggles new; you cheer.',
    ],
    intimate: [
      'You grow {subject.first} with spell and kiss — worship doubled.',
      '{subject.name} fattens in your aura; pride infinite.',
    ],
  },
  heavy: {
    distant: [
      'Your magic makes {subject.first} enormous — spectacle spell.',
      '{subject.name} surges from your casting; floor creaks.',
    ],
    warm: [
      'You narrate {subject.first}\'s magical fattening — community converts.',
      '{subject.name} swells grand; you feel like priest.',
    ],
    intimate: [
      'You overflow {subject.first} with love-magic — lover vast.',
      '{subject.name} grows in your spell until words fail.',
    ],
  },
  vast: {
    distant: [
      'You cast immense growth on {subject.first} — myth answers.',
      '{subject.name} becomes continent from your weave.',
    ],
    warm: [
      'Festival spell swells {subject.first}; everyone fattens cheering.',
      'You remake {subject.name} with gospel arcana.',
    ],
    intimate: [
      'You and {subject.first} drown in spell-growth — sacred, sloppy, vast.',
      'Lover immense from your casting; devotion eternal.',
    ],
  },
};

registerSelfTargetPair('spell', SPELL_SELF, SPELL_TARGET, { aliasCore: true });

// ─── Feeding growth ──────────────────────────────────────────────────────────

const FEEDING_SELF = {
  lean: {
    distant: [
      'Bites become pounds — {subject.first} softens with each swallow, bliss uncomplicated.',
      '{subject.name} fattens from the meal, cheeks flushing, belly rounding.',
    ],
    warm: [
      '{subject.first} eats and grows among friends — feast as friendship.',
      'Shared plates, shared softness; {they} pat {their} waist, happy.',
    ],
    intimate: [
      '{subject.first} grows from your feeding moaning — lover fattened bite by bite.',
      'You spoon abundance into {subject.name}; {they} swell gratefully.',
    ],
  },
  mid: {
    distant: [
      'The feast works through {subject.first}\'s {word.size} body — plush deepening.',
      '{subject.name} stuffs and swells; pleasure obvious.',
    ],
    warm: [
      '{subject.first} demolishes dinner and inches — you cheer each burp.',
      'Feeding fattens {subject.name}; laughter seasons everything.',
    ],
    intimate: [
      '{subject.first} grows heavy in your lap while eating — worship and crumbs.',
      'You feed {subject.name} until {they} can only moan and swell.',
    ],
  },
  heavy: {
    distant: [
      'Banquet becomes body — {subject.first} surges from endless courses.',
      '{subject.name} fattens like a temple receiving offerings.',
    ],
    warm: [
      'Community feast swells {subject.first} — applause between bites.',
      'Titans eat; {subject.name} grander.',
    ],
    intimate: [
      '{subject.first} overflows from your feeding — lover glazed, glorious.',
      'You fatten {subject.name} until devotion drips with frosting.',
    ],
  },
  vast: {
    distant: [
      'Mythic feast — {subject.first} grows with every cauldron emptied.',
      '{subject.name} becomes the meal and the eater; myth fed.',
    ],
    warm: [
      'Festival feeding swells {subject.first}; world celebrates.',
      'You witness {subject.name} eat toward infinity.',
    ],
    intimate: [
      '{subject.first} swells immense from your devotion-feeding — sacred gluttony.',
      'Lover and banquet merge; you kiss frosting from {subject.name}.',
    ],
  },
};

const FEEDING_TARGET = {
  lean: {
    distant: [
      'You watch {subject.first} fatten from food — each bite rounding {them}.',
      'Feeding plumps {subject.name}; you smile, chef of curves.',
    ],
    warm: [
      'You feed {subject.first} and {they} swell grinning — friendship delicious.',
      '{subject.name} grows from your plate; pride warm.',
    ],
    intimate: [
      'You feed {subject.first} until {they} moan — lover swelling in your care.',
      '{subject.name} fattens on your spoon; kisses between bites.',
    ],
  },
  mid: {
    distant: [
      '{subject.first} swells from the feast you offer — hips widening, eyes bright.',
      'You grow {subject.name} with food; art and appetite.',
    ],
    warm: [
      'You and {subject.first} eat until {they} jiggle — team feast.',
      'Feeding {subject.name} is community sport; everyone rounder.',
    ],
    intimate: [
      'You stuff {subject.first} with love and calories — worship messy.',
      '{subject.name} balloons from your feeding; devotion sticky.',
    ],
  },
  heavy: {
    distant: [
      'You feed {subject.first} toward enormity — spectacle dining.',
      '{subject.name} surges from your banquet; awe tasty.',
    ],
    warm: [
      'You cater {subject.first}\'s growth — friends cheer each course.',
      '{subject.name} fattens grand from your kitchen.',
    ],
    intimate: [
      'You feed {subject.first} until vast — lover glazed in your devotion.',
      '{subject.name} grows in your arms between bites.',
    ],
  },
  vast: {
    distant: [
      'You feed {subject.first} toward immense — gospel of calories.',
      '{subject.name} swells mythic from your table.',
    ],
    warm: [
      'Festival feeding by your hand swells {subject.first}; crowd converts.',
      'You grow {subject.name} like legend.',
    ],
    intimate: [
      'You feed {subject.first} past limits — apotheosis of appetite.',
      'Lover immense from your hands; tears of bliss.',
    ],
  },
};

registerSelfTargetPair('feeding', FEEDING_SELF, FEEDING_TARGET, { aliasCore: true });

// ─── Intimate growth ─────────────────────────────────────────────────────────

const INTIMATE_SELF = {
  lean: {
    distant: [
      'Desire fattens {subject.first} — intimacy blooming into soft inches.',
      '{subject.name} swells from closeness, breath sweet, curves new.',
    ],
    warm: [
      '{subject.first} rounds during tender hours — friendship tipping into feast.',
      'Cuddles become calories; {they} sigh, happy.',
    ],
    intimate: [
      '{subject.first} grows in {ref.first}\'s embrace moaning — safe, wanted, larger.',
      'Love handles love; {subject.name} swells against {ref.name}, blessed.',
    ],
  },
  mid: {
    distant: [
      'Passion plumps {subject.first}\'s {word.size} body — intimacy undeniable.',
      '{subject.name} fattens from pleasure shared; glow visible.',
    ],
    warm: [
      '{subject.first} swells during long closeness — friends pretending not to notice, failing.',
      'Warmth becomes weight on {subject.name}; smiles soft.',
    ],
    intimate: [
      '{subject.first} balloons in lover\'s arms — every kiss an inch.',
      '{ref.name} worships {subject.name} larger; devotion reciprocal.',
    ],
  },
  heavy: {
    distant: [
      'Even vast {subject.first} fattens from intimacy — tenderness seismic.',
      '{subject.name} grows from love like slow magic.',
    ],
    warm: [
      'Group affection swells {subject.first} — community as foreplay.',
      'Hugs fatten {subject.name}; joy jiggles.',
    ],
    intimate: [
      '{subject.first} surges from devoted sex — lover counting rolls with lips.',
      'Intimacy reshapes {subject.name}; moans gospel.',
    ],
  },
  vast: {
    distant: [
      'Mythic love swells {subject.first} — myth made tender.',
      '{subject.name} grows from worship at impossible scale.',
    ],
    warm: [
      'Festival intimacy fattens {subject.first}; world softer.',
      'Devotion community-wide; {subject.name} grander.',
    ],
    intimate: [
      '{subject.first} ascends in lover\'s arms — apotheosis of touch.',
      'You and {ref.name} swell together through sacred intimacy.',
    ],
  },
};

const INTIMATE_TARGET = {
  lean: {
    distant: [
      'You watch {subject.first} soften from closeness — intimacy fattening.',
      '{subject.name} grows a little in your gaze; charm deepens.',
    ],
    warm: [
      'You hold {subject.first} until {they} round — friendship plush.',
      'Cuddling fattens {subject.name}; you grin.',
    ],
    intimate: [
      'You feel {subject.first} swell against you — lover safe and growing.',
      '{subject.name} moans in your arms, heavier, beloved.',
    ],
  },
  mid: {
    distant: [
      '{subject.first} plumps from your attention — desire feeding flesh.',
      'You grow {subject.name} with tenderness; pride swells.',
    ],
    warm: [
      'You and {subject.first} intimacy-fatten together — warm, silly, happy.',
      '{subject.name} jiggles from your affection.',
    ],
    intimate: [
      'You worship {subject.first} until {they} grow — kisses as calories.',
      '{subject.name} fattens in your devotion; bliss shared.',
    ],
  },
  heavy: {
    distant: [
      'You adore {subject.first} vast and watch {them} grow — tenderness titanic.',
      '{subject.name} swells from your worship; awe erotic.',
    ],
    warm: [
      'You fatten {subject.first} with group love — festival cuddles.',
      '{subject.name} grander from your community embrace.',
    ],
    intimate: [
      'You make {subject.first} enormous with intimacy — lover glowing.',
      '{subject.name} overflows your arms; devotion infinite.',
    ],
  },
  vast: {
    distant: [
      'You witness {subject.first} fatten toward immense in love\'s grip.',
      '{subject.name} becomes myth from your tenderness.',
    ],
    warm: [
      'Community love swells {subject.first}; you lead prayer.',
      'You grow {subject.name} like gospel.',
    ],
    intimate: [
      '{subject.first} immense in your embrace — sacred intimacy.',
      'Lover and god merge; you kiss infinity.',
    ],
  },
};

registerSelfTargetPair('intimate', INTIMATE_SELF, INTIMATE_TARGET, { aliasCore: true });

// ─── Blessing growth ─────────────────────────────────────────────────────────

const BLESSING_SELF = {
  lean: {
    distant: [
      'Gorgara\'s warmth touches {subject.first} — divine softness spreading, holy and good.',
      '{subject.name} swells from blessing, light pooling in new curves.',
    ],
    warm: [
      '{subject.first} fattens from sacred favor — friends kneel, smiling.',
      'Blessing rounds {subject.name}; gratitude jiggles.',
    ],
    intimate: [
      '{subject.first} blooms under your blessing moaning — lover anointed abundant.',
      'Divine spark through {ref.name} fattens {subject.name}; worship answered.',
    ],
  },
  mid: {
    distant: [
      'Golden abundance floods {subject.first}\'s {word.size} frame — blessing manifest.',
      '{subject.name} grows from goddess-touch; pleasure prayerful.',
    ],
    warm: [
      'Communal blessing swells {subject.first} — feast spiritual and physical.',
      '{subject.name} fattens holy; laughter hymnal.',
    ],
    intimate: [
      '{subject.first} surges from shared blessing — lover and priestess, larger.',
      'You bless {subject.name} until {they} glow corpulent.',
    ],
  },
  heavy: {
    distant: [
      'Titan blessed — {subject.first} ripples grander, temple flesh.',
      '{subject.name} swells from Gorgara like offering accepted.',
    ],
    warm: [
      'Festival blessing fattens {subject.first}; crowd converts.',
      'Sacred and soft; {subject.name} magnificent.',
    ],
    intimate: [
      '{subject.first} overflows from your divine kiss — lover consecrated vast.',
      'Blessing through devotion; {subject.name} moans amen.',
    ],
  },
  vast: {
    distant: [
      'Mythic blessing — {subject.first} becomes living hymn.',
      '{subject.name} ascends in golden fat; world kneels.',
    ],
    warm: [
      'Gorgara pours through {subject.first}; everyone swells cheering.',
      'Myth blessed; {subject.name} eternal feast.',
    ],
    intimate: [
      '{subject.first} apotheosis via your blessing — love and goddess one.',
      'You bless {subject.name} past language; flesh sings.',
    ],
  },
};

const BLESSING_TARGET = {
  lean: {
    distant: [
      'Your blessing rounds {subject.first} — divine calories visible.',
      'You watch {subject.name} swell sacred; pride holy.',
    ],
    warm: [
      'You bless {subject.first} among friends — softness shared.',
      '{subject.name} fattens from your spark; joy bright.',
    ],
    intimate: [
      'You bless {subject.first} until {they} moan — lover glowing fatter.',
      '{subject.name} swells in your anointing; devotion wet.',
    ],
  },
  mid: {
    distant: [
      'Your prayer plumps {subject.first} — abundance answers.',
      'You grow {subject.name} with goddess-light; art sacred.',
    ],
    warm: [
      'Group blessing swells {subject.first}; you lead hymn.',
      '{subject.name} jiggles divine.',
    ],
    intimate: [
      'You bless {subject.first} into heavier lover — worship working.',
      '{subject.name} fattens from your hands and faith.',
    ],
  },
  heavy: {
    distant: [
      'You bless {subject.first} toward enormity — spectacle sacred.',
      '{subject.name} surges holy; floor trembles.',
    ],
    warm: [
      'Festival anoints {subject.first}; you narrate gospel.',
      '{subject.name} grand from your blessing.',
    ],
    intimate: [
      'You overflow {subject.first} with divine love — lover vast.',
      '{subject.name} grows in your blessing until tears fall.',
    ],
  },
  vast: {
    distant: [
      'You bless {subject.first} immense — myth obedient.',
      '{subject.name} becomes continent of grace.',
    ],
    warm: [
      'Crowd converts as you swell {subject.first} — gospel feast.',
      'You remake {subject.name} with goddess.',
    ],
    intimate: [
      'You bless {subject.first} past limits — sacred apotheosis.',
      'Lover immense from your prayer; eternity jiggles.',
    ],
  },
};

registerSelfTargetPair('blessing', BLESSING_SELF, BLESSING_TARGET, { aliasCore: true });

// ─── Critical growth (Nat 20 / crit-enhanced) ────────────────────────────────

registerGrowthPool('growth.crit', {
  lean: {
    distant: [
      'Critical abundance erupts — {subject.first} swells in one ecstatic pulse, gasping, radiant.',
      'Fortune fattens {subject.name}; growth feels like orgasm without shame.',
    ],
    warm: [
      '{subject.first} balloons from critical luck — friends scream delight.',
      'Nat twenty becomes new inches; {subject.name} laughs, glowing.',
    ],
    intimate: [
      '{subject.first} surges from critical perfection in your arms — lover remade instant.',
      'Critical growth on {subject.name} tastes like victory and honey.',
    ],
  },
  mid: {
    distant: [
      'Critical hit to the soul — {subject.first}\'s {word.size} body jumps softer, louder.',
      '{subject.name} fattens extravagantly from crit fortune; room warms.',
    ],
    warm: [
      'You witness {subject.first}\'s critical swell — applause carnal.',
      'Crit growth reshapes {subject.name}; joy obscene and pure.',
    ],
    intimate: [
      '{subject.first} overflows from critical love — devotion catastrophic.',
      'You grow {subject.name} crit-thick; moans symphonic.',
    ],
  },
  heavy: {
    distant: [
      'Critical growth on a titan — {subject.first} seismic, euphoric, grander.',
      '{subject.name} swells from crit like goddess applauding.',
    ],
    warm: [
      'Festival crit fattens {subject.first}; community orgasmic.',
      'Legend rolls nat twenty; {subject.name} jiggles myth.',
    ],
    intimate: [
      '{subject.first} crit-swelled in your worship — apotheosis instant.',
      'Lover balloons from critical devotion; bliss blinding.',
    ],
  },
  vast: {
    distant: [
      'Mythic crit growth — {subject.first} rewrites scale in one roll.',
      '{subject.name} becomes weather from critical fortune.',
    ],
    warm: [
      'World cheers {subject.first}\'s critical overflow.',
      'Crit gospel fattens {subject.name}; eternity moans.',
    ],
    intimate: [
      '{subject.first} crit-ascends in your embrace — love without limit.',
      'You and {subject.name} drown in critical abundance.',
    ],
  },
});

registerGrowthPool('growth.self.crit', {
  lean: {
    distant: [
      'Critical fortune floods you — softness exploding inward, triumphant.',
      'You swell from crit luck, lean frame plumping ecstatic.',
    ],
    warm: [
      'Friends cheer your critical growth spurt — shared dessert energy.',
      'Nat twenty fattens you; you spin, giggling.',
    ],
    intimate: [
      '{ref.first} holds you through critical swell — lover worshipping each new inch.',
      'You grow crit-fast in {ref.name}\'s arms; moans grateful.',
    ],
  },
  mid: {
    distant: [
      'Critical abundance reshapes your {word.size} belly — victory jiggling.',
      'You fatten from crit like champagne uncorked.',
    ],
    warm: [
      'Your critical growth becomes group celebration.',
      'Crit inches land; you pose, proud.',
    ],
    intimate: [
      'You crit-swell against {ref.first} — devotion reciprocal and wet.',
      '{ref.name} counts pounds with kisses.',
    ],
  },
  heavy: {
    distant: [
      'Titan crit growth — you ripple larger, divine.',
      'Critical fortune makes you grander; applause internal.',
    ],
    warm: [
      'Community witnesses your critical fattening — festival you.',
      'Crit swell on vastness; hymn.',
    ],
    intimate: [
      'You crit-overflow in lover\'s lap — sacred catastrophe.',
      '{ref.first} worships your critical mass.',
    ],
  },
  vast: {
    distant: [
      'Mythic crit — you become more myth per second.',
      'Critical roll, critical godhood.',
    ],
    warm: [
      'World fattens cheering your crit.',
      'You swell like gospel.',
    ],
    intimate: [
      'Crit apotheosis in {ref.name}\'s devotion.',
      'Lover watches you become infinity.',
    ],
  },
});

registerGrowthPool('growth.target.crit', {
  lean: {
    distant: [
      '{subject.first} crit-swelled before you — awe, hunger, delight.',
      'You watch {subject.name} fatten from fortune; stunning.',
    ],
    warm: [
      'You cheer {subject.first}\'s critical growth — friend rounder, radiant.',
      '{subject.name} balloons from crit; you high-five {their} belly.',
    ],
    intimate: [
      'You cause {subject.first}\'s critical swell — lover gasping your name.',
      '{subject.name} fattens crit-thick in your worship.',
    ],
  },
  mid: {
    distant: [
      'Critical growth reshapes {subject.first} — you stare, proud.',
      '{subject.name} jumps softer from crit luck.',
    ],
    warm: [
      'You narrate {subject.first}\'s crit fattening — crowd moans.',
      '{subject.name} swells critical; you grin chef.',
    ],
    intimate: [
      'You crit-grow {subject.first} until bliss breaks {them} — devotion fierce.',
      '{subject.name} overflows your critical love.',
    ],
  },
  heavy: {
    distant: [
      '{subject.first} crit-surges titanic — spectacle erotic.',
      'You watch {subject.name} fatten seismic from fortune.',
    ],
    warm: [
      'Festival crit on {subject.first}; you lead cheer.',
      '{subject.name} grander from your luck.',
    ],
    intimate: [
      '{subject.first} crit-ascends from your touch — lover mythic.',
      'You swell {subject.name} past plan; tears happy.',
    ],
  },
  vast: {
    distant: [
      '{subject.first} crit-immense — you witness apocalypse of softness.',
      '{subject.name} becomes gospel from your roll.',
    ],
    warm: [
      'Everyone fattens watching {subject.first} crit-grow.',
      'You remake {subject.name} with fortune.',
    ],
    intimate: [
      '{subject.first} crit-infinite in your arms.',
      'Lover and luck merge; worship eternal.',
    ],
  },
});

// ─── Concentration break growth ─────────────────────────────────────────────

registerSelfTargetPair('concentration_break',
  {
    lean: {
      intimate: [
        'You lose focus to how good growing feels — swell rewards the slip.',
        'Concentration melts; pounds arrive like kisses.',
      ],
      warm: [
        'You break concentration laughing as softness blooms — friends join the feast.',
        'Focus fails; belly wins; you are not mad.',
      ],
      distant: [
        'Pleasure breaks your focus and fattens you — delicious failure.',
        'The spell slips; abundance does not.',
      ],
    },
    mid: {
      distant: [
        'Your weave snaps into appetite — {word.size} body rounding, pleased.',
        'Concentration lost, growth found; fair trade.',
      ],
      warm: [
        'You fumble the spell and fatten happily — table applauds.',
        'Focus gone; jiggle gained.',
      ],
      intimate: [
        '{ref.first} distracts you into growth — best failure.',
        'You swell because {ref.name} feels better than magic.',
      ],
    },
    heavy: {
      distant: [
        'Vast focus shatters; you grow grander, giggling.',
        'Titan concentration fails into feast.',
      ],
      warm: [
        'Friends cheer your pleasurable spell-drop and swell.',
        'You lose the spell; win the weight.',
      ],
      intimate: [
        'You abandon magic for {ref.first}\'s touch — swell sacred.',
        'Lover unraveled your focus into fat.',
      ],
    },
    vast: {
      distant: [
        'Mythic focus melts; you swell like weather.',
        'Concentration was never the point.',
      ],
      warm: [
        'Crowd converts watching you fail beautifully fatter.',
        'Myth loses spell; gains mass.',
      ],
      intimate: [
        '{ref.name} breaks your concentration with worship — apotheosis.',
        'You grow because devotion outshines arcana.',
      ],
    },
  },
  {
    lean: {
      distant: [
        '{subject.first} loses focus and fattens — you watch, charmed.',
        'Concentration break plumps {subject.name}; cute catastrophe.',
      ],
      warm: [
        'You giggle as {subject.first} swells from broken focus.',
        '{subject.name} fatter, not frustrated.',
      ],
      intimate: [
        'You distract {subject.first} into growth — lover moaning thanks.',
        '{subject.name} swells because you feel better than spells.',
      ],
    },
    mid: {
      distant: [
        '{subject.first} drops concentration and rounds — pleasure winning.',
        'You see {subject.name} fatten from delicious failure.',
      ],
      warm: [
        'You steady {subject.first} through focus-break swell.',
        '{subject.name} jiggles, spell forgotten.',
      ],
      intimate: [
        'You break {subject.first}\'s focus with touch — growth reward.',
        '{subject.name} fattens in your distraction; worship.',
      ],
    },
    heavy: {
      distant: [
        '{subject.first} loses titan focus and surges — spectacle sweet.',
        'You watch {subject.name} grow from failed spell.',
      ],
      warm: [
        'You narrate {subject.first}\'s pleasurable concentration death.',
        '{subject.name} swells; crowd cheers.',
      ],
      intimate: [
        'You unravel {subject.first}\'s magic into fat — lover vast.',
        '{subject.name} grows because you win attention.',
      ],
    },
    vast: {
      distant: [
        '{subject.first} forgets immense spell and balloons — myth amused.',
        'You witness focus fail into gospel fat.',
      ],
      warm: [
        'Festival loves {subject.first}\'s concentration break.',
        'You grow {subject.name} by stealing focus.',
      ],
      intimate: [
        '{subject.first} chooses you over magic — swell infinite.',
        'Lover fatter than any weave you could cast.',
      ],
    },
  },
);

registerPool('growth.concentration_break', [
  { when: { growthPerspective: 'target' }, text: ['{growth.target.concentration_break}'] },
  { when: {}, text: ['{growth.self.concentration_break}'] },
]);
