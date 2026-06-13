import { registerPool, createContext, render } from '../engine.js';
import '../modules.js';

registerPool('combat.action', [
  { when: { interaction: 'attack' }, text: [
    '{subject.name} strikes with {word.size} force — flesh meeting flesh in a heavy impact.',
    'A devastating blow from {subject.first}\'s growing body.',
  ]},
  { when: { interaction: 'feed' }, text: [
    'You force-feed {subject.name} mid-battle — she swells and moans, hunger overtaking hostility.',
    'Caloric energy pours into {subject.first} until resistance melts into pleasure.',
  ]},
  { when: { interaction: 'growth' }, text: [
    '{subject.name} surges larger mid-fight, golden light rippling across new softness.',
    'Combat growth — {subject.first}\'s body balloons with divine abundance.',
  ]},
  { when: { interaction: 'convert' }, text: [
    '{subject.name} drops her weapon, hands on her swollen belly. "I… I surrender to the feast."',
    'Overfed and overwhelmed, {subject.first} kneels — a convert to Gorgara.',
  ]},
  { when: {}, text: [
    'The battle shifts as abundance reshapes the field.',
  ]},
]);

export function renderCombatBeat(unit, opts = {}) {
  const ctx = createContext({
    subject: unit,
    globals: { interaction: opts.interaction || 'attack' },
    seed: opts.seed,
  });
  return render('{combat.action}', ctx);
}
