import type {
  PaymentRecord,
  RiskAnalysis,
  RecoveryDecision,
  PolicyDecision,
  ExecutionResult,
  AuditRecord,
} from '../../types/payment';

const STORAGE_KEY = 'recoverai_audit_trail';

/**
 * Stage 6 Audit Trail Service
 * Provides complete, explainable records of recovery decisions and simulated outcomes.
 * Generates deterministic audit IDs and timestamps tied strictly to transaction IDs.
 */
export class AuditTrailService {
  /**
   * Generates a deterministic Audit ID: AUDIT-DEMO-XXXXXXXX
   */
  public generateAuditId(transactionId: string): string {
    const cleanId = transactionId.replace(/^txn_/i, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const hashPart = cleanId.slice(0, 8).padEnd(8, '0');
    return `AUDIT-DEMO-${hashPart}`;
  }

  /**
   * Builds a strongly typed AuditRecord representing the 4-stage lifecycle of a transaction.
   */
  public createAuditRecord(
    payment: PaymentRecord,
    risk: RiskAnalysis,
    ai: RecoveryDecision,
    policy: PolicyDecision,
    execution: ExecutionResult
  ): AuditRecord {
    const auditId = this.generateAuditId(payment.transaction_id);

    return {
      auditId,
      transactionId: payment.transaction_id,
      timestamp: payment.timestamp, // Deterministic timestamp from payment record
      paymentStatus: payment.status,
      amount: payment.amount,
      risk: {
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        recoverability: risk.recoverability,
        recoveryPriority: risk.recoveryPriority,
      },
      aiDecision: {
        action: ai.action,
        confidence: ai.confidence,
        diagnosis: ai.diagnosis,
      },
      policy: {
        status: policy.status,
        allowed: policy.allowed,
        rulesTriggered: policy.rulesTriggered,
        requiresHumanReview: policy.requiresHumanReview,
      },
      execution: {
        action: execution.action,
        status: execution.status,
        executed: execution.executed,
        simulatedRecoveredAmount: execution.simulatedRecoveredAmount,
        executionId: execution.executionId,
      },
    };
  }

  /**
   * Loads custom/persisted audit records from browser localStorage safely.
   */
  public loadFromLocalStorage(): Record<string, AuditRecord> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return {};
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, AuditRecord>;
      }
    } catch {
      // Safe fallback on malformed localStorage
    }
    return {};
  }

  /**
   * Saves updated audit records to browser localStorage safely.
   */
  public saveToLocalStorage(recordsMap: Record<string, AuditRecord>): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsMap));
    } catch {
      // Ignore quota/storage errors silently
    }
  }
}

export const auditTrailService = new AuditTrailService();
