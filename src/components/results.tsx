import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import MidiPlayer from "midi-player-js";
import { Player as SoundfontPlayer } from "soundfont-player";

import Result from "src/components/result";
import useMidiFiles from "src/hooks/use-midi-files";
import { SearchResults } from "src/hooks/use-search";

interface ResultsProps {
  searchResults: SearchResults;
  instrument: SoundfontPlayer;
  audioContext: AudioContext;
}

const Player = new MidiPlayer.Player();

// TODO: this should just be global/application scoped
const PLAYING: { [key: number]: any | null } = {};

function handleStop() {
  Player.stop();
  Object.keys(PLAYING).forEach((key: any) => {
    if (PLAYING[key]) {
      PLAYING[key].stop();
      PLAYING[key] = null;
    }
  });
  Player.resetTracks();
}

export default function Results(props: ResultsProps) {
  const [activeResult, setActiveResult] = useState(-1);
  const fileIdToData = useMidiFiles(
    props.searchResults.map((sr) => sr.file_id),
  );

  useEffect(() => {
    Player.on("midiEvent", function (event: any) {
      if (event.name === "Note on") {
        PLAYING[event.noteName] = props.instrument.play(
          event.noteName,
          props.audioContext.currentTime,
        );
      } else if (event.name === "Note off") {
        if (PLAYING[event.noteName]) {
          console.log("wa");
          PLAYING[event.noteName].stop();
          PLAYING[event.noteName] = null;
        }
      }
    });
  }, [props.audioContext, props.instrument]);

  useEffect(() => {
    setActiveResult(-1);
  }, [props.searchResults, setActiveResult]);

  function handlePlay(prev: number, next: number) {
    handleStop();
    const sr = props.searchResults[next];
    fileIdToData[sr.file_id].then((data) => {
      Player.loadArrayBuffer(data);
      Player.skipToSeconds(sr.offset);
      Player.play();
    });
  }

  function handleSelectNextResult() {
    if (activeResult + 1 < props.searchResults.length) {
      setActiveResult((curr) => curr + 1);
      handlePlay(activeResult, activeResult + 1);
    }
  }

  function handleSelectPreviousResult() {
    if (activeResult > 0) {
      setActiveResult((curr) => curr - 1);
      handlePlay(activeResult, activeResult - 1);
    }
  }

  useHotkeys("j", handleSelectNextResult, [activeResult]);
  useHotkeys("k", handleSelectPreviousResult, [activeResult]);
  useHotkeys("Esc", handleStop, [activeResult]);

  function renderResults() {
    return props.searchResults?.map((result, i) => (
      <Result
        key={`result-${i}`}
        fileId={result.file_id}
        active={activeResult === i}
      />
    ));
  }

  return <div>{renderResults()}</div>;
}
