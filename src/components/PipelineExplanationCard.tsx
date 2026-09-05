import React from 'react';
import { Shield, Bot, Lock, Zap, FileText, Activity } from 'lucide-react';

export const PipelineExplanationCard: React.FC = () => {
  const steps = [
    {
      num: 1,
      name: 'Detect Risk',
      desc: 'Identifies payments where revenue is potentially at risk from gateway or bank failures.',
      icon: <Activity className="h-5 w-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    },
    {
      num: 2,
      name: 'Diagnose Failure',
      desc: 'Analyzes failure reason, customer history, attempt count, amount exposure, and recoverability.',
      icon: <Shield className="h-5 w-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
    },
    {
      num: 3,
      name: 'Recommend Recovery',
      desc: 'Selects RETRY_PAYMENT, REQUEST_CUSTOMER_ACTION, ESCALATE, or STOP based on signals.',
      icon: <Bot className="h-5 w-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
    },
    {
      num: 4,
      name: 'Safety Check',
      desc: 'Independently verifies whether the recommended action is permitted by 9 strict policy rules.',
      icon: <Lock className="h-5 w-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-bold',
    },
    {
      num: 5,
      name: 'Simulate Action',
      desc: 'Executes only policy-approved actions strictly in safe demo simulation mode.',
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    },
    {
      num: 6,
      name: 'Record Audit',
      desc: 'Stores the complete 4-stage decision chain for 100% explainability and traceability.',
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white tracking-tight">How RecoverAI Works</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              Autonomous Decision Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end, decoupled workflow for detecting risk, deciding actions, enforcing policies, and logging audit history.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <span>DEMO MODE • Safe Simulation</span>
        </div>
      </div>

      {/* 6 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`p-4 rounded-xl border ${s.color} transition-all hover:border-slate-700 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    {s.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white">{s.num}. {s.name}</h4>
                </div>
                <span className="text-xs font-mono font-extrabold text-slate-500">STAGE {s.num}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
