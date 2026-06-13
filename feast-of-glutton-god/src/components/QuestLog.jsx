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

const TAG_LABELS = {
  [QUEST_TAG.ABUNDANCE]: 'Abundance',
  [QUEST_TAG.CONVERSION]: 'Conversion',
  [QUEST_TAG.ROMANCE]: 'Romance',
  [QUEST_TAG.GROWTH]: 'Growth',
  [QUEST_TAG.COMPANION]: 'Companion',
};

export default function QuestLog({ game, regionId, onUpdate }) {
  const { main, side, completed } = getQuestLogData(game);
  const available = getAvailableQuestsInRegion(game, regionId);

  const startQuest = (questId) => {
    onUpdate((g) => {
      const result = tryStartQuest(g, questId);
      if (result.ok) {
        g.lastQuestMessage = result.message;
      }
      return { ...g };
    });
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
    <div className="panel">
      <h2>Quest Log</h2>

      {game.lastQuestMessage && (
        <div className="prose" style={{ marginBottom: '1rem', borderLeft: '2px solid var(--gold)', paddingLeft: '0.75rem' }}>
          {game.lastQuestMessage}
        </div>
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
    </div>
  );
}
