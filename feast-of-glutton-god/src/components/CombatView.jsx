import { useState } from "react";
import { getStage, getTileSize } from "../gameData/stages.js";
import {
  getReachableTiles, moveUnit, attackUnit, castSpell, feedTarget,
  enemyAiTurn, checkVictory, checkConversion, convertEnemy,
} from "../gameData/combat.js";
import { getSpellsForClass } from "../gameData/spells.js";
import { renderCombatNarration } from "../hooks/npcInteractions.js";
import { renderGrowthScene } from "../textEngine/scenes/growthEvent/index.js";

export default function CombatView({ game, combat, onUpdateCombat, onEnd }) {
  const [selectedUnit, setSelectedUnit] = useState(combat.allies[0]);
  const [mode, setMode] = useState("move");
  const [growthText, setGrowthText] = useState("");
  const [reachable, setReachable] = useState([]);

  const spells = getSpellsForClass(game.player.classId);
  const size = selectedUnit ? getTileSize(getStage(selectedUnit.lbs).id) : 1;

  const update = (c) => {
    onUpdateCombat({ ...c });
    if (c.victory) setTimeout(() => onEnd(c), 1500);
  };

  const selectMove = () => {
    setMode("move");
    if (selectedUnit) setReachable(getReachableTiles(combat, selectedUnit));
  };

  const handleCellClick = (x, y) => {
    if (combat.victory) return;
    const c = { ...combat, allies: [...combat.allies], enemies: [...combat.enemies], log: [...combat.log] };

    if (mode === "move" && selectedUnit) {
      const can = reachable.find((t) => t.x === x && t.y === y);
      if (can) {
        moveUnit(c, selectedUnit, x, y);
        setReachable([]);
        setMode("action");
        update(c);
      }
      return;
    }

    if (mode === "attack") {
      const target = c.enemies.find((e) => {
        const s = getTileSize(getStage(e.lbs).id);
        return e.hp > 0 && x >= e.x && x < e.x + s && y >= e.y && y < e.y + s;
      });
      if (target && selectedUnit) {
        attackUnit(c, selectedUnit, target);
        c.log.push(renderCombatNarration(selectedUnit, "attack"));
        if (target.hp <= 0) c.log.push(`${target.name} falls!`);
        checkVictory(c);
        if (!c.victory) enemyAiTurn(c);
        update(c);
      }
      return;
    }

    if (mode === "feed") {
      const target = c.enemies.find((e) => {
        const s = getTileSize(getStage(e.lbs).id);
        return e.hp > 0 && !e.converted && x >= e.x && x < e.x + s && y >= e.y && y < e.y + s;
      });
      if (target && selectedUnit) {
        feedTarget(c, selectedUnit, target, 1);
        const gt = renderGrowthScene(target, {
          growthMethod: "feed", startStage: getStage(target.lbs).id - 1,
          endStage: getStage(target.lbs).id, week: game.day,
        });
        setGrowthText(gt);
        c.log.push(renderCombatNarration(target, "feed"));
        if (checkConversion(target)) convertEnemy(c, target);
        checkVictory(c);
        if (!c.victory) enemyAiTurn(c);
        update(c);
      }
    }
  };

  const cast = (spell) => {
    const c = { ...combat, allies: [...combat.allies], enemies: [...combat.enemies], log: [...combat.log] };
    const caster = c.allies.find((a) => a.isPlayer) || c.allies[0];
    const target = c.enemies.find((e) => e.hp > 0) || c.allies[1];
    castSpell(c, caster, spell, target);
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
    checkVictory(c);
    if (!c.victory) enemyAiTurn(c);
    update(c);
  };

  const endTurn = () => {
    const c = { ...combat, allies: [...combat.allies], enemies: [...combat.enemies], log: [...combat.log] };
    enemyAiTurn(c);
    update(c);
  };

  const renderCell = (x, y) => {
    let cls = "combat-cell";
    let label = "";
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
        label = "E";
      }
    }
    if (reachable.find((t) => t.x === x && t.y === y)) cls += " move";
    return (
      <div key={`${x}-${y}`} className={cls} onClick={() => handleCellClick(x, y)}>
        {label}
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
    <div className="app">
      <div className="header">
        <h1>Combat — Turn {combat.turn + 1}</h1>
        <p className="subtitle">Grow. Feed. Convert. Conquer.</p>
      </div>

      {combat.victory && (
        <div className="panel" style={{ borderColor: "var(--gold)", textAlign: "center" }}>
          <h2>{combat.victory === "lose" ? "Defeat…" : "Victory!"}</h2>
        </div>
      )}

      <div className="combat-grid" style={{ gridTemplateColumns: `repeat(${combat.gridSize}, 36px)` }}>
        {grid}
      </div>

      <div className="stats-bar">
        {combat.allies.filter((a) => a.hp > 0).map((a) => (
          <span key={a.id || "player"} className="stat">
            {a.name}: HP {a.hp}/{a.maxHp} · {getStage(a.lbs).label}
          </span>
        ))}
      </div>

      <div className="panel">
        <h2>Actions</h2>
        <div className="btn-grid">
          <button onClick={selectMove}>Move</button>
          <button onClick={() => { setMode("attack"); setReachable([]); }}>Attack</button>
          <button onClick={() => { setMode("feed"); setReachable([]); }}>Feed Enemy</button>
          <button onClick={endTurn}>End Turn</button>
        </div>
      </div>

      <div className="panel">
        <h2>Spells</h2>
        <div className="btn-grid">
          {spells.map((s) => (
            <button key={s.id} onClick={() => cast(s)} disabled={game.player.mp < (s.mp || 0)}>
              {s.name} ({s.mp || 0} MP)
            </button>
          ))}
        </div>
      </div>

      {growthText && (
        <div className="panel prose">{growthText}</div>
      )}

      <div className="panel">
        <h2>Battle Log</h2>
        <div className="log">
          {combat.log.slice(-12).map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
}
