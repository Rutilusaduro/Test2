import { useState } from 'react';
import { getOverworldCastableSpells, castSpellOnNpc, castSpellOnFeature, getRitualCastableSpells, castSpellOnOpenEnvironment, castSpellOnDynamicFeature } from '../gameData/overworldSpells.js';
import { withDynamicFeature } from '../gameData/dynamicFeatures.js';
import { previewCastCost } from '../gameData/spellSlots.js';
import { canUseCreationGift } from '../gameData/creationGift.js';
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
import { getSpell, isRitualSpell, getRitualApCost } from '../gameData/spells.js';
import { isGrowthThemedSpell } from '../gameData/spellLearning.js';

import { recordSpellOnFeatureForQuests } from '../hooks/puzzleHooks.js';
import SpellSlotPips from './SpellSlotPips.jsx';

export default function SpellbookPanel({ game, npcs, features = [], onCastResult, onGameUpdate, onFeatureCast, onClose }) {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [targetNpc, setTargetNpc] = useState(null);
  const [targetFeature, setTargetFeature] = useState(null);
  const [targetOpenEnv, setTargetOpenEnv] = useState(false);
  const [openEnvForm, setOpenEnvForm] = useState('basin');
  const [targetMode, setTargetMode] = useState('npc');
  const [overflow, setOverflow] = useState(false);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('cast');

  const OPEN_ENV_SPELLS = new Set(['stone_shape', 'quicksand']);

  const player = game.player;
  const spells = mode === 'ritual' ? getRitualCastableSpells(player) : getOverworldCastableSpells(player);
  const prepStatus = getPreparationStatus(player);
  const isWizard = usesSpellPreparation(player.classId);
  const spellbookIds = isWizard ? getSpellbookLeveledIds(player) : [];

  const canCast = (spell) => {
    if (player.debugAllSpellsUnlocked) return true;
    if (mode === 'ritual' && isRitualSpell(spell)) {
      if (canUseCreationGift(player, spell.id)) return true;
      return (player.ap || 0) >= getRitualApCost(spell);
    }
    return previewCastCost(player, spell, { overflow }).ok;
  };

  const handleCastOnNpc = () => {
    if (!selectedSpell || !targetNpc) return;
    const spell = spells.find((s) => s.id === selectedSpell);
    if (!spell || !canCast(spell)) return;

    const res = castSpellOnNpc(game, targetNpc, selectedSpell, { overflow, ritual: mode === 'ritual' });
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
    resetCast();
  };

  const handleCastOnFeature = () => {
    if (!selectedSpell || !targetFeature) return;
    const spell = spells.find((s) => s.id === selectedSpell);
    if (!spell || !canCast(spell)) return;

    const res = castSpellOnFeature(game, targetFeature.id, selectedSpell, { overflow, ritual: mode === 'ritual' });
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

    const quest = recordSpellOnFeatureForQuests(game, {
      featureId: targetFeature.id,
      spellId: selectedSpell,
      solved: res.puzzleSolve?.solved,
      puzzleId: targetFeature.puzzle?.id,
    });

    onFeatureCast?.({ ...res, questMessages: quest.questMessages });
    setResult(res.text);
    resetCast();
  };

  const handleCastOnOpenEnv = () => {
    if (!selectedSpell) return;
    const spell = spells.find((s) => s.id === selectedSpell);
    if (!spell || !canCast(spell)) return;

    const res = castSpellOnOpenEnvironment(game, selectedSpell, {
      overflow,
      form: openEnvForm,
      regionId: game.region,
    });
    if (!res.ok) { setResult(res.text); return; }

    onGameUpdate?.((g) => {
      const next = { ...g, player: { ...g.player, ...player } };
      if (res.feature) return withDynamicFeature(next, game.region, res.feature);
      return next;
    });
    setResult(res.text);
    resetCast();
  };

  const handleCastOnDynamicFeature = () => {
    if (!selectedSpell || !targetFeature) return;
    const spell = spells.find((s) => s.id === selectedSpell);
    if (!spell || !canCast(spell)) return;

    const res = castSpellOnDynamicFeature(game, targetFeature, selectedSpell, { overflow });
    if (!res.ok) { setResult(res.text); return; }

    onGameUpdate?.((g) => ({ ...g, player: { ...g.player, ...player } }));
    setResult(res.text);
    resetCast();
  };

  const resetCast = () => {
    setSelectedSpell(null);
    setTargetNpc(null);
    setTargetFeature(null);
    setTargetOpenEnv(false);
  };

  const handleCast = () => {
    if (targetMode === 'environment') {
      if (targetOpenEnv) return handleCastOnOpenEnv();
      if (targetFeature?.isDynamic) return handleCastOnDynamicFeature();
      return handleCastOnFeature();
    }
    return handleCastOnNpc();
  };

  const handleTogglePrep = (spellId) => {
    togglePreparedSpell(player, spellId);
    onGameUpdate?.((g) => ({ ...g, player: { ...g.player, ...player } }));
  };

  const handleAutoPrep = () => {
    autoPrepareSpells(player);
    onGameUpdate?.((g) => ({ ...g, player: { ...g.player, ...player } }));
  };

  const ritualSpells = getRitualCastableSpells(player);
  const castSpells = getOverworldCastableSpells(player);

  if (!castSpells.length && !ritualSpells.length && !isWizard) {
    return (
      <div className="panel panel--spellbook">
        <h2>Spellbook</h2>
        <p className="prose" style={{ fontSize: '0.9rem' }}>No overworld spells known yet — level up to learn abundance magic.</p>
      </div>
    );
  }

  return (
    <div className="panel panel--spellbook">
      <h2>Spellbook — Spread Abundance</h2>
      {isWizard && (
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem' }}>
            Prepared: <strong>{prepStatus.prepared}/{prepStatus.cap}</strong> from {prepStatus.book} in spellbook
          </span>
          <div className="btn-grid" style={{ marginTop: '0.5rem' }}>
            <button className={mode === 'cast' ? 'primary' : ''} onClick={() => setMode('cast')}>Cast</button>
            <button className={mode === 'ritual' ? 'primary' : ''} onClick={() => setMode('ritual')}>Ritual Cast</button>
            <button className={mode === 'prepare' ? 'primary' : ''} onClick={() => setMode('prepare')}>Prepare Spells</button>
            <button onClick={handleAutoPrep}>Auto (growth-first)</button>
          </div>
        </div>
      )}
      {!isWizard && (
        <div className="btn-grid" style={{ marginBottom: '0.75rem' }}>
          <button className={mode === 'cast' ? 'primary' : ''} onClick={() => setMode('cast')}>Cast</button>
          <button className={mode === 'ritual' ? 'primary' : ''} onClick={() => setMode('ritual')}>Ritual Cast</button>
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
            {mode === 'ritual'
              ? 'Ritual casting — AP only, no spell slots. Cannot be used in combat.'
              : 'Cast abundance magic on people or places nearby. Clever spell use can solve mysteries without combat.'}
          </p>
          <div className="btn-grid" style={{ marginBottom: '0.5rem' }}>
            <button className={targetMode === 'npc' ? 'primary' : ''} onClick={() => { setTargetMode('npc'); setTargetFeature(null); setTargetOpenEnv(false); }}>Target: People</button>
            <button className={targetMode === 'environment' ? 'primary' : ''} onClick={() => { setTargetMode('environment'); setTargetNpc(null); }}>Target: Environment</button>
          </div>
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
                  {mode === 'ritual' ? `Ritual · ${getRitualApCost(s)} AP` : s.slotLevel ? `Lv ${s.slotLevel}` : 'Cantrip'}
                </div>
              </button>
            ))}
          </div>
          {selectedSpell && (
            <>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {targetMode === 'environment' ? 'Which place receives your magic?' : 'Who receives your magic?'}
              </p>
              <div className="btn-grid" style={{ gridTemplateColumns: '1fr' }}>
                {targetMode === 'environment' ? (
                  <>
                    {features.map((f) => (
                      <button
                        key={f.id}
                        className={targetFeature?.id === f.id ? 'primary' : ''}
                        onClick={() => { setTargetFeature(f); setTargetOpenEnv(false); }}
                      >
                        {f.icon} {f.name}
                        {f.solved ? ' (solved)' : f.isDynamic ? ' — conjured' : ''}
                      </button>
                    ))}
                    {OPEN_ENV_SPELLS.has(selectedSpell) && (
                      <button
                        className={targetOpenEnv ? 'primary' : ''}
                        style={{ borderStyle: targetOpenEnv ? undefined : 'dashed', opacity: 0.85 }}
                        onClick={() => { setTargetOpenEnv(true); setTargetFeature(null); }}
                      >
                        ✦ Open Ground — shape the terrain itself
                      </button>
                    )}
                    {selectedSpell === 'stone_shape' && targetOpenEnv && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        {[
                          { id: 'basin',     label: 'Basin',  hint: 'holds liquid' },
                          { id: 'table',     label: 'Table',  hint: 'feast surface' },
                          { id: 'structure', label: 'Alcove', hint: 'enclosed space' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            className={openEnvForm === f.id ? 'primary' : ''}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                            onClick={() => setOpenEnvForm(f.id)}
                          >
                            {f.label}
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{f.hint}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : npcs.map((n) => (
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
                disabled={targetMode === 'environment'
                  ? (!targetOpenEnv && !targetFeature)
                  : !targetNpc}
                onClick={handleCast}
              >
                Cast on {targetMode === 'environment'
                  ? (targetOpenEnv
                      ? `Open Ground${selectedSpell === 'stone_shape' ? ` — ${openEnvForm}` : ''}`
                      : (targetFeature?.name || '…'))
                  : (targetNpc?.name || '…')}
              </button>
            </>
          )}
        </>
      )}

      <SpellSlotPips player={player} />

      {result && (
        <div className="panel prose spell-result" style={{ marginTop: '1rem', borderColor: 'var(--rose)' }}>
          {result}
        </div>
      )}
    </div>
  );
}
