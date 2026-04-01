import { useState, useRef, useCallback, useEffect } from 'react';
import { easeInCubic, slotDeceleration } from '../utils/easing';

const SLOT_HEIGHT = 80; // px per name slot

/**
 * Custom hook that drives the slot machine reel animation.
 *
 * Phases:
 *   1. SPIN_UP (0-400ms): Accelerate from 0 to max velocity
 *   2. CRUISE (400ms-2500ms): Constant high speed
 *   3. DECELERATE (2500ms-5000ms): Slow down with suspenseful crawl
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
  const DECEL_DURATION = 2500;
  const TOTAL_DURATION = SPIN_UP_DURATION + CRUISE_DURATION + DECEL_DURATION;
  const MAX_SPEED = 35; // slots per second at full speed

  const start = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    setPhase('spinning');

    // Calculate actual distances covered before deceleration
    const spinUpDist = MAX_SPEED * SLOT_HEIGHT * (SPIN_UP_DURATION / 1000) * 0.5;
    const cruiseDist = MAX_SPEED * SLOT_HEIGHT * (CRUISE_DURATION / 1000);
    const preDecelDist = spinUpDist + cruiseDist;
    const preDecelSlots = Math.ceil(preDecelDist / SLOT_HEIGHT);

    // Must match the DECEL_SLOTS constant in SlotMachine.jsx reel builder
    const DECEL_TARGET_SLOTS = 25;
    const minLandingSlot = preDecelSlots + DECEL_TARGET_SLOTS;

    // Find the next valid landing position that maps to our target.
    // The reel wraps, so any position congruent to targetIndex mod totalItems works.
    let landingSlot = targetIndex;
    while (landingSlot < minLandingSlot) {
      landingSlot += totalItems;
    }

    const targetOffset = landingSlot * SLOT_HEIGHT;

    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;

      if (elapsed >= TOTAL_DURATION) {
        // Landed exactly on target
        setOffset(targetOffset);
        setPhase('landed');
        isRunning.current = false;
        if (onComplete) onComplete();
        return;
      }

      let currentOffset;

      if (elapsed < SPIN_UP_DURATION) {
        // Phase 1: Spin up
        const t = elapsed / SPIN_UP_DURATION;
        const speedFactor = easeInCubic(t);
        currentOffset = speedFactor * MAX_SPEED * SLOT_HEIGHT * (elapsed / 1000);
      } else if (elapsed < SPIN_UP_DURATION + CRUISE_DURATION) {
        // Phase 2: Cruise at max speed
        const cruiseElapsed = elapsed - SPIN_UP_DURATION;
        currentOffset = spinUpDist + MAX_SPEED * SLOT_HEIGHT * (cruiseElapsed / 1000);
      } else {
        // Phase 3: Smooth deceleration toward target
        const startOfDecel = preDecelDist;
        const remainingDist = targetOffset - startOfDecel;
        const decelT = (elapsed - SPIN_UP_DURATION - CRUISE_DURATION) / DECEL_DURATION;
        currentOffset = startOfDecel + remainingDist * slotDeceleration(decelT);
      }

      setOffset(currentOffset);
      rafRef.current = requestAnimationFrame(animate);
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
