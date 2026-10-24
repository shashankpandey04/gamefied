import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isValidVariant } from '@/lib/accenture/config/games';
import { MemoryMazeVariant } from '@/lib/accenture/games/memory-maze';
import { MemoryMazeBoard } from '@/components/accenture/games/memory-maze/MemoryMazeBoard';

export const instant = false;

interface PageProps {
  params: Promise<{ variant: string }>;
}

export function generateStaticParams() {
  return [
    { variant: 'easy' },
    { variant: 'classic' },
    { variant: 'advanced' },
    { variant: 'expert' },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { variant } = await params;
  const capitalized = variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : '';
  return {
    title: `Memory Maze (${capitalized}) — NerdMocks Accenture Practice`,
  };
}

async function MemoryMazeVariantContent({ params }: PageProps) {
  const { variant } = await params;

  if (!isValidVariant('memory-maze', variant)) {
    notFound();
  }

  return <MemoryMazeBoard variant={variant as MemoryMazeVariant} />;
}

export default function MemoryMazeVariantPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C5A875] border-t-transparent" />
        </div>
      }
    >
      <MemoryMazeVariantContent params={params} />
    </Suspense>
  );
}
