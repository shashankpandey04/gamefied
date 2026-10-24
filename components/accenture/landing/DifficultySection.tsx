'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Zap } from 'lucide-react';

export function DifficultySection() {
  const [activeTierIndex, setActiveTierIndex] = useState(0);

  const tiers = [
    {
      id: 'foundation',
      name: 'Foundation',
      levelCode: 'TIER 01',
      description: 'Acclimatize to mechanics with wider time buffers and smaller spatial matrices.',
      challenges: [
        { game: 'Memory Maze', variant: 'Easy (5×5)', href: '/accenture/practice/memory-maze/easy', time: '45s' },
        { game: 'Burst the Bubble', variant: 'Foundation', href: '/accenture/practice/quick-fire-math', time: '15s' },
        { game: 'Path Finder', variant: 'Beginner (3×3)', href: '/accenture/practice/path-finder/beginner', time: '60s' },
      ],
      cognitiveMetric: 'Familiarity & Accuracy Calibration',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      levelCode: 'TIER 02',
      description: 'Standard assessment pacing with introduced branchings and multi-operator evaluations.',
      challenges: [
        { game: 'Memory Maze', variant: 'Classic (6×6)', href: '/accenture/practice/memory-maze/classic', time: '40s' },
        { game: 'Path Finder', variant: 'Intermediate (4×4)', href: '/accenture/practice/path-finder/intermediate', time: '50s' },
        { game: 'Burst the Bubble', variant: 'Foundation', href: '/accenture/practice/quick-fire-math', time: '15s' },
      ],
      cognitiveMetric: 'Executive Function Under Moderate Pressure',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      levelCode: 'TIER 03',
      description: 'Reduced inspection windows, complex division, and multi-turn conduit networks.',
      challenges: [
        { game: 'Memory Maze', variant: 'Advanced (7×7)', href: '/accenture/practice/memory-maze/advanced', time: '35s' },
        { game: 'Burst the Bubble', variant: 'Mixed Operations', href: '/accenture/practice/quick-fire-math', time: '15s' },
        { game: 'Path Finder', variant: 'Advanced (5×5)', href: '/accenture/practice/path-finder/advanced', time: '45s' },
      ],
      cognitiveMetric: 'High-Stress Quantitative & Visuospatial Agility',
    },
    {
      id: 'expert',
      name: 'Expert',
      levelCode: 'TIER 04',
      description: 'Peak cognitive load. 4-second memorization, compound expressions, and labyrinth traps.',
      challenges: [
        { game: 'Memory Maze', variant: 'Expert (8×8)', href: '/accenture/practice/memory-maze/expert', time: '30s' },
        { game: 'Burst the Bubble', variant: 'Compound Speed', href: '/accenture/practice/quick-fire-math', time: '15s' },
        { game: 'Path Finder', variant: 'Expert (5×5)', href: '/accenture/practice/path-finder/expert', time: '40s' },
      ],
      cognitiveMetric: 'Mastery & Instant Recall Velocity',
    },
  ];

  const currentTier = tiers[activeTierIndex];

  return (
    <section className="w-full bg-[#F3EFE6] py-20 lg:py-28 text-[#151512]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D8D2C7] pb-8">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C5A875]">
              Progression Curve
            </span>
            <h2 className="mt-2 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-[#151512]">
              Precision takes{' '}
              <span className="font-editorial italic font-normal text-[#858573] lowercase">
                practice
              </span>
              .
            </h2>
          </div>
          <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm text-[#858573] leading-relaxed font-light">
            Cognitive capacity adapts through structured overload. Advance from Foundation through Expert tiers
            as error rates fall below 5%.
          </p>
        </div>

        {/* Horizontal Tier Progression Tabs */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiers.map((t, idx) => {
            const isActive = activeTierIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTierIndex(idx)}
                className={`flex flex-col text-left p-5 border transition-all ${
                  isActive
                    ? 'border-[#151512] bg-[#EDE8DE] shadow-sm'
                    : 'border-[#D8D2C7] bg-[#F3EFE6] hover:border-[#858573]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-[#C5A875]' : 'text-[#858573]'}`}>
                    {t.levelCode}
                  </span>
                  {isActive && <div className="h-2 w-2 rounded-full bg-[#C5A875]" />}
                </div>
                <span className="mt-3 text-lg font-bold uppercase tracking-tight text-[#151512]">
                  {t.name}
                </span>
                <span className="mt-1 text-[11px] text-[#858573] line-clamp-1">
                  {t.challenges.length} Disciplines
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Interactive Detail Display */}
        <div className="mt-8 border border-[#D8D2C7] bg-[#EDE8DE] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#D8D2C7] pb-4 gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A875]">
                {currentTier.levelCode} • {currentTier.name.toUpperCase()} SPECIFICATION
              </span>
              <p className="mt-1 text-xs sm:text-sm text-[#858573] font-light max-w-xl">
                {currentTier.description}
              </p>
            </div>
            <div className="flex items-center gap-2 border border-[#D8D2C7] bg-[#F3EFE6] px-3.5 py-1.5 font-mono text-xs text-[#151512]">
              <Zap className="h-3.5 w-3.5 text-[#C5A875]" />
              <span>{currentTier.cognitiveMetric}</span>
            </div>
          </div>

          {/* Functional Challenge Cards Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {currentTier.challenges.map((ch, i) => (
              <div
                key={i}
                className="flex flex-col justify-between border border-[#D8D2C7] bg-[#F3EFE6] p-5 transition-all hover:border-[#151512]"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#858573]">
                    <span>DISCIPLINE {i + 1}</span>
                    <span className="text-[#C5A875]">{ch.time} LIMIT</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold uppercase tracking-tight text-[#151512]">
                    {ch.game}
                  </h4>
                  <p className="mt-1 text-xs text-[#858573]">
                    {ch.variant}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D8D2C7]">
                  <Link
                    href={ch.href}
                    className="inline-flex w-full items-center justify-between bg-[#151512] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512]"
                  >
                    <span>Launch Trial</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
