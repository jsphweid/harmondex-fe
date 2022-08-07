import { useState } from "react";

import useSearch from "src/hooks/use-search";
import Piano from "src/components/piano";
import Results from "src/components/results";
import AudioEngine from "src/audio-engine";

interface MainProps {
  audioEngine: AudioEngine;
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
        audioEngine={props.audioEngine}
      />

      <p>Pressed Notes: {lastPressed.join(" - ")}</p>

      {isLoading ? <p>Loading Results...</p> : null}

      {data && <Results audioEngine={props.audioEngine} searchResults={data} />}
    </div>
  );
}
