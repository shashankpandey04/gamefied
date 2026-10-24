import React from 'react';

export function MethodSection() {
  const steps = [
    {
      code: '01',
      title: 'SELECT',
      description: 'Choose your discipline.',
      detail: 'Tailor your session to Spatial Memory, Numerical Speed, or Topological Reasoning across four to five graduated tiers.',
    },
    {
      code: '02',
      title: 'ENGAGE',
      description: 'Solve under time pressure.',
      detail: 'Each challenge is procedurally generated with live countdowns, strict error-checking, and zero repetitive patterns.',
    },
    {
      code: '03',
      title: 'REFLECT',
      description: 'Review your time, score, and mistakes.',
      detail: 'Analyze real-time completion latency, error frequency, and personal best records stored locally on your device.',
    },
  ];

  return (
    <section className="relative w-full border-y border-[#35352F] bg-[#151512] py-20 lg:py-28 text-[#F3EFE6]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Oversized "03" and Section Title (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C5A875]">
              Protocol
            </span>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-editorial text-7xl sm:text-8xl lg:text-9xl text-[#C5A875] leading-none select-none">
                03
              </span>
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#F3EFE6] sm:text-3xl">
                  Methodology
                </h2>
                <p className="mt-1 text-xs text-[#858573] font-light">
                  A disciplined trial cycle for cognitive readiness.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Three Steps Connected with a Thin Champagne Line (8 cols) */}
          <div className="lg:col-span-8 relative">
            {/* Connecting Thin Champagne Line (Desktop) */}
            <div className="hidden md:block absolute top-6 left-6 right-6 h-[1px] bg-gradient-to-r from-[#C5A875]/80 via-[#C5A875]/40 to-[#35352F]" />

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.code} className="relative flex flex-col pt-0 md:pt-12">
                  {/* Step Node Marker */}
                  <div className="hidden md:flex absolute top-4 left-0 h-4 w-4 items-center justify-center border border-[#C5A875] bg-[#151512]">
                    <div className="h-1.5 w-1.5 bg-[#C5A875]" />
                  </div>

                  <span className="font-mono text-[11px] text-[#C5A875]">{step.code}</span>
                  <h3 className="mt-2 text-lg font-bold uppercase tracking-wider text-[#F3EFE6]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#C5A875]">
                    {step.description}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-[#A7A49A] font-light">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
