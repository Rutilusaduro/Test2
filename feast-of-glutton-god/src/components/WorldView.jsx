import { useState, useEffect } from "react";
import { getRegion, CONTINENT_NAME } from "../gameData/regions.js";
import { getRegionPresentation, getRegionTransformation } from "../gameData/worldTransformation.js";
import { getCommandMode, resolveTravelMethod } from "../gameData/commandMode.js";
import { getStageMechanics, getMobilityLabel } from "../gameData/stageMechanics.js";
import { getInfluenceProgress, INFLUENCE_META, INFLUENCE_TRACKS } from "../gameData/influence.js";
import { spendAP } from "../gameData/player.js";
import { getNpcsInRegion } from "../gameData/npcs.js";
import { getNpcState, applyNpcState } from "../gameData/player.js";
import { clearTransient, narrate, narrateEvent, tickDmAction } from "../gameData/narrator.js";
import { renderUnmetDescriptor } from "../textEngine/scenes/npc/unmet.js";
import { getStage, isAtSizeCap } from "../gameData/stages.js";
import { getTier } from "../gameData/relationships.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import { getXpProgress, longRest } from "../gameData/leveling.js";
import { decaySatiationForGame } from "../gameData/satiation.js";
import {
  doIndulge,
  ensureFavor,
} from "../gameData/favor.js";
import {
  getRegionTensionLabel,
  rollHostilityTravelEncounter,
  tickRegionHostility,
} from "../gameData/regionHostility.js";
import { renderRegionHostilityBeat } from "../textEngine/scenes/dm/region.js";
import { getPlayerDerivedStats } from "../gameData/player.js";
import { getTravelOptions } from "../gameData/regionObstacles.js";
import { getVisibleFeatures } from "../gameData/puzzleEngine.js";
import { getAbundanceProgress, GODDESS_ASCENSION_LABEL } from "../gameData/abundanceSpread.js";
import { getDivineAttentionProgress, getLastPortent } from "../gameData/divineAttention.js";
import { recordRegionVisitForQuests } from "../hooks/questHooks.js";
import { advanceWorldSettling, getRegionReactivitySummary } from "../gameData/worldReactivity.js";
import { syncGateUnlocks } from "../gameData/regionObstacles.js";
import NpcModal from "./NpcModal.jsx";
import FeatureModal from "./FeatureModal.jsx";
import QuestLog from "./QuestLog.jsx";
import SpellbookPanel from "./SpellbookPanel.jsx";
import CharacterSheet from "./CharacterSheet.jsx";
import DmBanner from "./DmBanner.jsx";

const ARCHETYPE_GLYPH = {
  nurturing: "♥",
  performer: "♪",
  competitive: "⚒",
  devout: "✦",
  scholar: "📜",
  dominant: "☽",
  haughty: "♛",
  merchant: "◎",
  chosen: "★",
};

export default function WorldView({ game, onUpdate, onEncounter, onHostilityEncounter, onPuzzleCombat, onSave, onDebugContext }) {
  const [npcModal, setNpcModal] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);
  const [showRegionDash, setShowRegionDash] = useState(false);
  const player = game.player;
  ensureFavor(player);
  const regionPresent = getRegionPresentation(game, game.region);
  const regionTransform = getRegionTransformation(game, game.region);
  const commandMode = getCommandMode(game);
  const stageMech = getStageMechanics(player);
  const influence = getInfluenceProgress(game);
  const stage = getStage(player.lbs);
  const xp = getXpProgress(player);
  const derived = getPlayerDerivedStats(player);
  const abundance = getAbundanceProgress(game);
  const divineAttention = getDivineAttentionProgress(game);
  const lastPortent = getLastPortent(game);
  const reactivity = getRegionReactivitySummary(game, game.region);
  const tensionLabel = getRegionTensionLabel(game, game.region);

  const applySettling = (g) => {
    const settled = advanceWorldSettling(g);
    const gateMsgs = syncGateUnlocks(g, { regionId: g.region });
    const lines = [...(settled.lines ?? []), ...gateMsgs];
    if (lines.length) {
      narrateEvent(g, lines.join('\n\n'), 'growth');
    }
    return g;
  };

  const travel = (regionId) => {
    const method = resolveTravelMethod(game, regionId);
    if (!method.ok) {
      onUpdate((g) => {
        clearTransient(g);
        narrateEvent(g, method.message, 'quest');
        return g;
      });
      return;
    }
    onUpdate((g) => {
      clearTransient(g);
      if (method.apCost) spendAP(g, method.apCost);
      const fromRegion = g.region;
      const next = applySettling({ ...g, region: regionId });
      narrate(next, 'arrival', { regionId });
      if (method.flavor) narrateEvent(next, method.flavor, 'quest');
      const quest = recordRegionVisitForQuests(next, regionId);
      if (quest.questMessages) {
        narrateEvent(next, quest.questMessages, 'quest');
      }
      tickDmAction(next, 'travel');
      tickRegionHostility(next);
      const hostilityEnemy = rollHostilityTravelEncounter(next, fromRegion, regionId);
      if (hostilityEnemy && onHostilityEncounter) {
        const beat = renderRegionHostilityBeat(next, regionId, { hostilityTier: 2 });
        if (beat) narrateEvent(next, beat, 'quest');
        setTimeout(() => onHostilityEncounter(hostilityEnemy), 0);
      }
      return next;
    });
  };

  useEffect(() => {
    onUpdate((g) => {
      narrate(g, 'arrival', { regionId: g.region });
      const quest = recordRegionVisitForQuests(g, g.region);
      if (quest.questMessages) {
        narrateEvent(g, quest.questMessages, 'quest');
      }
      return g;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount for visit objectives
  }, []);

  const openNpc = (npc) => {
    onUpdate((g) => {
      applyNpcState(g, npc.id, { met: true });
      tickDmAction(g, 'npc');
      return g;
    });
    const state = getNpcState(game, { ...npc, met: true });
    setNpcModal(state);
    onDebugContext?.({ npc: state, region: game.region, interaction: "npc_open" });
  };

  const dismissDmEvent = () => {
    onUpdate((g) => {
      clearTransient(g);
      return g;
    });
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
    onUpdate((g) => {
      tickDmAction(g, 'feature');
      return g;
    });
    setFeatureModal(feature);
    onDebugContext?.({ feature, region: game.region, interaction: "feature_open" });
  };

  const closeNpcModal = () => {
    setNpcModal(null);
    onUpdate((g) => {
      clearTransient(g);
      return g;
    });
  };

  const closeFeatureModal = () => {
    setFeatureModal(null);
    onUpdate((g) => {
      clearTransient(g);
      return g;
    });
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
          {GODDESS_ASCENSION_LABEL}: <strong>{abundance.current.label}</strong>
        </span>
        <span className="stat" title={divineAttention.current.desc}>
          Divine Attention: <strong>{divineAttention.current.label}</strong>
        </span>
        <span className="stat">AC <strong>{derived.ac}</strong></span>
        <span className="stat">AP: <strong>{player.ap}</strong>/{derived.maxAp}</span>
        <span className="stat" title="the Fat Goddess's daily favor for overworld growth magic">
          Favor: <strong>{player.favor}/{player.favorMax}</strong>
        </span>
        {tensionLabel && (
          <span className="stat" title="Regional tension from forced growth" style={{ color: 'var(--rose)' }}>
            Tension: <strong>{tensionLabel}</strong>
          </span>
        )}
        <span className="stat">HP: <strong>{player.hp}/{player.maxHp}</strong></span>
        <span className="stat">Party: <strong>{game.party.length}</strong></span>
      </div>

      {abundance.next && (
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            {GODDESS_ASCENSION_LABEL} — {abundance.points} pts toward {abundance.next.label}
          </div>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
            <div style={{ width: `${abundance.pct}%`, height: '100%', background: 'var(--gold)' }} />
          </div>
        </div>
      )}

      {divineAttention.next && (
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Divine Attention — toward {divineAttention.next.label}
          </div>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
            <div style={{ width: `${divineAttention.pct}%`, height: '100%', background: 'var(--rose)' }} />
          </div>
        </div>
      )}

      {lastPortent && (
        <p style={{ padding: '0 1rem', fontSize: '0.75rem', color: 'var(--rose)', marginBottom: '0.5rem' }}>
          Latest portent: <strong>{lastPortent.label}</strong> — {lastPortent.message}
        </p>
      )}

      <DmBanner game={game} onDismissEvent={dismissDmEvent} />

      <div className="panel panel--narration">
        <h2>{regionPresent.name}</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
          Regional transformation: <strong>{regionTransform.level.label}</strong>
          {tensionLabel && (
            <> · Tension: <strong style={{ color: 'var(--rose)' }}>{tensionLabel}</strong></>
          )}
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
        {reactivity.blockedExits.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--rose)', marginTop: '0.5rem' }}>
            Blocked routes: {reactivity.blockedExits.map((b) => `→ ${b.toName} (${b.sourceName})`).join(' · ')}
          </p>
        )}
        {reactivity.landmarks.length > 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Living landmarks: {reactivity.landmarks.map((l) => l.name).join(' · ')}
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

      <div className="panel panel--actions">
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
        <div className="panel panel--actions">
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
            onUpdate((g) => {
              if (result.questMessages) narrateEvent(g, result.questMessages, 'quest');
              tickDmAction(g, 'spell');
              return g;
            });
          }
        }}
        onClose={() => onUpdate((g) => { clearTransient(g); return g; })}
      />

      <div className="panel panel--people">
        <h2>People Here</h2>
        {npcs.length === 0 ? (
          <p className="prose">The paths are quiet — only wind and the smell of baking bread.</p>
        ) : (
          <div className="btn-grid npc-grid">
            {npcs.map((npc) => {
              const met = Boolean(npc.met);
              const ns = getStage(npc.lbs);
              const rel = getTier(npc.relationship || 0);
              const glyph = ARCHETYPE_GLYPH[npc.archetype] || "◆";
              return (
                <button key={npc.id} className={`npc-card${met ? '' : ' npc-card--unmet'}`} onClick={() => openNpc(npc)}>
                  <span className="npc-card__glyph">{glyph}</span>
                  <span className="npc-card__body">
                    {met ? (
                      <>
                        <strong>{npc.name}</strong>
                        {npc.isCompanion && ' ★'}
                        <div className="npc-card__meta">
                          {ns.label}{rel.id > 0 ? ` · ${rel.label}` : ''}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="npc-card__unmet-label">Stranger</span>
                        <div className="npc-card__meta npc-card__meta--unmet">
                          {renderUnmetDescriptor(npc, player)}
                        </div>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <QuestLog game={game} regionId={game.region} onUpdate={onUpdate} />

      <div className="panel panel--actions">
        <h2>Actions</h2>
        <div className="btn-grid">
          <button onClick={() => setShowSheet(true)}>Character Sheet</button>
          <button onClick={() => setShowRegionDash((v) => !v)}>Region Chronicle</button>
          <button onClick={() => setShowInfluence((v) => !v)}>{INFLUENCE_META.label}</button>
          <button onClick={onEncounter}>Seek Encounter</button>
          <button onClick={() => onUpdate((g) => {
            longRest(g.player, g);
            decaySatiationForGame(g, { longRest: true });
            const next = applySettling({ ...g, day: g.day + 1, lastLevelUpMessage: null });
            tickRegionHostility(next, { dayAdvance: true, longRest: true });
            return next;
          })}>
            Rest & Feast (long rest)
          </button>
          <button onClick={() => onUpdate((g) => {
            ensureFavor(g.player);
            const result = doIndulge(g.player, g);
            if (result.text) narrateEvent(g, result.text, 'growth');
            tickDmAction(g, 'indulge');
            return g;
          })}>
            Eat / Indulge (restore Favor)
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
          onClose={closeFeatureModal}
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
          onClose={closeNpcModal}
          onUpdate={handleNpcUpdate}
          onGameRefresh={() => onUpdate((g) => ({ ...g }))}
          onDebugContext={onDebugContext}
        />
      )}

      {showRegionDash && (
        <div className="panel" style={{ borderColor: 'var(--rose)' }}>
          <h2>Region Chronicle — {reactivity.regionName}</h2>
          <div className="stats-bar" style={{ flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="stat">Footprint: <strong>{reactivity.footprint}</strong></span>
            <span className="stat">Giants: <strong>{reactivity.giantCount}</strong></span>
            <span className="stat">Settling: <strong>{reactivity.settleState}/2</strong></span>
            <span className="stat">Transform: <strong>{regionTransform.level.label}</strong></span>
            {reactivity.factionPurityWeakened && (
              <span className="stat" style={{ color: 'var(--gold)' }}>Purity weakened</span>
            )}
          </div>
          {reactivity.landmarks.length > 0 ? (
            <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <strong>Landmarks you shaped:</strong>
              {reactivity.landmarks.map((l) => (
                <div key={l.id} style={{ marginTop: '0.35rem', color: 'var(--text-dim)' }}>
                  {l.name} — tier {l.tier}{l.cult ? ' · cult' : ''} · settling {l.settleState}/2
                </div>
              ))}
            </div>
          ) : (
            <p className="prose" style={{ fontSize: '0.85rem' }}>No living landmarks here yet — growth past immobility leaves permanent marks.</p>
          )}
          {reactivity.blockedExits.length > 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--rose)' }}>
              Blocked exits: {reactivity.blockedExits.map((b) => `${b.toName} (by ${b.sourceName})`).join(', ')}.
              Routes reopen as the region settles ({reactivity.settleState}/2).
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>All roads open — for now.</p>
          )}
          {reactivity.ecology?.narrative && (
            <p style={{ fontSize: '0.85rem', color: 'var(--gold)', marginTop: '0.5rem' }}>
              {reactivity.ecology.narrative}
            </p>
          )}
          {reactivity.ecology?.giants?.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              Giants: {reactivity.ecology.giants.map((g) => `${g.name} (${g.raisedBy})`).join(' · ')}
            </div>
          )}
          {(game.worldFlags?.livingLedger ?? []).slice(-3).reverse().map((entry) => (
            <p key={entry.id} style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: '0.35rem' }}>
              Day {entry.day}: {entry.label}
            </p>
          ))}
        </div>
      )}

      {showInfluence && (
        <div className="panel" style={{ borderColor: 'var(--gold)' }}>
          <h2>{INFLUENCE_META.label}</h2>
          <p className="prose" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{INFLUENCE_META.desc}</p>
          <div className="stats-bar" style={{ flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="stat">{INFLUENCE_TRACKS.political.label}: <strong>{influence.political}</strong></span>
            <span className="stat">{INFLUENCE_TRACKS.religious.label}: <strong>{influence.religious}</strong></span>
            <span className="stat">{INFLUENCE_TRACKS.cultural.label}: <strong>{influence.cultural}</strong></span>
            <span className="stat">Holdings: <strong>{influence.holdings}</strong></span>
            <span className="stat">Institutions: <strong>{influence.institutions}</strong></span>
          </div>
          {influence.titles.length > 0 && (
            <p style={{ fontSize: '0.85rem' }}>
              Titles: {influence.titles.map((t) => t.label).join(' · ')}
            </p>
          )}
          <p className="prose" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Mortal takeover — land, shrines, courts, and quiet cult-like devotion.
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
