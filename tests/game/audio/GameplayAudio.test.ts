import { describe, expect, it } from "vitest";

import {
  deriveGameplayAudioEvents,
  GAMEPLAY_AUDIO_CUES,
  playGameplayAudioEvents,
  type GameplayAudioCueId,
} from "../../../src/game/audio/GameplayAudio";
import { applyCollectionInteraction } from "../../../src/game/interaction/CollectionInteraction";
import { updateLandmarkDiscovery } from "../../../src/game/landmarks/Landmarks";
import { applyGateInteraction } from "../../../src/game/puzzles/Gates";
import { createInitialGameState } from "../../../src/game/state/GameState";

describe("deriveGameplayAudioEvents", () => {
  it("emits a collect cue when coin inventory increases", () => {
    const initialState = createInitialGameState("collect-audio-seed");
    const collectible = initialState.world.collectibles[0];
    const collectedState = applyCollectionInteraction(
      {
        ...initialState,
        player: {
          ...initialState.player,
          position: collectible.position,
        },
      },
      { interact: true },
    );

    expect(deriveGameplayAudioEvents(initialState, collectedState)).toEqual([
      { cueId: GAMEPLAY_AUDIO_CUES.collectCoin },
    ]);
  });

  it("emits a discovery cue when a landmark becomes discovered", () => {
    const initialState = createInitialGameState("discovery-audio-seed");
    const landmark = initialState.world.landmarks[0];
    const discoveredState = {
      ...initialState,
      world: {
        ...initialState.world,
        landmarks: updateLandmarkDiscovery(
          initialState.world.landmarks,
          landmark.position,
        ),
      },
    };

    expect(deriveGameplayAudioEvents(initialState, discoveredState)).toEqual([
      { cueId: GAMEPLAY_AUDIO_CUES.discoverLandmark },
    ]);
  });

  it("emits a gate cue when a gate unlocks", () => {
    const initialState = createInitialGameState("gate-audio-seed");
    const gate = initialState.world.gates[0];
    const readyState = {
      ...initialState,
      player: {
        ...initialState.player,
        position: gate.position,
      },
      inventory: {
        items: {
          ancientCoin: 2,
        },
      },
    };
    const unlockedState = applyGateInteraction(readyState, { interact: true });

    expect(deriveGameplayAudioEvents(readyState, unlockedState)).toEqual([
      { cueId: GAMEPLAY_AUDIO_CUES.unlockGate },
    ]);
  });

  it("does not emit cues for unchanged progression", () => {
    const initialState = createInitialGameState("quiet-audio-seed");

    expect(deriveGameplayAudioEvents(initialState, initialState)).toEqual([]);
  });
});

describe("playGameplayAudioEvents", () => {
  it("plays derived cue ids through a generic audio sink", () => {
    const playedCueIds: GameplayAudioCueId[] = [];

    playGameplayAudioEvents(
      [
        { cueId: GAMEPLAY_AUDIO_CUES.collectCoin },
        { cueId: GAMEPLAY_AUDIO_CUES.discoverLandmark },
      ],
      {
        play: (cueId) => {
          playedCueIds.push(cueId);
        },
      },
    );

    expect(playedCueIds).toEqual([
      GAMEPLAY_AUDIO_CUES.collectCoin,
      GAMEPLAY_AUDIO_CUES.discoverLandmark,
    ]);
  });
});
