import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

const midiAccess = navigator.requestMIDIAccess();

// global state here is used to prevent updates
let curr: number[] = [];

export default function useMidi() {
  const [pressed, setPressed] = useState<number[]>([]);
  const debouncedSetPressed = debounce(setPressed, 100);

  useEffect(() => {
    midiAccess.then((midi) => {
      midi.inputs.forEach((input) => {
        input.onmidimessage = (event: any) => {
          const type = event.data[0];
          const note = event.data[1];
          if (type === 144) {
            curr.push(note);
            debouncedSetPressed([...curr]);
          } else if (type === 128) {
            curr = curr.filter((n) => n !== note);
            debouncedSetPressed([...curr]);
          }
        };
      });
    });
  });
  // return { pressedNotes: [60, 64, 67], key: "60-64-67" };
  return { pressedNotes: pressed, key: pressed.join("-") || "" };
}
