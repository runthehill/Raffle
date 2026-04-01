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

export function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

/**
 * Custom deceleration curve for the slot machine.
 * Designed for ~25 slots of total decel distance:
 *
 *   0.0–0.45: Fast initial decel — blows through ~20 slots quickly
 *   0.45–0.88: Long suspenseful crawl — ~4 names drift by slowly
 *   0.88–1.0: Barely-moving final settle — <1 slot, eases to a stop
 *
 * All transitions are smooth (no bounces, no snaps).
 */
export function slotDeceleration(t) {
  if (t < 0.45) {
    // Fast decel: cover most of the distance quickly
    return easeOutCubic(t / 0.45) * 0.8;
  } else if (t < 0.88) {
    // Suspenseful crawl: names drift by one at a time
    const localT = (t - 0.45) / 0.43;
    return 0.8 + easeOutCubic(localT) * 0.17;
  } else {
    // Gentle final settle: barely any movement
    const localT = (t - 0.88) / 0.12;
    return 0.97 + easeOutQuint(localT) * 0.03;
  }
}
