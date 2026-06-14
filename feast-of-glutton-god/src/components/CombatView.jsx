import { useState } from "react";
import { getStage, getTileSize } from "../gameData/stages.js";
import {
  getReachableTiles, moveUnit, attackUnit, castSpell, feedTarget,
  advanceTurn, checkVictory, checkConversion, convertEnemy, getTurnSummary,
  getActiveUnit, isPlayerTurn,
} from "../gameData/combat.js";
import { getCharacterSpells } from "../gameData/spellLearning.js";
import { hasSpellSlot } from "../gameData/spellSlots.js";
import { renderCombatNarration } from "../hooks/npcInteractions.js";
import { renderGrowthScene } from "../textEngine/scenes/growthEvent/index.js";
import { addBugNote, captureGameContext } from "../hooks/bugLog.js";

export default function CombatView({ game, combat, onUpdateCombat, onEnd, onDebugContext }) {
  const player = combat.allies.find((a) => a.isPlayer) || game.player;
  const [mode, setMode] = useState("move");
  const [growthText, setGrowthText] = useState("");
  const [overflowCast, setOverflowCast] = useState(false);

  const selectedUnit = getActiveUnit(combat) || combat.allies[0];
  const turnSummary = getTurnSummary(combat);
  const playerTurn = isPlayerTurn(combat);
  const reachable = mode === "move" && playerTurn && selectedUnit
    ? getReachableTiles(combat, selectedUnit)
    : [];
  const spells = getCharacterSpells(player);
  const slots = player.spellSlots?.current || [];

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

  const update = (c) => {
    onUpdateCombat({ ...c });
    if (c.victory) setTimeout(() => onEnd(c), 1500);
    reportCombat({ lastText: growthText || c.log.slice(-1)[0] });
  };

  const selectMove = () => {
    setMode("move");
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
        update(c);
      }
      return;
    }

    if (mode === "attack") {
      const target = c.enemies.find((e) => {
        const s = getTileSize(getStage(e.lbs).id);
        return e.hp > 0 && x >= e.x && x < e.x + s && y >= e.y && y < e.y + s;
      });
      if (target && active) {
        attackUnit(c, active, target);
        c.log.push(renderCombatNarration(active, "attack"));
        if (target.hp <= 0) c.log.push(`${target.name} falls!`);
        checkVictory(c);
        update(c);
      }
      return;
    }

    if (mode === "feed") {
      const target = c.enemies.find((e) => {
        const s = getTileSize(getStage(e.lbs).id);
        return e.hp > 0 && !e.converted && x >= e.x && x < e.x + s && y >= e.y && y < e.y + s;
      });
      if (target && active) {
        feedTarget(c, active, target, 1);
        const gt = renderGrowthScene(target, {
          growthMethod: "feed", startStage: getStage(target.lbs).id - 1,
          endStage: getStage(target.lbs).id, week: game.day,
        });
        setGrowthText(gt);
        c.log.push(renderCombatNarration(target, "feed"));
        if (checkConversion(target)) convertEnemy(c, target);
        checkVictory(c);
        update(c);
      }
    }
  };

  const cast = (spell) => {
    if (!isPlayerTurn(combat)) return;
    const c = cloneCombat();
    const caster = c.allies.find((a) => a.isPlayer) || c.allies[0];
    const target = c.enemies.find((e) => e.hp > 0 && !e.converted) || c.allies[1];
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
    checkVictory(c);
    update(c);
  };

  const finishTurn = () => {
    const c = cloneCombat();
    advanceTurn(c);
    setMode("move");
    update(c);
  };

  const slotLabel = (lvl) => {
    const n = slots[lvl - 1] ?? 0;
    const max = player.spellSlots?.max?.[lvl - 1] ?? 0;
    return max > 0 ? `${lvl}: ${n}/${max}` : null;
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
        <h1>Round {turnSummary?.round ?? combat.turn} — {turnSummary?.active ?? "…"}</h1>
        <p className="subtitle">
          {isPlayerTurn(combat) ? "Your turn" : "Enemy turn"} ·
          Move {turnSummary?.movement ?? 0}/{turnSummary?.movementMax ?? 0} ·
          Action {turnSummary?.action ? "ready" : "spent"} ·
          Bonus {turnSummary?.bonus ? "ready" : "spent"}
        </p>
      </div>

      {combat.victory && (
        <div className="panel" style={{ borderColor: "var(--gold)", textAlign: "center" }}>
          <h2>{combat.victory === "lose" ? "Defeat…" : "Victory!"}</h2>
        </div>
      )}

      <div className="stats-bar">
        <span className="stat">Lv <strong>{player.level}</strong></span>
        {[1, 2, 3, 4, 5].map((l) => slotLabel(l)).filter(Boolean).map((s, i) => (
          <span key={i} className="stat">Slots <strong>{s}</strong></span>
        ))}
        <span className="stat">AP <strong>{player.ap}</strong></span>
      </div>

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
          <button onClick={selectMove} disabled={!isPlayerTurn(combat)}>Move</button>
          <button onClick={() => { setMode("attack"); }} disabled={!isPlayerTurn(combat)}>Attack</button>
          <button onClick={() => { setMode("feed"); }} disabled={!isPlayerTurn(combat)}>Feed</button>
          <button onClick={finishTurn} disabled={!isPlayerTurn(combat)}>End Turn</button>
          <button onClick={quickLogBug}>Log bug</button>
        </div>
      </div>

      <div className="panel">
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

      <div className="panel">
        <h2>Battle Log</h2>
        <div className="log">
          {combat.log.slice(-14).map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
}
