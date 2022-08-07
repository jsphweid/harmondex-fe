import debounce from "lodash.debounce";
import { useState, useEffect, useMemo } from "react";
import { SizeMe } from "react-sizeme";

import "react-piano/dist/styles.css";

import usePressedNotes from "src/hooks/use-pressed-notes";
import AudioEngine from "src/audio-engine";

const { ControlledPiano, MidiNumbers } = require("react-piano");

interface PianoProps {
  audioEngine: AudioEngine;
  onSlowChange: (notes: number[]) => void;
}

// Full 88 keys
const noteRange = {
  first: MidiNumbers.fromNote("a0"),
  last: MidiNumbers.fromNote("c8"),
};

export default function Piano(props: PianoProps) {
  const pressed = usePressedNotes(props.audioEngine);
  const [usingSlow, setUsingSlow] = useState(false);
  const [slowNotes, setSlowNotes] = useState<number[]>([]);

  const debouncedHandleNotesChanged = useMemo(() => {
    return debounce(handleNotesChanged, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNotesChanged(pressed: number[]) {
    if (pressed.length) {
      props.onSlowChange(pressed);
      setSlowNotes(pressed);
    }
  }

  useEffect(() => {
    setUsingSlow(!pressed.length); // immediately update this
    debouncedHandleNotesChanged(pressed); // but delay this
  }, [debouncedHandleNotesChanged, pressed]);

  return (
    <SizeMe>
      {({ size }) => (
        <ControlledPiano
          activeNotes={usingSlow ? slowNotes : pressed}
          noteRange={noteRange}
          width={size.width}
          // TODO: do we need these?
          playNote={() => null}
          stopNote={() => null}
          onPlayNoteInput={() => null}
          onStopNoteInput={() => null}
        />
      )}
    </SizeMe>
  );
}
