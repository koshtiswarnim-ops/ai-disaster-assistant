import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = (status || 'unknown').toLowerCase().replace('_', ' ');

  let bg = 'bg-slate-50 text-slate-600 border-slate-200';
  let dot = 'bg-slate-400';

  if (['operational', 'available', 'resolved', 'healthy', 'open'].includes(s)) {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dot = 'bg-emerald-600';
  } else if (['dispatched', 'assigned', 'in progress', 'on mission', 'en route'].includes(s)) {
    bg = 'bg-blue-50 text-blue-800 border-blue-200';
    dot = 'bg-blue-600';
  } else if (['low', 'warning', 'prioritized', 'verified'].includes(s)) {
    bg = 'bg-amber-50 text-amber-800 border-amber-200';
    dot = 'bg-amber-500';
  } else if (['critical', 'out of stock', 'impassable', 'diverted', 'damaged', 'full'].includes(s)) {
    bg = 'bg-rose-50 text-rose-800 border-rose-200';
    dot = 'bg-rose-600';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] font-mono uppercase font-semibold rounded border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{s}</span>
    </span>
  );
};
