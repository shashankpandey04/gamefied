'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Trophy, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { GameMeta } from '@/lib/accenture/config/games';
import { getPersonalBest, GameScoreRecord } from '@/lib/accenture/engine/score-history';

interface VariantSelectorProps {
  game: GameMeta;
}

export function VariantSelector({ game }: VariantSelectorProps) {
  const [personalBests] = useState<Record<string, GameScoreRecord | null>>(() => {
    const bests: Record<string, GameScoreRecord | null> = {};
    for (const v of game.variants) {
      bests[v.id] = getPersonalBest(game.id, v.id);
    }
    return bests;
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl px-6 py-12 lg:px-10 flex-col gap-8">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 border border-[#35352F] bg-[#191916] p-8 lg:p-10">
        <div>
          <Link
            href="/accenture/practice"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#858573] hover:text-[#C5A875] transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Disciplines</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#F3EFE6] sm:text-4xl">
              {game.title}
            </h1>
            <span className="border border-[#C5A875]/40 bg-[#C5A875]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#C5A875]">
              {game.skillCategory}
            </span>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-[#A7A49A] max-w-2xl font-light leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#35352F] pt-4">
          {game.cognitiveFocus.map((f) => (
            <span
              key={f}
              className="border border-[#35352F] bg-[#151512] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#858573]"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Variant Selection Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {game.variants.map((v, index) => {
          const pb = personalBests[v.id];

          return (
            <div
              key={v.id}
              className="group flex flex-col justify-between border border-[#35352F] bg-[#191916] p-6 transition-all hover:border-[#C5A875]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#35352F] pb-3">
                  <span className="font-mono text-xs font-bold text-[#C5A875]">
                    0{index + 1}
                  </span>
                  {v.badge && (
                    <span className="border border-[#35352F] bg-[#151512] px-2 py-0.5 font-mono text-[10px] text-[#A7A49A]">
                      {v.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold uppercase tracking-tight text-[#F3EFE6] group-hover:text-[#C5A875] transition-colors">
                  {v.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A7A49A] font-light min-h-[36px]">
                  {v.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#35352F] pt-3 text-[11px] font-mono text-[#858573]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#C5A875]" />
                    <span>{v.timeLimit}s limit</span>
                  </div>

                  {pb && (
                    <div className="flex items-center gap-1 text-[#C5A875]">
                      <Trophy className="h-3.5 w-3.5 text-[#C5A875]" />
                      <span>{pb.timeSpentSeconds}s ({pb.score} pts)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href={`/accenture/practice/${game.slug}/${v.id}`}
                  className="flex w-full items-center justify-between bg-[#151512] border border-[#35352F] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512] hover:border-[#C5A875]"
                >
                  <span>Launch Trial</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
