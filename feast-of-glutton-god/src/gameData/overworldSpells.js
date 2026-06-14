/**
 * Overworld spell casting — cast known spells on nearby NPCs outside combat.
 */
import { getSpell, getSpellForCast } from './spells.js';
import { getCharacterSpells } from './spellLearning.js';
import { hasSpellSlot, spendSpellSlot, recoverAllSpellSlots } from './spellSlots.js';
import { spendAP } from './player.js';
import { advanceStage, getStage } from './stages.js';
import { addCorruption } from './corruption.js';
import { awardRelationship, getGrowthStageBonus } from './relationships.js';
import { awardAbundanceSpread } from './abundanceSpread.js';
import { renderOverworldSpellCast } from '../textEngine/scenes/overworld/spellCast.js';
import { renderGrowthScene } from '../textEngine/scenes/growthEvent/index.js';
import { getStagePerk } from './stagePerks.js';

export function getOverworldCastableSpells(player) {
  return getCharacterSpells(player).filter((spell) => {
    if (spell.minSizeStage != null) {
      const stageId = getStage(player.lbs).id;
      if (stageId < spell.minSizeStage) return false;
    }
    return spell.effect?.growth || spell.effect?.feed || spell.effect?.charm
      || spell.effect?.corruption || spell.effect?.heal;
  });
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
    awardAbundanceSpread(game, 'overworld_spell_growth');
  }
  if (eff.feed && !eff.growth) {
    const startStage = getStage(npc.lbs).id;
    results.growth = advanceStage(npc, 1 + relBonus);
    results.growth.startStage = startStage;
    addCorruption(npc, 4);
    results.relationship = awardRelationship(npc, 'feed');
    awardAbundanceSpread(game, 'overworld_spell_growth');
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

  const target = { ...npc };
  const effects = applyOverworldSpellEffects(game, target, player, cost.spell);

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'ap') spendAP(game, cost.ap);

  const prose = renderOverworldSpellCast(target, player, {
    spell: cost.spell,
    overflow: opts.overflow,
    relationship: effects.relationship,
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

  const spread = awardAbundanceSpread(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';
  const perk = getStagePerk(player);

  return {
    ok: true,
    npc: target,
    text: `${prose}\n\n${growthText}${spreadNote}`.trim(),
    effects,
    spread,
    casterPerk: perk.label,
  };
}

export { recoverAllSpellSlots };
