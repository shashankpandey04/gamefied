import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="relative w-full border-t border-[#35352F] bg-[#151512] py-24 lg:py-32 text-[#F3EFE6]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Small Label */}
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A875]">
          Ready when you are.
        </span>

        {/* Thin Champagne Divider */}
        <div className="mx-auto my-6 h-[1px] w-16 bg-[#C5A875]" />

        {/* Headline */}
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-[#F3EFE6] sm:text-5xl lg:text-6xl leading-tight">
          Give your mind <br />
          <span className="font-editorial italic font-normal text-[#C5A875] lowercase">
            something
          </span>{' '}
          Harder.
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-lg text-sm text-[#A7A49A] font-light leading-relaxed">
          No signups. No algorithmic feed. Pure client-side cognitive conditioning designed to test
          your limits under clock pressure.
        </p>

        {/* Action Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/accenture/practice"
            className="group inline-flex items-center gap-3 bg-[#C5A875] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#151512] transition-all hover:bg-[#b8975e]"
          >
            <span>Enter the Lab</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Architecture Spec Footnote */}
        <div className="mt-14 flex items-center justify-center gap-6 font-mono text-[10px] text-[#858573]">
          <span>PROCEDURAL SEEDING</span>
          <span>•</span>
          <span>100% LOCAL STORAGE</span>
          <span>•</span>
          <span>STRICT PEMDAS & BFS</span>
        </div>
      </div>
    </section>
  );
}
