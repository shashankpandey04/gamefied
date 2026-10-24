import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isValidVariant } from '@/lib/accenture/config/games';
import { MathVariant } from '@/lib/accenture/games/quick-fire-math';
import { QuickFireMathBoard } from '@/components/accenture/games/quick-fire-math/QuickFireMathBoard';

export const instant = false;

interface PageProps {
  params: Promise<{ variant: string }>;
}

export function generateStaticParams() {
  return [
    { variant: 'basic' },
    { variant: 'mixed' },
    { variant: 'speed' },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { variant } = await params;
  const capitalized = variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : '';
  return {
    title: `Burst the Bubble (${capitalized}) — NerdMocks Accenture Practice`,
  };
}

async function QuickFireMathVariantContent({ params }: PageProps) {
  const { variant } = await params;

  if (!isValidVariant('quick-fire-math', variant)) {
    notFound();
  }

  return <QuickFireMathBoard variant={variant as MathVariant} />;
}

export default function QuickFireMathVariantPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C5A875] border-t-transparent" />
        </div>
      }
    >
      <QuickFireMathVariantContent params={params} />
    </Suspense>
  );
}
