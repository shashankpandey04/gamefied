import React from 'react';
import Link from 'next/link';
import { Brain, Calculator, Route, ArrowUpRight } from 'lucide-react';
import { GameMeta } from '@/lib/accenture/config/games';

interface GameCardProps {
  game: GameMeta;
  featured?: boolean;
}

export function GameCard({ game, featured = false }: GameCardProps) {
  const getIcon = () => {
    switch (game.id) {
      case 'memory-maze':
        return <Brain className="h-5 w-5 text-[#C5A875]" />;
      case 'quick-fire-math':
        return <Calculator className="h-5 w-5 text-[#C5A875]" />;
      case 'path-finder':
        return <Route className="h-5 w-5 text-[#C5A875]" />;
      default:
        return <Brain className="h-5 w-5 text-[#C5A875]" />;
    }
  };

  return (
    <div
      className={`group flex flex-col justify-between border bg-[#191916] p-7 transition-all duration-200 hover:border-[#C5A875] ${
        featured ? 'border-[#C5A875]' : 'border-[#35352F]'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#35352F] pb-4">
          <div className="flex h-10 w-10 items-center justify-center border border-[#35352F] bg-[#151512]">
            {getIcon()}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#C5A875]">
            {game.variants.length} Variants
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="mt-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858573]">
            {game.skillCategory}
          </span>
          <h3 className="mt-1 text-xl font-bold uppercase tracking-tight text-[#F3EFE6] group-hover:text-[#C5A875] transition-colors">
            {game.title}
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-[#A7A49A] font-light line-clamp-3">
            {game.description}
          </p>
        </div>

        {/* Cognitive Focus Badges */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {game.cognitiveFocus.slice(0, 3).map((focus) => (
            <span
              key={focus}
              className="inline-flex items-center border border-[#35352F] bg-[#151512] px-2 py-0.5 font-mono text-[10px] text-[#A7A49A]"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-8 border-t border-[#35352F] pt-4">
        <Link
          href={`/accenture/practice/${game.slug}`}
          className="flex w-full items-center justify-between bg-[#151512] border border-[#35352F] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3EFE6] transition-all hover:bg-[#C5A875] hover:text-[#151512] hover:border-[#C5A875]"
        >
          <span>Select Variant</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
