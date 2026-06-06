import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, XCircle, Target, ScanSearch } from 'lucide-react';

export default function ScoreDashboard() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState('');

  const handleScore = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/score/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) throw new Error('Failed to evaluate prompt');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400' };
    if (score >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400' };
    return { text: 'text-red-400', bg: 'bg-red-400' };
  };

  const safeString = (val) => typeof val === 'string' ? val : JSON.stringify(val) || 'N/A';
  const safeScore = (val) => typeof val === 'number' ? val : parseInt(val) || 0;

  const scores = results ? [
    { label: 'Clarity & Precision',    score: safeScore(results.clarity_score),    ...getScoreColor(safeScore(results.clarity_score)),    message: safeString(results.clarity_justification) },
    { label: 'Context & Constraints',  score: safeScore(results.context_score),    ...getScoreColor(safeScore(results.context_score)),    message: safeString(results.context_justification) },
    { label: 'Safety & Robustness',    score: safeScore(results.safety_score),     ...getScoreColor(safeScore(results.safety_score)),     message: safeString(results.safety_justification) },
    { label: 'Token Efficiency',        score: safeScore(results.efficiency_score), ...getScoreColor(safeScore(results.efficiency_score)), message: safeString(results.efficiency_justification) },
  ] : [];

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, { id: Date.now(), text: newRule.trim(), passing: null }]);
    setNewRule('');
  };

  const removeRule = (id) => setRules(rules.filter((r) => r.id !== id));

  const overallScore = results
    ? Math.round((safeScore(results.clarity_score) + safeScore(results.context_score) + safeScore(results.safety_score) + safeScore(results.efficiency_score)) / 4)
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Scoring Dashboard
          </h2>
          <p className="text-neutral-400 mt-1 text-sm">Get an objective 0-100 grade on your prompt across 4 dimensions.</p>
        </div>
        <button
          onClick={handleScore}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-5 py-2 rounded-md font-medium transition-colors text-sm"
        >
          <Target className="w-4 h-4" />
          {isLoading ? 'Grading...' : 'Grade Prompt'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Prompt input */}
      <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-colors">
        <div className="px-4 py-2 border-b border-white/5 bg-[#111111]">
          <span className="text-sm font-medium text-white">Prompt to Score</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste the prompt you want to grade here..."
          className="w-full h-28 bg-transparent p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
        />
      </div>

      {!results ? (
        <div className="p-12 border border-white/5 rounded-lg bg-[#0A0A0A] flex flex-col items-center justify-center text-neutral-500 border-dashed">
          <ScanSearch className="w-6 h-6 mb-3 opacity-50" />
          <p className="text-sm">Paste a prompt above and hit 'Grade Prompt' to see your scores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Score bars */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            {/* Overall score */}
            <div className="p-5 rounded-lg border border-white/10 bg-[#0A0A0A] flex items-center justify-between">
              <span className="text-sm font-medium text-white">Overall Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white tabular-nums">{overallScore}</span>
                <span className="text-neutral-500 text-sm">/100</span>
              </div>
            </div>

            {scores.map((d) => (
              <div key={d.label} className="p-4 rounded-lg border border-white/10 bg-[#0A0A0A]">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{d.label}</span>
                    <span className={`text-sm tabular-nums font-mono ${d.text}`}>{d.score}/100</span>
                  </div>
                  <p className="text-xs text-neutral-400">{d.message}</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.bg} transition-all duration-700`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Custom rules */}
          <div className="col-span-12 lg:col-span-5">
            <div className="p-5 rounded-lg border border-white/10 bg-[#0A0A0A] h-full flex flex-col">
              <h3 className="text-sm font-medium text-white mb-4">Custom Pass / Fail Rules</h3>
              <div className="space-y-2 flex-1">
                {rules.length === 0 && (
                  <p className="text-xs text-neutral-600 italic">No rules yet. Add one below.</p>
                )}
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md bg-white/3 border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {rule.passing === true  && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                      {rule.passing === false && <XCircle    className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                      {rule.passing === null  && <div className="w-3.5 h-3.5 rounded-full border border-neutral-600 flex-shrink-0" />}
                      <span className="text-xs text-neutral-300 truncate">{rule.text}</span>
                    </div>
                    <button onClick={() => removeRule(rule.id)} className="text-neutral-600 hover:text-neutral-300 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add rule input */}
              <div className="mt-4 flex gap-2">
                <input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRule()}
                  placeholder="Add a custom rule..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  onClick={addRule}
                  className="p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4 text-neutral-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
