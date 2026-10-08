import React, { useState } from 'react';
import {
  LayoutGrid,
  AlertTriangle,
  FileText,
  Map as MapIcon,
  Building,
  Landmark,
  BarChart2,
  ShieldCheck,
  Settings,
  LogOut,
  Flame,
  Activity,
  ArrowRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { Language } from './RoleSwitcherBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet icon setup
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const emergencyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface EmergencyItem {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  status: 'RESPONDING' | 'ALERT SENT' | 'RESOLVED';
  assignedTo: string;
  department: string;
  ward: string;
  lat: number;
  lng: number;
  severity: 'critical' | 'high' | 'moderate';
}

interface CivicCommandCenterViewProps {
  emergencies: EmergencyItem[];
  onDispatchTeam?: (id: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToField?: () => void;
}

export const CivicCommandCenterView: React.FC<CivicCommandCenterViewProps> = ({
  emergencies,
  onDispatchTeam,
  language,
  onLanguageChange,
  onNavigateToField,
}) => {
  const [activeNav, setActiveNav] = useState('overview');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'NORMAL'>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<EmergencyItem | null>(null);

  const filteredEmergencies = emergencies.filter((em) => {
    if (severityFilter === 'ALL') return true;
    if (severityFilter === 'EMERGENCY') return em.status === 'RESPONDING' || em.status === 'ALERT SENT';
    if (severityFilter === 'CRITICAL') return em.severity === 'critical';
    if (severityFilter === 'HIGH') return em.severity === 'high';
    return em.severity === 'moderate';
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f6f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- DARK THEME SIDEBAR ----------------- */}
      <aside className="w-full md:w-64 bg-[#1a1917] text-stone-300 border-r border-stone-800 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Top Municipal Authority Badges */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="bg-rose-700 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              MUNICIPAL AUTHORITY
            </span>
            <span className="bg-stone-800 text-stone-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-stone-700">
              GOV-101
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-base font-bold text-white tracking-tight">Civic Command Center</h1>
            <p className="text-xs text-stone-400">Municipal Administration</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'overview'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'अवलोकन (Overview)' : 'Overview'}</span>
            </button>

            <button
              onClick={() => setActiveNav('emergencies')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'emergencies'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{language === 'hi' ? 'आपातकाल' : 'Emergencies'}</span>
              </div>
              <span className="bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {emergencies.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('complaints')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'complaints'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'शिकायतें' : 'Complaints'}</span>
            </button>

            <button
              onClick={() => setActiveNav('map')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'map'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <MapIcon className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'संचालन मानचित्र' : 'Operational Map'}</span>
            </button>

            <button
              onClick={() => setActiveNav('departments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'departments'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'विभाग' : 'Departments'}</span>
            </button>

            <button
              onClick={() => setActiveNav('wards')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'wards'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'वार्ड' : 'Wards'}</span>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'analytics'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'विश्लेषण' : 'Analytics'}</span>
            </button>

            <button
              onClick={() => setActiveNav('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'audit'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'ऑडिट गतिविधि' : 'Audit Activity'}</span>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'settings'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-stone-400" />
              <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Language:</span>
            <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded border border-stone-800">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'en' ? 'bg-stone-700 text-white' : 'text-stone-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'hi' ? 'bg-amber-600 text-white' : 'text-stone-400'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <div>
              <p className="font-bold text-xs text-stone-200">Officer Sharma</p>
              <p className="text-[11px] text-stone-400">Ward 12 Municipal Desk</p>
            </div>
            <button title="Logout" className="text-stone-500 hover:text-stone-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN DESK CONTENT ----------------- */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl mx-auto">
        {/* Top Operational Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              MUNICIPAL OPERATIONS DESK • WARD 12
            </span>
            <h2 className="text-3xl font-black text-stone-950 tracking-tight mt-0.5">
              WHAT NEEDS ATTENTION?
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span>Wednesday, 7 October 2026</span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Civic Incident Feed: Live</span>
            </span>
          </div>
        </div>

        {/* ----------------- EMERGENCY ATTENTION CONTAINER ----------------- */}
        <div className="bg-[#fffbfb] border border-rose-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-700 text-white flex items-center justify-center font-bold text-xs">
                !
              </div>
              <div>
                <h3 className="font-bold text-sm text-rose-950 uppercase tracking-wide">
                  EMERGENCY ATTENTION
                </h3>
                <p className="text-xs text-rose-700 font-medium">
                  {emergencies.length} critical emergency incidents requiring immediate dispatch
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveNav('emergencies')}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Emergency Center</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Side-by-side Emergency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencies.map((em) => (
              <div
                key={em.id}
                onClick={() => setSelectedIncident(em)}
                className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-900">{em.code}</span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider ${
                      em.status === 'RESPONDING' ? 'bg-stone-900' : 'bg-rose-700'
                    }`}
                  >
                    {em.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-950 leading-snug">{em.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                    {em.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500">
                  <span className="truncate">{em.ward} • {em.department}</span>
                  <span className="font-bold text-stone-800 shrink-0 ml-2">{em.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------- PRIORITY QUEUE & TODAY METRICS ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority Queue Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  PRIORITY QUEUE
                </h3>
              </div>
              <button className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1">
                <span>Inspect Queue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                <span className="block text-2xl font-black text-rose-800">1</span>
                <span className="text-[11px] font-semibold text-rose-900">Critical</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <span className="block text-2xl font-black text-amber-800">2</span>
                <span className="text-[11px] font-semibold text-amber-900">High Priority</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl">
                <span className="block text-2xl font-black text-stone-700">1</span>
                <span className="text-[11px] font-semibold text-stone-600">Moderate</span>
              </div>
            </div>
          </div>

          {/* Today Municipal Metrics Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  TODAY MUNICIPAL METRICS
                </h3>
              </div>
              <button className="text-xs text-stone-500 hover:text-stone-800 font-medium">
                Ward-wide Summary
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                <span className="block text-xl font-black text-stone-900">5</span>
                <span className="text-[10px] text-stone-500 font-medium">Active Complaints</span>
              </div>
              <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                <span className="block text-xl font-black text-stone-900">4</span>
                <span className="text-[10px] text-stone-500 font-medium">Assigned</span>
              </div>
              <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                <span className="block text-xl font-black text-stone-900">0</span>
                <span className="text-[10px] text-stone-500 font-medium">Awaiting Action</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                <span className="block text-xl font-black text-emerald-800">1</span>
                <span className="text-[10px] text-emerald-900 font-medium">Resolved Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- MUNICIPAL GEOSPATIAL ISSUE MAP ----------------- */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-950 tracking-tight">
                MUNICIPAL GEOSPATIAL ISSUE MAP
              </h3>
              <p className="text-xs text-stone-500">
                Real-time map showing complaints, emergency incidents, and field assignments
              </p>
            </div>

            <button
              onClick={() => setActiveNav('map')}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full Map View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Severity Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 text-xs">
            <span className="font-bold text-stone-500 text-[11px] uppercase mr-1">SEVERITY FILTER:</span>
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                severityFilter === 'ALL'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSeverityFilter('EMERGENCY')}
              className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                severityFilter === 'EMERGENCY'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span>⚡ Emergency</span>
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                severityFilter === 'CRITICAL'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              CRITICAL
            </button>
            <button
              onClick={() => setSeverityFilter('HIGH')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                severityFilter === 'HIGH'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              HIGH
            </button>
            <button
              onClick={() => setSeverityFilter('NORMAL')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                severityFilter === 'NORMAL'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              NORMAL
            </button>
          </div>

          {/* Embedded Interactive Leaflet Map */}
          <div className="h-72 w-full rounded-2xl overflow-hidden border border-stone-200 relative">
            <MapContainer
              center={[28.6745, 77.2215]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredEmergencies.map((em) => (
                <Marker
                  key={em.id}
                  position={[em.lat, em.lng]}
                  icon={em.severity === 'critical' ? emergencyIcon : defaultIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1">
                      <p className="font-bold text-xs text-stone-900">{em.title}</p>
                      <p className="text-[11px] text-stone-600">{em.location}</p>
                      <p className="text-[10px] text-rose-700 font-bold uppercase">{em.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </main>

      {/* Incident Quick Inspect Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {selectedIncident.code} • {selectedIncident.severity.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-stone-950 mt-1">{selectedIncident.title}</h3>
                <p className="text-xs text-stone-500">{selectedIncident.ward} • {selectedIncident.department}</p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
              <p><strong>Description:</strong> {selectedIncident.description}</p>
              <p><strong>Site Location:</strong> {selectedIncident.location} (GPS: {selectedIncident.lat}, {selectedIncident.lng})</p>
              <p><strong>Assigned Field Personnel:</strong> {selectedIncident.assignedTo}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onNavigateToField) onNavigateToField();
                  setSelectedIncident(null);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open in Field Operations View</span>
              </button>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
