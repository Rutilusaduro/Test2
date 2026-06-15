/**
 * Combat finisher — apply kill vs fatten-to-immobility after a won fight.
 */
import { getStage } from './stages.js';
import { advanceStageUniversal } from './growthPresentation.js';
import {
  FINISHER_IMMOBILE_STAGE,
  renderFinisherPrompt,
  renderFinisherOutcome,
} from '../textEngine/scenes/dm/combatFinisher.js';

export { FINISHER_IMMOBILE_STAGE };

export function getDownedEnemies(combat) {
  return (combat.enemies ?? []).filter((e) => e.hp <= 0 && !e.converted);
}

export function needsCombatFinisher(combat) {
  if (!combat?.victory || combat.victory !== 'win') return false;
  if (combat.finisherResolved) return false;
  return getDownedEnemies(combat).length > 0;
}

export function buildFinisherState(game, combat) {
  const targets = getDownedEnemies(combat);
  const primary = targets[0] ?? combat.enemies?.[0];
  if (!primary) return null;
  return {
    prompt: renderFinisherPrompt(game, primary),
    targetName: primary.name,
    targetId: primary.combatId || primary.id,
    enemyCount: targets.length,
  };
}

/**
 * @param {'kill'|'fatten'} choice
 */
export function applyCombatFinisher(game, combat, choice) {
  const targets = getDownedEnemies(combat);
  const paragraphs = [];

  for (const enemy of targets) {
    const startStage = getStage(enemy.lbs).id;
    let growth = { startStage, endStage: startStage, stagesJumped: 0 };

    if (choice === 'fatten') {
      const stagesNeeded = Math.max(0, FINISHER_IMMOBILE_STAGE - startStage);
      if (stagesNeeded > 0) {
        const result = advanceStageUniversal(enemy, stagesNeeded);
        growth = {
          startStage: result.startStage,
          endStage: result.endStage,
          stagesJumped: result.stagesJumped,
        };
        enemy.hp = Math.max(1, enemy.hp);
        enemy.finisherFattened = true;
      }
      addCorruptionFromFinisher(enemy, growth.stagesJumped);
    } else {
      enemy.hp = 0;
      enemy.finisherKilled = true;
    }

    const line = renderFinisherOutcome(game, enemy, choice, growth);
    if (line) paragraphs.push(line);
  }

  combat.finisherResolved = true;
  combat.finisherChoice = choice;
  combat.finisherProse = paragraphs.filter(Boolean).join('\n\n');
  combat.log.push(
    choice === 'fatten'
      ? '★ Fattened to immobility — trophies of abundance.'
      : '★ Dispatch — the threat ends here.',
  );

  return {
    combat,
    prose: combat.finisherProse,
    choice,
  };
}

function addCorruptionFromFinisher(enemy, stages) {
  if (!stages) return;
  enemy.corruption = Math.min(100, (enemy.corruption || 0) + 4 * stages);
}
