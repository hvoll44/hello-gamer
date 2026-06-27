import type { AssetCatalog } from "../assets/AssetCatalog";

export type AudioChannel = "ambience" | "music" | "sfx" | "ui";

export type AudioCue = {
  readonly id: string;
  readonly assetId: string;
  readonly channel: AudioChannel;
  readonly loop?: boolean;
  readonly volume?: number;
};

export type AudioCueManifest = {
  readonly cues: readonly AudioCue[];
};

export type LoadedAudioCue = AudioCue & {
  readonly url: string;
};

export type AudioBackend = {
  load(cue: LoadedAudioCue): void;
  play(cueId: string): void;
  stop(cueId: string): void;
  dispose(): void;
};

export type AudioManager = {
  play(cueId: string): void;
  stop(cueId: string): void;
  stopChannel(channel: AudioChannel): void;
  list(channel?: AudioChannel): readonly AudioCue[];
  dispose(): void;
};

export function createAudioManager(
  cueManifest: AudioCueManifest,
  assetCatalog: AssetCatalog,
  backend: AudioBackend,
): AudioManager {
  const cuesById = new Map<string, AudioCue>();

  for (const cue of cueManifest.cues) {
    validateCue(cue);

    if (cuesById.has(cue.id)) {
      throw new Error(`Duplicate audio cue id: ${cue.id}`);
    }

    const asset = assetCatalog.require(cue.assetId);

    if (asset.kind !== "audio") {
      throw new Error(`Audio cue asset must be audio: ${cue.assetId}`);
    }

    cuesById.set(cue.id, cue);
    backend.load({
      ...cue,
      url: assetCatalog.requireUrl(cue.assetId),
    });
  }

  return {
    play: (cueId) => {
      requireCue(cuesById, cueId);
      backend.play(cueId);
    },
    stop: (cueId) => {
      requireCue(cuesById, cueId);
      backend.stop(cueId);
    },
    stopChannel: (channel) => {
      for (const cue of cuesById.values()) {
        if (cue.channel === channel) {
          backend.stop(cue.id);
        }
      }
    },
    list: (channel) => {
      const cues = [...cuesById.values()];
      return channel === undefined
        ? cues
        : cues.filter((cue) => cue.channel === channel);
    },
    dispose: () => {
      backend.dispose();
    },
  };
}

function validateCue(cue: AudioCue): void {
  if (cue.id.trim().length === 0) {
    throw new Error("Audio cue id must not be empty.");
  }

  if (cue.assetId.trim().length === 0) {
    throw new Error(`Audio cue asset id must not be empty: ${cue.id}`);
  }

  if (
    cue.volume !== undefined &&
    (Number.isNaN(cue.volume) || cue.volume < 0 || cue.volume > 1)
  ) {
    throw new Error(`Audio cue volume must be between 0 and 1: ${cue.id}`);
  }
}

function requireCue(
  cuesById: ReadonlyMap<string, AudioCue>,
  cueId: string,
): AudioCue {
  const cue = cuesById.get(cueId);

  if (cue === undefined) {
    throw new Error(`Unknown audio cue id: ${cueId}`);
  }

  return cue;
}
