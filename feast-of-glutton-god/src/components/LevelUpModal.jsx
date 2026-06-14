import { useState } from 'react';

export default function LevelUpModal({ pending, levelUpResult, onComplete }) {
  const [selectedSpells, setSelectedSpells] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedRoleplay, setSelectedRoleplay] = useState(null);

  if (!pending && !levelUpResult) return null;

  const narrative = pending?.narrative || levelUpResult?.narrative;
  const type = pending?.type;

  const confirmSpells = () => {
    onComplete({ spellIds: selectedSpells });
    setSelectedSpells([]);
  };

  const confirmAsi = () => {
    onComplete({ stat: selectedStat });
    setSelectedStat(null);
  };

  const confirmRoleplay = () => {
    onComplete({ roleplayId: selectedRoleplay });
    setSelectedRoleplay(null);
  };

  const skipOptional = () => {
    onComplete({});
  };

  const toggleSpell = (id) => {
    const pickCount = pending?.pickCount ?? 1;
    setSelectedSpells((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= pickCount) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <h2 style={{ color: 'var(--gold-bright)' }}>
          ★ Level {pending?.level ?? levelUpResult?.level} — Abundance Ascendant
        </h2>

        {narrative && type !== 'celebration' && (
          <div className="panel prose" style={{ marginBottom: '1rem', borderColor: 'var(--gold)' }}>
            {narrative}
          </div>
        )}

        {type === 'celebration' && narrative && (
          <>
            <div className="panel prose" style={{ marginBottom: '1rem', borderColor: 'var(--gold)' }}>
              {narrative}
            </div>
            <button className="primary" onClick={skipOptional}>Continue the Feast</button>
          </>
        )}

        {type === 'spell_choice' && (
          <>
            {narrative && (
              <div className="panel prose" style={{ marginBottom: '1rem', borderColor: 'var(--gold)' }}>
                {narrative}
              </div>
            )}
            <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {pending.description || 'Choose new spells to learn.'}
              {' '}Select <strong>{pending.pickCount}</strong> ({selectedSpells.length}/{pending.pickCount}).
              Growth-themed spells are marked with ✦.
            </p>
            <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
              {(pending.options || []).map((spell) => (
                <button
                  key={spell.id}
                  className={`class-card ${selectedSpells.includes(spell.id) ? 'primary' : ''}`}
                  onClick={() => toggleSpell(spell.id)}
                  style={{ textAlign: 'left', borderColor: spell.growth ? 'var(--rose)' : undefined }}
                >
                  <h3>
                    {spell.growth ? '✦ ' : ''}{spell.name}
                    {spell.slotLevel ? ` (Level ${spell.slotLevel})` : ''}
                  </h3>
                  <p>{spell.desc}</p>
                  {spell.minSizeStage != null && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Requires size stage {spell.minSizeStage}+ to learn
                    </p>
                  )}
                </button>
              ))}
            </div>
            <button
              className="primary"
              style={{ marginTop: '1rem' }}
              disabled={selectedSpells.length < (pending.pickCount ?? 1)}
              onClick={confirmSpells}
            >
              Embrace New Magic
            </button>
          </>
        )}

        {type === 'asi_choice' && (
          <>
            <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {pending.description}
            </p>
            <div className="btn-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {(pending.options || []).map((opt) => (
                <button
                  key={opt.id}
                  className={`class-card ${selectedStat === opt.id ? 'primary' : ''}`}
                  onClick={() => setSelectedStat(opt.id)}
                  style={{ textAlign: 'left' }}
                >
                  <h3>{opt.label} +2 {opt.suggested ? '★' : ''}</h3>
                  <p style={{ fontSize: '0.85rem' }}>{opt.desc}</p>
                </button>
              ))}
            </div>
            <button
              className="primary"
              style={{ marginTop: '1rem' }}
              disabled={!selectedStat}
              onClick={confirmAsi}
            >
              Channel Growth Into {selectedStat ? pending.options.find((o) => o.id === selectedStat)?.label : '…'}
            </button>
          </>
        )}

        {type === 'roleplay' && (
          <>
            <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {pending.description}
            </p>
            <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
              {(pending.options || []).map((opt) => (
                <button
                  key={opt.id}
                  className={`class-card ${selectedRoleplay === opt.id ? 'primary' : ''}`}
                  onClick={() => setSelectedRoleplay(opt.id)}
                  style={{ textAlign: 'left' }}
                >
                  <h3>{opt.label}</h3>
                  <p style={{ fontSize: '0.85rem' }}>{opt.desc}</p>
                </button>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="primary" disabled={!selectedRoleplay} onClick={confirmRoleplay}>
                Affirm This Path
              </button>
              {pending.optional && (
                <button onClick={skipOptional}>Skip</button>
              )}
            </div>
          </>
        )}

        {!pending && levelUpResult && (
          <button className="primary" onClick={skipOptional} style={{ marginTop: '1rem' }}>
            Continue the Feast
          </button>
        )}
      </div>
    </div>
  );
}
