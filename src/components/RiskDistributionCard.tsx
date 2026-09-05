import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { formatINR } from '../services/metrics';
import { ShieldAlert, Target, Info, Sparkles } from 'lucide-react';

interface RiskDistributionCardProps {
  metrics: DashboardMetrics;
}

export const RiskDistributionCard: React.FC<RiskDistributionCardProps> = ({ metrics }) => {
  const { riskDistribution, priorityDistribution } = metrics;

  const totalAtRiskCount =
    riskDistribution.high.count + riskDistribution.medium.count + riskDistribution.low.count;

  const totalAtRiskAmount =
    riskDistribution.high.amount + riskDistribution.medium.amount + riskDistribution.low.amount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Stage 2 Revenue Risk & Priority Breakdown
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Full 1,000 Dataset
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic rule-based risk classification & Stage 3 priority queue signals.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Revenue Exposure</div>
          <div className="text-base font-extrabold text-white">{formatINR(totalAtRiskAmount)}</div>
        </div>
      </div>

      {/* Main Grid: Risk Level Breakdown vs Recovery Priority Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        
        {/* Left Column: Risk Level Distribution (Exposure) */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              Risk Level Exposure
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              {totalAtRiskCount} At-Risk Payments
            </span>
          </div>

          <div className="space-y-2.5">
            {/* HIGH RISK */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  HIGH RISK
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{riskDistribution.high.count}</strong> payments ({formatINR(riskDistribution.high.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (riskDistribution.high.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* MEDIUM RISK */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  MEDIUM RISK
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{riskDistribution.medium.count}</strong> payments ({formatINR(riskDistribution.medium.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (riskDistribution.medium.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* LOW RISK */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  LOW RISK
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{riskDistribution.low.count}</strong> payments ({formatINR(riskDistribution.low.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (riskDistribution.low.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stage 3 Recovery Priority Queue Signal */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              Stage 3 Target Recovery Priority
            </h4>
            <span className="text-[11px] text-emerald-400/90 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI Queue Signals
            </span>
          </div>

          <div className="space-y-2.5">
            {/* HIGH PRIORITY */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  HIGH PRIORITY (Prime Candidates)
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{priorityDistribution.high.count}</strong> payments ({formatINR(priorityDistribution.high.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (priorityDistribution.high.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* MEDIUM PRIORITY */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  MEDIUM PRIORITY (Standard Queue)
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{priorityDistribution.medium.count}</strong> payments ({formatINR(priorityDistribution.medium.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (priorityDistribution.medium.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* LOW PRIORITY */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  LOW PRIORITY (Deprioritized / Guardrail)
                </span>
                <span className="font-mono text-slate-200">
                  <strong>{priorityDistribution.low.count}</strong> payments ({formatINR(priorityDistribution.low.amount, true)})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalAtRiskCount > 0 ? (priorityDistribution.low.count / totalAtRiskCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <span>
          Risk Level indicates revenue exposure severity. Recovery Priority combines exposure, recoverability, and customer LTV history as input for Stage 3's AI Agent.
        </span>
      </div>
    </div>
  );
};
