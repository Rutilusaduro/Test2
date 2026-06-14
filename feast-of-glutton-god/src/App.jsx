import { useState, useCallback } from "react";
import TitleScreen from "./components/TitleScreen.jsx";
import CharacterCreation from "./components/CharacterCreation.jsx";
import WorldView from "./components/WorldView.jsx";
import CombatView from "./components/CombatView.jsx";
import LevelUpModal from "./components/LevelUpModal.jsx";
import GameDebugShell from "./components/GameDebugShell.jsx";
import { createNewGame, addAbundancePoints, syncPlayerFromCombat, ensureDmState } from "./gameData/player.js";
import { clearTransient, narrateEvent } from "./gameData/narrator.js";
import { saveGame, loadGame } from "./gameData/save.js";
import { createCombatState, getCombatRewards } from "./gameData/combat.js";
import { pickEncounter } from "./gameData/enemies.js";
import { awardCombatXp, initializeStartingSpells } from "./gameData/leveling.js";
import { initSpellSlots } from "./gameData/spellSlots.js";
import { ensureQuestState } from "./gameData/questEngine.js";
import { ensureInfluenceState } from "./gameData/influence.js";
import { ensureTransformationState } from "./gameData/worldTransformation.js";
import { ensureReactivityState } from "./gameData/worldReactivity.js";
import { ensurePartyUniversalSize } from "./gameData/universalSize.js";
import { recordCombatEndForQuests } from "./hooks/questHooks.js";
import { recordPuzzleSolvedForQuests } from "./hooks/puzzleHooks.js";
import { applySolutionImmediate } from "./gameData/puzzleEngine.js";
import { recordCombatVictory } from "./gameData/obstacleUnlocks.js";
import { syncGateUnlocks } from "./gameData/regionObstacles.js";
import { ensureSpellState, getCharacterSpells } from "./gameData/spellLearning.js";
import { autoPrepareSpells } from "./gameData/spellPreparation.js";
import { completePendingLevelUp as completeLevelUpChoice } from "./gameData/levelUpChoices.js";
import "./textEngine/scenes/index.js";

function migratePlayerSpells(player) {
  ensureSpellState(player);
  if (!player.spellsKnown?.length && player.spells?.length) {
    player.spellsKnown = player.spells.map((s) => s.id).filter(Boolean);
  }
  if (!player.spells?.length && player.spellsKnown?.length) {
    player.spells = getCharacterSpells(player);
  }
  if (!player.spellsKnown?.length) {
    initializeStartingSpells(player);
  }
  if (player.classId === 'wizard' && !player.spellsPrepared?.length) {
    autoPrepareSpells(player);
  }
}

function applyLevelUpResults(game, levelUps) {
  if (!levelUps?.length) return game;
  const last = levelUps[levelUps.length - 1];
  game.lastLevelUpResult = last;
  const message = levelUps.map((lu) => lu.narrative || `Level ${lu.level}! ${lu.flavor}`).join("\n\n---\n\n");
  game.lastLevelUpMessage = message;
  narrateEvent(game, message, 'levelup');
  return game;
}

export default function App() {
  const [screen, setScreen] = useState("title");
  const [game, setGame] = useState(null);
  const [debugContext, setDebugContext] = useState({});

  const startNewGame = useCallback((name, classId, options = {}) => {
    const g = createNewGame(name, classId, options);
    ensurePartyUniversalSize(g);
    ensureQuestState(g);
    ensureInfluenceState(g);
    ensureTransformationState(g);
    ensureReactivityState(g);
    ensureDmState(g);
    setGame(g);
    setScreen("world");
  }, []);

  const continueGame = useCallback(() => {
    const g = loadGame();
    if (g) {
      if (!g.player.spellSlots) initSpellSlots(g.player);
      if (!g.player.sizeCap) g.player.sizeCap = 3;
      ensureInfluenceState(g);
      ensureTransformationState(g);
      ensureReactivityState(g);
      if (!g.player.raceId) g.player.raceId = 'human';
      if (!g.player.raceName) g.player.raceName = 'Human';
      migratePlayerSpells(g.player);
      ensureQuestState(g);
      ensurePartyUniversalSize(g);
      ensureDmState(g);
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

  const handleLevelUpComplete = useCallback((payload = {}) => {
    setGame((prev) => {
      const next = { ...prev };
      const result = completeLevelUpChoice(next.player, payload);
      if (result?.learned?.length) {
        const names = result.learned.map((s) => s.name).join(', ');
        narrateEvent(next, `Learned: ${names}`, 'levelup');
      }
      if (result?.asi) {
        const asiMsg = `${result.asi.label} +2`;
        next.lastLevelUpMessage = (next.lastLevelUpMessage || '') + `\n\n${asiMsg}`;
        narrateEvent(next, asiMsg, 'levelup');
      }
      const pending = next.player.levelUpsPending?.[0];
      if (pending) {
        next.lastLevelUpResult = { level: pending.level, narrative: pending.narrative };
      } else {
        next.lastLevelUpResult = null;
      }
      saveGame(next);
      return next;
    });
  }, []);

  const startCombat = useCallback((enemyTypeId) => {
    setGame((prev) => {
      clearTransient(prev);
      const combat = createCombatState(prev.player, prev.party, enemyTypeId, prev.region);
      const next = { ...prev, combat };
      saveGame(next);
      return next;
    });
    setScreen("combat");
  }, []);

  const startPuzzleCombat = useCallback((pending) => {
    setGame((prev) => {
      clearTransient(prev);
      const combat = createCombatState(prev.player, prev.party, pending.enemyId, prev.region);
      const next = {
        ...prev,
        combat,
        pendingPuzzleCombat: pending,
      };
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
      const { levelUps } = awardCombatXp(next.player, combat);
      applyLevelUpResults(next, levelUps);
      const quest = recordCombatEndForQuests(next, combat);
      if (quest.questMessages) {
        narrateEvent(next, quest.questMessages, 'quest');
      }

      if (combat.victory === 'win' || combat.victory === 'converted') {
        for (const enemy of combat.enemies ?? []) {
          const enemyId = enemy.typeId ?? enemy.enemyTypeId ?? enemy.id;
          if (enemyId) recordCombatVictory(next, enemyId);
        }
        const gateMsgs = syncGateUnlocks(next, { regionId: next.region });
        if (gateMsgs.length) {
          narrateEvent(next, gateMsgs.join('\n\n---\n\n'), 'growth');
        }
      }

      const pending = prev.pendingPuzzleCombat;
      if (pending && (combat.victory === 'win' || combat.victory === 'converted')) {
        const solveResult = applySolutionImmediate(next, pending.puzzleId, pending.solutionId);
        const puzzleQuest = recordPuzzleSolvedForQuests(next, {
          puzzleId: pending.puzzleId,
          solutionId: pending.solutionId,
        });
        const puzzleNote = solveResult.text || 'The obstacle yields to your victory.';
        narrateEvent(next, [puzzleNote, puzzleQuest.questMessages].filter(Boolean).join('\n\n---\n\n'), 'quest');
        next.pendingPuzzleCombat = null;
      } else if (pending) {
        next.pendingPuzzleCombat = null;
        narrateEvent(next, 'The obstacle remains — but you live to try another delicious approach.', 'quest');
      }

      next.combat = null;
      clearTransient(next);
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

  const levelUpPending = game?.player?.levelUpsPending?.[0] ?? null;
  const showLevelUp = game && (levelUpPending || game.lastLevelUpResult);

  const worldContent = game ? (
    <>
      <WorldView
        game={game}
        onUpdate={updateGame}
        onEncounter={randomEncounter}
        onPuzzleCombat={startPuzzleCombat}
        onSave={() => saveGame(game)}
        onDebugContext={updateDebugContext}
      />
      {showLevelUp && (
        <LevelUpModal
          game={game}
          pending={levelUpPending}
          levelUpResult={game.lastLevelUpResult}
          onComplete={handleLevelUpComplete}
        />
      )}
    </>
  ) : null;

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
        {worldContent}
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
