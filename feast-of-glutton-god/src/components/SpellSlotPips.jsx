import { getCreationGiftLabel } from "../gameData/creationGift.js";

export default function SpellSlotPips({ player, compact = false }) {
  const slots = player?.spellSlots;
  const gift = getCreationGiftLabel(player);
  if (!gift && !slots?.max) return null;

  const rows = slots?.max
    ? Array.from({ length: slots.max.length }, (_, idx) => idx + 1)
    .map((lvl) => {
      const max = slots.max[lvl - 1] ?? 0;
      if (max <= 0) return null;
      const cur = slots.current[lvl - 1] ?? 0;
      const isPact = slots.pact && slots.pactLevel === lvl;
      return { lvl, max, cur, isPact };
    })
    .filter(Boolean)
    : [];

  if (!rows.length && !gift) {
    return <span className="spell-pips__cantrips">Cantrips only</span>;
  }

  return (
    <div className={`spell-pips${compact ? ' spell-pips--compact' : ''}`}>
      {gift && (
        <div className="spell-pips__row spell-pips__row--gift" title={`${gift.name} — free casts per long rest`}>
          <span className="spell-pips__label">Gift</span>
          <span className="spell-pips__dots" aria-label={`${gift.usesRemaining} of ${gift.maxUses} gift casts`}>
            {Array.from({ length: gift.maxUses }, (_, i) => (
              <span
                key={i}
                className={`pip ${i < gift.usesRemaining ? 'pip--filled pip--gift' : 'pip--empty'}`}
                aria-hidden
              >
                ✦
              </span>
            ))}
          </span>
          {!compact && (
            <span className="spell-pips__gift-name">{gift.name}</span>
          )}
        </div>
      )}
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
