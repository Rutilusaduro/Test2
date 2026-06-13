const BUG_LOG_KEY = "feast-bug-notes";

export function getBugNotes() {
  try {
    const raw = localStorage.getItem(BUG_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(BUG_LOG_KEY, JSON.stringify(notes));
}

export function clearBugNotes() {
  localStorage.removeItem(BUG_LOG_KEY);
}

export function addBugNote(note) {
  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...note,
  };
  const notes = getBugNotes();
  notes.unshift(entry);
  saveNotes(notes.slice(0, 200));
  return entry;
}

export function deleteBugNote(id) {
  const notes = getBugNotes().filter((n) => n.id !== id);
  saveNotes(notes);
  return notes;
}

export function captureGameContext(game, extra = {}) {
  const player = game?.player;
  const combat = game?.combat;
  return {
    screen: extra.screen || null,
    region: game?.region || null,
    day: game?.day || null,
    player: player ? {
      name: player.name,
      classId: player.classId,
      subclass: player.subclass,
      lbs: Math.round(player.lbs),
      stage: player.lbs,
      ap: player.ap,
      hp: `${player.hp}/${player.maxHp}`,
      mp: `${player.mp}/${player.maxMp}`,
    } : null,
    party: (game?.party || []).map((c) => ({
      id: c.id, name: c.name, lbs: Math.round(c.lbs),
    })),
    combat: combat ? {
      turn: combat.turn,
      phase: combat.phase,
      victory: combat.victory,
      allies: combat.allies.map((a) => ({ name: a.name, hp: a.hp, lbs: Math.round(a.lbs) })),
      enemies: combat.enemies.map((e) => ({
        name: e.name, hp: e.hp, lbs: Math.round(e.lbs), converted: e.converted,
      })),
      recentLog: combat.log.slice(-8),
    } : null,
    npc: extra.npc ? {
      id: extra.npc.id,
      name: extra.npc.name,
      lbs: Math.round(extra.npc.lbs),
      relationship: extra.npc.relationship,
      corruption: extra.npc.corruption,
      role: extra.npc.role,
    } : null,
    interaction: extra.interaction || null,
    lastText: extra.lastText || null,
    url: typeof window !== "undefined" ? window.location.href : null,
  };
}

export function formatBugNotesForExport(notes = getBugNotes()) {
  return notes.map((n, i) => {
    const ctx = JSON.stringify(n.context, null, 2);
    return [
      `=== BUG #${i + 1} — ${n.timestamp} ===`,
      `Category: ${n.category || "general"}`,
      `Screen: ${n.context?.screen || "?"}`,
      n.context?.region ? `Region: ${n.context.region}` : null,
      n.context?.interaction ? `Interaction: ${n.context.interaction}` : null,
      `--- Note ---`,
      n.note || "(no note)",
      n.context?.lastText ? `--- Last rendered text ---\n${n.context.lastText}` : null,
      `--- Context ---\n${ctx}`,
    ].filter(Boolean).join("\n");
  }).join("\n\n");
}
