import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { formatINR } from '../services/metrics';
import { Filter, ArrowDown } from 'lucide-react';

interface DemoRecoveryFunnelCardProps {
  metrics: DashboardMetrics;
}

export const DemoRecoveryFunnelCard: React.FC<DemoRecoveryFunnelCardProps> = ({ metrics }) => {
  const funnelSteps = [
    {
      label: 'Total Dataset Payments',
      count: metrics.totalPayments,
      sub: 'Deterministic Synthetic Stream',
      color: 'border-slate-800 bg-slate-950/80 text-slate-200',
      badge: '100% Ingested',
    },
    {
      label: 'Recovery-Eligible Payments',
      count: metrics.failedPaymentsCount + (metrics.totalPayments - metrics.failedPaymentsCount - metrics.riskDistribution.low.count > 0 ? metrics.auditSummary.transactionsAudited - metrics.failedPaymentsCount : 0),
      sub: 'FAILED & PENDING Transactions',
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-200',
      badge: `${metrics.auditSummary.transactionsAudited} Cases Audited`,
    },
    {
      label: 'AI Recovery Recommendations',
      count: metrics.auditSummary.aiDecisionsRecorded,
      sub: 'Advisory Decisions Outputted',
      color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-200',
      badge: 'Stage 3 AI Agent',
    },
    {
      label: 'Policy-Approved Actions',
      count: metrics.policySummary.allowedCount,
      sub: 'Authorized by Policy Safety Gate',
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200 font-bold',
      badge: `${metrics.policySummary.allowedCount} Allowed / ${metrics.policySummary.blockedCount} Blocked`,
    },
    {
      label: 'Simulated Action Executions',
      count: metrics.executionSummary.approvedActionsCount,
      sub: 'Executed in Safe Simulation Mode',
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-200',
      badge: 'Stage 5 Safe Executor',
    },
    {
      label: 'Successful Retry Simulations',
      count: metrics.executionSummary.simulatedSuccessCount,
      sub: `Recovered ${formatINR(metrics.executionSummary.demoRevenueRecovered, true)} DEMO VALUE`,
      color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-extrabold',
      badge: '₹ DEMO REVENUE RECOVERED',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Filter className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">DEMO RECOVERY FUNNEL</h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                End-to-End Dataset Metrics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing transaction progression from ingestion through risk, AI, policy gate, and simulated execution.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
            DEMO / SIMULATED VALUES ONLY
          </span>
        </div>
      </div>

      {/* Visual Funnel Stack */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {funnelSteps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div
              className={`p-4 rounded-xl border ${step.color} shadow-sm transition-all hover:scale-[1.01] flex flex-wrap items-center justify-between gap-3`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{step.label}</h4>
                  <p className="text-xs text-slate-400">{step.sub}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                  {step.badge}
                </span>
                <div className="text-xl font-black font-mono tracking-tight text-white min-w-[70px] text-right">
                  {step.count}
                </div>
              </div>
            </div>

            {idx < funnelSteps.length - 1 && (
              <div className="flex justify-center -my-1">
                <ArrowDown className="h-4 w-4 text-slate-600 animate-bounce" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
