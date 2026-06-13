/**
 * Combat turn system — initiative, action economy, turn hooks.
 *
 * Per turn: Movement + 1 Action + 1 Bonus Action + 1 Reaction (until next turn)
 * Phases: start_of_turn → during_turn → end_of_turn
 *
 * Size hooks:
 *   Stage 7+: Body Slam available as bonus action
 *   Stage 10+: Crushing Presence (end of turn aura — stub for future)
 */
import { getStage, getTileSize, getMovement } from "./stages.js";
import { rollInitiative, getEffectiveStatMod } from "./stats.js";

export const TURN_PHASES = {
  START: "start_of_turn",
  DURING: "during_turn",
  END: "end_of_turn",
};

export const ACTION_TYPES = {
  MOVE: "move",
  ACTION: "action",
  BONUS: "bonus",
  REACTION: "reaction",
};

/** Fresh action economy for one unit's turn */
export function createTurnEconomy(unit) {
  const stageId = getStage(unit.lbs).id;
  const baseMove = getMovement(stageId);
  const dexBonus = Math.max(0, getEffectiveStatMod(unit, "dex"));
  return {
    movementMax: baseMove + (stageId <= 3 ? dexBonus : 0),
    movementRemaining: baseMove + (stageId <= 3 ? dexBonus : 0),
    actionUsed: false,
    bonusUsed: false,
    reactionAvailable: true,
    freeInteract: true,
    growthThisTurn: false,
  };
}

export function getCombatUnitId(unit, team, index) {
  return unit.combatId || unit.id || `${team}_${index}`;
}

/** Roll initiative for all units; returns sorted order */
export function buildInitiativeOrder(allies, enemies, rng = Math.random) {
  const entries = [];
  allies.forEach((u, i) => {
    if (u.hp <= 0) return;
    const init = rollInitiative(u, rng);
    entries.push({
      unit: u,
      team: "ally",
      id: getCombatUnitId(u, "ally", i),
      ...init,
    });
  });
  enemies.forEach((u, i) => {
    if (u.hp <= 0 || u.converted) return;
    const init = rollInitiative(u, rng);
    entries.push({
      unit: u,
      team: "enemy",
      id: getCombatUnitId(u, "enemy", i),
      ...init,
    });
  });
  entries.sort((a, b) => b.total - a.total || b.dex - a.dex);
  return entries;
}

export function initCombatTurnState(allies, enemies) {
  const order = buildInitiativeOrder(allies, enemies);
  const economy = {};
  for (const e of order) {
    economy[e.id] = createTurnEconomy(e.unit);
  }
  return {
    round: 1,
    turnIndex: 0,
    order,
    economy,
    phase: TURN_PHASES.START,
    activeUnitId: order[0]?.id ?? null,
    hooks: { start: [], end: [], onGrowth: [] },
    log: [],
  };
}

export function getActiveEntry(turnState) {
  return turnState.order[turnState.turnIndex] ?? null;
}

export function getEconomy(turnState, unitId) {
  return turnState.economy[unitId] ?? createTurnEconomy({});
}

/** Start-of-turn hooks — reset economy, apply auras */
export function beginTurn(turnState, combat) {
  const entry = getActiveEntry(turnState);
  if (!entry) return turnState;
  turnState.phase = TURN_PHASES.START;
  turnState.activeUnitId = entry.id;
  turnState.economy[entry.id] = createTurnEconomy(entry.unit);

  const lines = [];
  lines.push(`── Round ${turnState.round}: ${entry.unit.name}'s turn ──`);

  const stageId = getStage(entry.unit.lbs).id;
  if (stageId >= 7 && entry.team === "ally") {
    lines.push(`${entry.unit.name}'s vast form commands the grid (${getTileSize(stageId)}×${getTileSize(stageId)}).`);
  }

  turnState.log = [...(turnState.log || []), ...lines];
  turnState.phase = TURN_PHASES.DURING;
  return turnState;
}

/** Can unit spend movement? */
export function canSpendMovement(turnState, unitId, tiles = 1) {
  const eco = getEconomy(turnState, unitId);
  return eco.movementRemaining >= tiles;
}

export function spendMovement(turnState, unitId, tiles) {
  const eco = getEconomy(turnState, unitId);
  eco.movementRemaining = Math.max(0, eco.movementRemaining - tiles);
  return turnState;
}

export function canUseAction(turnState, unitId, type = ACTION_TYPES.ACTION) {
  const eco = getEconomy(turnState, unitId);
  if (type === ACTION_TYPES.ACTION) return !eco.actionUsed;
  if (type === ACTION_TYPES.BONUS) return !eco.bonusUsed;
  if (type === ACTION_TYPES.REACTION) return eco.reactionAvailable;
  return true;
}

export function spendAction(turnState, unitId, type = ACTION_TYPES.ACTION) {
  const eco = getEconomy(turnState, unitId);
  if (type === ACTION_TYPES.ACTION) eco.actionUsed = true;
  if (type === ACTION_TYPES.BONUS) eco.bonusUsed = true;
  if (type === ACTION_TYPES.REACTION) eco.reactionAvailable = false;
  return turnState;
}

/** Growth mid-turn — update footprint, grant temp HP, flag economy */
export function onUnitGrew(turnState, unit, growthResult) {
  const id = unit.combatId || unit.id;
  const eco = getEconomy(turnState, id);
  eco.growthThisTurn = true;
  const newStage = growthResult.endStage;
  const newEco = createTurnEconomy(unit);
  eco.movementMax = newEco.movementMax;
  eco.movementRemaining = Math.min(eco.movementRemaining, newEco.movementMax);
  turnState.log = [...(turnState.log || []), `${unit.name} swells to ${getStage(unit.lbs).label} — footprint updated!`];
  if (newStage >= 7) {
    turnState.log.push("Her growing mass grants a Body Slam opportunity (bonus action).");
  }
  return turnState;
}

/** End current turn, advance to next living unit */
export function endTurn(turnState, allies, enemies) {
  turnState.phase = TURN_PHASES.END;
  const entry = getActiveEntry(turnState);
  if (entry) {
    const stageId = getStage(entry.unit.lbs).id;
    if (stageId >= 10) {
      turnState.log = [...(turnState.log || []), `${entry.unit.name}'s crushing presence ripples outward.`];
    }
  }

  let nextIndex = turnState.turnIndex + 1;
  if (nextIndex >= turnState.order.length) {
    turnState.round += 1;
    turnState.order = buildInitiativeOrder(allies, enemies);
    nextIndex = 0;
  }

  while (nextIndex < turnState.order.length) {
    const e = turnState.order[nextIndex];
    const alive = e.team === "ally" ? e.unit.hp > 0 : e.unit.hp > 0 && !e.unit.converted;
    if (alive) break;
    nextIndex += 1;
    if (nextIndex >= turnState.order.length) {
      turnState.round += 1;
      turnState.order = buildInitiativeOrder(allies, enemies);
      nextIndex = 0;
      break;
    }
  }

  turnState.turnIndex = nextIndex;
  return beginTurn(turnState, null);
}

/** Bonus actions unlocked by size */
export function getAvailableBonusActions(unit) {
  const stageId = getStage(unit.lbs).id;
  const actions = [];
  if (stageId >= 4) actions.push({ id: "self_feed", label: "Self-Feed (+1 stage)" });
  if (stageId >= 7) actions.push({ id: "body_slam", label: "Body Slam" });
  if (stageId >= 9) actions.push({ id: "crushing_aura", label: "Crushing Aura" });
  return actions;
}

export function isPlayerControlled(entry) {
  return entry?.team === "ally";
}
