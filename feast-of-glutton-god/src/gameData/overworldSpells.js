/**
 * Overworld spell casting — cast known spells on nearby NPCs and environment features.
 */
import { getSpell, getSpellForCast, spellHasEnvironmentUse } from './spells.js';
import { hasSpellSlot, spendSpellSlot } from './spellSlots.js';
import { spendAP } from './player.js';
import { advanceStage, getStage } from './stages.js';
import { addCorruption } from './corruption.js';
import { awardRelationship, getGrowthStageBonus } from './relationships.js';
import { getPreparedSpells, isSpellPrepared } from './spellPreparation.js';
import { awardAbundanceSpreadWithEvents } from './worldEvents.js';
import { renderOverworldSpellCast } from '../textEngine/scenes/overworld/spellCast.js';
import { renderGrowthScene } from '../textEngine/scenes/growthEvent/index.js';
import { getStagePerk } from './stagePerks.js';
import { getFeature } from './regionFeatures.js';
import {
  getSpellSolutionsForFeature,
  trySpellSolveFeature,
} from './puzzleEngine.js';
import { renderPuzzleText } from '../textEngine/scenes/puzzles/index.js';
import { getCombinedPuzzleBonuses } from './worldAuras.js';

export function getOverworldCastableSpells(player) {
  return getPreparedSpells(player).filter((spell) => {
    if (!isSpellPrepared(player, spell.id)) return false;
    if (spell.minSizeStage != null) {
      const stageId = getStage(player.lbs).id;
      if (stageId < spell.minSizeStage) return false;
    }
    return spell.effect?.growth || spell.effect?.feed || spell.effect?.charm
      || spell.effect?.corruption || spell.effect?.heal || spellHasEnvironmentUse(spell);
  });
}

export function getOverworldEnvironmentSpells(player) {
  return getOverworldCastableSpells(player).filter(spellHasEnvironmentUse);
}

function resolveOverworldCost(player, spell, overflow) {
  const castData = getSpellForCast(spell, overflow);
  if (castData.slotLevel === 0) return { ok: true, method: 'cantrip', spell: castData };
  if (hasSpellSlot(player, castData.slotLevel)) {
    return { ok: true, method: 'slot', spell: castData, slotLevel: castData.slotLevel };
  }
  const ap = castData.apCost ?? castData.slotLevel * 5;
  if ((player.ap || 0) >= ap) {
    return { ok: true, method: 'ap', spell: castData, ap };
  }
  return { ok: false, reason: 'No spell slots or Abundance Points available.' };
}

function applyOverworldSpellEffects(game, npc, player, spell) {
  const eff = spell.effect || {};
  const relBonus = getGrowthStageBonus(npc, 'spell');
  const results = { growth: null, relationship: null, corruption: 0 };

  if (eff.growth) {
    const stages = (eff.growth || 0) + relBonus;
    const startStage = getStage(npc.lbs).id;
    results.growth = advanceStage(npc, stages);
    results.growth.startStage = startStage;
    addCorruption(npc, 3 * stages);
    results.relationship = awardRelationship(npc, 'spell_bless', 4 + stages);
    awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  }
  if (eff.feed && !eff.growth) {
    const startStage = getStage(npc.lbs).id;
    results.growth = advanceStage(npc, 1 + relBonus);
    results.growth.startStage = startStage;
    addCorruption(npc, 4);
    results.relationship = awardRelationship(npc, 'feed');
    awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  }
  if (eff.corruption) addCorruption(npc, eff.corruption);
  if (eff.charm) {
    addCorruption(npc, 5);
    npc.hunger = Math.min(100, (npc.hunger || 0) + 20);
    results.relationship = awardRelationship(npc, 'flirt_success', 3);
  }

  return results;
}

/**
 * Cast a spell on an NPC in the overworld.
 * @param {object} game
 * @param {object} npc
 * @param {string} spellId
 * @param {{ overflow?: boolean }} opts
 */
export function castSpellOnNpc(game, npc, spellId, opts = {}) {
  const player = game.player;
  const spell = getSpell(spellId);
  if (!spell) return { ok: false, text: 'Unknown spell.' };

  if (spell.minSizeStage != null && getStage(player.lbs).id < spell.minSizeStage) {
    return { ok: false, text: `You must reach size stage ${spell.minSizeStage} to wield ${spell.name}.` };
  }

  const cost = resolveOverworldCost(player, spell, opts.overflow);
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
    return { ok: false, text: `${spell.name} is not prepared. Prepare it after your next rest.` };
  }

  const target = { ...npc };
  const effects = applyOverworldSpellEffects(game, target, player, cost.spell);

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'ap') spendAP(game, cost.ap);

  const prose = renderOverworldSpellCast(target, player, {
    spell: cost.spell,
    overflow: opts.overflow,
    relationship: effects.relationship,
    growth: effects.growth,
  });

  let growthText = '';
  if (effects.growth?.stagesJumped > 0) {
    growthText = renderGrowthScene(target, {
      growthMethod: 'spell',
      startStage: effects.growth.startStage,
      endStage: effects.growth.endStage,
      week: game.day,
    });
  }

  const spread = awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';
  const eventNote = spread.worldEvent?.triggered ? `\n\n${spread.worldEvent.message}` : '';
  const perk = getStagePerk(player);

  return {
    ok: true,
    npc: target,
    text: `${prose}\n\n${growthText}${spreadNote}${eventNote}`.trim(),
    effects,
    spread,
    casterPerk: perk.label,
  };
}

/**
 * Cast a spell on an environmental feature in the overworld.
 */
export function castSpellOnFeature(game, featureId, spellId, opts = {}) {
  const player = game.player;
  const feature = getFeature(featureId);
  if (!feature) return { ok: false, text: 'Nothing to cast upon here.' };
  if (feature.regionId !== game.region) {
    return { ok: false, text: 'That place is not in this region.' };
  }

  const spell = getSpell(spellId);
  if (!spell) return { ok: false, text: 'Unknown spell.' };

  if (spell.minSizeStage != null && getStage(player.lbs).id < spell.minSizeStage) {
    return { ok: false, text: `You must reach size stage ${spell.minSizeStage} to wield ${spell.name}.` };
  }

  const cost = resolveOverworldCost(player, spell, opts.overflow);
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
    return { ok: false, text: `${spell.name} is not prepared. Prepare it after your next rest.` };
  }

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'ap') spendAP(game, cost.ap);

  const auraBonus = getCombinedPuzzleBonuses(game, game.region);
  const puzzleSolutions = getSpellSolutionsForFeature(game, featureId, spellId);
  const puzzleSolve = puzzleSolutions.length
    ? trySpellSolveFeature(game, featureId, spellId)
    : null;

  const envProse = renderPuzzleText('puzzle.spell_cast.environment', game, {
    globals: {
      spellName: cost.spell.name,
      featureName: feature.name,
      auraLabel: auraBonus.auraLabel,
      solved: Boolean(puzzleSolve?.solved),
    },
  });

  const spread = awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';

  let text = envProse;
  if (puzzleSolve?.solved) {
    text = `${envProse}\n\n---\n\n${puzzleSolve.text}`;
  } else if (!puzzleSolutions.length) {
    text += '\n\nYour magic washes over the place — abundance lingers sweetly, though another approach may still be needed.';
  }

  return {
    ok: true,
    text: `${text}${spreadNote}`.trim(),
    feature,
    puzzleSolve,
    spread,
    spell: cost.spell,
  };
}
