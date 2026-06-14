import { useState } from 'react';
import { getOverworldCastableSpells, castSpellOnNpc } from '../gameData/overworldSpells.js';
import { hasSpellSlot } from '../gameData/spellSlots.js';
import { getStage } from '../gameData/stages.js';
import { recordNpcGrowthForQuests, recordNpcInteractionForQuests } from '../hooks/questHooks.js';
import {
  usesSpellPreparation,
  getSpellbookLeveledIds,
  getPreparedSpellIds,
  getPreparationStatus,
  togglePreparedSpell,
  autoPrepareSpells,
} from '../gameData/spellPreparation.js';
import { getSpell } from '../gameData/spells.js';
import { isGrowthThemedSpell } from '../gameData/spellLearning.js';

export default function SpellbookPanel({ game, npcs, onCastResult, onGameUpdate }) {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [targetNpc, setTargetNpc] = useState(null);
  const [overflow, setOverflow] = useState(false);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('cast');

  const player = game.player;
  const spells = getOverworldCastableSpells(player);
  const prepStatus = getPreparationStatus(player);
  const slots = player.spellSlots?.current || [];
  const isWizard = usesSpellPreparation(player.classId);
  const spellbookIds = isWizard ? getSpellbookLeveledIds(player) : [];

  const canCast = (spell) => {
    if (spell.slotLevel === 0) return true;
    if (hasSpellSlot(player, spell.slotLevel)) return true;
    const ap = spell.apCost ?? spell.slotLevel * 5;
    return (player.ap || 0) >= ap;
  };

  const handleCast = () => {
    if (!selectedSpell || !targetNpc) return;
    const spell = spells.find((s) => s.id === selectedSpell);
    if (!spell || !canCast(spell)) return;

    const res = castSpellOnNpc(game, targetNpc, selectedSpell, { overflow });
    if (!res.ok) {
      setResult(res.text);
      return;
    }

    onGameUpdate?.((g) => {
      const next = { ...g, player: { ...g.player, ...player } };
      if (res.spread?.total != null) {
        next.worldFlags = { ...next.worldFlags, abundanceSpread: res.spread.total };
      }
      return next;
    });

    recordNpcInteractionForQuests(game, {
      npcId: res.npc.id,
      interaction: 'overworld_spell',
      npc: res.npc,
      meta: { spellId: selectedSpell },
    });
    if (res.effects?.growth?.stagesJumped > 0) {
      recordNpcGrowthForQuests(game, {
        npcId: res.npc.id,
        startStage: res.effects.growth.startStage,
        endStage: res.effects.growth.endStage,
        stagesGained: res.effects.growth.stagesJumped,
      });
    }

    onCastResult?.(res.npc);
    setResult(res.text);
    setSelectedSpell(null);
    setTargetNpc(null);
  };

  const handleTogglePrep = (spellId) => {
    togglePreparedSpell(player, spellId);
    onGameUpdate?.((g) => ({ ...g, player: { ...g.player, ...player } }));
  };

  const handleAutoPrep = () => {
    autoPrepareSpells(player);
    onGameUpdate?.((g) => ({ ...g, player: { ...g.player, ...player } }));
  };

  if (!spells.length && !isWizard) {
    return (
      <div className="panel">
        <h2>Spellbook</h2>
        <p className="prose" style={{ fontSize: '0.9rem' }}>No overworld spells known yet — level up to learn abundance magic.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Spellbook — Spread Abundance</h2>
      {isWizard && (
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem' }}>
            Prepared: <strong>{prepStatus.prepared}/{prepStatus.cap}</strong> from {prepStatus.book} in spellbook
          </span>
          <div className="btn-grid" style={{ marginTop: '0.5rem' }}>
            <button className={mode === 'cast' ? 'primary' : ''} onClick={() => setMode('cast')}>Cast</button>
            <button className={mode === 'prepare' ? 'primary' : ''} onClick={() => setMode('prepare')}>Prepare Spells</button>
            <button onClick={handleAutoPrep}>Auto (growth-first)</button>
          </div>
        </div>
      )}

      {mode === 'prepare' && isWizard ? (
        <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
          {spellbookIds.map((id) => {
            const s = getSpell(id);
            if (!s) return null;
            const prepared = getPreparedSpellIds(player).includes(id);
            return (
              <button
                key={id}
                className={prepared ? 'primary' : ''}
                onClick={() => handleTogglePrep(id)}
                style={{ textAlign: 'left', fontSize: '0.85rem' }}
              >
                {isGrowthThemedSpell(s) ? '✦ ' : ''}{s.name} (Lv {s.slotLevel})
                {prepared ? ' — prepared' : ''}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <p className="prose" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Cast growth magic on people nearby. They swell with pleasure — always beautiful, always hungry for more.
          </p>
          <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" checked={overflow} onChange={(e) => setOverflow(e.target.checked)} />
            {' '}Overflow cast (extra growth)
          </label>
          <div className="btn-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem' }}>
            {spells.map((s) => (
              <button
                key={s.id}
                className={selectedSpell === s.id ? 'primary' : ''}
                disabled={!canCast(s)}
                onClick={() => setSelectedSpell(s.id)}
                style={{ textAlign: 'left', fontSize: '0.85rem' }}
              >
                {isGrowthThemedSpell(s) ? '✦ ' : ''}{s.name}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {s.slotLevel ? `Lv ${s.slotLevel}` : 'Cantrip'}
                </div>
              </button>
            ))}
          </div>
          {selectedSpell && (
            <>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Who receives your magic?</p>
              <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
                {npcs.map((n) => (
                  <button
                    key={n.id}
                    className={targetNpc?.id === n.id ? 'primary' : ''}
                    onClick={() => setTargetNpc(n)}
                  >
                    {n.name} — {getStage(n.lbs).label}
                  </button>
                ))}
              </div>
              <button
                className="primary"
                style={{ marginTop: '0.75rem' }}
                disabled={!targetNpc}
                onClick={handleCast}
              >
                Cast on {targetNpc?.name || '…'}
              </button>
            </>
          )}
        </>
      )}

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
        Slots: {[1, 2, 3, 4, 5].map((l) => {
          const n = slots[l - 1] ?? 0;
          const max = player.spellSlots?.max?.[l - 1] ?? 0;
          return max > 0 ? `${l}:${n}/${max} ` : null;
        }).filter(Boolean).join('·') || 'Cantrips only'}
      </div>

      {result && (
        <div className="panel prose" style={{ marginTop: '1rem', borderColor: 'var(--rose)' }}>
          {result}
        </div>
      )}
    </div>
  );
}
