import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import { 
  Shield, 
  Phone, 
  Users, 
  CheckCircle2, 
  Navigation, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Activity, 
  Clock, 
  Send, 
  CheckCircle, 
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RescueTeamsPage: React.FC = () => {
  const { rescueTeams, missions, refreshData, incidents } = useDisaster();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [hazardModalOpen, setHazardModalOpen] = useState(false);
  const [hazardRoad, setHazardRoad] = useState('');
  const [hazardType, setHazardType] = useState('flooded');
  const [hazardDesc, setHazardDesc] = useState('');
  const [hazardSubmitting, setHazardSubmitting] = useState(false);

  // Status toggle handler
  const handleStatusChange = async (teamId: string, newStatus: string) => {
    setUpdatingId(teamId);
    try {
      await api.updateRescueTeam(teamId, { status: newStatus as any });
      await refreshData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Mission progression handler
  const handleMissionStatus = async (missionId: string, currentStatus: string) => {
    let nextStatus: 'en_route' | 'on_scene' | 'completed' = 'en_route';
    if (currentStatus === 'assigned' || currentStatus === 'dispatched') nextStatus = 'en_route';
    else if (currentStatus === 'en_route') nextStatus = 'on_scene';
    else if (currentStatus === 'on_scene') nextStatus = 'completed';

    try {
      await api.updateMission(missionId, { status: nextStatus });
      await refreshData();
    } catch (err: any) {
      alert(`Mission update failed: ${err.message}`);
    }
  };

  // Road hazard report handler
  const handleReportHazard = async (e: React.FormEvent) => {
    e.preventDefault();
    setHazardSubmitting(true);
    try {
      await api.createAlert({
        title: `Field Hazard: ${hazardRoad}`,
        message: `${hazardType.toUpperCase()}: ${hazardDesc || 'Roadway reported impassable by rescue team.'}`,
        severity: 'severe',
        type: 'road_blocked'
      });
      await refreshData();
      setHazardModalOpen(false);
      setHazardRoad('');
      setHazardDesc('');
    } catch (err: any) {
      alert(`Report failed: ${err.message}`);
    } finally {
      setHazardSubmitting(false);
    }
  };

  const isRescueOperator = user.role === 'rescue_team';
  const myTeam = rescueTeams.find(t => t.lead_name.includes('Jenkins') || t.team_code === 'RT-SWIFT-01') || rescueTeams[0];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Field Operations' },
          { label: 'Rescue Teams' }
        ]}
        title="Tactical Rescue Teams & Responder Readiness"
        description="Swiftwater extraction units, USAR structural collapse taskforces, and tactical paramedic triage teams."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE-SPECIFIC WORKSPACE PANEL: RESCUE TEAM OPERATOR */}
        {isRescueOperator && myTeam && (
          <div className="card-soft bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-amber-200/80 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-600 text-white">
                    My Active Field Unit
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-900">{myTeam.team_code}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  {myTeam.name}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Officer in Command: <strong>{myTeam.lead_name}</strong> · Comms: <strong>{myTeam.phone}</strong> · Personnel: <strong>{myTeam.capacity} deployable</strong>
                </p>
              </div>

              {/* Status Update Quick Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 mr-1">Unit Readiness:</span>
                {(['available', 'dispatched', 'on_scene', 'rest'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(myTeam.id, st)}
                    disabled={updatingId === myTeam.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      myTeam.status === st
                        ? 'bg-amber-600 text-white shadow-2xs ring-2 ring-amber-400/50'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    {st === 'rest' ? 'resting' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Shortcuts for Rescue Responder */}
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Field Grid GPS Telemetry Synchronized with DisasterOS EOC</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHazardModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Report Road Hazard
                </button>
                <button
                  onClick={() => navigate('/routes')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Tactical Hazard-Free Routes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Readiness Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Taskforces</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{rescueTeams.length}</p>
            <span className="text-xs text-slate-400">Search & Extraction units</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Available Immediately</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {rescueTeams.filter(t => t.status === 'available').length}
            </p>
            <span className="text-xs text-slate-400">Zero deployment delay</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Currently In Action</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {rescueTeams.filter(t => t.status === 'dispatched' || t.status === 'on_scene').length}
            </p>
            <span className="text-xs text-slate-400">Active field missions</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Field Personnel Count</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {rescueTeams.reduce((acc, t) => acc + (t.capacity || 0), 0)}
            </p>
            <span className="text-xs text-slate-400">Trained tactical specialists</span>
          </div>
        </div>

        {/* Rescue Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rescueTeams.map(t => {
            const activeMission = missions.find(m => m.team_id === t.id && m.status !== 'completed');
            const targetIncident = activeMission ? incidents.find(i => i.id === activeMission.incident_id) : null;
            const isCurrentTeam = isRescueOperator && myTeam?.id === t.id;

            return (
              <div 
                key={t.id} 
                className={`card-soft p-5 bg-white border-slate-200 space-y-4 transition-all ${
                  isCurrentTeam ? 'ring-2 ring-amber-400 border-amber-300' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {t.team_code}
                      </span>
                      {isCurrentTeam && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{t.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Lead Commander: <strong className="text-slate-700">{t.lead_name}</strong></p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unit Strength: {t.capacity} members</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">Certified Capabilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                        {skill.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Mission Details */}
                {activeMission ? (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                        Mission {activeMission.mission_code}
                      </span>
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {activeMission.status.replace('_', ' ')}
                      </span>
                    </div>
                    {targetIncident && (
                      <p className="text-slate-700 text-xs truncate">
                        <strong>Target:</strong> {targetIncident.title} ({targetIncident.address || 'Field Location'})
                      </p>
                    )}
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <Link 
                        to="/routes" 
                        className="text-blue-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Navigation className="w-3 h-3" />
                        Route to Target
                      </Link>
                      <button
                        onClick={() => handleMissionStatus(activeMission.id, activeMission.status)}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                      >
                        {activeMission.status === 'on_scene' ? 'Mark Completed' : activeMission.status === 'en_route' ? 'Set On Scene' : 'Set En Route'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>No active mission assigned</span>
                    <span className="text-emerald-600 font-semibold text-[11px]">Standing By</span>
                  </div>
                )}

                {/* Quick Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[11px]">Set Status:</span>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      disabled={updatingId === t.id}
                      className="text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-800"
                    >
                      <option value="available">Available</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="on_scene">On Scene</option>
                      <option value="returning">Returning</option>
                      <option value="rest">Resting</option>
                    </select>
                  </div>

                  <button
                    onClick={() => navigate('/map')}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Compass className="w-3 h-3" />
                    Locate on Map
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Hazard Modal */}
      {hazardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Report Field Road Blockage
              </h3>
              <button onClick={() => setHazardModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Field observations immediately alert other emergency vehicles and the AI routing engine to reroute convoys.
            </p>

            <form onSubmit={handleReportHazard} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Road / Intersection Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marina Blvd & Scott St"
                  value={hazardRoad}
                  onChange={(e) => setHazardRoad(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Hazard Nature</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="flooded">Flooded / High Water Level</option>
                  <option value="structural_collapse">Structural Debris / Collapse</option>
                  <option value="power_lines">Downed High-Voltage Power Lines</option>
                  <option value="bridge_closed">Bridge Impassable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Field Observations</label>
                <textarea
                  rows={2}
                  placeholder="Water depth approx 3 feet, impassable to ambulances..."
                  value={hazardDesc}
                  onChange={(e) => setHazardDesc(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHazardModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={hazardSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  {hazardSubmitting ? 'Transmitting...' : 'Broadcast Blockage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
