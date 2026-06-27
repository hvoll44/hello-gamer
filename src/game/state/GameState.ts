import type { Vector3 } from "../../shared/Vector3";
import type { CollectibleState } from "../collectibles/Collectibles";
import { createEmptyInventory, type InventoryState } from "../inventory/Inventory";
import type { LandmarkState } from "../landmarks/Landmarks";
import type { GateState } from "../puzzles/Gates";
import type { TerrainState } from "../terrain/Terrain";
import {
  DEFAULT_WORLD_GENERATOR,
  type WorldGenerator,
} from "../world/WorldGenerator";

export type PlayerState = {
  readonly position: Vector3;
  readonly facing: number;
};

export type WorldState = {
  readonly seed: string;
  readonly generatorId: string;
  readonly generatorVersion: number;
  readonly terrain: TerrainState;
  readonly collectibles: readonly CollectibleState[];
  readonly landmarks: readonly LandmarkState[];
  readonly gates: readonly GateState[];
};

export type GameState = {
  readonly player: PlayerState;
  readonly inventory: InventoryState;
  readonly world: WorldState;
};

export function createInitialGameState(
  seed = "hello-gamer-dev",
  worldGenerator: WorldGenerator = DEFAULT_WORLD_GENERATOR,
): GameState {
  const world = worldGenerator.generate(seed);

  return {
    player: {
      position: world.terrain.spawn,
      facing: 0,
    },
    inventory: createEmptyInventory(),
    world,
  };
}
