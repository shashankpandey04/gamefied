/**
 * Burst the Bubble - Comprehensive Mathematical Correctness & Gameplay Tests
 * Verifies safe evaluation, PEMDAS precedence, ascending ordering, challenge validity,
 * and adaptive difficulty progression.
 */

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateMathExpression,
  generateBurstTheBubbleChallenge,
  validateBurstTheBubbleChallenge,
  fingerprintBurstTheBubbleChallenge,
  getNextDifficulty,
} from './quick-fire-math';
import type { BurstTheBubbleChallenge } from './quick-fire-math';

describe('Burst the Bubble - Mathematical Correctness & Gameplay Logic', () => {
  describe('1. Expression Evaluation & Standard PEMDAS Precedence', () => {
    test('evaluates simple operations accurately', () => {
      assert.strictEqual(evaluateMathExpression('18 ÷ 3'), 6);
      assert.strictEqual(evaluateMathExpression('4 + 5'), 9);
      assert.strictEqual(evaluateMathExpression('3 × 4'), 12);
      assert.strictEqual(evaluateMathExpression('20 - 5'), 15);
    });

    test('evaluates compound expressions respecting operator precedence (multiplication before addition)', () => {
      // 3 * 4 + 5 = 12 + 5 = 17
      assert.strictEqual(evaluateMathExpression('3 × 4 + 5'), 17);
      // 5 + 3 * 4 = 5 + 12 = 17
      assert.strictEqual(evaluateMathExpression('5 + 3 × 4'), 17);
      // 20 - 2 * 3 = 20 - 6 = 14
      assert.strictEqual(evaluateMathExpression('20 - 2 × 3'), 14);
      // 30 / 5 + 4 * 2 = 6 + 8 = 14
      assert.strictEqual(evaluateMathExpression('30 ÷ 5 + 4 × 2'), 14);
    });

    test('throws or safely rejects division by zero', () => {
      assert.throws(() => evaluateMathExpression('10 ÷ 0'), /Division by zero/);
    });

    test('returns clean integer results without NaN or float artifacts', () => {
      const results = ['45 ÷ 5', '7 × 8', '19 + 23', '90 - 45'].map(evaluateMathExpression);
      for (const res of results) {
        assert.ok(Number.isInteger(res), `Expected integer but got ${res}`);
        assert.ok(!isNaN(res));
      }
    });
  });

  describe('2. Challenge Generation & Unambiguous Numerical Ordering', () => {
    test('generates valid challenges across difficulty levels 1 through 10', () => {
      for (let lvl = 1; lvl <= 10; lvl++) {
        const challenge = generateBurstTheBubbleChallenge(lvl);
        assert.strictEqual(
          validateBurstTheBubbleChallenge(challenge),
          true,
          `Challenge at level ${lvl} failed validation`
        );
        assert.strictEqual(challenge.timeLimit, 15, 'Time limit must strictly be 15s');
      }
    });

    test('guarantees strictly distinct numerical values (zero ties or ambiguity)', () => {
      for (let run = 0; run < 25; run++) {
        const challenge = generateBurstTheBubbleChallenge(Math.floor(Math.random() * 10) + 1);
        const values = challenge.bubbles.map((b) => b.value);
        const uniqueValues = new Set(values);

        assert.strictEqual(
          uniqueValues.size,
          values.length,
          `Found duplicate values in challenge: ${JSON.stringify(values)}`
        );
      }
    });

    test('verifies true numerical ordering over lexicographical string sorting', () => {
      // Numerical vs lexicographical check:
      // Lexicographically: "12" comes before "6" ("1" < "6").
      // Numerically: 6 < 12.
      const bubbles = [
        { id: '1', label: 'A', expression: '20 - 5', value: 15 },
        { id: '2', label: 'B', expression: '18 ÷ 3', value: 6 },
        { id: '3', label: 'C', expression: '3 × 4', value: 12 },
        { id: '4', label: 'D', expression: '4 + 5', value: 9 },
      ];

      // Numerical sort
      const numericallySorted = [...bubbles].sort((a, b) => a.value - b.value);
      const correctOrderValues = numericallySorted.map((b) => b.value);

      assert.deepStrictEqual(correctOrderValues, [6, 9, 12, 15]);

      // Confirm smallest remaining logic works sequentially
      const remaining = [...bubbles];
      const popped: number[] = [];

      while (remaining.length > 0) {
        // Find smallest remaining
        const minBubble = remaining.reduce((min, b) => (b.value < min.value ? b : min), remaining[0]);
        popped.push(minBubble.value);
        const idx = remaining.findIndex((b) => b.id === minBubble.id);
        remaining.splice(idx, 1);
      }

      assert.deepStrictEqual(popped, [6, 9, 12, 15]);
    });
  });

  describe('3. Adaptive Difficulty Scaling & Progression Rules', () => {
    test('scales bubble counts according to difficulty level', () => {
      const lvl1 = generateBurstTheBubbleChallenge(1);
      assert.strictEqual(lvl1.bubbles.length, 3, 'Level 1 must have 3 bubbles');

      const lvl3 = generateBurstTheBubbleChallenge(3);
      assert.strictEqual(lvl3.bubbles.length, 4, 'Level 3 must have 4 bubbles');

      const lvl6 = generateBurstTheBubbleChallenge(6);
      assert.strictEqual(lvl6.bubbles.length, 5, 'Level 6 must have 5 bubbles');

      const lvl9 = generateBurstTheBubbleChallenge(9);
      assert.strictEqual(lvl9.bubbles.length, 6, 'Level 9 must have 6 bubbles');
    });

    test('increases difficulty automatically on challenge completion', () => {
      const next = getNextDifficulty(2.0, 'completed', 0);
      assert.strictEqual(next, 2.5);

      // Hot streak (>= 3) accelerates progression
      const streakNext = getNextDifficulty(2.5, 'completed', 4);
      assert.strictEqual(streakNext, 3.3);
    });

    test('decays difficulty gently on wrong selection or timeout without resetting to 1', () => {
      // From level 5, a mistake should drop to 4.5, NOT reset to 1
      const onWrong = getNextDifficulty(5.0, 'wrong', 0);
      assert.strictEqual(onWrong, 4.5);

      const onTimeout = getNextDifficulty(4.5, 'timeout', 0);
      assert.strictEqual(onTimeout, 4.0);

      // Clamped to minimum 1.0
      const atBase = getNextDifficulty(1.0, 'wrong', 0);
      assert.strictEqual(atBase, 1.0);
    });
  });

  describe('4. Fingerprinting & Presentation Invariance', () => {
    test('produces identical fingerprint regardless of bubble presentation order', () => {
      const challengeA: BurstTheBubbleChallenge = {
        id: 'test_1',
        difficultyLevel: 3,
        timeLimit: 15,
        bubbles: [
          { id: 'b1', label: 'A', expression: '18 ÷ 3', value: 6 },
          { id: 'b2', label: 'B', expression: '4 + 5', value: 9 },
          { id: 'b3', label: 'C', expression: '3 × 4', value: 12 },
          { id: 'b4', label: 'D', expression: '20 - 5', value: 15 },
        ],
      };

      // Shuffled presentation order with different IDs and labels
      const challengeB: BurstTheBubbleChallenge = {
        id: 'test_2',
        difficultyLevel: 3,
        timeLimit: 15,
        bubbles: [
          { id: 'b4_alt', label: 'A', expression: '20 - 5', value: 15 },
          { id: 'b1_alt', label: 'B', expression: '18 ÷ 3', value: 6 },
          { id: 'b3_alt', label: 'C', expression: '3 × 4', value: 12 },
          { id: 'b2_alt', label: 'D', expression: '4 + 5', value: 9 },
        ],
      };

      const fpA = fingerprintBurstTheBubbleChallenge(challengeA);
      const fpB = fingerprintBurstTheBubbleChallenge(challengeB);

      assert.strictEqual(fpA, fpB);
      assert.ok(fpA.startsWith('BTB_lvl3_'));
    });
  });
});
