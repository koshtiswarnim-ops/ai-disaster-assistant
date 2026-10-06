import React from 'react';
import { Incident } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { X, MapPin, Users, HeartPulse, Sparkles, Shield, Clock, Send } from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onAllocate?: (incident: Incident) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onAllocate,
  onUpdateStatus
}) => {
  if (!incident) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <PriorityBadge priority={incident.severity} score={incident.priority_score} size="md" />
              <StatusBadge status={incident.status} />
              <span className="font-mono text-xs font-medium text-slate-400">
                #{incident.tracking_code}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{incident.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
              Distress Transmission Log
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
              {incident.description}
            </p>
          </div>

          {/* Demographic Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-3 rounded border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Exposed</span>
              <span className="text-lg font-bold text-slate-900">{incident.affected_count}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Injured</span>
              <span className="text-lg font-bold text-slate-900">{incident.injured_count}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Trapped</span>
              <span className="text-lg font-bold text-slate-900">{incident.trapped_count}</span>
            </div>
            <div className="p-3 rounded border border-slate-200 bg-white text-center">
              <span className="text-[10px] uppercase text-slate-500 block">Vulnerable</span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block">
                {incident.has_children_elderly ? 'CHILD / SENIOR' : 'NONE'}
              </span>
            </div>
          </div>

          {/* AI Prioritization & Classification Intelligence */}
          {incident.ai_classification && (
            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-mono font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                <span>AI Decision Engine Classification</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({Math.round(incident.ai_classification.confidence * 100)}% Confidence)
                </span>
              </div>
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900">Category:</strong> {incident.ai_classification.category}
              </p>
              {incident.ai_classification.rationale && (
                <p className="text-xs text-slate-600 italic">
                  &ldquo;{incident.ai_classification.rationale}&rdquo;
                </p>
              )}
              {incident.ai_classification.recommended_response && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                    Recommended Resource Allocation Payload:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {incident.ai_classification.recommended_response.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[10.5px] font-medium border border-slate-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location details */}
          <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 font-mono">
            <div className="flex items-center gap-2 font-sans">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{incident.address || 'Reported Location'}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onUpdateStatus && incident.status !== 'resolved' && (
              <button
                onClick={() => onUpdateStatus(incident.id, 'resolved')}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Mark Resolved
              </button>
            )}
            {onUpdateStatus && incident.status === 'submitted' && (
              <button
                onClick={() => onUpdateStatus(incident.id, 'verified')}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium"
              >
                Verify Incident
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs font-medium"
            >
              Close
            </button>
            {onAllocate && (
              <button
                onClick={() => {
                  onClose();
                  onAllocate(incident);
                }}
                className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                Launch Smart Allocation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
