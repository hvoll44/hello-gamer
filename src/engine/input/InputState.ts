export type InputSnapshot = {
  readonly moveForward: boolean;
  readonly moveBackward: boolean;
  readonly moveLeft: boolean;
  readonly moveRight: boolean;
  readonly interact: boolean;
  readonly save: boolean;
  readonly load: boolean;
};

export type MovementCommand = {
  readonly x: number;
  readonly z: number;
};

export type InteractionCommand = {
  readonly interact: boolean;
};

export type PersistenceCommand = {
  readonly save: boolean;
  readonly load: boolean;
};

export const EMPTY_INPUT_SNAPSHOT: InputSnapshot = Object.freeze({
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  interact: false,
  save: false,
  load: false,
});

export const IDLE_MOVEMENT_COMMAND: MovementCommand = Object.freeze({
  x: 0,
  z: 0,
});

export const IDLE_INTERACTION_COMMAND: InteractionCommand = Object.freeze({
  interact: false,
});

export const IDLE_PERSISTENCE_COMMAND: PersistenceCommand = Object.freeze({
  save: false,
  load: false,
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

export function mapInputToInteractionCommand(
  input: InputSnapshot,
): InteractionCommand {
  if (!input.interact) {
    return IDLE_INTERACTION_COMMAND;
  }

  return {
    interact: true,
  };
}

export function mapInputToPersistenceCommand(
  input: InputSnapshot,
): PersistenceCommand {
  if (!input.save && !input.load) {
    return IDLE_PERSISTENCE_COMMAND;
  }

  return {
    save: input.save,
    load: input.load,
  };
}
