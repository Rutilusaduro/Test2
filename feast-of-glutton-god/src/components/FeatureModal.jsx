import { useState } from 'react';
import {
  examineFeature,
  getAvailableSolutions,
  attemptSolution,
  completeSolutionAfterCheck,
  isPuzzleSolved,
} from '../gameData/puzzleEngine.js';
import {
  recordPuzzleSolvedForQuests,
  recordFeatureExaminedForQuests,
} from '../hooks/puzzleHooks.js';
import { getPuzzleCapabilities } from '../gameData/stagePerks.js';
import { getCombinedPuzzleBonuses } from '../gameData/worldAuras.js';
import SkillCheckRoll from './SkillCheckRoll.jsx';

export default function FeatureModal({
  feature,
  game,
  onClose,
  onGameUpdate,
  onDebugContext,
  onStartPuzzleCombat,
}) {
  const [text, setText] = useState('');
  const [activeCheck, setActiveCheck] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [examined, setExamined] = useState(false);

  const puzzle = feature.puzzle;
  const solved = puzzle ? isPuzzleSolved(game, puzzle.id) : false;
  const solutions = puzzle ? getAvailableSolutions(game, puzzle.id) : [];
  const perks = getPuzzleCapabilities(game.player);
  const aura = getCombinedPuzzleBonuses(game, game.region);

  const handleExamine = () => {
    const res = examineFeature(game, feature.id);
    setText(res.text || '');
    setExamined(true);
    const quest = recordFeatureExaminedForQuests(game, { featureId: feature.id });
    if (quest.questMessages) {
      onGameUpdate?.((g) => ({ ...g, lastQuestMessage: quest.questMessages }));
    }
    onDebugContext?.({ feature, region: game.region, interaction: 'feature_examine' });
  };

  const finishSolution = (result) => {
    if (result.solved) {
      const quest = recordPuzzleSolvedForQuests(game, {
        puzzleId: result.puzzleId,
        solutionId: result.solutionId,
      });
      onGameUpdate?.((g) => ({
        ...g,
        lastQuestMessage: quest.questMessages || g.lastQuestMessage,
      }));
    }
    setText(result.text || '');
    onDebugContext?.({
      feature,
      region: game.region,
      interaction: 'puzzle_solution',
      puzzleId: result.puzzleId,
      solved: result.solved,
    });
  };

  const handleAttempt = (solutionId) => {
    const res = attemptSolution(game, puzzle.id, solutionId);
    if (!res.ok) {
      setText(res.text);
      return;
    }
    if (res.needsCombat) {
      setText(res.narrative || 'Steel yourself — abundance can be won by appetite and strength alike.');
      onStartPuzzleCombat?.({
        puzzleId: res.puzzleId,
        solutionId: res.solutionId,
        enemyId: res.enemyId,
        featureId: res.featureId ?? feature.id,
      });
      return;
    }
    if (res.needsCheck) {
      setActiveCheck(res.check);
      setPendingResult({ puzzleId: res.puzzleId, solutionId: res.solutionId });
      setText(res.narrative || '');
      return;
    }
    finishSolution(res);
  };

  const handleRollComplete = () => {
    if (!pendingResult || !activeCheck) return;
    const res = completeSolutionAfterCheck(
      game,
      pendingResult.puzzleId,
      pendingResult.solutionId,
      activeCheck,
    );
    finishSolution(res);
    setActiveCheck(null);
    setPendingResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{feature.icon} {feature.name}</h2>
        <p className="prose" style={{ fontSize: '0.9rem' }}>{feature.shortDesc}</p>

        {puzzle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            {solved ? '✦ Solved' : `Mystery: ${puzzle.title}`}
            {aura.auraLabel && ` · ${aura.auraLabel} aids you here`}
            {perks.skillBonus > 0 && ` · Size presence +${perks.skillBonus} to checks`}
          </div>
        )}

        {activeCheck && (
          <SkillCheckRoll check={activeCheck} onComplete={handleRollComplete} />
        )}

        {text && !activeCheck && (
          <div className="panel prose" style={{ marginTop: '1rem' }}>
            {text}
          </div>
        )}

        {!activeCheck && (
          <div className="modal-actions">
            {!examined && (
              <button className="primary" onClick={handleExamine}>
                Examine closely
              </button>
            )}

            {examined && !solved && solutions.map((sol) => (
              <button
                key={sol.id}
                disabled={!sol.available}
                title={sol.hint || undefined}
                onClick={() => handleAttempt(sol.id)}
              >
                {sol.label}
                {sol.apCost ? ` (${sol.apCost} AP)` : ''}
                {!sol.available && sol.hint ? ` — ${sol.hint}` : ''}
              </button>
            ))}

            <button onClick={onClose}>Leave</button>
          </div>
        )}
      </div>
    </div>
  );
}
