import type { GameState } from "../state/GameState";

export const GAMEPLAY_AUDIO_CUES = Object.freeze({
  collectCoin: "gameplay.collect.coin",
  discoverLandmark: "gameplay.discover.landmark",
  unlockGate: "gameplay.unlock.gate",
});

export type GameplayAudioCueId =
  (typeof GAMEPLAY_AUDIO_CUES)[keyof typeof GAMEPLAY_AUDIO_CUES];

export type GameplayAudioEvent = {
  readonly cueId: GameplayAudioCueId;
};

export type GameplayAudioSink = {
  play(cueId: GameplayAudioCueId): void;
};

export function deriveGameplayAudioEvents(
  previousState: GameState,
  nextState: GameState,
): readonly GameplayAudioEvent[] {
  const events: GameplayAudioEvent[] = [];

  if (
    nextState.inventory.items.ancientCoin >
    previousState.inventory.items.ancientCoin
  ) {
    events.push({ cueId: GAMEPLAY_AUDIO_CUES.collectCoin });
  }

  if (
    countDiscoveredLandmarks(nextState) > countDiscoveredLandmarks(previousState)
  ) {
    events.push({ cueId: GAMEPLAY_AUDIO_CUES.discoverLandmark });
  }

  if (countUnlockedGates(nextState) > countUnlockedGates(previousState)) {
    events.push({ cueId: GAMEPLAY_AUDIO_CUES.unlockGate });
  }

  return events;
}

export function playGameplayAudioEvents(
  events: readonly GameplayAudioEvent[],
  sink: GameplayAudioSink,
): void {
  for (const event of events) {
    sink.play(event.cueId);
  }
}

function countDiscoveredLandmarks(gameState: GameState): number {
  return gameState.world.landmarks.filter((landmark) => landmark.discovered)
    .length;
}

function countUnlockedGates(gameState: GameState): number {
  return gameState.world.gates.filter((gate) => gate.unlocked).length;
}
