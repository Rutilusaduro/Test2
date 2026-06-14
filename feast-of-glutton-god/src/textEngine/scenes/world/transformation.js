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
