import { createKeyboardInputSource } from "./engine/input/KeyboardInput";
import { mapInputToMovementCommand } from "./engine/input/InputState";
import { createBabylonRenderer } from "./engine/renderer/BabylonRenderer";
import { createGameLoop } from "./engine/timing/GameLoop";
import { updatePlayerMovement } from "./game/player/PlayerMovement";
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
const renderer = createBabylonRenderer(canvas, gameState);
const loop = createGameLoop((deltaSeconds) => {
  const movementCommand = mapInputToMovementCommand(input.snapshot());
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
