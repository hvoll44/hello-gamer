import { describe, expect, it } from "vitest";

import {
  applyGateInteraction,
  generateGates,
} from "../../../src/game/puzzles/Gates";
import { createInitialGameState } from "../../../src/game/state/GameState";
import { generateTerrain } from "../../../src/game/terrain/Terrain";

describe("generateGates", () => {
  it("creates deterministic gates for a seed and terrain", () => {
    const terrain = generateTerrain("gate-seed");
    const firstGates = generateGates("gate-seed", terrain);
    const secondGates = generateGates("gate-seed", terrain);

    expect(secondGates).toEqual(firstGates);
  });

  it("places the gate away from spawn", () => {
    const terrain = generateTerrain("gate-spawn-seed");
    const gates = generateGates("gate-spawn-seed", terrain);

    expect(gates).toHaveLength(1);
    expect(gates[0]?.position.x).not.toBe(terrain.spawn.x);
    expect(gates[0]?.position.z).not.toBe(terrain.spawn.z);
  });
});

describe("applyGateInteraction", () => {
  it("unlocks a nearby gate when the player has the required item count", () => {
    const initialState = createInitialGameState("unlock-gate-seed");
    const gate = initialState.world.gates[0];
    const gameState = {
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
    };

    const nextState = applyGateInteraction(gameState, { interact: true });

    expect(nextState.inventory.items.ancientCoin).toBe(0);
    expect(nextState.world.gates[0]?.unlocked).toBe(true);
  });

  it("keeps the gate locked when the player lacks the requirement", () => {
    const initialState = createInitialGameState("locked-gate-seed");
    const gate = initialState.world.gates[0];
    const gameState = {
      ...initialState,
      player: {
        ...initialState.player,
        position: gate.position,
      },
    };

    expect(applyGateInteraction(gameState, { interact: true })).toBe(gameState);
  });

  it("does not unlock gates outside interaction range", () => {
    const initialState = createInitialGameState("distant-gate-seed");
    const gameState = {
      ...initialState,
      inventory: {
        items: {
          ancientCoin: 2,
        },
      },
    };

    expect(applyGateInteraction(gameState, { interact: true })).toBe(gameState);
  });
});
