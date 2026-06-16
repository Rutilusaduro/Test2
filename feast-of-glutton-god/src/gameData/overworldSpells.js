/**
 * Overworld spell casting — cast known spells on nearby NPCs and environment features.
 */
import { getSpell, getSpellForCast, spellHasEnvironmentUse, getSpellEnvironmentTags, isRitualSpell, getRitualApCost } from './spells.js';
import { hasSpellSlot, spendSpellSlot } from './spellSlots.js';
import { spendAP } from './player.js';
import { addCorruption } from './corruption.js';
import { awardRelationship } from './relationships.js';
import { getPreparedSpells, isSpellPrepared } from './spellPreparation.js';
import { canUseCreationGift, spendCreationGiftUse } from './creationGift.js';
import { awardAbundanceSpreadWithEvents } from './worldEvents.js';
import { renderOverworldSpellCast } from '../textEngine/scenes/overworld/spellCast.js';
import { applyNpcGrowth } from './npcGrowth.js';
import { awardFatteningXp } from './leveling.js';
import { getStage } from './stages.js';
import { getStagePerk } from './stagePerks.js';
import { getFeature } from './regionFeatures.js';
import {
  getSpellSolutionsForFeature,
  trySpellSolveFeature,
} from './puzzleEngine.js';
import { renderPuzzleText } from '../textEngine/scenes/puzzles/index.js';
import { getCombinedPuzzleBonuses } from './worldAuras.js';
import { CONNECTION_GATES, syncGateUnlocks } from './regionObstacles.js';
import { tryClearObstacle } from './obstacleUnlocks.js';
import { recordGorgaraManifestCast } from './worldTransformation.js';
import { getEffectiveSpellApCost } from './endingEcho.js';
import {
  getSpellGrowthFavorCost,
  canSpendFavor,
  spendFavor,
  getFavorRefusalText,
} from './favor.js';

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

export function getRitualCastableSpells(player) {
  return getPreparedSpells(player).filter((spell) => {
    if (!isSpellPrepared(player, spell.id)) return false;
    if (!isRitualSpell(spell)) return false;
    if (spell.minSizeStage != null && getStage(player.lbs).id < spell.minSizeStage) return false;
    return true;
  });
}

function resolveOverworldCost(player, spell, overflow, opts = {}) {
  const castData = getSpellForCast(spell, overflow);
  if (castData.slotLevel === 0) return { ok: true, method: 'cantrip', spell: castData };
  if (!overflow && canUseCreationGift(player, castData.id, { overflow })) {
    return { ok: true, method: 'gift', spell: castData };
  }
  const ritual = opts.ritual && isRitualSpell(castData);
  if (ritual) {
    const ap = getEffectiveSpellApCost(opts.game, castData.id, getRitualApCost(castData));
    if ((player.ap || 0) >= ap) {
      return { ok: true, method: 'ritual', spell: castData, ap };
    }
    return { ok: false, reason: 'Not enough AP for ritual cast.' };
  }
  if (hasSpellSlot(player, castData.slotLevel)) {
    return { ok: true, method: 'slot', spell: castData, slotLevel: castData.slotLevel };
  }
  const ap = getEffectiveSpellApCost(
    opts.game,
    castData.id,
    castData.apCost ?? castData.slotLevel * 5,
  );
  if ((player.ap || 0) >= ap) {
    return { ok: true, method: 'ap', spell: castData, ap };
  }
  return { ok: false, reason: 'No spell slots or Abundance Points available.' };
}

function applyOverworldSpellEffects(game, npc, player, spell) {
  const eff = spell.effect || {};
  const results = { growth: null, relationship: null, corruption: 0 };

  if (eff.growth) {
    const stages = eff.growth || 0;
    const growth = applyNpcGrowth(npc, game, stages, 'spell');
    results.growth = growth;
    if (growth.stagesJumped > 0) {
      results.fattenXp = awardFatteningXp(player, growth.stagesJumped, 'overworld_spell');
    }
    if (growth.consentState !== 'forced') {
      addCorruption(npc, 3 * stages);
      results.relationship = awardRelationship(npc, 'spell_bless', 4 + stages);
    }
    if (growth.stagesJumped > 0) {
      awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
    }
  }
  if (eff.feed && !eff.growth) {
    const growth = applyNpcGrowth(npc, game, 1, 'feed');
    results.growth = growth;
    if (growth.stagesJumped > 0) {
      results.fattenXp = awardFatteningXp(player, growth.stagesJumped, 'overworld_feed');
    }
    if (growth.consentState !== 'forced') {
      addCorruption(npc, 4);
      results.relationship = awardRelationship(npc, 'feed');
    }
    if (growth.stagesJumped > 0) {
      awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
    }
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

  const cost = resolveOverworldCost(player, spell, opts.overflow, { ...opts, game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
    return { ok: false, text: `${spell.name} is not prepared. Prepare it after your next rest.` };
  }

  const eff = spell.effect || {};
  if (eff.growth) {
    const favorCost = getSpellGrowthFavorCost(eff.growth);
    if (!canSpendFavor(player, favorCost)) {
      return { ok: false, text: getFavorRefusalText(player, game, 'growth') };
    }
  } else if (eff.feed && !eff.growth) {
    if (!canSpendFavor(player, 1)) {
      return { ok: false, text: getFavorRefusalText(player, game, 'growth') };
    }
  }

  const target = { ...npc };
  const effects = applyOverworldSpellEffects(game, target, player, cost.spell);

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'gift') spendCreationGiftUse(player, cost.spell.id);
  else if (cost.method === 'ap' || cost.method === 'ritual') spendAP(game, cost.ap);

  if (effects.growth && !effects.growth.favorRefused) {
    const stages = eff.growth || (eff.feed ? 1 : 0);
    if (stages > 0 && (effects.growth.stagesJumped > 0 || !effects.growth.refused)) {
      spendFavor(player, getSpellGrowthFavorCost(stages));
    }
  }

  const prose = renderOverworldSpellCast(target, player, {
    spell: cost.spell,
    overflow: opts.overflow,
    relationship: effects.relationship,
    growth: effects.growth,
  });

  let growthText = '';
  if (effects.growth?.stagesJumped > 0) {
    growthText = effects.growth.text || '';
  }

  const spread = awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';
  const eventNote = spread.worldEvent?.triggered ? `\n\n${spread.worldEvent.message}` : '';
  const perk = getStagePerk(player);
  const manifestNote = recordGorgaraManifestCast(game, spellId)
    ? '\n\n✦ The Fat Goddess manifests in the cradle — the Thin Veil will never be thin again.'
    : '';
  const ritualNote = cost.method === 'ritual'
    ? '\n\n✦ Ritual complete — abundance lingers without spending a spell slot.'
    : cost.method === 'gift'
      ? '\n\n✦ Divine gift — no slot or AP spent.'
      : '';

  return {
    ok: true,
    npc: target,
    text: `${prose}\n\n${growthText}${spreadNote}${eventNote}${manifestNote}${ritualNote}`.trim(),
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

  const cost = resolveOverworldCost(player, spell, opts.overflow, { ...opts, game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
    return { ok: false, text: `${spell.name} is not prepared. Prepare it after your next rest.` };
  }

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'gift') spendCreationGiftUse(player, cost.spell.id);
  else if (cost.method === 'ap' || cost.method === 'ritual') spendAP(game, cost.ap);

  const auraBonus = getCombinedPuzzleBonuses(game, game.region);
  const puzzleSolutions = getSpellSolutionsForFeature(game, featureId, spellId, { overflow: opts.overflow });
  const puzzleSolve = puzzleSolutions.length
    ? trySpellSolveFeature(game, featureId, spellId, { overflow: opts.overflow })
    : null;

  const gateMessages = tryUnlockGatesWithSpell(game, spellId, { overflow: opts.overflow });

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
  if (gateMessages.length) {
    text += `\n\n${gateMessages.join('\n\n')}`;
  }
  const manifestNote = recordGorgaraManifestCast(game, spellId)
    ? '\n\n✦ The Fat Goddess manifests in the cradle — the Thin Veil will never be thin again.'
    : '';

  return {
    ok: true,
    text: `${text}${spreadNote}${manifestNote}`.trim(),
    feature,
    puzzleSolve,
    spread,
    spell: cost.spell,
    gateUnlocked: gateMessages.length > 0,
  };
}

/** Try environment-tagged spells against travel gates in the current region. */
export function tryUnlockGatesWithSpell(game, spellId, opts = {}) {
  const spell = getSpell(spellId);
  if (!spell) return [];
  const tags = getSpellEnvironmentTags(spell);
  if (!tags.length && !spellHasEnvironmentUse(spell)) return [];

  const messages = [];
  for (const gate of CONNECTION_GATES) {
    if (gate.from !== game.region) continue;
    const match = (gate.unlocks ?? []).some((u) => {
      const method = typeof u === 'string' ? u : u.method;
      if (method !== 'cast_spell') return false;
      const need = u.tags ?? [];
      return need.some((t) => tags.includes(t));
    });
    if (!match) continue;
    const result = tryClearObstacle(game, gate, { spellId, regionId: game.region, overflow: opts.overflow });
    if (result?.message) messages.push(result.message);
    else if (result) messages.push(gate.clearMessage ?? `✦ ${gate.blockedText.split('—')[0].trim()} yields to your magic.`);
  }
  syncGateUnlocks(game, { spellId, regionId: game.region });
  return messages.filter(Boolean);
}
