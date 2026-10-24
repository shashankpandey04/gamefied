import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Key, DoorClosed } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#35352F] bg-[#151512] pt-12 pb-16 lg:pt-20 lg:pb-24 text-[#F3EFE6]">
      {/* Subtle Architectural Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F3EFE6 1px, transparent 1px), linear-gradient(to bottom, #F3EFE6 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="flex flex-col lg:col-span-7">
            {/* Category Descriptor */}
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A875]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C5A875]">
                Cognitive Performance Laboratory
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold uppercase tracking-tight text-[#F3EFE6] sm:text-6xl lg:text-7xl leading-[0.95]">
              Think Faster. <br />
              <span className="font-editorial italic font-normal text-[#C5A875] tracking-normal lowercase">
                see
              </span>{' '}
              Further.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A7A49A] sm:text-lg font-light">
              Three cognitive disciplines. Twelve challenges. One mind to sharpen.
              Designed for candidates preparing for high-stakes assessment environments.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/accenture/practice"
                className="group inline-flex items-center justify-center gap-3 bg-[#C5A875] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#151512] transition-all hover:bg-[#b8975e]"
              >
                <span>Explore the Lab</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="#collection"
                className="inline-flex items-center justify-center gap-2 border border-[#35352F] bg-transparent px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#F3EFE6] transition-colors hover:border-[#C5A875]/50 hover:text-[#C5A875]"
              >
                <span>Discover the Games</span>
              </Link>
            </div>

            {/* Precision Metadata */}
            <div className="mt-12 flex items-center gap-8 border-t border-[#35352F] pt-6 font-mono text-[11px] text-[#858573]">
              <div>
                <span className="text-[#A7A49A]">SYS.VER</span> 02.4
              </div>
              <div>
                <span className="text-[#A7A49A]">LATENCY</span> &lt; 1ms CLIENT
              </div>
              <div>
                <span className="text-[#A7A49A]">STATUS</span> OPERATIONAL
              </div>
            </div>
          </div>

          {/* Right Column: Original Architectural Maze Visualization (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md border border-[#35352F] bg-[#191916] p-6 shadow-2xl">
              {/* Header inside schematic */}
              <div className="flex items-center justify-between border-b border-[#35352F] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C5A875] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A7A49A]">
                    SIMULATION • MAZE_04
                  </span>
                </div>
                {/* Compact Timer Pill */}
                <div className="flex items-center gap-1.5 border border-[#35352F] bg-[#151512] px-2.5 py-1 font-mono text-[11px] text-[#C5A875]">
                  <span className="text-[#858573]">T-REM</span>
                  <span className="font-bold">00:24.8</span>
                </div>
              </div>

              {/* Maze Schematic Grid */}
              <div className="relative mt-5 aspect-square w-full border border-[#35352F] bg-[#151512] p-3">
                {/* SVG Maze Schematic with Fine Ivory Lines & Restrained Champagne Route */}
                <svg viewBox="0 0 240 240" className="h-full w-full">
                  {/* Subtle Grid Points */}
                  <defs>
                    <pattern id="dot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill="#35352F" />
                    </pattern>
                  </defs>
                  <rect width="240" height="240" fill="url(#dot-grid)" />

                  {/* Outer Frame */}
                  <rect x="2" y="2" width="236" height="236" fill="none" stroke="#35352F" strokeWidth="1.5" />

                  {/* Ivory Maze Internal Walls */}
                  <g stroke="#F3EFE6" strokeWidth="1.5" strokeLinecap="square" opacity="0.85">
                    {/* Horizontal Walls */}
                    <line x1="40" y1="40" x2="120" y2="40" />
                    <line x1="160" y1="40" x2="200" y2="40" />
                    <line x1="0" y1="80" x2="80" y2="80" />
                    <line x1="120" y1="80" x2="160" y2="80" />
                    <line x1="40" y1="120" x2="80" y2="120" />
                    <line x1="120" y1="120" x2="200" y2="120" />
                    <line x1="80" y1="160" x2="160" y2="160" />
                    <line x1="200" y1="160" x2="240" y2="160" />
                    <line x1="40" y1="200" x2="120" y2="200" />
                    <line x1="160" y1="200" x2="200" y2="200" />

                    {/* Vertical Walls */}
                    <line x1="40" y1="80" x2="40" y2="160" />
                    <line x1="80" y1="0" x2="80" y2="40" />
                    <line x1="80" y1="160" x2="80" y2="240" />
                    <line x1="120" y1="40" x2="120" y2="80" />
                    <line x1="120" y1="120" x2="120" y2="200" />
                    <line x1="160" y1="0" x2="160" y2="40" />
                    <line x1="160" y1="80" x2="160" y2="120" />
                    <line x1="160" y1="160" x2="160" y2="200" />
                    <line x1="200" y1="40" x2="200" y2="120" />
                  </g>

                  {/* Restrained Champagne Active Pathway */}
                  <path
                    d="M 20 20 L 20 60 L 100 60 L 100 20 L 140 20 L 140 100 L 100 100 L 100 140 L 180 140 L 180 180 L 220 180 L 220 220"
                    fill="none"
                    stroke="#C5A875"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeDasharray="4 2"
                    opacity="0.9"
                  />

                  {/* Start Node */}
                  <circle cx="20" cy="20" r="4" fill="#C5A875" />
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#C5A875" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Key Position */}
                  <g transform="translate(94, 94)">
                    <rect x="0" y="0" width="12" height="12" fill="#151512" stroke="#C5A875" strokeWidth="1" />
                    <circle cx="6" cy="6" r="3" fill="#C5A875" />
                  </g>

                  {/* Exit Door Position */}
                  <g transform="translate(212, 212)">
                    <rect x="0" y="0" width="16" height="16" fill="#C5A875" />
                    <rect x="2" y="2" width="12" height="12" fill="#151512" />
                    <circle cx="8" cy="8" r="2.5" fill="#C5A875" />
                  </g>
                </svg>

                {/* Legend Overlay at corner of maze */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3 border border-[#35352F] bg-[#151512]/90 px-2.5 py-1 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-[#C5A875]">
                    <Key className="h-3 w-3" /> KEY
                  </span>
                  <span className="text-[#35352F]">|</span>
                  <span className="flex items-center gap-1 text-[#F3EFE6]">
                    <DoorClosed className="h-3 w-3" /> EXIT
                  </span>
                </div>
              </div>

              {/* Bottom Metadata in Schematic */}
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#858573]">
                <span>SCALE: 1:1 PROCEDURAL</span>
                <span className="text-[#C5A875]">FINGERPRINT: MM_CL_982F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Slim Divider & 3 Discipline Labels */}
        <div className="mt-16 border-t border-[#35352F] pt-6 lg:mt-20">
          <div className="grid grid-cols-3 gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#858573]">
            <div className="flex items-center gap-2">
              <span className="text-[#C5A875]">01</span>
              <span className="text-[#F3EFE6]">MEMORY</span>
            </div>
            <div className="flex items-center gap-2 border-x border-[#35352F] px-4">
              <span className="text-[#C5A875]">02</span>
              <span className="text-[#F3EFE6]">NUMERICAL</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[#C5A875]">03</span>
              <span className="text-[#F3EFE6]">SPATIAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
