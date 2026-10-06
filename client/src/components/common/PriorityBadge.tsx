import React from 'react';

interface PriorityBadgeProps {
  priority: string;
  score?: number;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, score, size = 'sm' }) => {
  const p = (priority || 'medium').toLowerCase();
  
  let colorStyles = 'bg-slate-50 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (p === 'critical') {
    colorStyles = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-600';
  } else if (p === 'high') {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (p === 'medium') {
    colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
    dotColor = 'bg-blue-600';
  } else if (p === 'low' || p === 'resolved') {
    colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-600';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold rounded border ${colorStyles} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{p}</span>
      {score !== undefined && (
        <span className="font-mono opacity-60">[{score}]</span>
      )}
    </span>
  );
};
