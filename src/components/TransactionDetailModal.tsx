import React, { useState } from 'react';
import type { PaymentRecord, RecoveryAction, PolicyStatus, ExecutionStatus } from '../types/payment';
import { formatINR } from '../services/metrics';
import { ActionExecutor } from '../modules/actionExecutor';
import {
  X,
  User,
  Mail,
  History,
  AlertOctagon,
  Bot,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  OctagonX,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Lock,
  Play,
  FileText,
  HelpCircle as QuestionIcon,
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: PaymentRecord | null;
  onClose: () => void;
}

const actionExecutor = new ActionExecutor();

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const risk = transaction.riskAnalysis;
  const decision = transaction.aiDecision;
  const policy = transaction.policyDecision;

  // Local simulation execution state for user-triggered "Run Demo Simulation"
  const [localExecuted, setLocalExecuted] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState(transaction.executionResult);

  const handleRunSimulation = () => {
    if (!decision || !policy) return;
    const result = actionExecutor.executeAction(transaction, decision, policy);
    setActiveResult(result);
    setLocalExecuted(true);
  };

  const getWhyThisDecisionBullets = () => {
    if (!risk || !decision || !policy) return [];

    const bullets: string[] = [];

    if (transaction.previous_successful_payments.count >= 1) {
      bullets.push(
        `The customer has successfully paid before (${transaction.previous_successful_payments.count} prior orders totaling ${formatINR(transaction.previous_successful_payments.total_amount)}).`
      );
    } else {
      bullets.push('The customer has 0 previous successful payment history.');
    }

    if (transaction.failure_reason === 'Temporary processing failure' || transaction.failure_reason === 'Bank/server issue') {
      bullets.push(`The failure reason ("${transaction.failure_reason}") appears temporary and recoverable.`);
    } else if (transaction.failure_reason === 'Authentication failure' || transaction.failure_reason === 'Payment method issue') {
      bullets.push(`The failure reason ("${transaction.failure_reason}") indicates customer intervention is required.`);
    } else {
      bullets.push(`The failure reason is categorized as "${transaction.failure_reason}".`);
    }

    if (risk.recoverability === 'RECOVERABLE') {
      bullets.push('This failure is evaluated as RECOVERABLE.');
    } else if (risk.recoverability === 'NON_RECOVERABLE') {
      bullets.push('This failure is evaluated as NON-RECOVERABLE.');
    } else {
      bullets.push('Recoverability signal is UNCERTAIN.');
    }

    if (transaction.amount > 25000) {
      bullets.push(`The transaction amount (${formatINR(transaction.amount)}) exceeds the ₹25,000 high-value policy safety threshold.`);
    } else {
      bullets.push(`The transaction amount (${formatINR(transaction.amount)}) represents meaningful revenue exposure.`);
    }

    return bullets;
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-4 w-4 mr-1.5" /> FAILED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-4 w-4 mr-1.5" /> PENDING
          </span>
        );
      default:
        return null;
    }
  };

  const renderRiskLevelBadge = (level?: string) => {
    switch (level) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            LOW RISK
          </span>
        );
      default:
        return null;
    }
  };

  const renderRecoverabilityBadge = (rec?: string) => {
    switch (rec) {
      case 'RECOVERABLE':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> RECOVERABLE
          </span>
        );
      case 'NON_RECOVERABLE':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" /> NON-RECOVERABLE
          </span>
        );
      case 'UNCERTAIN':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> UNCERTAIN
          </span>
        );
      default:
        return null;
    }
  };

  const renderPriorityBadge = (prio?: string) => {
    switch (prio) {
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            HIGH PRIORITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            MEDIUM PRIORITY
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700">
            LOW PRIORITY
          </span>
        );
      default:
        return null;
    }
  };

  const renderActionBadgeLarge = (action?: RecoveryAction) => {
    switch (action) {
      case 'RETRY_PAYMENT':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 gap-1.5 shadow-sm">
            <RefreshCw className="h-4 w-4 text-emerald-400" /> RETRY PAYMENT
          </span>
        );
      case 'REQUEST_CUSTOMER_ACTION':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 gap-1.5 shadow-sm">
            <UserCheck className="h-4 w-4 text-amber-400" /> REQUEST CUSTOMER ACTION
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 gap-1.5 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-purple-400" /> ESCALATE TO MERCHANT
          </span>
        );
      case 'STOP':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 gap-1.5 shadow-sm">
            <OctagonX className="h-4 w-4 text-rose-400" /> STOP AUTOMATED RECOVERY
          </span>
        );
      default:
        return null;
    }
  };

  const renderPolicyStatusBadgeLarge = (status?: PolicyStatus) => {
    switch (status) {
      case 'ALLOWED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 gap-1.5 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> ALLOWED BY POLICY
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 gap-1.5 shadow-sm">
            <XCircle className="h-4 w-4 text-rose-400" /> BLOCKED BY POLICY GATE
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 gap-1.5 shadow-sm">
            <User className="h-4 w-4 text-amber-400" /> MERCHANT REVIEW REQUIRED
          </span>
        );
      default:
        return null;
    }
  };

  const renderExecutionBadge = (status?: ExecutionStatus) => {
    switch (status) {
      case 'SIMULATED_SUCCESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> SIMULATED_SUCCESS
          </span>
        );
      case 'SIMULATED_FAILURE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 gap-1">
            <XCircle className="h-3.5 w-3.5 text-rose-400" /> SIMULATED_FAILURE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 gap-1">
            <Lock className="h-3.5 w-3.5 text-amber-400" /> NOT EXECUTED (BLOCKED)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            NOT EXECUTED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Slide-over panel container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl min-h-screen p-6 overflow-y-auto flex flex-col justify-between">
        
        {/* Header Bar */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Transaction Details</h2>
                {renderStatusBadge(transaction.status)}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{transaction.transaction_id}</p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Amount</span>
              <div className="text-lg font-extrabold text-white mt-0.5">{formatINR(transaction.amount)}</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Method</span>
              <div className="text-sm font-semibold text-slate-200 mt-1">{transaction.payment_method}</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Attempt #</span>
              <div className="text-sm font-semibold text-slate-200 mt-1">{transaction.attempt_number} of 4</div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Order ID</span>
              <div className="text-xs font-mono text-slate-300 mt-1 truncate">{transaction.order_id}</div>
            </div>
          </div>

          {/* Gateway Failure Reason Card */}
          {transaction.failure_reason && (
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4 mb-5">
              <div className="flex items-start space-x-3">
                <AlertOctagon className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Gateway Failure Reason</h4>
                  <p className="text-sm font-semibold text-rose-100 mt-0.5">{transaction.failure_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 7: "WHY THIS DECISION?" HUMAN-READABLE EXPLANATION BOX */}
          {transaction.status !== 'SUCCESS' && decision && policy && (
            <div className="bg-slate-950/90 border-2 border-indigo-500/40 rounded-xl p-5 mb-5 space-y-3 shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <QuestionIcon className="h-4 w-4 text-indigo-400" />
                Why RecoverAI Chose This Decision
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
                {getWhyThisDecisionBullets().map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Recommended Action: <strong className="text-indigo-300">{decision.action}</strong></span>
                <span className="text-slate-400">Safety Authorization: <strong className={policy.allowed ? 'text-emerald-400' : 'text-rose-400'}>{policy.status}</strong></span>
              </div>
            </div>
          )}

          {/* STAGE 7: SAFETY POLICY BANNER CALLOUT */}
          {transaction.status !== 'SUCCESS' && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-300 font-medium">
                <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold">AI Recommendation ≠ Authorization:</strong> The AI recommends an action. The Policy & Safety Gate independently authorizes whether that action is allowed.
                </div>
              </div>
            </div>
          )}

          {/* STAGE 6: AUDIT TRAIL TIMELINE SECTION */}
          {transaction.status !== 'SUCCESS' && transaction.auditRecord && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 mb-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Audit Trail & Decision Timeline
                    </h3>
                    <p className="text-[11px] text-blue-300/80 font-mono">
                      {transaction.auditRecord.auditId}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full">
                  100% TRACEABLE
                </span>
              </div>

              {/* Lifecycle Vertical Timeline */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {/* Step 1: Risk Analyzed */}
                <div className="relative flex items-start space-x-3">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-[10px] font-bold text-purple-300">
                    1
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 w-full text-xs space-y-1">
                    <div className="font-bold text-purple-300 flex items-center justify-between">
                      <span>● Risk Analyzed</span>
                      <span className="text-[10px] text-slate-500 font-mono">Stage 2</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      Risk Score: <strong className="text-white">{transaction.auditRecord.risk.riskScore}</strong> | Level: <strong className="text-purple-300">{transaction.auditRecord.risk.riskLevel}</strong> | Recoverability: <strong className="text-emerald-300">{transaction.auditRecord.risk.recoverability}</strong>
                    </div>
                  </div>
                </div>

                {/* Step 2: AI Decision */}
                <div className="relative flex items-start space-x-3">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                    2
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 w-full text-xs space-y-1">
                    <div className="font-bold text-indigo-300 flex items-center justify-between">
                      <span>● AI Decision</span>
                      <span className="text-[10px] text-slate-500 font-mono">Stage 3</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      Recommended: <strong className="text-indigo-300">{transaction.auditRecord.aiDecision.action}</strong> | Confidence: <strong className="text-emerald-400">{transaction.auditRecord.aiDecision.confidence}%</strong>
                    </div>
                  </div>
                </div>

                {/* Step 3: Policy Evaluated */}
                <div className="relative flex items-start space-x-3">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                    3
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 w-full text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center justify-between">
                      <span>● Policy Evaluated</span>
                      <span className="text-[10px] text-slate-500 font-mono">Stage 4</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      Status: <strong className={transaction.auditRecord.policy.status === 'ALLOWED' ? 'text-emerald-400' : transaction.auditRecord.policy.status === 'BLOCKED' ? 'text-rose-400' : 'text-amber-400'}>{transaction.auditRecord.policy.status}</strong> | Human Review: <strong className={transaction.auditRecord.policy.requiresHumanReview ? 'text-amber-400 font-bold' : 'text-slate-400'}>{transaction.auditRecord.policy.requiresHumanReview ? 'YES (HUMAN REVIEW REQUIRED)' : 'NO'}</strong>
                    </div>
                  </div>
                </div>

                {/* Step 4: Action Executed / Blocked */}
                <div className="relative flex items-start space-x-3">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    transaction.auditRecord.execution.executed
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    4
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 w-full text-xs space-y-1">
                    <div className="font-bold text-amber-300 flex items-center justify-between">
                      <span>● {transaction.auditRecord.execution.executed ? 'Action Executed' : 'Action Blocked'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Stage 5</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      Status: <strong className="text-white">{transaction.auditRecord.execution.status}</strong>
                      {transaction.auditRecord.execution.simulatedRecoveredAmount > 0 && (
                        <span> | Recovered: <strong className="text-emerald-400">{formatINR(transaction.auditRecord.execution.simulatedRecoveredAmount)} DEMO VALUE</strong></span>
                      )}
                      {!transaction.auditRecord.execution.executed && (
                        <span className="text-slate-400"> | No action executed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: ACTION EXECUTOR SECTION */}
          {transaction.status !== 'SUCCESS' && policy && (
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/50 border-2 border-amber-500/40 rounded-xl p-5 mb-5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30 text-amber-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Action Executor (Safe Simulation Mode)
                    </h3>
                    <p className="text-[11px] text-amber-300/80">
                      Downstream Execution Layer • 100% Offline Simulation
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Execution ID</span>
                  <div className="text-xs font-mono font-bold text-amber-300">
                    EXE-DEMO-{transaction.transaction_id.substring(4)}
                  </div>
                </div>
              </div>

              {/* Status Header */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    SIMULATED EXECUTION STATUS
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                    SIMULATION MODE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>{renderExecutionBadge(localExecuted ? activeResult?.status : activeResult?.status)}</div>
                  {activeResult?.simulatedRecoveredAmount && activeResult.simulatedRecoveredAmount > 0 ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase">Recovered Revenue</span>
                      <div className="text-sm font-extrabold text-emerald-400">
                        {formatINR(activeResult.simulatedRecoveredAmount)} <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1 py-0.5 rounded">DEMO VALUE</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Simulation Result Message */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  Simulation Result Narrative
                </h4>
                <p className="text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {activeResult?.message || (policy.allowed && policy.status === 'ALLOWED' ? 'Ready for user-triggered simulation execution.' : policy.reason)}
                </p>
                <div className="text-[11px] text-slate-400 italic">
                  * No real payment was processed. No real customers were contacted.
                </div>
              </div>

              {/* User-Triggered "Run Demo Simulation" Control */}
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {policy.allowed && policy.status === 'ALLOWED'
                    ? 'Click button to run demo simulation preview.'
                    : 'Simulation controls disabled due to Policy Gate decision.'}
                </div>

                {policy.allowed && policy.status === 'ALLOWED' ? (
                  <button
                    onClick={handleRunSimulation}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      localExecuted
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    }`}
                  >
                    {localExecuted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Simulation Completed
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Run Demo Simulation
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg border border-slate-700 opacity-60 cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    {policy.status === 'REVIEW' ? 'Requires Human Review' : 'Blocked by Policy'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 4: POLICY & SAFETY GATE SECTION */}
          {transaction.status !== 'SUCCESS' && policy && (
            <div className={`border-2 rounded-xl p-5 mb-5 space-y-4 shadow-sm ${
              policy.status === 'ALLOWED'
                ? 'bg-slate-950/90 border-emerald-500/40'
                : policy.status === 'BLOCKED'
                ? 'bg-slate-950/90 border-rose-500/50'
                : 'bg-slate-950/90 border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg border ${
                    policy.status === 'ALLOWED'
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : policy.status === 'BLOCKED'
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                      : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  }`}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Policy & Safety Gate
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Independent Authorization Checkpoint
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Human Review</span>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      policy.requiresHumanReview
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {policy.requiresHumanReview ? 'REQUIRED' : 'NOT REQUIRED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy Decision Display Header */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Policy Evaluation Result
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    Rules Triggered: <strong className="text-indigo-400">{policy.rulesTriggered.join(', ') || 'None'}</strong>
                  </span>
                </div>
                <div>{renderPolicyStatusBadgeLarge(policy.status)}</div>
              </div>

              {/* Policy Explanation & Details */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div>
                  <h4 className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Info className="h-3.5 w-3.5 text-indigo-400" />
                    Policy Gate Reasoning
                  </h4>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {policy.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: AI RECOVERY DECISION SECTION */}
          {transaction.status !== 'SUCCESS' && decision && (
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-xl p-5 mb-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-400">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      AI Recovery Decision
                    </h3>
                    <p className="text-[11px] text-indigo-300/80">
                      Stage 3 AI Recovery Agent Advisory Input
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Confidence Rating</span>
                  <div className="text-base font-extrabold text-emerald-400">
                    {decision.confidence}%
                  </div>
                </div>
              </div>

              {/* Recommended Action Display */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    RECOMMENDED ACTION <span className="text-indigo-400/80 font-normal">(Advisory Only)</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Confidence: {decision.confidence}%
                  </span>
                </div>
                <div>{renderActionBadgeLarge(decision.action)}</div>
              </div>
            </div>
          )}

          {/* STAGE 2: REVENUE RISK ANALYSIS SECTION */}
          {transaction.status !== 'SUCCESS' && risk && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 mb-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 text-purple-300">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">Revenue Risk Analysis</h3>
                    <p className="text-[11px] text-slate-400">
                      Stage 2 Risk Diagnostic Input Signal
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Revenue at Risk</span>
                  <div className="text-base font-extrabold text-rose-400">
                    {formatINR(risk.revenueAtRisk)}
                  </div>
                </div>
              </div>

              {/* Metrics Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Risk Score</span>
                  <div className="text-lg font-extrabold text-white mt-0.5">
                    {risk.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Risk Level</span>
                  {renderRiskLevelBadge(risk.riskLevel)}
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Recoverability</span>
                  {renderRecoverabilityBadge(risk.recoverability)}
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Recovery Priority</span>
                  {renderPriorityBadge(risk.recoveryPriority)}
                </div>
              </div>
            </div>
          )}

          {/* Customer Information Card */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 mb-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" /> Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Customer Name:</span>
                <p className="font-semibold text-slate-200">{transaction.customer_name}</p>
              </div>

              <div>
                <span className="text-slate-500">Customer Email:</span>
                <p className="font-semibold text-slate-200 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" /> {transaction.customer_email}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Customer ID:</span>
                <p className="font-mono text-slate-300">{transaction.customer_id}</p>
              </div>

              <div>
                <span className="text-slate-500">Timestamp:</span>
                <p className="font-mono text-slate-300">{new Date(transaction.timestamp).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Previous Successful Payments */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <History className="h-4 w-4 text-emerald-400" />
                <span>Previous Successful Payments:</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-400">{transaction.previous_successful_payments.count} orders</span>
                <span className="text-slate-500 ml-1.5">({formatINR(transaction.previous_successful_payments.total_amount)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
