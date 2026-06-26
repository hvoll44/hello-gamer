import { describe, expect, it } from "vitest";

import { generateCollectibles } from "../../../src/game/collectibles/Collectibles";
import { generateTerrain } from "../../../src/game/terrain/Terrain";

describe("generateCollectibles", () => {
  it("creates deterministic collectibles for a seed and terrain", () => {
    const terrain = generateTerrain("collectible-seed");
    const firstCollectibles = generateCollectibles("collectible-seed", terrain);
    const secondCollectibles = generateCollectibles("collectible-seed", terrain);

    expect(secondCollectibles).toEqual(firstCollectibles);
  });

  it("places collectibles away from the player spawn", () => {
    const terrain = generateTerrain("spawn-safe-seed");
    const collectibles = generateCollectibles("spawn-safe-seed", terrain);

    expect(collectibles).toHaveLength(5);
    expect(
      collectibles.some(
        (collectible) =>
          collectible.position.x === terrain.spawn.x &&
          collectible.position.z === terrain.spawn.z,
      ),
    ).toBe(false);
  });
});
