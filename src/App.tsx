import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { PipelineExplanationCard } from './components/PipelineExplanationCard';
import { DemoRecoveryFunnelCard } from './components/DemoRecoveryFunnelCard';
import { AuditTrailCard } from './components/AuditTrailCard';
import { AuditTrailTable } from './components/AuditTrailTable';
import { ExecutionSummaryCard } from './components/ExecutionSummaryCard';
import { PolicySummaryCard } from './components/PolicySummaryCard';
import { AIRecommendationsCard } from './components/AIRecommendationsCard';
import { RiskDistributionCard } from './components/RiskDistributionCard';
import { TransactionTable } from './components/TransactionTable';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { JudgeDemoScenariosModal } from './components/JudgeDemoScenariosModal';
import { PaymentMonitor } from './modules/paymentMonitor';
import { calculateDashboardMetrics } from './services/metrics';
import type { PaymentRecord } from './types/payment';
import { ShieldCheck, Info } from 'lucide-react';

export function App() {
  // Initialize Payment Monitor (loads 1,000 deterministic synthetic records)
  const paymentMonitor = useMemo(() => new PaymentMonitor(), []);
  const allRecords = useMemo(() => paymentMonitor.getPayments(), [paymentMonitor]);

  // CRITICAL REQUIREMENT: Calculate all metrics ALWAYS on full 1,000 dataset (invariant under search/filters)
  const fullDatasetMetrics = useMemo(() => {
    return calculateDashboardMetrics(allRecords);
  }, [allRecords]);

  // Selected Transaction for Detail Modal
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentRecord | null>(null);

  // Architecture Blueprint Modal State
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Judge Demo Scenarios Modal State
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Header
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenScenarios={() => setIsScenariosModalOpen(true)}
      />

      {/* 2. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Concise Product Explanation & Demo Mode Callout */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 mt-0.5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  RecoverAI — AI Revenue Recovery Agent Platform
                </h2>
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  SAFE DEMO SIMULATION MODE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
                RecoverAI is an AI-driven revenue recovery system that detects failed-payment revenue at risk, diagnoses the failure, recommends a recovery action, applies an independent safety policy, simulates the approved action, and records the complete decision history.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/60 px-3.5 py-2 rounded-xl border border-amber-500/30 font-medium self-start md:self-auto flex-shrink-0">
            <Info className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>All payment recovery results in this prototype are simulated. No real customer payments are processed.</span>
          </div>
        </div>

        {/* 3. "How RecoverAI Works" / Autonomous Decision Pipeline */}
        <section aria-label="Decision Pipeline Explanation">
          <PipelineExplanationCard />
        </section>

        {/* 4. Primary Business Metrics Grid (Always 1,000 dataset) */}
        <section aria-label="Merchant Key Metrics">
          <MetricsGrid metrics={fullDatasetMetrics} />
        </section>

        {/* 5. End-to-End Demo Recovery Funnel */}
        <section aria-label="Demo Recovery Funnel">
          <DemoRecoveryFunnelCard metrics={fullDatasetMetrics} />
        </section>

        {/* 6. STAGE 6: Audit Trail & Decision History Summary Card */}
        <section aria-label="Audit Trail Summary & Recent Activity">
          <AuditTrailCard
            metrics={fullDatasetMetrics}
            records={allRecords}
            onSelectTransaction={(record) => setSelectedTransaction(record)}
          />
        </section>

        {/* 7. STAGE 6: Full Audit Trail Table Ledger */}
        <section aria-label="Audit Trail Table Ledger">
          <AuditTrailTable
            records={allRecords}
            onSelectTransaction={(record) => setSelectedTransaction(record)}
          />
        </section>

        {/* 8. STAGE 5: Action Executor Simulation Summary Card */}
        <section aria-label="Action Executor Safe Simulation Summary">
          <ExecutionSummaryCard metrics={fullDatasetMetrics} />
        </section>

        {/* 9. STAGE 4: Policy & Safety Gate Summary Card */}
        <section aria-label="Policy & Safety Gate Authorization">
          <PolicySummaryCard metrics={fullDatasetMetrics} />
        </section>

        {/* 10. STAGE 3: AI Recovery Recommendations Summary Card */}
        <section aria-label="AI Recommendations Summary">
          <AIRecommendationsCard metrics={fullDatasetMetrics} />
        </section>

        {/* 11. STAGE 2: Risk Level & Priority Distribution Card */}
        <section aria-label="Revenue Risk Distribution">
          <RiskDistributionCard metrics={fullDatasetMetrics} />
        </section>

        {/* 12. Searchable & Filterable Transaction Table */}
        <section aria-label="Transaction Audit Stream">
          <TransactionTable
            records={allRecords}
            onSelectTransaction={(record) => setSelectedTransaction(record)}
            selectedTransactionId={selectedTransaction?.transaction_id}
          />
        </section>
      </main>

      {/* 13. Transaction Detail Slide-Over Drawer */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* 14. System Architecture Blueprint Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* 15. Judge Demo Scenarios Modal */}
      <JudgeDemoScenariosModal
        isOpen={isScenariosModalOpen}
        onClose={() => setIsScenariosModalOpen(false)}
        records={allRecords}
        onSelectTransaction={(record) => setSelectedTransaction(record)}
      />

      {/* 16. Footer Disclaimer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>RecoverAI</strong> — Track 03 — AI Revenue Recovery Agent platform for merchants.
          </div>
          <div className="text-[11px] text-slate-600">
            Stage 7 Final Integration Complete • Dataset ({allRecords.length} records) • Seed 20260904
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
