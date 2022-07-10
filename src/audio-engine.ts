import { waitUntil } from "src/util";

let audioContext: AudioContext | undefined;

export async function getAudioContext(): AudioContext {
  const win: any = window;

  if (!audioContext) {
    audioContext = new win.AudioContext();
  }

  if (audioContext!.state !== "running") {
    await audioContext!.resume();
  }

  // Even after we resume the engine, we still need to
  // wait for the currentTime to be a non-zero value
  await waitUntil(() => !!audioContext!.currentTime);

  return audioContext!;
}
