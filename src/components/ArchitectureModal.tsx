import React from 'react';
import { X, Layers, Bot, Zap, Lock, Eye } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const architecturalLayers = [
    {
      title: '1. AI Layer',
      subtitle: 'Intelligence & Decision Engine',
      icon: <Bot className="h-5 w-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
      features: ['Revenue Risk Reasoning (0-100 score)', 'Advisory Recovery Recommendations', 'Recoverability & Priority Diagnostics'],
    },
    {
      title: '2. Safety Layer',
      subtitle: 'Independent Policy Gate Boundary',
      icon: <Lock className="h-5 w-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 font-bold',
      features: ['Independent Policy Rule Validation (9 rules)', 'Human Review Routing & Flags', 'Action Authorization (ALLOWED / BLOCKED / REVIEW)'],
    },
    {
      title: '3. Execution Layer',
      subtitle: 'Downstream Safe Simulation Mode',
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      features: ['100% Offline Simulation Mode', 'User-Triggered Simulation Previews', 'Zero Real Money or Payment Retries'],
    },
    {
      title: '4. Observability Layer',
      subtitle: 'Traceability & Audit Metrics',
      icon: <Eye className="h-5 w-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
      features: ['Immutable 4-Stage Audit Trail', 'Deterministic Audit IDs (AUDIT-DEMO-XXXXXXXX)', 'Dataset-Wide Baseline Dashboard Metrics'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">RecoverAI System Architecture</h2>
              <p className="text-xs text-slate-400">4 Decoupled Architectural Layers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pipeline Flow Diagram */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-5 text-xs text-center space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">End-to-End Recovery & Audit Pipeline</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-200 font-mono font-medium pt-1">
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">Dataset</span>
            <span className="text-slate-500">→</span>
            <span className="bg-purple-950/80 text-purple-300 px-2 py-1 rounded border border-purple-800/60 text-[11px]">Risk Detector</span>
            <span className="text-slate-500">→</span>
            <span className="bg-indigo-950/80 text-indigo-300 px-2 py-1 rounded border border-indigo-800/60 text-[11px]">AI Recovery Agent</span>
            <span className="text-slate-500">→</span>
            <span className="bg-emerald-950/80 text-emerald-300 px-2 py-1 rounded border border-emerald-500/50 font-bold text-[11px]">
              🛡️ Policy Gate
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-amber-950/80 text-amber-300 px-2 py-1 rounded border border-amber-500/50 text-[11px]">Action Executor</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-950/80 text-blue-300 px-2 py-1 rounded border border-blue-500/50 font-bold text-[11px]">
              📋 Audit Trail
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800 text-[11px]">Dashboard</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium italic pt-1">
            * Security Boundary: AI Recommendation ≠ Authorization. The Policy & Safety Gate independently authorizes execution.
          </p>
        </div>

        {/* 4 Architectural Layers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {architecturalLayers.map((layer) => (
            <div
              key={layer.title}
              className={`p-4 rounded-xl border ${layer.color} transition-all bg-slate-950/80 space-y-2`}
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {layer.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{layer.title}</h4>
                  <p className="text-[11px] text-slate-400">{layer.subtitle}</p>
                </div>
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside pt-1">
                {layer.features.map((feat, idx) => (
                  <li key={idx} className="leading-tight">{feat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Architecture Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
