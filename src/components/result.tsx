import { SearchResultV2 } from "src/hooks/use-search";

interface ResultProps {
  active: boolean;
  offsetIndex: number;
  result: SearchResultV2;
  midiFilePromise: Promise<ArrayBuffer>;
}

function downloadBuffer(arrayBuffer: ArrayBuffer, fileName: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([arrayBuffer], {
      type: "audio/midi",
    }),
  );
  a.download = fileName;
  a.click();
}

export default function Result(props: ResultProps) {
  const { file_id, abs_tick_offsets, midi_metadata } = props.result;

  return (
    <div>
      <a
        onClick={() =>
          props.midiFilePromise.then((buf) =>
            downloadBuffer(buf, "filename.mid"),
          )
        }
      >
        <h2 style={{ marginBottom: 0, color: props.active ? "blue" : "black" }}>
          {midi_metadata
            ? `${midi_metadata.title} (${midi_metadata.year}) by ${midi_metadata.artist}`
            : `File #${file_id}`}
        </h2>
      </a>
      {abs_tick_offsets.map((o, i) => (
        <span
          key={`offset-${file_id}-${i}`}
          style={{
            margin: "0 4px",
            textDecoration:
              i === props.offsetIndex && props.active ? "underline" : "none",
          }}
        >
          {o}t
        </span>
      ))}
    </div>
  );
}
