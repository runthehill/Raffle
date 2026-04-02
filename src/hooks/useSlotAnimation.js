import { useState, useRef, useCallback, useEffect } from 'react';
import { easeInCubic } from '../utils/easing';
import {
  SLOT_HEIGHT, MAX_SPEED, SPIN_UP_DURATION, CRUISE_DURATION,
  DECEL_DURATION, TOTAL_DURATION, DECEL_SLOTS, PRE_DECEL_SLOTS,
} from '../animationConstants';

/**
 * Custom hook that drives the slot machine reel animation.
 *
 * Phases:
 *   1. SPIN_UP (0–400ms): Accelerate from 0 to max velocity
 *   2. CRUISE (400–2500ms): Constant high speed
 *   3. DECELERATE (2500–5500ms): Velocity-matched power curve that
 *      smoothly decelerates from cruise speed to zero. In the final
 *      ~900ms, a gentle damped oscillation (±0.5 slots) produces a
 *      "teeter" where the reel drifts past the winner, drifts back,
 *      and settles.
 *   4. LANDED: Winner in position, trigger callback
 */
export default function useSlotAnimation({ totalItems, targetIndex, onComplete }) {
  const [offset, setOffset] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | spinning | landed
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const isRunning = useRef(false);

  const start = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    setPhase('spinning');

    // Distances covered before deceleration
    const spinUpDist = MAX_SPEED * SLOT_HEIGHT * (SPIN_UP_DURATION / 1000) * 0.5;
    const cruiseDist = MAX_SPEED * SLOT_HEIGHT * (CRUISE_DURATION / 1000);
    const preDecelDist = spinUpDist + cruiseDist;

    const minLandingSlot = PRE_DECEL_SLOTS + DECEL_SLOTS;

    let landingSlot = targetIndex;
    while (landingSlot < minLandingSlot) {
      landingSlot += totalItems;
    }

    const targetOffset = landingSlot * SLOT_HEIGHT;
    const remainingDist = targetOffset - preDecelDist;

    // Power-curve exponent: computed so the curve's initial velocity
    // exactly matches cruise speed. No speed discontinuity.
    const cruiseVel = MAX_SPEED * SLOT_HEIGHT; // px/sec
    const p = Math.max(2, cruiseVel * (DECEL_DURATION / 1000) / remainingDist);

    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;

      if (elapsed >= TOTAL_DURATION) {
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
        currentOffset = easeInCubic(t) * MAX_SPEED * SLOT_HEIGHT * (elapsed / 1000);

      } else if (elapsed < SPIN_UP_DURATION + CRUISE_DURATION) {
        // Phase 2: Cruise
        const cruiseElapsed = elapsed - SPIN_UP_DURATION;
        currentOffset = spinUpDist + MAX_SPEED * SLOT_HEIGHT * (cruiseElapsed / 1000);

      } else {
        // Phase 3: Deceleration
        const decelT = (elapsed - SPIN_UP_DURATION - CRUISE_DURATION) / DECEL_DURATION;

        // Smooth power-curve covers the full distance
        const progress = 1 - Math.pow(1 - decelT, p);
        currentOffset = preDecelDist + remainingDist * progress;

        // Additive teeter: damped oscillation in the last 30% of decel.
        const TEETER_START = 0.7;
        if (decelT > TEETER_START) {
          const tT = (decelT - TEETER_START) / (1 - TEETER_START);
          const amp = 2.0 * SLOT_HEIGHT;
          const envelope = Math.sin(Math.PI * tT);
          const damping = Math.exp(-2.5 * tT);
          const osc = Math.sin(3 * Math.PI * tT);
          currentOffset += amp * osc * envelope * damping;
        }
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
