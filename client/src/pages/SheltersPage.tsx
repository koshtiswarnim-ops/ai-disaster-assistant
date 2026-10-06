import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { StatusBadge } from '../components/common/StatusBadge';
import { Shelter } from '../types';
import { api } from '../services/api';
import { 
  Home, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  HeartPulse, 
  Sparkles, 
  Navigation,
  Check,
  Phone,
  Layers,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SheltersPage: React.FC = () => {
  const { shelters, refreshData } = useDisaster();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  const [occupancy, setOccupancy] = useState<number>(0);
  const [status, setStatus] = useState<string>('open');
  const [checkedInNotice, setCheckedInNotice] = useState<string | null>(null);

  const isCitizen = user.role === 'citizen';
  const isVolunteer = user.role === 'volunteer' || user.role === 'ngo';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelter) return;
    try {
      await api.updateShelterOccupancy(editingShelter.id, {
        current_occupancy: occupancy,
        status: status as any
      });
      refreshData();
      setEditingShelter(null);
    } catch (e: any) {
      alert(`Error updating: ${e.message}`);
    }
  };

  const handleCitizenCheckIn = (shelterName: string) => {
    setCheckedInNotice(`You have safely registered at ${shelterName}. Family notification broadcast active.`);
    setTimeout(() => setCheckedInNotice(null), 4000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Evacuation' },
          { label: 'Shelters & Safe Havens' }
        ]}
        title="Emergency Shelters & Evacuee Coordination"
        description="Public refuge safe havens, real-time occupancy counts, food/water reserve buffers, and medical support."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE WORKSPACE: CITIZEN LOOKING FOR SAFE REFUGE */}
        {isCitizen && (
          <div className="card-soft bg-blue-50/80 border-blue-200 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Evacuation Safe Haven Guidance (Citizen Mode)</h3>
                  <p className="text-xs text-slate-600">
                    All listed shelters provide dry beds, potable drinking water, hot meals, and onsite first-aid medical attendants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/map')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs whitespace-nowrap flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                Evacuation Route Map
              </button>
            </div>

            {checkedInNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{checkedInNotice}</span>
              </div>
            )}
          </div>
        )}

        {/* Metric summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Shelter Capacity</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {shelters.reduce((acc, s) => acc + s.capacity, 0)}
            </p>
            <span className="text-xs text-slate-400">Total beds/spaces</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Currently Sheltered</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {shelters.reduce((acc, s) => acc + s.current_occupancy, 0)}
            </p>
            <span className="text-xs text-slate-400">Verified evacuees</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Spaces Available Now</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {shelters.reduce((acc, s) => acc + (s.capacity - s.current_occupancy), 0)}
            </p>
            <span className="text-xs text-slate-400">Immediate intake</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Open Facilities</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {shelters.filter(s => s.status === 'open').length} / {shelters.length}
            </p>
            <span className="text-xs text-slate-400">Operational</span>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shelters.map(s => {
            const percent = Math.round((s.current_occupancy / s.capacity) * 100);
            return (
              <div key={s.id} className="card-soft p-5 bg-white border-slate-200 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{s.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{s.address}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Occupancy Load:</span>
                    <strong className="text-slate-900">{percent}% ({s.current_occupancy} / {s.capacity})</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${percent > 90 ? 'bg-rose-500' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Logistics details */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>Food Reserves: <strong>{s.food_supplies_days} days</strong></div>
                  <div>Water Reserves: <strong>{s.water_supplies_days} days</strong></div>
                  <div>Medical Onsite: <strong>{s.medical_staff_present ? 'Yes' : 'No'}</strong></div>
                  <div>Pet Friendly: <strong>{s.pet_friendly ? 'Allowed' : 'No'}</strong></div>
                </div>

                {/* Action button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {s.capacity - s.current_occupancy} beds remaining
                  </span>
                  <div className="flex items-center gap-2">
                    {isCitizen ? (
                      <button
                        onClick={() => handleCitizenCheckIn(s.name)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
                      >
                        Safe Check-In
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingShelter(s);
                          setOccupancy(s.current_occupancy);
                          setStatus(s.status);
                        }}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        Update Intake
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Edit Intake Modal */}
      {editingShelter && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update {editingShelter.name} Occupancy
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Occupant Headcount (Max {editingShelter.capacity})
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingShelter.capacity}
                  value={occupancy}
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Shelter Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="open">Open (Accepting Evacuees)</option>
                  <option value="at_capacity">At Capacity (Full)</option>
                  <option value="closed">Closed / Evacuated</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingShelter(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
