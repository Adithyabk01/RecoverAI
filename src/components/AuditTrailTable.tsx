import React, { useState, useMemo } from 'react';
import type { PaymentRecord, AuditFilterState } from '../types/payment';
import { formatINR } from '../services/metrics';
import { Filter, Search, CheckCircle2, AlertTriangle, XCircle, FileText, UserCheck } from 'lucide-react';

interface AuditTrailTableProps {
  records: PaymentRecord[];
  onSelectTransaction: (record: PaymentRecord) => void;
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ records, onSelectTransaction }) => {
  const [filters, setFilters] = useState<AuditFilterState>({
    aiAction: 'ALL',
    policyStatus: 'ALL',
    executionStatus: 'ALL',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter audit records (only recovery-eligible records have audit logs)
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (rec.status === 'SUCCESS' || !rec.auditRecord) return false;

      const audit = rec.auditRecord;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTxn = rec.transaction_id.toLowerCase().includes(query);
        const matchesAuditId = audit.auditId.toLowerCase().includes(query);
        const matchesCustomer = rec.customer_name.toLowerCase().includes(query);
        if (!matchesTxn && !matchesAuditId && !matchesCustomer) return false;
      }

      // AI Action Filter
      if (filters.aiAction !== 'ALL' && audit.aiDecision.action !== filters.aiAction) {
        return false;
      }

      // Policy Status Filter
      if (filters.policyStatus !== 'ALL' && audit.policy.status !== filters.policyStatus) {
        return false;
      }

      // Execution Status Filter
      if (filters.executionStatus !== 'ALL') {
        if (filters.executionStatus === 'NOT_EXECUTED') {
          if (audit.execution.status !== 'NOT_EXECUTED' && audit.execution.status !== 'BLOCKED') {
            return false;
          }
        } else if (audit.execution.status !== filters.executionStatus) {
          return false;
        }
      }

      return true;
    });
  }, [records, filters, searchQuery]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* Table Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Audit Trail Ledger</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredRecords.length} filtered audit records (Dataset baseline metrics remain unchanged)
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit ID, TXN, customer..."
              className="pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* AI Action Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">AI Action:</span>
            <select
              value={filters.aiAction}
              onChange={(e) => setFilters((f) => ({ ...f, aiAction: e.target.value }))}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All</option>
              <option value="RETRY_PAYMENT" className="bg-slate-900 text-slate-200">RETRY_PAYMENT</option>
              <option value="REQUEST_CUSTOMER_ACTION" className="bg-slate-900 text-slate-200">REQUEST_CUSTOMER_ACTION</option>
              <option value="ESCALATE" className="bg-slate-900 text-slate-200">ESCALATE</option>
              <option value="STOP" className="bg-slate-900 text-slate-200">STOP</option>
            </select>
          </div>

          {/* Policy Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Policy:</span>
            <select
              value={filters.policyStatus}
              onChange={(e) => setFilters((f) => ({ ...f, policyStatus: e.target.value }))}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All</option>
              <option value="ALLOWED" className="bg-slate-900 text-slate-200">ALLOWED</option>
              <option value="BLOCKED" className="bg-slate-900 text-slate-200">BLOCKED</option>
              <option value="REVIEW" className="bg-slate-900 text-slate-200">REVIEW</option>
            </select>
          </div>

          {/* Execution Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Execution:</span>
            <select
              value={filters.executionStatus}
              onChange={(e) => setFilters((f) => ({ ...f, executionStatus: e.target.value }))}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All</option>
              <option value="SIMULATED_SUCCESS" className="bg-slate-900 text-slate-200">SIMULATED_SUCCESS</option>
              <option value="SIMULATED_FAILURE" className="bg-slate-900 text-slate-200">SIMULATED_FAILURE</option>
              <option value="BLOCKED" className="bg-slate-900 text-slate-200">BLOCKED</option>
              <option value="NOT_EXECUTED" className="bg-slate-900 text-slate-200">NOT_EXECUTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Audit ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">AI Action</th>
              <th className="py-3 px-4">Policy Result</th>
              <th className="py-3 px-4">Execution Status</th>
              <th className="py-3 px-4">Human Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No audit records match the current filter selection.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => {
                const audit = rec.auditRecord!;
                const dateStr = new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr
                    key={rec.transaction_id}
                    onClick={() => onSelectTransaction(rec)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {audit.auditId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {dateStr}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{rec.transaction_id}</div>
                      <div className="text-[11px] text-slate-400">{rec.customer_name}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {formatINR(rec.amount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-300">
                      {audit.aiDecision.action}
                    </td>
                    <td className="py-3 px-4">
                      {audit.policy.status === 'ALLOWED' && (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> ALLOWED
                        </span>
                      )}
                      {audit.policy.status === 'BLOCKED' && (
                        <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3 mr-1" /> BLOCKED
                        </span>
                      )}
                      {audit.policy.status === 'REVIEW' && (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="h-3 w-3 mr-1" /> REVIEW
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {audit.execution.status === 'SIMULATED_SUCCESS' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          SIMULATED_SUCCESS
                        </span>
                      )}
                      {audit.execution.status === 'SIMULATED_FAILURE' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          SIMULATED_FAILURE
                        </span>
                      )}
                      {(audit.execution.status === 'BLOCKED' || audit.execution.status === 'NOT_EXECUTED') && (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          NOT_EXECUTED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {audit.policy.requiresHumanReview ? (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full">
                          <UserCheck className="h-3 w-3 mr-1" /> YES
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">NO</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
