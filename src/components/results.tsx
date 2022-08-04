import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import MidiPlayer from "midi-player-js";
import { Player as SoundfontPlayer } from "soundfont-player";

import Result from "src/components/result";
import useMidiFiles from "src/hooks/use-midi-files";
import { SearchResponse } from "src/hooks/use-search";

interface ResultsProps {
  searchResults: SearchResponse;
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
  const [activeOffset, setActiveOffset] = useState(0);
  const fileIdToData = useMidiFiles(
    props.searchResults.results.map((sr) => sr.file_id),
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
    const nextSr = props.searchResults.results[next];
    fileIdToData[nextSr.file_id].then((data) => {
      Player.loadArrayBuffer(data);
      Player.skipToSeconds(nextSr.offsets[activeOffset]);
      Player.play();
    });
  }

  function handleSelectNextResult() {
    if (activeResult + 1 < props.searchResults.results.length) {
      setActiveOffset(0);
      setActiveResult((curr) => curr + 1);
      handlePlay(activeResult, activeResult + 1);
    }
  }

  function handleSelectPreviousResult() {
    if (activeResult > 0) {
      setActiveOffset(0);
      setActiveResult((curr) => curr - 1);
      handlePlay(activeResult, activeResult - 1);
    }
  }

  useHotkeys("j", handleSelectNextResult, [activeResult]);
  useHotkeys("k", handleSelectPreviousResult, [activeResult]);
  useHotkeys("h", handleSelectPreviousOffset, [activeOffset, activeResult]);
  useHotkeys("l", handleSelectNextOffset, [activeOffset, activeResult]);
  useHotkeys("Esc", handleStop, [activeResult]);

  function handleSelectNextOffset() {
    if (activeResult >= 0) {
      const result = props.searchResults.results[activeResult];
      if (activeOffset < result.offsets.length - 1) {
        setActiveOffset((curr) => curr + 1);
        handlePlay(activeResult, activeResult); // this is dumb
      }
    }
  }

  function handleSelectPreviousOffset() {
    if (activeResult >= 0 && activeOffset > 0) {
      setActiveOffset((curr) => curr - 1);
      handlePlay(activeResult, activeResult); // this is dumb
    }
  }

  function renderResults() {
    return props.searchResults.results.map((result, i) => (
      <Result
        key={`result-${i}`}
        result={result}
        offsetIndex={activeOffset}
        active={activeResult === i}
      />
    ));
  }

  const { num_matches, num_files } = props.searchResults;

  return (
    <div>
      <p>
        Found {num_matches} matches across {num_files} files.
      </p>
      {renderResults()}
    </div>
  );
}
