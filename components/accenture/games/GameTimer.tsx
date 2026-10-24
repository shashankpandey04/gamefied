'use client';

import React from 'react';
import { Clock, Eye } from 'lucide-react';

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
  phase?: 'memorize' | 'play';
  className?: string;
}

export function GameTimer({ timeRemaining, totalTime, phase = 'play', className = '' }: GameTimerProps) {
  const isUrgent = phase === 'play' && timeRemaining <= 10;
  const isMemorize = phase === 'memorize';

  const minutes = Math.floor(Math.max(0, timeRemaining) / 60);
  const seconds = Math.max(0, timeRemaining) % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const percentage = totalTime > 0 ? Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100)) : 0;

  return (
    <div
      className={`inline-flex items-center gap-2.5 border px-3 py-1.5 transition-colors ${
        isMemorize
          ? 'border-[#C5A875]/60 bg-[#C5A875]/10 text-[#C5A875]'
          : isUrgent
          ? 'border-red-500/60 bg-red-950/30 text-red-400 animate-pulse'
          : 'border-[#35352F] bg-[#151512] text-[#F3EFE6]'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {isMemorize ? (
          <Eye className="h-4 w-4 text-[#C5A875] shrink-0" />
        ) : (
          <Clock className={`h-4 w-4 shrink-0 ${isUrgent ? 'text-red-400' : 'text-[#858573]'}`} />
        )}
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#858573]">
          {isMemorize ? 'MEMORIZE' : 'REMAINING'}
        </span>
      </div>

      <span className="font-mono text-sm font-bold tabular-nums text-[#F3EFE6]">
        {formattedTime}
      </span>

      {/* Mini Progress Bar */}
      <div className="h-1 w-12 overflow-hidden bg-[#35352F]">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            isMemorize
              ? 'bg-[#C5A875]'
              : isUrgent
              ? 'bg-red-400'
              : 'bg-[#C5A875]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
