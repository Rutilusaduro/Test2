import { registerPool } from '../../engine.js';

registerPool('achievement.unlock', [
  { text: [
    '★ Achievement — {achievementTitle}. The Church files it under heresy; the faithful file it under inspiration.',
    '★ Liturgy unlocked: {achievementTitle}. Another verse added to the gospel of fullness.',
    '★ {achievementTitle} — beatified in the records of indulgence. +1 prestige progress.',
  ]},
]);
