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
