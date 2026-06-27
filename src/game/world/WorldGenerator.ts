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

export type WorldGeneratorRegistry = readonly WorldGenerator[];

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

export const DEFAULT_WORLD_GENERATORS: WorldGeneratorRegistry = Object.freeze([
  DEFAULT_WORLD_GENERATOR,
]);

export function findWorldGenerator(
  metadata: WorldGeneratorMetadata,
  worldGenerators: WorldGeneratorRegistry = DEFAULT_WORLD_GENERATORS,
): WorldGenerator | undefined {
  return worldGenerators.find(
    (worldGenerator) =>
      worldGenerator.metadata.id === metadata.id &&
      worldGenerator.metadata.version === metadata.version,
  );
}
