import { getStage, getTileSize, getMovement, advanceStage, getHpBonus } from "./stages.js";
import { addCorruption } from "./corruption.js";
import { getCombatModifiers } from "./stagePerks.js";
import { createEnemy } from "./enemies.js";
import {
  initCombatTurnState, beginTurn, endTurn, getActiveEntry, getEconomy,
  canSpendMovement, spendMovement, canUseAction, spendAction, onUnitGrew,
  ACTION_TYPES, getCombatUnitId, getAvailableBonusActions,
} from "./combatTurn.js";
import {
  resolveAttackRoll,
  resolveMeleeDamage,
  applyCombatDamage,
  applyAttackCritEffects,
  formatAttackSummary,
  ATTACK_TYPES,
  getAttackReach,
} from "./combatRolls.js";
import { resolveCastCost, getSpellPowerMultiplier } from "./spellSlots.js";
import { getSpellForCast } from "./spells.js";

const GRID_SIZE = 10;

function prepareCombatUnit(unit, team, index) {
  return {
    ...unit,
    combatId: getCombatUnitId(unit, team, index),
    x: unit.x ?? 0,
    y: unit.y ?? 0,
  };
}

export function createCombatState(player, party, enemyTypeId, regionId) {
  const enemies = [];
  const count = enemyTypeId === "famine_hag" ? 1 : 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const e = enemyTypeId ? createEnemy(enemyTypeId) : createEnemy("harvest_harpy");
    e.x = GRID_SIZE - 2 - i * 2;
    e.y = 2 + i * 2;
    enemies.push(e);
  }

  const allies = [
    prepareCombatUnit({ ...player, x: 1, y: 4, isPlayer: true }, "ally", 0),
    ...party.map((c, i) => prepareCombatUnit({ ...c, x: 1, y: 6 + i * 2, isPlayer: false }, "ally", i + 1)),
  ];
  const preparedEnemies = enemies.map((e, i) => prepareCombatUnit(e, "enemy", i));

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
  };

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
  const eco = entry ? getEconomy(combat.turnState, entry.id) : { movementRemaining: getMovement(getStage(unit.lbs).id) };
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
  const dist = Math.abs(x - unit.x) + Math.abs(y - unit.y);
  if (entry && !canSpendMovement(combat.turnState, entry.id, dist)) {
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
      combat.log.push(`${target.name}'s body blooms with pleasurable abundance.`);
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

export function applyGrowth(unit, stages = 1) {
  const result = advanceStage(unit, stages);
  const endStage = getStage(unit.lbs).id;
  const hpMult = getHpBonus(endStage) + 0.15;
  const hpBonus = Math.floor(unit.maxHp * hpMult * stages);
  unit.maxHp += hpBonus;
  unit.hp = Math.min(unit.maxHp, unit.hp + hpBonus);
  return result;
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

export function feedTarget(combat, feeder, target, amount = 1) {
  const entry = getActiveEntry(combat.turnState);
  if (entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.ACTION)) {
    combat.log.push("Action already used this turn!");
    return combat;
  }

  const growth = applyGrowth(target, amount);
  target.hunger = Math.min(100, (target.hunger || 0) + 25 * amount);
  addCorruption(target, 5 * amount);
  combat.log.push(`${feeder.name} feeds ${target.name} — she swells with pleasure!`);
  combat.lastGrowth = { unit: target, ...growth };
  if (entry) {
    spendAction(combat.turnState, entry.id, ACTION_TYPES.ACTION);
    onUnitGrew(combat.turnState, target, growth);
    if (combat.turnState.log?.length) combat.log.push(...combat.turnState.log.slice(-2));
  }
  return combat;
}

export function castSpell(combat, caster, spell, target, opts = {}) {
  const entry = getActiveEntry(combat.turnState);
  const castSpellData = getSpellForCast(spell, opts.overflow);
  const cost = resolveCastCost(caster, castSpellData, opts);

  if (!cost.ok) {
    combat.log.push("No spell slots or Abundance Points available!");
    return combat;
  }

  if (castSpellData.slotLevel > 0 && entry && !canUseAction(combat.turnState, entry.id, ACTION_TYPES.ACTION)) {
    combat.log.push("Action already used this turn!");
    if (cost.method === "slot") {
      // refund slot — simplified: don't spend if blocked
    }
    return combat;
  }

  const power = getSpellPowerMultiplier(caster, cost.slotLevelUsed || castSpellData.slotLevel || 1);
  const eff = { ...castSpellData.effect };
  const scale = (n) => (typeof n === "number" ? Math.max(1, Math.round(n * power)) : n);

  if (eff.heal && target) {
    target.hp = Math.min(target.maxHp, target.hp + scale(eff.heal));
    combat.log.push(`${castSpellData.name} bathes ${target.name} in warm healing.`);
  }
  if (eff.growth) {
    let targets;
    if (eff.party && eff.aoe) {
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
    }
    const label = eff.party ? 'your allies' : eff.aoe ? 'the battlefield' : target?.name;
    combat.log.push(`${castSpellData.name} swells ${label} with golden abundance!`);
  }
  if (eff.corruption && target) addCorruption(target, scale(eff.corruption));
  if (eff.feed && target) {
    feedTarget(combat, caster, target, scale(eff.feed));
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

  const costNote = cost.method === "ap" ? ` (${cost.apSpent} AP)` : cost.upcast ? " (upcast)" : "";
  combat.log.push(`Cast ${castSpellData.name}${costNote}.`);

  if (entry && castSpellData.slotLevel > 0) spendAction(combat.turnState, entry.id, ACTION_TYPES.ACTION);
  return combat;
}

export function checkConversion(enemy) {
  return (enemy.hunger >= 80 || enemy.corruption >= 50) && !enemy.converted;
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
    combat.log.push("All enemies converted to Gorgara's gospel!");
  }
  return combat;
}

/** End active unit's turn and run AI for enemies until next player turn or combat end */
export function advanceTurn(combat) {
  if (combat.victory) return combat;

  endTurn(combat.turnState, combat.allies, combat.enemies);
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

function runEnemyAction(combat, enemy) {
  const target = combat.allies.find((a) => a.hp > 0);
  if (!target) return;
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
