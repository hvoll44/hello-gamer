import type { MovementCommand } from "../../engine/input/InputState";
import type { PlayerState } from "../state/GameState";
import {
  getTerrainHeightAt,
  type TerrainState,
} from "../terrain/Terrain";

export type PlayerMovementConfig = {
  readonly speedMetersPerSecond: number;
  readonly halfHeight: number;
};

export const DEFAULT_PLAYER_MOVEMENT_CONFIG: PlayerMovementConfig =
  Object.freeze({
    speedMetersPerSecond: 3,
    halfHeight: 0.375,
  });

export function updatePlayerMovement(
  player: PlayerState,
  command: MovementCommand,
  terrain: TerrainState,
  deltaSeconds: number,
  config = DEFAULT_PLAYER_MOVEMENT_CONFIG,
): PlayerState {
  if (deltaSeconds <= 0 || (command.x === 0 && command.z === 0)) {
    return player;
  }

  const distance = config.speedMetersPerSecond * deltaSeconds;
  const nextX = player.position.x + command.x * distance;
  const nextZ = player.position.z + command.z * distance;
  const terrainHeight = getTerrainHeightAt(terrain, nextX, nextZ);

  return {
    position: {
      x: nextX,
      y:
        terrainHeight === undefined
          ? player.position.y
          : terrainHeight + config.halfHeight,
      z: nextZ,
    },
    facing: Math.atan2(command.x, command.z),
  };
}
