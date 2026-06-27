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

  const inventory = document.createElement("p");
  inventory.textContent = `Ancient coins: ${String(
    gameState.inventory.items.ancientCoin,
  )}`;

  const discoveries = document.createElement("p");
  discoveries.textContent = `Landmarks discovered: ${String(
    gameState.world.landmarks.filter((landmark) => landmark.discovered).length,
  )}/${String(gameState.world.landmarks.length)}`;

  const gates = document.createElement("p");
  gates.textContent = `Gates unlocked: ${String(
    gameState.world.gates.filter((gate) => gate.unlocked).length,
  )}/${String(gameState.world.gates.length)}`;

  const controls = document.createElement("p");
  controls.textContent =
    "Move: WASD or arrows. Interact: E/Space. Save: K. Load: L.";

  panel.append(title, seed, position, inventory, discoveries, gates, controls);
  root.append(panel);
}

function formatCoordinate(value: number): string {
  return value.toFixed(1);
}
