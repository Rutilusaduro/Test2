/**
 * Ending Echo prose — stamp message on Act III completion + arrival lines per archetype/region.
 */
import { registerPool } from '../../engine.js';

// ─── Stamp (fires once when archetype is sealed) ─────────────────────────────

registerPool('ending.echo.stamp', [
  { when: { endingArchetype: 'conversion_ending' }, text: [
    '★ Ending Echo: The Conversion Crown. Six walked beside you; two heartlands knelt as one. The continent\'s conversion depth deepens — abundance is no longer optional anywhere you have been.',
  ]},
  { when: { endingArchetype: 'right_hand_ending' }, text: [
    '★ Ending Echo: Right Hand of the Fat Goddess. Her manifest power answers you twice as readily now — cooldown halved, herald enthroned, the Wheel files you under "irreversible."',
  ]},
  { when: { endingArchetype: 'co_ascendant_ending' }, text: [
    '★ Ending Echo: Co-Ascendant. You and your patron share vitality in battle — two hungers, one life-pool, one argument the gods cannot survive.',
  ]},
  { when: { endingArchetype: 'devouring_ending' }, text: [
    '★ Ending Echo: The Devouring Crown. Cosmic foes arrive already softened — your ending taught the pantheon that fear is an appetizer.',
  ]},
  { when: {}, text: [
    '★ Ending Echo: The crown settles. Act III ends — the continent will never pretend you were a local problem again.',
  ]},
]);

// ─── Arrival (post-Act III travel flavor) ────────────────────────────────────

registerPool('ending.echo.arrival', [
  // Conversion — harvest hearth
  { when: { endingArchetype: 'conversion_ending', region: 'harvest_hearth' }, text: [
    'Pilgrims still arrive uninvited. The Conversion Crown made this inn a shrine — Elara would say that was always the plan.',
  ]},
  { when: { endingArchetype: 'conversion_ending', region: 'fertile_heartlands' }, text: [
    'Dawnmere and Grimwatch share tables now. Your echo deepens every furrow — conversion is culture, not conquest.',
  ]},
  { when: { endingArchetype: 'conversion_ending', region: 'market_square' }, text: [
    'Tarn\'s ledgers show abundance trade volume up. Pensha nods once — the Conversion Crown is good for business.',
  ]},

  // Right Hand — cradle & citadel
  { when: { endingArchetype: 'right_hand_ending', region: 'gorgara_cradle' }, text: [
    'The cradle answers faster now — manifest power half the wait, full devotion. You are her right hand; the veil knows your knock.',
  ]},
  { when: { endingArchetype: 'right_hand_ending', region: 'gilded_citadel' }, text: [
    'The Citadel\'s bells toll wrong on purpose. Her herald walked here; the Wheel still hasn\'t updated its paperwork.',
  ]},
  { when: { endingArchetype: 'right_hand_ending', region: 'divine_plane_vestibule' }, text: [
    'Planar law shivers when you enter — not fear, recognition. The Right Hand is expected now, if never welcomed.',
  ]},

  // Co-Ascendant — temple & vestibule
  { when: { endingArchetype: 'co_ascendant_ending', region: 'ancient_temple' }, text: [
    'Marble remembers two pulses where one walked before — yours and hers, braided. Co-Ascendant echo: the altar has two heartbeats.',
  ]},
  { when: { endingArchetype: 'co_ascendant_ending', region: 'gorgara_cradle' }, text: [
    'The sacred pool reflects both of you. Partner, not servant — the cradle purrs approval.',
  ]},
  { when: { endingArchetype: 'co_ascendant_ending', region: 'barrow_deeps' }, text: [
    'Oath-stone carvings show a double silhouette. The dead god\'s archive notes: two thrones, one feast.',
  ]},

  // Devouring — late regions
  { when: { endingArchetype: 'devouring_ending', region: 'barrow_deeps' }, text: [
    'Even the inverted hunger flinches. Your Devouring Crown left teeth-marks on cosmology itself.',
  ]},
  { when: { endingArchetype: 'devouring_ending', region: 'gilded_citadel_inner' }, text: [
    'Inner sanctum geometry curls away preemptively. Cosmic law learned: you do not negotiate — you digest.',
  ]},
  { when: { endingArchetype: 'devouring_ending', region: 'divine_plane_vestibule' }, text: [
    'Gods\' hallway drafts cold. Cosmic enemies you meet here will arrive already corrupted — your ending\'s echo runs ahead of you.',
  ]},

  // Wildcards per archetype
  { when: { endingArchetype: 'conversion_ending' }, text: [
    'The Conversion Crown echoes — regions lean deeper toward abundance wherever your shadow falls.',
  ]},
  { when: { endingArchetype: 'right_hand_ending' }, text: [
    'The Right Hand\'s echo hums — manifest power cheaper, patron closer, the Wheel\'s denial thinner.',
  ]},
  { when: { endingArchetype: 'co_ascendant_ending' }, text: [
    'Co-Ascendant echo — shared vitality thrums beneath your skin. You are never alone in battle again.',
  ]},
  { when: { endingArchetype: 'devouring_ending' }, text: [
    'Devouring echo — cosmic opposition arrives pre-softened. Fear is the first course you serve now.',
  ]},
  { when: {}, text: [
    'The crown\'s echo follows you — the world rearranged, the feast unfinished, the story still hungry.',
  ]},
]);
