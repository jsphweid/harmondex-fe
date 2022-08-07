import { useEffect, useState } from "react";

import AudioEngine from "src/audio-engine";

// if we don't use a global variable to manage the truth,
// notes will occasionally get stuck because of the unpredictable
// nature of a lot of quick setState calls
let ON_NOTES: number[] = [];

// TODO: any should be AudioNode?
// TODO: this should just be global/application scoped
const playing: { [key: number]: any | null } = {};

export default function usePressedNotes(audioEngine: AudioEngine) {
  const [pressed, setPressed] = useState<number[]>([]);
  // TODO: fix any

  useEffect(() => {
    audioEngine.midiAccess.inputs.forEach((input) => {
      input.onmidimessage = (event: any) => {
        const type = event.data[0];
        const note = event.data[1];
        if (type === 144) {
          ON_NOTES.push(note);
          playing[note] = audioEngine.instrument.play(note);
        } else if (type === 128) {
          ON_NOTES = ON_NOTES.filter((n) => n !== note);
          if (playing[note]) {
            playing[note].stop();
            playing[note] = null;
          }
        } else {
          // ignore events that are not note ON/OFF events
          return;
        }

        // update it from the global variable regardless
        setPressed([...ON_NOTES]);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEngine.midiAccess.inputs]);

  return pressed;
}
