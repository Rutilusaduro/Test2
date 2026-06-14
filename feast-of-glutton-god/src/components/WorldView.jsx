import { useState, useEffect } from "react";
import { getRegion, CONTINENT_NAME } from "../gameData/regions.js";
import { getRegionPresentation, getRegionTransformation } from "../gameData/worldTransformation.js";
import { getCommandMode, resolveTravelMethod } from "../gameData/commandMode.js";
import { getStageMechanics, getMobilityLabel } from "../gameData/stageMechanics.js";
import { getInfluenceProgress } from "../gameData/influence.js";
import { spendAP } from "../gameData/player.js";
import { getNpcsInRegion } from "../gameData/npcs.js";
import { getNpcState, applyNpcState } from "../gameData/player.js";
import { getStage, isAtSizeCap } from "../gameData/stages.js";
import { getTier } from "../gameData/relationships.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import { getXpProgress, longRest } from "../gameData/leveling.js";
import { getPlayerDerivedStats } from "../gameData/player.js";
import { getTravelOptions } from "../gameData/regionObstacles.js";
import { getVisibleFeatures } from "../gameData/puzzleEngine.js";
import { getAbundanceProgress } from "../gameData/abundanceSpread.js";
import { recordRegionVisitForQuests } from "../hooks/questHooks.js";
import NpcModal from "./NpcModal.jsx";
import FeatureModal from "./FeatureModal.jsx";
import QuestLog from "./QuestLog.jsx";
import SpellbookPanel from "./SpellbookPanel.jsx";
import CharacterSheet from "./CharacterSheet.jsx";

export default function WorldView({ game, onUpdate, onEncounter, onPuzzleCombat, onSave, onDebugContext }) {
  const [npcModal, setNpcModal] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);
  const player = game.player;
  const regionPresent = getRegionPresentation(game, game.region);
  const regionTransform = getRegionTransformation(game, game.region);
  const commandMode = getCommandMode(game);
  const stageMech = getStageMechanics(player);
  const influence = getInfluenceProgress(game);
  const stage = getStage(player.lbs);
  const xp = getXpProgress(player);
  const derived = getPlayerDerivedStats(player);
  const abundance = getAbundanceProgress(game);

  const travel = (regionId) => {
    const method = resolveTravelMethod(game, regionId);
    if (!method.ok) {
      onUpdate((g) => ({ ...g, lastQuestMessage: method.message }));
      return;
    }
    onUpdate((g) => {
      if (method.apCost) spendAP(g, method.apCost);
      const next = { ...g, region: regionId };
      if (method.flavor) next.lastQuestMessage = method.flavor;
      const quest = recordRegionVisitForQuests(next, regionId);
      if (quest.questMessages) {
        next.lastQuestMessage = next.lastQuestMessage
          ? `${next.lastQuestMessage}\n\n${quest.questMessages}`
          : quest.questMessages;
      }
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
  const features = getVisibleFeatures(game, game.region);

  const openFeature = (feature) => {
    setFeatureModal(feature);
    onDebugContext?.({ feature, region: game.region, interaction: "feature_open" });
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Feast of the Glutton God</h1>
        <p className="subtitle">Day {game.day} — {regionPresent.name} · {CONTINENT_NAME}</p>
      </div>

      <div className="stats-bar">
        <span className="stat"><strong>{player.name}</strong> — {player.raceName || 'Human'} {player.subclass}</span>
        <span className="stat">Lv <strong>{player.level}</strong> ({Math.round(xp.pct)}% to next)</span>
        <span className="stat" title={stageMech.desc}>
          Stage: <strong>{stage.label}</strong> ({Math.round(player.lbs)} lbs)
          {isAtSizeCap(player) ? ' ★' : ''}
        </span>
        {commandMode.active && (
          <span className="stat" title={commandMode.message} style={{ color: 'var(--gold-bright)' }}>
            Command Mode
          </span>
        )}
        <span className="stat" title={abundance.current.desc}>
          Influence: <strong>{abundance.current.label}</strong>
        </span>
        <span className="stat">AC <strong>{derived.ac}</strong></span>
        <span className="stat">AP: <strong>{player.ap}</strong>/{derived.maxAp}</span>
        <span className="stat">HP: <strong>{player.hp}/{player.maxHp}</strong></span>
        <span className="stat">Party: <strong>{game.party.length}</strong></span>
      </div>

      {abundance.next && (
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Abundance spreading — {abundance.points} pts toward {abundance.next.label}
          </div>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
            <div style={{ width: `${abundance.pct}%`, height: '100%', background: 'var(--gold)' }} />
          </div>
        </div>
      )}

      {game.lastLevelUpMessage && (
        <div className="panel prose" style={{ borderColor: "var(--gold)" }}>
          {game.lastLevelUpMessage}
        </div>
      )}

      {game.lastQuestMessage && (
        <div className="panel prose" style={{ borderColor: "var(--rose)", fontSize: "0.9rem" }}>
          {game.lastQuestMessage}
        </div>
      )}

      <div className="panel">
        <h2>{regionPresent.name}</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
          Regional transformation: <strong>{regionTransform.level.label}</strong>
          {regionTransform.next && ` — ${regionTransform.points} pts toward ${regionTransform.next.label}`}
        </p>
        {regionTransform.next && (
          <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2, marginBottom: '0.5rem' }}>
            <div style={{ width: `${regionTransform.pct}%`, height: '100%', background: 'var(--rose)' }} />
          </div>
        )}
        <p className="prose">{regionPresent.desc}</p>
        {regionPresent.opportunities?.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: '0.5rem' }}>
            {regionPresent.opportunities.map((o) => o.label).join(' · ')}
          </p>
        )}
      </div>

      {commandMode.active && (
        <div className="panel" style={{ borderColor: 'var(--gold)' }}>
          <h2>Command & Presence</h2>
          <p className="prose" style={{ fontSize: '0.9rem' }}>
            {stageMech.label} — {getMobilityLabel(stageMech.stageId)}. You rule through decree, ritual, and devoted followers.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Travel via companions ({commandMode.canDelegate ? 'available' : 'recruit party first'})
            {commandMode.canRitualProject ? ' · Ritual projection available' : ''}
          </p>
        </div>
      )}

      <div className="panel">
        <h2>Travel</h2>
        <div className="btn-grid">
          {getTravelOptions(game, game.region).map((opt) => (
            <button
              key={opt.regionId}
              disabled={opt.blocked}
              title={opt.blockedReason || undefined}
              onClick={() => !opt.blocked && travel(opt.regionId)}
            >
              Go to {opt.name}
              {opt.blocked && opt.puzzleId && (
                <div style={{ fontSize: "0.75rem", color: "var(--rose)" }}>
                  Blocked — solve nearby mystery
                </div>
              )}
              {opt.blocked && !opt.puzzleId && (
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  Locked
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {features.length > 0 && (
        <div className="panel">
          <h2>Places & Mysteries</h2>
          <p className="prose" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            Obstacles and wonders await clever abundance — grow, cast, bond, or skill your way through.
          </p>
          <div className="btn-grid">
            {features.map((f) => (
              <button key={f.id} onClick={() => openFeature(f)}>
                {f.icon} {f.name}
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  {f.solved ? "✦ Solved" : f.examined ? "Examined — try a solution" : "Unexplored mystery"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <SpellbookPanel
        game={game}
        npcs={npcs}
        features={features}
        onGameUpdate={onUpdate}
        onCastResult={(npc) => handleNpcUpdate(npc)}
        onFeatureCast={(result) => {
          if (result.puzzleSolve?.solved) {
            onUpdate((g) => ({ ...g, lastQuestMessage: result.questMessages || g.lastQuestMessage }));
          }
        }}
      />

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
                  {npc.isCompanion && ' ★'}
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
          <button onClick={() => setShowSheet(true)}>Character Sheet</button>
          <button onClick={() => setShowInfluence((v) => !v)}>Influence & Power</button>
          <button onClick={onEncounter}>Seek Encounter</button>
          <button onClick={() => onUpdate((g) => {
            longRest(g.player);
            return { ...g, day: g.day + 1, lastLevelUpMessage: null };
          })}>
            Rest & Feast (long rest)
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
              {getTier(c.relationship || 0).label} · {getCorruptionTier(c.corruption || 0).label}
            </span>
            {c.bondFlags?.devoted && <span style={{ color: "var(--gold-bright)" }}> ★ Devoted</span>}
          </div>
        ))}
      </div>

      {featureModal && (
        <FeatureModal
          feature={featureModal}
          game={game}
          onClose={() => setFeatureModal(null)}
          onGameUpdate={onUpdate}
          onDebugContext={onDebugContext}
          onStartPuzzleCombat={(pending) => {
            setFeatureModal(null);
            onPuzzleCombat?.(pending);
          }}
        />
      )}

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

      {showInfluence && (
        <div className="panel" style={{ borderColor: 'var(--gold)' }}>
          <h2>Influence & Power</h2>
          <div className="stats-bar" style={{ flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="stat">Political: <strong>{influence.political}</strong></span>
            <span className="stat">Religious: <strong>{influence.religious}</strong></span>
            <span className="stat">Cultural: <strong>{influence.cultural}</strong></span>
            <span className="stat">Holdings: <strong>{influence.holdings}</strong></span>
            <span className="stat">Institutions: <strong>{influence.institutions}</strong></span>
          </div>
          {influence.titles.length > 0 && (
            <p style={{ fontSize: '0.85rem' }}>
              Titles: {influence.titles.map((t) => t.label).join(' · ')}
            </p>
          )}
          <p className="prose" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Influence makes others grow — through land, temples, courts, and quiet cult-like devotion.
            Size grants presence, not office. Build power through multiple paths.
          </p>
        </div>
      )}

      {showSheet && (
        <CharacterSheet game={game} onClose={() => setShowSheet(false)} />
      )}
    </div>
  );
}
