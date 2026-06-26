import { describe, expect, it } from "vitest";

import {
  generateTerrain,
  getTerrainHeightAt,
} from "../../../src/game/terrain/Terrain";

describe("generateTerrain", () => {
  it("creates deterministic terrain for a seed", () => {
    const firstTerrain = generateTerrain("phase-3-seed");
    const secondTerrain = generateTerrain("phase-3-seed");

    expect(secondTerrain).toEqual(firstTerrain);
  });

  it("changes generated tiles when the seed changes", () => {
    const firstTerrain = generateTerrain("phase-3-a");
    const secondTerrain = generateTerrain("phase-3-b");

    expect(secondTerrain.tiles).not.toEqual(firstTerrain.tiles);
  });

  it("spawns the player on the center tile", () => {
    const terrain = generateTerrain("spawn-seed");
    const centerHeight = getTerrainHeightAt(terrain, 0, 0);

    expect(terrain.spawn).toEqual({
      x: 0,
      y: (centerHeight ?? 0) + 0.375,
      z: 0,
    });
  });

  it("derives movement bounds from the generated tile centers", () => {
    const terrain = generateTerrain("bounds-seed", { size: 5, tileSize: 2 });

    expect(terrain.movementBounds).toEqual({
      minX: -4,
      maxX: 4,
      minZ: -4,
      maxZ: 4,
    });
  });
});
