import { Howl } from "howler";

import type { AudioBackend, LoadedAudioCue } from "./AudioManager";

export function createHowlerAudioBackend(): AudioBackend {
  const soundsByCueId = new Map<string, Howl>();

  return {
    load: (cue) => {
      const existingSound = soundsByCueId.get(cue.id);

      if (existingSound !== undefined) {
        existingSound.unload();
      }

      soundsByCueId.set(cue.id, createHowl(cue));
    },
    play: (cueId) => {
      soundsByCueId.get(cueId)?.play();
    },
    stop: (cueId) => {
      soundsByCueId.get(cueId)?.stop();
    },
    dispose: () => {
      for (const sound of soundsByCueId.values()) {
        sound.unload();
      }

      soundsByCueId.clear();
    },
  };
}

function createHowl(cue: LoadedAudioCue): Howl {
  return new Howl({
    src: [cue.url],
    loop: cue.loop ?? false,
    volume: cue.volume ?? 1,
  });
}
