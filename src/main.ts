import { createAssetCatalog } from "./engine/assets/AssetCatalog";
import { createAudioManager } from "./engine/audio/AudioManager";
import { createHowlerAudioBackend } from "./engine/audio/HowlerAudioBackend";
import { createKeyboardInputSource } from "./engine/input/KeyboardInput";
import {
  mapInputToInteractionCommand,
  mapInputToMovementCommand,
  mapInputToPersistenceCommand,
} from "./engine/input/InputState";
import { createBabylonRenderer } from "./engine/renderer/BabylonRenderer";
import { createLocalStorageSaveStore } from "./engine/storage/LocalStorageSaveStore";
import { createGameLoop } from "./engine/timing/GameLoop";
import {
  deriveGameplayAudioEvents,
  playGameplayAudioEvents,
} from "./game/audio/GameplayAudio";
import { applyCollectionInteraction } from "./game/interaction/CollectionInteraction";
import { updateLandmarkDiscovery } from "./game/landmarks/Landmarks";
import {
  DEFAULT_PLAYER_MOVEMENT_CONFIG,
  updatePlayerMovement,
} from "./game/player/PlayerMovement";
import {
  applyGateInteraction,
  getLockedGateMovementBlockers,
} from "./game/puzzles/Gates";
import {
  createSaveData,
  parseSaveData,
  restoreGameState,
  serializeSaveData,
} from "./game/save/SaveData";
import { createInitialGameState } from "./game/state/GameState";
import { renderHud } from "./game/ui/HudView";
import { GAMEPLAY_AUDIO_ASSET_MANIFEST } from "./runtime/assets/GameplayAudioAssets";
import { GAMEPLAY_AUDIO_CUE_MANIFEST } from "./runtime/audio/GameplayAudioManifest";
import "./styles.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const uiRoot = document.querySelector<HTMLElement>("#ui-root");

if (canvas === null || uiRoot === null) {
  throw new Error("Missing required application roots.");
}

let gameState = createInitialGameState();
const input = createKeyboardInputSource(window);
const saveStore = createLocalStorageSaveStore(
  window.localStorage,
  "hello-gamer.save.v1",
);
const gameplayAudio = createAudioManager(
  GAMEPLAY_AUDIO_CUE_MANIFEST,
  createAssetCatalog(GAMEPLAY_AUDIO_ASSET_MANIFEST),
  createHowlerAudioBackend(),
);
const renderer = createBabylonRenderer(canvas, gameState);
const loop = createGameLoop((deltaSeconds) => {
  const previousGameState = gameState;
  const inputSnapshot = input.snapshot();
  const movementCommand = mapInputToMovementCommand(inputSnapshot);
  const interactionCommand = mapInputToInteractionCommand(inputSnapshot);
  const persistenceCommand = mapInputToPersistenceCommand(inputSnapshot);
  const player = updatePlayerMovement(
    gameState.player,
    movementCommand,
    gameState.world.terrain,
    Math.min(deltaSeconds, 0.1),
    DEFAULT_PLAYER_MOVEMENT_CONFIG,
    getLockedGateMovementBlockers(gameState.world.gates),
  );

  gameState = {
    ...gameState,
    player,
  };
  gameState = applyCollectionInteraction(gameState, interactionCommand);
  gameState = applyGateInteraction(gameState, interactionCommand);
  gameState = applyDiscovery(gameState);
  playGameplayAudioEvents(
    deriveGameplayAudioEvents(previousGameState, gameState),
    gameplayAudio,
  );
  gameState = applyPersistenceCommand(gameState, persistenceCommand);

  renderer.render(gameState);
  renderHud(uiRoot, gameState);
});

renderHud(uiRoot, gameState);
loop.start();

window.addEventListener("resize", () => {
  renderer.resize();
});

window.addEventListener("beforeunload", () => {
  loop.stop();
  input.dispose();
  gameplayAudio.dispose();
  renderer.dispose();
});

function applyPersistenceCommand(
  currentGameState: typeof gameState,
  command: ReturnType<typeof mapInputToPersistenceCommand>,
): typeof gameState {
  if (command.save) {
    saveStore.write(serializeSaveData(createSaveData(currentGameState)));
  }

  if (!command.load) {
    return currentGameState;
  }

  const serializedSaveData = saveStore.read();

  if (serializedSaveData === undefined) {
    return currentGameState;
  }

  const saveData = parseSaveData(serializedSaveData);

  if (saveData === undefined) {
    return currentGameState;
  }

  return restoreGameState(saveData) ?? currentGameState;
}

function applyDiscovery(currentGameState: typeof gameState): typeof gameState {
  const landmarks = updateLandmarkDiscovery(
    currentGameState.world.landmarks,
    currentGameState.player.position,
  );

  if (landmarks === currentGameState.world.landmarks) {
    return currentGameState;
  }

  return {
    ...currentGameState,
    world: {
      ...currentGameState.world,
      landmarks,
    },
  };
}
