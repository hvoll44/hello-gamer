import { describe, expect, it } from "vitest";

import { applyCollectionInteraction } from "../../../src/game/interaction/CollectionInteraction";
import { updateLandmarkDiscovery } from "../../../src/game/landmarks/Landmarks";
import { applyGateInteraction } from "../../../src/game/puzzles/Gates";
import {
  createSaveData,
  CURRENT_SAVE_SCHEMA_VERSION,
  parseSaveData,
  restoreGameState,
  serializeSaveData,
  type SaveData,
} from "../../../src/game/save/SaveData";
import {
  createInitialGameState,
  type GameState,
} from "../../../src/game/state/GameState";
import {
  DEFAULT_WORLD_GENERATOR,
  DEFAULT_WORLD_GENERATOR_METADATA,
  type WorldGenerator,
} from "../../../src/game/world/WorldGenerator";

describe("SaveData", () => {
  it("serializes gameplay state with the current schema version", () => {
    const timestamp = new Date("2026-06-26T04:00:00.000Z");
    const gameState = createInitialGameState("save-seed");
    const saveData = createSaveData(gameState, timestamp);

    expect(saveData.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(saveData.createdAt).toBe("2026-06-26T04:00:00.000Z");
    expect(saveData.world.seed).toBe("save-seed");
    expect(saveData.world.generatorId).toBe(DEFAULT_WORLD_GENERATOR_METADATA.id);
    expect(saveData.world.generatorVersion).toBe(
      DEFAULT_WORLD_GENERATOR_METADATA.version,
    );
    expect(saveData.player).toEqual(gameState.player);
    expect(saveData.progression.unlockedGateIds).toEqual([]);
  });

  it("round-trips valid save data through JSON", () => {
    const timestamp = new Date("2026-06-26T04:30:00.000Z");
    const gameState = createInitialGameState("round-trip-seed");
    const saveData = createSaveData(gameState, timestamp);
    const serializedSaveData = serializeSaveData(saveData);

    expect(parseSaveData(serializedSaveData)).toEqual(saveData);
  });

  it("rejects invalid save data", () => {
    expect(parseSaveData("{")).toBeUndefined();
    expect(parseSaveData(JSON.stringify({ schemaVersion: 999 }))).toBeUndefined();
  });

  it("restores inventory and collected progression onto deterministic world state", () => {
    const initialState = createInitialGameState("restore-seed");
    const collectible = initialState.world.collectibles[0];
    const collectedState = applyCollectionInteraction(
      {
        ...initialState,
        player: {
          ...initialState.player,
          position: collectible.position,
        },
      },
      { interact: true },
    );

    const restoredState = expectRestoredGameState(createSaveData(collectedState));

    expect(restoredState.inventory.items.ancientCoin).toBe(1);
    expect(
      restoredState.world.collectibles.find(
        (candidate) => candidate.id === collectible.id,
      )?.collected,
    ).toBe(true);
    expect(restoredState.world.terrain).toEqual(initialState.world.terrain);
  });

  it("restores discovered landmarks onto deterministic world state", () => {
    const initialState = createInitialGameState("discovered-save-seed");
    const landmark = initialState.world.landmarks[0];
    const discoveredState = {
      ...initialState,
      world: {
        ...initialState.world,
        landmarks: updateLandmarkDiscovery(
          initialState.world.landmarks,
          landmark.position,
        ),
      },
    };

    const saveData = createSaveData(discoveredState);
    const restoredState = expectRestoredGameState(saveData);
    const restoredDiscoveredIds = restoredState.world.landmarks
      .filter((candidate) => candidate.discovered)
      .map((candidate) => candidate.id);

    expect(saveData.world.discoveredLocationIds).toContain(landmark.id);
    expect(restoredDiscoveredIds).toEqual(saveData.world.discoveredLocationIds);
  });

  it("restores unlocked gates onto deterministic world state", () => {
    const initialState = createInitialGameState("gate-save-seed");
    const gate = initialState.world.gates[0];
    const unlockedState = applyGateInteraction(
      {
        ...initialState,
        player: {
          ...initialState.player,
          position: gate.position,
        },
        inventory: {
          items: {
            ancientCoin: 2,
          },
        },
      },
      { interact: true },
    );

    const saveData = createSaveData(unlockedState);
    const restoredState = expectRestoredGameState(saveData);

    expect(saveData.progression.unlockedGateIds).toContain(gate.id);
    expect(restoredState.world.gates[0]?.unlocked).toBe(true);
    expect(restoredState.inventory.items.ancientCoin).toBe(0);
  });

  it("restores deterministic world state with an injected world generator", () => {
    const metadata = {
      id: "restore-test-world",
      version: 3,
    };
    const worldGenerator: WorldGenerator = {
      metadata,
      generate(seed) {
        const world = DEFAULT_WORLD_GENERATOR.generate(seed);

        return {
          ...world,
          generatorId: metadata.id,
          generatorVersion: metadata.version,
          collectibles: world.collectibles.slice(0, 1),
        };
      },
    };
    const initialState = createInitialGameState(
      "custom-restore-seed",
      worldGenerator,
    );
    const collectible = initialState.world.collectibles[0];
    const collectedState = applyCollectionInteraction(
      {
        ...initialState,
        player: {
          ...initialState.player,
          position: collectible.position,
        },
      },
      { interact: true },
    );

    const restoredState = expectRestoredGameState(
      createSaveData(collectedState),
      [worldGenerator],
    );

    expect(restoredState.world.generatorId).toBe(metadata.id);
    expect(restoredState.world.generatorVersion).toBe(metadata.version);
    expect(restoredState.world.collectibles).toHaveLength(1);
    expect(restoredState.world.collectibles[0]?.collected).toBe(true);
  });

  it("does not restore saves for unknown world generator metadata", () => {
    const saveData = createSaveData(createInitialGameState("unknown-generator-seed"));

    expect(
      restoreGameState({
        ...saveData,
        world: {
          ...saveData.world,
          generatorId: "missing-generator",
        },
      }),
    ).toBeUndefined();
    expect(
      restoreGameState({
        ...saveData,
        world: {
          ...saveData.world,
          generatorVersion: saveData.world.generatorVersion + 1,
        },
      }),
    ).toBeUndefined();
  });

  it("migrates legacy save data without unlocked gate progression", () => {
    const gameState = createInitialGameState("legacy-save-seed");
    const saveData = createSaveData(gameState);
    const legacySaveData = {
      ...saveData,
      schemaVersion: 1,
      progression: {
        collectedEntityIds: saveData.progression.collectedEntityIds,
        interactionFlags: saveData.progression.interactionFlags,
      },
    };

    expect(parseSaveData(JSON.stringify(legacySaveData))?.progression).toEqual({
      collectedEntityIds: [],
      unlockedGateIds: [],
      interactionFlags: {},
    });
  });
});

function expectRestoredGameState(
  saveData: SaveData,
  worldGenerators?: readonly WorldGenerator[],
): GameState {
  const restoredState = restoreGameState(saveData, worldGenerators);

  if (restoredState === undefined) {
    throw new Error("Expected save data to restore.");
  }

  return restoredState;
}
