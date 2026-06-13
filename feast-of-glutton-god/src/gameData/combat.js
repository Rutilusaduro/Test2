import { getStage, getTileSize, getMovement, getHpBonus, advanceStage } from "./stages.js";
import { addCorruption } from "./corruption.js";
import { createEnemy } from "./enemies.js";

const GRID_SIZE = 10;

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
    { ...player, x: 1, y: 4, isPlayer: true },
    ...party.map((c, i) => ({ ...c, x: 1, y: 6 + i * 2, isPlayer: false })),
  ];

  return {
    gridSize: GRID_SIZE,
    turn: 0,
    phase: "player",
    selectedUnit: null,
    selectedAction: null,
    selectedSpell: null,
    log: ["Combat begins! Abundance fills the air."],
    allies,
    enemies,
    feastTiles: [],
    victory: null,
    regionId,
  };
}

export function getUnitAt(combat, x, y, team) {
  const units = team === "ally" ? combat.allies : combat.enemies;
  return units.find((u) => {
    const size = getTileSize(getStage(u.lbs).id);
    return x >= u.x && x < u.x + size && y >= u.y && y < u.y + size && u.hp > 0;
  });
}

export function canMoveTo(combat, unit, nx, ny) {
  const size = getTileSize(getStage(unit.lbs).id);
  if (nx < 0 || ny < 0 || nx + size > combat.gridSize || ny + size > combat.gridSize) return false;
  for (let dx = 0; dx < size; dx++) {
    for (let dy = 0; dy < size; dy++) {
      const ox = unit.x + dx, oy = unit.y + dy;
      if (ox === nx + dx && oy === ny + dy) continue;
      if (getUnitAt(combat, nx + dx, ny + dy, "ally") && !combat.allies.includes(unit)) return false;
      if (getUnitAt(combat, nx + dx, ny + dy, "enemy") && !combat.enemies.includes(unit)) return false;
      if (getUnitAt(combat, nx + dx, ny + dy, "enemy") && combat.enemies.includes(unit)) return false;
      if (getUnitAt(combat, nx + dx, ny + dy, "ally") && combat.allies.includes(unit) && (nx + dx !== ox || ny + dy !== oy)) return false;
    }
  }
  return true;
}

export function getReachableTiles(combat, unit) {
  const move = getMovement(getStage(unit.lbs).id);
  const size = getTileSize(getStage(unit.lbs).id);
  const tiles = [];
  for (let x = 0; x <= combat.gridSize - size; x++) {
    for (let y = 0; y <= combat.gridSize - size; y++) {
      const dist = Math.abs(x - unit.x) + Math.abs(y - unit.y);
      if (dist > 0 && dist <= move && canMoveTo(combat, unit, x, y)) {
        tiles.push({ x, y });
      }
    }
  }
  return tiles;
}

export function moveUnit(combat, unit, x, y) {
  unit.x = x;
  unit.y = y;
  combat.log.push(`${unit.name} moves (${getStage(unit.lbs).label}).`);
  return combat;
}

export function attackUnit(combat, attacker, target) {
  const stage = getStage(attacker.lbs).id;
  const baseDmg = 4 + Math.floor(stage / 2);
  const bonus = stage >= 7 ? 4 : stage >= 4 ? 2 : 0;
  const dmg = baseDmg + bonus + Math.floor(Math.random() * 4);
  target.hp = Math.max(0, target.hp - dmg);
  combat.log.push(`${attacker.name} strikes ${target.name} for ${dmg} damage!`);
  if (stage >= 6) {
    combat.log.push(`The weight of ${attacker.name}'s body adds crushing force.`);
  }
  return combat;
}

export function applyGrowth(unit, stages = 1) {
  const result = advanceStage(unit, stages);
  const hpBonus = Math.floor(unit.maxHp * 0.15 * stages);
  unit.maxHp += hpBonus;
  unit.hp = Math.min(unit.maxHp, unit.hp + hpBonus);
  return result;
}

export function feedTarget(combat, feeder, target, amount = 1) {
  const growth = applyGrowth(target, amount);
  target.hunger = Math.min(100, (target.hunger || 0) + 25 * amount);
  addCorruption(target, 5 * amount);
  combat.log.push(`${feeder.name} feeds ${target.name} — she swells with pleasure!`);
  combat.lastGrowth = { unit: target, ...growth };
  return combat;
}

export function castSpell(combat, caster, spell, target) {
  if (caster.mp < (spell.mp || 0)) {
    combat.log.push("Not enough MP!");
    return combat;
  }
  caster.mp -= spell.mp || 0;
  const eff = spell.effect || {};

  if (eff.heal && target) {
    target.hp = Math.min(target.maxHp, target.hp + eff.heal);
    combat.log.push(`${spell.name} heals ${target.name}.`);
  }
  if (eff.growth) {
    const targets = eff.aoe ? [...combat.enemies, ...combat.allies] : [target];
    for (const t of targets.filter(Boolean)) {
      const g = applyGrowth(t, eff.growth);
      addCorruption(t, 3 * eff.growth);
      combat.lastGrowth = { unit: t, ...g };
    }
    combat.log.push(`${spell.name} swells ${eff.aoe ? "everyone" : target.name} with golden abundance!`);
  }
  if (eff.corruption && target) {
    addCorruption(target, eff.corruption);
  }
  if (eff.feed && target) {
    feedTarget(combat, caster, target, eff.feed);
  }
  if (eff.charm && target) {
    target.hunger = Math.min(100, (target.hunger || 0) + 30);
    addCorruption(target, 8);
    combat.log.push(`${target.name} is charmed by jiggling abundance.`);
  }
  if (eff.selfGrowth) {
    const g = applyGrowth(caster, eff.selfGrowth);
    combat.lastGrowth = { unit: caster, ...g };
  }
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

export function enemyAiTurn(combat) {
  const enemies = combat.enemies.filter((e) => e.hp > 0 && !e.converted);
  for (const enemy of enemies) {
    const target = combat.allies.filter((a) => a.hp > 0)[0];
    if (!target) break;
    const dist = Math.abs(enemy.x - target.x) + Math.abs(enemy.y - target.y);
    if (dist <= 2) {
      attackUnit(combat, enemy, target);
    } else {
      const dx = target.x > enemy.x ? 1 : target.x < enemy.x ? -1 : 0;
      const dy = target.y > enemy.y ? 1 : target.y < enemy.y ? -1 : 0;
      const nx = enemy.x + dx;
      const ny = enemy.y + dy;
      if (canMoveTo(combat, enemy, nx, ny)) {
        moveUnit(combat, enemy, nx, ny);
      }
    }
    if (checkConversion(enemy)) convertEnemy(combat, enemy);
  }
  combat.phase = "player";
  combat.turn += 1;
  checkVictory(combat);
  return combat;
}

export function getCombatRewards(combat) {
  if (!combat.victory || combat.victory === "lose") return { ap: 0, xp: 0 };
  const base = combat.victory === "converted" ? 25 : 15;
  return { ap: base + combat.turn * 2, xp: 10 + combat.enemies.length * 5 };
}
