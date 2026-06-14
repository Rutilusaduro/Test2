import { registerPool, createContext, render } from '../../engine.js';
import { REGIONS } from '../../../gameData/regions.js';

// ── region wary / tense (FULL SENTENCE) ────────────────────────
registerPool('dm.region.wary', [
  { when: { hostilityTierMin: 2, region: 'gilded_citadel' }, text: [
    'Eyes track you in the Gilded Citadel — not hunger, but judgment.',
    'Temple incense cannot mask the suspicion coiling around your footsteps here.',
    'A purity acolyte whispers as you pass; the Citadel remembers those who broke the Wheel\'s measure.',
  ]},
  { when: { hostilityTierMin: 2, region: 'ember_duchy' }, text: [
    'Velvet masks hide mouths that used to smile — the duchy has grown careful of you.',
    'Court whispers follow your hips through Ember\'s halls like cold draft.',
    'Servants linger in doorways, watching whether your magic arrives with consent.',
  ]},
  { when: { hostilityTierMin: 1, region: 'harvest_hearth' }, text: [
    'The hearth still smells of bread, but neighbors fall quiet when you enter a room.',
    'Farmhands find reasons to be elsewhere — your reputation has soured the village warmth.',
    'Someone pulls a child closer as you pass; Harvest\'s Hearth is learning to fear your hunger.',
  ]},
  { when: { hostilityTierMin: 1, region: 'market_square' }, text: [
    'Merchants weigh your coin and your character — the square buzzes, but not for you.',
    'A stall-mistress avoids your gaze; word of unwilling growth travels faster than spice.',
    'The market\'s music thins when you draw near — abundance without mercy has a price.',
  ]},
  { when: { hostilityTierMin: 1, region: 'northern_marches' }, text: [
    'Border soldiers measure you with harder eyes — the marches remember cruelty.',
    'Wind off the ice carries rumor of what you did to someone who said no.',
    'Lean scouts watch from ridgelines; the frontier does not forgive forced softness.',
  ]},
  { when: { hostilityTierMin: 1, region: 'barrow_deeps' }, text: [
    'Oath-carvings watch from the walls — Veshanne\'s domain remembers every promise the Wheel broke.',
    'Cold pact-smoke curls at ankle height. The dead are not hostile yet — only measuring.',
    'Barrow silence presses close. Abundance feels indecent here, and therefore irresistible.',
  ]},
  { when: { hostilityTierMin: 1, region: 'gilded_citadel_inner' }, text: [
    'Divine geometry recoils from your curves — staircases hesitate, altars sweat blessed oil.',
    'The Inner Sanctum was not built for wrong-genre miracles. It is learning anyway.',
    'Law made architecture fights your presence. The DM sounds almost reverent.',
  ]},
  { when: { hostilityTierMin: 1, region: 'divine_plane_vestibule' }, text: [
    'The Threshold rearranges itself around you — floor plans reconsidering their loyalty.',
    'You are technically illegal here. The gods\' hall does not know whether to judge or worship.',
    'Cosmic draft through impossible windows. Every step echoes in six divine domains at once.',
  ]},
  { when: { hostilityTierMin: 1 }, text: [
    'The region has turned wary — doors close a little sooner when you knock.',
    'You feel it in glances: not hatred yet, but the continent taking notes.',
    'Abundance without consent leaves fingerprints; {regionName} is reading yours.',
  ]},
  { when: {}, text: [
    'A faint unease stirs — nothing overt, but the land is watching.',
    'The air carries no accusation yet — only the memory of what you might do next.',
    'Still calm on the surface; you wonder how long that will last.',
  ]},
]);

// ── crackdown (FULL SENTENCE) ──────────────────────────────────
registerPool('dm.region.crackdown', [
  { when: { crackdown: true, region: 'gilded_citadel' }, text: [
    'Crackdown — the Citadel\'s bells toll for purity, and your name rides the sound.',
    'Larders seal behind blessed iron; even whispers of feeding carry a sentence here.',
    'Inquisitors of the Measured Hand march in ordered ranks — the temple-city has decided you are a crisis.',
  ]},
  { when: { crackdown: true, region: 'ember_duchy' }, text: [
    'The duchy locks its pantries — velvet turns to steel when crackdown comes.',
    'Courtiers who once flirted now cite law; Ember treats your appetite as sedition.',
    'Feast-halls bar their doors; only amends or audacity will reopen them.',
  ]},
  { when: { crackdown: true, region: 'harvest_hearth' }, text: [
    'Crackdown — the village council posts watchers; no hand-feeding without suspicion.',
    'Ovens cool behind barred shutters; Harvest\'s Hearth will not be your larder today.',
    'Someone nailed a purity notice to the inn door — your miracles are not welcome unnamed.',
  ]},
  { when: { crackdown: true, region: 'market_square' }, text: [
    'The square empties when patrols arrive — merchants hide sweets meant for willing mouths only.',
    'Crackdown turns commerce to caution; your coin spends, but trust does not.',
    'City watch and inquisitor share a glance — the market chose order over your excess.',
  ]},
  { when: { crackdown: true }, text: [
    'Crackdown — services lock, larders seal, and the region demands amends.',
    'The land itself feels narrower; abundance must be earned back with mercy.',
    '{regionName} has turned against unchecked growth — redemption waits if you seek it.',
  ]},
  { when: {}, text: [
    'Tension hums beneath daily life — the region has not forgotten.',
    'You sense the continent keeping score; tread with more care.',
    'Not every swelling is a gift; {regionName} reminds you with every guarded glance.',
  ]},
]);

export function renderRegionHostilityBeat(game, regionId, opts = {}) {
  const region = REGIONS.find((r) => r.id === regionId);
  const pool = opts.crackdown ? 'dm.region.crackdown' : 'dm.region.wary';
  const ctx = createContext({
    subject: game?.player,
    globals: {
      region: regionId,
      regionName: region?.name ?? regionId,
      hostilityTier: opts.hostilityTier ?? 0,
      crackdown: Boolean(opts.crackdown),
    },
  });
  return render(`{${pool}}`, ctx, { trace: opts.trace });
}