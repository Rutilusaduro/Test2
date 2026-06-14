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
