import React, { useState } from 'react';
import { BarChart3, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const DIMENSIONS = [
  { key: 'clarity',      label: 'Clarity',               score: 7, color: 'bg-blue-500' },
  { key: 'specificity',  label: 'Specificity',            score: 5, color: 'bg-violet-500' },
  { key: 'constraints',  label: 'Constraint Quality',     score: 3, color: 'bg-amber-500' },
  { key: 'predictability',label: 'Output Predictability', score: 8, color: 'bg-emerald-500' },
];

const defaultRules = [
  { id: 1, text: 'Output must be valid JSON', passing: true },
  { id: 2, text: 'Tone must be professional',  passing: true },
  { id: 3, text: 'Response must be under 200 words', passing: false },
];

export default function ScoreDashboard() {
  const [prompt, setPrompt] = useState('');
  const [rules, setRules] = useState(defaultRules);
  const [newRule, setNewRule] = useState('');

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, { id: Date.now(), text: newRule.trim(), passing: null }]);
    setNewRule('');
  };

  const removeRule = (id) => setRules(rules.filter((r) => r.id !== id));

  const overallScore = Math.round(DIMENSIONS.reduce((s, d) => s + d.score, 0) / DIMENSIONS.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Scoring Dashboard</h2>
          <p className="text-neutral-400 mt-1 text-sm">Visualize your prompt quality across multiple dimensions.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-2 rounded-md font-medium transition-colors text-sm">
          <BarChart3 className="w-4 h-4" />
          Score Prompt
        </button>
      </div>

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

      <div className="grid grid-cols-12 gap-6">
        {/* Score bars */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {/* Overall score */}
          <div className="p-5 rounded-lg border border-white/10 bg-[#0A0A0A] flex items-center justify-between">
            <span className="text-sm font-medium text-white">Overall Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white tabular-nums">{overallScore}</span>
              <span className="text-neutral-500 text-sm">/10</span>
            </div>
          </div>

          {DIMENSIONS.map((d) => (
            <div key={d.key} className="p-4 rounded-lg border border-white/10 bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{d.label}</span>
                <span className="text-sm text-neutral-400 tabular-nums font-mono">{d.score}/10</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.color} transition-all duration-700`}
                  style={{ width: `${d.score * 10}%` }}
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
    </div>
  );
}
