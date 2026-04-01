import { useRef, useCallback } from 'react';

/**
 * Web Audio API sound synthesis hook.
 * All sounds are generated programmatically — no audio files needed.
 */
export default function useAudio() {
  const ctxRef = useRef(null);

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
   * Short percussive click — like a physical reel peg snapping past.
   * Uses a noise burst through a bandpass filter for a clean "clack."
   */
  const playTick = useCallback((volume = 0.3, pitch = 1.0) => {
    try {
      const ctx = getCtx();
      const duration = 0.025;

      // Create a short noise burst
      const bufferSize = Math.ceil(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter gives it a "clack" character
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 * pitch;
      filter.Q.value = 1.5;

      // Sharp attack, instant decay
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  }, [getCtx]);

  /**
   * No-op — we rely on tick sounds for the spinning audio.
   * The rhythmic clicking of names scrolling past IS the spin sound.
   */
  const startSpin = useCallback(() => {}, []);
  const stopSpin = useCallback(() => {}, []);

  /**
   * Triumphant fanfare — bright ascending arpeggio with shimmer.
   */
  const playFanfare = useCallback(() => {
    try {
      const ctx = getCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(ctx.destination);

      // Ascending arpeggio: C4 E4 G4 C5
      const notes = [261.6, 329.6, 392.0, 523.3];

      notes.forEach((freq, i) => {
        const delay = i * 0.1;

        // Main tone (triangle for warmth)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.0);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.1);

        // Shimmer overtone (sine, octave up)
        const shimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.value = freq * 2;
        shimmerGain.gain.setValueAtTime(0, ctx.currentTime + delay);
        shimmerGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.04);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.6);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(masterGain);
        shimmer.start(ctx.currentTime + delay);
        shimmer.stop(ctx.currentTime + delay + 0.7);
      });

      // Sustained major chord at the end
      setTimeout(() => {
        try {
          const chord = [523.3, 659.3, 784.0]; // C5, E5, G5
          const chordGain = ctx.createGain();
          chordGain.gain.setValueAtTime(0.12, ctx.currentTime);
          chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          chordGain.connect(ctx.destination);

          chord.forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            osc.connect(chordGain);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 2.6);
          });
        } catch (e) { /* ctx may be closed */ }
      }, 450);
    } catch (e) {
      // Audio not available
    }
  }, [getCtx]);

  /**
   * Drumroll — filtered noise that builds in intensity.
   */
  const playDrumroll = useCallback(() => {
    try {
      const ctx = getCtx();
      const duration = 1.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + duration);
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
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.8;

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
