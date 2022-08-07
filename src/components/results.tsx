import { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Result from "src/components/result";
import useMidiFiles from "src/hooks/use-midi-files";
import { SearchResponse } from "src/hooks/use-search";
import AudioEngine from "src/audio-engine";

interface ResultsProps {
  searchResults: SearchResponse;
  audioEngine: AudioEngine;
}

export default function Results(props: ResultsProps) {
  const [activeResult, setActiveResult] = useState(-1);
  const [activeOffset, setActiveOffset] = useState(0);
  const fileIdToData = useMidiFiles(
    props.searchResults.results.map((sr) => sr.file_id),
  );

  useEffect(() => {
    setActiveResult(-1);
  }, [props.searchResults, setActiveResult]);

  function handlePlay(prev: number, next: number) {
    props.audioEngine.stopPlaying();
    const nextSr = props.searchResults.results[next];
    fileIdToData[nextSr.file_id].then((data) => {
      props.audioEngine.playMidiAt(data, nextSr.abs_tick_offsets[activeOffset]);
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
  useHotkeys("Esc", props.audioEngine.stopPlaying, [activeResult]);

  function handleSelectNextOffset() {
    if (activeResult >= 0) {
      const result = props.searchResults.results[activeResult];
      if (activeOffset < result.abs_tick_offsets.length - 1) {
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
        midiFilePromise={fileIdToData[result.file_id]}
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
