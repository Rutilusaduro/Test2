import { useState } from "react";
import { C } from "../styles/debugStyles.js";
import {
  getBugNotes, addBugNote, deleteBugNote, clearBugNotes,
  formatBugNotesForExport, captureGameContext,
} from "../hooks/bugLog.js";

const CATEGORIES = ["general", "text", "combat", "npc", "ui", "progression", "other"];

export default function BugLogPanel({ game, debugContext, onClose, onNotesChange }) {
  const [notes, setNotes] = useState(getBugNotes);
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState("general");
  const [copied, setCopied] = useState(false);

  const refresh = () => {
    const n = getBugNotes();
    setNotes(n);
    onNotesChange?.(n.length);
  };

  const logCurrent = () => {
    const ctx = captureGameContext(game, debugContext || {});
    const entry = addBugNote({
      category,
      note: draft.trim() || "(quick capture — no note added)",
      context: ctx,
    });
    setDraft("");
    refresh();
    return entry;
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(formatBugNotesForExport(notes)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const remove = (id) => {
    deleteBugNote(id);
    refresh();
  };

  const clearAll = () => {
    if (window.confirm("Clear all bug notes? This cannot be undone.")) {
      clearBugNotes();
      refresh();
    }
  };

  return (
    <div style={{ ...C.overlay, alignItems: "flex-start", paddingTop: 16, overflowY: "auto", zIndex: 350 }}>
      <div style={{ ...C.modal, maxWidth: 720, width: "95%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#e0a050" }}>BUG LOG ({notes.length})</div>
          <button type="button" style={C.btn("#333")} onClick={onClose}>Close</button>
        </div>

        <div style={{ padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#888", marginBottom: 8 }}>
            Capture what you're seeing right now — screen, region, combat state, last text, and your note.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <label style={{ fontSize: 10, color: "#aaa" }}>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ display: "block", marginTop: 2, background: "#181820", color: "#e0e0e0", border: "1px solid #444", borderRadius: 4, padding: "3px 4px", fontSize: 11 }}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What went wrong? Be specific — e.g. 'Feed scene repeated the same belly line twice' or 'Combat grid blocked movement incorrectly'"
            rows={3}
            style={{
              width: "100%", background: "#181820", color: "#e0e0e0",
              border: "1px solid #555", borderRadius: 4, padding: 8,
              fontSize: 12, fontFamily: "inherit", resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <button type="button" style={C.btn("#8b5a10")} onClick={logCurrent}>
              Log current moment
            </button>
            <button type="button" style={C.btn("#1a5878")} onClick={copyAll}>
              {copied ? "Copied!" : "Copy all notes"}
            </button>
            <button type="button" style={C.btn("#5a2020")} onClick={clearAll} disabled={!notes.length}>
              Clear all
            </button>
          </div>
          {debugContext && (
            <div style={{ fontSize: 9.5, color: "#666", marginTop: 8, lineHeight: 1.5 }}>
              Context: screen={debugContext.screen || "?"}
              {debugContext.region || game?.region ? ` · region=${debugContext.region || game?.region}` : ""}
              {debugContext.interaction ? ` · ${debugContext.interaction}` : ""}
              {debugContext.npc?.name ? ` · npc=${debugContext.npc.name}` : ""}
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>No bug notes yet. Play, find something odd, and log it.</div>
        ) : (
          notes.map((n, i) => (
            <div key={n.id} style={{ marginBottom: 10, padding: 10, background: "rgba(120,80,20,0.08)", borderRadius: 8, border: "1px solid #e0a05030" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 9.5, color: "#c0a070" }}>
                  #{notes.length - i} · {n.category} · {new Date(n.timestamp).toLocaleString()}
                  {n.context?.screen ? ` · ${n.context.screen}` : ""}
                  {n.context?.region ? ` · ${n.context.region}` : ""}
                </div>
                <button type="button" style={{ ...C.smBtn, background: "rgba(120,40,40,0.4)" }} onClick={() => remove(n.id)}>Delete</button>
              </div>
              <div style={{ fontSize: 12, color: "#e0d0b0", lineHeight: 1.6, marginBottom: 6 }}>{n.note}</div>
              {n.context?.lastText && (
                <details style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>
                  <summary style={{ cursor: "pointer", color: "#aaa" }}>Last rendered text</summary>
                  <pre style={{ whiteSpace: "pre-wrap", marginTop: 4, color: "#b0a890" }}>{n.context.lastText}</pre>
                </details>
              )}
              {n.context?.combat?.recentLog?.length > 0 && (
                <details style={{ fontSize: 10, color: "#888" }}>
                  <summary style={{ cursor: "pointer", color: "#aaa" }}>Combat log</summary>
                  <pre style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{n.context.combat.recentLog.join("\n")}</pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
