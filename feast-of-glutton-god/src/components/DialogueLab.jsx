import { useState } from "react";
import { C } from "../styles/debugStyles.js";
import { COMPANIONS } from "../gameData/companions.js";
import { WORLD_NPCS } from "../gameData/npcs.js";
import { WEIGHT_STAGES, getStage } from "../gameData/stages.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import { getTier } from "../gameData/relationships.js";
import { createContext, render, pick } from "../textEngine/engine.js";
import { renderObserve } from "../textEngine/scenes/npc/observe.js";
import { renderFeed } from "../textEngine/scenes/npc/feed.js";
import { renderTalk } from "../textEngine/scenes/npc/talk.js";
import { renderFlirt } from "../textEngine/scenes/npc/flirt.js";
import { renderBless } from "../textEngine/scenes/npc/bless.js";
import { renderFeast } from "../textEngine/scenes/npc/feast.js";
import { renderIntimate } from "../textEngine/scenes/npc/intimate.js";
import { renderGrowthScene } from "../textEngine/scenes/growthEvent/index.js";
import { renderCombatBeat } from "../textEngine/scenes/combatText.js";
import { resolveGrowthZone } from "../textEngine/growthLexicon.js";
import "../textEngine/growthLexicon.js";

const RANDOM = "random";
const MOODS = ["happy", "warm", "curious", "eager", "shy", "dominant", "nurturing", "playful"];
const COR_POINTS = { 0: 10, 1: 50, 2: 90 };
const REL_POINTS = { 0: 5, 1: 20, 2: 40, 3: 60, 4: 80, 5: 95 };
const POSES = ["standing", "sitting", "walking"];
const FEED_TYPES = ["hand", "magical", "feast"];
const BLESS_TYPES = ["minor", "major", "targeted"];
const COMBAT_ACTIONS = ["attack", "feed", "growth", "convert"];

const DEBUG_CHARACTERS = [
  ...COMPANIONS.map((c) => ({
    id: c.numericId,
    name: c.name,
    bodyType: c.bodyType,
    archetype: c.archetype,
    role: c.class,
    numericId: c.numericId,
  })),
  ...WORLD_NPCS.map((n, i) => ({
    id: 10 + i,
    numericId: 10 + i,
    name: n.name,
    bodyType: n.bodyType,
    archetype: n.archetype,
    role: n.role,
  })),
];

const MOCK_PLAYER = {
  name: "Chosen of Gorgara",
  lbs: 195,
  corruption: 40,
  bodyType: "hourglass",
  relationship: 50,
};

const STATE_PARAMS = ["girl", "stage", "corruption", "relationship", "mood"];
const SECTIONS = {
  "npc.observe": {
    params: [...STATE_PARAMS, "pose"],
    fn: (s, opts) => renderObserve(s, MOCK_PLAYER, {
      pose: opts.pose, location: "harvest_hearth", trace: opts.trace,
    }),
  },
  "npc.feed": {
    params: [...STATE_PARAMS, "feedType"],
    fn: (s, opts) => renderFeed(s, MOCK_PLAYER, {
      feedType: opts.feedType, location: "market_square", trace: opts.trace,
    }),
  },
  "npc.talk": {
    params: STATE_PARAMS,
    fn: (s, opts) => renderTalk(s, MOCK_PLAYER, { location: "harvest_hearth", trace: opts.trace }),
  },
  "npc.flirt": {
    params: STATE_PARAMS,
    fn: (s, opts) => renderFlirt(s, MOCK_PLAYER, { trace: opts.trace }),
  },
  "npc.bless": {
    params: [...STATE_PARAMS, "blessType"],
    fn: (s, opts) => renderBless(s, MOCK_PLAYER, { blessType: opts.blessType, trace: opts.trace }),
  },
  "npc.feast": {
    params: STATE_PARAMS,
    fn: (s, opts) => renderFeast(s, MOCK_PLAYER, { trace: opts.trace }),
  },
  "npc.intimate": {
    params: STATE_PARAMS,
    fn: (s, opts) => renderIntimate(s, MOCK_PLAYER, { location: "harvest_hearth", trace: opts.trace }),
  },
  "growthEvent": {
    params: [...STATE_PARAMS, "growthZone"],
    fn: (s, opts) => {
      const endStage = getStage(s.lbs).id;
      const startStage = Math.max(0, endStage - 1);
      return renderGrowthScene(s, {
        growthMethod: "feed",
        startStage,
        endStage,
        gainLbs: 20,
        growthZone: opts.growthZone === "random" ? resolveGrowthZone(s) : opts.growthZone,
        week: 3,
      }, { trace: opts.trace });
    },
  },
  "combat.beat": {
    params: [...STATE_PARAMS, "combatAction"],
    fn: (s, opts) => renderCombatBeat(s, { interaction: opts.combatAction, trace: opts.trace }),
  },
  "char.desc": {
    params: STATE_PARAMS,
    fn: (s, opts) => render("{char.desc}", createContext({ subject: s, ref: MOCK_PLAYER, week: 3 }), { trace: opts.trace }),
  },
};

const SECTION_KEYS = Object.keys(SECTIONS);

const PARAM_DEFS = [
  { key: "section", label: "Section", options: SECTION_KEYS },
  { key: "girl", label: "Character", options: DEBUG_CHARACTERS.map((c) => String(c.id)), optionLabel: (v) => DEBUG_CHARACTERS.find((c) => String(c.id) === v)?.name || v },
  { key: "stage", label: "Stage", options: WEIGHT_STAGES.map((w) => String(w.id)), optionLabel: (v) => `${v} · ${WEIGHT_STAGES[Number(v)].label}` },
  { key: "corruption", label: "Corruption", options: ["0", "1", "2"], optionLabel: (v) => ({ 0: "0 · Resistant", 1: "1 · Curious", 2: "2 · Enthusiastic" })[v] },
  { key: "relationship", label: "Relationship", options: ["0", "1", "2", "3", "4", "5"], optionLabel: (v) => ({ 0: "Neutral", 1: "Friendly", 2: "Close", 3: "Intimate", 4: "Craving", 5: "Devoted" })[v] },
  { key: "mood", label: "Mood", options: MOODS },
  { key: "pose", label: "Pose", options: POSES },
  { key: "feedType", label: "Feed type", options: FEED_TYPES },
  { key: "blessType", label: "Bless type", options: BLESS_TYPES },
  { key: "growthZone", label: "Growth zone", options: ["belly", "lower_body", "curves", "full", "bust", "random"], optionLabel: (v) => v === "random" ? "auto (body type)" : v },
  { key: "combatAction", label: "Combat action", options: COMBAT_ACTIONS },
];

function rollSample(params) {
  const v = {};
  if (params.section === RANDOM) {
    v.section = pick(SECTION_KEYS);
  } else {
    v.section = params.section;
  }
  const stageMin = SECTIONS[v.section].stageMin || 0;
  for (const def of PARAM_DEFS) {
    if (def.key === "section") continue;
    let options = def.options;
    if (def.key === "stage" && stageMin) {
      options = options.filter((o) => Number(o) >= stageMin);
    }
    v[def.key] = params[def.key] === RANDOM ? pick(options) : params[def.key];
  }

  const base = DEBUG_CHARACTERS.find((c) => String(c.id) === v.girl) || DEBUG_CHARACTERS[0];
  const stage = Number(v.stage);
  const student = {
    ...base,
    name: base.name,
    lbs: WEIGHT_STAGES[stage].min + 10,
    corruption: COR_POINTS[v.corruption],
    relationship: REL_POINTS[v.relationship],
    mood: v.mood,
    gender: "she",
    pronouns: "she",
  };

  const trace = [];
  const opts = {
    trace,
    pose: v.pose,
    feedType: v.feedType,
    blessType: v.blessType,
    growthZone: v.growthZone,
    combatAction: v.combatAction,
  };
  const text = SECTIONS[v.section].fn(student, opts);
  const nodes = trace.filter((t) => t.leaf && t.text.trim() && !t.key.startsWith("subject."));
  const stateLine =
    `${base.name} (id ${base.id}) · ${Math.round(student.lbs)} lbs (stage ${stage} ${WEIGHT_STAGES[stage].label})` +
    ` · corruption ${student.corruption} (${getCorruptionTier(student.corruption).label})` +
    ` · relationship ${getTier(student.relationship).label} · mood ${v.mood}`;

  return { section: v.section, stateLine, text, nodes, id: `${Date.now()}_${Math.random()}` };
}

function formatFlagged(flagged) {
  return flagged.map((f, i) => {
    const problems = f.problems.length
      ? `\n--- problems ---\n${f.problems.map((p) => `[${p.key}] "${p.text}" → ${p.note || "(flagged, no note)"}`).join("\n")}`
      : "";
    return `=== FLAGGED ${i + 1}/${flagged.length} ===\nsection: ${f.section}\nstate: ${f.stateLine}\n---\n${f.text}${problems}`;
  }).join("\n\n");
}

const selStyle = { background: "#181820", color: "#e0e0e0", border: "1px solid #444", borderRadius: 4, padding: "3px 4px", fontSize: 11, maxWidth: 150 };
const inputStyle = { background: "#181820", color: "#e0e0e0", border: "1px solid #555", borderRadius: 4, padding: "4px 6px", fontSize: 11, flex: 1 };

function NodeAnnotator({ node, idx, anno, setAnno }) {
  const checked = idx in anno.notes;
  const editing = anno.open === idx;
  const toggle = () => {
    setAnno((a) => {
      const notes = { ...a.notes };
      if (checked) { delete notes[idx]; return { ...a, notes, open: a.open === idx ? null : a.open }; }
      notes[idx] = notes[idx] || "";
      return { ...a, notes, open: idx };
    });
  };
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 11, color: checked ? "#e0c090" : "#b0a890", cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={toggle} style={{ marginTop: 2 }} />
        <span><span style={{ color: "#7aa", fontSize: 9.5 }}>[{node.key}]</span> {node.text}</span>
      </label>
      {editing && (
        <div style={{ display: "flex", gap: 6, margin: "4px 0 4px 22px" }}>
          <input
            autoFocus
            style={inputStyle}
            placeholder={`What's the problem with [${node.key}]?`}
            value={anno.notes[idx] || ""}
            onChange={(e) => setAnno((a) => ({ ...a, notes: { ...a.notes, [idx]: e.target.value } }))}
            onKeyDown={(e) => { if (e.key === "Enter") setAnno((a) => ({ ...a, open: null })); }}
          />
          <button type="button" style={C.smBtn} onClick={() => setAnno((a) => ({ ...a, open: null }))}>Okay</button>
        </div>
      )}
      {checked && !editing && anno.notes[idx] && (
        <div style={{ margin: "2px 0 2px 22px", fontSize: 10, color: "#e0a050", fontStyle: "italic" }}>→ {anno.notes[idx]}</div>
      )}
    </div>
  );
}

export default function DialogueLab({ onClose }) {
  const [params, setParams] = useState(() => Object.fromEntries(PARAM_DEFS.map((d) => [d.key, RANDOM])));
  const [samples, setSamples] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [phase, setPhase] = useState("lab");
  const [anno, setAnno] = useState(null);
  const [copied, setCopied] = useState(false);

  const roll = () => { setSamples(Array.from({ length: 5 }, () => rollSample(params))); setAnno(null); };
  const startFlag = (sample) => setAnno({ sampleId: sample.id, notes: {}, open: null });
  const saveFlag = (sample) => {
    const problems = Object.entries(anno.notes).map(([idx, note]) => ({
      key: sample.nodes[idx].key, text: sample.nodes[idx].text, note: note.trim(),
    }));
    setFlagged((prev) => prev.some((f) => f.id === sample.id)
      ? prev.map((f) => (f.id === sample.id ? { ...f, problems } : f))
      : [...prev, { id: sample.id, section: sample.section, stateLine: sample.stateLine, text: sample.text, problems }]);
    setAnno(null);
  };
  const isFlagged = (sample) => flagged.some((f) => f.id === sample.id);
  const copyAll = () => {
    navigator.clipboard?.writeText(formatFlagged(flagged)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ ...C.overlay, alignItems: "flex-start", paddingTop: 16, overflowY: "auto", zIndex: 360 }}>
      <div style={{ ...C.modal, maxWidth: 760, width: "95%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#70c0e0" }}>DIALOGUE LAB</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: flagged.length ? "#e0a050" : "#666" }}>{flagged.length} flagged</span>
            {phase === "lab" && <button type="button" style={C.btn("#5a4010")} onClick={() => setPhase("review")} disabled={!flagged.length}>Done →</button>}
            <button type="button" style={C.btn("#333")} onClick={onClose}>Close</button>
          </div>
        </div>

        {phase === "lab" && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
              {PARAM_DEFS.map((def) => {
                const lockedSection = params.section !== RANDOM ? SECTIONS[params.section] : null;
                const relevant = def.key === "section" || !lockedSection || lockedSection.params.includes(def.key);
                let options = def.options;
                if (def.key === "stage" && lockedSection?.stageMin) {
                  options = options.filter((o) => Number(o) >= lockedSection.stageMin);
                }
                return (
                  <label key={def.key} style={{ fontSize: 10, color: relevant ? "#aaa" : "#555", display: "flex", flexDirection: "column", gap: 2, opacity: relevant ? 1 : 0.35 }}>
                    {def.label}
                    <select style={selStyle} value={params[def.key]} disabled={!relevant} onChange={(e) => setParams((p) => ({ ...p, [def.key]: e.target.value }))}>
                      <option value={RANDOM}>Random</option>
                      {options.map((o) => (
                        <option key={o} value={o}>{def.optionLabel ? def.optionLabel(o) : o}</option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
            <button type="button" style={{ ...C.btn("#1a5878"), width: "100%", marginBottom: 12 }} onClick={roll}>
              Roll 5 samples (locked params stay, Random re-rolls per sample)
            </button>
            {samples.map((s) => {
              const annotating = anno?.sampleId === s.id;
              return (
                <div key={s.id} style={{ marginBottom: 10, padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: isFlagged(s) ? "1px solid #e0a05060" : annotating ? "1px solid #70c0e060" : "1px solid transparent" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 9.5, color: "#8aa", lineHeight: 1.5 }}>[{s.section}] {s.stateLine}</div>
                    {!annotating && (
                      <button type="button" style={{ ...C.smBtn, background: isFlagged(s) ? "rgba(120,80,20,0.6)" : "rgba(120,40,40,0.4)", flexShrink: 0 }} onClick={() => startFlag(s)}>
                        {isFlagged(s) ? "Re-flag" : "Flag"}
                      </button>
                    )}
                  </div>
                  {!annotating && (
                    <div style={{ fontSize: 12, color: "#e0d0b0", lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-wrap" }}>{s.text}</div>
                  )}
                  {annotating && (
                    <>
                      <div style={{ fontSize: 10, color: "#70c0e0", marginBottom: 6 }}>Check the node(s) that are wrong, say why, then save:</div>
                      {s.nodes.length === 0 && (
                        <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>No trace nodes — this section may not forward opts.trace yet.</div>
                      )}
                      {s.nodes.map((n, idx) => (
                        <NodeAnnotator key={idx} node={n} idx={idx} anno={anno} setAnno={setAnno} />
                      ))}
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button type="button" style={{ ...C.btn("#5a4010"), flex: 1 }} onClick={() => saveFlag(s)}>
                          Save flag ({Object.keys(anno.notes).length} problem{Object.keys(anno.notes).length === 1 ? "" : "s"})
                        </button>
                        <button type="button" style={C.btn("#333")} onClick={() => setAnno(null)}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        {phase === "review" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="button" style={C.btn("#1a5878")} onClick={() => setPhase("lab")}>← Back to lab</button>
              <button type="button" style={{ ...C.btn(copied ? "#206030" : "#5a4010"), flex: 1 }} onClick={copyAll}>
                {copied ? "Copied!" : `Copy all ${flagged.length} (text + state + problems)`}
              </button>
            </div>
            {flagged.map((f, i) => (
              <div key={f.id} style={{ marginBottom: 10, padding: 10, background: "rgba(120,80,20,0.08)", borderRadius: 8, border: "1px solid #e0a05030" }}>
                <div style={{ fontSize: 9.5, color: "#c0a070", marginBottom: 6 }}>#{i + 1} · [{f.section}] {f.stateLine}</div>
                <div style={{ fontSize: 12, color: "#e0d0b0", lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-wrap" }}>{f.text}</div>
                {f.problems.map((p, j) => (
                  <div key={j} style={{ fontSize: 10, color: "#e0a050", marginTop: 4 }}>
                    <span style={{ color: "#7aa" }}>[{p.key}]</span> "{p.text}" → {p.note || "(no note)"}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export { rollSample, SECTIONS, DEBUG_CHARACTERS, MOCK_PLAYER };
