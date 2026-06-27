import { describe, expect, it } from "vitest";

import { createAssetCatalog } from "../../../src/engine/assets/AssetCatalog";
import {
  createAudioManager,
  type AudioBackend,
  type LoadedAudioCue,
} from "../../../src/engine/audio/AudioManager";

describe("createAudioManager", () => {
  it("loads cues through the backend with resolved asset URLs", () => {
    const backend = createRecordingBackend();
    const catalog = createAssetCatalog({
      basePath: "assets",
      entries: [
        {
          id: "forest.ambience.asset",
          kind: "audio",
          path: "audio/forest.ogg",
        },
      ],
    });

    createAudioManager(
      {
        cues: [
          {
            id: "forest.ambience",
            assetId: "forest.ambience.asset",
            channel: "ambience",
            loop: true,
            volume: 0.5,
          },
        ],
      },
      catalog,
      backend,
    );

    expect(backend.loaded).toEqual([
      {
        id: "forest.ambience",
        assetId: "forest.ambience.asset",
        channel: "ambience",
        loop: true,
        volume: 0.5,
        url: "assets/audio/forest.ogg",
      },
    ]);
  });

  it("plays and stops known cues through the backend", () => {
    const backend = createRecordingBackend();
    const manager = createAudioManager(
      {
        cues: [
          {
            id: "coin.pickup",
            assetId: "coin.pickup.asset",
            channel: "sfx",
          },
        ],
      },
      createAssetCatalog({
        entries: [
          {
            id: "coin.pickup.asset",
            kind: "audio",
            path: "audio/coin.ogg",
          },
        ],
      }),
      backend,
    );

    manager.play("coin.pickup");
    manager.stop("coin.pickup");

    expect(backend.played).toEqual(["coin.pickup"]);
    expect(backend.stopped).toEqual(["coin.pickup"]);
  });

  it("stops all cues in a channel", () => {
    const backend = createRecordingBackend();
    const manager = createAudioManager(
      {
        cues: [
          {
            id: "theme",
            assetId: "theme.asset",
            channel: "music",
          },
          {
            id: "forest",
            assetId: "forest.asset",
            channel: "ambience",
          },
        ],
      },
      createAssetCatalog({
        entries: [
          {
            id: "theme.asset",
            kind: "audio",
            path: "audio/theme.ogg",
          },
          {
            id: "forest.asset",
            kind: "audio",
            path: "audio/forest.ogg",
          },
        ],
      }),
      backend,
    );

    manager.stopChannel("music");

    expect(backend.stopped).toEqual(["theme"]);
  });

  it("filters cues by channel", () => {
    const manager = createAudioManager(
      {
        cues: [
          {
            id: "button",
            assetId: "button.asset",
            channel: "ui",
          },
          {
            id: "coin",
            assetId: "coin.asset",
            channel: "sfx",
          },
        ],
      },
      createAssetCatalog({
        entries: [
          {
            id: "button.asset",
            kind: "audio",
            path: "audio/button.ogg",
          },
          {
            id: "coin.asset",
            kind: "audio",
            path: "audio/coin.ogg",
          },
        ],
      }),
      createRecordingBackend(),
    );

    expect(manager.list("ui")).toEqual([
      {
        id: "button",
        assetId: "button.asset",
        channel: "ui",
      },
    ]);
  });

  it("rejects duplicate cues and non-audio assets", () => {
    const catalog = createAssetCatalog({
      entries: [
        {
          id: "asset",
          kind: "audio",
          path: "audio/sound.ogg",
        },
        {
          id: "model.asset",
          kind: "model",
          path: "models/player.glb",
        },
      ],
    });

    expect(() =>
      createAudioManager(
        {
          cues: [
            {
              id: "duplicate",
              assetId: "asset",
              channel: "sfx",
            },
            {
              id: "duplicate",
              assetId: "asset",
              channel: "ui",
            },
          ],
        },
        catalog,
        createRecordingBackend(),
      ),
    ).toThrow("Duplicate audio cue id: duplicate");

    expect(() =>
      createAudioManager(
        {
          cues: [
            {
              id: "bad.model",
              assetId: "model.asset",
              channel: "sfx",
            },
          ],
        },
        catalog,
        createRecordingBackend(),
      ),
    ).toThrow("Audio cue asset must be audio: model.asset");
  });

  it("rejects out-of-range cue volumes and unknown play requests", () => {
    const catalog = createAssetCatalog({
      entries: [
        {
          id: "asset",
          kind: "audio",
          path: "audio/sound.ogg",
        },
      ],
    });

    expect(() =>
      createAudioManager(
        {
          cues: [
            {
              id: "too-loud",
              assetId: "asset",
              channel: "sfx",
              volume: 1.1,
            },
          ],
        },
        catalog,
        createRecordingBackend(),
      ),
    ).toThrow("Audio cue volume must be between 0 and 1: too-loud");

    const manager = createAudioManager({ cues: [] }, catalog, createRecordingBackend());

    expect(() => {
      manager.play("missing");
    }).toThrow("Unknown audio cue id: missing");
  });
});

type RecordingBackend = AudioBackend & {
  readonly loaded: LoadedAudioCue[];
  readonly played: string[];
  readonly stopped: string[];
  readonly disposed: string[];
};

function createRecordingBackend(): RecordingBackend {
  const loaded: LoadedAudioCue[] = [];
  const played: string[] = [];
  const stopped: string[] = [];
  const disposed: string[] = [];

  return {
    loaded,
    played,
    stopped,
    disposed,
    load: (cue) => {
      loaded.push(cue);
    },
    play: (cueId) => {
      played.push(cueId);
    },
    stop: (cueId) => {
      stopped.push(cueId);
    },
    dispose: () => {
      disposed.push("disposed");
    },
  };
}
