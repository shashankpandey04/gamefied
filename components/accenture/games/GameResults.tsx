'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ListOrdered,
  ArrowRight,
  Trophy,
  Clock,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface GameResultsProps {
  status: 'completed' | 'failed' | 'timeout';
  gameTitle: string;
  variantName: string;
  variantSlug?: string;
  gameSlug: string;
  score: number;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  mistakes: number;
  isNewPersonalBest?: boolean;
  onPlayAgain: () => void;
}

export function GameResults({
  status,
  gameTitle,
  variantName,
  gameSlug,
  score,
  timeSpentSeconds,
  timeLimitSeconds,
  mistakes,
  isNewPersonalBest = false,
  onPlayAgain,
}: GameResultsProps) {
  const isSuccess = status === 'completed';

  let summary = '';
  if (isSuccess) {
    if (mistakes === 0 && timeSpentSeconds <= timeLimitSeconds * 0.4) {
      summary = 'Flawless trial execution. Superior processing velocity with zero recorded collision errors.';
    } else if (mistakes === 0) {
      summary = 'Accurate assessment finished with absolute precision and no invalid moves.';
    } else if (timeSpentSeconds <= timeLimitSeconds * 0.5) {
      summary = 'Rapid completion time with minimal friction. Above average candidate benchmark.';
    } else {
      summary = 'Trial satisfied within allotted parameters. Consecutive drills will enhance reaction speed.';
    }
  } else if (status === 'timeout') {
    summary = 'Timer elapsed prior to final terminal registration. Focus on rapid initial path scanning.';
  } else {
    summary = 'Trial concluded due to threshold boundary limits or error accumulation.';
  }

  return (
    <div className="mx-auto w-full max-w-xl border border-[#35352F] bg-[#191916] p-7 md:p-9 text-[#F3EFE6]">
      {/* Status Icon & Header */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center border mb-4 ${
            isSuccess ? 'border-[#C5A875] bg-[#C5A875]/10 text-[#C5A875]' : 'border-red-500/60 bg-red-950/20 text-red-400'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#858573]">
          Trial Evaluation
        </span>
        <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[#F3EFE6]">
          {isSuccess ? 'Assessment Satisfied' : status === 'timeout' ? 'Timer Elapsed' : 'Trial Terminated'}
        </h2>
        <p className="mt-1 font-mono text-xs text-[#A7A49A]">
          {gameTitle} — <span className="text-[#C5A875]">{variantName}</span>
        </p>
      </div>

      {/* New Personal Best Banner */}
      {isNewPersonalBest && isSuccess && (
        <div className="mt-5 flex items-center justify-center gap-2 border border-[#C5A875]/60 bg-[#C5A875]/10 px-4 py-2 font-mono text-xs font-semibold text-[#C5A875]">
          <Trophy className="h-4 w-4" />
          <span>NEW PERSONAL BENCHMARK RECORDED</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {/* Score */}
        <div className="flex flex-col items-center border border-[#35352F] bg-[#151512] p-3 text-center">
          <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#858573]">
            <Award className="h-3 w-3 text-[#C5A875]" />
            <span>Score</span>
          </div>
          <span className="mt-1 font-mono text-xl font-bold text-[#F3EFE6]">{score}</span>
          <span className="font-mono text-[9px] text-[#858573]">PTS</span>
        </div>

        {/* Time Spent */}
        <div className="flex flex-col items-center border border-[#35352F] bg-[#151512] p-3 text-center">
          <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#858573]">
            <Clock className="h-3 w-3 text-[#C5A875]" />
            <span>Time</span>
          </div>
          <span className="mt-1 font-mono text-xl font-bold text-[#F3EFE6]">{timeSpentSeconds}s</span>
          <span className="font-mono text-[9px] text-[#858573]">OF {timeLimitSeconds}s</span>
        </div>

        {/* Mistakes */}
        <div className="flex flex-col items-center border border-[#35352F] bg-[#151512] p-3 text-center">
          <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#858573]">
            <AlertTriangle className="h-3 w-3 text-[#C5A875]" />
            <span>Mistakes</span>
          </div>
          <span className="mt-1 font-mono text-xl font-bold text-[#F3EFE6]">{mistakes}</span>
          <span className="font-mono text-[9px] text-[#858573]">ERRORS</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-5 border border-[#35352F] bg-[#151512] p-4 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A875]">Auditor Feedback:</span>
        <p className="mt-1.5 text-xs leading-relaxed text-[#A7A49A] font-light">{summary}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onPlayAgain}
          className="flex flex-1 items-center justify-center gap-2 bg-[#C5A875] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#151512] transition-colors hover:bg-[#b8975e]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Replay Trial</span>
        </button>

        <Link
          href={`/accenture/practice/${gameSlug}`}
          className="flex flex-1 items-center justify-center gap-2 border border-[#35352F] bg-[#151512] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-colors hover:border-[#C5A875] hover:text-[#C5A875]"
        >
          <ListOrdered className="h-3.5 w-3.5 text-[#858573]" />
          <span>Change Tier</span>
        </Link>

        <Link
          href="/accenture/practice"
          className="flex items-center justify-center gap-1.5 border border-[#35352F] bg-[#151512] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#858573] transition-colors hover:text-[#F3EFE6]"
          title="All Disciplines"
        >
          <span>All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
