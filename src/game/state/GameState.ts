import type { Vector3 } from "../../shared/Vector3";
import { generateTerrain, type TerrainState } from "../terrain/Terrain";

export type PlayerState = {
  readonly position: Vector3;
  readonly facing: number;
};

export type WorldState = {
  readonly seed: string;
  readonly terrain: TerrainState;
};

export type GameState = {
  readonly player: PlayerState;
  readonly world: WorldState;
};

export function createInitialGameState(seed = "hello-gamer-dev"): GameState {
  const terrain = generateTerrain(seed);

  return {
    player: {
      position: terrain.spawn,
      facing: 0,
    },
    world: {
      seed,
      terrain,
    },
  };
}
