import type { Vector3 } from "../../shared/Vector3";
import type { InventoryItemKind } from "../inventory/Inventory";
import type { TerrainState, TerrainTile } from "../terrain/Terrain";

export type CollectibleState = {
  readonly id: string;
  readonly itemKind: InventoryItemKind;
  readonly position: Vector3;
  readonly collected: boolean;
};

const COLLECTIBLE_COUNT = 5;
const COLLECTIBLE_HALF_HEIGHT = 0.18;

export function generateCollectibles(
  seed: string,
  terrain: TerrainState,
): readonly CollectibleState[] {
  return terrain.tiles
    .filter((tile) => tile.x !== 0 || tile.z !== 0)
    .map((tile) => ({
      tile,
      score: hashString(
        `${seed}:collectible:${String(tile.x)}:${String(tile.z)}`,
      ),
    }))
    .sort((first, second) => first.score - second.score)
    .slice(0, COLLECTIBLE_COUNT)
    .map(({ tile }, index) => createCollectible(index, tile, terrain.tileSize));
}

function createCollectible(
  index: number,
  tile: TerrainTile,
  tileSize: number,
): CollectibleState {
  return {
    id: `ancient-coin-${String(index)}`,
    itemKind: "ancientCoin",
    position: {
      x: tile.x * tileSize,
      y: tile.height + COLLECTIBLE_HALF_HEIGHT,
      z: tile.z * tileSize,
    },
    collected: false,
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
