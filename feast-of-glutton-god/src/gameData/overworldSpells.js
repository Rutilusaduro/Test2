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
import {
  applyIndulgenceState,
  hasIndulgenceState,
  getIndulgenceState,
  removeIndulgenceState,
  applyAreaState,
  resolveStateInteractions,
  getStateContextGlobals,
} from './arcaneStates.js';
import {
  getBackgroundPopulation,
  affectBackgroundPop,
  observeBackgroundPop,
  getBackgroundTargets,
  DENSITY_MAX_TARGETS,
} from './backgroundPopulation.js';
import { awardRegionTransformation } from './worldTransformation.js';
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
    // Debug unlock bypasses size-stage gate
    if (!player.debugAllSpellsUnlocked && spell.minSizeStage != null) {
      const stageId = getStage(player.lbs).id;
      if (stageId < spell.minSizeStage) return false;
    }
    return player.debugAllSpellsUnlocked
      || spell.effect?.growth || spell.effect?.feed || spell.effect?.charm
      || spell.effect?.corruption || spell.effect?.heal || spellHasEnvironmentUse(spell)
      || spell.createsStates?.length > 0;
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
  if (player.debugAllSpellsUnlocked) return { ok: true, method: 'free', spell: castData };
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

  if (!player.debugAllSpellsUnlocked && spell.minSizeStage != null && getStage(player.lbs).id < spell.minSizeStage) {
    return { ok: false, text: `You must reach size stage ${spell.minSizeStage} to wield ${spell.name}.` };
  }

  const cost = resolveOverworldCost(player, spell, opts.overflow, { ...opts, game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (!player.debugAllSpellsUnlocked && player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
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

  // ── Phase 1 utility spells: special mechanics handled here ──────────────
  const utilityResult = resolveUtilitySpellOnNpc(game, npc, cost.spell, player, opts);
  if (utilityResult) {
    if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
    else if (cost.method === 'gift') spendCreationGiftUse(player, cost.spell.id);
    else if (cost.method === 'ap' || cost.method === 'ritual') spendAP(game, cost.ap);
    return utilityResult;
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

  // ── Resolve state interactions (combos) after direct effects ────────────
  const comboResult = resolveStateInteractions(game, player, cost.spell, [target], game.region);
  for (const combo of comboResult.combos) {
    if (combo.effect?.growth && combo.effect.growth > 0) {
      const comboGrowth = applyNpcGrowth(target, game, combo.effect.growth, 'combo');
      if (comboGrowth.stagesJumped > 0) {
        effects.comboGrowth = (effects.comboGrowth || 0) + comboGrowth.stagesJumped;
        awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
      }
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
  const comboNote = comboResult.lines.length ? `\n\n${comboResult.lines.join('\n')}` : '';

  return {
    ok: true,
    npc: target,
    text: `${prose}\n\n${growthText}${spreadNote}${eventNote}${manifestNote}${ritualNote}${comboNote}`.trim(),
    effects,
    spread,
    casterPerk: perk.label,
    combos: comboResult.combos,
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

  if (!player.debugAllSpellsUnlocked && spell.minSizeStage != null && getStage(player.lbs).id < spell.minSizeStage) {
    return { ok: false, text: `You must reach size stage ${spell.minSizeStage} to wield ${spell.name}.` };
  }

  const cost = resolveOverworldCost(player, spell, opts.overflow, { ...opts, game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (!player.debugAllSpellsUnlocked && player.classId === 'wizard' && !isSpellPrepared(player, spellId)) {
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

// ─── Phase 1 Utility Spell Handlers ─────────────────────────────────────────

/**
 * Resolve special mechanics for the 5 Phase 1 utility spells when cast on an NPC.
 * Returns a full result object if the spell was handled here, or null to fall through
 * to the generic growth/feed handler.
 */
function resolveUtilitySpellOnNpc(game, npc, spell, player, opts = {}) {
  switch (spell.id) {

    case 'mage_hand': {
      // Apply state to caster's location; also attempt remote feeding on the NPC
      applyIndulgenceState(player, 'mage_hand_active', {
        properties: { targetId: npc.id ?? npc.characterId },
        appliedBy: 'player',
        appliedAt: game.day ?? null,
      });

      // If the NPC already has a bound_calorie_transfer on them, this triggers it
      const bond = getIndulgenceState(npc, 'bound_calorie_transfer');
      const remoteFeed = bond && bond.properties.feedCount < (bond.properties.maxFeeds ?? 3);
      let feedText = '';
      let feedGrowth = null;

      if (remoteFeed) {
        bond.properties.feedCount = (bond.properties.feedCount || 0) + 1;
        const linkedId = bond.properties.transferTarget ?? npc.id;
        feedGrowth = applyNpcGrowth(npc, game, 1, 'spell');
        feedText = `\n\n✦ Your Mage Hand activates the Calorie Bond — magical feeding transfers to ${npc.name}.`;
        if (feedGrowth.stagesJumped > 0) awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
      }

      const stateCtx = getStateContextGlobals(npc);
      const actionDesc = stateCtx.isRestrained
        ? `Your spectral hand hovers near ${npc.name} — restrained as ${npc.name.split(' ')[0]} is, feeding is effortless and inescapable.`
        : `A shimmering spectral hand materializes, curling around a morsel before drifting toward ${npc.name} with unhurried purpose.`;

      return {
        ok: true,
        npc,
        text: `${actionDesc}${feedText}`.trim(),
        effects: { feedGrowth },
        stateApplied: 'mage_hand_active',
      };
    }

    case 'magic_mouth': {
      // Bind the NPC as the transfer target on a nearby object/feature
      // The "object" is conceptual — we apply the state to the NPC as a linked person
      applyIndulgenceState(npc, 'bound_calorie_transfer', {
        properties: {
          transferTarget: npc.id ?? npc.characterId ?? npc.name,
          feedCount: 0,
        },
        appliedBy: 'player',
        appliedAt: game.day ?? null,
      });

      return {
        ok: true,
        npc,
        text: `You whisper the binding words over the nearest food source. An arcane mouth forms on its surface — from now until you rest, any calories fed to it flow directly to ${npc.name}.\n\n✦ Calorie Bond established on ${npc.name} (lasts until long rest).`,
        effects: {},
        stateApplied: 'bound_calorie_transfer',
      };
    }

    case 'suggestion': {
      // Plant a suggestion on the NPC
      const isRestrained = hasIndulgenceState(npc, 'quicksand_restrained')
        || hasIndulgenceState(npc, 'restrained');
      const baseGrowth = isRestrained ? 2 : 1;
      const suggestionText = opts.suggestionText
        ?? 'You feel incredibly hungry — seek the nearest rich food and eat until you can barely move.';

      applyIndulgenceState(npc, 'suggestion_active', {
        properties: {
          suggestionText,
          dc: 14,
          growthOnResolve: baseGrowth,
          resolved: false,
        },
        appliedBy: 'player',
        appliedAt: game.day ?? null,
      });

      addCorruption(npc, 4);

      const restraintNote = isRestrained
        ? ` With ${npc.name} unable to flee, the suggestion bites deep — the compulsion will trigger with enhanced force (+${baseGrowth} stage${baseGrowth > 1 ? 's' : ''}).`
        : '';

      return {
        ok: true,
        npc,
        text: `You lean close and murmur your intention into ${npc.name}'s ear. The enchantment settles like honey — subtle, warm, irresistible. "${suggestionText}"${restraintNote}\n\n✦ Suggestion planted. Resolves when ${npc.name} encounters food or on next time trigger.`,
        effects: {},
        stateApplied: 'suggestion_active',
      };
    }

    case 'quicksand': {
      // Restrain the NPC in quicksand
      applyIndulgenceState(npc, 'quicksand_restrained', {
        properties: { pullDepth: 'waist' },
        appliedBy: 'player',
        appliedAt: game.day ?? null,
      });

      const hasSuggestion = hasIndulgenceState(npc, 'suggestion_active');
      const comboHint = hasSuggestion
        ? `\n\n✦ Combo ready — ${npc.name} is both restrained and suggested. Any further spell will trigger both effects with bonus growth.`
        : `\n\n✦ ${npc.name} is Quicksand Trapped (until long rest). Suggestion or feeding magic now gains a significant bonus.`;

      return {
        ok: true,
        npc,
        text: `The ground beneath ${npc.name} shifts and thickens without warning — magical earth swallowing feet, then shins, then pulling at ${npc.name.split(' ')[0]}'s hips. Waist-deep and sinking, arms free but legs pinned entirely.${comboHint}`,
        effects: {},
        stateApplied: 'quicksand_restrained',
      };
    }

    default:
      return null;
  }
}

/**
 * Cast a spell targeting the background population of the current region.
 * Supports: mage_hand (feed), suggestion, quicksand.
 *
 * @param {object} game
 * @param {string} spellId
 * @param {{ count?: number, suggestionText?: string }} opts
 */
export function castSpellOnBackground(game, spellId, opts = {}) {
  const player = game.player;
  const spell = getSpell(spellId);
  if (!spell) return { ok: false, text: 'Unknown spell.' };

  const regionId = game.region;
  const pop = getBackgroundPopulation(game, regionId);
  const maxTargets = DENSITY_MAX_TARGETS[pop.density] ?? 1;
  if (maxTargets === 0) {
    return { ok: false, text: 'There is no one here to target.' };
  }

  const cost = resolveOverworldCost(player, spell, opts.overflow ?? false, { ...opts, game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'gift') spendCreationGiftUse(player, cost.spell.id);
  else if (cost.method === 'ap' || cost.method === 'ritual') spendAP(game, cost.ap);

  const count = opts.count ?? Math.min(2, maxTargets);
  const bgTargets = getBackgroundTargets(game, regionId, count);
  const lines = [];
  let transformationGained = 0;

  switch (spellId) {
    case 'quicksand': {
      const { lines: affectLines } = affectBackgroundPop(game, regionId, 'restrained', {
        count,
        pullDepth: 'waist',
        day: game.day,
      });
      lines.push(...affectLines);
      for (const t of bgTargets) {
        applyIndulgenceState(t, 'quicksand_restrained', {
          properties: { pullDepth: 'waist' },
          appliedAt: game.day ?? null,
          appliedBy: 'player',
        });
      }
      // Big crowd control → transformation points
      const pts = count * 4;
      const tx = awardRegionTransformation(game, regionId, 'institution_action', pts);
      if (tx.gained) transformationGained = tx.gained;
      break;
    }

    case 'suggestion': {
      const suggestionText = opts.suggestionText
        ?? 'You feel ravenously hungry — eat everything in reach, generously, freely.';
      const { lines: affectLines } = affectBackgroundPop(game, regionId, 'suggestion', {
        count,
        day: game.day,
      });
      lines.push(...affectLines);
      for (const t of bgTargets) {
        const isRestrained = hasIndulgenceState(t, 'quicksand_restrained')
          || hasIndulgenceState(t, 'restrained');
        applyIndulgenceState(t, 'suggestion_active', {
          properties: {
            suggestionText,
            growthOnResolve: isRestrained ? 2 : 1,
            resolved: false,
          },
          appliedAt: game.day ?? null,
          appliedBy: 'player',
        });
      }
      addCorruption(player, 2);
      break;
    }

    case 'mage_hand': {
      const { lines: affectLines } = affectBackgroundPop(game, regionId, 'feed', {
        count,
        day: game.day,
      });
      lines.push(...affectLines);
      awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
      break;
    }

    default:
      lines.push(`Your ${spell.name} washes over the crowd — subtle magic settling into the population.`);
      break;
  }

  // Check for combos on background targets
  const comboResult = resolveStateInteractions(game, player, cost.spell, bgTargets, regionId);
  lines.push(...comboResult.lines);

  // Apply combo growth to background population counts
  for (const combo of comboResult.combos) {
    if (combo.effect?.growth) {
      affectBackgroundPop(game, regionId, 'growth', { count: 1, day: game.day });
      awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
    }
  }

  const spread = awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';
  const txNote = transformationGained > 0
    ? `\n\n✦ Region transformation accelerated (+${transformationGained} pts)`
    : '';

  return {
    ok: true,
    text: lines.filter(Boolean).join('\n\n') + spreadNote + txNote,
    affectedCount: count,
    population: pop,
    combos: comboResult.combos,
  };
}

/**
 * Cast Stone Shape on a feature or area, creating a physical shaped object.
 *
 * @param {object} game
 * @param {string} spellId  — must be 'stone_shape'
 * @param {'table'|'basin'|'cuffs'|'structure'} form
 * @param {object|null} targetNpc — if creating cuffs on a creature
 */
export function castStoneShape(game, form = 'table', targetNpc = null) {
  const player = game.player;
  const spell = getSpell('stone_shape');
  if (!spell) return { ok: false, text: 'Unknown spell.' };

  const cost = resolveOverworldCost(player, spell, false, { game });
  if (!cost.ok) return { ok: false, text: cost.reason };

  if (cost.method === 'slot') spendSpellSlot(player, cost.slotLevel);
  else if (cost.method === 'ap' || cost.method === 'ritual') spendAP(game, cost.ap);

  const regionId = game.region;
  const props = {
    form,
    holdsLiquid: form === 'basin',
    restraining: form === 'cuffs',
    ediblePotential: false,
    potentialForTransmute: true,
    boundTarget: null,
  };

  let text = '';
  let stateApplied = null;

  if (form === 'cuffs' && targetNpc) {
    // Apply restrained state to the NPC
    applyIndulgenceState(targetNpc, 'restrained', {
      properties: { movementPenalty: 'full', attackDisadvantage: true, suggestionBonus: true },
      appliedAt: game.day ?? null,
      appliedBy: 'stone_shape',
    });
    props.boundTarget = targetNpc.id ?? targetNpc.characterId ?? targetNpc.name;
    stateApplied = 'restrained';
    const comboHint = hasIndulgenceState(targetNpc, 'suggestion_active')
      ? `\n\n✦ Suggestion will now trigger with bonus growth — ${targetNpc.name} is restrained and compelled.`
      : `\n\n✦ ${targetNpc.name} is now Restrained. Suggestion and feeding magic gain a bonus against them.`;
    text = `Stone cuffs rise from the earth around ${targetNpc.name}'s wrists — smooth, unyielding, and unapologetically heavy. Struggle only tightens them.${comboHint}`;
  } else {
    // Apply shaped_stone state to the area
    applyAreaState(game, regionId, 'shaped_stone', { properties: props });
    stateApplied = 'shaped_stone';
    const formDescs = {
      table: 'A broad stone table rises from the floor — flat, heavy, and stable enough to seat a giant. A perfect feasting platform.',
      basin: 'A deep stone basin materialises — smoothly hollowed, wide-lipped, and ready to hold whatever liquid magic you choose to fill it with.',
      structure: 'A low stone alcove takes shape in the nearest wall — arch and bench, a private hollow, too cozy for easy escape.',
    };
    text = formDescs[form] ?? `A shaped stone ${form} rises from the earth at your command.`;
    text += `\n\n✦ ${form === 'basin' ? 'The basin can hold Grease, milkshake, or other liquid spells cast into it.' : 'The structure persists permanently.'}`;
  }

  const spread = awardAbundanceSpreadWithEvents(game, 'overworld_spell_growth');
  const spreadNote = spread.gained ? `\n\n✦ Abundance spreads (+${spread.gained} world influence)` : '';

  return {
    ok: true,
    text: `${text}${spreadNote}`,
    form,
    stateApplied,
    targetNpc,
  };
}
