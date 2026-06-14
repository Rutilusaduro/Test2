/**
 * NPC growth pipeline — consent, satiation, penalties, and narrative globals.
 * Combat enemy growth is exempt (callers skip this module).
 */
import { getStage } from './stages.js';
import { getGrowthStageBonus } from './relationships.js';
import { reduceRelationship } from './relationships.js';
import { addGainDesire } from './gainDesire.js';
import {
  evaluateGrowthConsent,
  applyForcedGrowthPenalties,
} from './consent.js';
import {
  evaluateSatiation,
  applySatiationFromGrowth,
} from './satiation.js';
import { applyGrowthWithPresentation } from './growthPresentation.js';
import { awardFatteningXp } from './leveling.js';
import { syncGateUnlocks } from './regionObstacles.js';
import { renderForcedGrowth } from '../textEngine/scenes/npc/consentGrowth.js';
import { renderSatiationRefusal } from '../textEngine/scenes/npc/satiation.js';

/**
 * Apply growth to an NPC/companion with consent + satiation rules.
 * @returns growth result bundle (may include refused: true)
 */
export function applyNpcGrowth(npc, game, baseStages, method = 'feed', opts = {}) {
  const bonus = getGrowthStageBonus(npc, method);
  const requestedStages = baseStages + bonus;
  const startStage = getStage(npc.lbs).id;

  const sat = evaluateSatiation(npc, game, requestedStages);
  if (sat.refused) {
    return {
      refused: true,
      satiationRefused: true,
      satiation: sat,
      text: renderSatiationRefusal(npc, game?.player, {
        tier: sat.tier,
        history: opts.history,
      }),
      stagesJumped: 0,
      startStage,
      endStage: startStage,
      bonusStages: bonus,
    };
  }

  let stages = sat.diminishedStages;
  const consent = evaluateGrowthConsent(npc, stages);
  const appliedStages = consent.appliedStages;

  let presentation = { stagesJumped: 0, startStage, endStage: startStage, text: '' };
  if (appliedStages > 0) {
    presentation = applyGrowthWithPresentation(npc, game, appliedStages, {
      growthMethod: method,
      raisedBy: 'player',
      consentState: consent.consentState,
      severity: consent.severity,
    });
  }

  if (presentation.stagesJumped > 0) {
    applySatiationFromGrowth(npc, game, presentation.stagesJumped);
  }

  if (sat.relDip > 0) reduceRelationship(npc, sat.relDip);

  if (consent.overreach > 0) {
    applyForcedGrowthPenalties(game, npc, consent, game?.region);
    const forcedText = renderForcedGrowth(npc, game?.player, {
      method,
      severity: consent.severity,
      overreach: consent.overreach,
      history: opts.history,
    });
    presentation.text = [forcedText, presentation.text].filter(Boolean).join('\n\n');
  } else if (presentation.stagesJumped > 0) {
    addGainDesire(npc, 2 + presentation.stagesJumped);
  }

  const gateMsgs = syncGateUnlocks(game, { regionId: game?.region });
  let fattenXp = null;
  if (game?.player && presentation.stagesJumped > 0) {
    fattenXp = awardFatteningXp(game.player, presentation.stagesJumped, method);
  }

  return {
    ...presentation,
    startStage: presentation.startStage ?? startStage,
    bonusStages: bonus,
    requestedStages,
    consent,
    satiation: sat,
    gateMsgs,
    fattenXp,
    consentState: consent.consentState,
    severity: consent.severity,
  };
}
