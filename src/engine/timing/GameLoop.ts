export type FrameCallback = (deltaSeconds: number) => void;

export type GameLoop = {
  start(): void;
  stop(): void;
};

export function createGameLoop(onFrame: FrameCallback): GameLoop {
  let animationFrameId: number | undefined;
  let lastTimestamp: number | undefined;

  const tick = (timestamp: number): void => {
    const deltaSeconds =
      lastTimestamp === undefined ? 0 : (timestamp - lastTimestamp) / 1000;

    lastTimestamp = timestamp;
    onFrame(deltaSeconds);
    animationFrameId = requestAnimationFrame(tick);
  };

  return {
    start: () => {
      if (animationFrameId !== undefined) {
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    },
    stop: () => {
      if (animationFrameId === undefined) {
        return;
      }

      cancelAnimationFrame(animationFrameId);
      animationFrameId = undefined;
      lastTimestamp = undefined;
    },
  };
}
