import { useState, useCallback } from "react";
import TitleScreen from "./components/TitleScreen.jsx";
import CharacterCreation from "./components/CharacterCreation.jsx";
import WorldView from "./components/WorldView.jsx";
import CombatView from "./components/CombatView.jsx";
import GameDebugShell from "./components/GameDebugShell.jsx";
import { createNewGame, addAbundancePoints, syncPlayerFromCombat } from "./gameData/player.js";
import { saveGame, loadGame } from "./gameData/save.js";
import { createCombatState, getCombatRewards } from "./gameData/combat.js";
import { pickEncounter } from "./gameData/enemies.js";
import "./textEngine/scenes/index.js";

export default function App() {
  const [screen, setScreen] = useState("title");
  const [game, setGame] = useState(null);
  const [debugContext, setDebugContext] = useState({});

  const startNewGame = useCallback((name, classId) => {
    const g = createNewGame(name, classId);
    setGame(g);
    setScreen("world");
  }, []);

  const continueGame = useCallback(() => {
    const g = loadGame();
    if (g) {
      setGame(g);
      setScreen("world");
    }
  }, []);

  const updateGame = useCallback((updater) => {
    setGame((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveGame(next);
      return next;
    });
  }, []);

  const startCombat = useCallback((enemyTypeId) => {
    setGame((prev) => {
      const combat = createCombatState(prev.player, prev.party, enemyTypeId, prev.region);
      const next = { ...prev, combat };
      saveGame(next);
      return next;
    });
    setScreen("combat");
  }, []);

  const endCombat = useCallback((combat) => {
    setGame((prev) => {
      let next = syncPlayerFromCombat(prev, combat);
      const rewards = getCombatRewards(combat);
      next = addAbundancePoints(next, rewards.ap);
      next.player.xp = (next.player.xp || 0) + rewards.xp;
      next.combat = null;
      saveGame(next);
      return next;
    });
    setScreen("world");
  }, []);

  const randomEncounter = useCallback(() => {
    if (!game) return;
    const enemy = pickEncounter(game.region);
    startCombat(enemy.id);
  }, [game, startCombat]);

  const updateDebugContext = useCallback((patch) => {
    setDebugContext((prev) => ({ ...prev, ...patch }));
  }, []);

  if (screen === "combat" && game?.combat) {
    return (
      <GameDebugShell game={game} onUpdateGame={updateGame} screen="combat" debugContext={debugContext}>
        <CombatView
          game={game}
          combat={game.combat}
          onUpdateCombat={(c) => updateGame((g) => ({ ...g, combat: c }))}
          onEnd={endCombat}
          onDebugContext={updateDebugContext}
        />
      </GameDebugShell>
    );
  }

  if (screen === "world" && game) {
    return (
      <GameDebugShell game={game} onUpdateGame={updateGame} screen="world" debugContext={debugContext}>
        <WorldView
          game={game}
          onUpdate={updateGame}
          onEncounter={randomEncounter}
          onSave={() => saveGame(game)}
          onDebugContext={updateDebugContext}
        />
      </GameDebugShell>
    );
  }

  if (screen === "title") {
    return <TitleScreen onNew={() => setScreen("create")} onContinue={continueGame} />;
  }

  if (screen === "create") {
    return <CharacterCreation onBack={() => setScreen("title")} onStart={startNewGame} />;
  }

  return <TitleScreen onNew={() => setScreen("create")} onContinue={continueGame} />;
}
