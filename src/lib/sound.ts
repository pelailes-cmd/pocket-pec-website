/**
 * Optional sound design, synthesised with the Web Audio API (no audio files).
 * Off by default; nothing is created until the visitor turns it on.
 *
 *   ambience  60 Hz mains hum (the Philippine grid frequency) + soft room tone
 *   blip      short interface tone on chapter changes
 *   tick      faint key click while search text types
 *   pulse     low cinematic swell at key moments
 *   whoosh    filtered air for large camera moves
 */
type Listener = () => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private stopAmbience: (() => void) | null = null;
  private listeners = new Set<Listener>();
  private lastTick = 0;
  private enabled = false;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  isEnabled = () => this.enabled;

  toggle() {
    return this.setEnabled(!this.enabled);
  }

  async setEnabled(on: boolean) {
    if (on === this.enabled) return;
    this.enabled = on;
    this.listeners.forEach((l) => l());
    if (on) {
      const ctx = this.ensure();
      if (!ctx || !this.master) return;
      await ctx.resume();
      this.startAmbience();
      this.ramp(this.master.gain, 0.9, 1.6);
      this.blip();
    } else if (this.ctx && this.master) {
      this.ramp(this.master.gain, 0, 0.5);
      window.setTimeout(() => {
        if (this.enabled) return;
        this.stopAmbience?.();
        this.stopAmbience = null;
        void this.ctx?.suspend();
      }, 650);
    }
  }

  /** Pause audio while the tab is hidden. */
  setVisible(visible: boolean) {
    if (!this.ctx || !this.enabled) return;
    void (visible ? this.ctx.resume() : this.ctx.suspend());
  }

  blip() {
    const ctx = this.live();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(920, t);
    osc.frequency.exponentialRampToValueAtTime(1380, t + 0.07);
    const g = this.envelope(t, 0.05, 0.004, 0.22);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  tick() {
    const ctx = this.live();
    if (!ctx || !this.noise) return;
    const now = performance.now();
    if (now - this.lastTick < 45) return;
    this.lastTick = now;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3400;
    bp.Q.value = 1.4;
    const g = this.envelope(t, 0.07, 0.001, 0.03);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 0.05);
  }

  pulse() {
    const ctx = this.live();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(58, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 1.6);
    const g = this.envelope(t, 0.16, 0.08, 1.7);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 1.9);
  }

  whoosh() {
    const ctx = this.live();
    if (!ctx || !this.noise) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(380, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.7);
    const g = this.envelope(t, 0.09, 0.25, 0.75);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 1.1);
  }

  private live() {
    return this.enabled && this.ctx && this.master && this.ctx.state === "running" ? this.ctx : null;
  }

  private envelope(t: number, peak: number, attack: number, release: number) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
    return g;
  }

  private ramp(param: AudioParam, value: number, seconds: number) {
    const t = this.ctx!.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + seconds);
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);

    // Two seconds of pink-ish noise, reused by every noise-based sound.
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noise = buffer;
    return ctx;
  }

  private startAmbience() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise || this.stopAmbience) return;
    const out = ctx.createGain();
    out.gain.value = 1;
    out.connect(this.master);

    const hum = ctx.createGain();
    hum.gain.setValueAtTime(0, ctx.currentTime);
    hum.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
    const humFilter = ctx.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 420;
    hum.connect(humFilter).connect(out);
    const oscillators = [60, 120, 180, 240].map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = [0.02, 0.013, 0.006, 0.0025][i];
      osc.connect(g).connect(hum);
      osc.start();
      return osc;
    });

    const room = ctx.createBufferSource();
    room.buffer = this.noise;
    room.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 650;
    lp.Q.value = 0.4;
    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.045;
    room.connect(lp).connect(roomGain).connect(out);
    room.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 240;
    lfo.connect(lfoDepth).connect(lp.frequency);
    lfo.start();

    this.stopAmbience = () => {
      for (const node of [...oscillators, room, lfo]) {
        try {
          node.stop();
        } catch {
          /* already stopped */
        }
      }
      out.disconnect();
    };
  }
}

export const sound = new SoundEngine();
