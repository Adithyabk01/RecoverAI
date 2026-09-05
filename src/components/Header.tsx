import React from 'react';
import { ShieldCheck, Cpu, Database, Layers, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenArchitecture: () => void;
  onOpenScenarios: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture, onOpenScenarios }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & App Info */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-indigo-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  RecoverAI
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Track 03 — AI Revenue Recovery
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                AI Revenue Recovery Agent Platform
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-semibold">
                  Stage 7 Final Integration Complete
                </span>
              </p>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Live Dataset Stream Badge */}
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-slate-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Dataset: <strong className="text-white font-semibold">1,000 Records</strong>
              </span>
            </div>

            {/* Demo Scenarios Modal Trigger */}
            <button
              onClick={onOpenScenarios}
              className="inline-flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-colors font-bold cursor-pointer shadow-sm"
              title="Launch Judge Demo Scenarios"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Demo Scenarios</span>
            </button>

            {/* Architecture Modal Trigger */}
            <button
              onClick={onOpenArchitecture}
              className="inline-flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
              title="View Modular Architecture Blueprint"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Architecture</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
