/**
 * Level-up prose pools — celebratory, sensual, abundance-themed.
 */
import { registerPool } from '../../engine.js';

function registerLevelCopy(key, lines) {
  registerPool(key, [{ when: {}, text: lines }]);
}

registerLevelCopy('levelup.default', [
  'Level up! Your body hums with new power — abundance settles into your curves like warm honey.',
  'Gorgara smiles. You have grown not only softer, but stronger in her gospel.',
]);

registerPool('levelup.celebration', [
  { when: { growthLevelUp: true }, text: [
    '★ You level amid swelling flesh and sighing pleasure — euphoria and power intertwine.',
    'The feast within you crests as divine strength blooms. You are more glorious than moments ago.',
  ]},
  { when: {}, text: [
    'A golden warmth spreads through you. Another milestone of abundance achieved.',
    'Your pilgrimage deepens. The Everfull rewards her faithful with power and plushness.',
  ]},
]);

registerPool('levelup.spell_learned', [
  { when: { growthSpell: true }, text: [
    'New growth magic unfurls in your mind — sensual, sacred, and hungry to be cast.',
    'You master a spell of indulgence. The formula tastes like cream and divinity.',
  ]},
  { when: {}, text: [
    'New magic settles into your repertoire — another tool to spread glorious abundance.',
  ]},
]);

registerPool('levelup.wizard', [
  { when: {}, text: [
    'Pages of your spellbook swell with caloric runes. Knowledge and appetite grow together.',
    'You inscribe new overflow theory — each glyph promises softer, fuller miracles.',
  ]},
]);

registerPool('levelup.bard', [
  { when: {}, text: [
    'A new verse blooms in your throat — melody that makes bellies and hearts surrender.',
    'Your repertoire gains a song of abundance. Audiences will never hear it unchanged.',
  ]},
]);

registerPool('levelup.cleric', [
  { when: {}, text: [
    'Gorgara whispers new prayers through you. Divine fullness answers every invocation.',
    'Your domain expands. The goddess grants another sacrament of swelling joy.',
  ]},
]);

registerPool('levelup.warlock', [
  { when: {}, text: [
    'Your patron feeds you another hungry secret. Power drips sweet and heavy into your soul.',
    'The pact deepens — new magic tastes of eternal appetite and velvet shadow.',
  ]},
]);

registerPool('levelup.asi', [
  { when: {}, text: [
    'Your body and spirit align in new perfection — stats rise like dough in a warm oven.',
    'Abundance refines you. Strength, grace, or devotion swells to match your calling.',
  ]},
]);

registerPool('levelup.size_cap', [
  { when: {}, text: [
    '★ Size cap increased! Your body may now embrace even more divine fullness.',
    'The limits of your glory expand — higher size stages beckon, beautiful and inevitable.',
  ]},
]);

registerLevelCopy('levelup.feature', [
  'A new class gift awakens — power blooms alongside your curves.',
]);
