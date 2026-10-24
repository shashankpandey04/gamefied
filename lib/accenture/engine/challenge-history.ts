/**
 * NerdMocks Accenture Practice - Challenge History
 * Manages recently played challenge fingerprints with localStorage persistence,
 * bounded capacity, SSR-safety, and graceful error recovery.
 */

export const MAX_HISTORY_PER_VARIANT = 25;
const STORAGE_PREFIX = 'nerdmocks_accenture_history_';

// In-memory fallback for SSR or environments where localStorage is blocked/unavailable
const inMemoryFallback = new Map<string, string[]>();

function getStorageKey(gameId: string, variant: string): string {
  const safeGame = encodeURIComponent(gameId.trim().toLowerCase());
  const safeVariant = encodeURIComponent(variant.trim().toLowerCase());
  return `${STORAGE_PREFIX}${safeGame}::${safeVariant}`;
}

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__nerdmocks_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the list of recently played fingerprints for a specific game and variant.
 */
export function getRecentFingerprints(gameId: string, variant: string): string[] {
  const key = getStorageKey(gameId, variant);

  if (!isLocalStorageAvailable()) {
    return inMemoryFallback.get(key) ? [...(inMemoryFallback.get(key)!)] : [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      // Malformed: not an array -> reset safely
      window.localStorage.removeItem(key);
      return [];
    }

    // Filter to ensure all items are non-empty strings
    const validFingerprints = parsed.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    );

    // Keep bounded
    if (validFingerprints.length > MAX_HISTORY_PER_VARIANT) {
      const bounded = validFingerprints.slice(-MAX_HISTORY_PER_VARIANT);
      window.localStorage.setItem(key, JSON.stringify(bounded));
      return bounded;
    }

    return validFingerprints;
  } catch {
    // Malformed JSON or read error -> handle safely
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return [];
  }
}

/**
 * Checks if a challenge fingerprint was recently played.
 */
export function isRecentlyPlayed(gameId: string, variant: string, fingerprint: string): boolean {
  if (!fingerprint) return false;
  const history = getRecentFingerprints(gameId, variant);
  return history.includes(fingerprint);
}

/**
 * Records a played challenge fingerprint into history, maintaining bounded size.
 */
export function recordPlayedChallenge(gameId: string, variant: string, fingerprint: string): void {
  if (!fingerprint || typeof fingerprint !== 'string') return;

  const key = getStorageKey(gameId, variant);
  const current = getRecentFingerprints(gameId, variant);

  // Avoid consecutive duplicates and keep bounded
  const filtered = current.filter((fp) => fp !== fingerprint);
  filtered.push(fingerprint);

  const bounded = filtered.slice(-MAX_HISTORY_PER_VARIANT);

  if (!isLocalStorageAvailable()) {
    inMemoryFallback.set(key, bounded);
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(bounded));
  } catch {
    // Fall back to memory if quota exceeded or storage error
    inMemoryFallback.set(key, bounded);
  }
}

/**
 * Clears the history for a specific game and variant.
 */
export function clearVariantHistory(gameId: string, variant: string): void {
  const key = getStorageKey(gameId, variant);
  inMemoryFallback.delete(key);
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Reset all in-memory fallback stores (useful in tests).
 */
export function resetInMemoryHistory(): void {
  inMemoryFallback.clear();
}
