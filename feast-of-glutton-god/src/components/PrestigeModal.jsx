import { useState } from 'react';
import {
  PRESTIGE_TALENT_LIST,
  getAvailablePrestigeTalents,
  getWheelSplinterOptions,
  applyPrestigeTalentPick,
  getPrestigeProgress,
} from '../gameData/prestige.js';

export default function PrestigeModal({ game, onComplete }) {
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);

  if (!game) return null;

  const progress = getPrestigeProgress(game);
  const availableTalents = getAvailablePrestigeTalents(game);
  const gateOptions = getWheelSplinterOptions();

  if (progress.talentsAvailable <= 0 || availableTalents.length === 0) return null;

  const confirmPick = () => {
    if (!selectedTalent) return;
    if (selectedTalent === 'wheel_splinter' && !selectedGate) return;
    const result = applyPrestigeTalentPick(game, selectedTalent, { gateId: selectedGate });
    onComplete(result);
    setSelectedTalent(null);
    setSelectedGate(null);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 210 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <h2 style={{ color: 'var(--gold-bright)' }}>
          ★ Prestige Rank {progress.rank} — Choose a Permanent Talent
        </h2>

        <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          Pilgrimage progress: {progress.scaling}/{progress.scalingMax} scaling quests ·{' '}
          {progress.milestones}/{progress.milestonesMax} companion milestones ·{' '}
          {progress.archive}/{progress.archiveTarget} endings archived.
          {' '}Pick <strong>1</strong> talent ({progress.talentsChosen}/{progress.rank} chosen).
        </p>

        <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
          {availableTalents.map((talent) => (
            <button
              key={talent.id}
              className={`class-card ${selectedTalent === talent.id ? 'primary' : ''}`}
              onClick={() => {
                setSelectedTalent(talent.id);
                if (talent.id !== 'wheel_splinter') setSelectedGate(null);
              }}
              style={{ textAlign: 'left' }}
            >
              <h3>{talent.name}</h3>
              <p style={{ fontSize: '0.85rem' }}>{talent.desc}</p>
            </button>
          ))}
        </div>

        {selectedTalent === 'wheel_splinter' && (
          <>
            <p className="prose" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              Choose which connection gate to ignore forever:
            </p>
            <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
              {gateOptions.map((gate) => (
                <button
                  key={gate.id}
                  className={`class-card ${selectedGate === gate.id ? 'primary' : ''}`}
                  onClick={() => setSelectedGate(gate.id)}
                  style={{ textAlign: 'left', fontSize: '0.9rem' }}
                >
                  {gate.label}
                </button>
              ))}
            </div>
          </>
        )}

        <button
          className="primary"
          style={{ marginTop: '1rem' }}
          disabled={!selectedTalent || (selectedTalent === 'wheel_splinter' && !selectedGate)}
          onClick={confirmPick}
        >
          Inscribe Talent
        </button>
      </div>
    </div>
  );
}
