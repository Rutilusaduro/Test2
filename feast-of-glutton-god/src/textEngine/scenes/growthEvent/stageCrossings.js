// ═══════════════════════════════════════════════════════════════
// GROWTH EVENT — per-stage crossing lexicon. Unique flavor for the
// moment a girl crosses INTO a named weight stage. Milestone stages
// (Chubby/Fat/Enormous/Blob/Leviathan) run deeper. Personas extend
// grow.crossingDialogue per girl.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

// ── grow.crossing ──────────────────────────────────────────────
// Shape: FULL SENTENCE. Keyed on endStage (the stage just crossed into).
registerPool('grow.crossing', [
  { when: {}, text: [
    'She settles into a size she wasn\'t, a little while ago.',
    'A line gets quietly crossed, and there\'s no crossing back.',
  ] },
  // 1 Slim
  { when: { endStage: 1 }, text: [
    'The last of the hard angles soften; she\'s slim now, but only barely.',
    'Whatever sharpness she had blurs gently into slim.',
  ] },
  // 2 Soft
  { when: { endStage: 2 }, text: [
    'She crosses into genuinely soft — the kind you can\'t pass off as anything else.',
    'There\'s give to her everywhere now. Soft is the honest word for it.',
  ] },
  // 3 Chubby (milestone — first undeniable)
  { when: { endStage: 3 }, text: [
    'And there it is: chubby, plainly and finally, no more hedging.',
    'She crosses into chubby and feels the word land — the first one she can\'t argue with.',
    'Soft tips over into chubby, the curve of her belly now leading the way.',
    'This is the size where the old clothes go in a box. Chubby, and climbing.',
  ] },
  // 4 Plump
  { when: { endStage: 4 }, text: [
    'Chubby rounds out into plump, full and unmistakable.',
    'She thickens past chubby into something richer — plump, and wearing it well.',
  ] },
  // 5 Heavy
  { when: { endStage: 5 }, text: [
    'She crosses into heavy, the weight announcing itself in every motion.',
    'Plump deepens into heavy; she feels the difference in her knees, her breath, her balance.',
  ] },
  // 6 Fat (milestone)
  { when: { endStage: 6 }, text: [
    'And now the only word that fits is fat. She crosses into it whole.',
    'Heavy gives way to fat — no softer word survives the size of her now.',
    'She tips into fat, and the room rearranges itself a little to make room.',
    'Fat, properly fat, the kind that changes how a doorway feels. She\'s there now.',
  ] },
  // 7 Very Fat
  { when: { endStage: 7 }, text: [
    'She crosses into very fat, past the point where ordinary furniture was ever the plan.',
    'Fat deepens into very fat, every surface she uses now chosen for how much it can hold.',
  ] },
  // 8 Enormous (milestone)
  { when: { endStage: 8 }, text: [
    'Enormous. The word stops being an exaggeration and becomes a measurement.',
    'She crosses into enormous, and the scale of her becomes the first thing any room is about.',
    'Very fat rolls over into enormous — a size that reorganizes everything around her.',
    'She settles into enormous like a landmark settling into a landscape.',
  ] },
  // 9 Colossal
  { when: { endStage: 9 }, text: [
    'She crosses into colossal, vast beyond what most rooms were built to consider.',
    'Enormous gives way to colossal, and movement becomes a project rather than a reflex.',
  ] },
  // 10 Blob (milestone)
  { when: { endStage: 10 }, text: [
    'She crosses into the size that has only one honest name left: blob.',
    'Colossal surrenders to blob — a body that exists now mostly to be vast and fed.',
    'She settles, finally, into a blob, the world rearranged permanently around her bulk.',
    'There\'s no contour left to describe one piece at a time. She is, simply, a blob now.',
  ] },
  // 11 Leviathan (milestone — top)
  { when: { endStage: 11 }, text: [
    'And past even blob: leviathan, a size with no ceiling above it left to reach for.',
    'She crosses into leviathan, the final word, the one nothing climbs beyond.',
    'Blob deepens into leviathan — she has become something the building is built around.',
    'Leviathan. There is no larger thing to become. She has arrived at the end of the scale.',
  ] },
]);

// ── grow.crossingDialogue ──────────────────────────────────────
// Shape: DIALOGUE BEAT. Keyed endStage band × corruption. priority
// hard-gate prevents tier leak; personas.js layers per-girl voices.
registerPool('grow.crossingDialogue', [
  { when: {}, priority: 1, text: ['', '', ''] },
  // rounded band (3-5)
  { when: { endStageMin: 3, endStageMax: 5, corruption: 0 }, priority: 1, text: [
    '"When did this happen?" she says, half to herself.',
    '"That word fits now. Huh," she says quietly.',
  ] },
  { when: { endStageMin: 3, endStageMax: 5, corruption: 1 }, priority: 1, text: [
    '"I keep crossing lines I said I wouldn\'t," she says, not sounding upset about it.',
  ] },
  { when: { endStageMin: 3, endStageMax: 5, corruption: 2 }, priority: 1, text: [
    '"Good," she says simply, testing the new size with both hands. "Keep it coming."',
  ] },
  // heavy band (6-8)
  { when: { endStageMin: 6, endStageMax: 8, corruption: 0 }, priority: 1, text: [
    '"I used to know exactly what I weighed," she says. "Now I just feel it before I see it."',
  ] },
  { when: { endStageMin: 6, endStageMax: 8, corruption: 1 }, priority: 1, text: [
    '"I\'m not pretending this is an accident anymore," she admits.',
  ] },
  { when: { endStageMin: 6, endStageMax: 8, corruption: 2 }, priority: 1, text: [
    '"This is what I am now," she says, and there\'s no apology in it at all.',
  ] },
  // vast band (9-11)
  { when: { endStageMin: 9, corruption: 0 }, priority: 1, text: [
    '"I don\'t think I understood it would go this far," she says, quietly awed.',
  ] },
  { when: { endStageMin: 9, corruption: 1 }, priority: 1, text: [
    '"There\'s no part of me that fits the old life," she says. "I stopped missing it."',
  ] },
  { when: { endStageMin: 9, corruption: 2 }, priority: 1, text: [
    '"All the way," she breathes. "I want all the way."',
  ] },
]);
