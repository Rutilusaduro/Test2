import { useState } from "react";
import { C } from "../styles/debugStyles.js";
import { render, createContext, getSeason, relSize, _registryEntries } from "../textEngine/engine.js";
import { renderObserve } from "../textEngine/scenes/npc/observe.js";
import { renderFeed } from "../textEngine/scenes/npc/feed.js";
import { getStage, WEIGHT_STAGES, lbsForStage } from "../gameData/stages.js";
import { REGIONS } from "../gameData/regions.js";
import DialogueLab, { MOCK_PLAYER, DEBUG_CHARACTERS } from "./DialogueLab.jsx";
import BugLogPanel from "./BugLogPanel.jsx";
import { getBugNotes } from "../hooks/bugLog.js";

if (typeof window !== "undefined") {
  window.__textEngine = { render, createContext, getSeason, relSize };
}

function sampleTextEngine() {
  const out = [];
  const combos = [
    { npcLbs: 130, playerLbs: 200, corruption: 0, label: "slim NPC / plump player" },
    { npcLbs: 285, playerLbs: 130, corruption: 50, label: "fat NPC / slim player" },
    { npcLbs: 465, playerLbs: 465, corruption: 90, label: "enormous both / enthusiastic" },
    { npcLbs: 162, playerLbs: 360, corruption: 10, label: "chubby NPC / very fat player" },
    { npcLbs: 595, playerLbs: 195, corruption: 70, label: "colossal NPC / plump player" },
    { npcLbs: 238, playerLbs: 820, corruption: 40, label: "heavy NPC / blob player" },
  ];
  const base = DEBUG_CHARACTERS[0];
  for (const c of combos) {
    const npc = { ...base, lbs: c.npcLbs, corruption: c.corruption, relationship: 40 };
    const player = { ...MOCK_PLAYER, lbs: c.playerLbs };
    const stage = getStage(npc.lbs).label;
    out.push(`── ${c.label} (${stage}) ──\n${renderObserve(npc, player, { pose: "standing", location: "harvest_hearth" })}\n\n${renderFeed(npc, player, { feedType: "hand" })}`);
  }
  return out.join("\n\n");
}

export default function DebugPanel({
  game,
  onClose,
  onUpdateGame,
  debugContext,
}) {
  const [textSample, setTextSample] = useState(null);
  const [labOpen, setLabOpen] = useState(false);
  const [bugLogOpen, setBugLogOpen] = useState(false);
  const [bugCount, setBugCount] = useState(getBugNotes().length);
  const [tab, setTab] = useState("text");

  const player = game?.player;

  const setPlayerLbs = (lbs) => {
    onUpdateGame?.((g) => ({
      ...g,
      player: { ...g.player, lbs: Number(lbs) },
    }));
  };

  const setAp = (ap) => {
    onUpdateGame?.((g) => ({
      ...g,
      player: { ...g.player, ap: Number(ap) },
    }));
  };

  const jumpRegion = (regionId) => {
    onUpdateGame?.((g) => ({ ...g, region: regionId }));
  };

  return (
    <>
      <div style={{ ...C.overlay, alignItems: "flex-start", paddingTop: 16, overflowY: "auto", zIndex: 300 }}>
        <div style={{ ...C.modal, maxWidth: 700, width: "95%", maxHeight: "90vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#60b060" }}>DEBUG PANEL</div>
            <button type="button" style={C.btn("#333")} onClick={onClose}>Close</button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { id: "text", label: "Text Engine" },
              { id: "game", label: "Game Cheats" },
              { id: "bugs", label: `Bug Log (${bugCount})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                style={{ ...C.smBtn, background: tab === t.id ? "rgba(139,34,82,0.6)" : undefined }}
                onClick={() => { setTab(t.id); if (t.id === "bugs") setBugLogOpen(true); }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "text" && (
            <div style={{ marginBottom: 14, padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>
                TEXT ENGINE — {_registryEntries().length} registered modules/pools
              </div>
              <div style={{ fontSize: 9, color: "#606878", marginBottom: 8, lineHeight: 1.5 }}>
                Dialogue Lab rolls batches of 5 random renders with lockable state. Flag individual text nodes and copy tuning notes.
              </div>
              <button type="button" style={{ ...C.smBtn, background: "rgba(100,60,140,0.4)" }} onClick={() => setTextSample(sampleTextEngine())}>
                Sample NPC observe + feed (6 combos)
              </button>
              <button type="button" style={{ ...C.smBtn, background: "rgba(60,100,140,0.4)", marginLeft: 6 }} onClick={() => setLabOpen(true)}>
                Dialogue Lab
              </button>
              {textSample && (
                <pre style={{ fontSize: 10, color: "#c8b8e0", whiteSpace: "pre-wrap", lineHeight: 1.6, marginTop: 8, maxHeight: 240, overflowY: "auto", background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 6 }}>
                  {textSample}
                </pre>
              )}
            </div>
          )}

          {tab === "game" && player && (
            <div style={{ marginBottom: 14, padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 8 }}>PLAYER</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#aaa", display: "flex", gap: 6, alignItems: "center" }}>
                  AP:
                  <input type="number" defaultValue={player.ap} min={0} max={999} step={5}
                    style={{ width: 60, background: "#181820", color: "#e0e0e0", border: "1px solid #444", borderRadius: 4, padding: "2px 4px", fontSize: 11 }}
                    onChange={(e) => setAp(e.target.value)} />
                </label>
                <label style={{ fontSize: 11, color: "#aaa", display: "flex", gap: 6, alignItems: "center" }}>
                  lbs:
                  <input type="number" defaultValue={Math.round(player.lbs)} min={80} step={10}
                    style={{ width: 70, background: "#181820", color: "#e0e0e0", border: "1px solid #444", borderRadius: 4, padding: "2px 4px", fontSize: 11 }}
                    onChange={(e) => setPlayerLbs(e.target.value)} />
                </label>
              </div>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>JUMP TO STAGE</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {WEIGHT_STAGES.filter((_, i) => i % 2 === 0 || i === WEIGHT_STAGES.length - 1).map((s) => (
                  <button key={s.id} type="button" style={C.smBtn} onClick={() => setPlayerLbs(lbsForStage(s.id))}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>JUMP TO REGION</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {REGIONS.map((r) => (
                  <button key={r.id} type="button" style={{ ...C.smBtn, background: game.region === r.id ? "rgba(139,34,82,0.5)" : undefined }} onClick={() => jumpRegion(r.id)}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "bugs" && (
            <div style={{ padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>
                Log bugs while playing — encounters, NPC text, combat, anything odd. Notes persist in your browser.
              </p>
              <button type="button" style={C.btn("#8b5a10")} onClick={() => setBugLogOpen(true)}>
                Open Bug Log
              </button>
            </div>
          )}
        </div>
      </div>

      {labOpen && <DialogueLab onClose={() => setLabOpen(false)} />}
      {bugLogOpen && (
        <BugLogPanel
          game={game}
          debugContext={debugContext}
          onClose={() => { setBugLogOpen(false); setBugCount(getBugNotes().length); }}
          onNotesChange={setBugCount}
        />
      )}
    </>
  );
}
