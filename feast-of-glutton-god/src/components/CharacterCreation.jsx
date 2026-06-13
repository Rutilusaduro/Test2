import { useState } from "react";
import { PLAYER_CLASSES } from "../gameData/classes.js";

export default function CharacterCreation({ onBack, onStart }) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("bard");

  return (
    <div className="app">
      <div className="header">
        <h1>Choose Your Path</h1>
        <p className="subtitle">A divine spark burns within you. How will you spread abundance?</p>
      </div>

      <div className="panel">
        <h2>Your Name</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Chosen of Gorgara"
          style={{
            width: "100%", padding: "0.6rem", background: "var(--bg-card)",
            border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4,
            fontFamily: "inherit", fontSize: "1rem",
          }}
        />
      </div>

      <div className="panel">
        <h2>Class & Subclass</h2>
        <div className="btn-grid">
          {PLAYER_CLASSES.map((c) => (
            <button
              key={c.id}
              className={`class-card ${classId === c.id ? "primary" : ""}`}
              onClick={() => setClassId(c.id)}
              style={{ borderColor: classId === c.id ? c.color : undefined }}
            >
              <h3>{c.name}</h3>
              <div className="sub">{c.subclass}</div>
              <p>{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onBack}>Back</button>
        <button className="primary" onClick={() => onStart(name || "Chosen of Gorgara", classId)}>
          Begin the Feast
        </button>
      </div>
    </div>
  );
}
