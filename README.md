# RecoverAI — AI Revenue Recovery Agent

> **Razorpay Buildathon — Track 03: AI Revenue Recovery**

> **Pitch**: RecoverAI is an AI-driven revenue recovery system that detects failed-payment revenue at risk, diagnoses failure causes, recommends appropriate recovery actions, applies an independent safety policy, simulates approved outcomes, and maintains a 100% traceable decision audit history.

> [!IMPORTANT]
> **Prototype Operating Mode**: This prototype operates entirely in **DEMO/SIMULATION MODE**. No real customer payments are processed, no real recovery actions are executed, and no live customer communications are sent.

---

## Overview & Demo Flow

RecoverAI automates revenue recovery for merchants by combining risk diagnosis, AI recommendation, independent policy authorization, safe simulation, and deterministic auditing.

```text
Synthetic Payment Dataset
        ↓
Revenue Risk Detector
        ↓
AI Recovery Agent
        ↓
Policy & Safety Gate
        ↓
Action Executor
        ↓
Simulation Result
        ↓
Audit Trail
        ↓
Merchant Dashboard
```

---

## Problem

Revenue loss does not occur only when a payment permanently fails. Substantial merchant revenue is lost through:
- Temporary processing and bank gateway timeouts
- Dropped authentication steps (2FA drop-offs)
- Repeated uncoordinated retry attempts
- Payment method degradation

A merchant needs more than a static list of failed payments. They need a system that can:
1. Detect revenue exposure at risk
2. Understand why the payment failed
3. Decide what intervention is appropriate
4. Enforce strict safety policy boundaries
5. Execute bounded recovery actions safely
6. Measure recovered revenue
7. Maintain an audit trail

---

## Solution

RecoverAI provides an autonomous 6-stage decision pipeline:

1. **Detect Risk**: Identifies failed and pending payments where revenue is at risk.
2. **Diagnose Failure**: Evaluates failure cause, customer transaction history, attempt count, and amount exposure.
3. **Recommend Recovery**: Selects advisory actions (`RETRY_PAYMENT`, `REQUEST_CUSTOMER_ACTION`, `ESCALATE`, `STOP`).
4. **Safety Check**: Independently evaluates recommendations against 9 deterministic safety rules.
5. **Simulate Action**: Executes policy-approved actions strictly in safe simulation mode.
6. **Record Audit**: Maintains a 4-stage decision timeline for total auditability.

---

## Key Differentiator

### AI Recommendation ≠ Authorization

The AI Recovery Agent recommends an advisory recovery action, but **it does not have authority to execute it**.

The independent **Policy & Safety Gate** evaluates the recommendation using strict safety rules:
- **Maximum Attempts**: Blocks retries if attempt count >= 3.
- **Non-Recoverable Failures**: Blocks retries on permanent/fraud errors.
- **High-Value Threshold**: Blocks retries on transactions > ₹25,000 requiring human merchant review.
- **Customer Action Guard**: Restricts automated retries when customer intervention is required.
- **Human Review Routing**: Enforces merchant approval for ambiguous or high-risk cases.
- **Autonomous Stop**: Halts recovery safely when further attempts are non-viable.

Only policy-approved actions (`policy.allowed === true` AND `policy.status === 'ALLOWED'`) reach the Action Executor. `REVIEW` status is strictly non-executable.

---

## Key Features Implemented

- **Synthetic Payment Dataset**: Deterministic 1,000-record payment stream generated via Mulberry32 PRNG (Seed `20260904`).
- **Revenue Risk Scoring**: Risk Scores (0–100), Recoverability (`RECOVERABLE`, `NON_RECOVERABLE`, `UNCERTAIN`), and Priority (`HIGH`, `MEDIUM`, `LOW`).
- **AI Recovery Decisions**: Action selection with confidence ratings, failure diagnosis, and expected outcomes.
- **Policy & Safety Gate**: Independent safety checkpoint with 9 rules producing `ALLOWED`, `BLOCKED`, or `REVIEW` decisions.
- **Safe Simulation Mode**: Downstream Action Executor simulating recovery outcomes without live API credentials or real money movement.
- **100% Traceable Audit Trail**: Deterministic audit IDs (`AUDIT-DEMO-XXXXXXXX`) saved safely in browser `localStorage`.
- **Global Metric Invariance**: Main dashboard cards and summary totals remain calculated strictly on the complete 1,000 dataset regardless of table search or filters.
- **Transaction Investigation Drawer**: Detailed slide-over panel featuring **"Why RecoverAI Chose This Decision"** human-readable explanations.
- **Judge Demo Scenarios**: 1-click launch modal to demonstrate key recovery flows.

---

## Demo Metrics (Baseline Dataset)

*All values below are calculated strictly from the complete 1,000-record dataset:*

- **Total Payment Records**: 1,000
- **Total Payment Volume**: ₹1,51,76,823 (₹1.52 Cr)
- **Failed Payments**: 301 records (`₹44,98,900` value)
- **Failure Rate**: 30.1%
- **Revenue at Risk**: ₹45.46 Lakh
- **Demo Recovery Potential**: ₹27.87 Lakh
- **Recovery Recommendations**: 336 (104 Retry, 105 Customer Action, 123 Escalate, 4 Stop)
- **Policy Results**: 109 ALLOWED / 104 BLOCKED / 123 REVIEW
- **Human Review Required**: 123
- **Batch Recovery Simulation**:
  - 109 policy-authorized recovery workflows
  - 84 successful simulated retries
  - 20 failed simulated retries
  - ₹7.04 Lakh DEMO VALUE simulated recovered

---

## System Architecture

| Layer | Responsibility |
| :--- | :--- |
| **Payment Dataset** | Generates deterministic 1,000-record synthetic payment stream |
| **Revenue Risk Detector** | Calculates Risk Score (0–100), Recoverability, Recovery Priority, and Exposure |
| **AI Recovery Agent** | Outputs advisory recovery recommendations with confidence ratings |
| **Policy & Safety Gate** | Independently authorizes, blocks, or requires human review against 9 safety rules |
| **Action Executor** | Operates 100% offline in Safe Simulation Mode |
| **Audit Trail** | Logs 4-stage decision lifecycle (`AUDIT-DEMO-XXXXXXXX`) |
| **Merchant Dashboard** | Visualizes business metrics, recovery funnel, risk distributions, and audit ledgers |

---

## Recovery Actions

- **`RETRY_PAYMENT`**: Recommended when payment is recoverable and retry conditions are safe.
- **`REQUEST_CUSTOMER_ACTION`**: Recommended when customer intervention (2FA/Auth) is required. *(Simulated recovered revenue = ₹0, zero messages sent)*.
- **`ESCALATE`**: Recommended when merchant/human review is appropriate.
- **`STOP`**: Recommended when further recovery attempts should halt safely. *(Simulated recovered revenue = ₹0)*.

---

## Safety Model

```text
AI Recommendation
       ↓
Policy & Safety Gate
       ↓
ALLOWED / BLOCKED / REVIEW
       ↓
Action Executor
```

> **The AI cannot bypass the Policy & Safety Gate.**

- `BLOCKED` → No execution
- `REVIEW` → No automatic execution
- `STOP` → Safe halt
- `SUCCESS` payment → No recovery execution
- Only successful simulated `RETRY_PAYMENT` contributes to demo recovered revenue.

---

## Auditability

RecoverAI records every step of the decision lifecycle:

```text
Risk Analyzed → AI Decision → Policy Evaluated → Action Executed / Blocked
```

Every record receives a deterministic Audit ID (`AUDIT-DEMO-XXXXXXXX`) and timestamp saved to `localStorage` under key `recoverai_audit_trail`.

---

## Recommended Judge Demo Scenarios

Launch any scenario with 1 click from the **Demo Scenarios** button in the top header:

1. **Scenario A — Safe Retry**: AI recommends `RETRY_PAYMENT`, Policy is `ALLOWED`, simulation succeeds.
2. **Scenario B — Safety Policy Block**: AI recommends `RETRY_PAYMENT`, Policy is `BLOCKED` (High value > ₹25k). Demonstrates AI cannot bypass safety policies.
3. **Scenario C — Human Review**: AI recommends `ESCALATE`, Policy is `REVIEW`. Demonstrates actions are not automatically executed.
4. **Scenario D — Customer Action**: AI recommends `REQUEST_CUSTOMER_ACTION`, Policy is `ALLOWED`, ₹0 recovered, zero customer messages sent.
5. **Scenario E — Safe STOP**: AI recommends `STOP`, Policy is `ALLOWED`, safe halt executed with ₹0 recovered.

---

## Technology Stack

- **UI Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (`typescript`)
- **Build System**: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Styling**: Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/vite`)
- **Icons**: Lucide React (`lucide-react`)
- **Linter**: Oxlint (`oxlint`)

---

## Running Locally

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation & Development Server

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Run local development server
npm run dev
# Access in browser: http://localhost:5173/

# 3. Build production bundle
npm run build
```

---

## Intentional Prototype Boundaries

To ensure complete safety during demonstration, this prototype:
- Operates on a deterministic synthetic dataset
- Operates in 100% Safe Simulation Mode
- Does not move real money or connect to live payment gateways
- Does not dispatch real customer messages (SMS/WhatsApp/Email)
- Does not require external LLM API keys or backend databases

---

## Future Production Extensions

Potential future production enhancements include:
- Production Razorpay webhook ingestion stream
- Live gateway retry adapters & smart routing
- Merchant OAuth & Role-Based Access Control (RBAC)
- Multi-channel customer notification adapters (WhatsApp Business API)
- Production PostgreSQL / Redis audit persistence
- Merchant policy rule configuration editor
