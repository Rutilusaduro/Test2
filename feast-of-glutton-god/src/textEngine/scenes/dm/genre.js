import { registerPool, createContext, render } from '../../engine.js';

// ── dm.genre.frame — arrival genre-clash framing (FULL SENTENCE) ──
// The ONLY voice that perceives the mismatch between earnest fantasy and off-genre power.
registerPool('dm.genre.frame', [
  { when: { escalationTierMin: 3, region: 'gilded_citadel' }, text: [
    'The temple-capital kneels to gods who do not know what you are. Even here, your patron\'s hunger reads wrong to the Wheel.',
    'Incense and hymn — and beneath them, the wrongness you carry. The pantheon\'s heart beats faster because you walked in.',
    'Aurelan\'s city was built for measured souls. You are a feast that no scale was forged to weigh.',
  ]},
  { when: { escalationTierMin: 2, region: 'ancient_temple' }, text: [
    'Dead god, honest dungeon — and you, impossibly full of a living hunger that predates this barrow.',
    'The Wheel\'s silence in these halls makes your patron\'s pulse louder. Wrong genre, right corridor.',
    'Ascetic stone remembers moderation. Your body remembers otherwise, and the contrast is almost funny.',
  ]},
  { when: { escalationTierMin: 2, region: 'gilded_citadel' }, text: [
    'High orthodoxy, high stakes — and you still look like a traveler who might share lunch. They have no idea.',
    'The Church\'s capital takes itself seriously. So do you, which is the problem.',
    'Bells toll for measured grace. Your patron tolls back, politely, from somewhere outside their hymnals.',
  ]},
  { when: { escalationTierMin: 1, region: 'harvest_hearth' }, text: [
    'A frontier village doing frontier things. You fit the scene — until you don\'t, and only you notice the seam.',
    'Bread, mud, honest work. The Wheel\'s world, playing itself straight. Your secret sits warm behind your ribs.',
    'They see a local. You know you\'re also a walking heresy with excellent table manners.',
  ]},
  { when: { escalationTierMin: 1, region: 'market_square' }, text: [
    'Guild law, spice, coin changing hands — classic. Your patron\'s appetite is not on any merchant\'s ledger.',
    'The square haggles over fair weight. You haggle with infinity and call it faith.',
    'A proper trade city. You are improper in ways no inspector is trained to cite.',
  ]},
  { when: { escalationTier: 0, region: 'harvest_hearth' }, text: [
    'Ordinary village morning — smoke, geese, a child chasing a dog. You almost forget you\'re the odd one out.',
    'Tutorial-town earnestness. The kind of place that believes in harvest quotas, not cosmic genre errors.',
    'Warm hearth, straight fantasy. Your patron purrs anyway; she always does.',
  ]},
  { when: { escalationTier: 0, region: 'gorgara_cradle' }, text: [
    'A thin place where the Wheel leaks — your shrine, your secret. Locals would call it a haunted dell and move on.',
    'The veil wears thin here. So does restraint, if you let it. Only you know why.',
    'Hidden grotto, hidden faith. The world sees a pretty cave. You see a door left ajar.',
  ]},
  { when: { escalationTier: 0 }, text: [
    'The world plays high fantasy without a wink. You play something else, politely, in the same scene.',
    'Earnest roads, earnest faces. Your power doesn\'t match the genre — yet only the narrator seems to notice.',
    'Classic adventure country. You are the cheat code written in cream and scripture.',
  ]},
  { when: {}, text: [
    'The scene is sincere. You are not, quite — and that gap is where the story lives.',
    'Straight fantasy all around you. Your patron stretches the page at the margins.',
    'Nobody breaks character here except the voice in your ear, amused and watching.',
  ]},
]);

// ── dm.genre.power — mundane OP moments (FULL SENTENCE) ─────────
registerPool('dm.genre.power', [
  { when: { escalationTierMin: 2 }, text: [
    'The threat meant to stop you. You meant to feed it. Genre conventions lose again.',
    'Cosmic tier aside, nothing here was built to counter *this*. The Wheel groans in its sleep.',
    'They brought a boss fight. You brought a banquet. The mismatch is the punchline.',
  ]},
  { when: { escalationTierMin: 1 }, text: [
    'Steel, spell, snarl — then the comfortable certainty that you are simply stronger than the script.',
    'The dungeon expected heroes. It got appetite with reach.',
    'One more thing that should have been dangerous. Your patron yawns; you win.',
  ]},
  { when: {}, text: [
    'Another obstacle treated as lunch. The world frowns; you smile. Fair trade.',
    'Mundane power meets off-genre abundance. Guess which one bends.',
    'They played their part perfectly. You played yours — fuller, faster, unfairly.',
  ]},
]);

// ── dm.genre.escalation — tier register (FULL SENTENCE) ─────────
registerPool('dm.genre.escalation', [
  { when: { escalationTier: 3 }, text: [
    'Act III air — awed, terrified, divine. The Wheel knows your name now, and wishes it didn\'t.',
    'Apotheosis weather. Even the narrator speaks softer; the sky does not.',
    'Endgame register: the gods are listening. So is your patron. Buckle in.',
  ]},
  { when: { escalationTier: 2 }, text: [
    'Act II alarm — diviners whisper, inquisitors march, the anomaly spreads.',
    'The continent stops pretending this is a local problem. Good. It never was.',
    'Escalation climbs: earnest world, unearnest you, widening gap.',
  ]},
  { when: { escalationTier: 1 }, text: [
    'Act I crackle — first whispers of wrongness, still deniable, already true.',
    'Someone almost notices. Almost is the fun part.',
    'Bemusement shading to concern. The genre clash sharpens.',
  ]},
  { when: {}, text: [
    'Early days — bemused narrator, straight world, secret patron.',
    'The joke is quiet for now. It won\'t stay that way.',
    'Tier zero: you look normal. You aren\'t. The story knows.',
  ]},
]);

export function renderGenreBeat(game, kind = 'frame', opts = {}) {
  const poolKey = `dm.genre.${kind}`;
  const regionId = opts.regionId ?? game?.region;
  const ctx = createContext({
    subject: game?.player,
    globals: {
      region: regionId,
      escalationTier: opts.escalationTier ?? game?.worldFlags?.escalationTier ?? 0,
      ...(opts.globals ?? {}),
    },
    seed: opts.seed,
  });
  return render(`{${poolKey}}`, ctx, { trace: opts.trace });
}
