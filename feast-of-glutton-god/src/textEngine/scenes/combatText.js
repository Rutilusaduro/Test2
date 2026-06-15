import { registerPool, createContext, render } from '../engine.js';
import '../modules.js';

registerPool('combat.action', [
  { when: { interaction: 'attack' }, text: [
    '{subject.name} strikes with {word.size} force — flesh meeting flesh in a heavy, voluptuous impact.',
    'A devastating blow from {subject.first}\'s growing body; curves become weapons of abundance.',
  ]},
  { when: { interaction: 'feed' }, text: [
    'You force-feed {subject.name} mid-battle — she swells and moans, hunger overtaking hostility.',
    'Caloric energy pours into {subject.first} until resistance melts into shameless pleasure.',
  ]},
  { when: { interaction: 'growth' }, text: [
    '{subject.name} surges larger mid-fight — belly and hip spreading, balance shifting under fresh weight.',
    'Combat growth ripples across {subject.first}; seams strain, footing wobbles, reach shortened.',
  ]},
  { when: { interaction: 'convert' }, text: [
    '{subject.name} drops her weapon, hands on her swollen belly. "I… I surrender to the feast."',
    'Overfed and overwhelmed, {subject.first} kneels — a convert to the Fat Goddess\'s gospel.',
  ]},
  { when: { interaction: 'spell' }, text: [
    'Spell-light drapes {subject.name} in caloric radiance — magic and flesh intertwine.',
    'Abundance magic reshapes the battlefield through {subject.first}\'s willing curves.',
  ]},
  { when: { interaction: 'self_feed' }, text: [
    '{subject.name} feeds herself mid-battle, moaning as her own body swells with power.',
    'Self-indulgence becomes tactic — {subject.first} grows heavier, happier, unstoppable.',
  ]},
  { when: { interaction: 'body_slam' }, text: [
    '{subject.name} crashes into her foe with glorious mass — impact and growth in one motion.',
    'A body slam from {subject.first}\'s {word.size} frame — physics rewritten by abundance.',
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
  return render('{combat.action}', ctx, { trace: opts.trace });
}
