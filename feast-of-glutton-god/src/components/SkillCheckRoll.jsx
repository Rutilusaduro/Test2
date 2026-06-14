import { useState, useEffect } from 'react';

/**
 * Animated d20 reveal for skill checks. Resolves instantly in logic; animates the known outcome.
 */
export default function SkillCheckRoll({ check, onComplete }) {
  const [phase, setPhase] = useState('rolling');
  const [displayRoll, setDisplayRoll] = useState(1);

  const natural = check.naturalRoll ?? 1;
  const rolls = check.rolls?.length ? check.rolls : [natural];
  const isAdvantage = check.rollMode === 'advantage' || rolls.length > 1;
  const showMulti = rolls.length > 1;

  useEffect(() => {
    if (phase !== 'rolling') return undefined;
    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      setDisplayRoll(Math.floor(Math.random() * 20) + 1);
      if (ticks >= 14) {
        clearInterval(interval);
        setDisplayRoll(natural);
        setTimeout(() => setPhase('modifiers'), 350);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [phase, natural]);

  useEffect(() => {
    if (phase === 'modifiers') {
      const t = setTimeout(() => setPhase('result'), 700);
      return () => clearTimeout(t);
    }
    if (phase === 'result') {
      const t = setTimeout(() => onComplete?.(), 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, onComplete]);

  const isCrit = check.critical === 'success';
  const isFumble = check.critical === 'failure';
  const landed = phase !== 'rolling';

  const renderDie = (value, chosen = true, small = false) => {
    const cls = [
      'd20',
      small ? 'd20-small' : '',
      chosen && landed ? 'd20-landed' : '',
      !landed ? 'd20-rolling' : '',
      chosen && isCrit ? 'd20-crit' : '',
      chosen && isFumble ? 'd20-fumble' : '',
      !chosen ? 'd20-discarded' : '',
    ].filter(Boolean).join(' ');
    const face = !landed && chosen ? displayRoll : value;
    return (
      <div className={cls} aria-label={`d20 showing ${face}`}>
        <span className="d20-face">{face}</span>
      </div>
    );
  };

  return (
    <div className="skill-check-roll panel">
      <div className="skill-check-label">{check.label || check.skillName || 'Skill Check'}</div>

      <div className="dice-row">
        {showMulti ? (
          rolls.map((r, i) => renderDie(r, r === natural, true))
        ) : (
          renderDie(natural, true, false)
        )}
      </div>

      {isAdvantage && landed && (
        <div className="roll-mode">
          {check.rollMode === 'disadvantage' ? 'Disadvantage' : 'Advantage'}
          {showMulti && ` — using ${natural}`}
        </div>
      )}

      {(phase === 'modifiers' || phase === 'result') && (
        <div className="roll-math">
          <span className="roll-natural">{natural}</span>
          <span className="roll-plus"> + </span>
          <span className="roll-mod">{check.modifierTotal >= 0 ? check.modifierTotal : `(${check.modifierTotal})`}</span>
          <span className="roll-eq"> = </span>
          <strong className="roll-total">{check.total}</strong>
          <span className="roll-vs"> vs DC </span>
          <strong>{check.dc}</strong>
        </div>
      )}

      {phase === 'result' && (
        <div className={`roll-outcome ${check.success ? 'roll-success' : 'roll-fail'}`}>
          {check.success ? 'Success' : 'Failure'}
          {isCrit && ' — Critical Success!'}
          {isFumble && ' — Charming Fumble'}
        </div>
      )}
    </div>
  );
}
