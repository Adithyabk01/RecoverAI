import React from 'react';
import type { DashboardMetrics, PaymentRecord } from '../types/payment';
import { formatINR } from '../services/metrics';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Clock, Zap, ArrowRight, UserCheck } from 'lucide-react';

interface AuditTrailCardProps {
  metrics: DashboardMetrics;
  records: PaymentRecord[];
  onSelectTransaction?: (record: PaymentRecord) => void;
}

export const AuditTrailCard: React.FC<AuditTrailCardProps> = ({ metrics, records, onSelectTransaction }) => {
  const { auditSummary } = metrics;

  // Filter recovery-eligible records that have audit records, sorted by timestamp descending
  const recentAudits = records
    .filter((r) => r.auditRecord && r.status !== 'SUCCESS')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Audit Trail & Decision History</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                Stage 6 • 100% Traceable
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete, explainable audit records of risk analyses, AI decisions, policy evaluations, and execution results.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl font-mono">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span>Storage: <strong className="text-slate-200 font-semibold">recoverai_audit_trail</strong></span>
        </div>
      </div>

      {/* Grid: Dataset-Wide Audit Stats & Recovery Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Box: Dataset-Wide Audit Summary */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-400" />
              Audit Summary (Complete 1,000 Dataset)
            </h4>
            <span className="text-[10px] font-semibold text-slate-400">Fixed Baseline</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-medium text-slate-400">Transactions Audited</div>
              <div className="text-lg font-bold text-white mt-1 font-mono">{auditSummary.transactionsAudited}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-medium text-slate-400">AI Decisions</div>
              <div className="text-lg font-bold text-indigo-400 mt-1 font-mono">{auditSummary.aiDecisionsRecorded}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-medium text-slate-400">Policy Evaluations</div>
              <div className="text-lg font-bold text-purple-400 mt-1 font-mono">{auditSummary.policyEvaluations}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-emerald-500/20">
              <div className="text-[10px] font-medium text-emerald-400/90">Actions Executed</div>
              <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">{auditSummary.actionsExecuted}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-rose-500/20">
              <div className="text-[10px] font-medium text-rose-400/90">Actions Blocked</div>
              <div className="text-lg font-bold text-rose-400 mt-1 font-mono">{auditSummary.actionsBlocked}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-amber-500/20">
              <div className="text-[10px] font-medium text-amber-400/90">Human Reviews</div>
              <div className="text-lg font-bold text-amber-400 mt-1 font-mono">{auditSummary.humanReviews}</div>
            </div>
          </div>
        </div>

        {/* Right Box: Recovery Outcomes */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
              <Zap className="h-4 w-4 mr-1.5 text-amber-400" />
              Recovery Outcomes
            </h4>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              SIMULATED VALUE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-medium text-slate-400">Retry Attempts</div>
              <div className="text-base font-bold text-white mt-1 font-mono">{auditSummary.simulatedRetryAttempts}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-emerald-500/20">
              <div className="text-[10px] font-medium text-emerald-400">Successful Retries</div>
              <div className="text-base font-bold text-emerald-400 mt-1 font-mono">{auditSummary.successfulSimulations}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-rose-500/20">
              <div className="text-[10px] font-medium text-rose-400">Failed Retries</div>
              <div className="text-base font-bold text-rose-400 mt-1 font-mono">{auditSummary.failedSimulations}</div>
            </div>
          </div>

          {/* Revenue Recovered Box */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-emerald-400">Demo Revenue Recovered</div>
              <div className="text-xl font-black text-emerald-300 font-mono tracking-tight mt-0.5">
                {formatINR(auditSummary.demoRevenueRecovered, true)}
                <span className="text-[11px] font-bold text-emerald-400/80 ml-2">DEMO VALUE</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 max-w-[160px] leading-tight">
              Only successful simulated <code className="text-emerald-300">RETRY_PAYMENT</code> executions contribute.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Audit Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
            Recent Audit Activity
          </h4>
          <span className="text-[11px] text-slate-400">Deterministic Event Timeline</span>
        </div>

        <div className="space-y-2">
          {recentAudits.map((rec) => {
            const audit = rec.auditRecord!;
            return (
              <div
                key={rec.transaction_id}
                onClick={() => onSelectTransaction?.(rec)}
                className="bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-[200px]">
                  <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                    {audit.auditId}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{rec.transaction_id}</div>
                    <div className="text-[11px] text-slate-400">{rec.customer_name} • {formatINR(rec.amount)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* AI Action Badge */}
                  <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                    AI: {audit.aiDecision.action}
                  </span>

                  {/* Policy Badge */}
                  {audit.policy.status === 'ALLOWED' && (
                    <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> POLICY: ALLOWED
                    </span>
                  )}
                  {audit.policy.status === 'BLOCKED' && (
                    <span className="inline-flex items-center text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      <XCircle className="h-3 w-3 mr-1" /> POLICY: BLOCKED
                    </span>
                  )}
                  {audit.policy.status === 'REVIEW' && (
                    <span className="inline-flex items-center text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="h-3 w-3 mr-1" /> POLICY: REVIEW
                    </span>
                  )}

                  {/* Execution Badge */}
                  {audit.execution.status === 'SIMULATED_SUCCESS' && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      EXECUTION: SIMULATED_SUCCESS
                    </span>
                  )}
                  {audit.execution.status === 'SIMULATED_FAILURE' && (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      EXECUTION: SIMULATED_FAILURE
                    </span>
                  )}
                  {(audit.execution.status === 'BLOCKED' || audit.execution.status === 'NOT_EXECUTED') && (
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      EXECUTION: NOT_EXECUTED
                    </span>
                  )}

                  {/* Human Review Required Badge */}
                  {audit.policy.requiresHumanReview && (
                    <span className="inline-flex items-center text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full">
                      <UserCheck className="h-3 w-3 mr-1" /> HUMAN REVIEW REQUIRED
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-xs">
                  <span>Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
