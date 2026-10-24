/**
 * NerdMocks Accenture Practice - Challenge Selector Engine
 * Generates valid procedural challenges, avoids repeats against recent history,
 * validates challenges, guarantees termination, and provides safe fallbacks.
 */

import { getRecentFingerprints, recordPlayedChallenge } from './challenge-history';

export interface ChallengeSelectorOptions<T> {
  gameId: string;
  variant: string;
  generator: () => T;
  validator: (challenge: T) => boolean;
  fingerprinter: (challenge: T) => string;
  maxAttempts?: number;
  autoRecord?: boolean;
}

export interface ChallengeSelectionResult<T> {
  challenge: T;
  fingerprint: string;
  isFresh: boolean;
  attempts: number;
}

const DEFAULT_MAX_ATTEMPTS = 30;

/**
 * Selects a valid, non-repeated challenge using procedural generation.
 * Guarantees safe termination even when challenge space is constrained.
 */
export function selectChallenge<T>(options: ChallengeSelectorOptions<T>): ChallengeSelectionResult<T> {
  const {
    gameId,
    variant,
    generator,
    validator,
    fingerprinter,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    autoRecord = false,
  } = options;

  const recentFingerprints = new Set(getRecentFingerprints(gameId, variant));
  let validFallbackCandidate: { challenge: T; fingerprint: string } | null = null;
  let attempts = 0;

  for (let i = 0; i < maxAttempts; i++) {
    attempts++;
    let candidate: T;
    try {
      candidate = generator();
    } catch {
      // If generator throws unexpectedly, continue trying next attempt
      continue;
    }

    // Verify candidate validity
    if (!validator(candidate)) {
      continue;
    }

    const fingerprint = fingerprinter(candidate);
    if (!fingerprint) {
      continue;
    }

    // Keep the first valid candidate as a fallback in case history cannot be avoided
    if (!validFallbackCandidate) {
      validFallbackCandidate = { challenge: candidate, fingerprint };
    }

    // If candidate has not been played recently, it's fresh!
    if (!recentFingerprints.has(fingerprint)) {
      if (autoRecord) {
        recordPlayedChallenge(gameId, variant, fingerprint);
      }
      return {
        challenge: candidate,
        fingerprint,
        isFresh: true,
        attempts,
      };
    }
  }

  // If all attempts resulted in recently played challenges (history exhaustion / restricted space),
  // fall back gracefully to the first valid candidate rather than crashing or looping infinitely.
  if (validFallbackCandidate) {
    if (autoRecord) {
      recordPlayedChallenge(gameId, variant, validFallbackCandidate.fingerprint);
    }
    return {
      challenge: validFallbackCandidate.challenge,
      fingerprint: validFallbackCandidate.fingerprint,
      isFresh: false,
      attempts,
    };
  }

  // Emergency deterministic fallback: try generating strictly until 1 valid candidate is found
  // with a tight loop cap to prevent hangs
  for (let emergency = 0; emergency < 50; emergency++) {
    attempts++;
    try {
      const candidate = generator();
      if (validator(candidate)) {
        const fingerprint = fingerprinter(candidate) || `emergency_${Date.now()}`;
        if (autoRecord) {
          recordPlayedChallenge(gameId, variant, fingerprint);
        }
        return {
          challenge: candidate,
          fingerprint,
          isFresh: false,
          attempts,
        };
      }
    } catch {
      // continue
    }
  }

  throw new Error(`Failed to generate a valid challenge for ${gameId} (${variant}) after ${attempts} attempts`);
}
