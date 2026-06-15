import {
  getQuestLogData,
  getAvailableQuestsInRegion,
  tryStartQuest,
} from '../hooks/questHooks.js';
import {
  getObjectiveProgressText,
  getCurrentStage,
} from '../gameData/questEngine.js';
import { getQuestDefinition } from '../gameData/quests/registry.js';
import {
  getQuestDescription,
  getQuestStageDescription,
} from '../textEngine/scenes/quests/index.js';
import { QUEST_TAG } from '../gameData/quests/constants.js';
import { narrateEvent } from '../gameData/narrator.js';
import { getPrestigeProgress, PRESTIGE_TALENT_LIST } from '../gameData/prestige.js';
import { getAchievementList, countUnlockedAchievements } from '../gameData/achievements.js';
import { getLatestDigest, formatDigest } from '../gameData/worldDigest.js';
import { getLegacyAbundance } from '../gameData/legacyAbundance.js';
import { SEASONAL_EVENTS } from '../gameData/seasonalEvents.js';
import { useState } from 'react';

const TAG_LABELS = {
  [QUEST_TAG.ABUNDANCE]: 'Abundance',
  [QUEST_TAG.CONVERSION]: 'Conversion',
  [QUEST_TAG.ROMANCE]: 'Romance',
  [QUEST_TAG.GROWTH]: 'Growth',
  [QUEST_TAG.COMPANION]: 'Companion',
};

export default function QuestLog({ game, regionId, onUpdate }) {
  const [tab, setTab] = useState('quests');
  const { main, side, completed } = getQuestLogData(game);
  const available = getAvailableQuestsInRegion(game, regionId);
  const prestige = getPrestigeProgress(game);
  const achievements = getAchievementList(game);
  const digest = getLatestDigest(game);
  const legacy = getLegacyAbundance(game);
  const seasonalId = game.worldFlags?.seasonal_event_active;
  const seasonal = seasonalId ? SEASONAL_EVENTS[seasonalId] : null;

  const startQuest = (questId) => {
    onUpdate((g) => {
      const result = tryStartQuest(g, questId);
      if (result.ok) {
        narrateEvent(g, result.message, 'quest');
      }
      return { ...g };
    });
  };

  const toggleDirectorsCut = () => {
    onUpdate((g) => ({
      ...g,
      settings: {
        ...(g.settings || {}),
        directorsCutEnabled: !g.settings?.directorsCutEnabled,
      },
    }));
  };

  const renderQuestCard = (entry, isMain) => (
    <div key={entry.id} className="quest-card" style={{
      borderLeft: `3px solid ${isMain ? 'var(--gold)' : 'var(--rose)'}`,
      padding: '0.75rem',
      marginBottom: '0.75rem',
      background: 'var(--bg-card)',
      borderRadius: '4px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
        <strong style={{ color: isMain ? 'var(--gold-bright)' : 'var(--rose)' }}>
          {isMain ? '★ ' : ''}{entry.def.title}
        </strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {isMain && entry.def.actLabel ? `${entry.def.actLabel} · ` : ''}
          {entry.def.tags?.map((t) => TAG_LABELS[t] || t).join(' · ')}
        </span>
      </div>
      <p className="prose" style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
        {getQuestDescription(entry.def, game)}
      </p>
      {(() => {
        const stage = getCurrentStage(entry.def, entry.state);
        if (!stage) return null;
        return (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>
              Stage: {stage.title}
            </p>
            <p className="prose" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {getQuestStageDescription(entry.def, stage, game)}
            </p>
            <pre style={{
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              margin: 0,
            }}>
              {getObjectiveProgressText(game, entry.id)}
            </pre>
          </>
        );
      })()}
    </div>
  );

  return (
    <div className="panel panel--log">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Quest Log</h2>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['quests', 'achievements', 'digest'].map((id) => (
            <button
              key={id}
              style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}
              className={tab === id ? 'primary' : ''}
              onClick={() => setTab(id)}
            >
              {id === 'quests' ? 'Quests' : id === 'achievements' ? `Liturgy (${countUnlockedAchievements(game)})` : 'Digest'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'quests' && (
        <>
          {prestige.rank > 0 && (
            <div className="panel" style={{ margin: '1rem 0', borderColor: 'var(--gold)' }}>
              <h3 style={{ color: 'var(--gold-bright)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                Prestige Pilgrimage — Rank {prestige.rank}/5
              </h3>
              <p className="prose" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Scaling: {prestige.scaling}/{prestige.scalingMax} ·
                Milestones: {prestige.milestones}/{prestige.milestonesMax} ·
                Archive: {prestige.archive}/{prestige.archiveTarget} ·
                Legacy: {legacy}
              </p>
              {prestige.talents.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Talents: {prestige.talents.map((id) => PRESTIGE_TALENT_LIST.find((t) => t.id === id)?.name ?? id).join(' · ')}
                </p>
              )}
              {prestige.talentsAvailable > 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--rose)', marginTop: '0.5rem' }}>
                  ★ {prestige.talentsAvailable} prestige talent pick{prestige.talentsAvailable > 1 ? 's' : ''} awaiting.
                </p>
              )}
            </div>
          )}

          {seasonal && (
            <p className="prose" style={{ fontSize: '0.85rem', margin: '0.75rem 0', color: 'var(--rose)' }}>
              ★ Seasonal: {seasonal.label} — {seasonal.desc}
            </p>
          )}

          {(game.pilgrimageMeta?.directorsCutUnlocked || game.worldFlags?.main_act3_complete) && (
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <input type="checkbox" checked={game.settings?.directorsCutEnabled ?? false} onChange={toggleDirectorsCut} />
              Director&apos;s Cut — branch-ghost narration
            </label>
          )}

          {main.length > 0 && (
            <>
              <h3 style={{ color: 'var(--gold-bright)', fontSize: '1rem', marginBottom: '0.5rem' }}>Main Quest</h3>
              {main.map((q) => renderQuestCard(q, true))}
            </>
          )}

          {side.length > 0 && (
            <>
              <h3 style={{ color: 'var(--rose)', fontSize: '1rem', margin: '0.5rem 0 0.5rem' }}>Side Quests</h3>
              {side.map((q) => renderQuestCard(q, false))}
            </>
          )}

          {main.length === 0 && side.length === 0 && (
            <p className="prose" style={{ marginBottom: '1rem' }}>No active quests — abundance awaits your invitation.</p>
          )}

          {available.length > 0 && (
            <>
              <h3 style={{ fontSize: '1rem', margin: '1rem 0 0.5rem' }}>Available Here</h3>
              {available.map((def) => (
                <div key={def.id} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>
                    {def.type === 'main' ? '★ ' : ''}{def.title}
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                      {def.tags?.map((t) => TAG_LABELS[t] || t).join(' · ')}
                    </span>
                  </span>
                  <button className="primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={() => startQuest(def.id)}>
                    Accept
                  </button>
                </div>
              ))}
            </>
          )}

          {completed.length > 0 && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-dim)' }}>Completed ({completed.length})</summary>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                {completed.map((id) => {
                  const def = getQuestDefinition(id);
                  return <li key={id}>{def?.title ?? id.replace(/_/g, ' ')}</li>;
                })}
              </ul>
            </details>
          )}
        </>
      )}

      {tab === 'achievements' && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            {countUnlockedAchievements(game)}/{achievements.length} beatitudes — each grants +1 prestige progress point (10 pts ≈ +1 rank).
          </p>
          {achievements.map((a) => (
            <div key={a.id} style={{
              padding: '0.6rem 0',
              borderBottom: '1px solid var(--border)',
              opacity: a.unlocked ? 1 : 0.55,
            }}>
              <strong style={{ color: a.unlocked ? 'var(--gold-bright)' : 'var(--text-dim)' }}>
                {a.unlocked ? '✓ ' : '○ '}{a.title}
              </strong>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0', color: 'var(--text-dim)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'digest' && (
        <div style={{ marginTop: '1rem' }}>
          {digest ? (
            <div className="panel prose" style={{ fontSize: '0.9rem', borderColor: 'var(--gold)' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {formatDigest(digest)}
              </pre>
            </div>
          ) : (
            <p className="prose" style={{ fontSize: '0.9rem' }}>
              No digest yet — rest at an inn to receive the weekly continent bulletin.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
