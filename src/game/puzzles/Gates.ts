import type { InteractionCommand } from "../../engine/input/InputState";
import type { Vector3 } from "../../shared/Vector3";
import { spendInventoryItem, type InventoryItemKind } from "../inventory/Inventory";
import type { GameState } from "../state/GameState";
import type { TerrainState, TerrainTile } from "../terrain/Terrain";

export type GateRequirement = {
  readonly itemKind: InventoryItemKind;
  readonly quantity: number;
};

export type GateState = {
  readonly id: string;
  readonly name: string;
  readonly position: Vector3;
  readonly interactionRadius: number;
  readonly blockingRadius: number;
  readonly requirement: GateRequirement;
  readonly unlocked: boolean;
};

export type GateMovementBlocker = {
  readonly position: Pick<Vector3, "x" | "z">;
  readonly radius: number;
};

const GATE_HALF_HEIGHT = 0.75;
const GATE_BLOCKING_RADIUS = 0.45;

export function generateGates(
  seed: string,
  terrain: TerrainState,
): readonly GateState[] {
  const tile = selectGateTile(seed, terrain);

  return [
    {
      id: "mosslit-gate",
      name: "Mosslit Gate",
      position: {
        x: tile.x * terrain.tileSize,
        y: tile.height + GATE_HALF_HEIGHT,
        z: tile.z * terrain.tileSize,
      },
      interactionRadius: 1.4,
      blockingRadius: GATE_BLOCKING_RADIUS,
      requirement: {
        itemKind: "ancientCoin",
        quantity: 2,
      },
      unlocked: false,
    },
  ];
}

export function getLockedGateMovementBlockers(
  gates: readonly GateState[],
): readonly GateMovementBlocker[] {
  return gates
    .filter((gate) => !gate.unlocked)
    .map((gate) => ({
      position: gate.position,
      radius: gate.blockingRadius,
    }));
}

export function applyGateInteraction(
  gameState: GameState,
  command: InteractionCommand,
): GameState {
  if (!command.interact) {
    return gameState;
  }

  const gate = gameState.world.gates
    .filter((candidate) => !candidate.unlocked)
    .map((candidate) => ({
      gate: candidate,
      distance: Math.hypot(
        candidate.position.x - gameState.player.position.x,
        candidate.position.z - gameState.player.position.z,
      ),
    }))
    .filter(({ distance, gate }) => distance <= gate.interactionRadius)
    .sort((first, second) => first.distance - second.distance)
    .at(0)?.gate;

  if (
    gate === undefined ||
    gameState.inventory.items[gate.requirement.itemKind] < gate.requirement.quantity
  ) {
    return gameState;
  }

  return {
    ...gameState,
    inventory: spendInventoryItem(
      gameState.inventory,
      gate.requirement.itemKind,
      gate.requirement.quantity,
    ),
    world: {
      ...gameState.world,
      gates: gameState.world.gates.map((candidate) =>
        candidate.id === gate.id ? { ...candidate, unlocked: true } : candidate,
      ),
    },
  };
}

function selectGateTile(seed: string, terrain: TerrainState): TerrainTile {
  return terrain.tiles
    .filter((tile) => Math.hypot(tile.x, tile.z) >= Math.floor(terrain.size / 3))
    .map((tile) => ({
      tile,
      score: hashString(`${seed}:gate:${String(tile.x)}:${String(tile.z)}`),
    }))
    .sort((first, second) => first.score - second.score)[0].tile;
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
