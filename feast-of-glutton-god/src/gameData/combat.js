import { getStage, getTileSize, getMovement, getHpBonus } from "./stages.js";
import { advanceStageUniversal } from "./growthPresentation.js";
import { renderCombatGrowthBeat } from "../textEngine/scenes/growth/combatGrowth.js";
import { addCorruption } from "./corruption.js";
import { getCombatModifiers } from "./stagePerks.js";
import {
  createEnemy,
  getEnemyThreatTier,
  getEnemyTypeDef,
  getEnemyGrowthResist,
  isConversionImmune,
  isCosmicThreat,
  isMythicThreat,
} from "./enemies.js";
import { ensureFavor, spendFavor } from "./favor.js";
import {
  initCombatTurnState, beginTurn, endTurn, getActiveEntry, getEconomy,
  canSpendMovement, spendMovement, canUseAction, spendAction, onUnitGrew,
  ACTION_TYPES, getCombatUnitId, getAvailableBonusActions,
} from "./combatTurn.js";
import {
  resolveAttackRoll,
  resolveMeleeDamage,
  resolveSpellDamage,
  resolveEffectWithSave,
  applyCombatDamage,
  applyAttackCritEffects,
  formatAttackSummary,
  formatSaveSummary,
  ATTACK_TYPES,
  DAMAGE_TYPES,
  getAttackReach,
} from "./combatRolls.js";
import { getSpellSaveDC } from "./stats.js";
import { resolveCastCost, getSpellPowerMultiplier } from "./spellSlots.js";
import { getSpellForCast } from "./spells.js";
import { renderCastFeedback } from "../textEngine/scenes/dm/cast.js";
import { awardFatteningXp } from "./leveling.js";
import { summarizePartyDevotion, tickDevotionCorruptionAura } from "./companionDevotion.js";
import { applyEndingEchoCombatStart } from "./endingEcho.js";

const GRID_SIZE = 10;
const TRIVIALIZE_MIN_PLAYER_STAGE = 6;
const TRIVIALIZE_SIZE_GAP = 3;

function prepareCombatUnit(unit, team, index) {
  const combatId = `${team}_${index}`;
  return {
    ...unit,
    combatId,
    x: unit.x ?? 0,
    y: unit.y ?? 0,
  };
}

export function createCombatState(player, party, enemyTypeId, regionId, game = null) {
  const enemies = [];
  const def = enemyTypeId ? getEnemyTypeDef(enemyTypeId) : null;
  const eliteSolo = def && (isCosmicThreat(enemyTypeId) || isMythicThreat(enemyTypeId))
    && def.role === "boss";
  const count = eliteSolo || enemyTypeId === "famine_hag" ? 1 : 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const e = enemyTypeId ? createEnemy(enemyTypeId) : createEnemy("harvest_harpy");
    e.typeId = enemyTypeId || e.id;
    e.x = GRID_SIZE - 2 - i * 2;
    e.y = 2 + i * 2;
    enemies.push(e);
  }

  const allies = [
    prepareCombatUnit({ ...player, x: 1, y: 4, isPlayer: true }, "ally", 0),
    ...((party ?? []).map((c, i) => prepareCombatUnit({
      ...c,
      x: 2 + (i % 2),
      y: 2 + i * 3,
      isPlayer: false,
    }, "ally", i + 1))),
  ];
  const preparedEnemies = enemies.map((e, i) => {
    const unit = prepareCombatUnit(e, "enemy", i);
    return {
      ...unit,
      type: e.typeId || e.id,
      startLbs: e.lbs,
      startStage: getStage(e.lbs).id,
    };
  });

  const turnState = initCombatTurnState(allies, preparedEnemies);
  beginTurn(turnState, null);

  const log = ["Combat begins! Abundance fills the air."];
  if (turnState.log?.length) log.push(...turnState.log);

  const combat = {
    gridSize: GRID_SIZE,
    turn: turnState.round,
    turnState,
    allies,
    enemies: preparedEnemies,
    feastTiles: [],
    victory: null,
    regionId,
    log,
    lastGrowth: null,
    introDismissed: false,
    enemyTypeId: enemyTypeId || preparedEnemies[0]?.typeId,
    devotionBonuses: summarizePartyDevotion(allies),
    devotionFreeCastUsed: false,
  };

  if (combat.devotionBonuses.apotheosis) {
    log.push('★ Companion apotheosis bond thrums — devotion made battle-ready.');
  }

  if (game) {
    applyEndingEchoCombatStart(game, combat);
  }

  return skipToPlayerTurn(combat);
}

/** If enemies win initiative, run their turns until a player acts or combat ends */
function skipToPlayerTurn(combat) {
  let safety = 20;
  while (safety-- > 0 && !combat.victory) {
    const entry = getActiveEntry(combat.turnState);
    if (!entry || entry.unit.isPlayer) break;
    if (entry.team === "enemy") {
      runEnemyAction(combat, entry.unit);
      checkVictory(combat);
      if (combat.victory) break;
    } else if (entry.team === "ally") {
      runAllyAction(combat, entry.unit);
      checkVictory(combat);
      if (combat.victory) break;
    }
    endTurn(combat.turnState, combat.allies, combat.enemies);
    combat.turn = combat.turnState.round;
    if (combat.turnState.log?.length) {
      combat.log.push(...combat.turnState.log);
      combat.turnState.log = [];
    }
  }
  return combat;
}

export function getActiveUnit(combat) {
  const entry = getActiveEntry(combat.turnState);
  return entry?.unit ?? null;
}

export function isPlayerTurn(combat) {
  const entry = getActiveEntry(combat.turnState);
  return entry?.team === "ally" && entry?.unit?.isPlayer;
}

export function getUnitAt(combat, x, y, team) {
  const units = team === "ally" ? combat.allies : combat.enemies;
  return units.find((u) => {
    if (u.hp <= 0 || u.converted) return false;
    const size = getTileSize(getStage(u.lbs).id);
    return x >= u.x && x < u.x + size && y >= u.y && y < u.y + size;
  });
}

export function canMoveTo(combat, unit, nx, ny) {
  const size = getTileSize(getStage(unit.lbs).id);
  if (nx < 0 || ny < 0 || nx + size > combat.gridSize || ny + size > combat.gridSize) return false;
  for (let dx = 0; dx < size; dx++) {
    for (let dy = 0; dy < size; dy++) {
      const testX = nx + dx, testY = ny + dy;
      const blockedAlly = combat.allies.some((a) => {
        if (a === unit || a.hp <= 0) return false;
        const s = getTileSize(getStage(a.lbs).id);
        return testX >= a.x && testX < a.x + s && testY >= a.y && testY < a.y + s;
      });
      const blockedEnemy = combat.enemies.some((e) => {
        if (e === unit || e.hp <= 0 || e.converted) return false;
        const s = getTileSize(getStage(e.lbs).id);
        return testX >= e.x && testX < e.x + s && testY >= e.y && testY < e.y + s;
      });
      const isSelf = testX >= unit.x && testX < unit.x + size && testY >= unit.y && testY < unit.y + size;
      if (!isSelf && (blockedAlly || blockedEnemy)) return false;
    }
  }
  return true;
}

export function getReachableTiles(combat, unit) {
  const entry = getActiveEntry(combat.turnState);
  if (!entry || entry.unit !== unit) return [];
  const eco = getEconomy(combat.turnState, entry.id);
  const move = eco.movementRemaining ?? getMovement(getStage(unit.lbs).id);
  const size = getTileSize(getStage(unit.lbs).id);
  const tiles = [];
  for (let x = 0; x <= combat.gridSize - size; x++) {
    for (let y = 0; y <= combat.gridSize - size; y++) {
      const dist = Math.abs(x - unit.x) + Math.abs(y - unit.y);
      if (dist > 0 && dist <= move && canMoveTo(combat, unit, x, y)) {
        tiles.push({ x, y, cost: dist });
      }
    }
  }
  return tiles;
}

export function moveUnit(combat, unit, x, y) {
  const entry = getActiveEntry(combat.turnState);
  if (!entry || entry.unit !== unit) {
    combat.log.push(`${unit.name} cannot move right now!`);
    return combat;
  }
  const dist = Math.abs(x - unit.x) + Math.abs(y - unit.y);
  if (!canSpendMovement(combat.turnState, entry.id, dist)) {
    combat.log.push("Not enough movement remaining!");
    return combat;
  }
  unit.x = x;
  unit.y = y;
  if (entry) spendMovement(combat.turnState, entry.id, dist);
  combat.log.push(`${unit.name} moves (${getStage(unit.lbs).label}).`);
  return combat;
}

export function attackUnit(combat, attacker, target) {
  const entry = getActiveEntry(combat.turnState);
  if (entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.ACTION)) {
    combat.log.push("Action already used this turn!");
    return combat;
  }

  const reach = getAttackReach(attacker, ATTACK_TYPES.MELEE);
  const dist = Math.abs(attacker.x - target.x) + Math.abs(attacker.y - target.y);
  const atkSize = getTileSize(getStage(attacker.lbs).id);
  if (dist > reach + atkSize + 1) {
    combat.log.push(`${attacker.name} cannot reach ${target.name}!`);
    return combat;
  }

  const applyGrowthFn = (unit, stages) => {
    const g = applyGrowth(unit, stages);
    onUnitGrew(combat.turnState, unit, g);
    combat.lastGrowth = { unit, ...g };
    return g;
  };

  const attack = resolveAttackRoll(attacker, target, {
    attackType: ATTACK_TYPES.MELEE,
    label: `${attacker.name} attacks`,
  });

  if (attack.hit) {
    const damage = resolveMeleeDamage(attacker, { critical: attack.isCriticalHit });
    const applied = applyCombatDamage(target, damage, { applyGrowthFn });
    applyAttackCritEffects(attacker, target, attack, { applyGrowthFn });
    combat.log.push(formatAttackSummary(attack, damage, applied));

    if (attack.isCriticalHit) {
      combat.log.push(`★ Critical hit — ${target.name} swells under the voluptuous impact!`);
    }
    if (applied.growthStages > 0) {
      const beat = renderCombatGrowthBeat(target, combat.lastGrowth, { attacker });
      combat.log.push(beat || `${target.name} swells under the strike — footing compromised.`);
      addCorruption(target, 3 * applied.growthStages);
    }
    if (getStage(attacker.lbs).id >= 6) {
      combat.log.push(`The weight of ${attacker.name}'s glorious mass adds crushing force.`);
    }
  } else {
    combat.log.push(formatAttackSummary(attack));
    if (attack.isCriticalMiss) {
      applyAttackCritEffects(attacker, target, attack, { applyGrowthFn });
      combat.log.push(`${attacker.name} wobbles delightfully off-balance — still magnificent.`);
    } else {
      combat.log.push(`${attacker.name}'s strike glances off ${target.name}'s curves.`);
    }
  }

  if (entry) spendAction(combat.turnState, entry.id, ACTION_TYPES.ACTION);
  return combat;
}

function maybeAwardFatteningXp(combat, caster, target, growth) {
  if (!caster?.isPlayer || !growth?.stagesJumped || growth.stagesJumped <= 0) return;
  if (!target || target.isPlayer || target === caster) return;
  const { levelUps } = awardFatteningXp(caster, growth.stagesJumped, 'combat_fatten');
  if (levelUps?.length) {
    combat.fattenLevelUps = [...(combat.fattenLevelUps || []), ...levelUps];
    caster.grewThisCombat = true;
  }
}

export function applyGrowth(unit, stages = 1, opts = {}) {
  const respectCosmic = opts.respectCosmicResist ?? Boolean(unit?.isEnemy);
  let effectiveStages = stages;
  if (unit?.isPlayer && opts.combat?.devotionBonuses?.growthBonus > 0 && stages > 0) {
    effectiveStages += opts.combat.devotionBonuses.growthBonus;
  }
  if (respectCosmic && (isCosmicThreat(unit) || isMythicThreat(unit)) && stages > 0) {
    const resist = getEnemyGrowthResist(unit);
    effectiveStages = Math.max(0, Math.floor(stages * (1 - resist)));
    if (effectiveStages < stages && effectiveStages === 0 && stages > 0) {
      effectiveStages = 1;
    }
  }
  const result = advanceStageUniversal(unit, effectiveStages);
  const endStage = getStage(unit.lbs).id;
  const hpMult = getHpBonus(endStage) + 0.15;
  const hpBonus = Math.floor(unit.maxHp * hpMult * effectiveStages);
  unit.maxHp += hpBonus;
  unit.hp = Math.min(unit.maxHp, unit.hp + hpBonus);
  return { ...result, resisted: effectiveStages < stages, stagesApplied: effectiveStages };
}

export function useBonusAction(combat, unit, actionId, target = null) {
  const entry = getActiveEntry(combat.turnState);
  if (entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.BONUS)) {
    combat.log.push("Bonus action already used!");
    return combat;
  }

  if (actionId === "self_feed") {
    const growth = applyGrowth(unit, 1);
    addCorruption(unit, 4);
    combat.lastGrowth = { unit, ...growth };
    onUnitGrew(combat.turnState, unit, growth);
    combat.log.push(`${unit.name} self-feeds mid-battle — swelling with glorious hunger!`);
  } else if (actionId === "body_slam" && target) {
    const mods = getCombatModifiers(unit);
    const damage = 4 + (mods.damageBonus || 0);
    target.hp = Math.max(0, target.hp - damage);
    const growth = applyGrowth(target, 1);
    addCorruption(target, 5);
    combat.lastGrowth = { unit: target, ...growth };
    onUnitGrew(combat.turnState, target, growth);
    maybeAwardFatteningXp(combat, unit, target, growth);
    combat.log.push(`${unit.name} body-slams ${target.name} with ${getStage(unit.lbs).label} mass!`);
  } else if (actionId === "crushing_aura") {
    for (const e of combat.enemies.filter((en) => en.hp > 0 && !en.converted)) {
      addCorruption(e, 6);
      e.hunger = Math.min(100, (e.hunger || 0) + 15);
    }
    combat.log.push(`${unit.name}'s crushing aura radiates — enemies feel the weight of abundance!`);
  }

  if (entry) spendAction(combat.turnState, entry.id, ACTION_TYPES.BONUS);
  return combat;
}

export { getAvailableBonusActions };

export function canTrivializeTarget(player, enemy) {
  if (!player || !enemy || enemy.hp <= 0 || enemy.converted) return false;
  if (getEnemyThreatTier(enemy) === "cosmic" || getEnemyThreatTier(enemy) === "mythic") return false;
  const playerStage = getStage(player.lbs).id;
  const enemyStage = getStage(enemy.lbs).id;
  return playerStage >= TRIVIALIZE_MIN_PLAYER_STAGE
    || playerStage >= enemyStage + TRIVIALIZE_SIZE_GAP;
}

/** One-action OPM pacify — instant convert via feed/conversion path (mundane foes only). */
export function trivializeTarget(combat, feeder, target) {
  const entry = getActiveEntry(combat.turnState);
  if (entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.ACTION)) {
    combat.log.push("Action already used this turn!");
    return { combat, ok: false };
  }
  if (!canTrivializeTarget(feeder, target)) {
    combat.log.push("This foe cannot be trivialized — not yet, or not ever.");
    return { combat, ok: false };
  }

  const playerStage = getStage(feeder.lbs).id;
  const enemyStage = getStage(target.lbs).id;
  const growthStages = Math.max(1, Math.min(4, playerStage - enemyStage + 1));
  const growth = applyGrowth(target, growthStages);
  target.hunger = 100;
  target.corruption = 100;
  maybeAwardFatteningXp(combat, feeder, target, growth);
  combat.lastGrowth = { unit: target, ...growth };
  convertEnemy(combat, target);
  combat.log.push(`${feeder.name} trivializes ${target.name} — dread becomes dessert, resistance becomes bliss.`);
  combat.trivialized = true;
  combat.trivializedEnemyId = target.typeId || target.type || target.id;

  if (entry) {
    spendAction(combat.turnState, entry.id, ACTION_TYPES.ACTION);
    onUnitGrew(combat.turnState, target, growth);
  }
  checkVictory(combat);
  return { combat, ok: true, enemy: target };
}

export function feedTarget(combat, feeder, target, amount = 1, opts = {}) {
  const entry = getActiveEntry(combat.turnState);
  if (!opts.skipActionSpend && entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.ACTION)) {
    combat.log.push("Action already used this turn!");
    return combat;
  }

  const growth = applyGrowth(target, amount);
  target.hunger = Math.min(100, (target.hunger || 0) + 25 * amount);
  addCorruption(target, 5 * amount);
  maybeAwardFatteningXp(combat, feeder, target, growth);
  combat.log.push(`${feeder.name} feeds ${target.name} — she swells with pleasure!`);
  combat.lastGrowth = { unit: target, ...growth };
  if (entry) {
    if (!opts.skipActionSpend) spendAction(combat.turnState, entry.id, ACTION_TYPES.ACTION);
    onUnitGrew(combat.turnState, target, growth);
    if (combat.turnState.log?.length) combat.log.push(...combat.turnState.log.slice(-2));
  }
  return combat;
}

export function castSpell(combat, caster, spell, target, opts = {}) {
  const entry = getActiveEntry(combat.turnState);
  const castSpellData = getSpellForCast(spell, opts.overflow);
  const economyType = castSpellData.actionType === "bonus" ? ACTION_TYPES.BONUS : ACTION_TYPES.ACTION;
  const isGrowthSpell = Boolean(castSpellData.effect?.growth || castSpellData.effect?.feed);
  const devotionFreeCast = Boolean(
    caster.isPlayer
    && isGrowthSpell
    && combat.devotionBonuses?.freeGrowthCast
    && !combat.devotionFreeCastUsed,
  );

  if (entry && !devotionFreeCast && !canUseAction(combat.turnState, entry.id, economyType)) {
    const blockKind = economyType === ACTION_TYPES.BONUS ? "nobonus" : "noaction";
    combat.log.push(renderCastFeedback(blockKind, caster, castSpellData));
    return combat;
  }

  const cost = resolveCastCost(caster, castSpellData, opts);
  if (!cost.ok) {
    combat.log.push(renderCastFeedback("fizzle", caster, castSpellData, { failCause: "no_resource" }));
    return combat;
  }

  const power = getSpellPowerMultiplier(caster, cost.slotLevelUsed || castSpellData.slotLevel || 1);
  const eff = { ...castSpellData.effect };
  const scale = (n) => (typeof n === "number" ? Math.max(1, Math.round(n * power)) : n);
  let actionSpent = false;
  const spendCastAction = () => {
    if (entry && !actionSpent) {
      if (devotionFreeCast) {
        combat.devotionFreeCastUsed = true;
        combat.log.push('★ Companion devotion surges — your growth spell costs no action!');
      } else {
        spendAction(combat.turnState, entry.id, economyType);
      }
      actionSpent = true;
    }
  };

  const applyGrowthFn = (unit, stages) => {
    const g = applyGrowth(unit, stages, { combat, respectCosmicResist: Boolean(unit?.isEnemy) });
    onUnitGrew(combat.turnState, unit, g);
    combat.lastGrowth = { unit, ...g };
    maybeAwardFatteningXp(combat, caster, unit, g);
    return g;
  };

  if (eff.damage) {
    const dmgSpec = eff.damage;
    const damageTargets = opts.targets?.length ? opts.targets : [target].filter(Boolean);
    const dice = dmgSpec.dice ?? { count: 1, sides: 8 };
    const damageType = dmgSpec.damageType ?? DAMAGE_TYPES.ABUNDANCE_OVERLOAD;

    for (const t of damageTargets) {
      if (!t || t.hp <= 0) continue;

      if (dmgSpec.save) {
        const dc = getSpellSaveDC(caster);
        const rolled = resolveSpellDamage(caster, { ...dmgSpec, dice, damageType });
        const result = resolveEffectWithSave(t, dmgSpec, {
          saveStat: dmgSpec.save,
          dc,
          damage: rolled.total,
          halfOnSuccess: dmgSpec.halfOnSuccess !== false,
          applyGrowthFn,
        });
        combat.log.push(formatSaveSummary(result.save));
        if (result.save.legendaryResistanceUsed) {
          const left = t.legendaryResistancesLeft ?? 0;
          combat.log.push(`★ ${t.name} spends legendary resistance (${left} left).`);
        }
        if (result.applied?.hpDamage > 0) {
          combat.log.push(`${t.name} takes ${result.applied.hpDamage} HP from ${castSpellData.name}.`);
          if (result.applied.growthStages > 0) {
            combat.log.push(`${t.name} swells from the impact!`);
          }
        } else {
          combat.log.push(`${t.name} resists the worst of ${castSpellData.name}.`);
        }
      } else if (dmgSpec.spellAttack !== false) {
        const attack = resolveAttackRoll(caster, t, {
          attackType: ATTACK_TYPES.SPELL,
          label: castSpellData.name,
        });
        if (attack.hit) {
          const damage = resolveSpellDamage(caster, { ...dmgSpec, dice, damageType }, {
            critical: attack.isCriticalHit,
          });
          const applied = applyCombatDamage(t, damage, { applyGrowthFn });
          combat.log.push(formatAttackSummary(attack, damage, applied));
          if (dmgSpec.corruptionOnHit) addCorruption(t, scale(dmgSpec.corruptionOnHit));
        } else {
          combat.log.push(`${castSpellData.name}: ${attack.naturalRoll} + ${attack.modifierTotal} = ${attack.total} vs AC ${attack.ac} — MISS`);
        }
      } else {
        const damage = resolveSpellDamage(caster, { ...dmgSpec, dice, damageType });
        const applied = applyCombatDamage(t, damage, { applyGrowthFn });
        combat.log.push(`${t.name} takes ${applied.hpDamage} HP from ${castSpellData.name}.`);
      }

      if (t.hp <= 0) combat.log.push(`${t.name} falls!`);
    }
    checkVictory(combat);
  }

  if (eff.heal && target) {
    target.hp = Math.min(target.maxHp, target.hp + scale(eff.heal));
    combat.log.push(`${castSpellData.name} bathes ${target.name} in warm healing.`);
  }
  if (eff.growth) {
    let targets;
    if (opts.targets?.length) {
      targets = opts.targets;
    } else if (eff.party && eff.aoe) {
      targets = combat.allies.filter((a) => a.hp > 0);
    } else if (eff.aoe) {
      targets = [...combat.enemies, ...combat.allies].filter((t) => t?.hp > 0);
    } else {
      targets = [target];
    }
    for (const t of targets.filter(Boolean)) {
      const g = applyGrowth(t, scale(eff.growth));
      addCorruption(t, 3 * scale(eff.growth));
      combat.lastGrowth = { unit: t, ...g };
      onUnitGrew(combat.turnState, t, g);
      maybeAwardFatteningXp(combat, caster, t, g);
    }
    const label = eff.party ? 'your allies' : eff.aoe ? 'the battlefield' : target?.name;
    combat.log.push(`${castSpellData.name} swells ${label} with golden abundance!`);
  }
  if (eff.corruption && target) addCorruption(target, scale(eff.corruption));
  if (eff.feed && target) {
    feedTarget(combat, caster, target, scale(eff.feed), { skipActionSpend: true });
    spendCastAction();
    combat.log.push(renderCastFeedback("invoke", caster, castSpellData, { cost }));
    return combat;
  }
  if (eff.charm && target) {
    target.hunger = Math.min(100, (target.hunger || 0) + 30);
    addCorruption(target, 8);
    combat.log.push(`${target.name} is charmed by jiggling abundance.`);
  }
  if (eff.selfGrowth) {
    const g = applyGrowth(caster, scale(eff.selfGrowth));
    combat.lastGrowth = { unit: caster, ...g };
    onUnitGrew(combat.turnState, caster, g);
  }
  if (eff.drain && target) {
    const g = applyGrowth(caster, scale(eff.drain));
    addCorruption(target, 4);
    combat.lastGrowth = { unit: caster, ...g };
    onUnitGrew(combat.turnState, caster, g);
    combat.log.push(`${caster.name} drains essence from ${target.name} into new curves!`);
  }
  if (eff.buff) {
    caster.tempFlags = caster.tempFlags || {};
    caster.tempFlags[eff.buff] = (caster.tempFlags[eff.buff] || 0) + 1;
    combat.log.push(`${castSpellData.name} blesses ${caster.name} with ${eff.buff} power.`);
  }

  spendCastAction();
  combat.log.push(renderCastFeedback("invoke", caster, castSpellData, { cost }));
  return combat;
}

export function checkConversion(enemy) {
  if (!enemy || enemy.converted) return false;
  if (isConversionImmune(enemy)) return false;
  if (isCosmicThreat(enemy)) {
    return (enemy.hunger >= 95 || enemy.corruption >= 90);
  }
  return enemy.hunger >= 80 || enemy.corruption >= 50;
}

export function convertEnemy(combat, enemy) {
  enemy.converted = true;
  enemy.hp = enemy.maxHp;
  combat.log.push(`${enemy.name} surrenders to abundance and joins the feast!`);
  return combat;
}

export function checkVictory(combat) {
  const aliveEnemies = combat.enemies.filter((e) => e.hp > 0 && !e.converted);
  const aliveAllies = combat.allies.filter((a) => a.hp > 0);
  if (aliveEnemies.length === 0) {
    combat.victory = "win";
    combat.log.push("Victory through abundance!");
  } else if (aliveAllies.length === 0) {
    combat.victory = "lose";
    combat.log.push("Your party has been overwhelmed...");
  } else if (combat.enemies.every((e) => e.converted || e.hp <= 0)) {
    combat.victory = "converted";
    combat.log.push("All enemies converted to the Fat Goddess's gospel!");
  }
  return combat;
}

function legendaryDamage(total, damageType = DAMAGE_TYPES.PHYSICAL) {
  return { total, damageType, growthConversion: 0 };
}

function executeLegendaryAction(combat, enemy, player, actionId) {
  switch (actionId) {
    case 'scales_of_judgment':
      ensureFavor(player);
      player.favor = Math.max(0, (player.favor || 0) - 2);
      combat.log.push(`★ ${enemy.name} tips the Scales of Judgment — favor drains under divine law.`);
      break;
    case 'crown_of_order':
      player.tempFlags = player.tempFlags || {};
      player.tempFlags.growthSuppressed = (player.tempFlags.growthSuppressed || 0) + 2;
      combat.log.push(`★ ${enemy.name} lowers the Crown of Order — growth magic falters.`);
      break;
    case 'law_made_manifest':
      applyCombatDamage(player, legendaryDamage(4 + Math.floor(Math.random() * 4)));
      combat.log.push(`★ ${enemy.name} manifests law as force — austerity strikes your frame.`);
      break;
    case 'barren_shriek':
      addCorruption(player, 6);
      player.hunger = Math.max(0, (player.hunger || 0) - 15);
      combat.log.push(`★ ${enemy.name} shrieks barren grief — appetite stutters in your belly.`);
      break;
    case 'harvest_inversion':
      player.tempFlags = player.tempFlags || {};
      player.tempFlags.growthSuppressed = (player.tempFlags.growthSuppressed || 0) + 1;
      combat.log.push(`★ ${enemy.name} inverts the harvest — abundance twists backward for a heartbeat.`);
      break;
    case 'thorned_plenty':
      applyCombatDamage(player, legendaryDamage(3, DAMAGE_TYPES.ABUNDANCE_OVERLOAD));
      combat.log.push(`★ ${enemy.name} lashes with thorned plenty — measured pain, measured denial.`);
      break;
    case 'barrow_wail':
      applyCombatDamage(player, legendaryDamage(5, DAMAGE_TYPES.ABUNDANCE_OVERLOAD));
      combat.log.push(`★ ${enemy.name} wails from the barrow — fate itself bruises your favor.`);
      break;
    case 'fate_revision':
      ensureFavor(player);
      spendFavor(player, Math.min(player.favor || 0, 3));
      combat.log.push(`★ ${enemy.name} revises fate — the goddess of endings taxes your miracle.`);
      break;
    case 'unwritten_end':
      applyCombatDamage(player, legendaryDamage(6, DAMAGE_TYPES.PLEASURABLE_PRESSURE));
      combat.log.push(`★ ${enemy.name} writes an ending in pain — your story hesitates.`);
      break;
    case 'rival_bloom':
      applyGrowth(player, 1, { respectCosmicResist: false });
      combat.log.push(`★ ${enemy.name} mirrors your bloom — growth stolen and redirected at you.`);
      break;
    case 'appetite_redirect':
      ensureFavor(player);
      spendFavor(player, Math.min(player.favor || 0, 2));
      combat.log.push(`★ ${enemy.name} redirects appetite — your patron's gift flows wrong for a moment.`);
      break;
    case 'sovereign_hunger':
      applyCombatDamage(player, legendaryDamage(8, DAMAGE_TYPES.ABUNDANCE_OVERLOAD));
      combat.log.push(`★ ${enemy.name} unleashes sovereign hunger — antithesis abundance as weapon.`);
      break;
    case 'domain_shift':
      runCosmicAbility(combat, enemy, player);
      combat.log.push(`★ ${enemy.name} shifts divine domain — the Wheel rotates its answer.`);
      break;
    case 'wheel_crush':
      applyCombatDamage(player, legendaryDamage(10));
      combat.log.push(`★ ${enemy.name} crushes the field with Wheel-mass — cosmic law made impact.`);
      break;
    case 'pantheon_roar':
      for (const ally of combat.allies.filter((a) => a.hp > 0)) addCorruption(ally, 4);
      combat.log.push(`★ ${enemy.name} roars with pantheon unity — every ally tastes denial.`);
      break;
    default:
      runCosmicAbility(combat, enemy, player);
      combat.log.push(`★ ${enemy.name} acts with legendary force.`);
  }
}

function resolveLegendaryActions(combat) {
  if (combat.victory) return;
  const player = combat.allies.find((a) => a.isPlayer);
  if (!player || player.hp <= 0) return;

  const round = combat.turnState?.round ?? 1;
  if (combat.legendaryRound !== round) {
    combat.legendaryRound = round;
    combat.legendaryUsed = {};
  }
  combat.legendaryUsed = combat.legendaryUsed || {};

  for (const enemy of combat.enemies) {
    if (enemy.hp <= 0 || enemy.converted) continue;
    const def = getEnemyTypeDef(enemy);
    if (!def?.legendaryActions?.length) continue;

    const eid = enemy.combatId || enemy.typeId || enemy.id;
    const used = combat.legendaryUsed[eid] ?? 0;
    const max = def.legendaryActionCount ?? 1;
    if (used >= max) continue;

    const actionId = def.legendaryActions[Math.floor(Math.random() * def.legendaryActions.length)];
    executeLegendaryAction(combat, enemy, player, actionId);
    combat.legendaryUsed[eid] = used + 1;
    checkCosmicPhases(combat, enemy);
  }
}

/** End active unit's turn and run AI for enemies until next player turn or combat end */
export function advanceTurn(combat) {
  if (combat.victory) return combat;

  const endingPlayer = getActiveEntry(combat.turnState)?.unit?.isPlayer;
  endTurn(combat.turnState, combat.allies, combat.enemies);
  if (endingPlayer) resolveLegendaryActions(combat);
  combat.turn = combat.turnState.round;
  if (combat.turnState.log?.length) {
    combat.log.push(...combat.turnState.log);
    combat.turnState.log = [];
  }

  let safety = 20;
  while (!combat.victory && safety-- > 0) {
    const entry = getActiveEntry(combat.turnState);
    if (!entry) break;
    if (entry.unit.isPlayer) break;

    if (entry.team === "enemy") {
      runEnemyAction(combat, entry.unit);
      checkVictory(combat);
      if (combat.victory) break;
    } else if (entry.team === "ally") {
      runAllyAction(combat, entry.unit);
      checkVictory(combat);
      if (combat.victory) break;
    }

    endTurn(combat.turnState, combat.allies, combat.enemies);
    combat.turn = combat.turnState.round;
    if (combat.turnState.log?.length) {
      combat.log.push(...combat.turnState.log);
      combat.turnState.log = [];
    }
  }

  const playerEntry = getActiveEntry(combat.turnState);
  if (playerEntry?.unit?.isPlayer && !combat.victory) {
    const auraLines = tickDevotionCorruptionAura(combat, playerEntry.unit);
    if (auraLines.length) combat.log.push(...auraLines);
  }

  return combat;
}

function checkCosmicPhases(combat, enemy) {
  const def = getEnemyTypeDef(enemy);
  if (!def?.phases?.length || enemy.hp <= 0) return;
  const hpPct = enemy.hp / Math.max(1, enemy.maxHp);
  enemy.phaseFlags = enemy.phaseFlags || {};
  for (const phase of def.phases) {
    if (hpPct > phase.hpPct || enemy.phaseFlags[phase.id]) continue;
    enemy.phaseFlags[phase.id] = true;
    combat.log.push(`★ ${enemy.name} enters ${phase.label} — the Wheel fights back in earnest.`);
  }
}

function runCosmicAbility(combat, enemy, target) {
  const def = getEnemyTypeDef(enemy);
  const ability = def?.cosmicAbility;
  if (!ability || !target) return;

  const player = combat.allies.find((a) => a.isPlayer) || target;

  if (ability === "famine_drain" || ability === "lantern_deny" || ability === "pantheon_denial") {
    ensureFavor(player);
    const drain = ability === "pantheon_denial" ? 3 : 2;
    player.favor = Math.max(0, (player.favor || 0) - drain);
    combat.log.push(`${enemy.name} spikes famine-light through your favor — the goddess's gift runs thin.`);
  } else if (ability === "law_binding" || ability === "contract_tax") {
    target.tempFlags = target.tempFlags || {};
    target.tempFlags.growthSuppressed = (target.tempFlags.growthSuppressed || 0) + 1;
    combat.log.push(`${enemy.name} binds your abundance — growth magic struggles against measured law.`);
  } else if (ability === "measured_harvest" || ability === "fate_weight") {
    addCorruption(target, 4);
    target.hunger = Math.max(0, (target.hunger || 0) - 10);
    combat.log.push(`${enemy.name} reverses the harvest — your body remembers austerity for a heartbeat.`);
  } else if (ability === "valor_surge") {
    enemy.tempFlags = enemy.tempFlags || {};
    enemy.tempFlags.damageBonus = (enemy.tempFlags.damageBonus || 0) + 2;
    combat.log.push(`${enemy.name} burns with frontier valor — steel blessed against excess.`);
  } else if (ability === "wheel_judgment") {
    ensureFavor(player);
    spendFavor(player, Math.min(player.favor || 0, 2));
    for (const ally of combat.allies.filter((a) => a.hp > 0)) {
      addCorruption(ally, 3);
    }
    combat.log.push(`The Wheel's avatar judges the field — favor spent, flesh reminded of limits.`);
  } else if (ability === "siren_feast") {
    addCorruption(target, 8);
    target.hunger = Math.min(100, (target.hunger || 0) + 20);
    combat.log.push(`${enemy.name} exhales shrine-mist — appetite blooms hot between your thighs.`);
  } else if (ability === "blood_hunger") {
    ensureFavor(player);
    player.favor = Math.max(0, (player.favor || 0) - 1);
    addCorruption(target, 5);
    combat.log.push(`${enemy.name} tastes your gospel on the air — cold lips parting, thirst dressed as disdain.`);
  }
}

function runAllyAction(combat, ally) {
  const target = combat.enemies.find((e) => e.hp > 0 && !e.converted);
  if (!target) return;

  const entry = getActiveEntry(combat.turnState);
  if (!entry || entry.unit !== ally) return;

  const allySize = getTileSize(getStage(ally.lbs).id);
  const reach = getAttackReach(ally, ATTACK_TYPES.MELEE);
  let safety = 16;

  while (safety-- > 0) {
    const dist = Math.abs(ally.x - target.x) + Math.abs(ally.y - target.y);
    if (dist <= reach + allySize + 1) {
      attackUnit(combat, ally, target);
      return;
    }

    const eco = getEconomy(combat.turnState, entry.id);
    if (eco.movementRemaining <= 0) return;

    const dx = target.x > ally.x ? 1 : target.x < ally.x ? -1 : 0;
    const dy = target.y > ally.y ? 1 : target.y < ally.y ? -1 : 0;
    const candidates = [
      { x: ally.x + dx, y: ally.y + dy },
      { x: ally.x + dx, y: ally.y },
      { x: ally.x, y: ally.y + dy },
      { x: ally.x - dx, y: ally.y },
      { x: ally.x, y: ally.y - dy },
    ];
    let moved = false;
    for (const { x, y } of candidates) {
      if (canMoveTo(combat, ally, x, y)) {
        moveUnit(combat, ally, x, y);
        moved = true;
        break;
      }
    }
    if (!moved) return;
  }
}

function runEnemyAction(combat, enemy) {
  const target = combat.allies.find((a) => a.hp > 0);
  if (!target) return;

  checkCosmicPhases(combat, enemy);
  if (isCosmicThreat(enemy) && Math.random() < 0.45) {
    runCosmicAbility(combat, enemy, target);
  }

  const dist = Math.abs(enemy.x - target.x) + Math.abs(enemy.y - target.y);
  const size = getTileSize(getStage(enemy.lbs).id);
  if (dist <= size + 2) {
    attackUnit(combat, enemy, target);
  } else {
    const dx = target.x > enemy.x ? 1 : target.x < enemy.x ? -1 : 0;
    const dy = target.y > enemy.y ? 1 : target.y < enemy.y ? -1 : 0;
    const nx = enemy.x + dx;
    const ny = enemy.y + dy;
    if (canMoveTo(combat, enemy, nx, ny)) moveUnit(combat, enemy, nx, ny);
  }
  if (checkConversion(enemy)) convertEnemy(combat, enemy);
}

export function enemyAiTurn(combat) {
  return advanceTurn(combat);
}

export function getCombatRewards(combat) {
  if (!combat.victory || combat.victory === "lose") return { ap: 0, xp: 0 };
  const base = combat.victory === "converted" ? 25 : 15;
  return { ap: base + combat.turn * 2, xp: 10 + combat.enemies.length * 5 };
}

export function getTurnSummary(combat) {
  const entry = getActiveEntry(combat.turnState);
  if (!entry) return null;
  const eco = getEconomy(combat.turnState, entry.id);
  return {
    active: entry.unit.name,
    team: entry.team,
    round: combat.turnState.round,
    movement: eco.movementRemaining,
    movementMax: eco.movementMax,
    action: !eco.actionUsed,
    bonus: !eco.bonusUsed,
    reaction: eco.reactionAvailable,
  };
}

// Re-export grid helpers used by UI
export { getMovement, getTileSize };
