import type { Vector3 } from "../../shared/Vector3";
import type { TerrainState, TerrainTile } from "../terrain/Terrain";

export type LandmarkState = {
  readonly id: string;
  readonly name: string;
  readonly position: Vector3;
  readonly discoveryRadius: number;
  readonly discovered: boolean;
};

const LANDMARK_COUNT = 3;
const LANDMARK_HALF_HEIGHT = 0.6;

const LANDMARK_NAMES = ["Old Watchstone", "Mosslit Arch", "Quiet Cairn"];

export function generateLandmarks(
  seed: string,
  terrain: TerrainState,
): readonly LandmarkState[] {
  return terrain.tiles
    .filter((tile) => Math.hypot(tile.x, tile.z) >= 2)
    .map((tile) => ({
      tile,
      score: hashString(`${seed}:landmark:${String(tile.x)}:${String(tile.z)}`),
    }))
    .sort((first, second) => first.score - second.score)
    .slice(0, LANDMARK_COUNT)
    .map(({ tile }, index) => createLandmark(index, tile, terrain.tileSize));
}

export function updateLandmarkDiscovery(
  landmarks: readonly LandmarkState[],
  playerPosition: Vector3,
): readonly LandmarkState[] {
  let changed = false;
  const nextLandmarks: LandmarkState[] = [];

  for (const landmark of landmarks) {
    if (landmark.discovered) {
      nextLandmarks.push(landmark);
      continue;
    }

    const distance = Math.hypot(
      landmark.position.x - playerPosition.x,
      landmark.position.z - playerPosition.z,
    );

    if (distance > landmark.discoveryRadius) {
      nextLandmarks.push(landmark);
      continue;
    }

    changed = true;
    nextLandmarks.push({
      ...landmark,
      discovered: true,
    });
  }

  return changed ? nextLandmarks : landmarks;
}

function createLandmark(
  index: number,
  tile: TerrainTile,
  tileSize: number,
): LandmarkState {
  return {
    id: `landmark-${String(index)}`,
    name: LANDMARK_NAMES[index],
    position: {
      x: tile.x * tileSize,
      y: tile.height + LANDMARK_HALF_HEIGHT,
      z: tile.z * tileSize,
    },
    discoveryRadius: 1.25,
    discovered: false,
  };
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
