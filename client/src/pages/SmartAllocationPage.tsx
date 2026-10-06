import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { AllocationModal } from '../components/allocation/AllocationModal';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Incident } from '../types';
import { api } from '../services/api';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const SmartAllocationPage: React.FC = () => {
  const { incidents, rescueTeams, refreshData } = useDisaster();
  const [allocationIncident, setAllocationIncident] = useState<Incident | null>(null);
  const [reallocations, setReallocations] = useState<any[]>([]);
  const [loadingRealloc, setLoadingRealloc] = useState(false);

  const pendingIncidents = incidents.filter(i => 
    i.status !== 'resolved' && (i.status === 'prioritized' || i.status === 'submitted' || i.status === 'verified')
  );

  const fetchDynamicReallocations = () => {
    setLoadingRealloc(true);
    api.getDynamicReallocations()
      .then(res => setReallocations(res.recommendations || []))
      .catch(e => console.warn(e))
      .finally(() => setLoadingRealloc(false));
  };

  useEffect(() => {
    fetchDynamicReallocations();
  }, [incidents]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Intelligence' },
          { label: 'Smart Resource Allocation' }
        ]}
        title="AI Multi-Factor Resource Allocation Engine"
        description="Requirement &rarr; Candidate Resources &rarr; Recommended Allocation &rarr; Authority Approval &rarr; Mission Dispatch."
        actionButton={
          <button
            onClick={fetchDynamicReallocations}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRealloc ? 'animate-spin' : ''}`} />
            Scan Dynamic Swaps
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* Dynamic Reallocation Alert Section (Section 16) */}
        {reallocations.length > 0 && (
          <div className="card-soft p-5 bg-amber-50/60 border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Dynamic Reallocation Recommendation Detected</span>
            </div>
            {reallocations.map((rec, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{rec.rationale}</p>
                  <p className="text-slate-500">{rec.expected_impact}</p>
                </div>
                <button
                  onClick={() => {
                    const target = incidents.find(i => i.id === rec.critical_incident.id);
                    if (target) setAllocationIncident(target);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0"
                >
                  Review Reallocation &rarr;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pending Incidents Needing Allocation */}
        <div className="card-soft p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Unassigned Incidents Awaiting Resource Matching ({pendingIncidents.length})
              </h3>
              <p className="text-xs text-slate-500">Triage queue sorted by AI calculated urgency score</p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingIncidents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All reported emergency incidents currently have active missions assigned.
              </div>
            ) : (
              pendingIncidents.map(inc => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={inc.severity} score={inc.priority_score} />
                      <span className="font-mono text-xs font-semibold text-slate-400">#{inc.tracking_code}</span>
                      <span className="text-xs text-slate-500 font-medium truncate max-w-xs">{inc.address}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{inc.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setAllocationIncident(inc)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Smart Match Resources
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <AllocationModal
        incident={allocationIncident}
        onClose={() => setAllocationIncident(null)}
        onSuccess={() => {
          refreshData();
          fetchDynamicReallocations();
        }}
      />
    </div>
  );
};
