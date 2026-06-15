import { useState } from 'react';
import {
  SEED_LIST,
  getAvailableSeedsForPilgrimage,
  getCompanionEchoOptions,
  getRegionMemoryOptions,
  getSpellRemnantOptions,
} from '../gameData/pilgrimageSeeds.js';
import { loadPilgrimageMeta } from '../gameData/save.js';
import { getSpell } from '../gameData/spells.js';

export default function PilgrimageModal({ priorGame, onBegin, onCancel }) {
  const meta = loadPilgrimageMeta();
  const maxSeeds = getAvailableSeedsForPilgrimage(meta, priorGame);
  const [picks, setPicks] = useState([]);

  const companionOptions = getCompanionEchoOptions(priorGame);
  const regionOptions = getRegionMemoryOptions();
  const spellOptions = getSpellRemnantOptions(priorGame);

  const toggleSeed = (type, detail = {}) => {
    setPicks((prev) => {
      const exists = prev.find((p) => p.type === type);
      if (exists) return prev.filter((p) => p.type !== type);
      if (prev.length >= maxSeeds) return prev;
      return [...prev, { type, ...detail }];
    });
  };

  const isPicked = (type) => picks.some((p) => p.type === type);

  const begin = () => {
    onBegin(picks);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 220 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <h2 style={{ color: 'var(--gold-bright)' }}>★ New Pilgrimage</h2>
        <p className="prose" style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
          The Fat Goddess remembers. Carry up to <strong>{maxSeeds}</strong> seed{maxSeeds !== 1 ? 's' : ''} into a fresh Act I
          (pilgrimage #{ (meta.pilgrimageCount ?? 0) + 1 }, legacy abundance {meta.legacyAbundance ?? 0}).
        </p>

        <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
          {SEED_LIST.map((seed) => (
            <div key={seed.id} className="class-card" style={{ textAlign: 'left', opacity: maxSeeds === 0 ? 0.5 : 1 }}>
              <h3>{seed.name}</h3>
              <p style={{ fontSize: '0.85rem' }}>{seed.desc}</p>
              {seed.id === 'companion_echo' && companionOptions.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {companionOptions.map((c) => (
                    <button
                      key={c.id}
                      className={isPicked('companion_echo') && picks.find((p) => p.companionId === c.id) ? 'primary' : ''}
                      style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                      disabled={maxSeeds === 0}
                      onClick={() => toggleSeed('companion_echo', { companionId: c.id })}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {seed.id === 'region_memory' && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {regionOptions.map((rid) => (
                    <button
                      key={rid}
                      className={isPicked('region_memory') && picks.find((p) => p.regionId === rid) ? 'primary' : ''}
                      style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                      disabled={maxSeeds === 0}
                      onClick={() => toggleSeed('region_memory', { regionId: rid })}
                    >
                      {rid.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
              {seed.id === 'spell_remnant' && spellOptions.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {spellOptions.map((sid) => {
                    const spell = getSpell(sid);
                    return (
                      <button
                        key={sid}
                        className={isPicked('spell_remnant') && picks.find((p) => p.spellId === sid) ? 'primary' : ''}
                        style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                        disabled={maxSeeds === 0}
                        onClick={() => toggleSeed('spell_remnant', { spellId: sid })}
                      >
                        {spell?.name ?? sid}
                      </button>
                    );
                  })}
                </div>
              )}
              {seed.id === 'companion_echo' && !companionOptions.length && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No companions to echo from prior run.</p>
              )}
              {seed.id === 'spell_remnant' && !spellOptions.length && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No spells to carry as remnants.</p>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
          Selected: {picks.length}/{maxSeeds}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="primary" onClick={begin}>Begin Pilgrimage</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
