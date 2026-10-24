import React from 'react';
import { ACCENTURE_GAMES } from '@/lib/accenture/config/games';
import { GameCard } from '@/components/accenture/practice/GameCard';

export const metadata = {
  title: 'All Disciplines — NerdMocks Cognitive Lab',
  description: 'Choose from Memory Maze, Quick-Fire Math, and Path Finder across twelve difficulty tiers.',
};

export default function PracticeHubPage() {
  const games = Object.values(ACCENTURE_GAMES);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 flex flex-col gap-10">
      {/* Header */}
      <div className="border border-[#35352F] bg-[#191916] p-8 lg:p-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C5A875]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C5A875]">
            Laboratory Matrix
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-[#F3EFE6] sm:text-4xl">
          Cognitive Assessment Disciplines
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#A7A49A] max-w-2xl font-light leading-relaxed">
          Select an assessment discipline. All challenges are procedurally generated in-browser with
          calibrated countdown timers, immediate error auditing, and local fingerprint history.
        </p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
