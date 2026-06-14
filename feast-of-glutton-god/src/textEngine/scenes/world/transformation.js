import { registerPool, createContext, render } from '../../engine.js';

function reg(key, lines) {
  registerPool(`world.${key}`, [{ when: {}, text: lines }]);
}

reg('transformation.level_up', [
  '✦ {regionName} transforms — now {levelLabel}. Streets soften, appetites rise, abundance becomes culture.',
  'The land itself swells with your gospel: {regionName} has reached {levelLabel}.',
]);

reg('transformation.region.harvest_hearth.1', [
  'Harvest\'s Hearth stirs — inn windows glow later, and flour dust clings to widening smiles.',
]);
reg('transformation.region.harvest_hearth.3', [
  'Harvest\'s Hearth is feast-blessed. The harvest festival will never be stingy again.',
]);
reg('transformation.region.harvest_hearth.5', [
  'Harvest\'s Hearth is transformed — every barn is a banquet hall, every waist a prayer answered.',
]);

reg('transformation.region.market_square.1', [
  'The Grand Market hums with new cravings — merchants compete to sell larger sizes.',
]);
reg('transformation.region.market_square.3', [
  'Market Square celebrates fullness openly. Church pamphlets go unsold.',
]);
reg('transformation.region.market_square.5', [
  'The Market belongs to fullness — scales and corsets are relics of a thinner past.',
]);

reg('transformation.region.fertile_heartlands.1', [
  'The Heartlands\' vines grow sweeter, heavier. Dryads laugh with fuller bellies.',
]);
reg('transformation.region.fertile_heartlands.5', [
  'Impossible fertility becomes ordinary — the hills themselves seem plump and pleased.',
]);

reg('transformation.region.gorgara_cradle.3', [
  'Sacred grotto light warms. Even the Thin Veil tastes your patron\'s heresy.',
]);
reg('transformation.region.ember_duchy.3', [
  'Ember\'s court whispers of indulgence. Lawmakers dine instead of debating restraint.',
]);
reg('transformation.region.gilded_citadel.2', [
  'The Citadel\'s high priests grow nervous — your cult finds converts in shadow chapels.',
]);

// ── Narrative depth 4–5 (story-flag gates) ─────────────────────

reg('transformation.region.gorgara_cradle.narrative.4', [
  'The Goddess Breathes Here — the shrine visibly distorts. Wildlife has doubled in weight; pilgrims arrive uninvited, kneeling before curves they cannot name.',
  'Thin Veil light bends wrong. Every grotto stone sweats warmth; local beasts waddle with sacred fullness.',
]);
reg('transformation.region.gorgara_cradle.narrative.5', [
  'Divine locale — your patron has manifested. AP flows doubled here; every face glows with corruption the Wheel would call heresy and locals call home.',
  'The cradle is no longer a shrine — it is a throne room. Feast spirits drift between trees; even the air gains weight.',
]);

reg('transformation.region.ancient_temple.narrative.4', [
  'The Temple Blooms — ruins grow instead of crumble. Vines heavy with fruit lace every pillar; Maribel\'s circle holds open feasts daily.',
  'Marble halls swell with living green. What was dead god architecture now ripens — mercy made masonry.',
]);
reg('transformation.region.ancient_temple.narrative.5', [
  'First True Altar — temple and barrow deeps now share a passage. Veshanne\'s chamber hosts the Fat Goddess\'s inaugural feast.',
  'The dead god\'s barrow breathes abundance. Oath-carvings weep honey; pilgrims descend willing and emerge softer.',
]);

reg('transformation.region.gilded_citadel.narrative.4', [
  'The Cathedral Bends — architecture fights your presence. Staircases reverse; altars sweat blessed oil; only elite inquisitors dare patrol.',
  'Divine geometry rebels. Every nave stone groans as the Measured Wheel tries to unwrite your curves from its capital.',
]);
reg('transformation.region.gilded_citadel.narrative.5', [
  'Involuntary Feasts — half the clergy converted or fled. The outer citadel capitulates; involuntary banquets echo through surrendered chapels.',
  'The cathedral hosts feasts whether invited or not. Converted acolytes serve with trembling devotion; the Wheel\'s law frays at the nave.',
]);

// ── New late-game regions ────────────────────────────────────────

reg('transformation.region.barrow_deeps.1', [
  'Oath-smoke thickens in the tunnels — Veshanne\'s domain tastes your appetite and hesitates.',
]);
reg('transformation.region.barrow_deeps.3', [
  'Pact-carvings warm under your touch. The barrow remembers hunger older than the Wheel.',
]);
reg('transformation.region.barrow_deeps.5', [
  'The deeps belong to the Fat Goddess now — dead god silence replaced by feast-echo and willing oath-breakers.',
]);

reg('transformation.region.gilded_citadel_inner.1', [
  'Blessed geometry recoils — the Inner Sanctum was not built for wrong-genre miracles.',
]);
reg('transformation.region.gilded_citadel_inner.3', [
  'Divine law made marble sweats around your curves. The high altar reconsiders its allegiance.',
]);
reg('transformation.region.gilded_citadel_inner.5', [
  'The sanctum bends — Wheel-inscribed stone softens like dough. Aurelan\'s heart waits behind geometry that no longer believes.',
]);

reg('transformation.region.divine_plane_vestibule.1', [
  'The Threshold rearranges around you — a grand hall reconsidering its floor plan and its theology.',
]);
reg('transformation.region.divine_plane_vestibule.3', [
  'Cosmic draft through impossible windows. The gods\' outer hall learns your name in a register they did not author.',
]);
reg('transformation.region.divine_plane_vestibule.5', [
  'Planar law frays at the edges — abundance leaks into divine architecture. The Wheel\'s vestibule belongs to appetite now.',
]);

export function renderWorldText(poolKey, game, opts = {}) {
  const ctx = createContext({
    subject: game.player,
    week: game.day,
    globals: { region: game.region, ...(opts.globals ?? {}) },
  });
  const key = poolKey.startsWith('world.') ? poolKey : `world.${poolKey}`;
  try {
    const result = render(`{${key}}`, ctx);
    return result || opts.fallback || '';
  } catch {
    return opts.fallback ?? '';
  }
}
