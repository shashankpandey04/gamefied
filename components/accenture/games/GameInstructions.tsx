'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Keyboard } from 'lucide-react';

interface GameInstructionsProps {
  bullets: string[];
  controlsText?: string;
  defaultOpen?: boolean;
}

export function GameInstructions({ bullets, controlsText, defaultOpen = false }: GameInstructionsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#35352F] bg-[#191916] text-xs text-[#F3EFE6]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-xs text-[#A7A49A] hover:text-[#F3EFE6] transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#C5A875]" />
          <span className="font-semibold uppercase tracking-wider text-[#F3EFE6]">Rules & Trial Directives</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#858573]">
          <span>{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[#35352F] px-4 py-3.5 space-y-3 bg-[#151512]">
          <ul className="space-y-2 list-disc pl-4 text-xs text-[#A7A49A] font-light leading-relaxed">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="marker:text-[#C5A875]">
                {bullet}
              </li>
            ))}
          </ul>

          {controlsText && (
            <div className="flex items-center gap-2 border border-[#35352F] bg-[#191916] px-3 py-1.5 font-mono text-[11px] text-[#858573]">
              <Keyboard className="h-3.5 w-3.5 text-[#C5A875] shrink-0" />
              <span>{controlsText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
