import type { GameState } from "../state/GameState";

export function renderHud(root: HTMLElement, gameState: GameState): void {
  root.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "hud-panel";

  const title = document.createElement("h1");
  title.textContent = "Hello Gamer";

  const seed = document.createElement("p");
  seed.textContent = `Seed: ${gameState.world.seed}`;

  const position = document.createElement("p");
  position.textContent = `Position: ${formatCoordinate(
    gameState.player.position.x,
  )}, ${formatCoordinate(gameState.player.position.z)}`;

  const controls = document.createElement("p");
  controls.textContent = "Move: WASD or arrow keys";

  panel.append(title, seed, position, controls);
  root.append(panel);
}

function formatCoordinate(value: number): string {
  return value.toFixed(1);
}
