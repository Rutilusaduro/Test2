export default function CombatScenePopup({
  variant = 'intro',
  prose,
  onContinue,
}) {
  const title = variant === 'outro' ? 'Aftermath' : 'Encounter';
  const buttonLabel = variant === 'outro' ? 'Continue' : 'Begin';

  return (
    <div className="combat-scene-overlay" role="dialog" aria-modal="true" aria-labelledby="combat-scene-title">
      <div className="panel panel--narration combat-scene-popup">
        <h2 id="combat-scene-title">{title}</h2>
        {prose.split('\n\n').map((para, i) => (
          <p key={i} className="prose">{para}</p>
        ))}
        <button type="button" className="primary" onClick={onContinue}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
