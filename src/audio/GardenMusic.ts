/**
 * Gentle procedural Web Audio garden background music.
 * Plays a calm, warm marimba/harp-like pentatonic melody over soft chords
 * so pupils can focus on mathematics without distracting lyrics or external MP3 404s.
 */
export class GardenMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private playing = false;

  // Gentle C-major pentatonic / Fmaj7 / G6 / Am7 sequence (Hz)
  private readonly melodyNotes = [
    523.25, // C5
    659.25, // E5
    587.33, // D5
    523.25, // C5
    440.0, // A4
    523.25, // C5
    659.25, // E5
    783.99, // G5
    659.25, // E5
    587.33, // D5
    523.25, // C5
    440.0, // A4
    392.0, // G4
    440.0, // A4
    523.25, // C5
    587.33, // D5
  ];

  private readonly bassRoots = [
    261.63, // C4
    261.63,
    174.61, // F3
    174.61,
    196.0, // G3
    196.0,
    220.0, // A3
    196.0, // G3
  ];

  public isPlaying(): boolean {
    return this.playing;
  }

  public start(): void {
    if (this.playing) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      const warmFilter = this.ctx.createBiquadFilter();
      warmFilter.type = 'lowpass';
      warmFilter.frequency.value = 1800;

      warmFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.warmInput = warmFilter;
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.linearRampToValueAtTime(0.18, now + 0.8);
    }

    this.playing = true;
    this.scheduleNextTick();
  }

  private warmInput: AudioNode | null = null;

  private scheduleNextTick = (): void => {
    if (!this.playing || !this.ctx || !this.warmInput) return;

    const now = this.ctx.currentTime;
    const melodyFreq = this.melodyNotes[this.step % this.melodyNotes.length];
    this.playPluck(melodyFreq, now, 0.24, 0.85);

    // Every 2 melody steps, play a soft warm bass/chord root
    if (this.step % 2 === 0) {
      const bassFreq = this.bassRoots[Math.floor(this.step / 2) % this.bassRoots.length];
      this.playPad(bassFreq, now, 0.14, 1.55);
    }

    this.step = (this.step + 1) % 64;
    this.timerId = window.setTimeout(this.scheduleNextTick, 680);
  };

  private playPluck(freq: number, startTime: number, peak: number, dur: number): void {
    if (!this.ctx || !this.warmInput) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(gain);
    gain.connect(this.warmInput);

    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  private playPad(freq: number, startTime: number, peak: number, dur: number): void {
    if (!this.ctx || !this.warmInput) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(gain);
    gain.connect(this.warmInput);

    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  public stop(): void {
    this.playing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
    }
  }

  public dispose(): void {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
      this.warmInput = null;
    }
  }
}
