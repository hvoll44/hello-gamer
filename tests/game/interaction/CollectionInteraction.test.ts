import { describe, expect, it } from "vitest";

import { applyCollectionInteraction } from "../../../src/game/interaction/CollectionInteraction";
import { createInitialGameState } from "../../../src/game/state/GameState";

describe("applyCollectionInteraction", () => {
  it("collects the nearest uncollected item in range", () => {
    const initialState = createInitialGameState("interaction-seed");
    const collectible = initialState.world.collectibles[0];

    const gameState = {
      ...initialState,
      player: {
        ...initialState.player,
        position: collectible.position,
      },
    };
    const nextState = applyCollectionInteraction(
      gameState,
      { interact: true },
      { rangeMeters: 1 },
    );

    expect(nextState.inventory.items.ancientCoin).toBe(1);
    expect(
      nextState.world.collectibles.find(
        (candidate) => candidate.id === collectible.id,
      )?.collected,
    ).toBe(true);
  });

  it("does not collect without an interact command", () => {
    const initialState = createInitialGameState("no-command-seed");
    const collectible = initialState.world.collectibles[0];

    const gameState = {
      ...initialState,
      player: {
        ...initialState.player,
        position: collectible.position,
      },
    };

    expect(applyCollectionInteraction(gameState, { interact: false })).toBe(
      gameState,
    );
  });

  it("does not collect items outside interaction range", () => {
    const initialState = createInitialGameState("out-of-range-seed");
    const nextState = applyCollectionInteraction(
      initialState,
      { interact: true },
      { rangeMeters: 0.1 },
    );

    expect(nextState).toBe(initialState);
  });
});
