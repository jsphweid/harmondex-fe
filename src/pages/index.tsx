import { useState } from "react";

import AudioEngine, { createAudioEngine } from "src/audio-engine";
import Main from "src/components/main";

export default function Home() {
  const [engine, setEngine] = useState<AudioEngine | null>(null);

  async function handleStart() {
    const audioEngine = await createAudioEngine();
    setEngine(audioEngine);
  }

  return (
    <div>
      {engine ? (
        <Main audioEngine={engine} />
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  );
}
