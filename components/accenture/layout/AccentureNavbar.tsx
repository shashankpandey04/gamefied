'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';

export function AccentureNavbar() {
  const pathname = usePathname();
  const isGameRoute = pathname?.includes('/practice/') && pathname.split('/').length > 4;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#35352F] bg-[#151512]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/accenture" className="group flex items-center gap-3 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center border border-[#C5A875]/50 bg-[#151512] text-[#C5A875] transition-colors group-hover:border-[#C5A875]">
              <span className="font-mono text-xs font-bold tracking-tighter">NM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider text-[#F3EFE6] uppercase">
                NerdMocks <span className="font-light text-[#C5A875]">LAB</span>
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#858573]">
                Cognitive Performance
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/accenture"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              pathname === '/accenture'
                ? 'text-[#C5A875]'
                : 'text-[#A7A49A] hover:text-[#F3EFE6]'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/accenture/practice"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              pathname === '/accenture/practice'
                ? 'text-[#C5A875]'
                : 'text-[#A7A49A] hover:text-[#F3EFE6]'
            }`}
          >
            All Disciplines
          </Link>
          <Link
            href="/accenture/practice/memory-maze"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              pathname.includes('/memory-maze')
                ? 'text-[#C5A875]'
                : 'text-[#A7A49A] hover:text-[#F3EFE6]'
            }`}
          >
            Memory Maze
          </Link>
          <Link
            href="/accenture/practice/quick-fire-math"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              pathname.includes('/quick-fire-math')
                ? 'text-[#C5A875]'
                : 'text-[#A7A49A] hover:text-[#F3EFE6]'
            }`}
          >
            Quick-Fire Math
          </Link>
          <Link
            href="/accenture/practice/path-finder"
            className={`text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
              pathname.includes('/path-finder')
                ? 'text-[#C5A875]'
                : 'text-[#A7A49A] hover:text-[#F3EFE6]'
            }`}
          >
            Path Finder
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {isGameRoute ? (
            <Link
              href="/accenture/practice"
              className="inline-flex items-center gap-2 border border-[#35352F] bg-transparent px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#A7A49A] transition-colors hover:border-[#C5A875]/40 hover:text-[#F3EFE6]"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#C5A875]" />
              <span>Exit Trial</span>
            </Link>
          ) : (
            <Link
              href="/accenture/practice"
              className="group inline-flex items-center gap-2 border border-[#C5A875]/60 bg-[#C5A875]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[#C5A875] transition-all hover:bg-[#C5A875] hover:text-[#151512]"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Enter Lab</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
