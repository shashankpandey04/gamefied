import React from 'react';
import { ACCENTURE_GAMES } from '@/lib/accenture/config/games';
import { VariantSelector } from '@/components/accenture/practice/VariantSelector';

export const metadata = {
  title: 'Memory Maze Variants — NerdMocks Accenture',
  description: 'Select difficulty tier for Memory Maze: Easy, Classic, Advanced, or Expert.',
};

export default function MemoryMazeIndexPage() {
  const game = ACCENTURE_GAMES['memory-maze'];

  return <VariantSelector game={game} />;
}
