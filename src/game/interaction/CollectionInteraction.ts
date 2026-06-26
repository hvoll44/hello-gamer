import type { InteractionCommand } from "../../engine/input/InputState";
import { addInventoryItem } from "../inventory/Inventory";
import type { GameState } from "../state/GameState";

export type CollectionInteractionConfig = {
  readonly rangeMeters: number;
};

export const DEFAULT_COLLECTION_INTERACTION_CONFIG: CollectionInteractionConfig =
  Object.freeze({
    rangeMeters: 1,
  });

export function applyCollectionInteraction(
  gameState: GameState,
  command: InteractionCommand,
  config = DEFAULT_COLLECTION_INTERACTION_CONFIG,
): GameState {
  if (!command.interact) {
    return gameState;
  }

  const collectible = gameState.world.collectibles
    .filter((candidate) => !candidate.collected)
    .map((candidate) => ({
      collectible: candidate,
      distance: Math.hypot(
        candidate.position.x - gameState.player.position.x,
        candidate.position.z - gameState.player.position.z,
      ),
    }))
    .filter(({ distance }) => distance <= config.rangeMeters)
    .sort((first, second) => first.distance - second.distance)
    .at(0)?.collectible;

  if (collectible === undefined) {
    return gameState;
  }

  return {
    ...gameState,
    inventory: addInventoryItem(gameState.inventory, collectible.itemKind),
    world: {
      ...gameState.world,
      collectibles: gameState.world.collectibles.map((candidate) =>
        candidate.id === collectible.id
          ? { ...candidate, collected: true }
          : candidate,
      ),
    },
  };
}
