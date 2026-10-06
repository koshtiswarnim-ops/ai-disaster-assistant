import React, { useState } from 'react';
import { HeaderBand } from '../components/layout/HeaderBand';
import { DisasterMap } from '../components/map/DisasterMap';
import { useDisaster } from '../context/DisasterContext';
import { IncidentDetailModal } from '../components/incidents/IncidentDetailModal';
import { AllocationModal } from '../components/allocation/AllocationModal';
import { Incident } from '../types';
import { MapPin, Layers, Radio, Shield, Activity, Home, Boxes, AlertTriangle } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const { incidents, rescueTeams, hospitals, shelters, warehouses, hazards, disaster, latestSOS } = useDisaster();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [allocationIncident, setAllocationIncident] = useState<Incident | null>(null);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'GIS & Maps' },
          { label: 'Live Disaster Map' }
        ]}
        title="Live Tactical Disaster Operations Map"
        description="Real-time spatial visualization of incident severity, rescue teams, hospital trauma loads, evacuation shelters, and road closures."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-4">
        {/* Latest Active SOS Live Alert Bar */}
        {latestSOS && (
          <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span className="font-bold text-rose-900">
                LATEST LIVE CITIZEN SOS: #{latestSOS.tracking_code}
              </span>
              <span className="text-rose-700 truncate">
                · {latestSOS.title} (GPS: {Number(latestSOS.latitude).toFixed(4)}, {Number(latestSOS.longitude).toFixed(4)})
              </span>
            </div>
            <button
              onClick={() => setSelectedIncident(latestSOS)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs shrink-0 transition-colors"
            >
              🎯 Focus on Map
            </button>
          </div>
        )}

        {/* Quick summary stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200 p-3 rounded flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Incidents</span>
              <span className="text-sm font-bold font-mono text-slate-900">{incidents.length} ACTIVE</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3 rounded flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Responders</span>
              <span className="text-sm font-bold font-mono text-slate-900">{rescueTeams.length} UNITS</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3 rounded flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Trauma Centers</span>
              <span className="text-sm font-bold font-mono text-slate-900">{hospitals.length} OPEN</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3 rounded flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Shelters</span>
              <span className="text-sm font-bold font-mono text-slate-900">{shelters.length} FACILITIES</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3 rounded flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Road Hazards</span>
              <span className="text-sm font-bold font-mono text-slate-900">{hazards.length} IMPASSABLE</span>
            </div>
          </div>
        </div>

        {/* Full Interactive Map */}
        <DisasterMap
          height="680px"
          selectedIncident={selectedIncident || latestSOS}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
        />
      </div>

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAllocate={(inc) => setAllocationIncident(inc)}
      />

      <AllocationModal
        incident={allocationIncident}
        onClose={() => setAllocationIncident(null)}
      />
    </div>
  );
};
