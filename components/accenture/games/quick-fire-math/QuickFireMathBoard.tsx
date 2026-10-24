'use client';

import React from 'react';
import { MathVariant } from '@/lib/accenture/games/quick-fire-math';
import { BurstTheBubbleBoard } from './BurstTheBubbleBoard';

interface QuickFireMathBoardProps {
  variant?: MathVariant;
}

const VARIANT_DIFFICULTY_MAP: Record<MathVariant, number> = {
  basic: 1,
  mixed: 4,
  speed: 7,
};

export function QuickFireMathBoard({ variant = 'basic' }: QuickFireMathBoardProps) {
  const initialDifficulty = VARIANT_DIFFICULTY_MAP[variant] || 1;
  return <BurstTheBubbleBoard initialDifficulty={initialDifficulty} />;
}
