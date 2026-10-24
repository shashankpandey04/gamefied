import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function AccentureFooter() {
  return (
    <footer className="w-full border-t border-[#35352F] bg-[#151512] py-12 text-xs text-[#858573]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-[#F3EFE6] uppercase">
                NerdMocks <span className="text-[#C5A875]">Cognitive Performance</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#A7A49A] font-light">
              High-intensity procedural practice platform for candidates facing cognitive assessments.
              Architected entirely client-side with zero external data transmission.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Link href="/accenture/practice/memory-maze" className="text-[#A7A49A] hover:text-[#C5A875] transition-colors">
              Memory Maze
            </Link>
            <span className="text-[#35352F]">•</span>
            <Link href="/accenture/practice/quick-fire-math" className="text-[#A7A49A] hover:text-[#C5A875] transition-colors">
              Quick-Fire Math
            </Link>
            <span className="text-[#35352F]">•</span>
            <Link href="/accenture/practice/path-finder" className="text-[#A7A49A] hover:text-[#C5A875] transition-colors">
              Path Finder
            </Link>
            <span className="text-[#35352F]">•</span>
            <Link href="/" className="text-[#A7A49A] hover:text-[#C5A875] transition-colors">
              NerdMocks Home
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#35352F] pt-6 sm:flex-row sm:items-center sm:justify-between text-[11px] font-mono">
          <div className="text-[#858573]">
            Practice portal for candidate self-preparation. Not affiliated with or endorsed by Accenture.
          </div>
          <div className="flex items-center gap-1.5 text-[#A7A49A]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C5A875]" />
            <span>100% Client-Side Engine • Zero Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
