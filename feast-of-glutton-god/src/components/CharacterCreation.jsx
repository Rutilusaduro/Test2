import { useState, useMemo } from "react";
import { PLAYER_CLASSES } from "../gameData/classes.js";
import { RACES } from "../gameData/races.js";
import { getSubclassesForClass } from "../gameData/subclasses.js";
import { applyRaceStatBonuses } from "../gameData/races.js";
import { buildStartingSpells } from "../gameData/spellLearning.js";
import { getCharacterSpells } from "../gameData/spellLearning.js";
import { STAT_LABELS } from "../gameData/stats.js";

const STEPS = ['race', 'class', 'subclass', 'details'];

export default function CharacterCreation({ onBack, onStart }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [raceId, setRaceId] = useState("human");
  const [classId, setClassId] = useState("bard");
  const [subclassId, setSubclassId] = useState("feast_singer");
  const [humanPicks, setHumanPicks] = useState(["con", "cha"]);

  const selectedClass = PLAYER_CLASSES.find((c) => c.id === classId);
  const subclasses = useMemo(() => getSubclassesForClass(classId), [classId]);
  const selectedRace = RACES.find((r) => r.id === raceId);
  const selectedSubclass = subclasses.find((s) => s.id === subclassId);

  const previewStats = useMemo(() => {
    if (!selectedClass) return {};
    return applyRaceStatBonuses({ ...selectedClass.stats }, raceId, {
      humanStatPicks: humanPicks,
    });
  }, [selectedClass, raceId, humanPicks]);

  const spellCount = getCharacterSpells({
    classId,
    subclassId,
    spellsKnown: buildStartingSpells(classId, subclassId).spellsKnown,
  }).length;

  const goNext = () => {
    if (step === 1) {
      const subs = getSubclassesForClass(classId);
      const defaultSub = subs.find((s) => s.isDefault) || subs[0];
      if (!subs.find((s) => s.id === subclassId)) {
        setSubclassId(defaultSub?.id || "");
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  };

  const toggleHumanPick = (stat) => {
    setHumanPicks((prev) => {
      if (prev.includes(stat)) return prev.filter((s) => s !== stat);
      if (prev.length >= 2) return [prev[1], stat];
      return [...prev, stat];
    });
  };

  const finish = () => {
    onStart(name || "Chosen of the Fat Goddess", classId, {
      raceId,
      subclassId,
      humanStatPicks: raceId === "human" ? humanPicks : undefined,
    });
  };

  const stepLabel = STEPS[step];

  return (
    <div className="app">
      <div className="header">
        <h1>Choose Your Path</h1>
        <p className="subtitle">A divine spark burns within you. How will you spread abundance?</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
          Step {step + 1} of {STEPS.length}: <span style={{ color: "var(--gold)" }}>{stepLabel}</span>
        </p>
      </div>

      {step === 0 && (
        <div className="panel">
          <h2>Race</h2>
          <p className="prose" style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
            Every culture celebrates growth differently. Choose the body and blessings you begin with.
          </p>
          <div className="btn-grid">
            {RACES.map((r) => (
              <button
                key={r.id}
                className={`class-card ${raceId === r.id ? "primary" : ""}`}
                onClick={() => setRaceId(r.id)}
              >
                <h3>{r.name}</h3>
                <div className="sub">{r.epithet}</div>
                <p>{r.desc}</p>
                {r.features?.[0] && (
                  <p style={{ fontSize: "0.8rem", color: "var(--gold)", marginTop: "0.35rem" }}>
                    {r.features[0].name}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="panel">
          <h2>Class</h2>
          <div className="btn-grid">
            {PLAYER_CLASSES.map((c) => (
              <button
                key={c.id}
                className={`class-card ${classId === c.id ? "primary" : ""}`}
                onClick={() => setClassId(c.id)}
                style={{ borderColor: classId === c.id ? c.color : undefined }}
              >
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="panel">
          <h2>Subclass — {selectedClass?.name}</h2>
          <div className="btn-grid">
            {subclasses.map((s) => (
              <button
                key={s.id}
                className={`class-card ${subclassId === s.id ? "primary" : ""}`}
                onClick={() => setSubclassId(s.id)}
              >
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                {s.features?.length > 0 && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.35rem" }}>
                    {s.features.join(" · ")}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <>
          <div className="panel">
            <h2>Your Name</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chosen of the Fat Goddess"
              style={{
                width: "100%", padding: "0.6rem", background: "var(--bg-card)",
                border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4,
                fontFamily: "inherit", fontSize: "1rem",
              }}
            />
          </div>

          {raceId === "human" && (
            <div className="panel">
              <h2>Human — +1 to Two Stats</h2>
              <p className="prose" style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                Choose two abilities to increase by 1 (selected: {humanPicks.length}/2).
              </p>
              <div className="btn-grid">
                {Object.entries(STAT_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={humanPicks.includes(key) ? "primary" : ""}
                    onClick={() => toggleHumanPick(key)}
                  >
                    {label} {humanPicks.includes(key) ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="panel">
            <h2>Summary</h2>
            <div className="prose" style={{ fontSize: "0.95rem" }}>
              <p><strong>{name || "Chosen of the Fat Goddess"}</strong></p>
              <p>{selectedRace?.name} {selectedClass?.name} — {selectedSubclass?.name}</p>
              <p style={{ color: "var(--text-dim)", marginTop: "0.5rem" }}>
                {spellCount} spells known · Stage {selectedRace?.startStageBonus ? "bonus" : "standard"} start
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                {Object.entries(previewStats).map(([k, v]) => (
                  <span key={k} className="stat" style={{ fontSize: "0.85rem" }}>
                    {STAT_LABELS[k]} <strong>{v}</strong>
                  </span>
                ))}
              </div>
              {selectedRace?.features?.map((f) => (
                <p key={f.id} style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "var(--gold)" }}>
                  <strong>{f.name}:</strong> {f.desc}
                </p>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button onClick={goBack}>{step === 0 ? "Back" : "Previous"}</button>
        {step < STEPS.length - 1 ? (
          <button className="primary" onClick={goNext}>Next</button>
        ) : (
          <button className="primary" onClick={finish}>Begin the Feast</button>
        )}
      </div>
    </div>
  );
}
