import { describe, expect, it } from "vitest";

import { createAssetCatalog } from "../../../src/engine/assets/AssetCatalog";
import {
  createAudioManager,
  type AudioBackend,
  type LoadedAudioCue,
} from "../../../src/engine/audio/AudioManager";
import { GAMEPLAY_AUDIO_CUES } from "../../../src/game/audio/GameplayAudio";
import {
  GAMEPLAY_AUDIO_ASSET_IDS,
  GAMEPLAY_AUDIO_ASSET_MANIFEST,
} from "../../../src/runtime/assets/GameplayAudioAssets";
import { GAMEPLAY_AUDIO_CUE_MANIFEST } from "../../../src/runtime/audio/GameplayAudioManifest";

describe("gameplay audio runtime manifests", () => {
  it("lists browser-served placeholder assets for gameplay audio", () => {
    const catalog = createAssetCatalog(GAMEPLAY_AUDIO_ASSET_MANIFEST);

    expect(catalog.list("audio")).toEqual([
      {
        id: GAMEPLAY_AUDIO_ASSET_IDS.collectCoin,
        kind: "audio",
        path: "audio/coin.wav",
      },
      {
        id: GAMEPLAY_AUDIO_ASSET_IDS.discoverLandmark,
        kind: "audio",
        path: "audio/discovery.wav",
      },
      {
        id: GAMEPLAY_AUDIO_ASSET_IDS.unlockGate,
        kind: "audio",
        path: "audio/gate-unlock.wav",
      },
    ]);
  });

  it("maps stable gameplay cue ids to runtime audio assets", () => {
    expect(GAMEPLAY_AUDIO_CUE_MANIFEST.cues).toEqual([
      {
        id: GAMEPLAY_AUDIO_CUES.collectCoin,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.collectCoin,
        channel: "sfx",
        volume: 0.55,
      },
      {
        id: GAMEPLAY_AUDIO_CUES.discoverLandmark,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.discoverLandmark,
        channel: "sfx",
        volume: 0.5,
      },
      {
        id: GAMEPLAY_AUDIO_CUES.unlockGate,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.unlockGate,
        channel: "sfx",
        volume: 0.55,
      },
    ]);
  });

  it("loads every gameplay cue through the engine audio manager", () => {
    const backend = createRecordingBackend();

    createAudioManager(
      GAMEPLAY_AUDIO_CUE_MANIFEST,
      createAssetCatalog(GAMEPLAY_AUDIO_ASSET_MANIFEST),
      backend,
    );

    expect(backend.loaded).toEqual([
      {
        id: GAMEPLAY_AUDIO_CUES.collectCoin,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.collectCoin,
        channel: "sfx",
        volume: 0.55,
        url: "audio/coin.wav",
      },
      {
        id: GAMEPLAY_AUDIO_CUES.discoverLandmark,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.discoverLandmark,
        channel: "sfx",
        volume: 0.5,
        url: "audio/discovery.wav",
      },
      {
        id: GAMEPLAY_AUDIO_CUES.unlockGate,
        assetId: GAMEPLAY_AUDIO_ASSET_IDS.unlockGate,
        channel: "sfx",
        volume: 0.55,
        url: "audio/gate-unlock.wav",
      },
    ]);
  });
});

type RecordingBackend = AudioBackend & {
  readonly loaded: LoadedAudioCue[];
};

function createRecordingBackend(): RecordingBackend {
  const loaded: LoadedAudioCue[] = [];

  return {
    loaded,
    load: (cue) => {
      loaded.push(cue);
    },
    play: () => {},
    stop: () => {},
    dispose: () => {},
  };
}
