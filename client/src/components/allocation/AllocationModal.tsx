import React, { useState, useEffect } from 'react';
import { Incident } from '../../types';
import { api } from '../../services/api';
import { useDisaster } from '../../context/DisasterContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { Sparkles, Shield, Clock, Navigation, CheckCircle2, X, AlertTriangle } from 'lucide-react';

interface AllocationModalProps {
  incident: Incident | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AllocationModal: React.FC<AllocationModalProps> = ({
  incident,
  onClose,
  onSuccess
}) => {
  const { dispatchMission } = useDisaster();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!incident) return;
    setLoading(true);
    api.aiAllocate(incident.id)
      .then((rec) => {
        setRecommendation(rec);
        if (rec.recommended_team) setSelectedTeamId(rec.recommended_team.team_id);
        if (rec.recommended_vehicle) setSelectedVehicleId(rec.recommended_vehicle.vehicle_id);
        setObjective(`Extract and evacuate victims at ${incident.address || 'incident site'}. Provide paramedic stabilization and triage.`);
      })
      .catch((err) => {
        console.error('Failed to fetch allocation:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [incident]);

  if (!incident) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await dispatchMission({
        incident_id: incident.id,
        team_id: selectedTeamId,
        vehicle_id: selectedVehicleId,
        target_hospital_id: recommendation?.recommended_hospital?.hospital_id || null,
        priority: incident.severity,
        objective
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Dispatch error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-700 text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-600" />
                AI Smart Resource Allocation
              </span>
              <PriorityBadge priority={incident.severity} score={incident.priority_score} />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{incident.title}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Incident #{incident.tracking_code} · Location: {incident.address}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Computing optimal resource matching, hazard routing, and hospital capacities...
            </div>
          ) : recommendation ? (
            <>
              {/* AI Rationale banner */}
              <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                    AI Allocation Rationale
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-normal">
                    <Clock className="w-3.5 h-3.5" />
                    ETA: ~{recommendation.expected_arrival_minutes} MINS
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Candidate Teams Selection */}
              <div>
                <label className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block mb-2">
                  Select Rescue Taskforce
                </label>
                <div className="space-y-2">
                  {recommendation.candidate_teams?.map((team: any) => {
                    const isSelected = selectedTeamId === team.team_id;
                    return (
                      <div
                        key={team.team_id}
                        onClick={() => setSelectedTeamId(team.team_id)}
                        className={`p-3 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/60'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">{team.team_name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{team.team_code}</span>
                            <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              team.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {team.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-500 mt-1">
                            {team.distance_km} km away · Transit: ~{team.estTravelMinutes} min · Skills: {team.skills?.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-slate-900 block">{team.matchScore}% MATCH</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900 ml-auto mt-1" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Vehicles Selection */}
              <div>
                <label className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block mb-2">
                  Select Dispatch Vehicle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendation.candidate_vehicles?.map((veh: any) => {
                    const isSelected = selectedVehicleId === veh.vehicle_id;
                    return (
                      <div
                        key={veh.vehicle_id}
                        onClick={() => setSelectedVehicleId(veh.vehicle_id)}
                        className={`p-2.5 rounded border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/60'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 font-mono">{veh.registration_number}</span>
                          <span className="text-[10px] uppercase font-mono text-slate-400">{veh.type.replace('_', ' ')}</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 mt-1">
                          Fuel: {veh.fuel_percent}% · Dist: {veh.distance_km} km
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hospital Destination (if recommended) */}
              {recommendation.recommended_hospital && (
                <div className="p-3 rounded border border-slate-200 bg-white text-xs">
                  <span className="font-mono uppercase text-[10px] text-slate-500 block mb-1">
                    Designated Receiving Hospital (Auto-Triage)
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{recommendation.recommended_hospital.name}</h4>
                      <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                        Distance: {recommendation.recommended_hospital.distance_km} km · Level {recommendation.recommended_hospital.trauma_level} Trauma Center
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 font-mono font-bold text-xs block">
                        {recommendation.recommended_hospital.available_beds} Beds / {recommendation.recommended_hospital.icu_available} ICU Available
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mission Objective Directive */}
              <div>
                <label className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Tactical Mission Objective Directive
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="input-field text-xs h-18 resize-none font-mono"
                  placeholder="Enter objective instructions for field team..."
                />
              </div>
            </>
          ) : (
            <p className="text-xs font-mono text-slate-500">Could not generate allocation recommendation.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Requires Emergency Authority approval
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isSubmitting || !selectedTeamId}
              className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              {isSubmitting ? 'Dispatching...' : 'Approve & Dispatch Mission'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
