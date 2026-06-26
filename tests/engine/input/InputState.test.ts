import { describe, expect, it } from "vitest";

import { mapInputToMovementCommand } from "../../../src/engine/input/InputState";

describe("mapInputToMovementCommand", () => {
  it("maps directional input to a movement command", () => {
    expect(
      mapInputToMovementCommand({
        moveForward: true,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
      }),
    ).toEqual({ x: 0, z: 1 });
  });

  it("normalizes diagonal movement", () => {
    const command = mapInputToMovementCommand({
      moveForward: true,
      moveBackward: false,
      moveLeft: false,
      moveRight: true,
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
      }),
    ).toEqual({ x: 0, z: 0 });
  });
});
