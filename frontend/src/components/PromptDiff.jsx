import React, { useState } from 'react';
import { Play, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function PromptDiff() {
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Compare & Diff
          </h2>
          <p className="text-neutral-400 mt-1 text-sm">A/B test your prompts against each other in real-time.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-md font-medium transition-colors text-sm">
          <Play className="w-4 h-4" fill="currentColor" />
          Run Both Prompts
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Prompt A Input */}
        <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-colors">
          <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-[#111111]">
            <span className="font-medium text-white text-sm">
              Variant A
            </span>
            <span className="text-xs text-neutral-500">Model: Llama 3 (Groq)</span>
          </div>
          <textarea
            value={promptA}
            onChange={(e) => setPromptA(e.target.value)}
            placeholder="Enter your base prompt here..."
            className="w-full h-72 bg-transparent p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Prompt B Input */}
        <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-colors">
          <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-[#111111]">
            <span className="font-medium text-white text-sm">
              Variant B
            </span>
            <span className="text-xs text-neutral-500">Model: Llama 3 (Groq)</span>
          </div>
          <textarea
            value={promptB}
            onChange={(e) => setPromptB(e.target.value)}
            placeholder="Enter your modified prompt here to compare..."
            className="w-full h-72 bg-transparent p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Placeholder for Diff Results */}
      <div className="mt-8 p-12 border border-white/5 rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center text-neutral-500 border-dashed">
        <ArrowRightLeft className="w-6 h-6 mb-3 opacity-50" />
        <p className="text-sm">Hit 'Run Both Prompts' to generate outputs and see the visual diff.</p>
      </div>
    </div>
  );
}
