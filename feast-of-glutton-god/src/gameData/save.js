const SAVE_KEY = "feast-of-glutton-god-save";
const META_KEY = "feast-of-glutton-god-meta";

const DEFAULT_META = {
  pilgrimageCount: 0,
  legacyAbundance: 0,
  endingArchive: [],
  achievements: {},
  directorsCutUnlocked: false,
  eternalHallUnlocked: false,
  lastPrestigeRank: 0,
  pendingSeeds: [],
  lastRunSummary: null,
};

export function loadPilgrimageMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return { ...DEFAULT_META };
    return { ...DEFAULT_META, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_META };
  }
}

export function savePilgrimageMeta(meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    return true;
  } catch {
    return false;
  }
}

/** Snapshot pilgrimage meta from a completed/in-progress run. */
export function syncPilgrimageMetaFromGame(game) {
  const meta = loadPilgrimageMeta();
  const wf = game?.worldFlags ?? {};

  meta.lastPrestigeRank = Math.max(meta.lastPrestigeRank ?? 0, wf.prestige_rank ?? 0);
  meta.legacyAbundance = Math.max(meta.legacyAbundance ?? 0, wf.legacy_abundance ?? meta.legacyAbundance ?? 0);

  const archive = wf.ending_archive ?? [];
  for (const archetype of archive) {
    if (!meta.endingArchive.includes(archetype)) meta.endingArchive.push(archetype);
  }

  if (game.pilgrimageMeta?.achievements) {
    meta.achievements = { ...meta.achievements, ...game.pilgrimageMeta.achievements };
  }
  for (const key of Object.keys(wf)) {
    if (key.startsWith('achievement_') && wf[key]) {
      const id = key.replace('achievement_', '');
      meta.achievements[id] = true;
    }
  }

  if (wf.main_act3_complete) meta.directorsCutUnlocked = true;
  if (wf.eternal_hall_unlocked || wf.all_companions_apotheosis || (wf.prestige_rank ?? 0) >= 3) {
    meta.eternalHallUnlocked = true;
  }

  meta.lastRunSummary = {
    playerName: game.player?.name,
    level: game.player?.level,
    endingArchetype: wf.ending_archetype,
    prestigeRank: wf.prestige_rank,
    day: game.day,
  };

  savePilgrimageMeta(meta);
  return meta;
}

export function saveGame(game) {
  try {
    const meta = syncPilgrimageMetaFromGame(game);
    const data = {
      ...game,
      pilgrimageMeta: { ...meta, ...(game.pilgrimageMeta ?? {}) },
      combat: null,
      savedAt: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const game = JSON.parse(raw);
    game.pilgrimageMeta = { ...loadPilgrimageMeta(), ...(game.pilgrimageMeta ?? {}) };
    return game;
  } catch {
    return null;
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function canStartNewPilgrimage() {
  const meta = loadPilgrimageMeta();
  if ((meta.pilgrimageCount ?? 0) > 0) return true;
  const game = loadGame();
  return Boolean(game?.worldFlags?.main_act3_complete);
}

export function beginPilgrimageMeta(seedPayload = []) {
  const meta = syncPilgrimageMetaFromGame(loadGame() ?? {});
  meta.pilgrimageCount = (meta.pilgrimageCount ?? 0) + 1;
  meta.pendingSeeds = seedPayload;
  savePilgrimageMeta(meta);
  deleteSave();
  return meta;
}
