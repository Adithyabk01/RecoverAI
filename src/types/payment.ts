export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking';

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export type FailureReason =
  | 'Temporary processing failure'
  | 'Insufficient funds'
  | 'Authentication failure'
  | 'Payment timeout'
  | 'Payment method issue'
  | 'Bank/server issue';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Recoverability = 'RECOVERABLE' | 'NON_RECOVERABLE' | 'UNCERTAIN';

export type RecoveryPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type RecoveryAction =
  | 'RETRY_PAYMENT'
  | 'REQUEST_CUSTOMER_ACTION'
  | 'ESCALATE'
  | 'STOP';

export type PolicyStatus = 'ALLOWED' | 'BLOCKED' | 'REVIEW';

export type ExecutionStatus =
  | 'SIMULATED_SUCCESS'
  | 'SIMULATED_FAILURE'
  | 'BLOCKED'
  | 'NOT_EXECUTED';

export type AuditEventType =
  | 'RISK_ANALYZED'
  | 'AI_DECISION'
  | 'POLICY_EVALUATED'
  | 'ACTION_EXECUTED'
  | 'ACTION_BLOCKED';

export interface RiskAnalysis {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  recoverability: Recoverability;
  recoveryPriority: RecoveryPriority;
  revenueAtRisk: number;
  reason: string;
  riskExplanation: string;
  recoverabilityExplanation: string;
  priorityExplanation: string;
  factors: {
    failureReasonImpact: number;
    customerHistoryImpact: number;
    attemptCountImpact: number;
    amountExposureImpact: number;
  };
}

export interface RecoveryDecision {
  action: RecoveryAction;
  confidence: number; // 0 to 100
  diagnosis: string;
  reasoning: string;
  expectedOutcome: string;
  factors: {
    riskScore: number;
    recoverability: Recoverability;
    recoveryPriority: RecoveryPriority;
    attemptNumber: number;
    previousSuccesses: number;
    amount: number;
  };
}

export interface PolicyDecision {
  allowed: boolean;
  status: PolicyStatus;
  action: RecoveryAction;
  reason: string;
  rulesTriggered: string[];
  riskLevel: RiskLevel;
  requiresHumanReview: boolean;
}

export interface ExecutionResult {
  executed: boolean;
  action: RecoveryAction;
  status: ExecutionStatus;
  message: string;
  simulatedAt: string;
  executionId: string;
  transactionId: string;
  policyStatus: PolicyStatus;
  amount: number;
  simulatedRecoveredAmount: number;
}

export interface AuditRecord {
  auditId: string; // AUDIT-DEMO-XXXXXXXX
  transactionId: string;
  timestamp: string;
  paymentStatus: PaymentStatus;
  amount: number;
  risk: {
    riskScore: number;
    riskLevel: RiskLevel;
    recoverability: Recoverability;
    recoveryPriority: RecoveryPriority;
  };
  aiDecision: {
    action: RecoveryAction;
    confidence: number;
    diagnosis: string;
  };
  policy: {
    status: PolicyStatus;
    allowed: boolean;
    rulesTriggered: string[];
    requiresHumanReview: boolean;
  };
  execution: {
    action: RecoveryAction;
    status: ExecutionStatus;
    executed: boolean;
    simulatedRecoveredAmount: number;
    executionId: string;
  };
}

export interface CustomerInfo {
  customer_id: string;
  customer_name: string;
  customer_email: string;
}

export interface PreviousSuccessfulPayments {
  count: number;
  total_amount: number;
}

export interface PaymentRecord {
  transaction_id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  failure_reason: FailureReason | null;
  attempt_number: number;
  timestamp: string; // ISO String
  previous_successful_payments: PreviousSuccessfulPayments;
  riskAnalysis?: RiskAnalysis;
  aiDecision?: RecoveryDecision;
  policyDecision?: PolicyDecision;
  executionResult?: ExecutionResult;
  auditRecord?: AuditRecord;
}

export interface RiskDistributionItem {
  count: number;
  amount: number;
}

export interface ActionPolicyBreakdown {
  allowed: number;
  blocked: number;
}

export interface AuditSummary {
  transactionsAudited: number;
  aiDecisionsRecorded: number;
  policyEvaluations: number;
  actionsExecuted: number;
  actionsBlocked: number;
  humanReviews: number;
  simulatedRetryAttempts: number;
  successfulSimulations: number;
  failedSimulations: number;
  demoRevenueRecovered: number;
}

export interface DashboardMetrics {
  totalPayments: number;
  totalTransactionValue: number;
  failedPaymentsCount: number;
  failedPaymentsValue: number;
  failureRate: number;
  revenueAtRisk: number;
  demoRecoveryPotential: number;
  riskDistribution: {
    high: RiskDistributionItem;
    medium: RiskDistributionItem;
    low: RiskDistributionItem;
  };
  priorityDistribution: {
    high: RiskDistributionItem;
    medium: RiskDistributionItem;
    low: RiskDistributionItem;
  };
  recommendationDistribution: {
    retryPayment: number;
    requestCustomerAction: number;
    escalate: number;
    stop: number;
  };
  policySummary: {
    allowedCount: number;
    blockedCount: number;
    reviewCount: number;
    humanReviewCount: number;
    actionBreakdown: {
      retryPayment: ActionPolicyBreakdown;
      requestCustomerAction: ActionPolicyBreakdown;
      escalate: ActionPolicyBreakdown;
      stop: ActionPolicyBreakdown;
    };
  };
  executionSummary: {
    approvedActionsCount: number;
    blockedActionsCount: number;
    simulatedSuccessCount: number;
    simulatedFailureCount: number;
    demoRevenueRecovered: number;
  };
  auditSummary: AuditSummary;
}

export interface FilterState {
  searchQuery: string;
  status: string;
  paymentMethod: string;
  failureReason: string;
  riskLevel: string;
  recommendation: string;
  policyResult: string;
  executionStatus: string;
}

export interface AuditFilterState {
  aiAction: string;
  policyStatus: string;
  executionStatus: string;
}
