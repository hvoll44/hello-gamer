import type { Vector3 } from "../../shared/Vector3";
import {
  generateCollectibles,
  type CollectibleState,
} from "../collectibles/Collectibles";
import { createEmptyInventory, type InventoryState } from "../inventory/Inventory";
import { generateLandmarks, type LandmarkState } from "../landmarks/Landmarks";
import { generateGates, type GateState } from "../puzzles/Gates";
import { generateTerrain, type TerrainState } from "../terrain/Terrain";

export type PlayerState = {
  readonly position: Vector3;
  readonly facing: number;
};

export type WorldState = {
  readonly seed: string;
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

export function createInitialGameState(seed = "hello-gamer-dev"): GameState {
  const terrain = generateTerrain(seed);
  const collectibles = generateCollectibles(seed, terrain);
  const landmarks = generateLandmarks(seed, terrain);
  const gates = generateGates(seed, terrain);

  return {
    player: {
      position: terrain.spawn,
      facing: 0,
    },
    inventory: createEmptyInventory(),
    world: {
      seed,
      terrain,
      collectibles,
      landmarks,
      gates,
    },
  };
}
