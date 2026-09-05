import React from 'react';
import { Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    label: string;
    isPositive?: boolean;
    isWarning?: boolean;
  };
  isDemo?: boolean;
  badgeText?: string;
  accentColor?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'purple' | 'blue';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isDemo = false,
  badgeText,
  accentColor = 'indigo',
}) => {
  const accentClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const iconBgClasses = {
    indigo: 'bg-indigo-950 text-indigo-400 border-indigo-800/60',
    emerald: 'bg-emerald-950 text-emerald-400 border-emerald-800/60',
    rose: 'bg-rose-950 text-rose-400 border-rose-800/60',
    amber: 'bg-amber-950 text-amber-400 border-amber-800/60',
    purple: 'bg-purple-950 text-purple-400 border-purple-800/60',
    blue: 'bg-blue-950 text-blue-400 border-blue-800/60',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-slate-800/30 blur-2xl group-hover:bg-slate-700/40 transition-all pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {isDemo && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-tight" title="Demo dataset estimated value">
              DEMO DATA
            </span>
          )}
        </div>
        <div className={`p-2.5 rounded-lg border shadow-inner ${iconBgClasses[accentColor]}`}>
          {icon}
        </div>
      </div>

      {/* Value Row */}
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-normal flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Row */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {trend ? (
          <span
            className={`inline-flex items-center font-medium ${
              trend.isWarning
                ? 'text-rose-400'
                : trend.isPositive
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {trend.label}
          </span>
        ) : badgeText ? (
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${accentClasses[accentColor]}`}>
            {badgeText}
          </span>
        ) : (
          <span className="text-slate-500 text-[11px] flex items-center gap-1">
            <Info className="h-3 w-3" /> Full 1k dataset
          </span>
        )}
      </div>
    </div>
  );
};
