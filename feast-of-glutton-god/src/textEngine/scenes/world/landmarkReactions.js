// ═══════════════════════════════════════════════════════════════
// LANDMARK REACTIONS — durable world consequences as prose
// ═══════════════════════════════════════════════════════════════
import { registerPool, createContext, render } from '../../engine.js';
import { getRegion } from '../../../gameData/regions.js';

registerPool('landmark.birth', [
  { when: { band: 'colossal' }, weight: 3, text: [
    '{subject.name} can no longer be moved — the settlement rearranges around {their} stillness. Ramps and scaffolding rise within hours.',
    'What was a person is now geography: {subject.name} anchors the skyline, breath slow as tides against new-built walkways.',
  ] },
  { when: { band: 'world' }, weight: 3, text: [
    'A cult gathers before dawn — not summoned, simply inevitable. {subject.name} has become a shrine of living abundance.',
    'Banners unfurl toward {subject.name}. The region names a feast-day in {their} shadow before the week is out.',
  ] },
  { when: {}, text: [
    '{subject.name} settles into landmark stillness — too vast to travel, too glorious to ignore.',
  ] },
]);

registerPool('landmark.worship', [
  { when: { landmarkTierMin: 2 }, text: [
    'Pilgrims kneel within sight of {subject.name}, leaving offerings of honeyed bread and whispered vows of growth.',
    'Temple bells change their rhythm — worship now measures itself against {subject.name}\'s breathing bulk.',
  ] },
  { when: {}, text: [
    'Locals begin leaving offerings where {subject.name} rests — flowers, pastries, shy notes of devotion.',
  ] },
]);

registerPool('landmark.settle', [
  { when: { settleStateMin: 2 }, text: [
    'Scaffolding and shrine-walks lace the streets again — the city has learned to live around the giant, and the blocked roads reopen.',
    'What was catastrophe becomes custom: ramps, markets, and lovers\' lanes thread through the landmark\'s shadow.',
  ] },
  { when: { settleStateMin: 1 }, text: [
    'Shock softens into routine — hawkers sell viewing tickets, and children dare each other to touch the warm stone of new-built ramps.',
  ] },
  { when: {}, text: [
    'The region exhales. Life finds new paths around impossible softness.',
  ] },
]);

registerPool('landmark.blockade', [
  { when: { footprintMin: 20 }, text: [
    'The way to {globals.toRegionName} is buried under flesh and splintered stone — only the bold or the vast can pass.',
    'Guards turn travelers back from {globals.toRegionName}: "The road belongs to the giant now."',
  ] },
  { when: { footprintMin: 12 }, text: [
    'The route toward {globals.toRegionName} is choked — {globals.blockerName}\'s growth has made the crossing impassable.',
    'A timber barricade and nervous militia block the path to {globals.toRegionName}. Someone enormous got there first.',
  ] },
  { when: {}, text: [
    'Travel toward {globals.toRegionName} is blocked — abundance has rewritten the map.',
  ] },
]);

registerPool('landmark.crowded', [
  { when: { giantCountMin: 2 }, text: [
    'Giants crowd the region — every street feels like a canyon between warm, breathing hills.',
  ] },
  { when: {}, text: [
    'The region\'s footprint swells with titanic presence — locals speak in hushed, delighted awe.',
  ] },
]);

const POOL_MAP = {
  birth: 'landmark.birth',
  worship: 'landmark.worship',
  settle: 'landmark.settle',
  blockade: 'landmark.blockade',
  crowded: 'landmark.crowded',
};

export function renderLandmarkReaction(game, opts = {}) {
  const poolKey = POOL_MAP[opts.reactionType];
  if (!poolKey) return '';

  const subject = opts.landmark
    ? { name: opts.landmark.name, lbs: 1400, role: opts.landmark.role }
    : { name: opts.characterName ?? 'Someone', lbs: 1400 };

  const ctx = createContext({
    subject,
    week: game?.day ?? 1,
    globals: {
      reactionType: opts.reactionType,
      regionId: opts.regionId,
      toRegionName: opts.toRegionId ? getRegion(opts.toRegionId).name : '',
      blockerName: opts.characterName ?? subject.name,
      footprint: opts.footprint ?? 0,
      giantCount: opts.giantCount ?? 1,
      settleState: opts.settleState ?? 0,
      landmarkTier: opts.landmark?.landmarkTier ?? 0,
      band: opts.landmark?.band ?? 'colossal',
      landmarkRole: opts.landmark?.role ?? null,
    },
  });

  try {
    return render(`{${poolKey}}`, ctx) || '';
  } catch {
    return '';
  }
}
