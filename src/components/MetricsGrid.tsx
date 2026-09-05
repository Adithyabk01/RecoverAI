import React from 'react';
import type { DashboardMetrics } from '../types/payment';
import { MetricCard } from './MetricCard';
import { formatINR } from '../services/metrics';
import {
  CreditCard,
  IndianRupee,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Total Payments Analyzed */}
      <MetricCard
        title="Total Payments"
        value={metrics.totalPayments.toLocaleString('en-IN')}
        subtitle="Full synthetic stream"
        icon={<CreditCard className="h-5 w-5" />}
        accentColor="blue"
        badgeText="100% Deterministic"
      />

      {/* 2. Total Transaction Value */}
      <MetricCard
        title="Total Value"
        value={formatINR(metrics.totalTransactionValue, true)}
        subtitle={formatINR(metrics.totalTransactionValue)}
        icon={<IndianRupee className="h-5 w-5" />}
        accentColor="indigo"
        trend={{ label: 'Gross Processed Volume' }}
      />

      {/* 3. Failed Payments */}
      <MetricCard
        title="Failed Payments"
        value={metrics.failedPaymentsCount.toLocaleString('en-IN')}
        subtitle={`Valued at ${formatINR(metrics.failedPaymentsValue, true)}`}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="rose"
        trend={{
          label: `${metrics.failedPaymentsCount} transactions failed`,
          isWarning: true,
        }}
      />

      {/* 4. Failure Rate */}
      <MetricCard
        title="Failure Rate"
        value={`${metrics.failureRate.toFixed(1)}%`}
        subtitle="Benchmark: ~18-24% INR avg"
        icon={<TrendingDown className="h-5 w-5" />}
        accentColor="amber"
        trend={{
          label: 'Requires Active Recovery',
          isWarning: metrics.failureRate > 20,
        }}
      />

      {/* 5. Revenue at Risk */}
      <MetricCard
        title="Revenue at Risk"
        value={formatINR(metrics.revenueAtRisk, true)}
        subtitle="Failed + Pending at-risk"
        icon={<ShieldAlert className="h-5 w-5" />}
        accentColor="purple"
        trend={{
          label: 'Target for AI Agent',
          isWarning: true,
        }}
      />

      {/* 6. Demo Recovery Potential */}
      <MetricCard
        title="Demo Recovery"
        value={formatINR(metrics.demoRecoveryPotential, true)}
        subtitle="Projected AI recovery"
        icon={<Sparkles className="h-5 w-5" />}
        accentColor="emerald"
        isDemo={true}
        trend={{
          label: '~68% Recovery Rate Est.',
          isPositive: true,
        }}
      />
    </div>
  );
};
