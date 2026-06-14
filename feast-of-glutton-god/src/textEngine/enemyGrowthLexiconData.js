// ═══════════════════════════════════════════════════════════════
// SPECIES GROWTH LEXICON — physique-specific sudden-gain prose
// Routed by growthKind (harpy, dryad, stone_golem, dragon…).
// Higher priority than generic bodyType lines in grow.sudden.
// ═══════════════════════════════════════════════════════════════

/** @typedef {{ growthKind: string, zone?: string, texts: string[] }} SpeciesGrowthChunk */

/** @type {SpeciesGrowthChunk[]} */
export const ENEMY_SPECIES_GROWTH_CHUNKS = [
  // ── HARPY — wings, crop, talons, feathered mass ──
  {
    growthKind: 'harpy',
    texts: [
      "{subject.name}'s wings grow heavy with new softness — primary feathers spreading wider, each beat laboring as plush fat pads her pinions.",
      "Feathered hips thicken on {subject.first}; her talons sink deeper as thighs rub with nectar-sweet, obscene friction.",
      "{subject.name}'s crop swells beneath feathered collarbone, a greedy pouch rounding outward — she moans, embarrassed, delighted.",
      "Downy softness creeps along {subject.first}'s wing joints; she flexes and feels drag where flight used to be effortless and chaste.",
      "{subject.name}'s belly rounds beneath layered plumage, feathers parting to show pale, jiggling flesh that bounces when she laughs.",
      "Her wingspan seems wider — not from bone, but from fat padding each pinion until she gleams like a harvest idol made for worship.",
      "{subject.first}'s thighs plush beneath torn flight-leathers, feathered calves thickening until perch-roosts creak and she blushes.",
      "{subject.name} preens at new softness along her wings; each feathered curve bounces when she gasps your name.",
    ],
  },
  // ── DRYAD — vines, bark, fertility swell ──
  {
    growthKind: 'dryad',
    texts: [
      "Living vines thicken around {subject.name}'s waist, swelling with her as bark cracks to reveal soft, pear-pale flesh and stiff nipples beneath.",
      "{subject.first}'s hips root outward — thighs rubbing with nectar-sweet friction, leaf-girdle snapping on new plushness.",
      "Petals stick to sweat-damp skin as {subject.name}'s breasts swell with fertility magic, heavy and round beneath living bark.",
      "Her thighs press together with new vine-wrapped fullness; sap-sweet softness blooms through every green restraint.",
      "{subject.first}'s belly rounds like a ripening gourd, vines creaking as they accommodate divine indulgence and obscene jiggle.",
      "Bark splinters along {subject.name}'s collarbone; underneath, softness spills free — the grove exhaling approval in warm moans.",
      "Fertility magic thickens {subject.first}'s lower body until she sways like a tree in heat, hips wide as orchard rows.",
      "{subject.name}'s vine-bound dress splits at the seams; new curves gleam wet with dew and unmistakable, begging appetite.",
    ],
  },
  // ── GOBLIN — greedy green curves ──
  {
    growthKind: 'goblin',
    texts: [
      "{subject.name}'s green belly rounds greedily outward, little hands patting the new pouch with delighted disbelief.",
      "Pointed ears droop slightly as {subject.first}'s cheeks and hips swell together — a goblin feast-queen in the making.",
      "Thick green thighs rub with every waddle-step; {subject.name} giggles at the jiggle and wants more.",
      "{subject.first}'s already-curvy frame packs on plush pounds fast, corset-laces popping with triumphant greed.",
      "A soft double chin forms beneath {subject.name}'s sharp grin; her whole body jiggles when she claps for seconds.",
      "{subject.first}'s ass swells round and heavy behind her, tail struggling to arc over new green plushness.",
    ],
  },
  // ── ARMORED KNIGHT ──
  {
    growthKind: 'armored_knight',
    texts: [
      "Blessed plate creaks as {subject.name}'s padded gambeson swells beneath — armor accommodating curves it was never forged for.",
      "{subject.first}'s breastplate bows outward; soft flesh presses through every gap in stoic mail.",
      "Gorget strains over a thickening neck; {subject.name}'s shoulders widen with plush, armored abundance.",
      "Greaves pinch as {subject.first}'s thighs thicken inside steel — holy guard becoming soft monument.",
      "{subject.name}'s belly pushes against cuirass latches until they sigh open on flesh that refuses denial.",
    ],
  },
  // ── ADVENTURER ──
  {
    growthKind: 'adventurer',
    texts: [
      "{subject.name}'s adventurer's harness digs into softening waist — pride and pounds arriving together.",
      "Travel-leathers creak as {subject.first}'s hips and thighs thicken from road-ration to feast-day proportions.",
      "{subject.name}'s belt notches surrender one by one; a rival's athletic frame melting into indulgent curves.",
      "Muscle softens into plush abundance across {subject.first}'s belly and chest — still fierce, suddenly hungry.",
    ],
  },
  // ── INQUISITOR ──
  {
    growthKind: 'inquisitor',
    texts: [
      "Ascetic discipline cracks as {subject.name}'s middle softens — measured faith losing to measured appetite.",
      "White vestments pull taut over {subject.first}'s thickening breasts and belly; purity never looked so plush.",
      "{subject.name}'s oath-belt sinks into a rounding gut; denial theology visibly losing the argument.",
      "Holy mail strains; {subject.first}'s hips widen beneath tabard hems that will not lie flat again.",
    ],
  },
  {
    growthKind: 'inquisitor_elite',
    texts: [
      "Supreme vestments split at the seams — {subject.name}'s divinely armored frame surrendering to forbidden fullness.",
      "{subject.first}'s doctrinal fury trembles as fat settles into every line of hard-won austerity.",
      "Wheel-sigils stretch across {subject.name}'s swelling belly; law made flesh, flesh made gloriously excessive.",
      "Sacred plate groans; {subject.first} thickens into an inquisitor who can no longer pretend fasting is virtue.",
    ],
  },
  // ── ASCETIC / CULTIST ──
  {
    growthKind: 'ascetic',
    texts: [
      "Ribs vanish beneath forbidden softness as {subject.name}'s fast breaks in visible, jiggling inches.",
      "Roughspun robes gap over {subject.first}'s rounding belly — penitence undone by appetite.",
      "{subject.name}'s hollow cheeks fill; hunger for denial loses to hunger for more.",
      "Cord-belt snaps; {subject.first}'s monastic frame softens into something the monastery would call scandal.",
    ],
  },
  {
    growthKind: 'cultist',
    texts: [
      "Lean Saint markings stretch across {subject.name}'s swelling flesh — antithesis worship cracking under abundance.",
      "{subject.first}'s emaciated piety floods into plush curves; famine theology visibly reversing.",
      "Hunger-reversal magic fails as {subject.name}'s belly surges outward, cult tattoos distorting on soft skin.",
    ],
  },
  // ── NOBLE ──
  {
    growthKind: 'noble',
    texts: [
      "Corset bones surrender with a crack; {subject.name}'s noble poise melts into decadent, visible curves.",
      "Jewelry sinks into softening cleavage as {subject.first}'s breasts and belly swell with scandalous grace.",
      "{subject.name}'s embroidered stomacher splits; silk strains over hips that court will gossip about for seasons.",
      "Velvet gloves pinch as {subject.first}'s arms thicken — refinement and appetite sharing the same blush.",
    ],
  },
  // ── FAMINE / HERALD (divine denial cracking) ──
  {
    growthKind: 'famine_wraith',
    texts: [
      "Impossible softness breaches {subject.name}'s starved frame — famine theology cracking along every visible rib.",
      "Hollow cheeks fill as {subject.first}'s scourge-aura flickers; Sylwen's sanction warps under sacred gluttony.",
      "{subject.name}'s emaciated holiness swells into plush contradiction — lean saint becoming feast saint.",
      "Cold hunger-wind stutters as fat pads {subject.first}'s wrists and belly; denial made flesh, flesh made abundant.",
    ],
  },
  {
    growthKind: 'divine_herald',
    texts: [
      "Scourge-light dims as {subject.name}'s messenger frame thickens — herald of famine discovering appetite.",
      "{subject.first}'s wings of denial droop with new weight; divine message garbled by moans.",
      "Starvation aura buckles; {subject.name}'s belly rounds beneath sanctified ribs that can no longer hide hunger.",
    ],
  },
  // ── VOID / GOLEM — non-human physiques ──
  {
    growthKind: 'hunger_void',
    texts: [
      "Absence fills wrong — {subject.name}'s hollow outline bulges with flesh that should not exist, growth eating itself into curves.",
      "Inverted hunger swells outward; {subject.first}'s void-shape strains with plush contradiction, reality hiccuping.",
      "{subject.name}'s emptiness puckers into soft, heavy rolls — appetite un-inverted, abundance made uncanny.",
      "The hole in {subject.first}'s silhouette fleshes over; inverted hunger becomes obscene, jiggling plenty.",
    ],
  },
  {
    growthKind: 'stone_golem',
    texts: [
      "Marble seams crack as {subject.name}'s stone belly softens — law-construct warping into doughy, impossible curves.",
      "Moss erupts between widening joints; {subject.first}'s cathedral geometry sags with plush abundance.",
      "Granite thighs round and polish smooth; {subject.name}'s golem mass reshapes from icon into idol.",
      "Sacred relief carvings stretch across {subject.first}'s swelling breasts and gut — Aurelan's law made voluptuous.",
      "Stone dust sifts from widening hip-flutes; {subject.name} grinds softer with every divine pound gained.",
    ],
  },
  // ── DIVINE CHAMPIONS & AVATARS ──
  {
    growthKind: 'divine_champion',
    texts: [
      "God-blessed plate warps as {subject.name}'s champion frame swells — holy warrior becoming holy abundance.",
      "Divine sigils stretch across {subject.first}'s thickening belly; patron power rerouted into plush flesh.",
      "{subject.name}'s oath-armor creaks open on curves that shame the Wheel's moderation.",
      "Champion's lean valor softens into feast-day proportions; {subject.first} still fights, but heavier, hungrier.",
    ],
  },
  {
    growthKind: 'divine_wheel',
    texts: [
      "Radiant Wheel-light pools in {subject.name}'s joints as six-domain mass thickens into one plush executor.",
      "{subject.first}'s divine geometry warps — pantheon fury swelling into feast-day monument.",
      "Crown and halo tilt on {subject.name}'s heavier neck; cosmic opposition discovering appetite.",
    ],
  },
  {
    growthKind: 'divine_avatar_law',
    texts: [
      "Scales of justice warp as {subject.name}'s law-avatar softens — measured verdict becoming measured indulgence.",
      "Crown sigils stretch over {subject.first}'s rounding breasts; Aurelan's avatar thickening past divine proportion.",
      "{subject.name}'s armored radiance bows outward on a belly that tips the scales toward feast.",
    ],
  },
  {
    growthKind: 'divine_avatar_grief',
    texts: [
      "Harvest grief swells with {subject.name}'s curves — Sylwen's inverted plenty cracking into real softness.",
      "Tears and grain-weight settle into {subject.first}'s hips; grief goddess discovering comfort in pounds.",
      "{subject.name}'s barren aura wilts as plush fertility reclaims her pear-soft frame.",
    ],
  },
  {
    growthKind: 'divine_avatar_death',
    texts: [
      "Tomb-shroud strains over {subject.name}'s thickening form — Veshanne's fate given flesh that refuses ending.",
      "Barrow-dust cakes on new curves; {subject.first}'s death-avatar softening into terrifying plenty.",
      "{subject.name}'s unwritten end swells visibly; fate itself gains weight and jiggle.",
    ],
  },
  {
    growthKind: 'rival_goddess',
    texts: [
      "Mirror-bloom swells across {subject.name}'s rival divinity — wrong abundance duplicating every curve you offer.",
      "{subject.first}'s sovereign hunger thickens into obscene symmetry; antithesis goddess eating her own reflection.",
      "{subject.name}'s bloom-devour frame balloons outward, stealing glory and mass in the same breath.",
    ],
  },
  {
    growthKind: 'war_titan',
    texts: [
      "Frontier war-giant mass doubles — {subject.name}'s titan belly surges over war-plate like a conquered hill.",
      "{subject.first}'s honest fury softens into honest feast; Korthak's champion becoming living fortress of flesh.",
      "Earthquake footsteps grow slower as {subject.name}'s thighs and gut thicken past war-saint proportion.",
      "Battle-harness snaps; {subject.first}'s titan frame jiggles with each confused, furious step.",
    ],
  },
  // ── MYTHIC PLAYER SCALES (also used if tagged on character) ──
  {
    growthKind: 'dragon',
    texts: [
      "{subject.name}'s hoard-belly swells between scale-plates — dragon immensity discovering the pleasure of excess.",
      "Wing membranes drag with new weight; {subject.first}'s draconic frame thickens, treasure-warm fat gleaming under scales.",
      "Scale gaps widen as {subject.name}'s gut rounds outward; each breath hotter, each curve more commanding.",
      "{subject.first}'s tail thickens, dragging lazy arcs through dust; dragon pride becoming dragon plenty.",
      "Horns seem smaller only because {subject.name}'s neck and shoulders have grown magnificently, obscenely soft.",
    ],
  },
  {
    growthKind: 'titan',
    texts: [
      "{subject.name}'s titan frame reshapes geography — belly becoming landmark, thighs becoming borders.",
      "{subject.first} swells until halls are theoretical; titan mass settling with continent-slow jiggle.",
      "World-scale softness accumulates on {subject.name}; each new roll visible from across the chamber.",
    ],
  },
  {
    growthKind: 'tarrasque',
    texts: [
      "{subject.name}'s apotheosis bulk rewrites the room — matriarch-scale flesh that hunger itself would worship.",
      "{subject.first} grows past architecture into theology; tarrasque curves becoming the new law of appetite.",
      "Reality bends around {subject.name}'s swelling immensity — wrong-genre apotheosis made flesh and jiggle.",
    ],
  },
  // ── FUTURE / RACE ARCHETYPES ──
  {
    growthKind: 'succubus',
    texts: [
      "Infernal curves sharpen then soften on {subject.name} — tail thickening, hips flaring with obscene, magical precision.",
      "{subject.first}'s wings droop heavy with new plushness; lust given weight, nipples peaked through lacework, moan held behind a smile.",
      "Horns catch candlelight above {subject.name}'s swelling bust — succubus frame packing on decadent, deliberate, worship-worthy fat.",
      "{subject.first}'s tail curls around thicker thighs as her belly rounds — sin made jiggling, consent shimmering in her eyes.",
      "Velvet skin glosses with sweat as {subject.name}'s hourglass lines deepen — demoness curves begging to be fed and adored.",
    ],
  },
  {
    growthKind: 'vampire',
    texts: [
      "Aristocratic pallor warms as {subject.name}'s frame softens — eternal hunger finding a rounder, wetter shape.",
      "High collar hides nothing; {subject.first}'s throat and bosom thicken with languid, predatory curves that sway when she breathes.",
      "{subject.name}'s cape spreads wider to hide new abundance — old-world elegance straining over feast-night pounds and stiff nipples.",
      "Cold skin flushes rose as {subject.first}'s pear-pale hips widen — undead poise melting into plush, scandalous invitation.",
      "Fangs peek as {subject.name}'s corset sighs open on a rounding gut — aristocratic denial losing to aristocratic appetite.",
    ],
  },
];
