import { useState } from "react";
import {
  getInteractionMenu, doObserve, doTalk, doFlirt, doFeed, doBless,
  doFeast, doSpecial, doIntimate, doCorrupt, doRecruit,
} from "../hooks/npcInteractions.js";
import { getStage } from "../gameData/stages.js";
import { getTier } from "../gameData/relationships.js";
import { getCorruptionTier } from "../gameData/corruption.js";

export default function NpcModal({ npc, player, game, onClose, onUpdate }) {
  const [text, setText] = useState("");
  const [submenu, setSubmenu] = useState(null);

  const stage = getStage(npc.lbs);
  const rel = getTier(npc.relationship || 0);
  const cor = getCorruptionTier(npc.corruption || 0);
  const menu = getInteractionMenu(npc, player);

  const apply = (result) => {
    if (result.npc) onUpdate(result.npc);
    setText(result.text || "");
    setSubmenu(null);
  };

  const handleAction = (id) => {
    const n = { ...npc };
    switch (id) {
      case "observe": return apply(doObserve(n, player, game));
      case "talk": return apply(doTalk(n, player, game));
      case "flirt": return apply(doFlirt(n, player, game));
      case "special": return apply(doSpecial(n, player, game));
      case "intimate": return apply(doIntimate(n, player, game));
      case "corrupt": return apply(doCorrupt(n, player, game));
      case "recruit": return apply(doRecruit(n, player, game));
      case "feed": return setSubmenu("feed");
      case "bless": return setSubmenu("bless");
      case "feast": return apply(doFeast(n, player, game));
      default: break;
    }
  };

  const feedTypes = [
    { id: "hand", label: "Hand-feed" },
    { id: "magical", label: "Magical food" },
    { id: "feast", label: "Quick feast" },
  ];

  const blessTypes = [
    { id: "minor", label: "Minor Blessing (5 AP)" },
    { id: "major", label: "Major Blessing (15 AP)" },
    { id: "targeted", label: "Targeted Blessing (10 AP)" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{npc.name}</h2>
        <div className="stats-bar">
          <span className="stat">{stage.label} ({Math.round(npc.lbs)} lbs)</span>
          <span className="stat">{rel.label}</span>
          <span className="stat">{cor.label}</span>
          {npc.role && <span className="stat">{npc.role}</span>}
        </div>

        {text && (
          <div className="panel prose" style={{ marginTop: "1rem" }}>
            {text}
          </div>
        )}

        {submenu === "feed" && (
          <div className="modal-actions">
            {feedTypes.map((f) => (
              <button key={f.id} onClick={() => apply(doFeed({ ...npc }, player, game, f.id))}>
                {f.label}
              </button>
            ))}
            <button onClick={() => setSubmenu(null)}>Back</button>
          </div>
        )}

        {submenu === "bless" && (
          <div className="modal-actions">
            {blessTypes.map((b) => (
              <button key={b.id} onClick={() => apply(doBless({ ...npc }, player, game, b.id))}>
                {b.label}
              </button>
            ))}
            <button onClick={() => setSubmenu(null)}>Back</button>
          </div>
        )}

        {!submenu && (
          <div className="modal-actions">
            {menu.map((item) => (
              <button
                key={item.id}
                disabled={!item.enabled}
                onClick={() => handleAction(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button onClick={onClose}>Leave</button>
          </div>
        )}
      </div>
    </div>
  );
}
