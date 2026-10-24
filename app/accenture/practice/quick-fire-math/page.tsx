import React from 'react';
import { BurstTheBubbleBoard } from '@/components/accenture/games/quick-fire-math/BurstTheBubbleBoard';

export const metadata = {
  title: 'Burst the Bubble (Quick-Fire Math) — NerdMocks Accenture Practice',
  description:
    'Continuous cognitive assessment testing numerical calculation speed and relative magnitude under 15-second time pressure.',
};

export default function QuickFireMathIndexPage() {
  return <BurstTheBubbleBoard initialDifficulty={1} />;
}
