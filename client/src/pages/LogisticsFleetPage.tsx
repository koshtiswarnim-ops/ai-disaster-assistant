import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import { 
  Truck, 
  Fuel, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Navigation, 
  AlertTriangle, 
  Wrench, 
  Activity,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LogisticsFleetPage: React.FC = () => {
  const { vehicles, refreshData } = useDisaster();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [updatingVehicleId, setUpdatingVehicleId] = useState<string | null>(null);

  const isLogisticsOperator = user.role === 'logistics';

  const filteredVehicles = vehicles.filter(v => {
    if (typeFilter === 'all') return true;
    return v.type === typeFilter;
  });

  const handleUpdateStatus = async (vehicleId: string, newStatus: string) => {
    setUpdatingVehicleId(vehicleId);
    try {
      await api.updateVehicle(vehicleId, { status: newStatus as any });
      await refreshData();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setUpdatingVehicleId(null);
    }
  };

  const handleRefuel = async (vehicleId: string) => {
    setUpdatingVehicleId(vehicleId);
    try {
      await api.updateVehicle(vehicleId, { fuel_percent: 100 });
      await refreshData();
    } catch (err: any) {
      alert(`Refuel failed: ${err.message}`);
    } finally {
      setUpdatingVehicleId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Logistics' },
          { label: 'Fleet Management' }
        ]}
        title="Emergency Fleet & Specialized Transit Telemetry"
        description="Ambulances, high-water rescue trucks, rigid inflatable boats, utility drones, and all-weather evacuation buses."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE WORKSPACE: FLEET LOGISTICS COMMANDER (Sgt. Tom Bradley) */}
        {isLogisticsOperator && (
          <div className="card-soft bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white border-emerald-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white">
                    Fleet Command Console
                  </span>
                  <span className="text-xs font-bold text-emerald-900">Sgt. Tom Bradley</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  Transit & Heavy Transport Division
                </h2>
                <p className="text-xs text-slate-600">
                  Managing <strong>{vehicles.length} tactical units</strong> · Ready: <strong>{vehicles.filter(v => v.status === 'available').length} Available</strong> · Active: <strong>{vehicles.filter(v => v.status === 'en_route' || v.status === 'on_mission').length} Deployed</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/routes')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Road Clearance Corridors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fleet KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Registered Fleet</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{vehicles.length}</p>
            <span className="text-xs text-slate-400">All terrain & emergency units</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Available In Staging</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {vehicles.filter(v => v.status === 'available').length}
            </p>
            <span className="text-xs text-slate-400">Ready for instant dispatch</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active On Missions</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {vehicles.filter(v => v.status === 'en_route' || v.status === 'on_mission').length}
            </p>
            <span className="text-xs text-slate-400">On mission routes</span>
          </div>

          <div className="card-soft p-4 bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Average Fuel Level</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {Math.round(vehicles.reduce((acc, v) => acc + (v.fuel_percent || 0), 0) / (vehicles.length || 1))}%
            </p>
            <span className="text-xs text-slate-400">Readiness reserve index</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="card-soft p-4 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Vehicle Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field text-xs w-auto py-1"
            >
              <option value="all">All Vehicle Types</option>
              <option value="ambulance">Type III Ambulance</option>
              <option value="high_water_truck">High-Water Rescue Truck</option>
              <option value="rescue_boat">Rigid Inflatable Boat</option>
              <option value="evacuation_bus">Evacuation Bus</option>
              <option value="cargo_truck">Heavy Cargo Transport</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong>{filteredVehicles.length}</strong> active vehicles
          </span>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map(v => (
            <div key={v.id} className="card-soft p-5 bg-white border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {v.registration_number}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 capitalize">{v.type.replace('_', ' ')}</h3>
                  <p className="text-xs text-slate-500">{v.make_model}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Fuel className={`w-3.5 h-3.5 ${v.fuel_percent < 30 ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span>Fuel: <strong>{v.fuel_percent}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Seats: <strong>{v.passenger_capacity}</strong></span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
                <span>Driver: <strong className="text-slate-800">{v.driver_name}</strong></span>
                <span>Payload: <strong>{v.capacity_payload_kg} kg</strong></span>
              </div>

              {/* Status Update Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px]">Set:</span>
                  <select
                    value={v.status}
                    onChange={(e) => handleUpdateStatus(v.id, e.target.value)}
                    disabled={updatingVehicleId === v.id}
                    className="text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-800"
                  >
                    <option value="available">Available</option>
                    <option value="en_route">En Route</option>
                    <option value="on_mission">On Mission</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRefuel(v.id)}
                  disabled={updatingVehicleId === v.id || v.fuel_percent >= 95}
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    v.fuel_percent < 95 ? 'text-blue-600 hover:underline' : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Fuel className="w-3 h-3" />
                  Top-up Fuel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
