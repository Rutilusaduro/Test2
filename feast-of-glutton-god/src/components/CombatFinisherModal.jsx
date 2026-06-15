import { useState } from 'react';

export default function CombatFinisherModal({
  prompt,
  targetName,
  enemyCount = 1,
  onChoose,
}) {
  const [result, setResult] = useState(null);

  const pick = (choice) => {
    const prose = onChoose(choice);
    setResult({ choice, prose });
  };

  const title = result
    ? (result.choice === 'fatten' ? 'Immobilized' : 'Dispatch')
    : 'How do you end this?';

  return (
    <div className="combat-scene-overlay" role="dialog" aria-modal="true">
      <div className="panel panel--narration combat-scene-popup combat-finisher-modal">
        <h2>{title}</h2>
        {!result ? (
          <>
            <p className="prose">{prompt}</p>
            {enemyCount > 1 && (
              <p className="combat-finisher-modal__note">
                {enemyCount} foes await your verdict — the same fate for all.
              </p>
            )}
            <div className="combat-finisher-modal__choices">
              <button type="button" className="combat-finisher-modal__kill" onClick={() => pick('kill')}>
                <strong>Dispatch</strong>
                <span>End it — no conversion, no mercy.</span>
              </button>
              <button type="button" className="primary combat-finisher-modal__fatten" onClick={() => pick('fatten')}>
                <strong>Fatten to immobility</strong>
                <span>Swollen past standing — pinned, helpless, yours.</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {result.prose.split('\n\n').map((para, i) => (
              <p key={i} className="prose">{para}</p>
            ))}
            <button
              type="button"
              className="primary"
              onClick={() => onChoose(null, { done: true })}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
