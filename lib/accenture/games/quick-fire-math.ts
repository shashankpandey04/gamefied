/**
 * NerdMocks Accenture Practice - Burst the Bubble (Quick-Fire Math)
 * Procedural generation, safe PEMDAS evaluation, adaptive difficulty progression,
 * and unambiguous ascending numerical order validation.
 */

import { randomInt, shuffle } from '../utils/shuffle';

export type MathVariant = 'basic' | 'mixed' | 'speed';

export interface BubbleItem {
  id: string;
  label: string;
  expression: string;
  value: number;
}

export interface BurstTheBubbleChallenge {
  id: string;
  difficultyLevel: number;
  bubbles: BubbleItem[]; // Shuffled presentation order
  timeLimit: number; // Strictly 15 seconds
}

export interface MathExpression {
  id: string;
  expression: string;
  value: number;
}

export interface QuickFireMathChallenge {
  variant: MathVariant;
  expressions: MathExpression[];
  timeLimit: number;
}

export interface MathVariantConfig {
  name: string;
  description: string;
  itemCount: number;
  timeLimit: number;
  allowedOperators: string[];
}

export const MATH_VARIANT_CONFIGS: Record<MathVariant, MathVariantConfig> = {
  basic: {
    name: 'Foundation Bubble',
    description: 'Burst bubbles in ascending order using basic mental arithmetic.',
    itemCount: 4,
    timeLimit: 15,
    allowedOperators: ['+', '-'],
  },
  mixed: {
    name: 'Mixed Operations',
    description: 'Burst bubbles with multiplication, division, and mixed operators.',
    itemCount: 5,
    timeLimit: 15,
    allowedOperators: ['+', '-', '*', '/'],
  },
  speed: {
    name: 'Compound Speed',
    description: 'High-speed comparison of multi-step expressions under 15s pressure.',
    itemCount: 5,
    timeLimit: 15,
    allowedOperators: ['+', '-', '*', '/'],
  },
};

/**
 * Safely evaluates a basic math expression string obeying standard operator precedence (PEMDAS/BODMAS).
 * Never uses unsafe eval(). Handles standard unicode × and ÷ seamlessly.
 */
export function evaluateMathExpression(rawExpr: string): number {
  if (!rawExpr || typeof rawExpr !== 'string') return 0;

  // Normalize unicode operators to standard ASCII
  const normalized = rawExpr.replace(/×/g, '*').replace(/÷/g, '/');
  const tokens = normalized.trim().split(/\s+/);
  if (tokens.length === 0) return 0;
  if (tokens.length === 1) {
    const val = Number(tokens[0]);
    if (isNaN(val)) throw new Error(`Invalid number: ${tokens[0]}`);
    return val;
  }

  // First pass: multiplication and division (left-to-right precedence)
  const intermediateTokens: (number | string)[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === '*' || token === '/') {
      const prev = Number(intermediateTokens.pop());
      const next = Number(tokens[i + 1]);
      if (isNaN(prev) || isNaN(next)) {
        throw new Error(`Invalid operands for operator ${token}`);
      }
      if (token === '/' && next === 0) {
        throw new Error('Division by zero');
      }
      const res = token === '*' ? prev * next : prev / next;
      intermediateTokens.push(res);
      i += 2;
    } else if (token === '+' || token === '-') {
      intermediateTokens.push(token);
      i++;
    } else {
      const num = Number(token);
      if (isNaN(num)) throw new Error(`Invalid number token: ${token}`);
      intermediateTokens.push(num);
      i++;
    }
  }

  // Second pass: addition and subtraction (left-to-right precedence)
  let result = Number(intermediateTokens[0]);
  let j = 1;
  while (j < intermediateTokens.length) {
    const op = intermediateTokens[j] as string;
    const next = Number(intermediateTokens[j + 1]);
    if (isNaN(next)) throw new Error(`Invalid operand for operator ${op}`);
    if (op === '+') {
      result += next;
    } else if (op === '-') {
      result -= next;
    }
    j += 2;
  }

  return Math.round(result * 1000) / 1000;
}

// -------------------------------------------------------------
// Generator Helpers for Different Difficulties
// -------------------------------------------------------------

function generateSimpleAdd(minVal: number, maxVal: number): { expr: string; val: number } {
  const sum = randomInt(minVal, maxVal);
  const a = randomInt(Math.max(1, Math.floor(sum * 0.15)), Math.floor(sum * 0.85));
  const b = sum - a;
  return { expr: `${a} + ${b}`, val: sum };
}

function generateSimpleSub(minVal: number, maxVal: number): { expr: string; val: number } {
  const diff = randomInt(minVal, maxVal);
  const b = randomInt(2, 35);
  const a = diff + b;
  return { expr: `${a} - ${b}`, val: diff };
}

function generateSimpleMul(maxFactorA = 9, maxFactorB = 9): { expr: string; val: number } {
  const a = randomInt(2, maxFactorA);
  const b = randomInt(2, maxFactorB);
  return { expr: `${a} × ${b}`, val: a * b };
}

function generateSimpleDiv(maxDivisor = 9, maxQuotient = 12): { expr: string; val: number } {
  const divisor = randomInt(2, maxDivisor);
  const quotient = randomInt(2, maxQuotient);
  const dividend = divisor * quotient;
  return { expr: `${dividend} ÷ ${divisor}`, val: quotient };
}

function generateCompoundExpression(level: number): { expr: string; val: number } {
  const type = randomInt(1, 5);

  if (type === 1) {
    // a × b + c
    const a = randomInt(2, level >= 8 ? 9 : 7);
    const b = randomInt(2, level >= 8 ? 8 : 6);
    const c = randomInt(3, level >= 8 ? 30 : 15);
    return { expr: `${a} × ${b} + ${c}`, val: a * b + c };
  } else if (type === 2) {
    // a × b - c (strictly positive result)
    const a = randomInt(3, level >= 8 ? 10 : 7);
    const b = randomInt(3, level >= 8 ? 9 : 6);
    const prod = a * b;
    const c = randomInt(2, Math.max(3, prod - 3));
    return { expr: `${a} × ${b} - ${c}`, val: prod - c };
  } else if (type === 3) {
    // c + a × b
    const a = randomInt(2, level >= 8 ? 8 : 6);
    const b = randomInt(2, level >= 8 ? 7 : 5);
    const c = randomInt(4, level >= 8 ? 35 : 18);
    return { expr: `${c} + ${a} × ${b}`, val: c + a * b };
  } else if (type === 4) {
    // a ÷ b + c
    const b = randomInt(2, 8);
    const q = randomInt(2, level >= 8 ? 14 : 9);
    const a = b * q;
    const c = randomInt(3, level >= 8 ? 25 : 15);
    return { expr: `${a} ÷ ${b} + ${c}`, val: q + c };
  } else {
    // c - a ÷ b (strictly positive result)
    const b = randomInt(2, 6);
    const q = randomInt(2, 8);
    const a = b * q;
    const c = randomInt(q + 4, q + 30);
    return { expr: `${c} - ${a} ÷ ${b}`, val: c - q };
  }
}

/**
 * Generates an expression tailored to the given difficulty level (1 - 10).
 */
function generateExpressionForLevel(
  level: number,
  existingValues: Set<number>
): { expr: string; val: number } | null {
  for (let attempt = 0; attempt < 30; attempt++) {
    let candidate: { expr: string; val: number };

    if (level === 1) {
      // 3 bubbles, simple + / -, values 4..25
      candidate = Math.random() < 0.5 ? generateSimpleAdd(4, 25) : generateSimpleSub(4, 25);
    } else if (level === 2) {
      // 4 bubbles, + / -, values 6..35
      candidate = Math.random() < 0.5 ? generateSimpleAdd(6, 35) : generateSimpleSub(6, 35);
    } else if (level === 3) {
      // 4 bubbles, single + / - / × / ÷, values 6..45
      const roll = Math.random();
      if (roll < 0.3) candidate = generateSimpleAdd(6, 45);
      else if (roll < 0.6) candidate = generateSimpleSub(6, 45);
      else if (roll < 0.8) candidate = generateSimpleMul(7, 6);
      else candidate = generateSimpleDiv(8, 10);
    } else if (level === 4) {
      // 4 bubbles, all 4 operations, values 8..60
      const roll = Math.random();
      if (roll < 0.25) candidate = generateSimpleAdd(10, 60);
      else if (roll < 0.5) candidate = generateSimpleSub(8, 55);
      else if (roll < 0.75) candidate = generateSimpleMul(8, 8);
      else candidate = generateSimpleDiv(9, 12);
    } else if (level === 5) {
      // 5 bubbles, all 4 operations, values 10..75
      const roll = Math.random();
      if (roll < 0.25) candidate = generateSimpleAdd(12, 75);
      else if (roll < 0.5) candidate = generateSimpleSub(10, 70);
      else if (roll < 0.75) candidate = generateSimpleMul(9, 9);
      else candidate = generateSimpleDiv(9, 14);
    } else if (level <= 7) {
      // 5 bubbles, mixture of single and compound expressions
      if (Math.random() < 0.5) {
        candidate = generateCompoundExpression(level);
      } else {
        const roll = Math.random();
        if (roll < 0.3) candidate = generateSimpleMul(9, 10);
        else if (roll < 0.6) candidate = generateSimpleDiv(9, 15);
        else candidate = generateSimpleAdd(15, 85);
      }
    } else {
      // Level 8-10+: 5 to 6 bubbles, compound expressions with tight margins
      if (Math.random() < 0.75) {
        candidate = generateCompoundExpression(level);
      } else {
        candidate = Math.random() < 0.5 ? generateSimpleMul(11, 11) : generateSimpleDiv(9, 18);
      }
    }

    // Ensure strictly positive integer and non-duplicate
    if (candidate.val > 0 && Number.isInteger(candidate.val) && !existingValues.has(candidate.val)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Procedurally generates a Burst the Bubble challenge for the given adaptive difficulty level.
 * Guarantees strictly distinct integer results (unambiguous ascending order) and fresh expressions.
 */
export function generateBurstTheBubbleChallenge(
  difficultyLevel = 1
): BurstTheBubbleChallenge {
  const level = Math.max(1, Math.min(10, Math.round(difficultyLevel)));

  // Bubble count scales with level: Lvl 1 = 3, Lvl 2-4 = 4, Lvl 5-8 = 5, Lvl 9+ = 6
  let bubbleCount = 4;
  if (level === 1) bubbleCount = 3;
  else if (level >= 2 && level <= 4) bubbleCount = 4;
  else if (level >= 5 && level <= 8) bubbleCount = 5;
  else if (level >= 9) bubbleCount = 6;

  const usedValues = new Set<number>();
  const usedExpressions = new Set<string>();
  const bubbles: BubbleItem[] = [];

  let attempts = 0;
  while (bubbles.length < bubbleCount && attempts < 200) {
    attempts++;
    const candidate = generateExpressionForLevel(level, usedValues);
    if (!candidate) continue;

    if (usedValues.has(candidate.val) || usedExpressions.has(candidate.expr)) {
      continue;
    }

    usedValues.add(candidate.val);
    usedExpressions.add(candidate.expr);
    bubbles.push({
      id: `bubble_${bubbles.length}_${candidate.val}`,
      label: String.fromCharCode(65 + bubbles.length),
      expression: candidate.expr,
      value: candidate.val,
    });
  }

  // Shuffle bubbles for presentation order and reassign labels A, B, C...
  const shuffledBubbles = shuffle(bubbles).map((b, idx) => ({
    ...b,
    label: String.fromCharCode(65 + idx),
  }));

  return {
    id: `btb_lvl${level}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    difficultyLevel: level,
    bubbles: shuffledBubbles,
    timeLimit: 15, // Strictly 15 seconds per challenge
  };
}

/**
 * Validates a generated Burst the Bubble challenge.
 * Checks expression evaluation, absence of ties, and valid 15s timing.
 */
export function validateBurstTheBubbleChallenge(challenge: BurstTheBubbleChallenge): boolean {
  if (
    !challenge ||
    !Array.isArray(challenge.bubbles) ||
    challenge.bubbles.length < 3 ||
    challenge.bubbles.length > 7
  ) {
    return false;
  }

  if (challenge.timeLimit !== 15) {
    return false;
  }

  const values = new Set<number>();
  const exprs = new Set<string>();

  for (const item of challenge.bubbles) {
    if (!item.id || !item.expression || typeof item.value !== 'number' || isNaN(item.value)) {
      return false;
    }

    // Ensure calculated value matches stored value
    const calculated = evaluateMathExpression(item.expression);
    if (calculated !== item.value) {
      return false;
    }

    // Ties or duplicates render the challenge invalid
    if (values.has(item.value) || exprs.has(item.expression)) {
      return false;
    }

    values.add(item.value);
    exprs.add(item.expression);
  }

  return true;
}

/**
 * Creates a normalized fingerprint for a Burst the Bubble challenge.
 */
export function fingerprintBurstTheBubbleChallenge(challenge: BurstTheBubbleChallenge): string {
  // Sort by calculated value to ensure presentation-invariant fingerprint
  const sorted = [...challenge.bubbles].sort((a, b) => a.value - b.value);
  const itemsStr = sorted.map((item) => `${item.expression}=${item.value}`).join(';');
  return `BTB_lvl${challenge.difficultyLevel}_[${itemsStr}]`;
}

/**
 * Adaptive difficulty calculator:
 * Completing challenges advances difficulty, with bonus advancement on streaks.
 * Failures / timeouts decay difficulty gently without resetting to 1.
 */
export function getNextDifficulty(
  currentDifficulty: number,
  outcome: 'completed' | 'wrong' | 'timeout',
  streak: number
): number {
  if (outcome === 'completed') {
    const increment = streak >= 3 ? 0.8 : 0.5;
    return Math.min(10, Math.round((currentDifficulty + increment) * 10) / 10);
  } else {
    // Graceful decay: step down by 0.5, clamped to min 1.0
    return Math.max(1, Math.round((currentDifficulty - 0.5) * 10) / 10);
  }
}

// -------------------------------------------------------------
// Legacy & Route Variant Compatibility
// -------------------------------------------------------------

/**
 * Maps legacy variants ('basic', 'mixed', 'speed') to challenges for route compatibility.
 */
export function generateQuickFireMathChallenge(variant: MathVariant): QuickFireMathChallenge {
  const levelMap: Record<MathVariant, number> = {
    basic: 2,
    mixed: 5,
    speed: 8,
  };
  const btb = generateBurstTheBubbleChallenge(levelMap[variant] || 2);
  return {
    variant,
    expressions: btb.bubbles.map((b) => ({
      id: b.id,
      expression: b.expression,
      value: b.value,
    })),
    timeLimit: 15,
  };
}

export function validateQuickFireMathChallenge(challenge: QuickFireMathChallenge): boolean {
  if (!challenge || !challenge.variant || !Array.isArray(challenge.expressions)) {
    return false;
  }
  const values = new Set<number>();
  const exprs = new Set<string>();
  for (const item of challenge.expressions) {
    if (!item.id || !item.expression || typeof item.value !== 'number' || isNaN(item.value)) {
      return false;
    }
    const evaluated = evaluateMathExpression(item.expression);
    if (evaluated !== item.value || values.has(item.value) || exprs.has(item.expression)) {
      return false;
    }
    values.add(item.value);
    exprs.add(item.expression);
  }
  return true;
}

export function fingerprintQuickFireMathChallenge(challenge: QuickFireMathChallenge): string {
  const sorted = [...challenge.expressions].sort((a, b) => a.value - b.value);
  const itemsStr = sorted.map((item) => `${item.expression}=${item.value}`).join(';');
  return `QFM_${challenge.variant}_[${itemsStr}]`;
}
