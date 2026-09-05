import type { PaymentRecord, RiskAnalysis, RiskLevel, Recoverability, RecoveryPriority } from '../../types/payment';

/**
 * Stage 2 Revenue Risk Detector Engine
 * Fully analytical, deterministic rule-based engine.
 * Does NOT execute payment retries, dispatches, links, or external API calls.
 */
export class RevenueRiskDetector {

  public analyzeRisk(payment: PaymentRecord): RiskAnalysis {
    // 1. Success Payments have 0 risk
    if (payment.status === 'SUCCESS') {
      return {
        riskScore: 0,
        riskLevel: 'LOW',
        recoverability: 'NON_RECOVERABLE', // No recovery needed
        recoveryPriority: 'LOW',
        revenueAtRisk: 0,
        reason: 'Transaction succeeded. No revenue at risk.',
        riskExplanation: 'Transaction completed successfully.',
        recoverabilityExplanation: 'No recovery action required for successful payments.',
        priorityExplanation: 'Zero recovery priority required.',
        factors: {
          failureReasonImpact: 0,
          customerHistoryImpact: 0,
          attemptCountImpact: 0,
          amountExposureImpact: 0,
        },
      };
    }

    // 2. Compute Risk Score Component Impacts (0 - 100 scale)
    let failureReasonScore = 40;
    const reason = payment.failure_reason;

    if (reason === 'Temporary processing failure') failureReasonScore = 25;
    else if (reason === 'Authentication failure') failureReasonScore = 35;
    else if (reason === 'Payment timeout') failureReasonScore = 40;
    else if (reason === 'Bank/server issue') failureReasonScore = 45;
    else if (reason === 'Payment method issue') failureReasonScore = 60;
    else if (reason === 'Insufficient funds') failureReasonScore = 80;

    // Customer LTV / History Impact
    const pastCount = payment.previous_successful_payments.count;
    let customerHistoryImpact = 0;
    if (pastCount >= 5) customerHistoryImpact = -25;
    else if (pastCount >= 3) customerHistoryImpact = -15;
    else if (pastCount === 0) customerHistoryImpact = 15;

    // Attempt Count Impact
    let attemptCountImpact = 0;
    if (payment.attempt_number === 2) attemptCountImpact = 10;
    else if (payment.attempt_number === 3) attemptCountImpact = 20;
    else if (payment.attempt_number >= 4) attemptCountImpact = 35;

    // Amount Exposure Impact
    let amountExposureImpact = 0;
    if (payment.amount >= 30000) amountExposureImpact = 15;
    else if (payment.amount >= 10000) amountExposureImpact = 10;
    else if (payment.amount >= 5000) amountExposureImpact = 5;

    // Total raw risk score bounded between 0 and 100
    const rawScore = failureReasonScore + customerHistoryImpact + attemptCountImpact + amountExposureImpact;
    const riskScore = Math.min(100, Math.max(0, rawScore));

    // Determine Risk Level from score
    let riskLevel: RiskLevel = 'LOW';
    if (riskScore >= 70) riskLevel = 'HIGH';
    else if (riskScore >= 40) riskLevel = 'MEDIUM';

    // 3. Determine Recoverability
    let recoverability: Recoverability = 'UNCERTAIN';
    if (payment.attempt_number >= 4) {
      recoverability = 'NON_RECOVERABLE'; // Exceeded max retry threshold
    } else if (
      reason === 'Temporary processing failure' ||
      reason === 'Payment timeout' ||
      reason === 'Bank/server issue' ||
      reason === 'Authentication failure'
    ) {
      recoverability = 'RECOVERABLE';
    } else if (reason === 'Insufficient funds' && pastCount === 0) {
      recoverability = 'NON_RECOVERABLE';
    } else {
      recoverability = 'UNCERTAIN';
    }

    // 4. Determine Recovery Priority (Input signal for Stage 3 AI Agent)
    let recoveryPriority: RecoveryPriority = 'MEDIUM';

    if (recoverability === 'NON_RECOVERABLE' || payment.attempt_number >= 4) {
      recoveryPriority = 'LOW';
    } else if (recoverability === 'RECOVERABLE') {
      if (payment.amount >= 10000 || pastCount >= 3 || riskLevel === 'HIGH') {
        recoveryPriority = 'HIGH';
      } else {
        recoveryPriority = 'MEDIUM';
      }
    } else {
      // UNCERTAIN recoverability
      if (payment.amount >= 25000 && pastCount >= 2) {
        recoveryPriority = 'HIGH';
      } else if (pastCount === 0) {
        recoveryPriority = 'LOW';
      } else {
        recoveryPriority = 'MEDIUM';
      }
    }

    // Revenue at Risk value
    const revenueAtRisk = payment.status === 'FAILED' ? payment.amount : Math.floor(payment.amount * 0.5);

    // 5. Generate Dynamic Explanations
    const riskExplanation = this.generateRiskExplanation(payment, riskScore, riskLevel);
    const recoverabilityExplanation = this.generateRecoverabilityExplanation(payment, recoverability);
    const priorityExplanation = this.generatePriorityExplanation(payment, recoveryPriority, recoverability);

    const summaryReason = `${riskExplanation} ${recoverabilityExplanation}`;

    return {
      riskScore,
      riskLevel,
      recoverability,
      recoveryPriority,
      revenueAtRisk,
      reason: summaryReason,
      riskExplanation,
      recoverabilityExplanation,
      priorityExplanation,
      factors: {
        failureReasonImpact: failureReasonScore,
        customerHistoryImpact,
        attemptCountImpact,
        amountExposureImpact,
      },
    };
  }

  private generateRiskExplanation(payment: PaymentRecord, score: number, level: RiskLevel): string {
    const amountStr = `₹${payment.amount.toLocaleString('en-IN')}`;
    const reasonText = payment.failure_reason || 'unspecified issue';
    const pastCount = payment.previous_successful_payments.count;

    if (level === 'HIGH') {
      return `Payment of ${amountStr} is at HIGH risk (Score: ${score}/100) due to "${reasonText}" on attempt #${payment.attempt_number}${
        pastCount === 0 ? ' with no prior purchase history' : ''
      }.`;
    }
    if (level === 'MEDIUM') {
      return `Payment of ${amountStr} carries MEDIUM risk (Score: ${score}/100) following "${reasonText}".`;
    }
    return `Payment of ${amountStr} has LOW risk exposure (Score: ${score}/100) with strong background signals.`;
  }

  private generateRecoverabilityExplanation(payment: PaymentRecord, recoverability: Recoverability): string {
    const reason = payment.failure_reason;
    const pastCount = payment.previous_successful_payments.count;

    if (recoverability === 'RECOVERABLE') {
      if (reason === 'Authentication failure') {
        return `Authentication failure may be recoverable if the customer successfully completes authentication on a future attempt. Customer has ${pastCount} past successful order(s).`;
      }
      if (reason === 'Temporary processing failure' || reason === 'Bank/server issue' || reason === 'Payment timeout') {
        return `Failure was caused by a transient bank or network issue ("${reason}"). High likelihood of resolution upon subsequent routing.`;
      }
      return `Transaction appears RECOVERABLE based on payment channel diagnostics and customer history.`;
    }

    if (recoverability === 'NON_RECOVERABLE') {
      if (payment.attempt_number >= 4) {
        return `Marked NON_RECOVERABLE because attempt #${payment.attempt_number} reached the maximum safety limit.`;
      }
      return `Marked NON_RECOVERABLE due to persistent balance deficiency on a first-time customer.`;
    }

    return `Recoverability is UNCERTAIN due to "${reason || 'gateway error'}" requiring adaptive AI evaluation in Stage 3.`;
  }

  private generatePriorityExplanation(payment: PaymentRecord, priority: RecoveryPriority, recoverability: Recoverability): string {
    const amountStr = `₹${payment.amount.toLocaleString('en-IN')}`;
    const pastCount = payment.previous_successful_payments.count;

    if (priority === 'HIGH') {
      return `Assigned HIGH recovery priority due to high revenue exposure (${amountStr}) and positive recoverability signals (${pastCount} previous order(s)).`;
    }
    if (priority === 'MEDIUM') {
      return `Assigned MEDIUM recovery priority. Standard queue candidate for Stage 3 recovery evaluation.`;
    }
    return `Assigned LOW recovery priority as transaction is ${recoverability} or has reached maximum attempt guardrails.`;
  }
}
