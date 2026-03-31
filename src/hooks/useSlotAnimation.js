import { useState, useRef, useCallback, useEffect } from 'react';
import { easeInCubic, easeOutCubic, slotDeceleration } from '../utils/easing';

const SLOT_HEIGHT = 80; // px per name slot

/**
 * Custom hook that drives the slot machine reel animation.
 *
 * Phases:
 *   1. SPIN_UP (0-400ms): Accelerate from 0 to max velocity
 *   2. CRUISE (400ms-2500ms): Constant high speed
 *   3. DECELERATE (2500ms-4500ms): Slow down with tease effect
 *   4. LANDED: Winner in position, trigger callback
 */
export default function useSlotAnimation({ totalItems, targetIndex, onComplete }) {
  const [offset, setOffset] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | spinning | landed
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const isRunning = useRef(false);

  // Animation constants
  const SPIN_UP_DURATION = 400;
  const CRUISE_DURATION = 2100;
  const DECEL_DURATION = 2000;
  const TOTAL_DURATION = SPIN_UP_DURATION + CRUISE_DURATION + DECEL_DURATION;
  const MAX_SPEED = 35; // slots per second at full speed

  const start = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    setPhase('spinning');

    // Calculate target offset: we want the targetIndex centered in the viewport.
    // We'll scroll through several full cycles plus land on target.
    const fullCycles = 3; // scroll through the full list N times
    const targetOffset = (fullCycles * totalItems + targetIndex) * SLOT_HEIGHT;

    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);

      if (progress < 1) {
        let currentOffset;

        if (elapsed < SPIN_UP_DURATION) {
          // Phase 1: Spin up
          const t = elapsed / SPIN_UP_DURATION;
          const speedFactor = easeInCubic(t);
          const distanceCovered = speedFactor * MAX_SPEED * SLOT_HEIGHT * (elapsed / 1000);
          currentOffset = distanceCovered;
        } else if (elapsed < SPIN_UP_DURATION + CRUISE_DURATION) {
          // Phase 2: Cruise at max speed
          const spinUpDistance = MAX_SPEED * SLOT_HEIGHT * (SPIN_UP_DURATION / 1000) * 0.5;
          const cruiseElapsed = elapsed - SPIN_UP_DURATION;
          currentOffset = spinUpDistance + MAX_SPEED * SLOT_HEIGHT * (cruiseElapsed / 1000);
        } else {
          // Phase 3: Deceleration toward target
          const spinUpDistance = MAX_SPEED * SLOT_HEIGHT * (SPIN_UP_DURATION / 1000) * 0.5;
          const cruiseDistance = MAX_SPEED * SLOT_HEIGHT * (CRUISE_DURATION / 1000);
          const startOfDecel = spinUpDistance + cruiseDistance;
          const remainingDistance = targetOffset - startOfDecel;

          const decelT = (elapsed - SPIN_UP_DURATION - CRUISE_DURATION) / DECEL_DURATION;
          const decelProgress = slotDeceleration(decelT);
          currentOffset = startOfDecel + remainingDistance * decelProgress;
        }

        setOffset(currentOffset);
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Landed exactly on target
        setOffset(targetOffset);
        setPhase('landed');
        isRunning.current = false;
        if (onComplete) onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [totalItems, targetIndex, onComplete]);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    isRunning.current = false;
    setOffset(0);
    setPhase('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    offset,
    phase,
    slotHeight: SLOT_HEIGHT,
    start,
    reset,
    isSpinning: phase === 'spinning',
    totalDuration: TOTAL_DURATION,
  };
}
