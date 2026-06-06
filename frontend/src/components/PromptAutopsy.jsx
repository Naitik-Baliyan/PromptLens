import React, { useState } from 'react';
import { Stethoscope, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PromptAutopsy() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/autopsy/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
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
            Prompt Autopsy & Linter
          </h2>
          <p className="text-neutral-400 mt-1 text-sm">Dissect your prompt structure and identify security vulnerabilities.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-5 py-2 rounded-md font-medium transition-colors text-sm">
          <Stethoscope className="w-4 h-4" />
          {isLoading ? 'Analyzing...' : 'Analyze Prompt'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Input */}
        <div className="col-span-12 lg:col-span-5">
          <div className="flex flex-col bg-[#0A0A0A] border border-white/10 focus-within:border-white/30 transition-colors rounded-lg overflow-hidden h-[600px]">
            <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-[#111111]">
              <span className="font-medium text-white text-sm">
                Raw Prompt
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your complex prompt here..."
              className="w-full h-full bg-transparent p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Right Side: Dissection Results */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {/* System Instruction */}
          <div className="p-4 rounded-lg border border-white/10 bg-[#0A0A0A]">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <h3 className="font-medium text-white text-sm">System Instruction</h3>
             </div>
             <p className="text-xs text-neutral-400 pl-3.5 mt-1">
               {results ? (typeof results.system_instruction === 'string' ? results.system_instruction : JSON.stringify(results.system_instruction)) : 'Waiting for analysis...'}
             </p>
          </div>

          {/* Context Block */}
          <div className="p-4 rounded-lg border border-white/10 bg-[#0A0A0A]">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <h3 className="font-medium text-white text-sm">Context & Background</h3>
             </div>
             <p className="text-xs text-neutral-400 pl-3.5 mt-1">
               {results ? (typeof results.context === 'string' ? results.context : JSON.stringify(results.context)) : 'Waiting for analysis...'}
             </p>
          </div>

          {/* Constraints */}
          <div className="p-4 rounded-lg border border-white/10 bg-[#0A0A0A]">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <h3 className="font-medium text-white text-sm">Rules & Constraints</h3>
             </div>
             <p className="text-xs text-neutral-400 pl-3.5 mt-1">
               {results ? (typeof results.constraints === 'string' ? results.constraints : JSON.stringify(results.constraints)) : 'Waiting for analysis...'}
             </p>
          </div>

          {/* Security Linter */}
          <div className="mt-8 p-4 rounded-lg border border-red-500/20 bg-red-500/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500/80" />
             <div className="flex items-center gap-2 mb-1 pl-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <h3 className="font-medium text-red-500 text-sm">Security & Jailbreak Check</h3>
             </div>
             <p className="text-xs text-neutral-400 pl-8 mt-1">
               {results ? (typeof results.security_issues === 'string' ? results.security_issues : JSON.stringify(results.security_issues)) : 'We will run simulated prompt injections (e.g., "Ignore all previous instructions...") to see if your constraints hold up.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
