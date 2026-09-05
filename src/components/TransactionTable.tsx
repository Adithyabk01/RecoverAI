import React, { useState, useMemo } from 'react';
import type { PaymentRecord, PaymentStatus, PaymentMethod, FailureReason, RiskLevel, RecoveryAction } from '../types/payment';
import { formatINR } from '../services/metrics';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  ShieldAlert,
  Bot,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  OctagonX,
  ShieldCheck,
  User,
} from 'lucide-react';

interface TransactionTableProps {
  records: PaymentRecord[];
  onSelectTransaction: (record: PaymentRecord) => void;
  selectedTransactionId?: string | null;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  records,
  onSelectTransaction,
  selectedTransactionId,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [reasonFilter, setReasonFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [recommendationFilter, setRecommendationFilter] = useState<string>('ALL');
  const [policyFilter, setPolicyFilter] = useState<string>('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Available failure reasons for filter dropdown
  const failureReasons: FailureReason[] = [
    'Temporary processing failure',
    'Insufficient funds',
    'Authentication failure',
    'Payment timeout',
    'Payment method issue',
    'Bank/server issue',
  ];

  // Filtering Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          r.transaction_id.toLowerCase().includes(q) ||
          r.order_id.toLowerCase().includes(q) ||
          r.customer_name.toLowerCase().includes(q) ||
          r.customer_email.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Status Filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false;
      }

      // Payment Method Filter
      if (methodFilter !== 'ALL' && r.payment_method !== methodFilter) {
        return false;
      }

      // Failure Reason Filter
      if (reasonFilter !== 'ALL' && r.failure_reason !== reasonFilter) {
        return false;
      }

      // Risk Level Filter
      if (riskFilter !== 'ALL') {
        const level = r.riskAnalysis?.riskLevel || 'LOW';
        if (level !== riskFilter) return false;
      }

      // AI Recommendation Filter
      if (recommendationFilter !== 'ALL') {
        if (r.status === 'SUCCESS') return false;
        const action = r.aiDecision?.action;
        if (action !== recommendationFilter) return false;
      }

      // Policy Result Filter (Stage 4 Requirement #7)
      if (policyFilter !== 'ALL') {
        if (r.status === 'SUCCESS') return false; // SUCCESS transactions display '—'
        const policy = r.policyDecision;
        if (policyFilter === 'HUMAN_REVIEW') {
          if (!policy?.requiresHumanReview) return false;
        } else if (policy?.status !== policyFilter) {
          return false;
        }
      }

      return true;
    });
  }, [records, searchQuery, statusFilter, methodFilter, reasonFilter, riskFilter, recommendationFilter, policyFilter]);

  // Reset handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethodFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReasonFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRiskFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRecommendationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecommendationFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPolicyFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setMethodFilter('ALL');
    setReasonFilter('ALL');
    setRiskFilter('ALL');
    setRecommendationFilter('ALL');
    setPolicyFilter('ALL');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  // Status Badge Helper
  const renderStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            FAILED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            PENDING
          </span>
        );
    }
  };

  // Risk Badge Helper
  const renderRiskBadge = (record: PaymentRecord) => {
    if (record.status === 'SUCCESS') {
      return <span className="text-slate-600 text-xs font-mono">—</span>;
    }
    const risk = record.riskAnalysis;
    const level: RiskLevel = risk?.riskLevel || 'LOW';

    switch (level) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            HIGH ({risk?.riskScore})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MED ({risk?.riskScore})
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            LOW ({risk?.riskScore})
          </span>
        );
    }
  };

  // AI Recommendation Badge Helper
  const renderAIRecommendationBadge = (record: PaymentRecord) => {
    if (record.status === 'SUCCESS') {
      return <span className="text-slate-600 text-xs font-mono">—</span>;
    }

    const action: RecoveryAction = record.aiDecision?.action || 'STOP';

    switch (action) {
      case 'RETRY_PAYMENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 gap-1">
            <RefreshCw className="h-3 w-3 text-emerald-400" /> RETRY
          </span>
        );
      case 'REQUEST_CUSTOMER_ACTION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 gap-1">
            <UserCheck className="h-3 w-3 text-amber-400" /> CUSTOMER ACTION
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 gap-1">
            <AlertTriangle className="h-3 w-3 text-purple-400" /> ESCALATE
          </span>
        );
      case 'STOP':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 gap-1">
            <OctagonX className="h-3 w-3 text-rose-400" /> STOP
          </span>
        );
    }
  };

  // Policy Badge Helper (Stage 4 Requirement #7)
  const renderPolicyBadge = (record: PaymentRecord) => {
    if (record.status === 'SUCCESS') {
      return <span className="text-slate-600 text-xs font-mono">—</span>;
    }

    const policy = record.policyDecision;
    if (!policy) return <span className="text-slate-600 text-xs font-mono">—</span>;

    switch (policy.status) {
      case 'ALLOWED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> ALLOWED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 gap-1" title={policy.reason}>
            <XCircle className="h-3 w-3 text-rose-400" /> BLOCKED
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 gap-1">
            <User className="h-3 w-3 text-amber-400" /> REVIEW
          </span>
        );
    }
  };

  // Payment Method Icon Helper
  const renderMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI':
        return (
          <span className="inline-flex items-center text-xs font-medium text-slate-300 gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
            UPI
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center text-xs font-medium text-slate-300 gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-purple-400" />
            Card
          </span>
        );
      case 'Net Banking':
        return (
          <span className="inline-flex items-center text-xs font-medium text-slate-300 gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-blue-400" />
            Net Banking
          </span>
        );
    }
  };

  // Date Formatter
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    methodFilter !== 'ALL' ||
    reasonFilter !== 'ALL' ||
    riskFilter !== 'ALL' ||
    recommendationFilter !== 'ALL' ||
    policyFilter !== 'ALL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Table Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Transaction ID, Order ID, Customer Name, Email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
            />
          </div>

          {/* Active Results Summary */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
            <span>
              Showing <strong className="text-slate-200">{filteredRecords.length.toLocaleString('en-IN')}</strong> of{' '}
              <strong className="text-slate-200">1,000</strong> transactions
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-2 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Filter 1: Status */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-400 flex-shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="SUCCESS" className="bg-slate-900 text-emerald-400">SUCCESS</option>
              <option value="FAILED" className="bg-slate-900 text-rose-400">FAILED</option>
              <option value="PENDING" className="bg-slate-900 text-amber-400">PENDING</option>
            </select>
          </div>

          {/* Filter 2: Payment Method */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-400 flex-shrink-0">Method:</span>
            <select
              value={methodFilter}
              onChange={handleMethodChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Methods</option>
              <option value="UPI" className="bg-slate-900 text-slate-200">UPI</option>
              <option value="Card" className="bg-slate-900 text-slate-200">Card</option>
              <option value="Net Banking" className="bg-slate-900 text-slate-200">Net Banking</option>
            </select>
          </div>

          {/* Filter 3: Failure Reason */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-400 flex-shrink-0">Reason:</span>
            <select
              value={reasonFilter}
              onChange={handleReasonChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full truncate cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Reasons</option>
              {failureReasons.map((reason) => (
                <option key={reason} value={reason} className="bg-slate-900 text-slate-200">
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Risk Level */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 border-purple-500/30">
            <ShieldAlert className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-xs font-medium text-purple-300 flex-shrink-0">Risk:</span>
            <select
              value={riskFilter}
              onChange={handleRiskChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Risk Levels</option>
              <option value="HIGH" className="bg-slate-900 text-rose-400">HIGH Risk</option>
              <option value="MEDIUM" className="bg-slate-900 text-amber-400">MEDIUM Risk</option>
              <option value="LOW" className="bg-slate-900 text-blue-400">LOW Risk</option>
            </select>
          </div>

          {/* Filter 5: AI Recommendation */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 border-indigo-500/30">
            <Bot className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
            <span className="text-xs font-medium text-indigo-300 flex-shrink-0">AI Action:</span>
            <select
              value={recommendationFilter}
              onChange={handleRecommendationChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full cursor-pointer truncate"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All AI Actions</option>
              <option value="RETRY_PAYMENT" className="bg-slate-900 text-emerald-400">RETRY_PAYMENT</option>
              <option value="REQUEST_CUSTOMER_ACTION" className="bg-slate-900 text-amber-400">REQUEST_CUSTOMER_ACTION</option>
              <option value="ESCALATE" className="bg-slate-900 text-purple-400">ESCALATE</option>
              <option value="STOP" className="bg-slate-900 text-rose-400">STOP</option>
            </select>
          </div>

          {/* Filter 6: Policy Result (Stage 4 Requirement #7) */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 border-emerald-500/30">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-medium text-emerald-300 flex-shrink-0">Policy:</span>
            <select
              value={policyFilter}
              onChange={handlePolicyChange}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none w-full cursor-pointer truncate"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Policy Results</option>
              <option value="ALLOWED" className="bg-slate-900 text-emerald-400">ALLOWED</option>
              <option value="BLOCKED" className="bg-slate-900 text-rose-400">BLOCKED</option>
              <option value="REVIEW" className="bg-slate-900 text-amber-400">REVIEW</option>
              <option value="HUMAN_REVIEW" className="bg-slate-900 text-amber-300">Human Review Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3.5">Transaction ID</th>
              <th scope="col" className="px-4 py-3.5">Customer</th>
              <th scope="col" className="px-4 py-3.5">Amount</th>
              <th scope="col" className="px-4 py-3.5">Method</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">Risk Level</th>
              <th scope="col" className="px-4 py-3.5">AI Recommendation</th>
              <th scope="col" className="px-4 py-3.5">Policy Gate</th>
              <th scope="col" className="px-4 py-3.5">Failure Reason</th>
              <th scope="col" className="px-4 py-3.5 text-center">Attempt</th>
              <th scope="col" className="px-4 py-3.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const isSelected = selectedTransactionId === r.transaction_id;
                return (
                  <tr
                    key={r.transaction_id}
                    onClick={() => onSelectTransaction(r)}
                    className={`cursor-pointer transition-colors hover:bg-indigo-950/30 ${
                      isSelected ? 'bg-indigo-950/60 border-l-4 border-l-indigo-500' : 'even:bg-slate-950/20'
                    }`}
                  >
                    {/* Transaction ID & Order ID */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-slate-100 font-semibold">{r.transaction_id}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.order_id}</div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="text-slate-200 font-medium">{r.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{r.customer_email}</div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                      {formatINR(r.amount)}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderMethodBadge(r.payment_method)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderStatusBadge(r.status)}
                    </td>

                    {/* Risk Level */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderRiskBadge(r)}
                    </td>

                    {/* AI Recommendation */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderAIRecommendationBadge(r)}
                    </td>

                    {/* Policy Result (Stage 4 Requirement #7) */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {renderPolicyBadge(r)}
                    </td>

                    {/* Failure Reason */}
                    <td className="px-4 py-3.5">
                      {r.failure_reason ? (
                        <span className="text-rose-300/90 text-xs inline-block max-w-[150px] truncate" title={r.failure_reason}>
                          {r.failure_reason}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs font-mono">—</span>
                      )}
                    </td>

                    {/* Attempt Number */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        #{r.attempt_number}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-3.5 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(r.timestamp)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 text-slate-600" />
                    <p className="text-sm font-semibold text-slate-300">No transactions match your filters</p>
                    <p className="text-xs text-slate-500">Try adjusting your search query or dropdown filter selections.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-200">{filteredRecords.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-200">{Math.min(startIndex + pageSize, filteredRecords.length)}</span> of{' '}
          <span className="font-semibold text-slate-200">{filteredRecords.length.toLocaleString('en-IN')}</span> entries
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 font-medium text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
