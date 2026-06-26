import {
  EMPTY_INPUT_SNAPSHOT,
  type InputSnapshot,
} from "./InputState";

export type KeyboardInputSource = {
  snapshot(): InputSnapshot;
  dispose(): void;
};

type KeyDirection =
  | "moveForward"
  | "moveBackward"
  | "moveLeft"
  | "moveRight";

const KEY_BINDINGS = new Map<string, KeyDirection>([
  ["KeyW", "moveForward"],
  ["ArrowUp", "moveForward"],
  ["KeyS", "moveBackward"],
  ["ArrowDown", "moveBackward"],
  ["KeyA", "moveLeft"],
  ["ArrowLeft", "moveLeft"],
  ["KeyD", "moveRight"],
  ["ArrowRight", "moveRight"],
]);

export function createKeyboardInputSource(
  target: Window,
): KeyboardInputSource {
  const pressedKeys = new Set<string>();

  const updateKey = (event: KeyboardEvent, isPressed: boolean): void => {
    if (!KEY_BINDINGS.has(event.code)) {
      return;
    }

    event.preventDefault();

    if (isPressed) {
      pressedKeys.add(event.code);
      return;
    }

    pressedKeys.delete(event.code);
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    updateKey(event, true);
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    updateKey(event, false);
  };

  const handleBlur = (): void => {
    pressedKeys.clear();
  };

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);
  target.addEventListener("blur", handleBlur);

  return {
    snapshot: () => keysToInputSnapshot(pressedKeys),
    dispose: () => {
      target.removeEventListener("keydown", handleKeyDown);
      target.removeEventListener("keyup", handleKeyUp);
      target.removeEventListener("blur", handleBlur);
      pressedKeys.clear();
    },
  };
}

function keysToInputSnapshot(pressedKeys: ReadonlySet<string>): InputSnapshot {
  if (pressedKeys.size === 0) {
    return EMPTY_INPUT_SNAPSHOT;
  }

  const directions = new Set<KeyDirection>();

  for (const key of pressedKeys) {
    const direction = KEY_BINDINGS.get(key);

    if (direction !== undefined) {
      directions.add(direction);
    }
  }

  return {
    moveForward: directions.has("moveForward"),
    moveBackward: directions.has("moveBackward"),
    moveLeft: directions.has("moveLeft"),
    moveRight: directions.has("moveRight"),
  };
}
