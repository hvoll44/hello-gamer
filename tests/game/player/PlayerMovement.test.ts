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

  it("clamps movement to terrain bounds", () => {
    const terrain = generateTerrain("boundary-seed", { size: 3, tileSize: 1 });
    const player: PlayerState = {
      position: terrain.spawn,
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      10,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
    );

    expect(nextPlayer.position.x).toBe(terrain.movementBounds.maxX);
    expect(nextPlayer.position.z).toBe(0);
  });

  it("blocks movement that crosses a movement blocker", () => {
    const terrain = generateTerrain("blocked-seed");
    const player: PlayerState = {
      position: {
        ...terrain.spawn,
        x: -1,
        z: 0,
      },
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      1,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
      [{ position: { x: 0, z: 0 }, radius: 0.45 }],
    );

    expect(nextPlayer.position).toEqual(player.position);
    expect(nextPlayer.facing).toBeCloseTo(Math.PI / 2);
  });

  it("moves through when no movement blockers are active", () => {
    const terrain = generateTerrain("passable-seed");
    const player: PlayerState = {
      position: {
        ...terrain.spawn,
        x: -1,
        z: 0,
      },
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      1,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
      [],
    );

    expect(nextPlayer.position.x).toBeCloseTo(1);
    expect(nextPlayer.position.z).toBeCloseTo(0);
  });

  it("blocks clamped movement at terrain bounds", () => {
    const terrain = generateTerrain("boundary-blocked-seed", {
      size: 3,
      tileSize: 1,
    });
    const player: PlayerState = {
      position: {
        ...terrain.spawn,
        x: 0.7,
        z: 0,
      },
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      10,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
      [{ position: { x: terrain.movementBounds.maxX, z: 0 }, radius: 0.2 }],
    );

    expect(nextPlayer.position).toEqual(player.position);
    expect(nextPlayer.facing).toBeCloseTo(Math.PI / 2);
  });

  it("allows movement away from a blocker if already inside one", () => {
    const terrain = generateTerrain("escape-blocker-seed");
    const player: PlayerState = {
      position: {
        ...terrain.spawn,
        x: 0,
        z: 0,
      },
      facing: 0,
    };

    const nextPlayer = updatePlayerMovement(
      player,
      { x: 1, z: 0 },
      terrain,
      0.25,
      { speedMetersPerSecond: 2, halfHeight: 0.375 },
      [{ position: { x: 0, z: 0 }, radius: 0.45 }],
    );

    expect(nextPlayer.position.x).toBeCloseTo(0.5);
    expect(nextPlayer.position.z).toBeCloseTo(0);
  });
});
