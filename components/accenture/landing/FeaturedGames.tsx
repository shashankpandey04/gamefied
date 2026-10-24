import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Brain, Calculator, Route } from 'lucide-react';

export function FeaturedGames() {
  return (
    <section id="collection" className="w-full bg-[#F3EFE6] py-20 lg:py-28 text-[#151512]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D8D2C7] pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C5A875]">
                Discipline Portfolio
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-[#151512]">
              Three disciplines. <br />
              <span className="font-editorial italic font-normal text-[#858573] tracking-normal lowercase">
                one
              </span>{' '}
              Sharper mind.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm text-[#858573] leading-relaxed font-light">
            Engineered around cognitive psychology standards: transient spatial storage,
            rapid numerical appraisal, and mental geometric rotation.
          </p>
        </div>

        {/* Distinctive Asymmetric Game Panels Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* PANEL 1: Memory Maze (Wide Featured Panel - 7 Columns) */}
          <div className="group flex flex-col justify-between border border-[#D8D2C7] bg-[#EDE8DE] p-8 lg:col-span-7 transition-all hover:border-[#151512]">
            <div>
              <div className="flex items-center justify-between border-b border-[#D8D2C7] pb-4">
                <span className="font-mono text-xs font-bold text-[#C5A875]">01 / DISCIPLINE</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#858573]">
                  4 Difficulty Variants
                </span>
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858573]">
                    Spatial Working Memory
                  </span>
                  <h3 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[#151512]">
                    Memory Maze
                  </h3>
                  <p className="mt-3 max-w-md text-xs sm:text-sm text-[#858573] leading-relaxed font-light">
                    Retain transient grid geometries during a brief exposure period. When the labyrinth turns
                    opaque, plot your route to retrieve the key and reach the exit without collisions.
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center border border-[#D8D2C7] bg-[#F3EFE6] text-[#151512]">
                  <Brain className="h-5 w-5" />
                </div>
              </div>

              {/* Custom Mini Maze Schematic Preview */}
              <div className="mt-8 border border-[#D8D2C7] bg-[#F3EFE6] p-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#858573] mb-3">
                  <span>EXPOSURE: 4s – 8s</span>
                  <span className="text-[#C5A875]">ERROR PENALTY: STRICT</span>
                </div>
                <div className="grid grid-cols-6 gap-1 aspect-[6/2.5] w-full">
                  {Array.from({ length: 18 }).map((_, i) => {
                    const isKey = i === 4;
                    const isDoor = i === 17;
                    const isPath = [0, 1, 2, 8, 14, 15, 16, 17].includes(i);
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-center border border-[#D8D2C7] text-[10px] font-mono transition-colors ${
                          isKey
                            ? 'bg-[#C5A875]/20 border-[#C5A875] text-[#C5A875] font-bold'
                            : isDoor
                            ? 'bg-[#151512] text-[#F3EFE6] font-bold'
                            : isPath
                            ? 'bg-[#F9F7F2]'
                            : 'bg-[#EDE8DE]'
                        }`}
                      >
                        {isKey ? 'KEY' : isDoor ? 'EXIT' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#D8D2C7] pt-5">
              <span className="font-mono text-[11px] text-[#858573]">5×5 TO 8×8 LABYRINTHS</span>
              <Link
                href="/accenture/practice/memory-maze"
                className="inline-flex items-center gap-2 bg-[#151512] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512]"
              >
                <span>Select Variant</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* PANEL 2: Quick-Fire Math (Tall Column Panel - 5 Columns) */}
          <div className="group flex flex-col justify-between border border-[#D8D2C7] bg-[#EDE8DE] p-8 lg:col-span-5 transition-all hover:border-[#151512]">
            <div>
              <div className="flex items-center justify-between border-b border-[#D8D2C7] pb-4">
                <span className="font-mono text-xs font-bold text-[#C5A875]">02 / DISCIPLINE</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#858573]">
                  3 Complexity Tiers
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858573]">
                    Numerical Speed
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center border border-[#D8D2C7] bg-[#F3EFE6] text-[#151512]">
                    <Calculator className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[#151512]">
                  Burst the Bubble
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#858573] leading-relaxed font-light">
                  Evaluate mathematical expressions and burst bubbles in ascending numerical order within 15 seconds. Features dynamic adaptive difficulty.
                </p>
              </div>

              {/* Custom Typographic Calculation Matrix Preview */}
              <div className="mt-6 border border-[#D8D2C7] bg-[#F3EFE6] p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#858573] pb-1 border-b border-[#D8D2C7]">
                  <span>ORDER: SMALLEST → LARGEST</span>
                  <span>15S TIMER</span>
                </div>
                <div className="flex items-center justify-between border border-[#D8D2C7] bg-white px-3 py-1.5 font-mono text-xs">
                  <span className="text-[#858573]">Bubble A</span>
                  <span className="font-bold text-[#151512]">18 ÷ 3</span>
                  <span className="text-[#C5A875] text-[10px]">= 6 (1st)</span>
                </div>
                <div className="flex items-center justify-between border border-[#D8D2C7] bg-white px-3 py-1.5 font-mono text-xs">
                  <span className="text-[#858573]">Bubble B</span>
                  <span className="font-bold text-[#151512]">4 + 5</span>
                  <span className="text-[#C5A875] text-[10px]">= 9 (2nd)</span>
                </div>
                <div className="flex items-center justify-between border border-[#D8D2C7] bg-white px-3 py-1.5 font-mono text-xs">
                  <span className="text-[#858573]">Bubble C</span>
                  <span className="font-bold text-[#151512]">3 × 4</span>
                  <span className="text-[#C5A875] text-[10px]">= 12 (3rd)</span>
                </div>
                <div className="flex items-center justify-between border border-[#D8D2C7] bg-white px-3 py-1.5 font-mono text-xs">
                  <span className="text-[#858573]">Bubble D</span>
                  <span className="font-bold text-[#151512]">20 − 5</span>
                  <span className="text-[#C5A875] text-[10px]">= 15 (4th)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#D8D2C7] pt-5">
              <span className="font-mono text-[11px] text-[#858573]">ADAPTIVE • CONTINUOUS</span>
              <Link
                href="/accenture/practice/quick-fire-math"
                className="inline-flex items-center gap-2 bg-[#151512] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512]"
              >
                <span>Enter Assessment</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* PANEL 3: Path Finder (Wide Full-Width Architectural Conduit - 12 Columns) */}
          <div className="group flex flex-col lg:flex-row justify-between border border-[#D8D2C7] bg-[#EDE8DE] p-8 lg:col-span-12 transition-all hover:border-[#151512]">
            <div className="lg:max-w-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-[#D8D2C7] pb-4">
                  <span className="font-mono text-xs font-bold text-[#C5A875]">03 / DISCIPLINE</span>
                  <span className="text-[#D8D2C7]">•</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#858573]">
                    5 Architectural Grids
                  </span>
                </div>

                <div className="mt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858573]">
                    Spatial & Topological Reasoning
                  </span>
                  <h3 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[#151512]">
                    Path Finder
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[#858573] leading-relaxed font-light">
                    Rotate interconnected conduit segments in 90° intervals to close gaps between the electrical
                    source and goal terminal. Features straight lines, curved elbows, and branching intersections.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/accenture/practice/path-finder"
                  className="inline-flex items-center gap-2 bg-[#151512] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512]"
                >
                  <span>Select Grid Size</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Schematic Conduit Simulation Preview */}
            <div className="mt-8 lg:mt-0 lg:w-1/2 border border-[#D8D2C7] bg-[#F3EFE6] p-6">
              <div className="flex items-center justify-between border-b border-[#D8D2C7] pb-3 text-[11px] font-mono text-[#858573]">
                <div className="flex items-center gap-2">
                  <Route className="h-3.5 w-3.5 text-[#C5A875]" />
                  <span>TOPOLOGY: CONDUIT_5X5</span>
                </div>
                <span className="text-[#C5A875]">SIGNAL: CONTINUOUS</span>
              </div>

              {/* Graphic Pipe Grid Representation */}
              <div className="mt-4 grid grid-cols-4 gap-2 aspect-[4/2.2] w-full">
                {[
                  { type: 'cross', active: true },
                  { type: 'corner', active: true },
                  { type: 'straight', active: false },
                  { type: 't-junction', active: false },
                  { type: 'straight', active: true },
                  { type: 'corner', active: true },
                  { type: 'corner', active: true },
                  { type: 'end', active: true },
                ].map((tile, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-center border border-[#D8D2C7] p-2 transition-colors ${
                      tile.active ? 'bg-[#FDFCF9] border-[#C5A875]/70' : 'bg-[#EDE8DE]'
                    }`}
                  >
                    <svg viewBox="0 0 40 40" className="h-8 w-8">
                      {tile.active ? (
                        <>
                          <line x1="20" y1="0" x2="20" y2="40" stroke="#C5A875" strokeWidth="3" />
                          <line x1="0" y1="20" x2="40" y2="20" stroke="#C5A875" strokeWidth="3" />
                          <circle cx="20" cy="20" r="4" fill="#C5A875" />
                        </>
                      ) : (
                        <>
                          <line x1="20" y1="0" x2="20" y2="40" stroke="#858573" strokeWidth="2" strokeDasharray="3 2" />
                          <line x1="0" y1="20" x2="20" y2="20" stroke="#858573" strokeWidth="2" strokeDasharray="3 2" />
                        </>
                      )}
                    </svg>
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 font-mono text-[9px] text-[#C5A875] font-bold">ALPHA</span>
                    )}
                    {idx === 7 && (
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] text-[#151512] font-bold">OMEGA</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#858573]">
                <span>3×3 TO 5×5 MATRICES</span>
                <span>ROTATION INTERVAL: 90° CLOCKWISE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
