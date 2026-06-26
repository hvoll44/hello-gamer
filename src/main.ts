import { createKeyboardInputSource } from "./engine/input/KeyboardInput";
import {
  mapInputToInteractionCommand,
  mapInputToMovementCommand,
  mapInputToPersistenceCommand,
} from "./engine/input/InputState";
import { createBabylonRenderer } from "./engine/renderer/BabylonRenderer";
import { createLocalStorageSaveStore } from "./engine/storage/LocalStorageSaveStore";
import { createGameLoop } from "./engine/timing/GameLoop";
import { applyCollectionInteraction } from "./game/interaction/CollectionInteraction";
import { updatePlayerMovement } from "./game/player/PlayerMovement";
import {
  createSaveData,
  parseSaveData,
  restoreGameState,
  serializeSaveData,
} from "./game/save/SaveData";
import { createInitialGameState } from "./game/state/GameState";
import { renderHud } from "./game/ui/HudView";
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
const renderer = createBabylonRenderer(canvas, gameState);
const loop = createGameLoop((deltaSeconds) => {
  const inputSnapshot = input.snapshot();
  const movementCommand = mapInputToMovementCommand(inputSnapshot);
  const interactionCommand = mapInputToInteractionCommand(inputSnapshot);
  const persistenceCommand = mapInputToPersistenceCommand(inputSnapshot);
  const player = updatePlayerMovement(
    gameState.player,
    movementCommand,
    gameState.world.terrain,
    Math.min(deltaSeconds, 0.1),
  );

  gameState = {
    ...gameState,
    player,
  };
  gameState = applyCollectionInteraction(gameState, interactionCommand);
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

  return saveData === undefined
    ? currentGameState
    : restoreGameState(saveData);
}
