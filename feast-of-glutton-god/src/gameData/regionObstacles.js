/**
 * Connection gates — travel blocked until puzzle solved, unlock path met, or flag set.
 */
import { getRegion, isRegionLocked } from './regions.js';
import {
  isExitBlockedByGiant,
  isImpassableToSmall,
  isSmallTraveler,
} from './worldReactivity.js';
import { rollHostilityTravelEncounter } from './regionHostility.js';
import {
  isAnyUnlockSatisfied,
  tryClearObstacle,
  describeUnlockOptions,
} from './obstacleUnlocks.js';
import { isGateIgnoredByPrestige } from './prestige.js';

export const CONNECTION_GATES = [
  {
    id: 'gate_heartlands_cradle',
    from: 'fertile_heartlands',
    to: 'gorgara_cradle',
    puzzleId: 'choked_ravine',
    solvedFlag: 'puzzle_choked_ravine_solved',
    blockedText: 'The Swollen Ravine blocks the path to Shrine of the Thin Veil — vines and swollen fruit choke the crossing. Find another way through abundance.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'choked_ravine' },
      { method: 'player_size_min', stage: 6, label: 'Living bridge' },
      { method: 'cast_spell', tags: ['slick', 'soften'], label: 'Slick abundance' },
      { method: 'place_giant', minStage: 11, label: 'Landmark blocks the gorge' },
      { method: 'combat', enemyId: 'harvest_harpy', label: 'Clear the harpy nest' },
    ],
    clearMessage: '✦ The ravine yields — a new path opens toward Shrine of the Thin Veil.',
  },
  {
    id: 'gate_marches_peak',
    from: 'northern_marches',
    to: 'iron_peak_hold',
    puzzleId: 'marches_blocked_pass',
    solvedFlag: 'puzzle_marches_pass_solved',
    blockedText: 'A landslide of ice and pride blocks the pass to Iron Peak Hold — soldiers refuse passage to "indulgent" travelers.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'marches_blocked_pass' },
      { method: 'persuade', npcId: 'greta_smith', tier: 2, label: 'Smith\'s letter of passage' },
      { method: 'player_size_min', stage: 7, label: 'Shoulder through the slide' },
      { method: 'cast_spell', tags: ['crush', 'swell'], label: 'Crush the ice' },
      { method: 'combat', enemyId: 'rival_adventurer', label: 'Duel the border captain' },
    ],
    clearMessage: '✦ The mountain pass groans open toward Iron Peak Hold.',
  },
  {
    id: 'gate_coast_ember',
    from: 'sapphire_coast',
    to: 'ember_duchy',
    puzzleId: 'coast_velvet_seal',
    solvedFlag: 'puzzle_coast_seal_solved',
    blockedText: 'Velvet-masked courtiers seal the coastal road to Ember Duchy — only charm, bribery, or glorious mass persuades them.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'coast_velvet_seal' },
      { method: 'cast_spell', tags: ['charm'], label: 'Enchant the seal-guard' },
      { method: 'feed_npc_to_stage', npcId: 'vesperia', stage: 6, label: 'Noble patron vouches for you' },
      { method: 'bless_region', regionId: 'sapphire_coast', transformationMin: 2, label: 'Coast transformed enough' },
    ],
    clearMessage: '✦ The velvet seal parts — Ember Duchy awaits.',
  },
  {
    id: 'gate_ember_citadel',
    from: 'ember_duchy',
    to: 'gilded_citadel',
    puzzleId: 'ember_contested_approach',
    solvedFlag: 'puzzle_ember_approach_solved',
    blockedText: 'Church hardliners and heresy-hunters contest the road to the Gilded Citadel — the capital will not yield to unchecked appetite.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'ember_contested_approach' },
      { method: 'place_giant', minStage: 12, regionId: 'ember_duchy', label: 'A titan landmark silences both factions' },
      { method: 'bless_region', regionId: 'ember_duchy', transformationMin: 3, label: 'Duchy feast-blessed' },
      { method: 'communal_feast', regionId: 'ember_duchy', label: 'Hold a court-wide feast' },
      { method: 'combat', enemyId: 'purity_inquisitor', label: 'Break the inquisitor blockade' },
    ],
    clearMessage: '✦ The contested road clears — the Gilded Citadel gleams ahead.',
  },
  {
    id: 'gate_peak_cradle',
    from: 'iron_peak_hold',
    to: 'gorgara_cradle',
    puzzleId: 'peak_forge_bridge',
    solvedFlag: 'puzzle_peak_bridge_solved',
    blockedText: 'A collapsed forge-bridge spans the chasm toward the sacred cradle — dwarven pride and rusted iron say no.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'peak_forge_bridge' },
      { method: 'cast_spell', tags: ['ritual', 'fertile'], label: 'Ritual rekindling' },
      { method: 'feed_npc_to_stage', npcId: 'greta_smith', stage: 7, label: 'Greta forges a crossing' },
      { method: 'player_size_min', stage: 8, label: 'Span the chasm yourself' },
    ],
    clearMessage: '✦ Iron and faith yield — Shrine of the Thin Veil draws near.',
  },
  {
    id: 'gate_temple_barrow',
    from: 'ancient_temple',
    to: 'barrow_deeps',
    puzzleId: 'barrow_deep_oath',
    solvedFlag: 'puzzle_barrow_deep_solved',
    blockedText: 'Oath-carved stone seals the descent into the Barrow Deeps — Veshanne\'s domain does not welcome the uninvited.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'barrow_deep_oath' },
      { method: 'flag_set', flag: 'lean_saint_defeated', label: 'the Lean Saint\'s defeat echoes below' },
      { method: 'player_level_min', level: 11, label: 'Mythic stature commands the dead' },
      { method: 'cast_spell', tags: ['ritual', 'abundance'], label: 'Ritual of descent' },
    ],
    clearMessage: '✦ The barrow exhales — oath-stone yields to appetite older than the Wheel.',
  },
  {
    id: 'gate_citadel_inner',
    from: 'gilded_citadel',
    to: 'gilded_citadel_inner',
    puzzleId: 'citadel_inner_seal',
    solvedFlag: 'puzzle_citadel_inner_solved',
    blockedText: 'Blessed geometry seals the Inner Sanctum — only those who have broken Act II\'s fever may approach the Wheel\'s heart.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'citadel_inner_seal' },
      { method: 'flag_set', flag: 'main_act2_complete', label: 'Act II complete' },
      { method: 'player_level_min', level: 13, label: 'Regional power proven' },
      { method: 'combat', enemyId: 'champion_aurelan', label: 'Break Aurelan\'s seal-guard' },
    ],
    clearMessage: '✦ The inner sanctum unseals — divine law made architecture, and you are already rewriting it.',
  },
  {
    id: 'gate_cradle_vestibule',
    from: 'gorgara_cradle',
    to: 'divine_plane_vestibule',
    puzzleId: 'vestibule_threshold',
    solvedFlag: 'puzzle_vestibule_solved',
    blockedText: 'The thin veil tears toward something impossible — the gods\' own threshold. Only apotheosis heat may pass.',
    unlocks: [
      { method: 'puzzle_solved', puzzleId: 'vestibule_threshold' },
      { method: 'flag_set', flag: 'apotheosis_threshold', label: 'Apotheosis threshold reached' },
      { method: 'player_level_min', level: 17, label: 'Near-divine stature' },
      { method: 'cast_spell', tags: ['apotheosis', 'ritual'], label: 'Apotheosis rite' },
    ],
    clearMessage: '✦ Reality folds — you step onto the Threshold of the Measured Wheel.',
  },
];

export function syncGateUnlocks(game, context = {}) {
  const messages = [];
  for (const gate of CONNECTION_GATES) {
    const result = tryClearObstacle(game, gate, { ...context, regionId: gate.from });
    if (result?.message) messages.push(result.message);
  }
  return messages;
}

export function getGateForConnection(fromRegionId, toRegionId) {
  return CONNECTION_GATES.find(
    (g) => g.from === fromRegionId && g.to === toRegionId,
  ) ?? null;
}

export function isConnectionBlocked(game, fromRegionId, toRegionId) {
  syncGateUnlocks(game, { regionId: fromRegionId });
  const gate = getGateForConnection(fromRegionId, toRegionId);
  if (!gate) return { blocked: false };
  if (isGateIgnoredByPrestige(game, gate.id)) return { blocked: false };
  if (game.worldFlags?.[gate.solvedFlag]) return { blocked: false };
  if (isAnyUnlockSatisfied(game, gate.unlocks, { regionId: fromRegionId })) {
    tryClearObstacle(game, gate, { regionId: fromRegionId });
    return { blocked: false };
  }

  const altPaths = describeUnlockOptions(gate.unlocks ?? []).slice(0, 3);
  const altNote = altPaths.length
    ? `\n\nOther paths: ${altPaths.join(' · ')}`
    : '';

  return {
    blocked: true,
    gate,
    reason: `${gate.blockedText}${altNote}`,
    puzzleId: gate.puzzleId,
  };
}

export function getTravelOptions(game, regionId) {
  const region = getRegion(regionId);
  const unlocked = game.worldFlags?.regions_unlocked ?? [];
  const smallTraveler = isSmallTraveler(game);
  const regionImpassable = isImpassableToSmall(game, regionId);

  return region.connections.map((toId) => {
    const gateCheck = isConnectionBlocked(game, regionId, toId);
    const giantCheck = isExitBlockedByGiant(game, regionId, toId);
    const regionLocked = !unlocked.includes(toId) || isRegionLocked(game, toId);

    let blocked = gateCheck.blocked || regionLocked || giantCheck.blocked;
    let blockedReason = null;
    let puzzleId = gateCheck.puzzleId ?? null;
    let gateId = gateCheck.gate?.id ?? null;

    if (gateCheck.blocked) {
      blockedReason = gateCheck.reason;
    } else if (giantCheck.blocked) {
      blockedReason = giantCheck.reason;
    } else if (regionLocked) {
      blockedReason = 'This region has not yet been unlocked.';
    }

    if (!blocked && regionImpassable && smallTraveler) {
      blocked = true;
      blockedReason = 'The roads are impassable to travelers your size — only the vast can cross this swollen land.';
    }

    return {
      regionId: toId,
      name: getRegion(toId).name,
      blocked,
      blockedReason,
      puzzleId,
      gateId,
      giantBlocked: giantCheck.blocked,
    };
  });
}
