import type { Vector3 } from "../../shared/Vector3";
import type { InventoryItemKind, InventoryState } from "../inventory/Inventory";
import { createInitialGameState, type GameState } from "../state/GameState";

export const CURRENT_SAVE_SCHEMA_VERSION = 1;
export const SAVE_GAME_VERSION = "0.1.0";

export type SaveData = {
  readonly schemaVersion: typeof CURRENT_SAVE_SCHEMA_VERSION;
  readonly gameVersion: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly world: {
    readonly seed: string;
    readonly generatorId: string;
    readonly generatorVersion: number;
    readonly discoveredLocationIds: readonly string[];
  };
  readonly player: {
    readonly position: Vector3;
    readonly facing: number;
  };
  readonly inventory: {
    readonly items: Readonly<Record<InventoryItemKind, number>>;
  };
  readonly progression: {
    readonly collectedEntityIds: readonly string[];
    readonly interactionFlags: Readonly<Record<string, boolean>>;
  };
};

export function createSaveData(
  gameState: GameState,
  timestamp = new Date(),
): SaveData {
  const timestampIso = timestamp.toISOString();

  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    gameVersion: SAVE_GAME_VERSION,
    createdAt: timestampIso,
    updatedAt: timestampIso,
    world: {
      seed: gameState.world.seed,
      generatorId: "default-terrain",
      generatorVersion: 1,
      discoveredLocationIds: gameState.world.landmarks
        .filter((landmark) => landmark.discovered)
        .map((landmark) => landmark.id),
    },
    player: gameState.player,
    inventory: {
      items: gameState.inventory.items,
    },
    progression: {
      collectedEntityIds: gameState.world.collectibles
        .filter((collectible) => collectible.collected)
        .map((collectible) => collectible.id),
      interactionFlags: {},
    },
  };
}

export function serializeSaveData(saveData: SaveData): string {
  return JSON.stringify(saveData);
}

export function parseSaveData(serializedSaveData: string): SaveData | undefined {
  try {
    const parsedSaveData: unknown = JSON.parse(serializedSaveData);
    return isSaveData(parsedSaveData) ? parsedSaveData : undefined;
  } catch {
    return undefined;
  }
}

export function restoreGameState(saveData: SaveData): GameState {
  const initialState = createInitialGameState(saveData.world.seed);
  const collectedEntityIds = new Set(saveData.progression.collectedEntityIds);
  const discoveredLocationIds = new Set(saveData.world.discoveredLocationIds);

  return {
    ...initialState,
    player: saveData.player,
    inventory: restoreInventory(saveData.inventory.items),
    world: {
      ...initialState.world,
      collectibles: initialState.world.collectibles.map((collectible) => ({
        ...collectible,
        collected: collectedEntityIds.has(collectible.id),
      })),
      landmarks: initialState.world.landmarks.map((landmark) => ({
        ...landmark,
        discovered: discoveredLocationIds.has(landmark.id),
      })),
    },
  };
}

function restoreInventory(
  items: Readonly<Record<InventoryItemKind, number>>,
): InventoryState {
  return {
    items: {
      ancientCoin: items.ancientCoin,
    },
  };
}

function isSaveData(value: unknown): value is SaveData {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === CURRENT_SAVE_SCHEMA_VERSION &&
    typeof value.gameVersion === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isWorldSaveData(value.world) &&
    isPlayerSaveData(value.player) &&
    isInventorySaveData(value.inventory) &&
    isProgressionSaveData(value.progression)
  );
}

function isWorldSaveData(value: unknown): value is SaveData["world"] {
  return (
    isRecord(value) &&
    typeof value.seed === "string" &&
    typeof value.generatorId === "string" &&
    typeof value.generatorVersion === "number" &&
    Array.isArray(value.discoveredLocationIds) &&
    value.discoveredLocationIds.every((id) => typeof id === "string")
  );
}

function isPlayerSaveData(value: unknown): value is SaveData["player"] {
  return (
    isRecord(value) &&
    isVector3(value.position) &&
    typeof value.facing === "number"
  );
}

function isInventorySaveData(value: unknown): value is SaveData["inventory"] {
  return (
    isRecord(value) &&
    isRecord(value.items) &&
    typeof value.items.ancientCoin === "number" &&
    value.items.ancientCoin >= 0
  );
}

function isProgressionSaveData(
  value: unknown,
): value is SaveData["progression"] {
  return (
    isRecord(value) &&
    Array.isArray(value.collectedEntityIds) &&
    value.collectedEntityIds.every((id) => typeof id === "string") &&
    isRecord(value.interactionFlags) &&
    Object.values(value.interactionFlags).every((flag) => typeof flag === "boolean")
  );
}

function isVector3(value: unknown): value is Vector3 {
  return (
    isRecord(value) &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.z === "number"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
