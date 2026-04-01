import { useRef, useCallback } from 'react';

/**
 * Web Audio API sound synthesis hook.
 * All sounds are generated programmatically — no audio files needed.
 */
export default function useAudio() {
  const ctxRef = useRef(null);
  const spinOscRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /**
   * Short mechanical tick sound.
   */
  const playTick = useCallback((volume = 0.3) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 5;

      osc.type = 'square';
      osc.frequency.value = 1200;

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not available, silently fail
    }
  }, [getCtx]);

  /**
   * Start a looping spin/whir sound that rises in pitch.
   */
  const startSpin = useCallback(() => {
    try {
      // Stop any existing spin sound first
      if (spinOscRef.current) {
        const { osc1, osc2 } = spinOscRef.current;
        try { osc1.stop(); } catch (e) { /* already stopped */ }
        try { osc2.stop(); } catch (e) { /* already stopped */ }
        spinOscRef.current = null;
      }

      const ctx = getCtx();

      // Create a noise-like whir using detuned oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.value = 80;
      osc2.type = 'sawtooth';
      osc2.frequency.value = 83;

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      spinOscRef.current = { osc1, osc2, gain, ctx };
    } catch (e) {
      // Audio not available
    }
  }, [getCtx]);

  /**
   * Ramp down and stop the spin sound.
   */
  const stopSpin = useCallback(() => {
    try {
      const ref = spinOscRef.current;
      if (ref) {
        const { osc1, osc2, gain, ctx } = ref;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc1.stop(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 0.6);
        spinOscRef.current = null;
      }
    } catch (e) {
      // Already stopped
    }
  }, []);

  /**
   * Triumphant fanfare — ascending major chord arpeggio.
   */
  const playFanfare = useCallback(() => {
    try {
      const ctx = getCtx();
      const notes = [261.6, 329.6, 392.0, 523.3]; // C4, E4, G4, C5
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.2;
      masterGain.connect(ctx.destination);

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = i * 0.12;

        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.3);
      });

      // Final sustained chord
      setTimeout(() => {
        const chord = [523.3, 659.3, 784.0]; // C5, E5, G5
        const chordGain = ctx.createGain();
        chordGain.gain.setValueAtTime(0.15, ctx.currentTime);
        chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
        chordGain.connect(ctx.destination);

        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          osc.connect(chordGain);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2.0);
        });
      }, 500);
    } catch (e) {
      // Audio not available
    }
  }, [getCtx]);

  /**
   * Drumroll — rapid oscillating noise bursts.
   */
  const playDrumroll = useCallback(() => {
    try {
      const ctx = getCtx();
      const duration = 1.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration + 0.3);
      gain.connect(ctx.destination);

      // Create noise buffer
      const bufferSize = ctx.sampleRate * (duration + 0.5);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 500;

      noise.connect(filter);
      filter.connect(gain);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + duration + 0.5);
    } catch (e) {
      // Audio not available
    }
  }, [getCtx]);

  return { playTick, startSpin, stopSpin, playFanfare, playDrumroll };
}
