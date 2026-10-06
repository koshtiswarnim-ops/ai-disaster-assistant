import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'emerald' | 'amber' | 'rose' | 'cobalt';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'cobalt'
}) => {
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  if (badgeType === 'emerald') badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (badgeType === 'rose') badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  if (badgeType === 'amber') badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';

  return (
    <div className="bg-white border border-slate-200 p-4 rounded interactive-hover-lift transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">{value}</span>
        {badge && (
          <span className={`text-[10px] font-mono uppercase tracking-wider font-medium px-1.5 py-0.5 rounded border ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-[11px] text-slate-500 font-normal truncate">{subtitle}</p>
      )}
    </div>
  );
};
