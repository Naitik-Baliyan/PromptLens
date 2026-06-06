import React, { useState } from 'react';
import { Play, ArrowRightLeft } from 'lucide-react';

export default function PromptDiff() {
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleRunBoth = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/diff/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_a: promptA, prompt_b: promptB, model: 'llama-3.1-8b-instant' })
      });
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Compare & Diff
          </h2>
          <p className="text-neutral-400 mt-1 text-sm">A/B test your prompts against each other in real-time.</p>
        </div>
        <button 
          onClick={handleRunBoth}
          disabled={isLoading || !promptA.trim() || !promptB.trim()}
          className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-5 py-2 rounded-md font-medium transition-colors text-sm">
          <Play className="w-4 h-4" fill="currentColor" />
          {isLoading ? 'Running...' : 'Run Both Prompts'}
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

      {error && (
        <div className="mt-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {results ? (
        <div className="mt-8 space-y-4 animate-in fade-in duration-500">
          <h3 className="text-lg font-medium text-white">Results</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Result A */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-white">Variant A Output</span>
                <div className="flex gap-3 text-xs text-neutral-500">
                  <span>{results.variant_a.latency_ms}ms</span>
                  <span>{results.variant_a.tokens.total_tokens} tokens</span>
                </div>
              </div>
              <div className="text-sm text-neutral-300 font-mono whitespace-pre-wrap">
                {results.variant_a.output}
              </div>
            </div>

            {/* Result B */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-white">Variant B Output</span>
                <div className="flex gap-3 text-xs text-neutral-500">
                  <span>{results.variant_b.latency_ms}ms</span>
                  <span>{results.variant_b.tokens.total_tokens} tokens</span>
                </div>
              </div>
              <div className="text-sm text-neutral-300 font-mono whitespace-pre-wrap">
                {results.variant_b.output}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 p-12 border border-white/5 rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center text-neutral-500 border-dashed">
          <ArrowRightLeft className="w-6 h-6 mb-3 opacity-50" />
          <p className="text-sm">Hit 'Run Both Prompts' to generate outputs and see the visual diff.</p>
        </div>
      )}
    </div>
  );
}
