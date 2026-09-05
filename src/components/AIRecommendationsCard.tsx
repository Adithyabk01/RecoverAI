import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { Bot, RefreshCw, UserCheck, AlertTriangle, OctagonX, Info, Sparkles } from 'lucide-react';

interface AIRecommendationsCardProps {
  metrics: DashboardMetrics;
}

export const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({ metrics }) => {
  const { recommendationDistribution } = metrics;
  const { retryPayment, requestCustomerAction, escalate, stop } = recommendationDistribution;

  const totalRecommended = retryPayment + requestCustomerAction + escalate + stop;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Stage 3 AI Recovery Recommendations
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Dataset Overview
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic rule-based recovery decisions for all at-risk transactions.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Evaluated Transactions</div>
          <div className="text-base font-extrabold text-indigo-400">{totalRecommended} At-Risk Payments</div>
        </div>
      </div>

      {/* Grid of 4 Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        
        {/* 1. RETRY PAYMENT */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <RefreshCw className="h-4 w-4" /> RETRY PAYMENT
            </span>
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
              {totalRecommended > 0 ? Math.round((retryPayment / totalRecommended) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {retryPayment} <span className="text-xs text-slate-400 font-normal">payments</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Controlled gateway retry recommended for transient errors with good LTV signals.
          </p>
        </div>

        {/* 2. REQUEST CUSTOMER ACTION */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <UserCheck className="h-4 w-4" /> CUSTOMER ACTION
            </span>
            <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
              {totalRecommended > 0 ? Math.round((requestCustomerAction / totalRecommended) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {requestCustomerAction} <span className="text-xs text-slate-400 font-normal">payments</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            2FA completion or payment method update required from the customer.
          </p>
        </div>

        {/* 3. ESCALATE */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <AlertTriangle className="h-4 w-4" /> ESCALATE
            </span>
            <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
              {totalRecommended > 0 ? Math.round((escalate / totalRecommended) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {escalate} <span className="text-xs text-slate-400 font-normal">payments</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            High ticket or uncertain failure cases routed for manual merchant review.
          </p>
        </div>

        {/* 4. STOP */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-500/30 hover:border-rose-500/50 transition-colors space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
              <OctagonX className="h-4 w-4" /> STOP
            </span>
            <span className="text-[10px] font-semibold bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
              {totalRecommended > 0 ? Math.round((stop / totalRecommended) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stop} <span className="text-xs text-slate-400 font-normal">payments</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Automated recovery halted due to non-recoverability or max attempt guardrails (#4).
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          Recommendations are purely advisory. Stage 4 Policy & Safety Gate will validate decisions before execution.
        </span>
        <span className="text-indigo-400 font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Fully Advisory Mode
        </span>
      </div>
    </div>
  );
};
