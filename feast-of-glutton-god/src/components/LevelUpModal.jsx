import { useState } from 'react';

export default function LevelUpModal({ pending, levelUpResult, onComplete }) {
  const [selected, setSelected] = useState([]);

  if (!pending && !levelUpResult) return null;

  const pickCount = pending?.pickCount ?? 0;
  const options = pending?.options ?? [];
  const narrative = pending?.narrative || levelUpResult?.narrative;

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= pickCount) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const confirm = () => {
    onComplete(selected);
    setSelected([]);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <h2 style={{ color: 'var(--gold-bright)' }}>
          ★ Level {pending?.level ?? levelUpResult?.level} — Abundance Ascendant
        </h2>

        {narrative && (
          <div className="panel prose" style={{ marginBottom: '1rem', borderColor: 'var(--gold)' }}>
            {narrative}
          </div>
        )}

        {pending && options.length > 0 && (
          <>
            <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              {pending.description || 'Choose new spells to learn.'}
              {' '}Select <strong>{pickCount}</strong> ({selected.length}/{pickCount}).
              Growth-themed spells are marked with ✦.
            </p>
            <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
              {options.map((spell) => (
                <button
                  key={spell.id}
                  className={`class-card ${selected.includes(spell.id) ? 'primary' : ''}`}
                  onClick={() => toggle(spell.id)}
                  style={{
                    textAlign: 'left',
                    borderColor: spell.growth ? 'var(--rose)' : undefined,
                  }}
                >
                  <h3>
                    {spell.growth ? '✦ ' : ''}{spell.name}
                    {spell.slotLevel ? ` (Level ${spell.slotLevel})` : ''}
                  </h3>
                  <p>{spell.desc}</p>
                </button>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button
                className="primary"
                disabled={selected.length < pickCount}
                onClick={confirm}
              >
                Embrace New Magic
              </button>
            </div>
          </>
        )}

        {!pending && levelUpResult && (
          <button className="primary" onClick={() => onComplete([])} style={{ marginTop: '1rem' }}>
            Continue the Feast
          </button>
        )}
      </div>
    </div>
  );
}
