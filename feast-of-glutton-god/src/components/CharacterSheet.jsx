import { getStage, isAtSizeCap } from '../gameData/stages.js';
import { getStagePerk } from '../gameData/stagePerks.js';
import { getCharacterSpells } from '../gameData/spellLearning.js';
import { getAbundanceProgress } from '../gameData/abundanceSpread.js';
import { getTier } from '../gameData/relationships.js';
import { getCorruptionTier } from '../gameData/corruption.js';
import { STAT_LABELS } from '../gameData/stats.js';

export default function CharacterSheet({ game, onClose }) {
  const player = game.player;
  const stage = getStage(player.lbs);
  const perk = getStagePerk(player);
  const abundance = getAbundanceProgress(game);
  const spells = getCharacterSpells(player);
  const atCap = isAtSizeCap(player);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <h2>{player.name}</h2>
        <p className="subtitle">{player.raceName} {player.className} — {player.subclass}</p>

        <div className="stats-bar" style={{ flexWrap: 'wrap' }}>
          <span className="stat">Lv <strong>{player.level}</strong></span>
          <span className="stat">{stage.label} ({Math.round(player.lbs)} lbs)</span>
          <span className="stat" title={perk.desc}><strong>{perk.label}</strong></span>
          <span className="stat">HP {player.hp}/{player.maxHp}</span>
          <span className="stat">AP {player.ap}</span>
          {atCap && <span className="stat" style={{ color: 'var(--gold)' }}>Size cap {player.sizeCap}</span>}
        </div>

        <div className="panel" style={{ marginTop: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Abundance Influence</h3>
          <p style={{ fontSize: '0.85rem' }}>{abundance.current.label} — {abundance.points} pts</p>
          {abundance.next && (
            <div style={{ height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 3, marginTop: '0.25rem' }}>
              <div style={{ width: `${abundance.pct}%`, height: '100%', background: 'var(--gold)' }} />
            </div>
          )}
        </div>

        <div className="panel" style={{ marginTop: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Stats</h3>
          <div className="btn-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
            {Object.entries(player.stats || {}).map(([k, v]) => (
              <span key={k} className="stat" style={{ fontSize: '0.8rem' }}>
                {STAT_LABELS[k] || k}: <strong>{v}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="panel" style={{ marginTop: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Stage Perk — {perk.label}</h3>
          <p className="prose" style={{ fontSize: '0.85rem' }}>{perk.desc}</p>
          {perk.combat && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Combat: +{perk.combat.damageBonus || 0} dmg · +{perk.combat.acBonus || 0} AC
              {perk.combat.reachBonus ? ` · +${perk.combat.reachBonus} reach` : ''}
            </p>
          )}
        </div>

        <div className="panel" style={{ marginTop: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Spells Known ({spells.length})</h3>
          <div style={{ fontSize: '0.8rem', maxHeight: 120, overflow: 'auto' }}>
            {spells.map((s) => (
              <div key={s.id} style={{ marginBottom: '0.25rem' }}>
                {s.growth ? '✦ ' : ''}{s.name} <span style={{ color: 'var(--text-dim)' }}>Lv{s.slotLevel}</span>
              </div>
            ))}
          </div>
        </div>

        {game.party?.length > 0 && (
          <div className="panel" style={{ marginTop: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Party Bonds</h3>
            {game.party.map((c) => (
              <div key={c.id} style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <strong>{c.name}</strong> — {getTier(c.relationship || 0).label}
                {' · '}{getCorruptionTier(c.corruption || 0).label}
                {c.bondFlags?.devoted && ' ★'}
              </div>
            ))}
          </div>
        )}

        <button style={{ marginTop: '1rem' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
