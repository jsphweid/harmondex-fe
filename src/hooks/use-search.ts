import axios from "axios";
import { useQuery } from "react-query";

export type SearchResults = {
  file_id: number;
  offset: number;
}[];

export default function useSearch(notes: number[]) {
  return useQuery(`notes-${JSON.stringify(notes)}`, () =>
    axios
      .post<SearchResults>("/search", {
        chords: [notes],
      })
      .then((r) => r.data),
  );
}
