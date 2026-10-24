import type { Metadata } from 'next';
import { AccentureNavbar } from '@/components/accenture/layout/AccentureNavbar';
import { AccentureFooter } from '@/components/accenture/layout/AccentureFooter';

export const metadata: Metadata = {
  title: 'NerdMocks — Cognitive Performance Laboratory',
  description:
    'Three cognitive disciplines. Twelve challenges. One mind to sharpen. Train working memory, quantitative speed, and topological spatial reasoning.',
};

export default function AccentureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#151512] text-[#F3EFE6] antialiased selection:bg-[#C5A875] selection:text-[#151512]">
      <AccentureNavbar />
      <main className="flex-1 w-full">{children}</main>
      <AccentureFooter />
    </div>
  );
}
