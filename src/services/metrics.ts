import type { PaymentRecord, DashboardMetrics } from '../types/payment';
import { RevenueRiskDetector } from '../modules/riskDetector';
import { AIRecoveryAgent } from '../modules/aiAgent';
import { PolicySafetyEngine } from '../modules/policyEngine';
import { ActionExecutor } from '../modules/actionExecutor';
import { auditTrailService } from '../modules/auditTrail';

const riskDetector = new RevenueRiskDetector();
const aiAgent = new AIRecoveryAgent();
const policyEngine = new PolicySafetyEngine();
const actionExecutor = new ActionExecutor();

/**
 * Computes metrics strictly from the complete dataset.
 * Requirement: Dashboard metrics, risk distributions, AI recommendations, Policy gate summaries,
 * Action Executor simulation totals, and Audit Trail summaries must ALWAYS represent the complete dataset regardless of table filters or search.
 */
export function calculateDashboardMetrics(records: PaymentRecord[]): DashboardMetrics {
  const totalPayments = records.length;
  let totalTransactionValue = 0;
  let failedPaymentsCount = 0;
  let failedPaymentsValue = 0;
  let revenueAtRisk = 0;
  let demoRecoveryPotential = 0;

  // Distribution aggregates across dataset
  const riskDistribution = {
    high: { count: 0, amount: 0 },
    medium: { count: 0, amount: 0 },
    low: { count: 0, amount: 0 },
  };

  const priorityDistribution = {
    high: { count: 0, amount: 0 },
    medium: { count: 0, amount: 0 },
    low: { count: 0, amount: 0 },
  };

  const recommendationDistribution = {
    retryPayment: 0,
    requestCustomerAction: 0,
    escalate: 0,
    stop: 0,
  };

  const policySummary = {
    allowedCount: 0,
    blockedCount: 0,
    humanReviewCount: 0,
    actionBreakdown: {
      retryPayment: { allowed: 0, blocked: 0 },
      requestCustomerAction: { allowed: 0, blocked: 0 },
      escalate: { allowed: 0, blocked: 0 },
      stop: { allowed: 0, blocked: 0 },
    },
  };

  const executionSummary = {
    approvedActionsCount: 0,
    blockedActionsCount: 0,
    simulatedSuccessCount: 0,
    simulatedFailureCount: 0,
    demoRevenueRecovered: 0,
  };

  const auditSummary = {
    transactionsAudited: 0,
    aiDecisionsRecorded: 0,
    policyEvaluations: 0,
    actionsExecuted: 0,
    actionsBlocked: 0,
    humanReviews: 0,
    simulatedRetryAttempts: 0,
    successfulSimulations: 0,
    failedSimulations: 0,
    demoRevenueRecovered: 0,
  };

  for (const record of records) {
    totalTransactionValue += record.amount;

    // Attach Stage 2 risk analysis
    const riskAnalysis = record.riskAnalysis || riskDetector.analyzeRisk(record);
    record.riskAnalysis = riskAnalysis;

    // Attach Stage 3 AI recovery decision
    const aiDecision = record.aiDecision || aiAgent.planRecovery(record, riskAnalysis);
    record.aiDecision = aiDecision;

    if (record.status === 'FAILED') {
      failedPaymentsCount++;
      failedPaymentsValue += record.amount;
      revenueAtRisk += record.amount;

      if (riskAnalysis.recoverability === 'RECOVERABLE') {
        demoRecoveryPotential += record.amount * 0.75;
      } else if (riskAnalysis.recoverability === 'UNCERTAIN') {
        demoRecoveryPotential += record.amount * 0.40;
      }
    } else if (record.status === 'PENDING') {
      revenueAtRisk += Math.floor(record.amount * 0.5);
      if (riskAnalysis.recoverability === 'RECOVERABLE') {
        demoRecoveryPotential += record.amount * 0.50;
      }
    }

    // Only FAILED/PENDING transactions flow through Stage 2 Risk, Stage 3 AI, Stage 4 Policy, Stage 5 Executor, and Stage 6 Audit
    if (record.status !== 'SUCCESS') {
      // Stage 4 Policy & Safety Gate Validation
      const policyDecision = record.policyDecision || policyEngine.validatePolicy(record, riskAnalysis, aiDecision);
      record.policyDecision = policyDecision;

      // Stage 5 Action Executor Simulation Preview
      const executionResult = record.executionResult || actionExecutor.executeAction(record, aiDecision, policyDecision);
      record.executionResult = executionResult;

      // Stage 6 Audit Trail Record Attachment
      const auditRecord = record.auditRecord || auditTrailService.createAuditRecord(record, riskAnalysis, aiDecision, policyDecision, executionResult);
      record.auditRecord = auditRecord;

      // Risk Distribution
      if (riskAnalysis.riskLevel === 'HIGH') {
        riskDistribution.high.count++;
        riskDistribution.high.amount += riskAnalysis.revenueAtRisk;
      } else if (riskAnalysis.riskLevel === 'MEDIUM') {
        riskDistribution.medium.count++;
        riskDistribution.medium.amount += riskAnalysis.revenueAtRisk;
      } else {
        riskDistribution.low.count++;
        riskDistribution.low.amount += riskAnalysis.revenueAtRisk;
      }

      // Priority Distribution
      if (riskAnalysis.recoveryPriority === 'HIGH') {
        priorityDistribution.high.count++;
        priorityDistribution.high.amount += riskAnalysis.revenueAtRisk;
      } else if (riskAnalysis.recoveryPriority === 'MEDIUM') {
        priorityDistribution.medium.count++;
        priorityDistribution.medium.amount += riskAnalysis.revenueAtRisk;
      } else {
        priorityDistribution.low.count++;
        priorityDistribution.low.amount += riskAnalysis.revenueAtRisk;
      }

      // Stage 3 AI Recommendation Distribution
      switch (aiDecision.action) {
        case 'RETRY_PAYMENT':
          recommendationDistribution.retryPayment++;
          break;
        case 'REQUEST_CUSTOMER_ACTION':
          recommendationDistribution.requestCustomerAction++;
          break;
        case 'ESCALATE':
          recommendationDistribution.escalate++;
          break;
        case 'STOP':
          recommendationDistribution.stop++;
          break;
      }

      // Stage 4 Policy Summary Aggregates
      if (policyDecision.allowed) {
        policySummary.allowedCount++;
      } else {
        policySummary.blockedCount++;
      }

      if (policyDecision.requiresHumanReview) {
        policySummary.humanReviewCount++;
      }

      // Action Breakdown in Policy Gate
      switch (aiDecision.action) {
        case 'RETRY_PAYMENT':
          if (policyDecision.allowed) policySummary.actionBreakdown.retryPayment.allowed++;
          else policySummary.actionBreakdown.retryPayment.blocked++;
          break;
        case 'REQUEST_CUSTOMER_ACTION':
          if (policyDecision.allowed) policySummary.actionBreakdown.requestCustomerAction.allowed++;
          else policySummary.actionBreakdown.requestCustomerAction.blocked++;
          break;
        case 'ESCALATE':
          if (policyDecision.allowed) policySummary.actionBreakdown.escalate.allowed++;
          else policySummary.actionBreakdown.escalate.blocked++;
          break;
        case 'STOP':
          if (policyDecision.allowed) policySummary.actionBreakdown.stop.allowed++;
          else policySummary.actionBreakdown.stop.blocked++;
          break;
      }

      // Stage 5 Execution Summary Aggregates
      if (policyDecision.allowed && policyDecision.status === 'ALLOWED') {
        executionSummary.approvedActionsCount++;
      } else {
        executionSummary.blockedActionsCount++;
      }

      if (executionResult.status === 'SIMULATED_SUCCESS') {
        executionSummary.simulatedSuccessCount++;
      } else if (executionResult.status === 'SIMULATED_FAILURE') {
        executionSummary.simulatedFailureCount++;
      }

      // Demo Revenue Recovered (ONLY RETRY_PAYMENT + SIMULATED_SUCCESS)
      executionSummary.demoRevenueRecovered += executionResult.simulatedRecoveredAmount;

      // Stage 6 Audit Summary Aggregates
      auditSummary.transactionsAudited++;
      auditSummary.aiDecisionsRecorded++;
      auditSummary.policyEvaluations++;

      if (policyDecision.allowed && policyDecision.status === 'ALLOWED') {
        auditSummary.actionsExecuted++;
      } else {
        auditSummary.actionsBlocked++;
      }

      if (policyDecision.requiresHumanReview) {
        auditSummary.humanReviews++;
      }

      if (aiDecision.action === 'RETRY_PAYMENT') {
        auditSummary.simulatedRetryAttempts++;
      }

      if (executionResult.status === 'SIMULATED_SUCCESS') {
        auditSummary.successfulSimulations++;
      } else if (executionResult.status === 'SIMULATED_FAILURE') {
        auditSummary.failedSimulations++;
      }

      auditSummary.demoRevenueRecovered += executionResult.simulatedRecoveredAmount;

    } else {
      // SUCCESS transactions display '—' and do NOT have active policy decisions or execution results
      record.policyDecision = undefined;
      record.executionResult = undefined;
      record.auditRecord = undefined;
    }
  }

  const failureRate = totalPayments > 0 ? (failedPaymentsCount / totalPayments) * 100 : 0;

  return {
    totalPayments,
    totalTransactionValue,
    failedPaymentsCount,
    failedPaymentsValue,
    failureRate,
    revenueAtRisk,
    demoRecoveryPotential: Math.floor(demoRecoveryPotential),
    riskDistribution,
    priorityDistribution,
    recommendationDistribution,
    policySummary,
    executionSummary,
    auditSummary,
  };
}

/**
 * Utility to format INR currency cleanly (e.g. ₹1,24,500 or ₹1.24 Lakh)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (compact && amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
