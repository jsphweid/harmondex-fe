import { useState, useEffect } from "react";
import Title from "src/components/title";
import useMidi from "src/hooks/use-midi";
import useSearch from "src/hooks/use-search";

export default function Home() {
  const [lastPressed, setLastPressed] = useState<number[]>([]);
  const { pressedNotes, key } = useMidi();
  const { isLoading, data } = useSearch(lastPressed);

  useEffect(() => {
    if (key !== "") {
      setLastPressed(pressedNotes);
    }
    // NOTE: if array is put in dependency array, we'll get
    // an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function renderResults() {
    return data?.map((result, i) => (
      <div key={`result-${i}`}>
        <p>{result.file_id}</p>
        <p>{result.ticks_offset}</p>
      </div>
    ));
  }

  return (
    <div>
      <Title>Hello TypeScript!</Title>
      <p>Pressed Notes: {lastPressed.join(" - ")}</p>
      {isLoading ? <p>Loading...</p> : null}
      {renderResults()}
    </div>
  );
}
