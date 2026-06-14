export default function SpellSlotPips({ player, compact = false }) {
  const slots = player?.spellSlots;
  if (!slots?.max) return null;

  const rows = Array.from({ length: slots.max.length }, (_, idx) => idx + 1)
    .map((lvl) => {
      const max = slots.max[lvl - 1] ?? 0;
      if (max <= 0) return null;
      const cur = slots.current[lvl - 1] ?? 0;
      const isPact = slots.pact && slots.pactLevel === lvl;
      return { lvl, max, cur, isPact };
    })
    .filter(Boolean);

  if (!rows.length) {
    return <span className="spell-pips__cantrips">Cantrips only</span>;
  }

  return (
    <div className={`spell-pips${compact ? ' spell-pips--compact' : ''}`}>
      {rows.map(({ lvl, max, cur, isPact }) => (
        <div
          key={lvl}
          className={`spell-pips__row${isPact ? ' spell-pips__row--pact' : ''}`}
          title={isPact ? `Pact slots (Lv ${lvl})` : `Level ${lvl} slots`}
        >
          <span className="spell-pips__label">L{lvl}</span>
          <span className="spell-pips__dots" aria-label={`${cur} of ${max} level ${lvl} slots`}>
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                className={`pip ${i < cur ? 'pip--filled' : 'pip--empty'}`}
                aria-hidden
              >
                ●
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
