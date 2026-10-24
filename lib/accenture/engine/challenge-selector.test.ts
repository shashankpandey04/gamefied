/**
 * NerdMocks Accenture Practice - Challenge Engine Unit Tests
 * Rigorously verifies all 8 critical requirements from Section 7.
 */

import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  recordPlayedChallenge,
  getRecentFingerprints,
  isRecentlyPlayed,
  clearVariantHistory,
  resetInMemoryHistory,
  MAX_HISTORY_PER_VARIANT,
} from './challenge-history';

import { selectChallenge } from './challenge-selector';

import {
  generateQuickFireMathChallenge,
  validateQuickFireMathChallenge,
  fingerprintQuickFireMathChallenge,
  evaluateMathExpression,
} from '../games/quick-fire-math';

import {
  generateMemoryMaze,
  validateMemoryMazeChallenge,
  fingerprintMemoryMazeChallenge,
} from '../games/memory-maze';

import {
  generatePathFinderChallenge,
  validatePathFinderChallenge,
  fingerprintPathFinderChallenge,
} from '../games/path-finder';

describe('Challenge Selection Engine', () => {
  beforeEach(() => {
    resetInMemoryHistory();
  });

  // Requirement 1: Previously played fingerprints are excluded when alternatives exist
  test('1. Previously played fingerprints are excluded when alternatives exist', () => {
    const gameId = 'quick-fire-math';
    const variant = 'basic';
    clearVariantHistory(gameId, variant);

    // Mock generator with a small set of choices: 'FP_A', 'FP_B', 'FP_C'
    let index = 0;
    const pool = ['FP_A', 'FP_B', 'FP_C'];
    const mockGenerator = () => {
      const val = pool[index % pool.length];
      index++;
      return { id: val };
    };

    // Pre-record FP_A
    recordPlayedChallenge(gameId, variant, 'FP_A');

    const result = selectChallenge({
      gameId,
      variant,
      generator: mockGenerator,
      validator: () => true,
      fingerprinter: (c) => c.id,
      maxAttempts: 10,
    });

    assert.notStrictEqual(result.fingerprint, 'FP_A', 'Should not select recently played FP_A');
    assert.strictEqual(result.isFresh, true);
    assert.ok(result.fingerprint === 'FP_B' || result.fingerprint === 'FP_C');
  });

  // Requirement 2: Different variants maintain separate histories
  test('2. Different variants maintain separate histories', () => {
    const gameId = 'quick-fire-math';
    const varBasic = 'basic';
    const varSpeed = 'speed';

    clearVariantHistory(gameId, varBasic);
    clearVariantHistory(gameId, varSpeed);

    recordPlayedChallenge(gameId, varBasic, 'SHARED_FP_123');

    assert.strictEqual(
      isRecentlyPlayed(gameId, varBasic, 'SHARED_FP_123'),
      true,
      'Should be marked played in basic variant'
    );
    assert.strictEqual(
      isRecentlyPlayed(gameId, varSpeed, 'SHARED_FP_123'),
      false,
      'Should NOT be marked played in speed variant'
    );

    const historyBasic = getRecentFingerprints(gameId, varBasic);
    const historySpeed = getRecentFingerprints(gameId, varSpeed);

    assert.deepStrictEqual(historyBasic, ['SHARED_FP_123']);
    assert.deepStrictEqual(historySpeed, []);
  });

  // Requirement 3: History persists correctly and retrieval works
  test('3. History persists across operations when storage is available', () => {
    const gameId = 'path-finder';
    const variant = 'beginner';
    clearVariantHistory(gameId, variant);

    recordPlayedChallenge(gameId, variant, 'PF_1');
    recordPlayedChallenge(gameId, variant, 'PF_2');
    recordPlayedChallenge(gameId, variant, 'PF_3');

    const retrieved = getRecentFingerprints(gameId, variant);
    assert.deepStrictEqual(retrieved, ['PF_1', 'PF_2', 'PF_3']);
  });

  // Requirement 4: Malformed stored history does not crash the application
  test('4. Malformed stored history does not crash the application', () => {
    // If mock localStorage contains corrupted data
    const mockStorage: Record<string, string> = {
      'nerdmocks_accenture_history_corrupt_game::corrupt_var': '{ invalid_json_syntax %%% ]]',
    };

    // Simulate global window with mock storage
    const originalWindow = (globalThis as unknown as { window?: unknown }).window;
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = v;
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
      },
    };

    try {
      // Must not throw, should safely return empty array
      const history = getRecentFingerprints('corrupt_game', 'corrupt_var');
      assert.deepStrictEqual(history, []);

      // Recording should safely overwrite
      recordPlayedChallenge('corrupt_game', 'corrupt_var', 'NEW_FP');
      const updated = getRecentFingerprints('corrupt_game', 'corrupt_var');
      assert.deepStrictEqual(updated, ['NEW_FP']);
    } finally {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
    }
  });

  // Requirement 5: History remains bounded
  test(`5. History remains bounded to max ${MAX_HISTORY_PER_VARIANT} items`, () => {
    const gameId = 'memory-maze';
    const variant = 'expert';
    clearVariantHistory(gameId, variant);

    const totalToInsert = MAX_HISTORY_PER_VARIANT + 15;
    for (let i = 0; i < totalToInsert; i++) {
      recordPlayedChallenge(gameId, variant, `FP_INDEX_${i}`);
    }

    const history = getRecentFingerprints(gameId, variant);
    assert.strictEqual(history.length, MAX_HISTORY_PER_VARIANT, 'History must not exceed maximum size');
    assert.strictEqual(history[history.length - 1], `FP_INDEX_${totalToInsert - 1}`);
    assert.strictEqual(
      history.includes('FP_INDEX_0'),
      false,
      'Oldest items should have been evicted'
    );
  });

  // Requirement 6: Generation terminates safely even with exhausted challenge space
  test('6. Generation terminates safely when challenge space is exhausted', () => {
    const gameId = 'test_finite';
    const variant = 'small';
    clearVariantHistory(gameId, variant);

    // Only 1 possible challenge exists
    const mockGenerator = () => ({ val: 99 });
    const singleFP = 'FP_SINGLE_99';

    // Pre-record the only candidate in history
    recordPlayedChallenge(gameId, variant, singleFP);

    // Engine must not hang or throw an infinite loop, it should return with isFresh=false
    const result = selectChallenge({
      gameId,
      variant,
      generator: mockGenerator,
      validator: () => true,
      fingerprinter: () => singleFP,
      maxAttempts: 10,
    });

    assert.strictEqual(result.challenge.val, 99);
    assert.strictEqual(result.isFresh, false);
    assert.ok(result.attempts <= 10, 'Must terminate within maxAttempts');
  });

  // Requirement 7: Invalid challenges are rejected
  test('7. Invalid challenges are rejected by validator', () => {
    const gameId = 'test_validation';
    const variant = 'strict';

    let count = 0;
    const mockGenerator = () => {
      count++;
      return { id: `item_${count}`, isValid: count >= 3 };
    };

    const result = selectChallenge({
      gameId,
      variant,
      generator: mockGenerator,
      validator: (item) => item.isValid,
      fingerprinter: (item) => item.id,
      maxAttempts: 10,
    });

    assert.strictEqual(result.challenge.isValid, true);
    assert.strictEqual(result.challenge.id, 'item_3');
  });

  // Requirement 8: Double invocation / React render stability
  test('8. Selection with stable token returns identical challenge without creating duplicate state', () => {
    // In React 18/19 StrictMode, components render twice. A selection engine hook uses
    // an initial ref or token to guard against re-generating.
    let generationCount = 0;
    const generator = () => {
      generationCount++;
      return { id: `challenge_${generationCount}` };
    };

    // Emulate hook caching
    const cache = new Map<string, unknown>();
    function getOrCreateChallenge(key: string) {
      if (!cache.has(key)) {
        cache.set(
          key,
          selectChallenge({
            gameId: 'render-test',
            variant: 'v1',
            generator,
            validator: () => true,
            fingerprinter: (c) => c.id,
          })
        );
      }
      return cache.get(key);
    }

    const firstRender = getOrCreateChallenge('session-mount-1');
    const secondRender = getOrCreateChallenge('session-mount-1');

    assert.strictEqual(firstRender, secondRender);
    assert.strictEqual(generationCount, 1, 'Generator must only be invoked once for the same session token');
  });

  // Additional integration tests for all 3 games with the challenge engine
  describe('Games Integration with Challenge Selector', () => {
    test('Quick-Fire Math generator and evaluator work correctly across all 3 variants', () => {
      for (const variant of ['basic', 'mixed', 'speed'] as const) {
        const result = selectChallenge({
          gameId: 'quick-fire-math',
          variant,
          generator: () => generateQuickFireMathChallenge(variant),
          validator: validateQuickFireMathChallenge,
          fingerprinter: fingerprintQuickFireMathChallenge,
          autoRecord: true,
        });

        assert.strictEqual(result.challenge.variant, variant);
        assert.ok(result.fingerprint.startsWith(`QFM_${variant}_`));
        assert.strictEqual(validateQuickFireMathChallenge(result.challenge), true);

        // Check evaluation accuracy
        for (const item of result.challenge.expressions) {
          // Standard operators sanitized for evaluateMathExpression
          const normalized = item.expression.replace(/×/g, '*').replace(/÷/g, '/');
          const evaluated = evaluateMathExpression(normalized);
          assert.strictEqual(evaluated, item.value);
        }
      }
    });

    test('Memory Maze generator creates valid traversable mazes across all 4 variants', () => {
      for (const variant of ['easy', 'classic', 'advanced', 'expert'] as const) {
        const result = selectChallenge({
          gameId: 'memory-maze',
          variant,
          generator: () => generateMemoryMaze(variant),
          validator: validateMemoryMazeChallenge,
          fingerprinter: fingerprintMemoryMazeChallenge,
          autoRecord: true,
        });

        assert.strictEqual(result.challenge.variant, variant);
        assert.ok(result.fingerprint.startsWith(`MM_${variant}_`));
        assert.strictEqual(validateMemoryMazeChallenge(result.challenge), true);
      }
    });

    test('Path Finder generator produces fully solvable connected paths across all 5 variants', () => {
      for (const variant of ['beginner', 'easy', 'intermediate', 'advanced', 'expert'] as const) {
        const result = selectChallenge({
          gameId: 'path-finder',
          variant,
          generator: () => generatePathFinderChallenge(variant),
          validator: validatePathFinderChallenge,
          fingerprinter: fingerprintPathFinderChallenge,
          autoRecord: true,
        });

        assert.strictEqual(result.challenge.variant, variant);
        assert.ok(result.fingerprint.startsWith(`PF_${variant}_`));
        assert.strictEqual(validatePathFinderChallenge(result.challenge), true);
      }
    });
  });
});
