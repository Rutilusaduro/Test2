/**
 * Species-keyed combat growth one-liners — supplement grow.sudden in battle beats.
 */
import { registerPool } from '../../engine.js';

/** @type {{ growthKind: string, target: string[], self: string[] }[]} */
const SPECIES_COMBAT_LINES = [
  {
    growthKind: 'harpy',
    target: [
      '{subject.first}\'s wings buckle as combat growth lands — feathers fluffing over a rounding crop.',
      'Your Growth Damage fattens {subject.name}\'s feathered thighs; she staggers, talons scraping stone.',
    ],
    self: [
      'A blow swells your harpy curves mid-fight — wings heavy, crop greedy, flight forgotten.',
      'Combat growth pads your pinions; you laugh through moans as plushness wins.',
    ],
  },
  {
    growthKind: 'dryad',
    target: [
      'Vines creak as {subject.first} fattens from your strike — bark splitting on plush fertility.',
      '{subject.name}\'s grove-magic surges into hips and belly; petals stick to sweat-slick skin.',
    ],
    self: [
      'Growth Damage ripples through your vines; roots ache as your dryad body swells voluptuous.',
      'Combat fattens you like harvest season — bark cracking, softness blooming.',
    ],
  },
  {
    growthKind: 'stone_golem',
    target: [
      'Marble cracks along {subject.first}\'s midsection — cathedral stone softening into impossible curves.',
      'Your magic fattens {subject.name}\'s golem mass; sacred reliefs stretch over a rounding gut.',
    ],
    self: [
      'Stone grinds softer as combat growth reshapes you — law-construct becoming feast-idol.',
    ],
  },
  {
    growthKind: 'hunger_void',
    target: [
      'The inverted hunger bulges wrong as {subject.first} fattens — absence filling with obscene flesh.',
      '{subject.name}\'s void-shape puckers into plush rolls under Growth Damage.',
    ],
    self: [
      'Combat growth fills your hollow places wrong — inverted appetite made jiggling and real.',
    ],
  },
  {
    growthKind: 'dragon',
    target: [
      '{subject.first}\'s scale-plates gap as a hoard-belly swells from your strike.',
      'Growth Damage fattens {subject.name}\'s draconic immensity — wing-drag, tail thickening.',
    ],
    self: [
      'Combat swells your dragon bulk — scales straining, hoard-belly warming with each blow.',
      'You fatten mid-fight like treasure made flesh; wings droop, pride intact.',
    ],
  },
  {
    growthKind: 'war_titan',
    target: [
      '{subject.first}\'s war-plate splits as titan mass surges from Growth Damage.',
      'Korthak\'s champion fattens seismic under your blows — honest fury softening into feast.',
    ],
    self: [
      'Combat growth stacks on your titan frame — frontier saint becoming living fortress.',
    ],
  },
  {
    growthKind: 'divine_avatar_law',
    target: [
      'Aurelan\'s avatar thickens under your magic — scales of justice warping on a rounding belly.',
      '{subject.first}\'s divine law bows outward; crown sigils stretch across plush new curves.',
    ],
    self: [
      'Growth Damage swells your law-avatar frame — measured verdict becoming measured indulgence.',
    ],
  },
  {
    growthKind: 'goblin',
    target: [
      '{subject.first} giggles as combat fattens her green curves — greedy goblin getting greedier.',
      'Your strike pads {subject.name}\'s goblin belly; she claps, delighted by the jiggle.',
    ],
    self: [
      'Combat growth rounds your goblin belly; you cackle, already hungry for seconds.',
    ],
  },
  {
    growthKind: 'famine_wraith',
    target: [
      'Impossible softness breaches {subject.first}\'s starved frame — famine theology cracking live.',
      '{subject.name}\'s scourge-aura stutters as combat growth pads every visible rib.',
    ],
    self: [
      'Growth Damage floods your emaciated holiness — lean saint becoming feast saint mid-fight.',
    ],
  },
  {
    growthKind: 'succubus',
    target: [
      '{subject.first}\'s infernal curves sharpen then soften — tail thickening with each blow.',
      'Growth Damage swells {subject.name}\'s succubus frame; wings droop heavy with new plushness.',
    ],
    self: [
      'Combat fattens your succubus body — lust given weight, seduction given inches.',
    ],
  },
  {
    growthKind: 'vampire',
    target: [
      'Aristocratic pallor warms as {subject.first} fattens from your strike — eternal hunger reshaped.',
      '{subject.name}\'s cape hides less each second; combat growth pads throat and bosom alike.',
    ],
    self: [
      'Growth Damage softens your vampire elegance — old-world hunger finding a rounder shape.',
    ],
  },
];

for (const entry of SPECIES_COMBAT_LINES) {
  registerPool('growth.target.combat', [{
    when: { growthKind: entry.growthKind },
    weight: 7,
    text: entry.target,
  }]);
  registerPool('growth.self.combat', [{
    when: { growthKind: entry.growthKind },
    weight: 7,
    text: entry.self,
  }]);
}
