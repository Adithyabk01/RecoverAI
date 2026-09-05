import React, { useMemo } from 'react';
import type { PaymentRecord } from '../types/payment';
import { formatINR } from '../services/metrics';
import { Sparkles, X, ArrowRight, Lock, UserCheck, OctagonX, CheckCircle2, AlertTriangle } from 'lucide-react';

interface JudgeDemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PaymentRecord[];
  onSelectTransaction: (record: PaymentRecord) => void;
}

export const JudgeDemoScenariosModal: React.FC<JudgeDemoScenariosModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectTransaction,
}) => {
  if (!isOpen) return null;

  // Find representative records for Scenarios A, B, C, D, E from existing deterministic 1,000 dataset
  const scenarios = useMemo(() => {
    // Scenario A: Safe Retry
    const scenarioA = records.find(
      (r) =>
        r.auditRecord &&
        r.auditRecord.aiDecision.action === 'RETRY_PAYMENT' &&
        r.auditRecord.policy.status === 'ALLOWED' &&
        r.auditRecord.execution.status === 'SIMULATED_SUCCESS'
    );

    // Scenario B: Safety Block
    const scenarioB = records.find(
      (r) =>
        r.auditRecord &&
        r.auditRecord.aiDecision.action === 'RETRY_PAYMENT' &&
        r.auditRecord.policy.status === 'BLOCKED'
    );

    // Scenario C: Human Review
    const scenarioC = records.find(
      (r) =>
        r.auditRecord &&
        r.auditRecord.aiDecision.action === 'ESCALATE' &&
        r.auditRecord.policy.status === 'REVIEW'
    );

    // Scenario D: Customer Action
    const scenarioD = records.find(
      (r) =>
        r.auditRecord &&
        r.auditRecord.aiDecision.action === 'REQUEST_CUSTOMER_ACTION' &&
        r.auditRecord.policy.status === 'ALLOWED'
    );

    // Scenario E: STOP
    const scenarioE = records.find(
      (r) =>
        r.auditRecord &&
        r.auditRecord.aiDecision.action === 'STOP' &&
        r.auditRecord.policy.status === 'ALLOWED'
    );

    return [
      {
        id: 'A',
        title: 'Scenario A — Safe Retry',
        badge: 'ALLOWED & SUCCESS',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        desc: 'AI recommends RETRY_PAYMENT on transient failure. Policy authorizes execution. Simulation succeeds.',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
        record: scenarioA,
      },
      {
        id: 'B',
        title: 'Scenario B — Safety Policy Block',
        badge: 'BLOCKED BY POLICY GATE',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        desc: 'AI recommends RETRY_PAYMENT, but Policy Gate BLOCKS execution (High value > ₹25k or Max attempts reached). AI cannot bypass safety.',
        icon: <Lock className="h-5 w-5 text-rose-400" />,
        record: scenarioB,
      },
      {
        id: 'C',
        title: 'Scenario C — Merchant Human Review',
        badge: 'REQUIRES HUMAN REVIEW',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        desc: 'AI recommends ESCALATE. Policy assigns REVIEW status requiring human authorization before any execution.',
        icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
        record: scenarioC,
      },
      {
        id: 'D',
        title: 'Scenario D — Customer Action Workflow',
        badge: 'ALLOWED (₹0 RECOVERED)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        desc: 'AI recommends REQUEST_CUSTOMER_ACTION (2FA/Auth drop-off). Prepares simulated workflow, ₹0 revenue claimed, zero messages sent.',
        icon: <UserCheck className="h-5 w-5 text-amber-400" />,
        record: scenarioD,
      },
      {
        id: 'E',
        title: 'Scenario E — Safe Autonomous STOP',
        badge: 'SAFE STOP (₹0 RECOVERED)',
        badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        desc: 'AI recommends STOP due to repeated attempts or non-recoverable status. Policy ALLOWS safe halt. Zero further retries attempted.',
        icon: <OctagonX className="h-5 w-5 text-slate-400" />,
        record: scenarioE,
      },
    ];
  }, [records]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Recommended Judge Demo Scenarios</h2>
              <p className="text-xs text-slate-400">Select any scenario to launch its corresponding transaction detail drawer from the dataset.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="space-y-3.5 mb-6">
          {scenarios.map((sc) => {
            const rec = sc.record;
            if (!rec) return null;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectTransaction(rec);
                  onClose();
                }}
                className="bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                    {sc.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{sc.title}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${sc.badgeColor}`}>
                        {sc.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sc.desc}</p>
                    <div className="flex items-center space-x-3 mt-2 text-[11px] font-mono text-slate-500">
                      <span>TXN: <strong className="text-slate-300">{rec.transaction_id}</strong></span>
                      <span>Amount: <strong className="text-slate-300">{formatINR(rec.amount)}</strong></span>
                      <span>Method: <strong className="text-slate-300">{rec.payment_method}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  className="px-3.5 py-2 bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white border border-indigo-500/30 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer self-end sm:self-center min-w-[130px]"
                >
                  <span>Launch Drawer</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="italic">All scenarios are drawn directly from the deterministic 1,000 synthetic dataset.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Scenarios
          </button>
        </div>
      </div>
    </div>
  );
};
