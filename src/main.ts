import { createBabylonRenderer } from "./engine/renderer/BabylonRenderer";
import { createGameLoop } from "./engine/timing/GameLoop";
import { createInitialGameState } from "./game/state/GameState";
import { renderHud } from "./game/ui/HudView";
import "./styles.css";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const uiRoot = document.querySelector<HTMLElement>("#ui-root");

if (canvas === null || uiRoot === null) {
  throw new Error("Missing required application roots.");
}

const gameState = createInitialGameState();
const renderer = createBabylonRenderer(canvas, gameState);
const loop = createGameLoop(() => {
  renderer.render();
});

renderHud(uiRoot, gameState);
loop.start();

window.addEventListener("resize", () => {
  renderer.resize();
});

window.addEventListener("beforeunload", () => {
  loop.stop();
  renderer.dispose();
});
