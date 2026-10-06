import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { KpiCard } from '../components/common/KpiCard';
import { DisasterMap } from '../components/map/DisasterMap';
import { IncidentCard } from '../components/incidents/IncidentCard';
import { IncidentDetailModal } from '../components/incidents/IncidentDetailModal';
import { AllocationModal } from '../components/allocation/AllocationModal';
import { Incident } from '../types';
import { 
  Radio, 
  AlertTriangle, 
  Users, 
  Boxes, 
  Activity, 
  Home, 
  ShieldAlert, 
  Sliders, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const CommandCenterPage: React.FC = () => {
  const { user, setRole } = useAuth();
  const { 
    disaster, 
    incidents, 
    rescueTeams, 
    hospitals, 
    shelters, 
    inventory, 
    missions, 
    refreshData,
    startSimulationCascade 
  } = useDisaster();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [allocationIncident, setAllocationIncident] = useState<Incident | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [bottomTab, setBottomTab] = useState<'missions' | 'hospitals' | 'inventory' | 'shelters'>('missions');

  // Sliding indicators
  const filterContainerRef = React.useRef<HTMLDivElement>(null);
  const [filterIndicator, setFilterIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const tabContainerRef = React.useRef<HTMLDivElement>(null);
  const [tabIndicator, setTabIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  React.useEffect(() => {
    if (!filterContainerRef.current) return;
    const activeBtn = filterContainerRef.current.querySelector(`[data-filter="${severityFilter}"]`) as HTMLElement | null;
    if (activeBtn) {
      setFilterIndicator({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    }
  }, [severityFilter]);

  React.useEffect(() => {
    if (!tabContainerRef.current) return;
    const activeBtn = tabContainerRef.current.querySelector(`[data-tab="${bottomTab}"]`) as HTMLElement | null;
    if (activeBtn) {
      setTabIndicator({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    }
  }, [bottomTab]);

  // Filtered incident list
  const filteredIncidents = incidents.filter(i => {
    if (severityFilter === 'all') return true;
    return i.severity === severityFilter;
  });

  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved');
  const activeSOSCount = incidents.filter(i => i.status !== 'resolved').length;
  const availableTeamsCount = rescueTeams.filter(t => t.status === 'available').length;
  const totalFreeBeds = hospitals.reduce((acc, h) => acc + h.available_beds, 0);
  const totalFreeShelter = shelters.reduce((acc, s) => acc + (s.capacity - s.current_occupancy), 0);
  const lowStockCount = inventory.filter(i => i.status === 'critical' || i.status === 'low').length;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      {/* Tinted Header Band */}
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Emergency Operations' },
          { label: 'Command Center' }
        ]}
        title={disaster ? `${disaster.title} · Command Center` : "DisasterOS Command Center"}
        description="Unified tactical situational awareness, AI multi-factor prioritization, and resource coordination."
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshData()}
              className="p-2 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh telemetry"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => startSimulationCascade()}
              className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Simulate Flood Cascade</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE-SPECIFIC WORKSPACE: OPERATOR VS CITIZEN */}
        {user.role === 'citizen' ? (
          <div className="card-soft bg-emerald-50/80 border-emerald-300 p-4.5 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-lg">
                👤
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white">
                    Citizen Mode Active
                  </span>
                  <span className="text-xs text-emerald-900 font-semibold">Viewing Operator Command Console</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Need emergency assistance, evacuation help, or shelter?
                </h3>
                <p className="text-[11.5px] text-slate-600">
                  This console is designed for emergency dispatchers. You can switch to the Citizen Safety Portal for 1-tap SOS distress and live tracking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/sos"
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
              >
                🚨 Go to Citizen SOS
              </Link>
              <button
                onClick={() => setRole('authority')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
              >
                Switch to Operator 🛡️
              </button>
            </div>
          </div>
        ) : (
          <div className="card-soft bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4.5 rounded-xl shadow-md border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400 text-slate-950">
                    OPERATOR CONSOLE
                  </span>
                  <span className="text-xs font-mono text-slate-300">Chief Marcus Vance · City EOC Command</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Unified Common Operational Picture & Multi-Agency Dispatch
                </h3>
                <p className="text-[11.5px] text-slate-300">
                  Full operator authority active: verify citizen SOS requests, assign rescue teams, and balance hospital ICU beds.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/incidents"
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
              >
                🚨 SOS Triage Queue
              </Link>
              <Link
                to="/allocation"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
              >
                Approve Allocations
              </Link>
              <Link
                to="/alerts"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
              >
                Broadcast Siren
              </Link>
            </div>
          </div>
        )}

        {/* KPI Row (Section 10) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard
            title="Critical SOS"
            value={criticalIncidents.length}
            subtitle="Immediate triage"
            icon={AlertTriangle}
            badge="Urgent"
            badgeType="rose"
          />
          <KpiCard
            title="Active Incidents"
            value={activeSOSCount}
            subtitle={`${incidents.filter(i => i.status === 'resolved').length} resolved`}
            icon={Radio}
            badge="Live"
            badgeType="cobalt"
          />
          <KpiCard
            title="Rescue Teams"
            value={`${availableTeamsCount} / ${rescueTeams.length}`}
            subtitle="Standby ready"
            icon={ShieldAlert}
            badge="Available"
            badgeType="emerald"
          />
          <KpiCard
            title="Hospital Beds"
            value={totalFreeBeds}
            subtitle="Citywide available"
            icon={Activity}
            badge="Capacity"
            badgeType="cobalt"
          />
          <KpiCard
            title="Shelter Spaces"
            value={totalFreeShelter}
            subtitle="Immediate intake"
            icon={Home}
            badge="Open"
            badgeType="emerald"
          />
          <KpiCard
            title="Inventory Alerts"
            value={lowStockCount}
            subtitle="Depot items low"
            icon={Boxes}
            badge={lowStockCount > 0 ? "Check Stock" : "Healthy"}
            badgeType={lowStockCount > 0 ? "amber" : "emerald"}
          />
        </div>

        {/* Main Grid: Interactive Map + Critical Incident Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Interactive Operations Map */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Live Operations Map & Spatial Hazards
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> CRITICAL
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> HIGH
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> MEDIUM
                </span>
                <Link to="/map" className="text-slate-900 hover:underline font-sans text-xs font-medium flex items-center gap-0.5 ml-2">
                  Full Tactical Map &rarr;
                </Link>
              </div>
            </div>

            {/* The Map Component */}
            <DisasterMap
              height="530px"
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
            />
          </div>

          {/* Right Column (4 cols): Critical Incident Feed */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Critical Incident Feed
                </h2>
              </div>

              {/* Severity Filter with Sliding Indicator */}
              <div ref={filterContainerRef} className="relative flex items-center gap-0.5 text-[11px] font-mono bg-slate-100 p-0.5 rounded border border-slate-200">
                <div
                  className="absolute top-0.5 bottom-0.5 rounded bg-white shadow-2xs sliding-pill-indicator pointer-events-none"
                  style={{
                    transform: `translateX(${filterIndicator.left}px)`,
                    width: `${filterIndicator.width}px`,
                  }}
                />
                {(['all', 'critical', 'high'] as const).map(sev => (
                  <button
                    key={sev}
                    data-filter={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`relative z-10 px-2.5 py-0.5 rounded uppercase text-[10.5px] font-medium transition-colors ${
                      severityFilter === sev ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Cards Stack */}
            <div className="space-y-3 max-h-[530px] overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded p-8 text-center text-xs font-mono text-slate-400">
                  No active incidents matching current filter.
                </div>
              ) : (
                filteredIncidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    isSelected={selectedIncident?.id === incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    onAllocate={() => setAllocationIncident(incident)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Connected Telemetry Tabs */}
        <div className="bg-white border border-slate-200 p-5 rounded">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Operational Agency Telemetry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live multi-agency status and resource allocations across active sectors</p>
            </div>

            {/* Segmented Tab Controls with Sliding Pill Indicator */}
            <div ref={tabContainerRef} className="relative inline-flex p-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">
              <div
                className="absolute top-0.5 bottom-0.5 rounded bg-white shadow-2xs sliding-pill-indicator pointer-events-none"
                style={{
                  transform: `translateX(${tabIndicator.left}px)`,
                  width: `${tabIndicator.width}px`,
                }}
              />
              {[
                { id: 'missions', label: 'Missions', count: missions.length },
                { id: 'hospitals', label: 'Hospitals', count: hospitals.length },
                { id: 'shelters', label: 'Shelters', count: shelters.length },
                { id: 'inventory', label: 'Depot Stock', count: inventory.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => setBottomTab(tab.id as any)}
                  className={`relative z-10 px-3 py-1 rounded text-[11px] uppercase tracking-wider font-medium transition-colors ${
                    bottomTab === tab.id ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Missions */}
          {bottomTab === 'missions' && (
            <div className="overflow-x-auto animate-slide-up">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Mission Code</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Objective Directive</th>
                    <th className="py-2.5 px-3">Assigned Team</th>
                    <th className="py-2.5 px-3">Assigned At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missions.map(m => {
                    const team = rescueTeams.find(t => t.id === m.team_id);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.mission_code}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.priority === 'critical' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {m.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold capitalize text-slate-800">{m.status.replace('_', ' ')}</td>
                        <td className="py-2.5 px-3 truncate max-w-xs">{m.objective}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{team?.name || 'Unassigned'}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{new Date(m.assigned_at).toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Hospitals */}
          {bottomTab === 'hospitals' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-slide-up">
              {hospitals.map(h => (
                <div key={h.id} className="p-3.5 rounded border border-slate-200 bg-white space-y-2 interactive-hover-lift">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900">{h.name}</h4>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      h.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-0.5 font-mono text-slate-600">
                    <div>Beds: <strong className="text-slate-900 font-bold">{h.available_beds}</strong> / {h.total_beds}</div>
                    <div>ICU: <strong className="text-slate-900 font-bold">{h.icu_available}</strong> / {h.icu_total}</div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Trauma Level: {h.trauma_level} · Helipad: {h.has_helipad ? 'YES' : 'NO'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Shelters */}
          {bottomTab === 'shelters' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-slide-up">
              {shelters.map(s => {
                const percent = Math.round((s.current_occupancy / s.capacity) * 100);
                return (
                  <div key={s.id} className="p-3.5 rounded border border-slate-200 bg-white space-y-2 interactive-hover-lift">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-slate-900">{s.name}</h4>
                      <span className="text-[11px] font-mono font-bold text-slate-700">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full ${percent > 90 ? 'bg-rose-600' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 flex justify-between">
                      <span>Occupancy: {s.current_occupancy} / {s.capacity}</span>
                      <span>Food Reserve: {s.food_supplies_days}d</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Inventory */}
          {bottomTab === 'inventory' && (
            <div className="overflow-x-auto animate-slide-up">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Available</th>
                    <th className="py-2.5 px-3">Reserved</th>
                    <th className="py-2.5 px-3">Min Threshold</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {inventory.slice(0, 6).map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{item.item_name}</td>
                      <td className="py-2.5 px-3 capitalize font-sans text-slate-600">{item.category.replace('_', ' ')}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.quantity_available} {item.unit}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.quantity_reserved} {item.unit}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.minimum_threshold} {item.unit}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                          item.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.status === 'low' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAllocate={(inc) => setAllocationIncident(inc)}
      />

      {/* Smart Resource Allocation Modal */}
      <AllocationModal
        incident={allocationIncident}
        onClose={() => setAllocationIncident(null)}
      />
    </div>
  );
};
