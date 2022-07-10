import { useState } from "react";
import { Player } from "soundfont-player";

import useSearch from "src/hooks/use-search";
import Piano from "src/components/piano";
import Results from "src/components/results";

interface MainProps {
  audioContext: AudioContext;
  midiAccess: MIDIAccess;
  instrument: Player;
}

export default function Main(props: MainProps) {
  const [lastPressed, setLastPressed] = useState<number[]>([]);
  const { isLoading, data } = useSearch(lastPressed);

  function handlePianoNotesChanged(notes: number[]) {
    setLastPressed(notes);
  }

  return (
    <div>
      <Piano
        onSlowChange={handlePianoNotesChanged}
        instrument={props.instrument}
        midiAccess={props.midiAccess}
      />

      <p>Pressed Notes: {lastPressed.join(" - ")}</p>

      {isLoading ? <p>Loading Results...</p> : null}

      {data && (
        <Results
          instrument={props.instrument}
          searchResults={data}
          audioContext={props.audioContext}
        />
      )}
    </div>
  );
}
