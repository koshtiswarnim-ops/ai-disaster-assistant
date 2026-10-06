import React from 'react';
import { Incident } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Users, HeartPulse, Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  onAllocate?: () => void;
  isSelected?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onClick,
  onAllocate,
  isSelected
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border p-4 rounded cursor-pointer interactive-hover-lift transition-all duration-150 ${
        isSelected ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/70 shadow-xs' : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={incident.severity} score={incident.priority_score} />
          <StatusBadge status={incident.status} />
        </div>
        <span className="font-mono text-[11px] text-slate-400 font-medium">
          #{incident.tracking_code}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1 mb-1">
        {incident.title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
        {incident.description}
      </p>

      {/* Meta indicators */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 font-mono">
        <span className="flex items-center gap-1 font-sans">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[140px]">{incident.address || 'GPS Coordinates'}</span>
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3 text-slate-400" />
          <span>{incident.affected_count} affected</span>
        </span>
        {incident.medical_urgency && (
          <span className="flex items-center gap-1 text-rose-700 font-medium font-sans">
            <HeartPulse className="w-3 h-3" />
            <span>Medical Urgent</span>
          </span>
        )}
      </div>

      {/* AI Recommendation Summary */}
      {incident.ai_classification && (
        <div className="mt-2.5 p-2 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-700 flex items-start gap-1.5 font-mono">
          <Sparkles className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
          <p className="line-clamp-1">
            <span className="font-semibold text-slate-900 uppercase">AI Triage:</span> {incident.ai_classification.category}
          </p>
        </div>
      )}

      {/* Quick Action */}
      {onAllocate && (incident.status === 'prioritized' || incident.status === 'submitted') && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">Needs Resource Allocation</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAllocate();
            }}
            className="text-xs font-medium text-slate-900 hover:text-slate-700 flex items-center gap-0.5"
          >
            Review & Allocate <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
