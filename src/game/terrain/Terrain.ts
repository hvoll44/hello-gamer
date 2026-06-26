import type { Vector3 } from "../../shared/Vector3";

export type TerrainTileKind = "grass" | "clearing" | "stone";

export type TerrainTile = {
  readonly x: number;
  readonly z: number;
  readonly height: number;
  readonly kind: TerrainTileKind;
};

export type TerrainState = {
  readonly seed: string;
  readonly size: number;
  readonly tileSize: number;
  readonly tiles: readonly TerrainTile[];
  readonly spawn: Vector3;
};

export type TerrainConfig = {
  readonly size: number;
  readonly tileSize: number;
};

export const DEFAULT_TERRAIN_CONFIG: TerrainConfig = Object.freeze({
  size: 11,
  tileSize: 1,
});

const PLAYER_HALF_HEIGHT = 0.375;

export function generateTerrain(
  seed: string,
  config = DEFAULT_TERRAIN_CONFIG,
): TerrainState {
  if (config.size < 3 || config.size % 2 === 0) {
    throw new Error("Terrain size must be an odd number greater than or equal to 3.");
  }

  const radius = Math.floor(config.size / 2);
  const tiles: TerrainTile[] = [];

  for (let z = -radius; z <= radius; z += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      const distanceFromCenter = Math.hypot(x, z) / radius;
      const noise = seededNoise(seed, x, z);
      const rawHeight =
        Math.cos(distanceFromCenter * Math.PI * 0.5) * 0.28 + noise * 0.16;
      const height = roundToStep(rawHeight, 0.05);

      tiles.push({
        x,
        z,
        height,
        kind: pickTileKind(distanceFromCenter, noise),
      });
    }
  }

  const spawnHeight = getTerrainHeightAt({ tiles, tileSize: config.tileSize }, 0, 0);

  return {
    seed,
    size: config.size,
    tileSize: config.tileSize,
    tiles,
    spawn: {
      x: 0,
      y: (spawnHeight ?? 0) + PLAYER_HALF_HEIGHT,
      z: 0,
    },
  };
}

export function getTerrainHeightAt(
  terrain: Pick<TerrainState, "tiles" | "tileSize">,
  x: number,
  z: number,
): number | undefined {
  const tileX = Math.round(x / terrain.tileSize);
  const tileZ = Math.round(z / terrain.tileSize);
  const tile = terrain.tiles.find(
    (candidate) => candidate.x === tileX && candidate.z === tileZ,
  );

  return tile?.height;
}

function pickTileKind(
  distanceFromCenter: number,
  noise: number,
): TerrainTileKind {
  if (distanceFromCenter < 0.22) {
    return "clearing";
  }

  if (noise > 0.32) {
    return "stone";
  }

  return "grass";
}

function seededNoise(seed: string, x: number, z: number): number {
  const hash = hashString(`${seed}:${String(x)}:${String(z)}`);
  return (hash / 0xffffffff) * 2 - 1;
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}
