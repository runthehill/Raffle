/**
 * Easing functions for slot machine animation.
 * All take t in [0, 1] and return a value in [0, 1].
 */

export function easeInCubic(t) {
  return t * t * t;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}

export function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

/**
 * Custom deceleration curve for the slot machine.
 * Starts fast, slows dramatically, then has a subtle "tease" near the end.
 */
export function slotDeceleration(t) {
  if (t < 0.7) {
    // Smooth deceleration for first 70%
    return easeOutCubic(t / 0.7) * 0.85;
  } else if (t < 0.85) {
    // Near-stop tease zone (slow crawl)
    const localT = (t - 0.7) / 0.15;
    return 0.85 + localT * 0.1;
  } else {
    // Final snap to position
    const localT = (t - 0.85) / 0.15;
    return 0.95 + easeOutBounce(localT) * 0.05;
  }
}
