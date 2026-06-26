import { describe, expect, it } from "vitest";

import { applyCollectionInteraction } from "../../../src/game/interaction/CollectionInteraction";
import {
  createSaveData,
  CURRENT_SAVE_SCHEMA_VERSION,
  parseSaveData,
  restoreGameState,
  serializeSaveData,
} from "../../../src/game/save/SaveData";
import { createInitialGameState } from "../../../src/game/state/GameState";

describe("SaveData", () => {
  it("serializes gameplay state with the current schema version", () => {
    const timestamp = new Date("2026-06-26T04:00:00.000Z");
    const gameState = createInitialGameState("save-seed");
    const saveData = createSaveData(gameState, timestamp);

    expect(saveData.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(saveData.createdAt).toBe("2026-06-26T04:00:00.000Z");
    expect(saveData.world.seed).toBe("save-seed");
    expect(saveData.player).toEqual(gameState.player);
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

    const restoredState = restoreGameState(createSaveData(collectedState));

    expect(restoredState.inventory.items.ancientCoin).toBe(1);
    expect(
      restoredState.world.collectibles.find(
        (candidate) => candidate.id === collectible.id,
      )?.collected,
    ).toBe(true);
    expect(restoredState.world.terrain).toEqual(initialState.world.terrain);
  });
});
