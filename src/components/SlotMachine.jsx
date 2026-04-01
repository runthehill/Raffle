import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import useSlotAnimation from '../hooks/useSlotAnimation';
import useAudio from '../hooks/useAudio';
import { shuffle } from '../utils/shuffle';
import './SlotMachine.css';

const VISIBLE_SLOTS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_SLOTS / 2); // 2 (0-indexed)
const REEL_REPEATS = 4;

export default function SlotMachine({ names, winner, isSpinning, spinKey, onSpinComplete }) {
  const { playTick, startSpin, stopSpin, playFanfare, playDrumroll } = useAudio();
  const lastTickSlot = useRef(-1);
  const drumrollFired = useRef(false);
  const shakeRef = useRef(null);

  // Build virtual reel: shuffle names and repeat, placing winner at target position
  const { reelNames, targetIndex } = useMemo(() => {
    if (!names || names.length === 0) {
      return { reelNames: [], targetIndex: 0 };
    }

    // Ensure reel has enough items for smooth scrolling (minimum ~40 entries)
    const minReelSize = Math.max(REEL_REPEATS, Math.ceil(40 / names.length));
    let reel = [];
    for (let i = 0; i < minReelSize; i++) {
      reel = reel.concat(shuffle(names));
    }

    // Place winner at a good target position (near the end of the reel)
    const targetIdx = Math.floor(reel.length * 0.75) + CENTER_INDEX;
    if (winner && targetIdx < reel.length) {
      reel[targetIdx] = winner;
    }

    return { reelNames: reel, targetIndex: targetIdx };
  }, [names, winner, spinKey]);

  const handleComplete = useCallback(() => {
    stopSpin();
    playFanfare();

    // Trigger screen shake
    if (shakeRef.current) {
      shakeRef.current.classList.add('shake');
      setTimeout(() => {
        if (shakeRef.current) {
          shakeRef.current.classList.remove('shake');
        }
      }, 400);
    }

    // Delay the callback slightly for dramatic effect
    setTimeout(() => {
      if (onSpinComplete) onSpinComplete();
    }, 600);
  }, [stopSpin, playFanfare, onSpinComplete]);

  const { offset, phase, slotHeight, start, reset } = useSlotAnimation({
    totalItems: reelNames.length,
    targetIndex: targetIndex - CENTER_INDEX, // adjust so winner lands in center
    onComplete: handleComplete,
  });

  // Start animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && reelNames.length > 0) {
      reset();
      // Small delay to ensure reset completes
      requestAnimationFrame(() => {
        start();
        startSpin();
      });
    }
  }, [spinKey]);

  // Play tick sounds as names scroll past center
  useEffect(() => {
    if (phase !== 'spinning') return;
    const currentSlot = Math.floor(offset / slotHeight);
    if (currentSlot !== lastTickSlot.current && currentSlot > 0) {
      lastTickSlot.current = currentSlot;
      // Volume increases as we slow down
      const vol = phase === 'spinning' ? 0.15 + Math.random() * 0.1 : 0.3;
      playTick(vol);
    }
  }, [offset, phase, slotHeight, playTick]);

  // Play drumroll near the end (once)
  useEffect(() => {
    if (phase === 'spinning') {
      const totalDistance = (targetIndex - CENTER_INDEX) * slotHeight;
      const progress = totalDistance > 0 ? offset / totalDistance : 0;
      if (progress > 0.7 && !drumrollFired.current) {
        drumrollFired.current = true;
        playDrumroll();
      }
    } else if (phase === 'idle') {
      drumrollFired.current = false;
    }
  }, [offset, phase, targetIndex, slotHeight, playDrumroll]);

  // Calculate which names are visible
  const getVisibleNames = () => {
    if (reelNames.length === 0) {
      return Array(VISIBLE_SLOTS).fill('—');
    }
    const centerIdx = Math.floor(offset / slotHeight);
    const startIdx = centerIdx - CENTER_INDEX;
    const visible = [];
    for (let i = 0; i < VISIBLE_SLOTS; i++) {
      const idx = startIdx + i;
      if (idx >= 0 && idx < reelNames.length) {
        visible.push(reelNames[idx]);
      } else {
        const wrappedIdx = ((idx % reelNames.length) + reelNames.length) % reelNames.length;
        visible.push(reelNames[wrappedIdx]);
      }
    }
    return visible;
  };

  const visibleNames = getVisibleNames();
  const subPixelOffset = offset % slotHeight;

  // Speed-based blur: calculate based on how far we've moved recently
  const prevOffset = useRef(0);
  const speed = phase === 'spinning'
    ? Math.abs(offset - prevOffset.current)
    : 0;
  prevOffset.current = offset;
  const blurAmount = Math.min(speed * 0.08, 3);

  return (
    <div className="slot-machine" ref={shakeRef}>
      <div className="slot-frame">
        {/* Light bulb border */}
        <div className="slot-lights">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className={`slot-light ${i % 2 === 0 ? 'slot-light--a' : 'slot-light--b'}`}
            />
          ))}
        </div>

        {/* Reel viewport */}
        <div className="slot-viewport">
          {/* Center highlight */}
          <div className="slot-center-highlight" />

          <div
            className="slot-reel"
            style={{
              transform: `translateY(${-subPixelOffset}px)`,
              filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none',
            }}
          >
            {visibleNames.map((name, i) => (
              <div
                key={i}
                className={`slot-name ${i === CENTER_INDEX && phase === 'landed' ? 'slot-name--winner' : ''}`}
                style={{ height: slotHeight }}
              >
                <span className="slot-name-text">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
