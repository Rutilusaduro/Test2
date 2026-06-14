/**
 * Long-term power progression — mortal takeover via courts, shrines, and culture.
 */
import { getTier } from './relationships.js';
import { getStageMechanics } from './stageMechanics.js';
import { getAbundanceSpread } from './abundanceSpread.js';

export const INFLUENCE_META = {
  label: 'Mortal Takeover',
  desc: 'Your spreading grip on courts, temples, and culture across the Reach.',
};

export const INFLUENCE_TRACKS = {
  political: { label: 'Courts & Land', desc: 'Charters, manors, and law learn your name.' },
  religious: { label: 'Shrines & Orders', desc: 'Hidden shrines multiply; your patron\'s rites spread in shadow.' },
  cultural: { label: 'Feast & Fashion', desc: 'Song, dress, and public appetite carry your aesthetic.' },
};

export const HOLDING_TYPES = {
  cottage: { label: 'Cottage', minInfluence: 0, apIncome: 1 },
  farmstead: { label: 'Farmstead', minInfluence: 15, apIncome: 3 },
  manor: { label: 'Manor', minInfluence: 40, apIncome: 6 },
  estate: { label: 'Estate', minInfluence: 80, apIncome: 12 },
  domain: { label: 'Domain', minInfluence: 150, apIncome: 25 },
};

export const INSTITUTION_TYPES = {
  tavern: {
    label: 'Feast Tavern',
    track: 'cultural',
    minInfluence: 20,
    desc: 'A public house where your followers feed and grow.',
  },
  school: {
    label: 'Academy of Appetite',
    track: 'cultural',
    minInfluence: 50,
    desc: 'Scholars study the theology of indulgence.',
  },
  temple: {
    label: 'Shrine of the Hunger Beyond',
    track: 'religious',
    minInfluence: 60,
    desc: 'A hidden shrine where your patron\'s rites bend the faithful toward fullness.',
  },
  order: {
    label: 'Order of the Fat Goddess',
    track: 'religious',
    minInfluence: 120,
    desc: 'A sworn order devoted to feeding the Hunger Beyond the Wheel into the world.',
  },
  court: {
    label: 'Court of Plenty',
    track: 'political',
    minInfluence: 100,
    desc: 'A political seat where decrees fatten the realm.',
  },
};

export const TITLE_THRESHOLDS = [
  { id: 'feast_envoy', track: 'cultural', min: 25, label: 'Feast Envoy' },
  { id: 'abundance_preacher', track: 'religious', min: 50, label: 'Preacher of Abundance' },
  { id: 'landed_patron', track: 'political', min: 75, label: 'Landed Patron' },
  { id: 'high_matron', track: 'religious', min: 120, label: 'High Matron of the Reach' },
  { id: 'duchess_of_indulgence', track: 'political', min: 180, label: 'Duchess of the Heartlands' },
  { id: 'rival_incarnate', track: 'religious', min: 300, label: 'Avatar of the Hunger Beyond' },
];

export function ensureInfluenceState(game) {
  if (!game.influence) {
    game.influence = {
      political: 0,
      religious: 0,
      cultural: 0,
      holdings: [],
      institutions: [],
      titles: [],
    };
  }
  return game.influence;
}

export function getInfluence(game, track) {
  const inf = ensureInfluenceState(game);
  return inf[track] ?? 0;
}

export function getTotalInfluence(game) {
  const inf = ensureInfluenceState(game);
  return (inf.political ?? 0) + (inf.religious ?? 0) + (inf.cultural ?? 0);
}

export function awardInfluence(game, track, amount, source = 'general') {
  const inf = ensureInfluenceState(game);
  if (!INFLUENCE_TRACKS[track]) return { gained: 0 };
  const presence = getStageMechanics(game.player).influencePresence;
  const gained = Math.round(amount * (1 + presence / 50));
  inf[track] = (inf[track] ?? 0) + gained;
  refreshTitles(game);
  return { gained, total: inf[track], track, source };
}

export function refreshTitles(game) {
  const inf = ensureInfluenceState(game);
  const earned = [];
  for (const t of TITLE_THRESHOLDS) {
    if ((inf[t.track] ?? 0) >= t.min) earned.push(t.id);
  }
  inf.titles = earned;
  return earned;
}

export function getEarnedTitles(game) {
  refreshTitles(game);
  return TITLE_THRESHOLDS.filter((t) => ensureInfluenceState(game).titles.includes(t.id));
}

export function canFoundInstitution(game, typeId, regionId) {
  const type = INSTITUTION_TYPES[typeId];
  if (!type) return { ok: false, reason: 'Unknown institution.' };
  const inf = ensureInfluenceState(game);
  const trackVal = inf[type.track] ?? 0;
  if (trackVal < type.minInfluence) {
    return { ok: false, reason: `Requires ${type.minInfluence} ${type.track} influence.` };
  }
  const exists = inf.institutions.some((i) => i.type === typeId && i.regionId === regionId);
  if (exists) return { ok: false, reason: 'Already founded here.' };
  return { ok: true, type };
}

export function foundInstitution(game, typeId, regionId, name) {
  const check = canFoundInstitution(game, typeId, regionId);
  if (!check.ok) return check;
  const inf = ensureInfluenceState(game);
  const inst = {
    id: `${typeId}_${regionId}_${Date.now()}`,
    type: typeId,
    regionId,
    name: name || check.type.label,
    level: 1,
    foundedDay: game.day,
  };
  inf.institutions.push(inst);
  awardInfluence(game, check.type.track, 10, 'institution_founded');
  return { ok: true, institution: inst };
}

export function canAcquireHolding(game, typeId) {
  const type = HOLDING_TYPES[typeId];
  if (!type) return { ok: false, reason: 'Unknown holding.' };
  const total = getTotalInfluence(game);
  if (total < type.minInfluence) {
    return { ok: false, reason: `Requires ${type.minInfluence} total influence.` };
  }
  return { ok: true, type };
}

export function acquireHolding(game, typeId, regionId, name) {
  const check = canAcquireHolding(game, typeId);
  if (!check.ok) return check;
  const inf = ensureInfluenceState(game);
  const holding = {
    id: `holding_${typeId}_${regionId}_${Date.now()}`,
    type: typeId,
    regionId,
    name: name || check.type.label,
    level: 1,
    acquiredDay: game.day,
  };
  inf.holdings.push(holding);
  return { ok: true, holding };
}

/** Relationship-tier bonus for influence actions on NPCs. */
export function getRelationshipInfluenceBonus(npc) {
  const tier = getTier(npc?.relationship ?? 0).id;
  if (tier >= 5) return 3;
  if (tier >= 4) return 2;
  if (tier >= 3) return 1;
  return 0;
}

export function getInfluenceProgress(game) {
  const inf = ensureInfluenceState(game);
  const spread = getAbundanceSpread(game);
  return {
    political: inf.political,
    religious: inf.religious,
    cultural: inf.cultural,
    total: getTotalInfluence(game),
    holdings: inf.holdings.length,
    institutions: inf.institutions.length,
    titles: getEarnedTitles(game),
    abundanceSpread: spread,
  };
}

export function getAvailablePowerPaths(game) {
  const inf = ensureInfluenceState(game);
  const paths = [];
  if (inf.cultural >= 20) paths.push({ id: 'cultural', label: 'Cultural — feasts, fashion, taverns' });
  if (inf.religious >= 20) paths.push({ id: 'religious', label: 'Religious — shrines, orders, rites' });
  if (inf.political >= 20) paths.push({ id: 'political', label: 'Political — land, courts, decrees' });
  if (getTotalInfluence(game) >= 100) {
    paths.push({ id: 'replacement', label: 'Patron Incarnate — Act III mortal throne' });
  }
  return paths;
}
