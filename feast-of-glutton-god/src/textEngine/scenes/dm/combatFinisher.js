/**
 * Combat finisher — player chooses how a won fight ends.
 * Kill: dispatch. Fatten: swell to immobility with physical, action-forward prose.
 */
import { registerPool, createContext, render } from '../../engine.js';
import { getStage } from '../../../gameData/stages.js';
import '../../modules.js';
import '../../lexicon.js';

registerPool('dm.combat.finisher.prompt', [
  { when: {}, text: [
    'The last blow lands — ripe fruit splitting, breath knocked loose. The field holds still. How do you end this?',
    'Victory trembles on your tongue. {subject.name} lies beaten at your feet. What happens next is yours to choose.',
    'Steel and spell fall quiet. One enemy, one moment — the DM waits for your verdict.',
    'The decisive strike echoes off stone. {subject.first} sprawls, stunned and softer than when {they} stood. How do you finish it?',
  ]},
]);

registerPool('dm.combat.finisher.kill', [
  { when: { endStageMin: 4 }, text: [
    'You end it cleanly — mercy absent. {subject.name} goes still beneath helpless, jiggling mass, fight gone for good.',
    'A final strike through plush obstruction. {subject.first} shudders once, belly quivering, then slack — soft and finished.',
    'No conversion, no sermon — just the wet thud of a body too heavy to rise, warmth draining from curves you swelled.',
  ]},
  { when: {}, text: [
    'You finish what the battle started — quick, cruel, final. {subject.name} crumples, all fight leaving {them} in one last exhale.',
    '{subject.first} goes limp beneath your verdict. The tale marks a kill, not a convert — still glorious in defeat.',
    'Steel or spell seals it. {subject.name} will not stand again; the softness you gave {them} is only a tomb now.',
  ]},
]);

registerPool('dm.combat.finisher.fatten', [
  { when: { stagesJumpedMin: 3 }, text: [
    'You pour the last magic into {subject.name} — belly exploding outward, thighs spreading until {they} cannot rock upright. Immobile and glistening, {subject.first} lies pinned under glorious weight.',
    'Growth does not stop. {subject.first} balloons past dignity — gut swallowing stone, arms pinned, every struggle a helpless jiggle until {they} can only lie there and take it.',
    'You fatten {subject.name} past standing — plush flesh landslide, seams burst, skin dewed. {They} cannot roll, cannot rise, only be soft for you.',
  ]},
  { when: { stagesJumpedMin: 1 }, text: [
    'One more surge and {subject.name} crosses the line — belly dragging, thighs locked wide. {subject.first} tries to lift {their} head; the weight wins. Immobile, panting, stuffed on stone.',
    'You pack the last pounds on with hunger. {subject.first}\'s hips spread until {they} pin {them}; each breath rolls through a gut that will not let {them} stand. Defeated, displayed, stuck.',
    'Magic and appetite finish together. {subject.name} swells until movement is memory — flesh pooling, too plush to leverage, shuddering with each helpless jiggle.',
  ]},
  { when: {}, text: [
    'You swell {subject.name} until the ground claims {them} — immobile, flushed, curves trembling with trapped heat. {subject.first} can barely lift a hand through plush flesh.',
    'The last growth lands and {subject.first} is done moving — a soft, pinned trophy, belly rising slow, thighs splayed, utterly yours.',
    'Abundance seals {subject.name} in place — warm, heavy, helpless. {subject.first} gasps as {their} own softness pins {them}, too stuffed to struggle.',
  ]},
]);

export const FINISHER_IMMOBILE_STAGE = 11;

export function renderFinisherPrompt(game, enemy, opts = {}) {
  if (!enemy) return 'How do you end this fight?';
  const ctx = createContext({
    subject: {
      name: enemy.name,
      lbs: enemy.lbs,
      pronouns: enemy.pronouns || 'they',
    },
    ref: game.player,
    globals: { outcomeKind: 'ko' },
    seed: opts.seed,
  });
  return render('{dm.combat.finisher.prompt}', ctx, opts).trim();
}

export function renderFinisherOutcome(game, enemy, choice, growth = {}, opts = {}) {
  if (!enemy) return '';
  const pool = choice === 'fatten' ? 'dm.combat.finisher.fatten' : 'dm.combat.finisher.kill';
  const ctx = createContext({
    subject: {
      name: enemy.name,
      lbs: enemy.lbs,
      pronouns: enemy.pronouns || 'they',
    },
    ref: game.player,
    globals: {
      startStage: growth.startStage ?? getStage(enemy.lbs).id,
      endStage: growth.endStage ?? getStage(enemy.lbs).id,
      stagesJumped: growth.stagesJumped ?? 0,
      outcomeKind: choice === 'fatten' ? 'converted' : 'ko',
    },
    seed: opts.seed,
  });
  return render(`{${pool}}`, ctx, opts).trim();
}
