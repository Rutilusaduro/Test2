export default function DmBanner({ game, compact = false, onDismissEvent }) {
  const dm = game?.dm;
  if (!dm?.sceneLine && !dm?.eventLine) return null;

  return (
    <div className={`dm-banner${compact ? ' dm-banner--compact' : ''}`}>
      {dm.sceneLine && (
        <p className="dm-banner__scene prose">{dm.sceneLine}</p>
      )}
      {dm.eventLine && (
        <div className="dm-banner__event">
          <p className="prose">{dm.eventLine}</p>
          {onDismissEvent && (
            <button type="button" className="dm-banner__dismiss" onClick={onDismissEvent}>
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
