import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isValidVariant } from '@/lib/accenture/config/games';
import { PathFinderVariant } from '@/lib/accenture/games/path-finder';
import { PathFinderBoard } from '@/components/accenture/games/path-finder/PathFinderBoard';

export const instant = false;

interface PageProps {
  params: Promise<{ variant: string }>;
}

export function generateStaticParams() {
  return [
    { variant: 'beginner' },
    { variant: 'easy' },
    { variant: 'intermediate' },
    { variant: 'advanced' },
    { variant: 'expert' },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { variant } = await params;
  const capitalized = variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : '';
  return {
    title: `Path Finder (${capitalized}) — NerdMocks Accenture Practice`,
  };
}

async function PathFinderVariantContent({ params }: PageProps) {
  const { variant } = await params;

  if (!isValidVariant('path-finder', variant)) {
    notFound();
  }

  return <PathFinderBoard variant={variant as PathFinderVariant} />;
}

export default function PathFinderVariantPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C5A875] border-t-transparent" />
        </div>
      }
    >
      <PathFinderVariantContent params={params} />
    </Suspense>
  );
}
