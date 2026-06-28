import type { AudioCueManifest } from "../../engine/audio/AudioManager";
import { GAMEPLAY_AUDIO_CUES } from "../../game/audio/GameplayAudio";
import { GAMEPLAY_AUDIO_ASSET_IDS } from "../assets/GameplayAudioAssets";

export const GAMEPLAY_AUDIO_CUE_MANIFEST = {
  cues: [
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
  ],
} satisfies AudioCueManifest;
