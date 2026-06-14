// ═══════════════════════════════════════════════════════════════
// SCENE: COMBAT DM — pre-fight intro & post-fight wrap-up
// Multi-beat Mercer-style narration keyed on region, enemy type,
// size band, and encounter outcome.
// ═══════════════════════════════════════════════════════════════
import { registerPool, createContext, render } from '../../engine.js';
import '../../modules.js';
import { getStage } from '../../../gameData/stages.js';
import { getRegion } from '../../../gameData/regions.js';
import { getLocaleKey } from '../../../gameData/regionLocales.js';
import { getRegionTransformation } from '../../../gameData/worldTransformation.js';
import { ENEMY_TYPES } from '../../../gameData/enemies.js';

// ── helpers ────────────────────────────────────────────────────

export function getEnemySizeBand(lbs) {
  const stage = getStage(lbs ?? 130).id;
  if (stage <= 1) return 'light';
  if (stage <= 4) return 'rounded';
  if (stage <= 7) return 'heavy';
  return 'vast';
}

function enemyArchetype(enemy) {
  return enemy?.role || ENEMY_TYPES[enemy?.type]?.role || 'foe';
}

function buildIntroGlobals(game, combat, primary, enemyCount) {
  const region = combat.regionId ?? game.region;
  const regionInfo = getRegion(region);
  const transform = getRegionTransformation(game, region);
  return {
    region,
    locale: getLocaleKey(region),
    regionName: regionInfo?.name,
    regionTransformation: transform.level.level,
    enemyType: primary?.type ?? primary?.typeId,
    enemySizeBand: getEnemySizeBand(primary?.startLbs ?? primary?.lbs),
    enemyCount,
    sceneVariant: 'intro',
    role: primary?.role,
    archetype: enemyArchetype(primary),
  };
}

function buildOutroGlobals(game, wrapup, enemy, outcomeKind) {
  const region = wrapup.region ?? game.region;
  const regionInfo = getRegion(region);
  const transform = getRegionTransformation(game, region);
  const victoryType = wrapup.victory === 'lose' ? 'defeat'
    : wrapup.victory === 'converted' ? 'converted'
    : wrapup.victory === 'flee' ? 'flee'
    : 'win';
  return {
    region,
    locale: getLocaleKey(region),
    regionName: regionInfo?.name,
    regionTransformation: transform.level.level,
    enemyType: enemy?.type,
    enemySizeBand: getEnemySizeBand(enemy?.lbs ?? enemy?.startLbs),
    enemyCount: wrapup.enemies?.length ?? 1,
    partySize: wrapup.allies?.length ?? 1,
    victoryType,
    outcomeKind,
    sceneVariant: 'outro',
    startStage: enemy?.startStage,
    endStage: enemy?.endStage,
    stagesJumped: (enemy?.endStage ?? 0) - (enemy?.startStage ?? 0),
    role: ENEMY_TYPES[enemy?.type]?.role,
    archetype: ENEMY_TYPES[enemy?.type]?.role,
  };
}

// ── INTRO: frame (FULL SENTENCE) ───────────────────────────────

registerPool('dm.combat.intro.frame', [
  { when: { region: 'harvest_hearth', regionTransformationMin: 3 }, text: [
    'Dust turns in the harvest light as you step into {regionName} — ovens breathing, wheat gold in every window, and every stranger a little softer than memory.',
    'The threshing barns of {regionName} groan with new weight these days; devotion has made the village indulgent, and the air tastes of bread and daring.',
    'You enter {regionName} where appetite is no longer whispered — bellies brave at the market, laughter loud, the feast already half-won.',
    'Golden sheaves lean against barn doors in {regionName}; the land has learned abundance, and the fight ahead will test whether your gospel runs deeper.',
    'Harvest wind carries flour and confession through {regionName} — a transformed hearth where even the scarecrows look well-fed.',
    'The village square of {regionName} hums with full tables; whatever rises against you does so in a place already half-converted.',
  ]},
  { when: { region: 'harvest_hearth' }, text: [
    'Dust turns in the harvest light as you step into {regionName} — wooden beams, warm ovens, and trouble waiting where the wheat runs thin.',
    'You cross into {regionName} with bread-smoke in your lungs and steel in your hands; the continent\'s oldest hungers stir here first.',
    'Threshing floors creak under familiar boots in {regionName}; the day is bright, the barns deep, and something hungry watches from the loft.',
    'The farming roads of {regionName} narrow ahead — hay sweet, tools sharp, and the DM\'s voice low: this will get messy in the best way.',
    'You find the heart of {regionName} — hearth-smoke, honest labor, and an enemy who thinks your softness is weakness.',
    'Wheat fields part around you in {regionName}; the horizon is gentle, but the shape unfolding ahead is not.',
  ]},
  { when: { region: 'gorgara_cradle' }, text: [
    'Golden light pools in the grotto air of {regionName} — sacred, patient, hungry for witness.',
    'You descend into {regionName} where the goddess first stirred; stone sweats warmth and the battle will be lit like altar flame.',
    'The cradle grotto holds its breath around you — devotion thick as honey, violence about to learn reverence.',
    'Sacred damp clings to the walls of {regionName}; every footfall echoes like a prayer before the first strike.',
    'Incense and mineral heat wrap {regionName} in a hush; your foe will test whether abundance is merely pretty here.',
    'The goddess listens in {regionName}; you feel her attention like a hand between your shoulders as danger takes shape.',
  ]},
  { when: { region: 'ancient_temple' }, text: [
    'Marble halls swallow sound in {regionName} — pillars wide as oaks, shadows deep, judgment waiting in the dust.',
    'You step through ruined grandeur in {regionName}; incense ghosts and old dogma cling to the air like a second skin.',
    'The temple floor is cold beneath your boots in {regionName}; holiness and hunger have fought here before.',
    'Echoes roll through {regionName} long after you move; this is a stage built for dramatic endings.',
    'Cracked frescoes watch from the heights of {regionName} — saints slim, sinners soft, and you somewhere glorious between.',
    'Pillared silence breaks only when you breathe in {regionName}; the enemy will make the hall remember appetite.',
  ]},
  { when: { region: 'fertile_heartlands' }, text: [
    'Vines curl at the roadside in {regionName} — fertility magic thick as pollen, the earth eager to swell whatever fights on it.',
    'Rolling hills open around you in {regionName}; the soil is drunk on growth and your foe rises from it like a warning.',
    'Heartland wind carries blossom and rot in equal measure through {regionName}; nature here does not do restraint.',
    'You cross open country in {regionName} where every dryad\'s grove runs fat with fruit; the fight will leave marks on the land.',
    'Dirt paths soften underfoot in {regionName}; the continent\'s most generous soil, and an enemy who mistakes generosity for weakness.',
    'The horizon billows green in {regionName} — beautiful, fecund, and about to witness something obscene and holy.',
  ]},
  { when: { regionTransformationMin: 2 }, text: [
    'You return to {regionName} and find it changed — streets softer, bellies braver, abundance no longer hiding.',
    'Familiar ground in {regionName}, but devotion has rewritten the scenery; the fight ahead lands on fertile soil.',
    'The region wears your gospel openly now — {regionName} transformed, watchful, eager to see what you do next.',
    'Every window in {regionName} seems to hold a fuller silhouette; the land itself roots for your excess.',
    'Transformed {regionName} greets you with indulgent noise — a place that already believes, and will judge the unbeliever harshly.',
    'Abundance has touched {regionName} since you were last here; even the cobblestones feel more yielding underfoot.',
  ]},
  { when: {}, text: [
    'The battlefield takes shape in {regionName} — foes ahead, magic warm in your hands, the feast about to begin in earnest.',
    'You steady your breath in {regionName}; the DM sets the scene, and every sense sharpens for what comes next.',
    'Air thickens around you in {regionName} — not quite danger, not quite desire, but the promise of both.',
    'The continent holds its breath in {regionName}; you feel the table laid for violence and conversion alike.',
    'Something waits in {regionName} with hunger of its own; you roll your shoulders and let abundance coil in your palms.',
    'The moment before violence is always the sweetest — {regionName} glows with that held breath now.',
  ]},
]);

// ── INTRO: reveal (FULL SENTENCE) ─────────────────────────────

registerPool('dm.combat.intro.reveal', [
  { when: {}, text: [
    'Then {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
    'Your foe arrives — {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
    'The shape resolves from the gloom: {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
    'You see them clearly now — {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
    'The entrance is unmistakable: {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
    'They step into the light — {dm.combat.enemy.appearance|prefix:}{dm.combat.intro.sizeNote|prefix: }.',
  ]},
]);

// ── INTRO: size note fragment (FULL SENTENCE clause) ───────────

registerPool('dm.combat.intro.sizeNote', [
  { when: { enemySizeBand: 'light' }, text: [
    'lean for now, all angles and hungry speed',
    'slim-built but not fragile — wiry threat in a small package',
    'light on their feet, barely a third your heft',
    'narrow-waisted, deceptively quick',
    'compact, athletic, dangerous before the swelling starts',
    'not yet vast — which means room to grow when you win',
    'slender frame carrying sharp intent',
    'small enough to dart, cruel enough to cut',
  ]},
  { when: { enemySizeBand: 'rounded' }, text: [
    'already curved, hips and belly hinting at sweeter possibilities',
    'a rounded build — soft edges hiding solid muscle beneath',
    'pleasantly padded, easily your match in heft',
    'middle-weight, plush in places that will only get plusher',
    'broad through the hips, appetite written on every sway',
    'nicely filled out — the fight will add more',
    'a body that knows comfort and will learn devotion',
    'generous curves shifting with each step',
  ]},
  { when: { enemySizeBand: 'heavy' }, text: [
    'heavy-set, broad-shouldered, easily your equal in mass',
    'a thick build — power in every jiggle and stride',
    'imposing heft, the boards groaning as they move',
    'large and confident, flesh already a weapon',
    'weighty enough to bruise, glorious enough to admire',
    'substantial curves packed with menace and promise',
    'a towering softness that dares you to try',
    'big-bodied before you even lay a spell on them',
  ]},
  { when: { enemySizeBand: 'vast' }, text: [
    'vast already — a walking landslide of flesh and pride',
    'enormous, the air bending around their mass',
    'colossal curves blocking the light',
    'so heavy the ground seems to remember it',
    'a titanic silhouette, abundance made militant',
    'immense, magnificent, and still room to grow',
    'mountainous heft rolling toward you',
    'size that would make lesser foes flee',
  ]},
  { when: {}, text: [
    'built for this moment',
    'ready to swell or be swelled',
    'dangerous and delectable in equal measure',
  ]},
]);

// ── INTRO: enemy appearance (PARTICIPLE CLAUSE) ────────────────

const APPEARANCE_BY_TYPE = {
  harvest_harpy: [
    'wings folding from the loft, feathered accents catching dust-moted light',
    'talons clicking on tired boards, athletic curves taut with predatory grace',
    'a farm-girl silhouette gone feral — lean waist, hungry eyes, laughter sharp as wind',
    'feathers ruffled, hips swaying, the scent of wheat and raw appetite',
    'dropping from the rafters with a groan of stressed wood and spread wings',
    'circling low with greedy grace, farm-bred beauty turned weapon',
  ],
  vinebound_dryad: [
    'living vines coiling around pear-soft hips, petals stuck to damp skin',
    'rising from the undergrowth with fertility magic dripping from every leaf',
    'bark and blossom braided through a body already swelling with grove-blessing',
    'territorial grace in every vine-laced step, belly rounded beneath woven leaves',
    'nature spirit and appetite braided together, pollen-sweet and dangerous',
    'dryad flesh blooming through green restraint, the grove watching behind her',
  ],
  gluttonous_goblin: [
    'green skin split by padded hips, belly jiggling with every greedy breath',
    'curvy goblin flesh sprawled across the path, honey-stew scent rolling off them',
    'short, rotund, and shameless — a grin like dessert walked in uninvited',
    'pudgy hands already reaching, hips wide, eyes wider',
    'goblin curves packed tight into too-small leather, hunger audible',
    'a greedy green silhouette waddling forward with delighted malice',
  ],
  temple_guardian: [
    'armored priestess-knights standing stoic, halos bright, bodies still disciplined and slim',
    'plate mail creaking over athletic lines — purity polished to a blade\'s edge',
    'temple steel and incense rolling forward in formation, unyielding posture',
    'disciplined bodies behind blessed shields, waists narrow, resolve narrower',
    'guardian armor catching candle-flame, every inch still fighting softness',
    'holy warriors in ordered ranks, hunger nowhere — yet — on their faces',
  ],
  rival_adventurer: [
    'proud steel and athletic fury blocking the road, jaw set, hips still narrow',
    'a rival\'s glare hot enough to burn — slim, furious, envious of your curves',
    'adventurer\'s leathers straining only from muscle, not yet from feast',
    'narrow-waisted defiance stepping into your path with shaking bravado',
    'competitive hunger masked as contempt, body still all hard angles',
    'a mirror of who you were — angry, athletic, terrified of becoming glorious',
  ],
  purity_inquisitor: [
    'fanatical paladins in white trim advancing, hard bodies and harder stares',
    'incense and judgment rolling off lean armored lines in perfect unison',
    'purity made militant — slim, armored, convinced your softness is sin',
    'cold eyes above corseted discipline, every inch denying appetite',
    'inquisitor steel catching harsh light, bodies untouched by the Fat Goddess\'s gift',
    'righteous fury in formation, waists cinched, mercy nowhere on offer',
  ],
  famine_hag: [
    'ancient malice unfolding from the shadows — all angles, cruel hunger, air gone thin',
    'rail-thin crone flesh wrapped in curse-smoke, beauty refused, appetite perverted',
    'a famine hag\'s silhouette bending the light, starvation made sentient',
    'bones sharp beneath curse-weathered skin, hatred older than the temple stones',
    'the hag unfolds like a wound in the world — gaunt, terrible, starving wrong',
    'withered power stepping forward, every rib a sermon against abundance',
  ],
};

const appearanceVariants = [];
for (const [enemyType, texts] of Object.entries(APPEARANCE_BY_TYPE)) {
  appearanceVariants.push({ when: { enemyType }, weight: 4, text: texts });
}

appearanceVariants.push(
  { when: { enemySizeBand: 'light', role: 'skirmisher' }, text: [
    'quick feet and sharper intent, built to dart before the swelling starts',
    'lithe menace coiled to strike, barely padded yet',
    'a light fighter\'s silhouette — fast, cruel, eager',
    'slender threat pacing the edge of your reach',
  ]},
  { when: { enemySizeBand: 'heavy', role: 'tank' }, text: [
    'armored mass rolling forward, already thick through the middle',
    'a wall of flesh and steel, slow and inevitable',
    'heavy curves braced behind shield and spite',
    'bulk made doctrine — immovable until you make them move',
  ]},
  { when: { enemySizeBand: 'rounded', role: 'swarmer' }, text: [
    'pack hunger in a padded frame, grinning like the feast already started',
    'swarmer curves bouncing with nasty delight',
    'a rounded body built for rushing and grabbing',
    'soft edges hiding nasty speed',
  ]},
  { when: { enemySizeBand: 'vast', role: 'boss' }, text: [
    'boss-scale mass dominating the field, every step a statement',
    'vast authority made flesh, the ground complaining',
    'enormous menace with room for more glory when they fall',
    'a titanic foe who thinks size alone wins',
  ]},
  { when: {}, text: [
    'a dangerous silhouette taking form',
    'foe-flesh resolving from the haze — hungry, watchful, ready',
    'an enemy shape stepping into your story',
    'hostile curves and cruel intent made visible',
    'a body built for violence soon to learn abundance',
    'threat incarnate, details still sharpening',
    'something wicked and watchful approaching',
    'a fighter\'s form emerging — not yet yours to adore',
  ]},
);

registerPool('dm.combat.enemy.appearance', appearanceVariants);

// ── INTRO: threat (DIALOGUE BEAT) ──────────────────────────────

registerPool('dm.combat.intro.threat', [
  { when: { role: 'boss' }, text: [
    '"You spread corruption like butter on bread," the hag hisses. "I will starve it out of you."',
    '"Abundance is a lie," she breathes, voice like cracked ice. "I am the truth that hurts."',
    '"Kneel," the famine witch commands, "and I might let you die thin."',
    '"The goddess gorges you on lies," she snarls. "I bring the hunger that never ends."',
  ]},
  { when: { role: 'elite' }, text: [
    '"Heresy wears your face," the inquisitor declares. "I will burn the softness out."',
    '"By the white flame," she vows, "you will not leave this hall enlarged."',
    '"Repent," the paladin orders, "or be purified by steel."',
    '"Your curves are corruption," she says coldly. "I am the cure."',
  ]},
  { when: { role: 'tank' }, text: [
    '"The temple stands," the guardian intones. "You will not pass."',
    '"Sacred ground," she warns, shield raised. "Defile it and be crushed."',
    '"the Fat Goddess\'s hunger ends here," the knight says, voice steady as stone.',
    '"One more step," she murmurs, "and I make you kneel."',
  ]},
  { when: { role: 'skirmisher' }, text: [
    '"Fresh meat," the harpy purrs, rolling one heavy shoulder. "Or fresh flour?"',
    '"You smell sweet," she laughs, talons flexing. "Let\'s see how fast you swell."',
    '"The loft is mine," she calls down. "You\'re just delivery."',
    '"Pretty thing," the harpy croons. "I\'ll pluck you full."',
  ]},
  { when: { role: 'swarmer' }, text: [
    '"Food?" the goblin giggles. "We thought you brought food!"',
    '"Share your lunch," another squeals, "or become ours!"',
    '"Big traveler," a goblin grins, patting her own belly. "We\'ll help you fill out."',
    '"Eat or be eaten," the pack chants, delighted and nasty.',
  ]},
  { when: { role: 'controller' }, text: [
    '"The grove claims trespassers," the dryad whispers, vines tightening.',
    '"Root and bloom," she murmurs, "you will swell with the season."',
    '"This soil is mine," she says, petals drifting. "Your body will learn it."',
    '"Fertility is not gentle," the dryad warns, smiling.',
  ]},
  { when: { role: 'balanced' }, text: [
    '"I won\'t let abundance win," your rival spits — though her gaze lingers on your curves.',
    '"Stand down," she demands, steel bright. "You\'re not better than me."',
    '"I beat you once," she lies badly. "I\'ll beat you again."',
    '"This ends here," the adventurer says, envy cracking through bravado.',
  ]},
  { when: {}, text: [
    '"Come then," your foe says, hunger and hate braided together.',
    '"Let\'s see what you\'re made of," they call — voice too eager by half.',
    '"The feast can wait," someone snarls. "First, you break."',
    '"Try me," the enemy laughs, already leaning into the fight.',
    '"I\'ve been waiting," they breathe, and the held breath snaps.',
    '"Show me your gospel," they demand, stepping closer.',
  ]},
]);

// ── INTRO: multi (FULL SENTENCE) ───────────────────────────────

registerPool('dm.combat.intro.multi', [
  { when: { enemyCountMin: 2 }, text: [
    'More shapes stir behind the first — a pack, not a duel, and the air thickens with shared hunger.',
    'They do not come alone; numbers rustle at the edge of sight, appetites multiplied.',
    'A chorus of footfalls answers the first — several foes, several chances to convert.',
    'The leader is not the only threat; others circle, grinning, already measuring your softness.',
    'What began as one silhouette becomes many — the fight will be messy, glorious, and loud.',
    'Pack tactics gleam in their eyes; abundance loves a crowd, and so does danger.',
  ]},
  { when: { enemyCountMax: 1 }, text: [
    '',
    '',
    '',
  ]},
  { when: {}, text: [
    'The field holds a single foe — a duel, intimate and sharp.',
    'One enemy, one story; the moment stays personal.',
    'No backup arrives; whatever happens is between you and them.',
  ]},
]);

// ── OUTRO: converted (FULL SENTENCE) ─────────────────────────

registerPool('dm.combat.outro.converted', [
  { when: { stagesJumpedMin: 2 }, text: [
    '{subject.name} swaggered in all hard angles and hungry pride — {subject.first} is neither now, thrice the foe {they} were, sunk where {they} fell, a glutted belly spilling warm over {their} own limbs.',
    'You remember {subject.first} lean and defiant; now {they} sprawl abundant, dazed and devoted, already reaching for more as if the fight were foreplay.',
    'The transformation is obscene and holy — {subject.first} balloons where {they} knelt, flesh cascading in waves you earned with spell and feast.',
    'From sharp threat to soft apostle: {subject.first} blinks up at you, stuffed senseless, whispering yes before {they} can speak.',
  ]},
  { when: { endStageMin: 5 }, text: [
    '{subject.name} came to break you and left a plush convert — heavy, adoring, belly spilling in warm folds.',
    '{subject.first} kneels enormous now, corruption sweet as honey on {their} tongue, hunger finally aimed in your direction.',
    'The fight ends with {subject.first} vast and trembling, every inch a testament to the Fat Goddess\'s generosity.',
    'What was violence becomes worship — {subject.first} cradles {their} new mass like a gift.',
  ]},
  { when: { startStageMax: 2 }, text: [
    '{subject.name} arrived slim and cruel; {subject.first} leaves padded and pleading, curves blooming where armor used to lie flat.',
    'You watch {subject.first} discover softness in real time — shy at first, then greedy for the next bite.',
    'The lean enemy you faced is gone; {subject.first} swells with grateful heat, already yours.',
    'Small beginnings, glorious finish — {subject.first} gasps as new weight settles like a lover\'s hands.',
  ]},
  { when: {}, text: [
    '{subject.name} surrenders to abundance with a shuddering moan — converted, adorned, and impossibly softer than when {they} stood against you.',
    '{subject.first} looks up through lashes and new curves, devotion naked on {their} face.',
    'The fight leaves {subject.first} plump and purring, hunger redirected, hatred melted to syrup.',
    'Victory tastes like {subject.first}\'s sigh when the last stubborn inch gives way.',
    '{subject.first} sprawls in victorious softness, a foe made feast-follower between one breath and the next.',
    'Where defiance stood, {subject.first} kneels — swollen, serene, begging with {their} eyes alone.',
  ]},
]);

// ── OUTRO: ko (FULL SENTENCE) ──────────────────────────────────

registerPool('dm.combat.outro.ko', [
  { when: { stagesJumpedMin: 1 }, text: [
    '{subject.name} collapses heavier than {they} arrived — not converted, just magnificently overwhelmed, flesh pooled where {they} fell.',
    '{subject.first} goes down with a wet thud of new curves, stunned stupid by the weight you packed on mid-fight.',
    'No sermon of devotion — just {subject.first}, KO\'d and plush, belly rising slow with unconscious breath.',
    '{subject.first} lies sprawled, bigger and softer, the fight knocked out of {them} but the growth very much intact.',
  ]},
  { when: {}, text: [
    '{subject.name} hits the ground still groaning — beaten, bulging, not quite broken into faith.',
    '{subject.first} slumps defeated, extra softness jiggling with the impact, glorious even in loss.',
    'The enemy folds — not converted, simply outmatched, body pleasantly thicker for the effort.',
    '{subject.first} sprawls unconscious, curves gleaming with sweat and spell-light, a trophy of excess.',
    'You stand over {subject.first}, who breathes deep and heavy, more woman than threat now.',
    '{subject.first} lies still, plush and panting, the KO written in every new roll of flesh.',
  ]},
]);

// ── OUTRO: victory coda (FULL SENTENCE) ────────────────────────

registerPool('dm.combat.outro.victory_coda', [
  { when: { victoryType: 'converted', partySizeMin: 2 }, text: [
    'Your allies exhale together — another soul fattened into the gospel, the feast growing one glorious body at a time.',
    'The party surveys the field of converts and smiles; abundance spreads easiest when shared.',
    'Elara\'s laugh is warm beside you; the whole company basks in what you wrought.',
    'Companion breath mingles with incense and sweat — a good fight, a better harvest of hearts.',
  ]},
  { when: { victoryType: 'converted' }, text: [
    'Silence settles sweetly — every foe softened into devotion, the DM holding the moment like a gift.',
    'You stand alone amid surrendered curves, the gospel written on flesh instead of stone.',
    'The last convert sighs; the camera of the tale slows, reverent, hungry for what you do next.',
    'Victory through conversion — the prettiest kind, bodies blooming like offerings.',
  ]},
  { when: { victoryType: 'win', enemyCountMin: 2 }, text: [
    'The last enemy falls and the field exhales — a mess of swollen silhouettes and satisfied breath.',
    'Pack broken, abundance proven; you roll your shoulders, already tasting the next fight.',
    'Several foes, one lesson: your magic leaves them softer than your mercy ever would.',
    'The dust settles on a tableau of defeated curves — triumphant, indulgent, yours.',
  ]},
  { when: { victoryType: 'win' }, text: [
    'The battlefield stills; you breathe deep, magic humming, the tale eager for your next move.',
    'One foe down, one story richer — the DM lets the victory sit on your tongue before the world resumes.',
    'Steel and spell fade; what remains is heat, heft, and the promise of more.',
    'You win, and the continent seems to purr approval through the stones.',
  ]},
  { when: {}, text: [
    'The scene closes on held breath — victory earned, bodies changed, appetite sated for now.',
    'Combat ends; the narrative leans forward, waiting for your next delicious choice.',
    'Quiet returns, stitched with the memory of growth and gasps.',
  ]},
]);

// ── OUTRO: defeat (FULL SENTENCE) ──────────────────────────────

registerPool('dm.combat.outro.defeat', [
  { when: { victoryType: 'defeat' }, text: [
    'The light goes thin at the edges. Your knees find the floor before you decide to kneel.',
    'The last thing you hear is appetite — not yours — and the dark is almost kind.',
    'Steel, spell, and pride fail together; the tale will remember how close you came.',
    'Your vision tunnels sweet and cruel; the feast continues without you.',
    'Defeat tastes iron and honey — you slump, magnificent even in falling.',
    'The enemy\'s laughter fades last, and the scene closes on your heaving breath.',
  ]},
  { when: { victoryType: 'flee' }, text: [
    'You break from the field with lungs burning — alive, retreating, the story not finished.',
    'Flight is its own kind of wisdom; the DM notes the escape, hungry for the rematch.',
    'You leave the fight behind, curves still yours, pride bruised but body intact.',
    'The path swallows you; survival first, vengeance simmering.',
  ]},
  { when: {}, text: [
    'The battle ends poorly; the narrative exhales cold and waits.',
    'Loss lands heavy — not on your hips yet, but on your spirit.',
    'The scene fades with you still breathing; that counts for something.',
  ]},
]);

// ── OUTRO: finisher (FULL SENTENCE) ───────────────────────────

registerPool('dm.combat.finisher', [
  { when: { outcomeKind: 'converted' }, text: [
    'The last blow is not steel but invitation — you ask, reverent, how {they} want to swell, and {they} answer with {their} body.',
    'Time slows for the final conversion; every eye at the table imagines the softness to come.',
    'You hold the moment like a jeweler holds a gem — one last enemy, one last glorious expansion.',
  ]},
  { when: { outcomeKind: 'ko' }, text: [
    'The decisive strike lands with a sound like ripe fruit splitting — how do you want to end this?',
    'You pause at the threshold of victory, savoring the enemy\'s last proud breath before the KO.',
    'Mercer-energy hush: the final blow hangs, earned, indulgent, yours to choose.',
  ]},
  { when: {}, text: [
    'The last beat hangs — cinematic, breathless, delicious.',
    'One final choice glimmers before the tale moves on.',
    'The tableau holds; then the world exhales.',
  ]},
]);

// ── render API ─────────────────────────────────────────────────

export function renderCombatIntro(game, combat, opts = {}) {
  const enemies = combat.enemies ?? [];
  const primary = enemies[0];
  if (!primary) return '';
  const enemyCount = enemies.length;
  const globals = buildIntroGlobals(game, combat, primary, enemyCount);
  const ctx = createContext({
    subject: primary,
    ref: game.player,
    globals,
    history: game.history,
    scene: opts.scene ?? new Set(),
    seed: opts.seed,
  });

  const beats = ['dm.combat.intro.frame', 'dm.combat.intro.reveal', 'dm.combat.intro.threat'];
  if (enemyCount >= 2) beats.push('dm.combat.intro.multi');

  return beats
    .map((beat) => render(`{${beat}}`, ctx, opts).trim())
    .filter(Boolean)
    .join('\n\n');
}

export function renderCombatOutro(game, wrapup, opts = {}) {
  const victoryType = wrapup.victory === 'lose' ? 'defeat'
    : wrapup.victory === 'converted' ? 'converted'
    : wrapup.victory === 'flee' ? 'flee'
    : 'win';

  if (victoryType === 'defeat' || victoryType === 'flee') {
    const ctx = createContext({
      subject: game.player,
      ref: game.player,
      globals: {
        ...buildOutroGlobals(game, wrapup, wrapup.enemies?.[0], 'defeat'),
        victoryType,
      },
      history: game.history,
      scene: opts.scene ?? new Set(),
      seed: opts.seed,
    });
    return render('{dm.combat.outro.defeat}', ctx, opts).trim();
  }

  const paragraphs = [];
  const enemies = wrapup.enemies ?? [];
  const scene = opts.scene ?? new Set();

  enemies.forEach((enemy, idx) => {
    const subject = {
      name: enemy.name,
      lbs: enemy.lbs,
      pronouns: enemy.pronouns || 'they',
      role: ENEMY_TYPES[enemy.type]?.role,
    };
    const outcomeKind = enemy.converted ? 'converted' : 'ko';
    const globals = buildOutroGlobals(game, wrapup, enemy, outcomeKind);
    const ctx = createContext({
      subject,
      ref: game.player,
      globals,
      history: game.history,
      scene,
      seed: opts.seed != null ? `${opts.seed}_${idx}` : undefined,
    });
    const pool = enemy.converted ? 'dm.combat.outro.converted' : 'dm.combat.outro.ko';
    const line = render(`{${pool}}`, ctx, opts).trim();
    if (line) paragraphs.push(line);

    if (idx === enemies.length - 1) {
      const finisher = render('{dm.combat.finisher}', ctx, opts).trim();
      if (finisher) paragraphs.push(finisher);
    }
  });

  const codaCtx = createContext({
    subject: game.player,
    ref: game.player,
    globals: {
      ...buildOutroGlobals(game, wrapup, enemies[0], 'win'),
      victoryType: wrapup.victory === 'converted' ? 'converted' : 'win',
    },
    history: game.history,
    scene,
    seed: opts.seed != null ? `${opts.seed}_coda` : undefined,
  });
  const coda = render('{dm.combat.outro.victory_coda}', codaCtx, opts).trim();
  if (coda) paragraphs.push(coda);

  return paragraphs.filter(Boolean).join('\n\n');
}

export function buildCombatIntro(game, combat) {
  return {
    prose: renderCombatIntro(game, combat),
    region: combat.regionId ?? game.region,
    enemyType: combat.enemies?.[0]?.type,
    enemyCount: combat.enemies?.length ?? 0,
  };
}

export function buildCombatWrapup(game, combat) {
  const enemies = (combat.enemies ?? []).map((e) => ({
    name: e.name,
    type: e.type ?? e.typeId ?? e.id,
    startStage: e.startStage ?? getStage(e.startLbs ?? e.lbs).id,
    endStage: getStage(e.lbs).id,
    lbs: Math.round(e.lbs),
    pronouns: e.pronouns || 'they',
    converted: !!e.converted,
    killed: e.hp <= 0 && !e.converted,
  }));
  const allies = (combat.allies ?? [])
    .filter((a) => a.hp > 0)
    .map((a) => ({ name: a.name, lbs: Math.round(a.lbs), isPlayer: !!a.isPlayer }));

  const wrapup = {
    victory: combat.victory,
    region: combat.regionId ?? game.region,
    enemies,
    allies,
  };
  return {
    ...wrapup,
    prose: renderCombatOutro(game, wrapup),
  };
}
