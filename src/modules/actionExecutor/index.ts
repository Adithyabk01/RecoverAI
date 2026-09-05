import type { PaymentRecord, RecoveryDecision, PolicyDecision, ExecutionResult } from '../../types/payment';

/**
 * Stage 5 Action Executor (Safe Simulation Mode)
 * Downstream execution layer operating 100% offline in Safe Simulation Mode.
 * Zero live Razorpay API calls, payment retries, customer messages, or real money movement.
 */
export class ActionExecutor {

  public executeAction(
    payment: PaymentRecord,
    decision: RecoveryDecision,
    policy: PolicyDecision
  ): ExecutionResult {
    const transactionId = payment.transaction_id;
    const executionId = `EXE-DEMO-${transactionId.substring(4)}`;
    const simulatedAt = new Date().toISOString();
    const action = decision.action;

    // 1. SUCCESS Protection Check
    if (payment.status === 'SUCCESS') {
      return {
        executed: false,
        action: 'STOP',
        status: 'BLOCKED',
        message: 'Successful transactions cannot enter Action Executor.',
        simulatedAt,
        executionId,
        transactionId,
        policyStatus: 'BLOCKED',
        amount: payment.amount,
        simulatedRecoveredAmount: 0,
      };
    }

    // 2. CRITICAL SAFETY RULE: Policy Gate Authorization Boundary
    // The Action Executor MUST require policy.allowed === true AND policy.status === 'ALLOWED'.
    // REVIEW status MUST NOT be executable.
    if (!policy.allowed || policy.status !== 'ALLOWED') {
      let blockMessage = 'Action blocked by Policy & Safety Gate. No action was executed.';
      if (policy.status === 'REVIEW') {
        blockMessage = 'Action requires human review. No action was executed.';
      }

      return {
        executed: false,
        action,
        status: 'BLOCKED',
        message: blockMessage,
        simulatedAt,
        executionId,
        transactionId,
        policyStatus: policy.status,
        amount: payment.amount,
        simulatedRecoveredAmount: 0,
      };
    }

    // 3. Deterministic Simulation Logic for Policy ALLOWED Actions

    // Case A: RETRY_PAYMENT
    if (action === 'RETRY_PAYMENT') {
      // Deterministic calculation based on payment signals (No Math.random())
      const isHighlyRecoverable =
        payment.attempt_number <= 2 &&
        (payment.previous_successful_payments.count >= 1 ||
          payment.failure_reason === 'Temporary processing failure' ||
          payment.failure_reason === 'Bank/server issue');

      if (isHighlyRecoverable) {
        return {
          executed: true,
          action,
          status: 'SIMULATED_SUCCESS',
          message: 'Simulated payment recovery succeeded.',
          simulatedAt,
          executionId,
          transactionId,
          policyStatus: policy.status,
          amount: payment.amount,
          simulatedRecoveredAmount: payment.amount, // ONLY RETRY_PAYMENT + SIMULATED_SUCCESS contributes recovered revenue
        };
      } else {
        return {
          executed: true,
          action,
          status: 'SIMULATED_FAILURE',
          message: 'Simulated payment retry failed.',
          simulatedAt,
          executionId,
          transactionId,
          policyStatus: policy.status,
          amount: payment.amount,
          simulatedRecoveredAmount: 0,
        };
      }
    }

    // Case B: REQUEST_CUSTOMER_ACTION
    if (action === 'REQUEST_CUSTOMER_ACTION') {
      return {
        executed: true,
        action,
        status: 'SIMULATED_SUCCESS',
        message: 'Customer-action workflow prepared for simulation. No message was actually sent.',
        simulatedAt,
        executionId,
        transactionId,
        policyStatus: policy.status,
        amount: payment.amount,
        simulatedRecoveredAmount: 0, // MUST remain 0
      };
    }

    // Case C: STOP
    if (action === 'STOP') {
      return {
        executed: true,
        action,
        status: 'SIMULATED_SUCCESS',
        message: 'Automated recovery stopped safely. No further action was attempted.',
        simulatedAt,
        executionId,
        transactionId,
        policyStatus: policy.status,
        amount: payment.amount,
        simulatedRecoveredAmount: 0, // MUST remain 0
      };
    }

    // Fallback BLOCKED
    return {
      executed: false,
      action,
      status: 'BLOCKED',
      message: 'Action not authorized for execution.',
      simulatedAt,
      executionId,
      transactionId,
      policyStatus: policy.status,
      amount: payment.amount,
      simulatedRecoveredAmount: 0,
    };
  }
}
