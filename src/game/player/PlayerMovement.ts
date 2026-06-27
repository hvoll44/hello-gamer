import type { MovementCommand } from "../../engine/input/InputState";
import type { Vector3 } from "../../shared/Vector3";
import type { PlayerState } from "../state/GameState";
import {
  getTerrainHeightAt,
  type TerrainState,
} from "../terrain/Terrain";

export type PlayerMovementConfig = {
  readonly speedMetersPerSecond: number;
  readonly halfHeight: number;
};

export type MovementBlocker = {
  readonly position: Pick<Vector3, "x" | "z">;
  readonly radius: number;
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
  blockers: readonly MovementBlocker[] = [],
): PlayerState {
  if (deltaSeconds <= 0 || (command.x === 0 && command.z === 0)) {
    return player;
  }

  const distance = config.speedMetersPerSecond * deltaSeconds;
  const facing = Math.atan2(command.x, command.z);
  const nextX = clamp(
    player.position.x + command.x * distance,
    terrain.movementBounds.minX,
    terrain.movementBounds.maxX,
  );
  const nextZ = clamp(
    player.position.z + command.z * distance,
    terrain.movementBounds.minZ,
    terrain.movementBounds.maxZ,
  );

  if (isMovementBlocked(player.position, { x: nextX, z: nextZ }, blockers)) {
    return {
      ...player,
      facing,
    };
  }

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
    facing,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isMovementBlocked(
  from: Pick<Vector3, "x" | "z">,
  to: Pick<Vector3, "x" | "z">,
  blockers: readonly MovementBlocker[],
): boolean {
  return blockers.some((blocker) => crossesBlocker(from, to, blocker));
}

function crossesBlocker(
  from: Pick<Vector3, "x" | "z">,
  to: Pick<Vector3, "x" | "z">,
  blocker: MovementBlocker,
): boolean {
  if (blocker.radius <= 0) {
    return false;
  }

  const radiusSquared = blocker.radius * blocker.radius;
  const fromDistanceSquared = distanceSquared(from, blocker.position);
  const toDistanceSquared = distanceSquared(to, blocker.position);

  if (fromDistanceSquared <= radiusSquared) {
    return toDistanceSquared < fromDistanceSquared;
  }

  const movementX = to.x - from.x;
  const movementZ = to.z - from.z;
  const movementLengthSquared = movementX * movementX + movementZ * movementZ;

  if (movementLengthSquared === 0) {
    return false;
  }

  const centerOffsetX = blocker.position.x - from.x;
  const centerOffsetZ = blocker.position.z - from.z;
  const closestPointRatio = clamp(
    (centerOffsetX * movementX + centerOffsetZ * movementZ) /
      movementLengthSquared,
    0,
    1,
  );
  const closestPoint = {
    x: from.x + movementX * closestPointRatio,
    z: from.z + movementZ * closestPointRatio,
  };

  return distanceSquared(closestPoint, blocker.position) <= radiusSquared;
}

function distanceSquared(
  first: Pick<Vector3, "x" | "z">,
  second: Pick<Vector3, "x" | "z">,
): number {
  const x = first.x - second.x;
  const z = first.z - second.z;

  return x * x + z * z;
}
