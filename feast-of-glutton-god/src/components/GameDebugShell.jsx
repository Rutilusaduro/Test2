import { useState } from "react";
import DebugPanel from "./DebugPanel.jsx";
import BugLogPanel from "./BugLogPanel.jsx";
import { getBugNotes } from "../hooks/bugLog.js";

export default function GameDebugShell({ game, onUpdateGame, screen, debugContext, children }) {
  const [debugOpen, setDebugOpen] = useState(false);
  const [quickBugOpen, setQuickBugOpen] = useState(false);
  const [bugCount, setBugCount] = useState(() => getBugNotes().length);

  const refreshBugCount = () => setBugCount(getBugNotes().length);

  return (
    <>
      {children}
      <div style={{
        position: "fixed", bottom: 12, right: 12, zIndex: 200,
        display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end",
      }}>
        <button
          type="button"
          onClick={() => setQuickBugOpen(true)}
          title="Quick bug log"
          style={{
            background: "rgba(139, 90, 16, 0.9)", border: "1px solid #d4a84b",
            color: "#fff", borderRadius: 20, padding: "6px 12px", fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Bug {bugCount > 0 ? `(${bugCount})` : ""}
        </button>
        <button
          type="button"
          onClick={() => setDebugOpen(true)}
          title="Debug panel"
          style={{
            background: "rgba(60, 100, 60, 0.9)", border: "1px solid #5a9a5a",
            color: "#fff", borderRadius: 20, padding: "6px 12px", fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Debug
        </button>
      </div>

      {debugOpen && (
        <DebugPanel
          game={game}
          onClose={() => setDebugOpen(false)}
          onUpdateGame={onUpdateGame}
          debugContext={{ ...debugContext, screen }}
        />
      )}

      {quickBugOpen && (
        <BugLogPanel
          game={game}
          debugContext={{ ...debugContext, screen }}
          onClose={() => { setQuickBugOpen(false); refreshBugCount(); }}
          onNotesChange={refreshBugCount}
        />
      )}
    </>
  );
}
