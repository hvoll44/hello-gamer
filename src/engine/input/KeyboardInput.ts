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
  | "moveRight"
  | "interact"
  | "save"
  | "load";

const KEY_BINDINGS = new Map<string, KeyDirection>([
  ["KeyW", "moveForward"],
  ["ArrowUp", "moveForward"],
  ["KeyS", "moveBackward"],
  ["ArrowDown", "moveBackward"],
  ["KeyA", "moveLeft"],
  ["ArrowLeft", "moveLeft"],
  ["KeyD", "moveRight"],
  ["ArrowRight", "moveRight"],
  ["KeyE", "interact"],
  ["Space", "interact"],
  ["KeyK", "save"],
  ["KeyL", "load"],
]);

export function createKeyboardInputSource(
  target: Window,
): KeyboardInputSource {
  const pressedKeys = new Set<string>();
  let pendingInteract = false;
  let pendingSave = false;
  let pendingLoad = false;

  const updateKey = (event: KeyboardEvent, isPressed: boolean): void => {
    const direction = KEY_BINDINGS.get(event.code);

    if (direction === undefined) {
      return;
    }

    event.preventDefault();

    if (direction === "interact" || direction === "save" || direction === "load") {
      updatePendingAction(direction, isPressed, event.repeat);
      return;
    }

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
    pendingInteract = false;
    pendingSave = false;
    pendingLoad = false;
  };

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);
  target.addEventListener("blur", handleBlur);

  return {
    snapshot: () => {
      const inputSnapshot = keysToInputSnapshot(pressedKeys, {
        interact: pendingInteract,
        save: pendingSave,
        load: pendingLoad,
      });
      pendingInteract = false;
      pendingSave = false;
      pendingLoad = false;
      return inputSnapshot;
    },
    dispose: () => {
      target.removeEventListener("keydown", handleKeyDown);
      target.removeEventListener("keyup", handleKeyUp);
      target.removeEventListener("blur", handleBlur);
      pressedKeys.clear();
      pendingInteract = false;
      pendingSave = false;
      pendingLoad = false;
    },
  };

  function updatePendingAction(
    direction: "interact" | "save" | "load",
    isPressed: boolean,
    isRepeat: boolean,
  ): void {
    if (!isPressed || isRepeat) {
      return;
    }

    if (direction === "interact") {
      pendingInteract = true;
    }

    if (direction === "save") {
      pendingSave = true;
    }

    if (direction === "load") {
      pendingLoad = true;
    }
  }
}

type PendingActions = {
  readonly interact: boolean;
  readonly save: boolean;
  readonly load: boolean;
};

function keysToInputSnapshot(
  pressedKeys: ReadonlySet<string>,
  pendingActions: PendingActions,
): InputSnapshot {
  if (
    pressedKeys.size === 0 &&
    !pendingActions.interact &&
    !pendingActions.save &&
    !pendingActions.load
  ) {
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
    interact: pendingActions.interact,
    save: pendingActions.save,
    load: pendingActions.load,
  };
}
