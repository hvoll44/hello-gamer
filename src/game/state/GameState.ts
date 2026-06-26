import type { Vector3 } from "../../shared/Vector3";

export type PlayerState = {
  readonly position: Vector3;
  readonly facing: number;
};

export type WorldState = {
  readonly seed: string;
};

export type GameState = {
  readonly player: PlayerState;
  readonly world: WorldState;
};

export function createInitialGameState(seed = "hello-gamer-dev"): GameState {
  return {
    player: {
      position: { x: 0, y: 0.5, z: 0 },
      facing: 0,
    },
    world: {
      seed,
    },
  };
}
