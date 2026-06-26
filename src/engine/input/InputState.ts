export type InputSnapshot = {
  readonly moveForward: boolean;
  readonly moveBackward: boolean;
  readonly moveLeft: boolean;
  readonly moveRight: boolean;
};

export type MovementCommand = {
  readonly x: number;
  readonly z: number;
};

export const EMPTY_INPUT_SNAPSHOT: InputSnapshot = Object.freeze({
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
});

export const IDLE_MOVEMENT_COMMAND: MovementCommand = Object.freeze({
  x: 0,
  z: 0,
});

export function mapInputToMovementCommand(
  input: InputSnapshot,
): MovementCommand {
  const x = Number(input.moveRight) - Number(input.moveLeft);
  const z = Number(input.moveForward) - Number(input.moveBackward);
  const magnitude = Math.hypot(x, z);

  if (magnitude === 0) {
    return IDLE_MOVEMENT_COMMAND;
  }

  return {
    x: x / magnitude,
    z: z / magnitude,
  };
}
