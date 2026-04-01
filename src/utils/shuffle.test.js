import { describe, it, expect } from 'vitest';
import { shuffle, pickRandom } from './shuffle';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles a single-element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces different orderings over many runs', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set();
    for (let i = 0; i < 50; i++) {
      results.add(shuffle(input).join(','));
    }
    // With 10 elements and 50 trials, we should see multiple unique orderings
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const arr = ['alpha', 'beta', 'gamma'];
    const result = pickRandom(arr);
    expect(arr).toContain(result);
  });

  it('returns the only element of a single-element array', () => {
    expect(pickRandom(['only'])).toBe('only');
  });

  it('picks different elements over many runs', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const picked = new Set();
    for (let i = 0; i < 100; i++) {
      picked.add(pickRandom(arr));
    }
    // Should pick more than 1 unique element over 100 trials
    expect(picked.size).toBeGreaterThan(1);
  });
});
