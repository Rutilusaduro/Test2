import { buildSpellDetail } from '../gameData/spellDetails.js';

export default function SpellDetailCard({
  spell,
  player = null,
  overflowCast = false,
  compact = false,
  onClose = null,
  onCast = null,
  castDisabled = false,
  castLabel = 'Cast',
}) {
  const detail = buildSpellDetail(spell, player, { overflow: overflowCast });
  if (!detail) return null;

  const levelLabel = detail.slotLevel === 0 ? 'Cantrip' : `Level ${detail.slotLevel}`;

  return (
    <div className={`spell-detail-card${compact ? ' spell-detail-card--compact' : ''}`}>
      <div className="spell-detail-card__header">
        <div>
          <h3 className="spell-detail-card__title">
            {detail.growth ? '✦ ' : ''}{detail.name}
          </h3>
          <p className="spell-detail-card__meta">
            {levelLabel} · {detail.school} · {detail.actionType}
            {detail.ritual ? ' · Ritual' : ''}
          </p>
        </div>
        {onClose && (
          <button type="button" className="spell-detail-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>

      <p className="spell-detail-card__desc">{detail.desc}</p>

      {detail.mechanics.length > 0 && (
        <ul className="spell-detail-card__mechanics">
          {detail.mechanics.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      <div className="spell-detail-card__facts">
        <span><strong>Target:</strong> {detail.targeting}</span>
        {detail.rangeSummary !== 'Self' && (
          <span><strong>Range:</strong> {detail.rangeSummary}</span>
        )}
        <span><strong>Cost:</strong> {detail.cost}</span>
        {detail.ritual && detail.ritualAp != null && (
          <span><strong>Ritual:</strong> {detail.ritualAp} AP when cast as ritual</span>
        )}
        {detail.minSizeStage != null && (
          <span><strong>Requires:</strong> size stage {detail.minSizeStage}+</span>
        )}
        {detail.environment.length > 0 && (
          <span><strong>Overworld:</strong> {detail.environment.join(', ')}</span>
        )}
      </div>

      {detail.overflow && (
        <p className="spell-detail-card__overflow">
          <strong>Overflow:</strong> {detail.overflow.name}
          {detail.overflow.apCost ? ` — ${detail.overflow.apCost} AP` : ''}
        </p>
      )}

      {onCast && (
        <button
          type="button"
          className="primary spell-detail-card__cast"
          onClick={onCast}
          disabled={castDisabled}
        >
          {castLabel}
        </button>
      )}
    </div>
  );
}
