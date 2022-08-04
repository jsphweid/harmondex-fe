import { SearchResultV2 } from "src/hooks/use-search";

interface ResultProps {
  active: boolean;
  offsetIndex: number;
  result: SearchResultV2;
}

export default function Result(props: ResultProps) {
  const { file_id, offsets, midi_metadata } = props.result;

  return (
    <div>
      <h2 style={{ marginBottom: 0, color: props.active ? "blue" : "black" }}>
        {midi_metadata
          ? `${midi_metadata.title} (${midi_metadata.year}) by ${midi_metadata.artist}`
          : `File #${file_id}`}
      </h2>
      {offsets.map((o, i) => (
        <span
          key={`offset-${file_id}-${i}`}
          style={{
            margin: "0 4px",
            textDecoration:
              i === props.offsetIndex && props.active ? "underline" : "none",
          }}
        >
          {o}
        </span>
      ))}
    </div>
  );
}
