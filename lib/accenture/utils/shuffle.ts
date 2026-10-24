/**
 * NerdMocks Accenture Practice - Utility Functions
 * Shuffling and random utilities with pure functional semantics.
 */

/**
 * Fisher-Yates array shuffle. Returns a new shuffled array without mutating the original.
 */
export function shuffle<T>(array: readonly T[], randomFn: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export function randomInt(min: number, max: number, randomFn: () => number = Math.random): number {
  const floorMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(randomFn() * (floorMax - floorMin + 1)) + floorMin;
}

/**
 * Picks a random item from a non-empty array.
 */
export function pickRandom<T>(array: readonly T[], randomFn: () => number = Math.random): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = Math.floor(randomFn() * array.length);
  return array[index];
}
