import type { GameState } from "../state/GameState";

export function renderHud(root: HTMLElement, gameState: GameState): void {
  root.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "hud-panel";

  const title = document.createElement("h1");
  title.textContent = "Hello Gamer";

  const seed = document.createElement("p");
  seed.textContent = `Seed: ${gameState.world.seed}`;

  panel.append(title, seed);
  root.append(panel);
}
