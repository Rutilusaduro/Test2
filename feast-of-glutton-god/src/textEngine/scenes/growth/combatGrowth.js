/**
 * Combat growth beats — physical, action-forward prose. No dialogue.
 * Wired from combat.js log and CombatView growth panel.
 */
import { registerPool, createContext, render } from '../../engine.js';
import { getStage, getMovement, getTileSize, lbsForStage } from '../../../gameData/stages.js';
import '../../modules.js';
import '../../lexicon.js';
import './speciesCombatGrowth.js';

registerPool('growth.combat.impact', [
  { when: { stagesJumpedMin: 2 }, text: [
    'The strike detonates through {subject.name} — flesh surges outward in a heavy, visible wave.',
    'Growth Damage cascades: belly, breast, and hip bloom wider between heartbeats.',
    '{subject.first} balloons from the hit — mass arriving faster than balance can track.',
  ]},
  { when: { endStageMin: 6 }, text: [
    'Impact ripples through {subject.name}\'s already-massive frame; new pounds settle low in gut and thigh.',
    'The blow pads {subject.first} further — flesh jiggles, stance widening on the stone.',
  ]},
  { when: { endStageMin: 3 }, text: [
    'The hit lands soft and deep — {subject.name}\'s midsection rounds outward, belt cinch biting skin.',
    'Growth Damage swells {subject.first} at the point of impact; fabric strains, breath catches.',
    'Flesh yields then rebounds heavier — {subject.name} carries the new weight awkwardly.',
  ]},
  { when: {}, text: [
    'The strike pads {subject.name} — hips and belly take the blow as visible softness.',
    'Growth ripples through {subject.first}; curves thicken where the hit landed.',
    '{subject.name} fattens from the impact — a shudder, then extra inches holding still.',
  ]},
]);

registerPool('growth.combat.hindrance', [
  { when: { movementDropped: true, tileExpanded: true }, text: [
    'Footing goes sloppy — {they} lose a step of reach and sprawl across more tiles, armor binding at the seams.',
    'New mass drags {subject.first} shorter and wider; the next lunge will not clear the distance it did a moment ago.',
  ]},
  { when: { movementDropped: true }, text: [
    'Fresh weight pools in belly and thigh — stride shortens, knees dipping on the turn.',
    '{subject.first} wobbles; extra pounds steal a tile of movement before {they} catch balance.',
    'Gravity finds the new softness first — {subject.name} moves like the floor got stickier.',
  ]},
  { when: { tileExpanded: true }, text: [
    '{subject.name} swells wider on the field — footprint spreading, pauldrons canting as shoulders round.',
    'Mass expands sideways; {subject.first} occupies more grid than {their} footing remembers.',
  ]},
  { when: { endStageMin: 4 }, text: [
    'Center of gravity shifts forward — {subject.first} overcommits on the next pivot.',
    'Belly weight throws off {their} guard; arms slow, reach shortened by plush obstruction.',
  ]},
  { when: { endStageMin: 2 }, text: [
    'Thighs brush where they used to clear — gait widens, dodge angle compromised.',
    'New softness at the waist tugs on every twist; {subject.name} fights the drag.',
  ]},
  { when: {}, text: [
    'The added weight is already in the way — balance off, breath labored.',
  ]},
]);

const COMBAT_GROWTH_TEMPLATE =
  '{growth.combat.impact}{join:growth.combat.hindrance|prefix: }';

export function buildCombatGrowthGlobals(unit, growth, attacker = null) {
  const startStage = growth.startStage ?? Math.max(0, getStage(unit.lbs).id - (growth.stagesJumped ?? 1));
  const endStage = growth.endStage ?? getStage(unit.lbs).id;
  const stagesJumped = growth.stagesJumped ?? Math.max(0, endStage - startStage);
  const prevMove = getMovement(startStage);
  const nextMove = getMovement(endStage);
  const prevTile = getTileSize(startStage);
  const nextTile = getTileSize(endStage);

  return {
    startStage,
    endStage,
    stagesJumped,
    gainLbs: Math.max(0, lbsForStage(endStage) - lbsForStage(startStage)),
    growthMethod: 'combat',
    growthType: 'combat',
    growthPerspective: attacker && attacker.isPlayer && unit?.isEnemy ? 'target' : 'self',
    prevMovement: prevMove,
    nextMovement: nextMove,
    prevTileSize: prevTile,
    nextTileSize: nextTile,
    movementDropped: nextMove < prevMove,
    tileExpanded: nextTile > prevTile,
  };
}

/**
 * Render a combat growth beat — impact + physical hindrance, no quoted speech.
 */
export function renderCombatGrowthBeat(unit, growth, opts = {}) {
  if (!unit || !growth?.stagesJumped) return '';

  const globals = buildCombatGrowthGlobals(unit, growth, opts.attacker);
  const ctx = createContext({
    subject: unit,
    ref: opts.attacker ?? null,
    globals,
    seed: opts.seed,
    history: opts.history,
  });

  const speciesLine = render('{growth.target.combat}', ctx, { trace: opts.trace });
  const core = render(COMBAT_GROWTH_TEMPLATE, ctx, { trace: opts.trace });
  return [speciesLine, core].filter(Boolean).join(' ');
}
