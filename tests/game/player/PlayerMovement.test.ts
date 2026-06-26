import { describe, expect, it } from "vitest";

import { updatePlayerMovement } from "../../../src/game/player/PlayerMovement";
import type { PlayerState } from "../../../src/game/state/GameState";
import { generateTerrain } from "../../../src/game/terrain/Terrain";

describe("updatePlayerMovement", () => {
  it("moves the player from a command and delta time", () => {
    const terrain = generateTerrain("movement-seed");
    const player: PlayerState = {
      position: terrain.spawn,
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      0.5,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
    );

    expect(nextPlayer.position.x).toBeCloseTo(1);
    expect(nextPlayer.position.z).toBeCloseTo(0);
    expect(nextPlayer.facing).toBeCloseTo(Math.PI / 2);
  });

  it("keeps idle movement as the same state object", () => {
    const terrain = generateTerrain("idle-seed");
    const player: PlayerState = {
      position: terrain.spawn,
      facing: 0,
    };

    expect(updatePlayerMovement(player, { x: 0, z: 0 }, terrain, 1)).toBe(
      player,
    );
  });

  it("updates player height from terrain", () => {
    const terrain = generateTerrain("height-seed");
    const player: PlayerState = {
      position: terrain.spawn,
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      1,
      { speedMetersPerSecond: 1, halfHeight: 0.375 },
    );

    expect(nextPlayer.position.y).toBe(
      (terrain.tiles.find((tile) => tile.x === 1 && tile.z === 0)?.height ??
        0) + 0.375,
    );
  });
});
