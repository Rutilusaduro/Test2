import { useState } from "react";
import { getStage, getTileSize } from "../gameData/stages.js";
import { getCorruptionTier } from "../gameData/corruption.js";
import {
  getReachableTiles, moveUnit, attackUnit, castSpell, feedTarget,
  advanceTurn, checkVictory, checkConversion, convertEnemy, getTurnSummary,
  getActiveUnit, isPlayerTurn, useBonusAction, getAvailableBonusActions,
} from "../gameData/combat.js";
import { getPreparedSpells } from "../gameData/spellPreparation.js";
import { hasSpellSlot } from "../gameData/spellSlots.js";
import { renderCombatNarration } from "../hooks/npcInteractions.js";
import { renderGrowthScene } from "../textEngine/scenes/growthEvent/index.js";
import { addBugNote, captureGameContext } from "../hooks/bugLog.js";
import SpellSlotPips from "./SpellSlotPips.jsx";
import DmBanner from "./DmBanner.jsx";

function findEnemyAt(combat, x, y) {
  return combat.enemies.find((e) => {
    const s = getTileSize(getStage(e.lbs).id);
    return e.hp > 0 && !e.converted && x >= e.x && x < e.x + s && y >= e.y && y < e.y + s;
  });
}

function ActionPip({ label, ready, spentFlash }) {
  return (
    <span className={`action-pip${ready ? ' action-pip--ready' : ' action-pip--spent'}${spentFlash ? ' action-pip--flash' : ''}`}>
      <span className="action-pip__dot">{ready ? '●' : '○'}</span>
      <span className="action-pip__label">{label}</span>
    </span>
  );
}

export default function CombatView({ game, combat, onUpdateCombat, onEnd, onDebugContext }) {
  const player = combat.allies.find((a) => a.isPlayer) || game.player;
  const [mode, setMode] = useState("move");
  const [growthText, setGrowthText] = useState("");
  const [overflowCast, setOverflowCast] = useState(false);
  const [selectedEnemyId, setSelectedEnemyId] = useState(null);
  const [actionConfirm, setActionConfirm] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [flashAction, setFlashAction] = useState(null);

  const selectedUnit = getActiveUnit(combat) || combat.allies[0];
  const turnSummary = getTurnSummary(combat);
  const playerTurn = isPlayerTurn(combat);
  const reachable = mode === "move" && playerTurn && selectedUnit
    ? getReachableTiles(combat, selectedUnit)
    : [];
  const spells = getPreparedSpells(player);
  const activeUnit = getActiveUnit(combat) || combat.allies.find((a) => a.isPlayer);
  const bonusActions = activeUnit ? getAvailableBonusActions(activeUnit) : [];
  const selectedEnemy = combat.enemies.find((e) => (e.combatId || e.id) === selectedEnemyId)
    ?? combat.enemies.find((e) => e.id === selectedEnemyId);
  const latestLog = combat.log.slice(-1)[0] || "";

  const reportCombat = (extra = {}) => {
    onDebugContext?.({
      screen: "combat",
      region: game.region,
      interaction: extra.interaction || "combat",
      lastText: extra.lastText || growthText || combat.log.slice(-1)[0],
    });
  };

  const quickLogBug = () => {
    addBugNote({
      category: "combat",
      note: "Combat issue logged during encounter",
      context: captureGameContext(game, {
        screen: "combat",
        region: game.region,
        interaction: "combat",
        lastText: growthText || combat.log.slice(-3).join("\n"),
      }),
    });
    reportCombat({ interaction: "bug_logged" });
  };

  const flashSpend = (kind) => {
    setFlashAction(kind);
    setTimeout(() => setFlashAction(null), 600);
  };

  const update = (c, confirm = "") => {
    onUpdateCombat({ ...c });
    if (confirm) setActionConfirm(confirm);
    if (c.victory) setTimeout(() => onEnd(c), 1500);
    reportCombat({ lastText: growthText || c.log.slice(-1)[0] });
  };

  const cloneCombat = () => {
    const allies = combat.allies.map((a) => ({ ...a }));
    const enemies = combat.enemies.map((e) => ({ ...e }));
    const unitById = new Map(
      [...allies, ...enemies].map((u) => [u.combatId || u.id, u]),
    );
    const order = combat.turnState.order.map((entry) => ({
      ...entry,
      unit: unitById.get(entry.id) ?? entry.unit,
    }));
    const economy = {};
    for (const [id, eco] of Object.entries(combat.turnState.economy ?? {})) {
      economy[id] = { ...eco };
    }
    return {
      ...combat,
      allies,
      enemies,
      log: [...combat.log],
      turnState: {
        ...combat.turnState,
        order,
        economy,
        log: combat.turnState.log ? [...combat.turnState.log] : [],
      },
    };
  };

  const confirmAttack = () => {
    if (!selectedEnemyId || !playerTurn) return;
    const c = cloneCombat();
    const active = getActiveUnit(c);
    const target = c.enemies.find((e) => (e.combatId || e.id) === selectedEnemyId);
    if (!target || !active) return;
    attackUnit(c, active, target);
    c.log.push(renderCombatNarration(active, "attack"));
    if (target.hp <= 0) c.log.push(`${target.name} falls!`);
    flashSpend("action");
    checkVictory(c);
    setSelectedEnemyId(null);
    update(c, "Attack spent.");
  };

  const handleCellClick = (x, y) => {
    if (combat.victory || !isPlayerTurn(combat)) return;
    const c = cloneCombat();
    const active = getActiveUnit(c);

    if (mode === "move" && active) {
      const can = reachable.find((t) => t.x === x && t.y === y);
      if (can) {
        moveUnit(c, active, x, y);
        const summary = getTurnSummary(c);
        setMode(summary?.movement > 0 ? "move" : "action");
        update(c, `Moved to (${x}, ${y}).`);
      }
      return;
    }

    const target = findEnemyAt(c, x, y);
    if (!target) {
      setSelectedEnemyId(null);
      return;
    }

    if (mode === "attack") {
      setSelectedEnemyId(target.combatId || target.id);
      setActionConfirm(`Selected ${target.name} — press Attack to confirm.`);
      return;
    }

    if (mode === "feed" && active) {
      feedTarget(c, active, target, 1);
      const gt = renderGrowthScene(target, {
        growthMethod: "feed", startStage: getStage(target.lbs).id - 1,
        endStage: getStage(target.lbs).id, week: game.day,
      });
      setGrowthText(gt);
      c.log.push(renderCombatNarration(target, "feed"));
      if (checkConversion(target)) convertEnemy(c, target);
      flashSpend("action");
      checkVictory(c);
      setSelectedEnemyId(target.combatId || target.id);
      update(c, `Fed ${target.name}.`);
    }
  };

  const cast = (spell) => {
    if (!isPlayerTurn(combat)) return;
    const c = cloneCombat();
    const caster = c.allies.find((a) => a.isPlayer) || c.allies[0];
    const target = selectedEnemy && selectedEnemy.hp > 0 && !selectedEnemy.converted
      ? selectedEnemy
      : c.enemies.find((e) => e.hp > 0 && !e.converted) || c.allies[1];
    castSpell(c, caster, spell, target, { overflow: overflowCast && spell.overflow });
    if (c.lastGrowth) {
      const gt = renderGrowthScene(c.lastGrowth.unit, {
        growthMethod: "blessing",
        startStage: c.lastGrowth.startStage,
        endStage: c.lastGrowth.endStage,
        week: game.day,
      });
      setGrowthText(gt);
      c.log.push(renderCombatNarration(c.lastGrowth.unit, "growth"));
    }
    flashSpend("action");
    checkVictory(c);
    update(c, `Cast ${spell.name}.`);
  };

  const doBonus = (actionId) => {
    if (!isPlayerTurn(combat)) return;
    const c = cloneCombat();
    const active = getActiveUnit(c);
    const target = selectedEnemy && selectedEnemy.hp > 0 && !selectedEnemy.converted
      ? selectedEnemy
      : c.enemies.find((e) => e.hp > 0 && !e.converted);
    useBonusAction(c, active, actionId, target);
    if (c.lastGrowth) {
      const gt = renderGrowthScene(c.lastGrowth.unit, {
        growthMethod: actionId === 'self_feed' ? 'feed' : 'blessing',
        startStage: c.lastGrowth.startStage,
        endStage: c.lastGrowth.endStage,
        week: game.day,
      });
      setGrowthText(gt);
    }
    flashSpend("bonus");
    checkVictory(c);
    update(c, "Bonus action spent.");
  };

  const finishTurn = () => {
    const c = cloneCombat();
    advanceTurn(c);
    setMode("move");
    setSelectedEnemyId(null);
    setActionConfirm("");
    update(c);
  };

  const movementPct = turnSummary?.movementMax
    ? Math.round((turnSummary.movement / turnSummary.movementMax) * 100)
    : 0;

  const renderCell = (x, y) => {
    let cls = "combat-cell";
    let label = "";
    let hpPct = null;
    for (const a of combat.allies) {
      if (a.hp <= 0) continue;
      const s = getTileSize(getStage(a.lbs).id);
      if (x >= a.x && x < a.x + s && y >= a.y && y < a.y + s) {
        cls += " ally";
        label = a.isPlayer ? "★" : "A";
      }
    }
    for (const e of combat.enemies) {
      if (e.hp <= 0 || e.converted) continue;
      const s = getTileSize(getStage(e.lbs).id);
      if (x >= e.x && x < e.x + s && y >= e.y && y < e.y + s) {
        cls += " enemy";
        if ((e.combatId || e.id) === selectedEnemyId) cls += " selected";
        label = "E";
        hpPct = e.maxHp ? Math.round((e.hp / e.maxHp) * 100) : 100;
      }
    }
    if (reachable.find((t) => t.x === x && t.y === y)) cls += " move";
    return (
      <div key={`${x}-${y}`} className={cls} onClick={() => handleCellClick(x, y)}>
        {label}
        {hpPct != null && (
          <span className="combat-cell__hp" style={{ width: `${hpPct}%` }} />
        )}
      </div>
    );
  };

  const grid = [];
  for (let y = 0; y < combat.gridSize; y++) {
    for (let x = 0; x < combat.gridSize; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div className="app combat-view">
      <div className="header">
        <h1>Round {turnSummary?.round ?? combat.turn} — {turnSummary?.active ?? "…"}</h1>
        <p className="subtitle">
          {isPlayerTurn(combat) ? "Your turn" : "Enemy turn"}
        </p>
      </div>

      <DmBanner game={game} compact />

      {combat.victory && (
        <div className="panel" style={{ borderColor: "var(--gold)", textAlign: "center" }}>
          <h2>{combat.victory === "lose" ? "Defeat…" : "Victory!"}</h2>
        </div>
      )}

      <div className="combat-economy">
        <div className="action-pips">
          <ActionPip label="Action" ready={turnSummary?.action} spentFlash={flashAction === "action"} />
          <ActionPip label="Bonus" ready={turnSummary?.bonus} spentFlash={flashAction === "bonus"} />
          <ActionPip label="Reaction" ready={turnSummary?.reaction} />
        </div>
        <div className="movement-bar" title={`Movement ${turnSummary?.movement ?? 0}/${turnSummary?.movementMax ?? 0}`}>
          <div className="movement-bar__fill" style={{ width: `${movementPct}%` }} />
          <span className="movement-bar__label">Move {turnSummary?.movement ?? 0}/{turnSummary?.movementMax ?? 0}</span>
        </div>
      </div>

      <div className="stats-bar combat-stats">
        <span className="stat">Lv <strong>{player.level}</strong></span>
        <SpellSlotPips player={player} compact />
        <span className="stat">AP <strong>{player.ap}</strong></span>
      </div>

      {selectedEnemy && selectedEnemy.hp > 0 && !selectedEnemy.converted && (
        <div className="panel enemy-inspector">
          <h2>{selectedEnemy.name}</h2>
          <div className="enemy-inspector__hp">
            <div className="enemy-inspector__hp-fill" style={{ width: `${Math.round((selectedEnemy.hp / selectedEnemy.maxHp) * 100)}%` }} />
          </div>
          <div className="stats-bar" style={{ flexWrap: "wrap", marginBottom: 0 }}>
            <span className="stat">HP <strong>{selectedEnemy.hp}/{selectedEnemy.maxHp}</strong></span>
            <span className="stat">{getStage(selectedEnemy.lbs).label}</span>
            <span className="stat">Role: <strong>{selectedEnemy.role || 'foe'}</strong></span>
            <span className="stat">Corruption: <strong>{getCorruptionTier(selectedEnemy.corruption || 0).label}</strong></span>
            <span className="stat">Convert: <strong>{Math.round((selectedEnemy.conversion ?? 0) * 100)}%</strong></span>
          </div>
        </div>
      )}

      <div
        className="combat-grid"
        style={{
          '--grid-cols': combat.gridSize,
          gridTemplateColumns: `repeat(${combat.gridSize}, var(--cell, 36px))`,
        }}
      >
        {grid}
      </div>

      <div className="stats-bar">
        {combat.allies.filter((a) => a.hp > 0).map((a) => (
          <span key={a.id || "player"} className="stat">
            {a.name}: HP {a.hp}/{a.maxHp} · {getStage(a.lbs).label}
          </span>
        ))}
      </div>

      <div className="panel panel--log combat-log-panel">
        <button type="button" className="combat-log-toggle" onClick={() => setLogOpen((v) => !v)}>
          Battle Log {logOpen ? '▾' : '▸'} <span className="combat-log-latest">{latestLog}</span>
        </button>
        {logOpen && (
          <div className="log">
            {combat.log.slice(-14).map((line, i) => <p key={i}>{line}</p>)}
          </div>
        )}
      </div>

      <div className="panel combat-spells-panel">
        <h2>Spells</h2>
        <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>
          <input type="checkbox" checked={overflowCast} onChange={(e) => setOverflowCast(e.target.checked)} />
          {" "}Overflow cast (extra slot/AP, more growth)
        </label>
        <div className="btn-grid">
          {spells.map((s) => {
            const canCast = s.slotLevel === 0 || hasSpellSlot(player, s.slotLevel) || (s.apCost && player.ap >= s.apCost);
            return (
              <button key={s.id} onClick={() => cast(s)} disabled={!isPlayerTurn(combat) || !canCast}>
                {s.name} {s.slotLevel ? `(L${s.slotLevel})` : "(cantrip)"}
                {s.apCost ? ` / ${s.apCost} AP` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {growthText && <div className="panel prose">{growthText}</div>}

      <div className="combat-action-bar">
        {actionConfirm && <p className="combat-action-bar__confirm">{actionConfirm}</p>}
        <div className="combat-action-bar__buttons">
          <button onClick={() => { setMode("move"); setActionConfirm(""); }} disabled={!isPlayerTurn(combat)}>Move</button>
          <button
            onClick={() => {
              if (mode === "attack" && selectedEnemy) confirmAttack();
              else { setMode("attack"); setActionConfirm("Tap an enemy, then Attack again."); }
            }}
            disabled={!isPlayerTurn(combat) || !turnSummary?.action}
          >
            Attack
          </button>
          <button onClick={() => { setMode("feed"); setActionConfirm("Tap an enemy to feed."); }} disabled={!isPlayerTurn(combat)}>Feed</button>
          {bonusActions.map((ba) => (
            <button key={ba.id} onClick={() => doBonus(ba.id)} disabled={!isPlayerTurn(combat) || !turnSummary?.bonus}>
              {ba.label}
            </button>
          ))}
          <button onClick={finishTurn} disabled={!isPlayerTurn(combat)}>End Turn</button>
          <button onClick={quickLogBug}>Log bug</button>
        </div>
      </div>
    </div>
  );
}
