import { describe, expect, it } from "vitest";

import {
  mapInputToPersistenceCommand,
  mapInputToInteractionCommand,
  mapInputToMovementCommand,
} from "../../../src/engine/input/InputState";

describe("mapInputToMovementCommand", () => {
  it("maps directional input to a movement command", () => {
    expect(
      mapInputToMovementCommand({
        moveForward: true,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        interact: false,
        save: false,
        load: false,
      }),
    ).toEqual({ x: 0, z: 1 });
  });

  it("normalizes diagonal movement", () => {
    const command = mapInputToMovementCommand({
      moveForward: true,
      moveBackward: false,
      moveLeft: false,
      moveRight: true,
      interact: false,
      save: false,
      load: false,
    });

    expect(command.x).toBeCloseTo(Math.SQRT1_2);
    expect(command.z).toBeCloseTo(Math.SQRT1_2);
  });

  it("cancels opposing movement", () => {
    expect(
      mapInputToMovementCommand({
        moveForward: true,
        moveBackward: true,
        moveLeft: true,
        moveRight: true,
        interact: false,
        save: false,
        load: false,
      }),
    ).toEqual({ x: 0, z: 0 });
  });
});

describe("mapInputToInteractionCommand", () => {
  it("maps interact input to a command", () => {
    expect(
      mapInputToInteractionCommand({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        interact: true,
        save: false,
        load: false,
      }),
    ).toEqual({ interact: true });
  });
});

describe("mapInputToPersistenceCommand", () => {
  it("maps save and load input to a command", () => {
    expect(
      mapInputToPersistenceCommand({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        interact: false,
        save: true,
        load: true,
      }),
    ).toEqual({ save: true, load: true });
  });
});
