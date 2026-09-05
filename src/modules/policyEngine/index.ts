import type { PaymentRecord, RiskAnalysis, RecoveryDecision, PolicyDecision } from '../../types/payment';

/**
 * Stage 4 Policy & Safety Gate Engine
 * Independently validates AI-recommended recovery actions against merchant safety guardrails.
 * Fully deterministic & analytical: Zero payment dispatches, links, retries, or external API calls.
 */
export class PolicySafetyEngine {

  public validatePolicy(
    payment: PaymentRecord,
    risk: RiskAnalysis,
    decision: RecoveryDecision
  ): PolicyDecision {
    const amountStr = `₹${payment.amount.toLocaleString('en-IN')}`;
    const action = decision.action;

    // Rule 1 — SUCCESS Protection (Defensive Safeguard)
    if (payment.status === 'SUCCESS') {
      return {
        allowed: false,
        status: 'BLOCKED',
        action: 'STOP',
        reason: 'Successful payments must never enter automated recovery.',
        rulesTriggered: ['SUCCESS_PROTECTION'],
        riskLevel: 'LOW',
        requiresHumanReview: false,
      };
    }

    // Rule 2 — Fraud / Security Protection
    const reasonLower = (payment.failure_reason || '').toLowerCase();
    if (
      reasonLower.includes('fraud') ||
      reasonLower.includes('security') ||
      reasonLower.includes('blocked') ||
      reasonLower.includes('suspicious')
    ) {
      return {
        allowed: false,
        status: 'BLOCKED',
        action,
        reason: 'Security-related failures require controlled merchant review rather than automated recovery.',
        rulesTriggered: ['FRAUD_SECURITY_PROTECTION'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: true,
      };
    }

    // Rule 3 — Maximum Automated Attempt Limit (Attempt >= 3 blocks RETRY_PAYMENT)
    if (payment.attempt_number >= 3 && action === 'RETRY_PAYMENT') {
      return {
        allowed: false,
        status: 'BLOCKED',
        action,
        reason: `Automated retry limit reached (attempt #${payment.attempt_number} >= 3). Further recovery requires human review.`,
        rulesTriggered: ['MAX_ATTEMPTS'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: true,
      };
    }

    // Rule 4 — Non-Recoverable Protection (RETRY_PAYMENT on NON_RECOVERABLE blocked)
    if (risk.recoverability === 'NON_RECOVERABLE' && action === 'RETRY_PAYMENT') {
      return {
        allowed: false,
        status: 'BLOCKED',
        action,
        reason: 'Payment is classified as non-recoverable by Revenue Risk Engine; automated retry is prohibited.',
        rulesTriggered: ['NON_RECOVERABLE_RETRY'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: true,
      };
    }

    // Rule 5 — High-Value Retry Protection (amount > ₹25,000 blocks RETRY_PAYMENT)
    if (payment.amount > 25000 && action === 'RETRY_PAYMENT') {
      return {
        allowed: false,
        status: 'BLOCKED',
        action,
        reason: `AI recommended RETRY_PAYMENT, but this transaction (${amountStr}) exceeds the automated recovery value threshold (> ₹25,000) and requires additional review.`,
        rulesTriggered: ['HIGH_VALUE_RETRY'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: true,
      };
    }

    // Rule 6 — Customer Action Permitted (REQUEST_CUSTOMER_ACTION approved)
    if (action === 'REQUEST_CUSTOMER_ACTION') {
      return {
        allowed: true,
        status: 'ALLOWED',
        action,
        reason: 'Customer action recommendation (e.g. 2FA completion / method update) approved by policy gate.',
        rulesTriggered: ['CUSTOMER_ACTION_PERMITTED'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: false,
      };
    }

    // Rule 7 — Escalation Permitted (ESCALATE routed to human review queue)
    if (action === 'ESCALATE') {
      return {
        allowed: true,
        status: 'REVIEW',
        action,
        reason: 'Case routing for merchant human review approved by policy gate.',
        rulesTriggered: ['ESCALATION_PERMITTED'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: true,
      };
    }

    // Rule 8 — STOP Permitted (Stopping recovery is always safe)
    if (action === 'STOP') {
      return {
        allowed: true,
        status: 'ALLOWED',
        action,
        reason: 'Stopping automated recovery is permitted by policy gate.',
        rulesTriggered: ['STOP_PERMITTED'],
        riskLevel: risk.riskLevel,
        requiresHumanReview: false,
      };
    }

    // Rule 9 — Default Deny Fallback
    return {
      allowed: false,
      status: 'BLOCKED',
      action,
      reason: 'Action not explicitly permitted by current recovery policy.',
      rulesTriggered: ['DEFAULT_DENY'],
      riskLevel: risk.riskLevel,
      requiresHumanReview: true,
    };
  }
}
