import { useState } from "react";
import Soundfont, { Player } from "soundfont-player";

import Main from "src/components/main";

const SOUNDFONT_OPS = {
  format: "mp3",
  soundfont: "FluidR3_GM",
};

export default function Home() {
  const [ac, setAc] = useState<AudioContext | null>(null);
  const [ma, setMa] = useState<MIDIAccess | null>(null);
  const [inst, setInst] = useState<Player | null>(null);

  async function handleStart() {
    const instrument = "acoustic_grand_piano";
    const ac = new window.AudioContext();
    setAc(ac);
    setMa(await window.navigator.requestMIDIAccess());
    setInst(await Soundfont.instrument(ac, instrument, SOUNDFONT_OPS));
  }

  return (
    <div>
      {ac && ma && inst ? (
        <Main audioContext={ac} midiAccess={ma} instrument={inst} />
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  );
}
