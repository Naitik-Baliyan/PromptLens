import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Stethoscope, Wand2, Activity, Download, GitCompareArrows } from 'lucide-react';
import PromptDiff from './components/PromptDiff';
import PromptAutopsy from './components/PromptAutopsy';
import MutationEngine from './components/MutationEngine';
import ScoreDashboard from './components/ScoreDashboard';
import ExportPanel from './components/ExportPanel';

function PromptLensLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="10" fill="url(#lens-grad)" />
      <path d="M13 12.5L17.5 16L13 19.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <radialGradient id="lens-grad" cx="50%" cy="35%" r="60%" fx="50%" fy="35%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Sidebar() {
  const location = useLocation();
  const links = [
    { path: '/', label: 'Compare & Diff', icon: GitCompareArrows },
    { path: '/autopsy', label: 'Prompt Autopsy', icon: Stethoscope },
    { path: '/mutate', label: 'Mutation Engine', icon: Wand2 },
    { path: '/score', label: 'Scoring Dashboard', icon: Activity },
    { path: '/export', label: 'Export & Cards', icon: Download },
  ];

  return (
    <div className="w-64 bg-[#0A0A0A] border-r border-white/5 h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <PromptLensLogo />
        <h1 className="text-xl font-semibold text-white tracking-tight">
          PromptLens
        </h1>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 text-sm ${isActive ? 'bg-white/10 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-neutral-500 text-center">
        PromptLens v1.1
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black text-neutral-200 font-sans overflow-hidden selection:bg-white/20">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<PromptDiff />} />
              <Route path="/autopsy" element={<PromptAutopsy />} />
              <Route path="/mutate" element={<MutationEngine />} />
              <Route path="/score" element={<ScoreDashboard />} />
              <Route path="/export" element={<ExportPanel />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
