/**
 * Fisher-Yates shuffle (in-place, returns same array).
 * Uses crypto.getRandomValues for better entropy when available.
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a random integer in [0, max) using crypto API if available.
 */
function cryptoRandomInt(max) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Pick a random element from an array.
 */
export function pickRandom(array) {
  return array[cryptoRandomInt(array.length)];
}
