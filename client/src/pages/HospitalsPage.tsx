import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { StatusBadge } from '../components/common/StatusBadge';
import { Hospital } from '../types';
import { api } from '../services/api';
import { 
  Activity, 
  HeartPulse, 
  Sparkles, 
  Navigation, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  Phone, 
  Plus, 
  Minus, 
  Hospital as HospitalIcon, 
  AlertTriangle,
  Send,
  Boxes
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HospitalsPage: React.FC = () => {
  const { hospitals, incidents, refreshData } = useDisaster();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [beds, setBeds] = useState<number>(0);
  const [icu, setIcu] = useState<number>(0);
  const [status, setStatus] = useState<string>('open');
  const [isUpdating, setIsUpdating] = useState(false);
  const [resupplyMessage, setResupplyMessage] = useState<string | null>(null);

  const isHospitalOperator = user.role === 'hospital';
  const isCitizen = user.role === 'citizen';

  // Primary facility for the logged-in doctor
  const myHospital = hospitals.find(h => h.name.includes('Metropolitan') || h.trauma_level === 1) || hospitals[0];

  const handleQuickAdjust = async (hospitalId: string, deltaBeds: number, deltaIcu: number) => {
    const target = hospitals.find(h => h.id === hospitalId);
    if (!target) return;

    const newBeds = Math.max(0, Math.min(target.total_beds, target.available_beds + deltaBeds));
    const newIcu = Math.max(0, Math.min(target.icu_total, target.icu_available + deltaIcu));

    try {
      await api.updateHospitalCapacity(hospitalId, {
        available_beds: newBeds,
        icu_available: newIcu
      });
      await refreshData();
    } catch (err: any) {
      alert(`Adjustment failed: ${err.message}`);
    }
  };

  const handleToggleDivert = async (hospitalId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'open' ? 'diverted' : 'open';
    try {
      await api.updateHospitalCapacity(hospitalId, { status: nextStatus });
      await refreshData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleRequestSupplies = async () => {
    try {
      await api.createAlert({
        title: `URGENT MEDICAL RESUPPLY: ${myHospital?.name || 'Metropolitan Hospital'}`,
        message: 'Requesting immediate emergency dispatch of 40 Trauma Hemostatic Kits and 20 Blood Plasma Units.',
        severity: 'severe',
        type: 'medical_resupply'
      });
      setResupplyMessage('Emergency resupply requisition transmitted to Central Depot!');
      setTimeout(() => setResupplyMessage(null), 4000);
      refreshData();
    } catch (err: any) {
      alert(`Request failed: ${err.message}`);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    setIsUpdating(true);
    try {
      await api.updateHospitalCapacity(editingHospital.id, {
        available_beds: beds,
        icu_available: icu,
        status: status as any
      });
      await refreshData();
      setEditingHospital(null);
    } catch (e: any) {
      alert(`Error updating: ${e.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // High-priority casualty queue
  const incomingTraumaIncidents = incidents.filter(
    i => i.severity === 'critical' && i.status !== 'resolved'
  );

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Medical Operations' },
          { label: 'Hospitals & Trauma Centers' }
        ]}
        title="Emergency Hospital Triage & Bed Capacity Network"
        description="Live ICU availability, level-1 trauma facilities, surgical capabilities, and patient divert protocols."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE WORKSPACE: HOSPITAL TRIAGE OPERATOR (Dr. Arvind Patel) */}
        {isHospitalOperator && myHospital && (
          <div className="card-soft bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-white border-rose-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-600 text-white">
                    Medical Triage Console
                  </span>
                  <span className="text-xs font-bold text-rose-800">Authorized: Dr. Arvind Patel</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HospitalIcon className="w-5 h-5 text-rose-600" />
                  {myHospital.name} (Trauma Level {myHospital.trauma_level})
                </h2>
                <p className="text-xs text-slate-600">
                  Address: <strong>{myHospital.address}</strong> · Phone: <strong>{myHospital.phone}</strong> · Helipad: <strong>{myHospital.has_helipad ? 'Active' : 'No'}</strong>
                </p>
              </div>

              {/* Instant Capacity Fast-Adjusters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* General Beds Quick Click */}
                <div className="bg-white border border-rose-200 rounded-xl p-2.5 shadow-2xs text-center min-w-[120px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">General Beds</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => handleQuickAdjust(myHospital.id, -5, 0)}
                      className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700"
                      title="Decrease by 5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-base font-bold text-slate-900">{myHospital.available_beds}</span>
                    <button
                      onClick={() => handleQuickAdjust(myHospital.id, 5, 0)}
                      className="p-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700"
                      title="Increase by 5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ICU Beds Quick Click */}
                <div className="bg-white border border-rose-200 rounded-xl p-2.5 shadow-2xs text-center min-w-[120px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">ICU / Vent Beds</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => handleQuickAdjust(myHospital.id, 0, -2)}
                      className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700"
                      title="Decrease by 2"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-base font-bold text-rose-600">{myHospital.icu_available}</span>
                    <button
                      onClick={() => handleQuickAdjust(myHospital.id, 0, 2)}
                      className="p-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700"
                      title="Increase by 2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Divert Toggle */}
                <button
                  onClick={() => handleToggleDivert(myHospital.id, myHospital.status)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    myHospital.status === 'open'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  }`}
                >
                  {myHospital.status === 'open' ? 'STATUS: OPEN' : 'STATUS: DIVERTED'}
                </button>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-900">
                <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Live EMR Triage Telemetry Sync Active</span>
                {resupplyMessage && (
                  <span className="ml-2 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {resupplyMessage}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRequestSupplies}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Boxes className="w-3.5 h-3.5 text-rose-600" />
                  Request Trauma Resupply
                </button>
                <button
                  onClick={() => navigate('/command-center')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  EOC Command Center
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROLE WORKSPACE: CITIZEN VIEW */}
        {isCitizen && (
          <div className="card-soft bg-blue-50/80 border-blue-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Need Immediate Emergency Medical Care?</h3>
                <p className="text-xs text-slate-600">
                  If you are experiencing severe bleeding, difficulty breathing, or trauma, submit an SOS or call 911 immediately.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/sos"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs whitespace-nowrap"
              >
                🚨 Tap SOS for Paramedic
              </Link>
            </div>
          </div>
        )}

        {/* Incoming Trauma Queue (Hospital & Authority View) */}
        {incomingTraumaIncidents.length > 0 && (
          <div className="card-soft p-4 bg-white border-rose-200/60 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900">
                  High-Acuity Incoming Casualty Queue ({incomingTraumaIncidents.length} Critical Cases)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Priority Triage Stream</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {incomingTraumaIncidents.slice(0, 3).map(inc => (
                <div key={inc.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      #{inc.tracking_code}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600">Priority: {inc.priority_score}/100</span>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate">{inc.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{inc.description}</p>
                  <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-500">
                    <span>{inc.address || 'Waterfront Grid'}</span>
                    <span className="text-rose-700 font-bold capitalize">{inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Standard Beds Free</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {hospitals.reduce((acc, h) => acc + h.available_beds, 0)}
            </p>
            <span className="text-xs text-slate-400">Across {hospitals.length} receiving centers</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Critical ICU Beds Free</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {hospitals.reduce((acc, h) => acc + h.icu_available, 0)}
            </p>
            <span className="text-xs text-slate-400">High acuity life-support</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Trauma Level 1 Centers</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {hospitals.filter(h => h.trauma_level === 1).length}
            </p>
            <span className="text-xs text-slate-400">Surgical & burn readiness</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Facilities on Diversion</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {hospitals.filter(h => h.status === 'diverted').length}
            </p>
            <span className="text-xs text-slate-400">Routing redirected</span>
          </div>
        </div>

        {/* Hospital Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hospitals.map(h => {
            const bedPercent = Math.round(((h.total_beds - h.available_beds) / h.total_beds) * 100);
            const isMine = isHospitalOperator && myHospital?.id === h.id;

            return (
              <div 
                key={h.id} 
                className={`card-soft p-5 bg-white border-slate-200 space-y-4 transition-all ${
                  isMine ? 'ring-2 ring-rose-400 border-rose-300' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        Trauma Level {h.trauma_level} Center
                      </span>
                      {isMine && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                          YOUR FACILITY
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{h.name}</h3>
                    <p className="text-xs text-slate-500">{h.address}</p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>

                {/* Occupancy bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Bed Occupancy:</span>
                    <strong className="text-slate-900">{bedPercent}% Full ({h.available_beds} Free)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${bedPercent > 90 ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${bedPercent}%` }}
                    />
                  </div>
                </div>

                {/* ICU Status */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">ICU Capacity:</span>
                    <strong className="text-slate-900">{h.icu_available} / {h.icu_total} Available</strong>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.icu_available > 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {h.icu_available > 2 ? 'Adequate' : 'Critical Low'}
                  </span>
                </div>

                {/* Specialties */}
                {h.specialties && (
                  <div className="flex flex-wrap gap-1">
                    {h.specialties.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Helipad: {h.has_helipad ? 'Active' : 'No'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/routes')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 flex items-center gap-1"
                      title="Route to hospital"
                    >
                      <Navigation className="w-3 h-3" />
                      Route
                    </button>
                    <button
                      onClick={() => {
                        setEditingHospital(h);
                        setBeds(h.available_beds);
                        setIcu(h.icu_available);
                        setStatus(h.status);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                    >
                      Update Triage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Edit Capacity Modal */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update {editingHospital.name} Capacity
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Available General Beds</label>
                <input
                  type="number"
                  min="0"
                  max={editingHospital.total_beds}
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Available ICU Beds</label>
                <input
                  type="number"
                  min="0"
                  max={editingHospital.icu_total}
                  value={icu}
                  onChange={(e) => setIcu(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Diversion Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="open">Open (Accepting Patients)</option>
                  <option value="diverted">Diverted (Full - Redirect Ambulances)</option>
                  <option value="damaged">Damaged / Limited Operations</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  {isUpdating ? 'Saving...' : 'Save Telemetry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
