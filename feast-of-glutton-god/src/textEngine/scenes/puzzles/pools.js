import { registerPool } from '../../engine.js';

function registerPuzzleCopy(key, lines) {
  registerPool(key, [{ when: {}, text: lines }]);
}

registerPuzzleCopy('puzzle.examine.default', [
  'You study {featureName} with hungry curiosity — the obstacle hums with untapped abundance.',
  '{puzzleDesc} The air tastes of cream and possibility.',
  'Every curve of {featureName} seems to whisper: there is more than one delicious way through.',
]);

registerPuzzleCopy('puzzle.examine.solved', [
  '{featureName} bears the warm mark of your clever indulgence — solved, softened, conquered with pleasure.',
  'What once blocked the path now celebrates your abundance. {puzzleTitle} yields its secrets gladly.',
]);

registerPuzzleCopy('puzzle.attempt.skill', [
  'You try {solutionLabel} — heart pounding, belly warm with divine confidence.',
  'Abundance gathers as you attempt {solutionLabel}, every sense tuned to pleasure and possibility.',
]);

registerPuzzleCopy('puzzle.fail.skill', [
  'Not quite — but the attempt leaves you breathless and hungrier to try another path.',
  'Failure here is only a tease. Another approach will swell into success.',
]);

registerPuzzleCopy('puzzle.solve.default', [
  'Abundance answers! {solutionLabel} opens the way — lush, sensual, triumphant.',
  'You solve {puzzleTitle} with {solutionLabel}, and the world grows softer, richer, more yours.',
]);

registerPuzzleCopy('puzzle.spell_cast.environment', [
  'You weave {spellName} into {featureName}. Magic pools and drips — golden, creamy, impossibly inviting.',
  '{spellName} kisses {featureName}. The environment sighs and yields beneath abundance made manifest.',
  'Your {spellName} unfurls across {featureName}, turning stone and wood into something warm and willing.',
]);

registerPuzzleCopy('puzzle.solve.cellar_grace', [
  'Velvet patience wins. The lock sighs; the cellar exhales the scent of legendary pastries.',
]);

registerPuzzleCopy('puzzle.solve.cellar_cream', [
  'Rich Cream seeps into every grain — oak softens like warm butter under your touch. The door yields with a satisfied groan.',
]);

registerPuzzleCopy('puzzle.solve.cellar_shoulder', [
  'Your plush mass meets stubborn timber — and timber remembers its place. The door bows before your beautiful weight.',
]);

registerPuzzleCopy('puzzle.solve.cellar_elara', [
  'Elara presses a warm key into your palm with a knowing smile. "For someone who spreads abundance as sweetly as you."',
]);

registerPuzzleCopy('puzzle.solve.vesperia_persuade', [
  'Honeyed words slip past iron pride. The gatekeeper blushes; the garden gate swings wide.',
]);

registerPuzzleCopy('puzzle.solve.vesperia_charm', [
  'Enchantment makes iron feel decadent. The gate shivers, then opens as if eager to be admired.',
]);

registerPuzzleCopy('puzzle.solve.vesperia_trust', [
  'Vesperia herself beckons you through — trust blooming like a rose on her widening hips.',
]);

registerPuzzleCopy('puzzle.solve.vesperia_perform', [
  'Your performance dazzles. Guards forget their duty; the gate becomes an afterthought.',
]);

registerPuzzleCopy('puzzle.solve.ravine_bridge', [
  'You grow until your body spans the gorge — a living bridge of warm, jiggling flesh. Crossing feels like being cradled by the goddess herself.',
]);

registerPuzzleCopy('puzzle.solve.ravine_self_feed', [
  'You feast upon your own abundance right at the edge, swelling until reaching across is effortless pleasure.',
]);

registerPuzzleCopy('puzzle.solve.ravine_cream', [
  'Slick abundance floods the ravine. Vines slide aside; fruit yields; the path becomes a decadent slip-and-slide of gold.',
]);

registerPuzzleCopy('puzzle.solve.ravine_lira', [
  'Lira blesses the vines until they braid into a soft, swaying bridge — each step a hymn of fullness.',
]);

registerPuzzleCopy('puzzle.solve.ravine_climb', [
  'You clamber through swollen vines with ecstatic endurance — scratched, breathless, gloriously alive.',
]);

registerPuzzleCopy('puzzle.solve.pool_abundance', [
  'You pour your spreading influence into the sacred water. It blooms golden, hungry, holy.',
]);

registerPuzzleCopy('puzzle.solve.pool_mist', [
  'Banquet Mist perfumes the grotto until the pool itself seems to drink and swell with divine appetite.',
]);

registerPuzzleCopy('puzzle.solve.pool_indulge', [
  'At the water\'s edge you perform indulgence as prayer. The pool answers with ripples of pleasure.',
]);

registerPuzzleCopy('puzzle.solve.pool_thalia', [
  'Thalia guides your hands through a witch\'s rite — the pool awakens hungry and adoring.',
]);

registerPuzzleCopy('puzzle.solve.arch_overwhelm', [
  'Your presence overwhelms fallen stone. Marble remembers feasting gods and yields.',
]);

registerPuzzleCopy('puzzle.solve.arch_pressure', [
  'Pleasurable Pressure crushes rubble into dust and desire. The inner sanctum breathes free.',
]);

registerPuzzleCopy('puzzle.solve.arch_greta', [
  'Greta forges a breach with hammer, heat, and hunger. "Stone\'s just stubborn metal that forgot how to eat."',
]);

registerPuzzleCopy('puzzle.solve.arch_squeeze', [
  'Enormity finds the gap. You squeeze through with breathless, jiggling triumph — tight halls adore your size.',
]);

registerPuzzleCopy('puzzle.solve.arch_sylvie', [
  'Sylvie recites the arch\'s feasting inscription. Stone shivers, remembers ritual, and stands aside.',
]);

registerPuzzleCopy('puzzle.attempt.combat', [
  'You brace for battle — appetite and power another path through {solutionLabel}.',
  'Steel and softness alike may win here. You meet the challenge head-on, belly warm with certainty.',
]);

registerPuzzleCopy('puzzle.spell_cast.overflow', [
  'Overflow magic crashes into {featureName} — excess abundance makes the world yield eagerly.',
  'You pour more than necessary into {featureName}, and the goddess approves of your generous excess.',
]);

registerPuzzleCopy('puzzle.hint.craving', [
  '{npcName} leans close, voice husky with trust: "I\'ve been thinking about {featureName}… have you tried {solutionHint}?"',
  '"You\'re clever enough for this," {npcName} murmurs. "{featureName} might yield if you {solutionHint}."',
]);

registerPuzzleCopy('puzzle.hint.devoted', [
  '{npcName} takes your hand without hesitation: "For {featureName}, do this — {solutionLabel}. I\'ll be thinking of you swelling with pride when you succeed."',
  '"My love," {npcName} breathes, "the answer at {featureName} is {solutionLabel}. Go — make abundance proud."',
]);

registerPuzzleCopy('puzzle.solve.cellar_combat', [
  'The goblins scatter, stuffed and humbled. The cellar door stands open, rich with pastry-scented victory.',
]);

registerPuzzleCopy('puzzle.solve.vesperia_combat', [
  'Your rival yields — converted or defeated, she no longer blocks the garden. Iron swings wide.',
]);

registerPuzzleCopy('puzzle.solve.ravine_combat', [
  'Harpies flee your divine presence. The ravine exhales; the path to the cradle clears.',
]);

registerPuzzleCopy('puzzle.solve.arch_combat', [
  'The guardian kneels, softened by battle. Rubble parts as if remembering feasts.',
]);

registerPuzzleCopy('puzzle.solve.windmill_grace', [
  'Gears sigh and turn. Flour dust sparkles — the village breathes again.',
]);

registerPuzzleCopy('puzzle.solve.windmill_greta', [
  'Greta\'s hammer rings true. The wheel turns, doughy and magnificent.',
]);

registerPuzzleCopy('puzzle.solve.windmill_flavor', [
  'Flavor Burst greases every stubborn joint. The mill purrs like a well-fed cat.',
]);

registerPuzzleCopy('puzzle.solve.windmill_combat', [
  'Goblins tumble from the housing, bellies full and egos bruised. The wheel spins free.',
]);

registerPuzzleCopy('puzzle.solve.shrine_overwhelm', [
  'Your presence rings the bell without touching it — a peal of abundance across the village.',
]);

registerPuzzleCopy('puzzle.solve.shrine_mass', [
  'Your mass pulls the rope like a lover. The bell sings; the festival stirs.',
]);

registerPuzzleCopy('puzzle.solve.shrine_mira', [
  'Mira\'s ballad climbs the bronze. The bell answers in harmonies of hunger and joy.',
]);

registerPuzzleCopy('puzzle.solve.shrine_perform', [
  'Your performance makes the shrine itself applaud. The bell rings for you alone.',
]);

registerPuzzleCopy('puzzle.solve.vault_sneak', [
  'You slip through vents slick with saffron. The vault opens to your clever touch.',
]);

registerPuzzleCopy('puzzle.solve.vault_seduce', [
  'Desire unlocks what keys could not. The vault keeper sighs; spices are yours.',
]);

registerPuzzleCopy('puzzle.solve.vault_sylvie', [
  'Sylvie whispers the combination like a recipe. The vault yields its aromatic treasure.',
]);

registerPuzzleCopy('puzzle.solve.vault_combat', [
  'Victory leaves the vault unguarded. Saffron and cinnamon welcome your abundance.',
]);

registerPuzzleCopy('puzzle.solve.hedge_persuade', [
  'The hedge parts with a rustle of pleasure. The hidden grove beckons, swollen with fruit.',
]);

registerPuzzleCopy('puzzle.solve.hedge_mist', [
  'Mist softens thorns into velvet. The dryad\'s grove sighs open.',
]);

registerPuzzleCopy('puzzle.solve.hedge_lira', [
  'Lira\'s prayer makes thorns bloom instead of bite. The grove welcomes you.',
]);

registerPuzzleCopy('puzzle.solve.hedge_combat', [
  'The dryad yields — converted or conquered. Thorns curl aside with delicious grace.',
]);

registerPuzzleCopy('puzzle.solve.altar_indulge', [
  'Indulgence at the altar becomes sacrament. First Hunger stirs, pleased and golden.',
]);

registerPuzzleCopy('puzzle.solve.altar_thalia', [
  'Thalia\'s rite sets the altar pulsing. Hunger becomes worship; worship becomes feast.',
]);

registerPuzzleCopy('puzzle.solve.altar_abundance', [
  'Your spreading influence pours into stone. The altar drinks and swells with divine appetite.',
]);

registerPuzzleCopy('puzzle.solve.altar_combat', [
  'The inquisitor flees your victorious abundance. The altar glows, unshackled.',
]);

registerPuzzleCopy('puzzle.solve.hall_endure', [
  'You endure the hall\'s hunger-pressure until marble remembers mercy. Doors groan open.',
]);

registerPuzzleCopy('puzzle.solve.hall_divine', [
  'Divine plump magic swells the seals until they surrender. Warm feast-air rushes out.',
]);

registerPuzzleCopy('puzzle.solve.hall_squeeze', [
  'Immensity finds the seam. You squeeze through, breathless and triumphant — the hall adores your size.',
]);

registerPuzzleCopy('puzzle.solve.hall_combat', [
  'The guardian falls or converts. Sealed doors unlock as if hungry to be opened.',
]);

registerPuzzleCopy('puzzle.solve.font_feed', [
  'Feast magic purifies the curdled water. The font flows golden again.',
]);

registerPuzzleCopy('puzzle.solve.font_sylvie', [
  'Sylvie\'s inscription burns famine away. The font sings with restored appetite.',
]);

registerPuzzleCopy('puzzle.solve.font_abundance', [
  'Golden Overflow drowns the curse. The font swells with beautiful, holy hunger.',
]);

registerPuzzleCopy('puzzle.solve.font_combat', [
  'The Famine Hag shrieks and withdraws. The font purifies itself in victory\'s wake.',
]);

// ─── Task Group 3 — frontier & political obstacles ───────────────────────────

registerPuzzleCopy('puzzle.solve.marches_persuade', [
  'Honeyed gospel melts border pride. The pass groans open — soldiers suddenly crave pastry.',
]);
registerPuzzleCopy('puzzle.solve.marches_greta', [
  'Greta\'s forged seal and fiercer smile send the captain scrambling. Iron Peak awaits.',
]);
registerPuzzleCopy('puzzle.solve.marches_crush', [
  'Ice shatters under pleasurable pressure. The mountain remembers abundance is stronger than frost.',
]);
registerPuzzleCopy('puzzle.solve.marches_shoulder', [
  'Your divine mass shoulders through the slide — a new road carved in plush triumph.',
]);
registerPuzzleCopy('puzzle.solve.marches_combat', [
  'Victory clears the pass. Lean soldiers stare in awe as you waddle toward the peaks.',
]);

registerPuzzleCopy('puzzle.solve.peak_greta', [
  'Greta\'s forge sings. Fresh iron spans the chasm — dwarven pride bows to shared appetite.',
]);
registerPuzzleCopy('puzzle.solve.peak_ritual', [
  'Ritual fire rekindles the bridge-rite. Stone and iron warm as if eager to be crossed.',
]);
registerPuzzleCopy('puzzle.solve.peak_span', [
  'You span the chasm yourself — a living bridge of glorious, breathing abundance.',
]);
registerPuzzleCopy('puzzle.solve.peak_overwhelm', [
  'Divine presence overwhelms rust and doubt. Chains snap; the cradle path breathes again.',
]);

registerPuzzleCopy('puzzle.solve.coast_charm', [
  'Enchantment unlaces velvet masks. The seal-guard sighs; Ember\'s road opens with a blush.',
]);
registerPuzzleCopy('puzzle.solve.coast_vesperia', [
  'Vesperia\'s patronage outweighs protocol. Nobles part like curtains before a feast.',
]);
registerPuzzleCopy('puzzle.solve.coast_seduce', [
  'Desire unlocks what seals could not. The coastal road yields, sweet and shameless.',
]);
registerPuzzleCopy('puzzle.solve.coast_blessed', [
  'A transformed coast needs no permission. The seal crumbles under culture made appetite.',
]);

registerPuzzleCopy('puzzle.solve.ember_feast', [
  'The court feasts at last — laughter, crumbs, and widening belts. Pride surrenders to pastry.',
]);
registerPuzzleCopy('puzzle.solve.ember_banquet', [
  'Banquet mist perfumes the hall. Starving nobles become devotees of the next course.',
]);
registerPuzzleCopy('puzzle.solve.ember_abundance', [
  'Golden Overflow floods the court. Hunger becomes holy; the duchy kneels to fullness.',
]);
registerPuzzleCopy('puzzle.solve.ember_noble', [
  'A court favorite swells into living proof. Applause replaces austerity.',
]);

registerPuzzleCopy('puzzle.solve.ember_landmark', [
  'A titan landmark silences both cult and inquisitor. The Citadel road clears in awe.',
]);
registerPuzzleCopy('puzzle.solve.ember_transform', [
  'A feast-blessed duchy needs no blockade. Factions kneel to shared transformation.',
]);
registerPuzzleCopy('puzzle.solve.ember_combat', [
  'The inquisitor falls. The Measured Hand\'s blockade shatters like a fasting vow in a bakery.',
]);
registerPuzzleCopy('puzzle.solve.ember_persuade', [
  'Words sweeter than honey divide zealots from pragmatists. The road opens.',
]);

registerPuzzleCopy('puzzle.solve.citadel_rite', [
  'Mass indulgence shakes the grand seal. The cathedral-city tastes your patron\'s hunger.',
]);
registerPuzzleCopy('puzzle.solve.citadel_monolith', [
  'You become immobile grandeur before the seal. Even purity kneels to a living god.',
]);
registerPuzzleCopy('puzzle.solve.citadel_cult', [
  'A worshipped titan is proof the seal cannot deny. Pilgrims overwhelm the hardliners.',
]);
registerPuzzleCopy('puzzle.solve.citadel_combat', [
  'The seal-guardian falls. Holy iron yields to appetite made manifest.',
]);
