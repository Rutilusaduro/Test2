import { useState, useCallback } from "react";
import TitleScreen from "./components/TitleScreen.jsx";
import CharacterCreation from "./components/CharacterCreation.jsx";
import WorldView from "./components/WorldView.jsx";
import CombatView from "./components/CombatView.jsx";
import CombatScenePopup from "./components/CombatScenePopup.jsx";
import LevelUpModal from "./components/LevelUpModal.jsx";
import GameDebugShell from "./components/GameDebugShell.jsx";
import { createNewGame, addAbundancePoints, syncPlayerFromCombat, ensureDmState, ensureScarcityState } from "./gameData/player.js";
import { clearTransient, narrateEvent } from "./gameData/narrator.js";
import { saveGame, loadGame } from "./gameData/save.js";
import { createCombatState, getCombatRewards } from "./gameData/combat.js";
import { buildCombatIntro, buildCombatWrapup } from "./textEngine/scenes/dm/combat.js";
import { pickEncounter } from "./gameData/enemies.js";
import { awardCombatXp, getSizeCapForLevel, initializeStartingSpells } from "./gameData/leveling.js";
import { initSpellSlots, syncSpellSlots } from "./gameData/spellSlots.js";
import { ensureQuestState } from "./gameData/questEngine.js";
import { ensureInfluenceState } from "./gameData/influence.js";
import { ensureTransformationState } from "./gameData/worldTransformation.js";
import { ensureReactivityState } from "./gameData/worldReactivity.js";
import { ensurePartyUniversalSize } from "./gameData/universalSize.js";
import { recordCombatEndForQuests, flushCompanionMilestoneBeats } from "./hooks/questHooks.js";
import { recordPuzzleSolvedForQuests } from "./hooks/puzzleHooks.js";
import { applySolutionImmediate } from "./gameData/puzzleEngine.js";
import { recordCombatVictory } from "./gameData/obstacleUnlocks.js";
import { syncGateUnlocks } from "./gameData/regionObstacles.js";
import { awardAbundanceSpreadWithEvents } from "./gameData/worldEvents.js";
import { ensureDivineAttentionState, raiseDivineAttention } from "./gameData/divineAttention.js";
import { renderTrivializeGag } from "./textEngine/scenes/dm/combat_gag.js";
import { ensureSpellState, getCharacterSpells, ensureDamageCantrip } from "./gameData/spellLearning.js";
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
  ensureDamageCantrip(player);
}

function applyLevelUpResults(game, levelUps) {
  if (!levelUps?.length) return game;
  const last = levelUps[levelUps.length - 1];
  game.lastLevelUpResult = last;
  const message = levelUps.map((lu) => lu.narrative || `Level ${lu.level}! ${lu.flavor}`).join("\n\n---\n\n");
  game.lastLevelUpMessage = message;
  narrateEvent(game, message, 'levelup');
  flushCompanionMilestoneBeats(game);
  return game;
}

function applyCombatEndState(prev, combat) {
  let next = syncPlayerFromCombat(prev, combat);
  ensureDivineAttentionState(next);
  const rewards = getCombatRewards(combat);
  next = addAbundancePoints(next, rewards.ap);
  const { levelUps } = awardCombatXp(next.player, combat);
  applyLevelUpResults(next, levelUps);
  if (combat.fattenLevelUps?.length) {
    applyLevelUpResults(next, combat.fattenLevelUps);
  }
  const quest = recordCombatEndForQuests(next, combat);
  if (quest.questMessages) {
    narrateEvent(next, quest.questMessages, 'quest');
  }

  if (combat.victory === 'win' || combat.victory === 'converted') {
    const spreadSource = combat.victory === 'converted' ? 'combat_convert' : 'combat_win';
    const spread = awardAbundanceSpreadWithEvents(next, spreadSource);
    if (spread.worldEvent?.message) {
      narrateEvent(next, spread.worldEvent.message, 'growth');
    }
    for (const portent of spread.divineAttention?.portents ?? []) {
      if (portent.message) narrateEvent(next, portent.message, 'quest');
    }
    if (spread.divineAttention?.genreBeat) {
      narrateEvent(next, spread.divineAttention.genreBeat, 'event');
    }
    if (spread.divineAttention?.antagonistBeat) {
      narrateEvent(next, spread.divineAttention.antagonistBeat, 'quest');
    }

    if (combat.trivialized) {
      const gag = combat.trivializeGag
        || renderTrivializeGag(next, combat, combat.enemies.find((e) =>
          (e.typeId || e.type) === combat.trivializedEnemyId
        ) || combat.enemies[0]);
      if (gag) narrateEvent(next, gag, 'event');
      const trivialDivine = raiseDivineAttention(next, 'trivialize');
      for (const portent of trivialDivine.portents ?? []) {
        if (portent.message) narrateEvent(next, portent.message, 'quest');
      }
      if (trivialDivine.genreBeat) {
        narrateEvent(next, trivialDivine.genreBeat, 'event');
      }
      if (trivialDivine.antagonistBeat) {
        narrateEvent(next, trivialDivine.antagonistBeat, 'quest');
      }
    }

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
  next.combatWrapup = null;
  clearTransient(next);
  return next;
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
    ensureScarcityState(g);
    ensureDivineAttentionState(g);
    setGame(g);
    setScreen("world");
  }, []);

  const continueGame = useCallback(() => {
    const g = loadGame();
    if (g) {
      if (!g.player.spellSlots) initSpellSlots(g.player);
        else syncSpellSlots(g.player);
        if (!g.player.sizeCap) g.player.sizeCap = getSizeCapForLevel(g.player.level || 1);
      ensureInfluenceState(g);
      ensureTransformationState(g);
      ensureReactivityState(g);
      ensureDivineAttentionState(g);
      if (g.player.divineResonance == null) g.player.divineResonance = 0;
      if (!g.player.raceName) g.player.raceName = 'Human';
      migratePlayerSpells(g.player);
      ensureQuestState(g);
      ensurePartyUniversalSize(g);
      ensureDmState(g);
      ensureScarcityState(g);
      if (!g.settings) g.settings = { skipCombatScenes: false };
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
      const skip = prev.settings?.skipCombatScenes;
      const next = {
        ...prev,
        combat: { ...combat, introDismissed: !!skip },
        combatIntro: skip ? null : buildCombatIntro(prev, combat),
        combatWrapup: null,
      };
      saveGame(next);
      return next;
    });
    setScreen("combat");
  }, []);

  const startPuzzleCombat = useCallback((pending) => {
    setGame((prev) => {
      clearTransient(prev);
      const combat = createCombatState(prev.player, prev.party, pending.enemyId, prev.region);
      const skip = prev.settings?.skipCombatScenes;
      const next = {
        ...prev,
        combat: { ...combat, introDismissed: !!skip },
        combatIntro: skip ? null : buildCombatIntro(prev, combat),
        combatWrapup: null,
        pendingPuzzleCombat: pending,
      };
      saveGame(next);
      return next;
    });
    setScreen("combat");
  }, []);

  const dismissCombatIntro = useCallback(() => {
    setGame((prev) => {
      if (!prev?.combat) return prev;
      const next = {
        ...prev,
        combat: { ...prev.combat, introDismissed: true },
        combatIntro: null,
      };
      saveGame(next);
      return next;
    });
  }, []);

  const handleCombatVictory = useCallback((combat) => {
    setGame((prev) => {
      if (prev.settings?.skipCombatScenes) {
        return prev;
      }
      const wrapup = buildCombatWrapup(prev, combat);
      const next = { ...prev, combatWrapup: wrapup };
      saveGame(next);
      return next;
    });
  }, []);

  const finalizeCombat = useCallback((combat) => {
    setGame((prev) => {
      const next = applyCombatEndState(prev, combat);
      saveGame(next);
      return next;
    });
    setScreen("world");
  }, []);

  const endCombat = useCallback((combat) => {
    finalizeCombat(combat);
  }, [finalizeCombat]);

  const dismissCombatWrapup = useCallback(() => {
    setGame((prev) => {
      if (!prev.combat) return prev;
      const next = applyCombatEndState(prev, prev.combat);
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
        onHostilityEncounter={startCombat}
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
    const showIntro = game.combatIntro && !game.combat.introDismissed;
    const showWrapup = game.combatWrapup && game.combat.victory && !game.settings?.skipCombatScenes;

    return (
      <GameDebugShell game={game} onUpdateGame={updateGame} screen="combat" debugContext={debugContext}>
        <CombatView
          game={game}
          combat={game.combat}
          onUpdateCombat={(c) => updateGame((g) => ({ ...g, combat: c }))}
          onEnd={endCombat}
          onVictory={handleCombatVictory}
          introBlocking={showIntro}
          onDebugContext={updateDebugContext}
        />
        {showIntro && (
          <CombatScenePopup
            variant="intro"
            prose={game.combatIntro.prose}
            onContinue={dismissCombatIntro}
          />
        )}
        {showWrapup && (
          <CombatScenePopup
            variant="outro"
            prose={game.combatWrapup.prose}
            onContinue={dismissCombatWrapup}
          />
        )}
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
