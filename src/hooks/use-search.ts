import axios from "axios";
import { useQuery } from "react-query";

export interface MidiMetadata {
  year: number;
  artist: string;
  title: string;
  release: string;
}

export interface SearchResultV2 {
  file_id: number;
  abs_tick_offsets: number[];
  midi_metadata: MidiMetadata | null;
}

export interface SearchResponse {
  start: number;
  num_matches: number;
  num_files: number;
  results: SearchResultV2[];
}

export default function useSearch(notes: number[]) {
  return useQuery(`notes-${JSON.stringify(notes)}`, () =>
    axios
      .post<SearchResponse>("/search", {
        chords: [notes],
      })
      .then((r) => r.data),
  );
}
