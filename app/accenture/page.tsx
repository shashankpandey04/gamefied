import React from 'react';
import { HeroSection } from '@/components/accenture/landing/HeroSection';
import { FeaturedGames } from '@/components/accenture/landing/FeaturedGames';
import { MethodSection } from '@/components/accenture/landing/MethodSection';
import { DifficultySection } from '@/components/accenture/landing/DifficultySection';
import { FinalCtaSection } from '@/components/accenture/landing/FinalCtaSection';

export default function AccentureLandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Full-Width Obsidian Hero with Maze Schematic */}
      <HeroSection />

      {/* 2. Warm Ivory Game Collection */}
      <FeaturedGames />

      {/* 3. Obsidian Method Protocol with Oversized 03 */}
      <MethodSection />

      {/* 4. Warm Ivory Horizontal Difficulty Progression */}
      <DifficultySection />

      {/* 5. Minimal Obsidian Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
