import { generateCollectibles } from "../collectibles/Collectibles";
import { generateLandmarks } from "../landmarks/Landmarks";
import { generateGates } from "../puzzles/Gates";
import type { WorldState } from "../state/GameState";
import { generateTerrain } from "../terrain/Terrain";

export type WorldGeneratorMetadata = {
  readonly id: string;
  readonly version: number;
};

export type WorldGenerator = {
  readonly metadata: WorldGeneratorMetadata;
  generate(seed: string): WorldState;
};

export const DEFAULT_WORLD_GENERATOR_METADATA: WorldGeneratorMetadata =
  Object.freeze({
    id: "default-terrain",
    version: 1,
  });

export const DEFAULT_WORLD_GENERATOR: WorldGenerator = Object.freeze({
  metadata: DEFAULT_WORLD_GENERATOR_METADATA,
  generate(seed: string): WorldState {
    const terrain = generateTerrain(seed);

    return {
      seed,
      generatorId: DEFAULT_WORLD_GENERATOR_METADATA.id,
      generatorVersion: DEFAULT_WORLD_GENERATOR_METADATA.version,
      terrain,
      collectibles: generateCollectibles(seed, terrain),
      landmarks: generateLandmarks(seed, terrain),
      gates: generateGates(seed, terrain),
    };
  },
});
