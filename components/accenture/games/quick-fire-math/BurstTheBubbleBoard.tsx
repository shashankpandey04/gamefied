'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  LogOut,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';

import {
  BubbleItem,
  BurstTheBubbleChallenge,
  generateBurstTheBubbleChallenge,
  validateBurstTheBubbleChallenge,
  fingerprintBurstTheBubbleChallenge,
  getNextDifficulty,
} from '@/lib/accenture/games/quick-fire-math';
import { selectChallenge } from '@/lib/accenture/engine/challenge-selector';

interface BurstTheBubbleBoardProps {
  initialDifficulty?: number;
}

interface SessionStats {
  score: number;
  challengesCompleted: number;
  challengesAttempted: number;
  mistakes: number;
  bestStreak: number;
  highestDifficulty: number;
  totalTimeSeconds: number;
}

interface StoredBest {
  score: number;
  bestStreak: number;
  challengesCompleted: number;
  highestDifficulty: number;
  completedAt: string;
}

const STORAGE_KEY = 'nerdmocks_accenture_best_burst_the_bubble';

function getStoredPersonalBest(): StoredBest | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredBest;
  } catch {
    return null;
  }
}

function savePersonalBestStats(stats: SessionStats): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    const current = getStoredPersonalBest();
    const isNew = !current || stats.score > current.score;
    if (isNew) {
      const record: StoredBest = {
        score: stats.score,
        bestStreak: stats.bestStreak,
        challengesCompleted: stats.challengesCompleted,
        highestDifficulty: stats.highestDifficulty,
        completedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function createAdaptiveChallenge(difficulty: number): BurstTheBubbleChallenge {
  const result = selectChallenge({
    gameId: 'burst-the-bubble',
    variant: `lvl_${Math.round(difficulty)}`,
    generator: () => generateBurstTheBubbleChallenge(difficulty),
    validator: validateBurstTheBubbleChallenge,
    fingerprinter: fingerprintBurstTheBubbleChallenge,
    autoRecord: true,
  });
  return result.challenge;
}

export function BurstTheBubbleBoard({ initialDifficulty = 1 }: BurstTheBubbleBoardProps) {
  // Game Phases: 'idle' (instructions) | 'active' (continuous gameplay) | 'summary' (assessment review)
  const [phase, setPhase] = useState<'idle' | 'active' | 'summary'>('idle');

  // Difficulty & Challenge State
  const [difficulty, setDifficulty] = useState<number>(initialDifficulty);
  const [challenge, setChallenge] = useState<BurstTheBubbleChallenge | null>(null);
  const [burstIds, setBurstIds] = useState<string[]>([]);
  const [errorBubbleId, setErrorBubbleId] = useState<string | null>(null);

  // HUD & Score State
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [challengesCompleted, setChallengesCompleted] = useState<number>(0);
  const [challengesAttempted, setChallengesAttempted] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [highestDifficultyReached, setHighestDifficultyReached] = useState<number>(initialDifficulty);

  // Timer State (15s per challenge)
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [sessionDuration, setSessionDuration] = useState<number>(0);

  // Feedback State
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error' | 'timeout' | 'info';
    message: string;
  } | null>(null);

  // Personal Best
  const [personalBest, setPersonalBest] = useState<StoredBest | null>(() => getStoredPersonalBest());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Refs for timers & transition guard
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionLockRef = useRef<boolean>(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      clearSessionTimer();
    };
  }, [clearTimer, clearSessionTimer]);

  // Session duration tracker
  useEffect(() => {
    if (phase === 'active') {
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearSessionTimer();
    }
    return () => clearSessionTimer();
  }, [phase, clearSessionTimer]);

  // Start Assessment from instruction screen
  const handleStartAssessment = useCallback(() => {
    const freshChallenge = createAdaptiveChallenge(difficulty);
    setChallenge(freshChallenge);
    setBurstIds([]);
    setErrorBubbleId(null);
    setFeedbackBanner(null);
    setTimeRemaining(15);
    setPhase('active');
    transitionLockRef.current = false;
  }, [difficulty]);

  // Generate and advance to next challenge smoothly
  const advanceToNextChallenge = useCallback(
    (newDiff: number) => {
      clearTimer();
      setDifficulty(newDiff);
      setHighestDifficultyReached((prev) => Math.max(prev, newDiff));

      const nextChallenge = createAdaptiveChallenge(newDiff);
      setChallenge(nextChallenge);
      setBurstIds([]);
      setErrorBubbleId(null);
      setFeedbackBanner(null);
      setTimeRemaining(15);
      transitionLockRef.current = false;
    },
    [clearTimer]
  );

  // Handle Timeout
  const handleTimeout = useCallback(() => {
    setFeedbackBanner({
      type: 'timeout',
      message: "Time's up — next challenge.",
    });

    setStreak(0);
    setMistakes((prev) => prev + 1);
    setChallengesAttempted((prev) => prev + 1);

    const nextDiff = getNextDifficulty(difficulty, 'timeout', 0);

    setTimeout(() => {
      advanceToNextChallenge(nextDiff);
    }, 750);
  }, [difficulty, advanceToNextChallenge]);

  // Challenge countdown timer loop (15s)
  useEffect(() => {
    if (phase !== 'active' || !challenge) return;

    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          // Timeout occurred!
          if (!transitionLockRef.current) {
            transitionLockRef.current = true;
            handleTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, challenge, clearTimer, handleTimeout]);

  // Handle Bubble Selection
  const handleBubbleClick = useCallback(
    (bubble: BubbleItem) => {
      if (phase !== 'active' || !challenge || transitionLockRef.current) return;
      if (burstIds.includes(bubble.id)) return; // Already popped

      // Find the unburst bubble with the smallest numerical result
      const unburstBubbles = challenge.bubbles.filter((b) => !burstIds.includes(b.id));
      if (unburstBubbles.length === 0) return;

      const smallestRemaining = unburstBubbles.reduce(
        (min, b) => (b.value < min.value ? b : min),
        unburstBubbles[0]
      );

      // Check if clicked bubble has the smallest remaining value
      if (bubble.value === smallestRemaining.value) {
        // --- CORRECT SELECTION ---
        const nextBurstIds = [...burstIds, bubble.id];
        setBurstIds(nextBurstIds);
        setScore((prev) => prev + 10); // Immediate feedback points

        // Check if all bubbles in the current challenge have been burst
        if (nextBurstIds.length === challenge.bubbles.length) {
          transitionLockRef.current = true;
          clearTimer();

          // Calculate challenge completion rewards
          const basePoints = 100 * Math.round(difficulty);
          const speedBonus = Math.max(0, timeRemaining * 15);
          const newStreak = streak + 1;
          const streakBonus = newStreak * 25;
          const challengePoints = basePoints + speedBonus + streakBonus;

          setScore((prev) => prev + challengePoints);
          setStreak(newStreak);
          setBestStreak((prev) => Math.max(prev, newStreak));
          setChallengesCompleted((prev) => prev + 1);
          setChallengesAttempted((prev) => prev + 1);

          const nextDiff = getNextDifficulty(difficulty, 'completed', newStreak);

          setFeedbackBanner({
            type: 'success',
            message: `Challenge Cleared! +${challengePoints} pts`,
          });

          setTimeout(() => {
            advanceToNextChallenge(nextDiff);
          }, 600);
        }
      } else {
        // --- INCORRECT SELECTION ---
        transitionLockRef.current = true;
        clearTimer();
        setErrorBubbleId(bubble.id);

        setStreak(0);
        setMistakes((prev) => prev + 1);
        setChallengesAttempted((prev) => prev + 1);

        const nextDiff = getNextDifficulty(difficulty, 'wrong', 0);

        setFeedbackBanner({
          type: 'error',
          message: 'Wrong order — next challenge.',
        });

        setTimeout(() => {
          advanceToNextChallenge(nextDiff);
        }, 800);
      }
    },
    [phase, challenge, burstIds, difficulty, timeRemaining, streak, clearTimer, advanceToNextChallenge]
  );

  // Keyboard shortcut listener for accessible selection: keys '1'..'6' and 'A'..'F'
  useEffect(() => {
    if (phase !== 'active' || !challenge || transitionLockRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or holding modifier keys
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();

      // Check number keys 1..N
      const num = parseInt(key, 10);
      if (!isNaN(num) && num >= 1 && num <= challenge.bubbles.length) {
        const target = challenge.bubbles[num - 1];
        if (target && !burstIds.includes(target.id)) {
          handleBubbleClick(target);
          return;
        }
      }

      // Check letter keys A..Z
      const letterIndex = key.charCodeAt(0) - 65;
      if (letterIndex >= 0 && letterIndex < challenge.bubbles.length) {
        const target = challenge.bubbles[letterIndex];
        if (target && !burstIds.includes(target.id)) {
          handleBubbleClick(target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, challenge, burstIds, handleBubbleClick]);

  // End Assessment and view Session Summary
  const handleEndAssessment = useCallback(() => {
    clearTimer();
    clearSessionTimer();

    const stats: SessionStats = {
      score,
      challengesCompleted,
      challengesAttempted,
      mistakes,
      bestStreak,
      highestDifficulty: highestDifficultyReached,
      totalTimeSeconds: sessionDuration,
    };

    const isNew = savePersonalBestStats(stats);
    setIsNewRecord(isNew);
    if (isNew) {
      setPersonalBest(getStoredPersonalBest());
    }

    setPhase('summary');
  }, [
    score,
    challengesCompleted,
    challengesAttempted,
    mistakes,
    bestStreak,
    highestDifficultyReached,
    sessionDuration,
    clearTimer,
    clearSessionTimer,
  ]);

  // Restart / Continue Practicing
  const handleContinuePracticing = useCallback(() => {
    const freshChallenge = createAdaptiveChallenge(difficulty);
    setChallenge(freshChallenge);
    setBurstIds([]);
    setErrorBubbleId(null);
    setFeedbackBanner(null);
    setTimeRemaining(15);
    setPhase('active');
    transitionLockRef.current = false;
  }, [difficulty]);

  // Reset entire session
  const handleResetSession = useCallback(() => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setChallengesCompleted(0);
    setChallengesAttempted(0);
    setMistakes(0);
    setSessionDuration(0);
    setDifficulty(initialDifficulty);
    setHighestDifficultyReached(initialDifficulty);
    handleStartAssessment();
  }, [initialDifficulty, handleStartAssessment]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 text-[#F3EFE6] sm:px-6 md:py-12">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header with Architectural Styling                           */}
      {/* ------------------------------------------------------------- */}
      <header className="flex flex-col gap-4 border border-[#35352F] bg-[#191916] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/accenture/practice"
            className="inline-flex h-8 w-8 items-center justify-center border border-[#35352F] bg-[#151512] text-[#A7A49A] transition-colors hover:border-[#C5A875] hover:text-[#C5A875]"
            title="Return to Practice Hub"
          >
            <LogOut className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[#858573] uppercase">NERDMOCKS</span>
              <span className="text-[#35352F]">•</span>
              <h1 className="text-base font-bold uppercase tracking-tight text-[#F3EFE6]">BURST THE BUBBLE</h1>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#C5A875]">
              COGNITIVE ASSESSMENT • NUMERICAL SPEED
            </p>
          </div>
        </div>

        {/* Phase Header Controls */}
        <div className="flex items-center gap-3">
          {phase === 'active' && (
            <button
              type="button"
              onClick={handleEndAssessment}
              className="border border-[#35352F] bg-[#151512] px-3 py-1.5 font-mono text-xs text-[#A7A49A] transition-colors hover:border-[#C5A875] hover:text-[#C5A875]"
            >
              End Assessment
            </button>
          )}

          {personalBest && (
            <div className="hidden items-center gap-1.5 border border-[#35352F] bg-[#151512] px-2.5 py-1 font-mono text-xs text-[#C5A875] sm:flex">
              <Trophy className="h-3.5 w-3.5" />
              <span>RECORD: {personalBest.score.toLocaleString()}</span>
            </div>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. PHASE: Idle (Instruction & Readiness Screen)                */}
      {/* ------------------------------------------------------------- */}
      {phase === 'idle' && (
        <section className="flex flex-col gap-6 border border-[#35352F] bg-[#191916] p-6 md:p-10">
          <div className="border-b border-[#35352F] pb-6">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C5A875]">
              Assessment Protocol • Rapid Numerical Reasoning
            </span>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-[#F3EFE6] sm:text-3xl">
              Burst the Bubble
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#A7A49A]">
              Evaluate mathematical expressions rapidly and burst bubbles in strictly ascending order—from the smallest
              numerical result to the largest—under continuous 15-second time pressure.
            </p>
          </div>

          {/* Interactive Protocol Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3 border border-[#35352F] bg-[#151512] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A875]">
                <Target className="h-4 w-4" />
                <span>Core Rules</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-[#A7A49A]">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#C5A875]">01.</span>
                  <span>Calculate the exact mathematical value of each expression.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#C5A875]">02.</span>
                  <span>
                    Select the bubble with the <strong>smallest remaining value</strong> first, then continue in
                    ascending numerical order.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#C5A875]">03.</span>
                  <span>
                    Each challenge carries a strict <strong>15-second countdown</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-[#C5A875]">04.</span>
                  <span>
                    Mistakes or timeouts advance immediately to a new challenge. Continuous flow—no course levels.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 border border-[#35352F] bg-[#151512] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A875]">
                <Sparkles className="h-4 w-4" />
                <span>Example Walkthrough</span>
              </div>

              {/* Visual Mini Board Preview */}
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="border border-[#35352F] bg-[#191916] p-2 text-center">
                  <span className="text-[10px] text-[#858573]">Bubble A</span>
                  <div className="font-bold text-[#F3EFE6]">18 ÷ 3</div>
                  <div className="text-[10px] text-[#C5A875]">= 6 (1st)</div>
                </div>
                <div className="border border-[#35352F] bg-[#191916] p-2 text-center">
                  <span className="text-[10px] text-[#858573]">Bubble B</span>
                  <div className="font-bold text-[#F3EFE6]">4 + 5</div>
                  <div className="text-[10px] text-[#C5A875]">= 9 (2nd)</div>
                </div>
                <div className="border border-[#35352F] bg-[#191916] p-2 text-center">
                  <span className="text-[10px] text-[#858573]">Bubble C</span>
                  <div className="font-bold text-[#F3EFE6]">3 × 4</div>
                  <div className="text-[10px] text-[#C5A875]">= 12 (3rd)</div>
                </div>
                <div className="border border-[#35352F] bg-[#191916] p-2 text-center">
                  <span className="text-[10px] text-[#858573]">Bubble D</span>
                  <div className="font-bold text-[#F3EFE6]">20 − 5</div>
                  <div className="text-[10px] text-[#C5A875]">= 15 (4th)</div>
                </div>
              </div>
              <div className="text-center font-mono text-[11px] text-[#858573]">
                Sequence: <span className="font-bold text-[#F3EFE6]">A → B → C → D</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono text-xs text-[#858573]">
              Tip: You can use number keys <span className="text-[#C5A875]">1, 2, 3...</span> or letters{' '}
              <span className="text-[#C5A875]">A, B, C...</span> on your keyboard.
            </div>

            <button
              type="button"
              onClick={handleStartAssessment}
              className="inline-flex items-center justify-center gap-2 bg-[#C5A875] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#151512] transition-transform hover:bg-[#b8975e] active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Assessment</span>
            </button>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PHASE: Active Continuous Assessment Board                  */}
      {/* ------------------------------------------------------------- */}
      {phase === 'active' && challenge && (
        <section className="flex flex-col gap-5">
          {/* Assessment HUD */}
          <div className="grid grid-cols-2 gap-2 border border-[#35352F] bg-[#191916] p-3 text-xs sm:grid-cols-5 sm:gap-3 sm:p-4">
            {/* 15s Timer Progress */}
            <div className="col-span-2 flex flex-col justify-center border border-[#35352F] bg-[#151512] p-2.5 sm:col-span-1">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#858573]">
                <span>Countdown</span>
                <span
                  className={`font-bold ${
                    timeRemaining <= 3
                      ? 'animate-pulse text-red-400'
                      : timeRemaining <= 6
                      ? 'text-amber-400'
                      : 'text-[#C5A875]'
                  }`}
                >
                  {timeRemaining}s
                </span>
              </div>
              {/* Linear Progress Bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#191916]">
                <div
                  className={`h-full transition-all duration-1000 ease-linear ${
                    timeRemaining <= 3 ? 'bg-red-500' : timeRemaining <= 6 ? 'bg-amber-400' : 'bg-[#C5A875]'
                  }`}
                  style={{ width: `${(timeRemaining / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col border border-[#35352F] bg-[#151512] p-2.5">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Total Score</span>
              <span className="mt-1 font-mono text-base font-bold text-[#F3EFE6]">{score.toLocaleString()}</span>
            </div>

            {/* Streak */}
            <div className="flex flex-col border border-[#35352F] bg-[#151512] p-2.5">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Current Streak</span>
              <div className="mt-1 flex items-center gap-1 font-mono text-base font-bold text-[#C5A875]">
                <Flame className={`h-4 w-4 ${streak >= 3 ? 'animate-bounce text-amber-400' : ''}`} />
                <span>{streak}</span>
              </div>
            </div>

            {/* Solved */}
            <div className="flex flex-col border border-[#35352F] bg-[#151512] p-2.5">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Solved</span>
              <span className="mt-1 font-mono text-base font-bold text-[#F3EFE6]">{challengesCompleted}</span>
            </div>

            {/* Internal Adaptive Difficulty Indicator (Display Only, Non-selectable) */}
            <div className="col-span-2 flex flex-col border border-[#35352F] bg-[#151512] p-2.5 sm:col-span-1">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Adaptive Level</span>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#C5A875]">
                <Zap className="h-3.5 w-3.5" />
                <span>LVL {difficulty.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Feedback Toast / Status Bar */}
          <div className="h-8">
            <AnimatePresence mode="wait">
              {feedbackBanner ? (
                <motion.div
                  key={feedbackBanner.message}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`flex h-8 items-center justify-center border font-mono text-xs uppercase tracking-wider ${
                    feedbackBanner.type === 'success'
                      ? 'border-[#C5A875] bg-[#C5A875]/15 text-[#C5A875]'
                      : feedbackBanner.type === 'error'
                      ? 'border-red-500/70 bg-red-950/40 text-red-300'
                      : feedbackBanner.type === 'timeout'
                      ? 'border-amber-500/70 bg-amber-950/40 text-amber-300'
                      : 'border-[#35352F] bg-[#151512] text-[#A7A49A]'
                  }`}
                >
                  {feedbackBanner.message}
                </motion.div>
              ) : (
                <div className="flex h-8 items-center justify-between border border-[#35352F]/40 bg-[#151512]/40 px-3 font-mono text-[11px] text-[#858573]">
                  <span>Burst bubbles in ASCENDING order (Smallest → Largest)</span>
                  <span className="text-[#C5A875]">
                    Remaining: {challenge.bubbles.length - burstIds.length} / {challenge.bubbles.length}
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* The Bubbles Field */}
          <div className="relative flex min-h-[360px] flex-col items-center justify-center border border-[#35352F] bg-[#151512] p-6 sm:p-10">
            {/* Background Subtle Grid Texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #F3EFE6 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Bubble Grid Container */}
            <div
              className={`relative z-10 grid w-full max-w-2xl gap-4 sm:gap-6 ${
                challenge.bubbles.length <= 4
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : challenge.bubbles.length === 5
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {challenge.bubbles.map((bubble, index) => {
                const isBurst = burstIds.includes(bubble.id);
                const isError = errorBubbleId === bubble.id;

                return (
                  <div key={bubble.id} className="flex flex-col items-center justify-center">
                    <AnimatePresence>
                      {!isBurst ? (
                        <motion.button
                          type="button"
                          onClick={() => handleBubbleClick(bubble)}
                          aria-label={`Bubble ${bubble.label}: ${bubble.expression}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            x: isError ? [0, -8, 8, -6, 6, 0] : 0,
                          }}
                          exit={{
                            scale: 1.25,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`group relative flex h-28 w-28 flex-col items-center justify-center rounded-full border shadow-lg transition-colors focus:outline-none sm:h-32 sm:w-32 ${
                            isError
                              ? 'border-red-500 bg-red-950/80 text-red-200 ring-2 ring-red-500'
                              : 'border-[#D8D2C7] bg-[#F3EFE6] text-[#151512] hover:border-[#C5A875] hover:ring-2 hover:ring-[#C5A875] focus:ring-2 focus:ring-[#C5A875]'
                          }`}
                        >
                          {/* Top Badge: Letter Label (A, B, C...) & Keyboard Hint */}
                          <div className="absolute top-2.5 flex items-center gap-1 font-mono text-[10px] font-semibold text-[#858573] group-hover:text-[#C5A875]">
                            <span>{bubble.label}</span>
                            <span className="hidden opacity-60 sm:inline">[{index + 1}]</span>
                          </div>

                          {/* Center: Large Mathematical Expression */}
                          <span className="px-2 text-center font-mono text-base font-extrabold tracking-tight text-[#151512] sm:text-lg">
                            {bubble.expression}
                          </span>

                          {/* Subtle Champagne Accent Dot */}
                          <div className="absolute bottom-2.5 h-1 w-1 rounded-full bg-[#C5A875] opacity-60 group-hover:opacity-100" />
                        </motion.button>
                      ) : (
                        /* Burst Placeholder Ring */
                        <motion.div
                          initial={{ opacity: 0.8, scale: 0.9 }}
                          animate={{ opacity: 0.3, scale: 1 }}
                          className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-dashed border-[#C5A875]/40 font-mono text-[11px] text-[#C5A875] sm:h-32 sm:w-32"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="mt-1 text-[9px] uppercase tracking-wider">Burst</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. PHASE: Assessment Summary Screen (On Exit / Completion)    */}
      {/* ------------------------------------------------------------- */}
      {phase === 'summary' && (
        <section className="flex flex-col gap-6 border border-[#35352F] bg-[#191916] p-6 md:p-10">
          <div className="border-b border-[#35352F] pb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C5A875]">
                  Performance Debrief
                </span>
                <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[#F3EFE6] sm:text-3xl">
                  Assessment Summary
                </h2>
              </div>
              {isNewRecord && (
                <div className="flex items-center gap-2 border border-[#C5A875] bg-[#C5A875]/15 px-3 py-1 font-mono text-xs font-bold text-[#C5A875]">
                  <Trophy className="h-4 w-4" />
                  <span>NEW RECORD!</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Final Score</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#F3EFE6] sm:text-3xl">
                {score.toLocaleString()}
              </p>
            </div>

            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Challenges Solved</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#C5A875] sm:text-3xl">
                {challengesCompleted} <span className="text-xs text-[#858573]">/ {challengesAttempted}</span>
              </p>
            </div>

            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Accuracy Rate</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#F3EFE6] sm:text-3xl">
                {challengesAttempted > 0
                  ? `${Math.round((challengesCompleted / challengesAttempted) * 100)}%`
                  : '0%'}
              </p>
            </div>

            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Best Streak</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#C5A875] sm:text-3xl">{bestStreak}</p>
            </div>

            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Peak Difficulty</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#F3EFE6] sm:text-3xl">
                LVL {highestDifficultyReached.toFixed(1)}
              </p>
            </div>

            <div className="border border-[#35352F] bg-[#151512] p-4">
              <span className="font-mono text-[10px] uppercase text-[#858573]">Assessment Time</span>
              <p className="mt-1 font-mono text-2xl font-bold text-[#F3EFE6] sm:text-3xl">
                {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleResetSession}
              className="inline-flex items-center justify-center gap-2 border border-[#35352F] bg-[#151512] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#A7A49A] transition-colors hover:border-[#C5A875] hover:text-[#C5A875]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart Fresh</span>
            </button>

            <button
              type="button"
              onClick={handleContinuePracticing}
              className="inline-flex items-center justify-center gap-2 bg-[#C5A875] px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#151512] transition-transform hover:bg-[#b8975e] active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Continue Practicing</span>
            </button>

            <Link
              href="/accenture/practice"
              className="inline-flex items-center justify-center gap-2 border border-[#35352F] bg-[#151512] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#A7A49A] transition-colors hover:border-[#858573] hover:text-[#F3EFE6]"
            >
              <span>Exit to Hub</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
