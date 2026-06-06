import React, { useState } from 'react';
import { Dna, ArrowRight, Zap, GitBranch, BookOpen, Minimize2, User } from 'lucide-react';

const VARIANTS = [
  {
    id: 'specific',
    icon: Zap,
    label: 'More Specific',
    description: 'Adds precision and removes ambiguity with concrete details.',
    color: 'blue',
  },
  {
    id: 'cot',
    icon: GitBranch,
    label: 'Chain-of-Thought',
    description: 'Forces step-by-step reasoning before producing an answer.',
    color: 'violet',
  },
  {
    id: 'fewshot',
    icon: BookOpen,
    label: 'Few-Shot',
    description: 'Automatically generates and prepends illustrative examples.',
    color: 'amber',
  },
  {
    id: 'compressed',
    icon: Minimize2,
    label: 'Compressed',
    description: 'Achieves the same goal in the fewest possible tokens.',
    color: 'emerald',
  },
  {
    id: 'persona',
    icon: User,
    label: 'Persona-Driven',
    description: 'Wraps the prompt in an authoritative expert role.',
    color: 'rose',
  },
];

const colorMap = {
  blue:   { dot: 'bg-blue-500',   border: 'border-blue-500/20',   label: 'text-blue-400' },
  violet: { dot: 'bg-violet-500', border: 'border-violet-500/20', label: 'text-violet-400' },
  amber:  { dot: 'bg-amber-500',  border: 'border-amber-500/20',  label: 'text-amber-400' },
  emerald:{ dot: 'bg-emerald-500',border: 'border-emerald-500/20',label: 'text-emerald-400' },
  rose:   { dot: 'bg-rose-500',   border: 'border-rose-500/20',   label: 'text-rose-400' },
};

export default function MutationEngine() {
  const [basePrompt, setBasePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleMutate = async () => {
    if (!basePrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/mutate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: basePrompt })
      });
      if (!response.ok) throw new Error('Failed to generate mutations');
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Mutation Engine</h2>
          <p className="text-neutral-400 mt-1 text-sm">Generate 5 intelligent variants of your prompt automatically.</p>
        </div>
        <button
          onClick={handleMutate}
          disabled={isLoading || !basePrompt.trim()}
          className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-5 py-2 rounded-md font-medium transition-colors text-sm"
        >
          <Dna className="w-4 h-4" />
          {isLoading ? 'Mutating...' : 'Mutate Prompt'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Base prompt input */}
      <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-colors">
        <div className="px-4 py-2 border-b border-white/5 bg-[#111111] flex items-center justify-between">
          <span className="text-sm font-medium text-white">Base Prompt</span>
          <span className="text-xs text-neutral-500">{basePrompt.length} chars</span>
        </div>
        <textarea
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
          placeholder="Enter your base prompt to generate mutations..."
          className="w-full h-36 bg-transparent p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Variant Cards */}
      {!results ? (
        <div className="p-12 border border-white/5 rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center text-neutral-500 border-dashed">
          <Dna className="w-6 h-6 mb-3 opacity-50" />
          <p className="text-sm">Enter a prompt above and hit 'Mutate' to generate 5 variants.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {VARIANTS.map((v) => {
            const Icon = v.icon;
            const c = colorMap[v.color];
            return (
              <div
                key={v.id}
                className={`p-5 rounded-lg border ${c.border} bg-[#0A0A0A] flex items-start justify-between gap-4`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${c.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${c.label}`} />
                      <h3 className={`font-medium text-sm ${c.label}`}>{v.label}</h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3">{v.description}</p>
                    <p className="font-mono text-xs text-neutral-300 bg-white/5 rounded px-3 py-2 leading-relaxed whitespace-pre-wrap">
                      {results ? (typeof results[v.id] === 'string' ? results[v.id] : JSON.stringify(results[v.id])) || 'Failed to generate variant.' : 'Generating mutation...'}
                    </p>
                  </div>
                </div>
                <button
                  title="Send to Compare & Diff"
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-md transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-3 h-3" />
                  Compare
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
