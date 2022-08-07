import MidiPlayer, { Event } from "midi-player-js";
import Soundfont, { Player } from "soundfont-player";

const SOUNDFONT_OPS = {
  format: "mp3",
  soundfont: "FluidR3_GM",
};

export default class AudioEngine {
  // TODO: should probably eventually make these private
  public audioContext: AudioContext;
  public midiAccess: MIDIAccess;
  public instrument: Player;
  public player: MidiPlayer.Player;

  private playing: { [key: number]: any | null };

  constructor(
    audioContext: AudioContext,
    midiAccess: MIDIAccess,
    instrument: Player,
    player: MidiPlayer.Player,
  ) {
    this.audioContext = audioContext;
    this.midiAccess = midiAccess;
    this.instrument = instrument;
    this.player = player;
    this.playing = {};

    this.setupPlayer();
  }

  private setupPlayer() {
    this.player.on("midiEvent", (event: any) => {
      if (event.channel === 10) {
        // ignore drums
        return;
      }

      if (event.name === "Note on") {
        this.playing[event.noteName] = this.instrument.play(
          event.noteName,
          this.audioContext.currentTime,
        );
      } else if (event.name === "Note off") {
        if (this.playing[event.noteName]) {
          this.playing[event.noteName].stop();
          this.playing[event.noteName] = null;
        }
      }
    });
  }

  private skipToTickCorrected = (ticks: number) => {
    // skips to ticks, but corrects tempo first!
    let correctTempo = -1;
    let lastTempoTick = -1;

    for (const _events of this.player.getEvents()) {
      const events = _events as unknown as Event[]; // it's typed incorrectly...
      for (const event of events) {
        if (event.tick >= ticks) {
          // if we're up-to-date
          break;
        }

        if (event.name === "Set Tempo" && event.tick > lastTempoTick) {
          lastTempoTick = event.tick;
          correctTempo = event.data!;
        }
      }
    }
    this.player.tempo = correctTempo;
    this.player.skipToTick(ticks);
  };

  public playMidiAt = (data: ArrayBuffer, ticks: number) => {
    this.player.loadArrayBuffer(data);
    this.skipToTickCorrected(ticks);
    this.player.play();
  };

  public stopPlaying = () => {
    this.player.stop();
    Object.keys(this.playing).forEach((key: any) => {
      if (this.playing[key]) {
        this.playing[key].stop();
        this.playing[key] = null;
      }
    });
  };
}

export async function createAudioEngine() {
  const piano = "acoustic_grand_piano";
  const ac = new window.AudioContext();
  const ma = await window.navigator.requestMIDIAccess();
  const instr = await Soundfont.instrument(ac, piano, SOUNDFONT_OPS);
  const plr = new MidiPlayer.Player();
  return new AudioEngine(ac, ma, instr, plr);
}
