import type { PaymentRecord, RiskAnalysis, RecoveryDecision } from '../../types/payment';

/**
 * Stage 3 AI Recovery Agent
 * Evaluates payment signals and Stage 2 Revenue Risk Analysis using an explicit,
 * deterministic 4-tier decision priority hierarchy:
 * 1. STOP
 * 2. REQUEST_CUSTOMER_ACTION
 * 3. RETRY_PAYMENT
 * 4. ESCALATE
 *
 * Fully advisory engine: Zero dispatches, link generation, payment retries, or external API calls.
 */
export class AIRecoveryAgent {

  public planRecovery(payment: PaymentRecord, risk: RiskAnalysis): RecoveryDecision {
    const amountStr = `₹${payment.amount.toLocaleString('en-IN')}`;
    const reason = payment.failure_reason;
    const pastCount = payment.previous_successful_payments.count;
    const attempt = payment.attempt_number;

    const factors = {
      riskScore: risk.riskScore,
      recoverability: risk.recoverability,
      recoveryPriority: risk.recoveryPriority,
      attemptNumber: attempt,
      previousSuccesses: pastCount,
      amount: payment.amount,
    };

    // Rule 0: SUCCESS Payments — No recovery action needed
    if (payment.status === 'SUCCESS') {
      return {
        action: 'STOP',
        confidence: 100,
        diagnosis: 'Transaction succeeded. No recovery action required.',
        reasoning: 'Payment completed successfully on gateway. No recovery action or intervention needed.',
        expectedOutcome: 'No action required for successful transactions.',
        factors,
      };
    }

    // Tier 1: STOP Evaluation
    // - NON_RECOVERABLE status
    // - Attempt >= 4 (Max safety retry threshold)
    // - Insufficient funds with 0 past purchases
    if (
      risk.recoverability === 'NON_RECOVERABLE' ||
      attempt >= 4 ||
      (reason === 'Insufficient funds' && pastCount === 0)
    ) {
      let stopReason = '';
      if (attempt >= 4) {
        stopReason = `Payment reached maximum safety retry threshold (attempt #${attempt} of 4). Further automated retries present high churn & gateway penalty risk.`;
      } else if (reason === 'Insufficient funds' && pastCount === 0) {
        stopReason = `Persistent insufficient funds reported on a first-time customer with zero previous payment history.`;
      } else {
        stopReason = `Stage 2 Revenue Risk engine classified this transaction as NON_RECOVERABLE due to persistent failure patterns.`;
      }

      return {
        action: 'STOP',
        confidence: Math.min(98, 85 + attempt * 3),
        diagnosis: `Non-recoverable failure scenario. Automated recovery halted.`,
        reasoning: `${stopReason} Halting automated attempts protects merchant reputation and prevents unnecessary gateway fees.`,
        expectedOutcome: 'Stop automated recovery to avoid unnecessary repeated attempts.',
        factors,
      };
    }

    // Tier 2: REQUEST_CUSTOMER_ACTION Evaluation
    // - Authentication failure (e.g. 2FA drop-off)
    // - Payment method issue (e.g. card expired / blocked / invalid method details)
    if (reason === 'Authentication failure' || reason === 'Payment method issue') {
      let actionReason = '';
      if (reason === 'Authentication failure') {
        actionReason = `Payment failed during 2FA / OTP verification. Customer has ${pastCount} past successful order(s), indicating strong purchase intent.`;
      } else {
        actionReason = `Payment gateway reported a issue with the chosen payment instrument (${payment.payment_method}). Customer intervention is required to update details.`;
      }

      return {
        action: 'REQUEST_CUSTOMER_ACTION',
        confidence: reason === 'Authentication failure' ? 92 : 82,
        diagnosis: `Customer-side authentication or payment instrument action required.`,
        reasoning: `${actionReason} Customer action may be required to complete authentication or update payment method details. Automated gateway retries without customer involvement will fail.`,
        expectedOutcome: 'Customer intervention may resolve the payment issue.',
        factors,
      };
    }

    // Tier 3: RETRY_PAYMENT Evaluation
    // - recoverability === RECOVERABLE
    // - attempt_number <= 2
    // - Reasonable recovery priority (HIGH or MEDIUM)
    // - Customer has previous successful payments OR failure is clearly temporary/recoverable
    if (
      risk.recoverability === 'RECOVERABLE' &&
      attempt <= 2 &&
      (pastCount > 0 || reason === 'Temporary processing failure' || reason === 'Bank/server issue' || reason === 'Payment timeout')
    ) {
      let confidenceScore = 88;
      if (pastCount >= 3) confidenceScore += 7; // Up to 95%
      if (attempt === 2) confidenceScore -= 8;

      return {
        action: 'RETRY_PAYMENT',
        confidence: Math.min(96, Math.max(70, confidenceScore)),
        diagnosis: `Transient network/bank failure with positive customer history.`,
        reasoning: `The payment failed due to "${reason}". Customer has ${pastCount} previous successful payments and this is attempt #${attempt}, indicating strong purchase intent. A controlled gateway retry is recommended.`,
        expectedOutcome: 'Attempt recovery through another controlled payment attempt.',
        factors,
      };
    }

    // Tier 4: ESCALATE Evaluation
    // - Remaining cases where automated recovery is uncertain
    // - High-value transactions with uncertain recoverability
    // - Repeated attempts (attempt #3) where another automated retry is not justified
    let escalateReason = '';
    if (payment.amount >= 25000) {
      escalateReason = `High-value revenue exposure (${amountStr}) combined with uncertain recoverability signals.`;
    } else if (attempt === 3) {
      escalateReason = `Transaction failed on attempt #3. Repeated automated retries without human review risk account churn.`;
    } else {
      escalateReason = `Automated recovery confidence is low due to ambiguous gateway diagnostics ("${reason || 'Unknown error'}").`;
    }

    return {
      action: 'ESCALATE',
      confidence: Math.min(90, Math.max(65, 75 + (attempt === 3 ? 10 : 0))),
      diagnosis: `Ambiguous recovery signals requiring manual merchant review.`,
      reasoning: `${escalateReason} Routing to merchant operations queue for human review is more appropriate than automated retry.`,
      expectedOutcome: 'Route the case for review because automated recovery is uncertain.',
      factors,
    };
  }
}
