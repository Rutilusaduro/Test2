// ═══════════════════════════════════════════════════════════════
// GROWTH EVENT — per-stage crossing lexicon (15-tier ladder).
// Physical sensation only — no size stage names in prose.
// ═══════════════════════════════════════════════════════════════
import { registerPool } from '../../engine.js';

registerPool('grow.crossing', [
  { when: {}, text: [
    'She settles into a size she wasn\'t, a little while ago.',
    'A line gets quietly crossed, and there\'s no crossing back.',
  ] },
  { when: { endStage: 1 }, text: [
    'The last hard angles soften; curves arrive like a secret finally spoken aloud.',
    'Whatever sharpness she had blurs into gentle roundness — unmistakable now, impossible to deny.',
  ] },
  { when: { endStage: 2 }, text: [
    'Her belly rounds outward for real; thighs brush, hips widen, and the mirror stops arguing.',
    'There\'s give to her everywhere now — plush, honest, and growing warmer by the breath.',
  ] },
  { when: { endStage: 3 }, text: [
    'She thickens past mere softness into something that sways when she walks and commands when she stands still.',
    'The old clothes go in a box; her presence fills doorways before her body quite does.',
    'Curves deepen like poured honey — belly leading, hips following, and hunger smiling behind.',
  ] },
  { when: { endStage: 4 }, text: [
    'Doorways feel narrower; chairs protest sooner; she notices the world measuring her differently.',
    'She thickens into magnificence — every step a little earthquake of jiggle, every breath a little victory.',
  ] },
  { when: { endStage: 5 }, text: [
    'She towers now — not metaphorically. Heads tilt up. Floors remember her longer.',
    'Strength and size braid together; her belly hangs heavy and proud, and ordinary people look small beside her.',
  ] },
  { when: { endStage: 6 }, text: [
    'Her footfalls send tremors through floorboards; mortals scatter with delighted alarm.',
    'She has outgrown the language of "tall" — this is something that reshapes rooms by entering them.',
  ] },
  { when: { endStage: 7 }, text: [
    'She swells until she could curl around treasure — or a village — and still have softness to spare.',
    'Heat rolls off her in waves; the air tastes like indulgence, and furniture has given up pretending.',
    'At this scale she hoards flesh the way legends hoard gold — warm, vast, and impossible to ignore.',
  ] },
  { when: { endStage: 8 }, text: [
    'Halls shrink around her; ceilings feel lower though they have not moved.',
    'She is geography now — movement slow, presence absolute, hunger a weather pattern.',
    'Stone and timber remember their purpose is to contain mortals, not whatever she is becoming.',
  ] },
  { when: { endStage: 9 }, text: [
    'Each breath rearranges the air; each inch gained feels like a decree the world must obey.',
    'Movement becomes labor — influence does not. She is heavy enough to be politics.',
    'The ground dimples where she settles; onlookers forget their errands and stare like pilgrims.',
  ] },
  { when: { endStage: 10 }, text: [
    'Chambers were built for people; she is nearly built for chambers — filling them until worship feels practical.',
    'She cannot stand without the world noticing; she cannot sit without the world changing shape.',
    'Servants would need carts to feed her if servants still reached her lips without ladders.',
  ] },
  { when: { endStage: 11 }, text: [
    'She stops being mobile without help — and starts being inevitable. Command replaces wandering.',
    'Walls crack from proximity alone; she is a landmark that breathes.',
    'The city will come to her now, because she cannot reasonably go to it.',
  ] },
  { when: { endStage: 12 }, text: [
    'Realms rearrange around her stillness — roads bend, rumors run faster than wagons.',
    'She is a mountain of softness and authority; birds nest in the shadow of her curves.',
    'To approach her is pilgrimage; to grow beside her is doctrine.',
  ] },
  { when: { endStage: 13 }, text: [
    'Continents feel smaller — not because the map changed, but because she did.',
    'Cults rise in her shadow with quiet devotion; the horizon is belly, thigh, and blessing.',
    'She does not walk the world anymore. The world orbits her appetite.',
  ] },
  { when: { endStage: 14 }, text: [
    'There is no larger thing left to become — only more of her, spreading like a feast that never ends.',
    'Apotheosis feels less like lightning and more like settling: vast, warm, and final.',
    'the Fat Goddess\'s rival does not arrive with trumpets. She arrives with groaning stone and grateful screaming.',
    'The scale has no ceiling left. She is the ceiling — soft, sacred, and still growing in legend.',
  ] },
]);

registerPool('grow.crossingDialogue', [
  { when: {}, priority: 1, text: ['', '', ''] },
  { when: { endStageMin: 3, endStageMax: 5, corruption: 0 }, priority: 1, text: [
    '"When did this happen?" she says, half to herself.',
    '"I can feel it in my knees," she murmurs, surprised and pleased.',
  ] },
  { when: { endStageMin: 3, endStageMax: 5, corruption: 1 }, priority: 1, text: [
    '"I keep crossing lines I said I wouldn\'t," she says, not sounding upset about it.',
  ] },
  { when: { endStageMin: 3, endStageMax: 5, corruption: 2 }, priority: 1, text: [
    '"Good," she says simply, testing the new size with both hands. "Keep it coming."',
  ] },
  { when: { endStageMin: 6, endStageMax: 8, corruption: 0 }, priority: 1, text: [
    '"I used to know exactly what I weighed," she says. "Now I just feel it before I see it."',
  ] },
  { when: { endStageMin: 6, endStageMax: 8, corruption: 1 }, priority: 1, text: [
    '"I\'m not pretending this is an accident anymore," she admits.',
  ] },
  { when: { endStageMin: 6, endStageMax: 8, corruption: 2 }, priority: 1, text: [
    '"This is what I am now," she says, and there\'s no apology in it at all.',
  ] },
  { when: { endStageMin: 9, endStageMax: 11, corruption: 0 }, priority: 1, text: [
    '"I don\'t think I understood it would go this far," she says, quietly awed.',
  ] },
  { when: { endStageMin: 9, endStageMax: 11, corruption: 1 }, priority: 1, text: [
    '"There\'s no part of me that fits the old life," she says. "I stopped missing it."',
  ] },
  { when: { endStageMin: 9, endStageMax: 11, corruption: 2 }, priority: 1, text: [
    '"All the way," she breathes. "I want all the way."',
  ] },
  { when: { endStageMin: 12, corruption: 0 }, priority: 1, text: [
    '"The ground feels… far away," she says, voice echoing off cracked stone.',
  ] },
  { when: { endStageMin: 12, corruption: 1 }, priority: 1, text: [
    '"Let them come to me," she says. "I have room for all of them."',
  ] },
  { when: { endStageMin: 12, corruption: 2 }, priority: 1, text: [
    '"More," she whispers, and the walls shiver like they heard.',
  ] },
]);
