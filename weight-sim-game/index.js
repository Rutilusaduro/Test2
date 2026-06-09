// College Weight Simulation Game
// Main entry point

const readlineSync = require('readline-sync');
const { startGame } = require('./game');

console.log('Welcome to the College Weight Management Simulation!');
console.log('===============================================');
console.log('In this simulation, you play as a professor managing');
console.log('the health and well-being of your college students.');
console.log();

startGame();