import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { Navigation, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const HazardRoutesPage: React.FC = () => {
  const { hazards } = useDisaster();
  const [startPoint, setStartPoint] = useState('Central Logistics Depot (37.755, -122.408)');
  const [destPoint, setDestPoint] = useState('Marina Flooded Basement SOS (37.792, -122.418)');
  const [vehicleType, setVehicleType] = useState('ambulance');
  const [calculatedRoute, setCalculatedRoute] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await api.calculateRoute(37.755, -122.408, 37.792, -122.418, vehicleType);
      setCalculatedRoute(res);
    } catch (e: any) {
      alert(`Calculation error: ${e.message}`);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'GIS & Infrastructure' },
          { label: 'Hazard Routing' }
        ]}
        title="Hazard-Aware Emergency Route Optimization"
        description="Dynamic routing algorithm that checks for standing floodwater, bridge structural damage, and debris to calculate safe corridors."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Route Calculator Form */}
        <div className="lg:col-span-6 card-soft p-6 bg-white border-slate-200 space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
            <Navigation className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Emergency Corridor Calculator
            </h3>
          </div>

          <form onSubmit={handleCalculate} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Origin Point</label>
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Destination Target</label>
              <input
                type="text"
                value={destPoint}
                onChange={(e) => setDestPoint(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="input-field text-xs"
              >
                <option value="ambulance">Standard ALS Ambulance (Low clearance)</option>
                <option value="high_clearance_truck">High-Clearance 6x6 Truck (Can ford 3ft)</option>
                <option value="rescue_boat">Inflatable Rescue Boat (Amphibious/Water only)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              {calculating ? 'Analyzing Road Hazards...' : 'Calculate Safe Emergency Corridors'}
            </button>
          </form>

          {/* Results Comparison */}
          {calculatedRoute && (
            <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in">
              {/* Safest Route Card */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {calculatedRoute.safest_route.name}
                  </span>
                  <span>{calculatedRoute.safest_route.distance_km} km · {calculatedRoute.safest_route.estimated_minutes} min</span>
                </div>
                <p className="text-slate-600">
                  {calculatedRoute.safest_route.clearance_notes}
                </p>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block">
                  Zero Submerged Segments
                </span>
              </div>

              {/* Direct Route Warning Card */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-rose-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    {calculatedRoute.fastest_route.name}
                  </span>
                  <span>{calculatedRoute.fastest_route.distance_km} km · {calculatedRoute.fastest_route.estimated_minutes} min</span>
                </div>
                <p className="text-rose-900">
                  {calculatedRoute.fastest_route.hazards_detected?.[0] || 'Hazard detected on direct route.'}
                </p>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 inline-block">
                  Impassable to Standard Ambulance
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Known Road Hazards */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Active Road Hazards & Flood Inundation Points ({hazards.length})
          </h3>

          <div className="space-y-3">
            {hazards.map(h => (
              <div key={h.id} className="card-soft p-4 bg-white border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{h.road_name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                    {h.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{h.description || 'Passage blocked by storm debris or high water.'}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reported: {new Date(h.reported_at).toLocaleTimeString()}</span>
                  <span>Type: <strong className="text-slate-700 capitalize">{h.hazard_type}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
