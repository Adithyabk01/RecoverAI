import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { formatINR } from '../services/metrics';
import { Zap, CheckCircle2, XCircle, Sparkles, Lock, Info } from 'lucide-react';

interface ExecutionSummaryCardProps {
  metrics: DashboardMetrics;
}

export const ExecutionSummaryCard: React.FC<ExecutionSummaryCardProps> = ({ metrics }) => {
  const { executionSummary } = metrics;
  const {
    approvedActionsCount,
    blockedActionsCount,
    simulatedSuccessCount,
    simulatedFailureCount,
    demoRevenueRecovered,
  } = executionSummary;

  const totalEvaluated = approvedActionsCount + blockedActionsCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Stage 5 Action Executor — Safe Simulation Mode
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Demo / Simulation Only
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Downstream execution layer operating 100% offline with zero live API calls or money movement.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Demo Revenue Recovered</span>
          <div className="text-base font-extrabold text-emerald-400 flex items-center justify-end gap-1">
            <Sparkles className="h-4 w-4" />
            {formatINR(demoRevenueRecovered, true)}
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              DEMO VALUE
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        
        {/* 1. Approved Actions */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Policy Approved
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {approvedActionsCount} <span className="text-xs text-slate-400 font-normal">actions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cleared for simulation
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-emerald-400">
              {totalEvaluated > 0 ? Math.round((approvedActionsCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 2. Blocked Actions */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> Policy Blocked / Review
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {blockedActionsCount} <span className="text-xs text-slate-400 font-normal">actions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Execution denied by gate
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-rose-400">
              {totalEvaluated > 0 ? Math.round((blockedActionsCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 3. Simulated Successes */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Simulated Successes
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {simulatedSuccessCount} <span className="text-xs text-slate-400 font-normal">actions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulated positive outcome
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-indigo-400">
              {simulatedSuccessCount}
            </span>
          </div>
        </div>

        {/* 4. Simulated Failures */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <XCircle className="h-4 w-4" /> Simulated Failures
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {simulatedFailureCount} <span className="text-xs text-slate-400 font-normal">actions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulated retry unsuccessful
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-slate-400">
              {simulatedFailureCount}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          Demo Revenue Recovered is calculated ONLY from successful simulated payment retries. Customer Action, Escalation, and STOP contribute ₹0.
        </span>
        <span className="text-amber-400 font-semibold flex items-center gap-1">
          <Zap className="h-3 w-3" /> Safe Simulation Mode
        </span>
      </div>
    </div>
  );
};
