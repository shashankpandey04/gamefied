'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Trophy } from 'lucide-react';
import { GameTimer } from './GameTimer';

interface GameHeaderProps {
  gameTitle: string;
  variantName: string;
  backUrl: string;
  timeRemaining: number;
  totalTime: number;
  phase?: 'memorize' | 'play';
  mistakes?: number;
  maxMistakes?: number;
  personalBestTime?: number | null;
}

export function GameHeader({
  gameTitle,
  variantName,
  backUrl,
  timeRemaining,
  totalTime,
  phase = 'play',
  mistakes,
  maxMistakes,
  personalBestTime,
}: GameHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border border-[#35352F] bg-[#191916] p-4 sm:flex-row sm:items-center sm:justify-between text-[#F3EFE6]">
      {/* Left: Exit button, game title and variant */}
      <div className="flex items-center gap-3">
        <Link
          href={backUrl}
          className="inline-flex h-8 w-8 items-center justify-center border border-[#35352F] bg-[#151512] text-[#A7A49A] transition-colors hover:border-[#C5A875] hover:text-[#C5A875]"
          title="Exit to variants"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold uppercase tracking-tight text-[#F3EFE6]">{gameTitle}</h1>
            <span className="border border-[#C5A875]/40 bg-[#C5A875]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#C5A875]">
              {variantName}
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#858573] uppercase tracking-wider">Cognitive Performance Trial</p>
        </div>
      </div>

      {/* Right: Stats, Mistakes, Personal Best & Timer */}
      <div className="flex flex-wrap items-center gap-3">
        {typeof personalBestTime === 'number' && personalBestTime > 0 && (
          <div className="hidden items-center gap-1.5 font-mono text-xs text-[#C5A875] md:flex">
            <Trophy className="h-3.5 w-3.5 text-[#C5A875]" />
            <span>RECORD: {personalBestTime}s</span>
          </div>
        )}

        {typeof mistakes === 'number' && (
          <div
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-xs ${
              mistakes > 0
                ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                : 'border-[#35352F] bg-[#151512] text-[#858573]'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>
              ERR: <strong className="font-semibold text-[#F3EFE6]">{mistakes}</strong>
              {typeof maxMistakes === 'number' && ` / ${maxMistakes}`}
            </span>
          </div>
        )}

        <GameTimer timeRemaining={timeRemaining} totalTime={totalTime} phase={phase} />
      </div>
    </div>
  );
}
