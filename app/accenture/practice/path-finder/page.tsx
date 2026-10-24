import React from 'react';
import { ACCENTURE_GAMES } from '@/lib/accenture/config/games';
import { VariantSelector } from '@/components/accenture/practice/VariantSelector';

export const metadata = {
  title: 'Path Finder Variants — NerdMocks Accenture',
  description: 'Select difficulty tier for Path Finder: Beginner (3×3), Easy (3×3), Intermediate (4×4), Advanced (5×5), or Expert (5×5).',
};

export default function PathFinderIndexPage() {
  const game = ACCENTURE_GAMES['path-finder'];

  return <VariantSelector game={game} />;
}
