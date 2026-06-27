import { describe, expect, it } from "vitest";

import { generateCollectibles } from "../../../src/game/collectibles/Collectibles";
import { generateLandmarks } from "../../../src/game/landmarks/Landmarks";
import { generateGates } from "../../../src/game/puzzles/Gates";
import { createInitialGameState } from "../../../src/game/state/GameState";
import { generateTerrain } from "../../../src/game/terrain/Terrain";
import {
  DEFAULT_WORLD_GENERATOR,
  DEFAULT_WORLD_GENERATOR_METADATA,
  type WorldGenerator,
} from "../../../src/game/world/WorldGenerator";

describe("DEFAULT_WORLD_GENERATOR", () => {
  it("assembles deterministic world state from existing generators", () => {
    const seed = "world-generator-seed";
    const terrain = generateTerrain(seed);
    const world = DEFAULT_WORLD_GENERATOR.generate(seed);

    expect(world.seed).toBe(seed);
    expect(world.generatorId).toBe(DEFAULT_WORLD_GENERATOR_METADATA.id);
    expect(world.generatorVersion).toBe(DEFAULT_WORLD_GENERATOR_METADATA.version);
    expect(world.terrain).toEqual(terrain);
    expect(world.collectibles).toEqual(generateCollectibles(seed, terrain));
    expect(world.landmarks).toEqual(generateLandmarks(seed, terrain));
    expect(world.gates).toEqual(generateGates(seed, terrain));
  });

  it("can be replaced when creating initial game state", () => {
    const metadata = {
      id: "test-world",
      version: 2,
    };
    const customGenerator: WorldGenerator = {
      metadata,
      generate(seed) {
        const world = DEFAULT_WORLD_GENERATOR.generate(seed);

        return {
          ...world,
          generatorId: metadata.id,
          generatorVersion: metadata.version,
        };
      },
    };

    const gameState = createInitialGameState("custom-world-seed", customGenerator);

    expect(gameState.world.generatorId).toBe("test-world");
    expect(gameState.world.generatorVersion).toBe(2);
    expect(gameState.player.position).toEqual(gameState.world.terrain.spawn);
  });
});
