import type { AssetManifest } from "../../engine/assets/AssetCatalog";

export const GAMEPLAY_AUDIO_ASSET_IDS = Object.freeze({
  collectCoin: "audio.gameplay.collect.coin",
  discoverLandmark: "audio.gameplay.discover.landmark",
  unlockGate: "audio.gameplay.unlock.gate",
});

export type GameplayAudioAssetId =
  (typeof GAMEPLAY_AUDIO_ASSET_IDS)[keyof typeof GAMEPLAY_AUDIO_ASSET_IDS];

export const GAMEPLAY_AUDIO_ASSET_MANIFEST = {
  entries: [
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
  ],
} satisfies AssetManifest;
