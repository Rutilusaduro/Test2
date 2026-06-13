import { useState, useEffect } from "react";
import { getRegion } from "../gameData/regions.js";
import { getNpcsInRegion } from "../gameData/npcs.js";
import { getNpcState, applyNpcState } from "../gameData/player.js";
import { getStage } from "../gameData/stages.js";
import { getTier } from "../gameData/relationships.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import { getXpProgress } from "../gameData/leveling.js";
import { longRest } from "../gameData/leveling.js";
import { getPlayerDerivedStats } from "../gameData/player.js";
import { getUnlockedConnections } from "../gameData/questEngine.js";
import { recordRegionVisitForQuests } from "../hooks/questHooks.js";
import NpcModal from "./NpcModal.jsx";
import QuestLog from "./QuestLog.jsx";

export default function WorldView({ game, onUpdate, onEncounter, onSave, onDebugContext }) {
  const [npcModal, setNpcModal] = useState(null);
  const region = getRegion(game.region);
  const player = game.player;
  const stage = getStage(player.lbs);
  const xp = getXpProgress(player);
  const derived = getPlayerDerivedStats(player);

  const travel = (regionId) => {
    onUpdate((g) => {
      const next = { ...g, region: regionId };
      const quest = recordRegionVisitForQuests(next, regionId);
      if (quest.questMessages) next.lastQuestMessage = quest.questMessages;
      return next;
    });
  };

  useEffect(() => {
    onUpdate((g) => {
      const quest = recordRegionVisitForQuests(g, g.region);
      if (quest.questMessages) {
        return { ...g, lastQuestMessage: quest.questMessages };
      }
      return g;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount for visit objectives
  }, []);

  const openNpc = (npc) => {
    const state = getNpcState(game, npc);
    setNpcModal(state);
    onDebugContext?.({ npc: state, region: game.region, interaction: "npc_open" });
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
        <span className="stat">Lv <strong>{player.level}</strong> ({Math.round(xp.pct)}% to next)</span>
        <span className="stat">Stage: <strong>{stage.label}</strong> ({Math.round(player.lbs)} lbs)</span>
        <span className="stat">AC <strong>{derived.ac}</strong></span>
        <span className="stat">AP: <strong>{player.ap}</strong>/{derived.maxAp}</span>
        <span className="stat">HP: <strong>{player.hp}/{player.maxHp}</strong></span>
        <span className="stat">Party: <strong>{game.party.length}</strong></span>
      </div>

      {game.lastLevelUpMessage && (
        <div className="panel prose" style={{ borderColor: "var(--gold)" }}>
          {game.lastLevelUpMessage}
        </div>
      )}

      <div className="panel">
        <h2>{region.name}</h2>
        <p className="prose">{region.desc}</p>
      </div>

      <div className="panel">
        <h2>Travel</h2>
        <div className="btn-grid">
          {getUnlockedConnections(game, game.region).map((id) => {
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

      <QuestLog game={game} regionId={game.region} onUpdate={onUpdate} />

      <div className="panel">
        <h2>Actions</h2>
        <div className="btn-grid">
          <button onClick={onEncounter}>Seek Encounter</button>
          <button onClick={() => onUpdate((g) => {
            longRest(g.player);
            return { ...g, day: g.day + 1, lastLevelUpMessage: null };
          })}>
            Rest & Feast (long rest — restore HP & spell slots)
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
          onGameRefresh={() => onUpdate((g) => ({ ...g }))}
          onDebugContext={onDebugContext}
        />
      )}
    </div>
  );
}
