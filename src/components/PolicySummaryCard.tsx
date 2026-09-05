import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { ShieldCheck, ShieldAlert, UserCheck, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

interface PolicySummaryCardProps {
  metrics: DashboardMetrics;
}

export const PolicySummaryCard: React.FC<PolicySummaryCardProps> = ({ metrics }) => {
  const { policySummary } = metrics;
  const { allowedCount, blockedCount, reviewCount, humanReviewCount, actionBreakdown } = policySummary;

  const totalEvaluated = allowedCount + blockedCount + reviewCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Stage 4 Policy & Safety Gate Authorization
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Safety Guardrails
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Independent 9-rule policy engine validating AI recommendations before Stage 5 execution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Evaluated Decisions</span>
            <div className="text-sm font-extrabold text-white">{totalEvaluated} Recommendations</div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        
        {/* 1. Allowed Recommendations */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ALLOWED
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {allowedCount} <span className="text-xs text-slate-400 font-normal">decisions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Approved by safety guardrails
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-emerald-400">
              {totalEvaluated > 0 ? Math.round((allowedCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 2. Blocked Recommendations */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
              <XCircle className="h-4 w-4" /> BLOCKED
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {blockedCount} <span className="text-xs text-slate-400 font-normal">decisions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Denied by safety rules
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-rose-400">
              {totalEvaluated > 0 ? Math.round((blockedCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 3. Review Status */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> REVIEW
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {reviewCount} <span className="text-xs text-slate-400 font-normal">decisions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Assigned REVIEW status
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-amber-400">
              {totalEvaluated > 0 ? Math.round((reviewCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 4. Human Review Required */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" /> HUMAN REVIEW
            </span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {humanReviewCount} <span className="text-xs text-slate-400 font-normal">cases</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Routed to merchant operations
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-amber-300">
              {totalEvaluated > 0 ? Math.round((humanReviewCount / totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Breakdown Grid */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
          Policy Evaluation Breakdown by AI Recommendation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          
          {/* RETRY PAYMENT Policy Breakdown */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">RETRY PAYMENT</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-emerald-400 font-medium">Allowed: <strong>{actionBreakdown.retryPayment.allowed}</strong></span>
              <span className="text-rose-400 font-medium">Blocked: <strong>{actionBreakdown.retryPayment.blocked}</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Blocked on high value (&gt; ₹25k), attempt #3+, or non-recoverable.
            </p>
          </div>

          {/* CUSTOMER ACTION Policy Breakdown */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">CUSTOMER ACTION</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-emerald-400 font-medium">Allowed: <strong>{actionBreakdown.requestCustomerAction.allowed}</strong></span>
              <span className="text-rose-400 font-medium">Blocked: <strong>{actionBreakdown.requestCustomerAction.blocked}</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Conceptually approved; zero dispatches sent in Stage 4.
            </p>
          </div>

          {/* ESCALATE Policy Breakdown */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">ESCALATE TO MERCHANT</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-amber-400 font-medium">Review: <strong>{actionBreakdown.escalate.allowed}</strong></span>
              <span className="text-rose-400 font-medium">Blocked: <strong>{actionBreakdown.escalate.blocked}</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Routed to merchant operations queue for human review.
            </p>
          </div>

          {/* STOP Policy Breakdown */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-200">STOP AUTOMATED RECOVERY</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-emerald-400 font-medium">Allowed: <strong>{actionBreakdown.stop.allowed}</strong></span>
              <span className="text-rose-400 font-medium">Blocked: <strong>{actionBreakdown.stop.blocked}</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Halting automated recovery is always permitted by policy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <span>
          Policy Engine operates independently of AI recommendations. High-value retries (&gt; ₹25,000) and excessive attempts (#3+) are strictly blocked.
        </span>
      </div>
    </div>
  );
};
