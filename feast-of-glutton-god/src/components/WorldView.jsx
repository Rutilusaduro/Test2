import { useState } from "react";
import { getRegion } from "../gameData/regions.js";
import { getNpcsInRegion } from "../gameData/npcs.js";
import { getNpcState, applyNpcState } from "../gameData/player.js";
import { getStage } from "../gameData/stages.js";
import { getTier } from "../gameData/relationships.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import NpcModal from "./NpcModal.jsx";

export default function WorldView({ game, onUpdate, onEncounter, onSave }) {
  const [npcModal, setNpcModal] = useState(null);
  const region = getRegion(game.region);
  const player = game.player;
  const stage = getStage(player.lbs);

  const travel = (regionId) => {
    onUpdate((g) => ({ ...g, region: regionId }));
  };

  const openNpc = (npc) => {
    const state = getNpcState(game, npc);
    setNpcModal(state);
  };

  const handleNpcUpdate = (npc) => {
    onUpdate((g) => {
      applyNpcState(g, npc.id, npc);
      if (npc.isCompanion) {
        return {
          ...g,
          party: g.party.map((c) => (c.id === npc.id ? { ...npc } : c)),
          npcStates: { ...g.npcStates, [npc.id]: npc },
        };
      }
      return { ...g, npcStates: { ...g.npcStates, [npc.id]: npc } };
    });
    setNpcModal(npc);
  };

  const npcs = getNpcsInRegion(game.region, game).map((n) => getNpcState(game, n));

  return (
    <div className="app">
      <div className="header">
        <h1>Feast of the Glutton God</h1>
        <p className="subtitle">Day {game.day} — {region.name}</p>
      </div>

      <div className="stats-bar">
        <span className="stat"><strong>{player.name}</strong> — {player.subclass}</span>
        <span className="stat">Stage: <strong>{stage.label}</strong> ({Math.round(player.lbs)} lbs)</span>
        <span className="stat">AP: <strong>{player.ap}</strong></span>
        <span className="stat">HP: <strong>{player.hp}/{player.maxHp}</strong></span>
        <span className="stat">MP: <strong>{player.mp}/{player.maxMp}</strong></span>
        <span className="stat">Party: <strong>{game.party.length}</strong></span>
      </div>

      <div className="panel">
        <h2>{region.name}</h2>
        <p className="prose">{region.desc}</p>
      </div>

      <div className="panel">
        <h2>Travel</h2>
        <div className="btn-grid">
          {region.connections.map((id) => {
            const r = getRegion(id);
            return (
              <button key={id} onClick={() => travel(id)}>Go to {r.name}</button>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <h2>People Here</h2>
        {npcs.length === 0 ? (
          <p className="prose">The paths are quiet — only wind and the smell of baking bread.</p>
        ) : (
          <div className="btn-grid">
            {npcs.map((npc) => {
              const ns = getStage(npc.lbs);
              const rel = getTier(npc.relationship || 0);
              return (
                <button key={npc.id} onClick={() => openNpc(npc)}>
                  {npc.name}
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    {ns.label} · {rel.label}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Actions</h2>
        <div className="btn-grid">
          <button onClick={onEncounter}>Seek Encounter</button>
          <button onClick={() => onUpdate((g) => ({ ...g, day: g.day + 1, player: { ...g.player, ap: g.player.ap + 5 } }))}>
            Rest & Feast (+5 AP)
          </button>
          <button onClick={onSave}>Save Game</button>
        </div>
      </div>

      <div className="panel">
        <h2>Party</h2>
        {game.party.map((c) => (
          <div key={c.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.name}</strong> — {getStage(c.lbs).label}
            <span style={{ color: "var(--text-dim)", marginLeft: "0.5rem" }}>
              {getCorruptionTier(c.corruption || 0).label}
            </span>
          </div>
        ))}
      </div>

      {npcModal && (
        <NpcModal
          npc={npcModal}
          player={player}
          game={game}
          onClose={() => setNpcModal(null)}
          onUpdate={handleNpcUpdate}
        />
      )}
    </div>
  );
}
