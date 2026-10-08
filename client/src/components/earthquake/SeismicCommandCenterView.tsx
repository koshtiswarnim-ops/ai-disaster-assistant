import React, { useState } from 'react';
import {
  LayoutGrid,
  Map as MapIcon,
  BarChart2,
  LogOut,
  Flame,
  Activity,
  ArrowRight,
  ExternalLink,
  Layers,
  Calculator,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Language } from './EarthquakeSwitcherBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const redMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface SeismicSiteMarker {
  id: string;
  name: string;
  city: string;
  zone: 'V' | 'IV' | 'III' | 'II';
  lat: number;
  lng: number;
  soil: string;
  zFactor: number;
  criticalIssue?: string;
}

const REGIONAL_SITES: SeismicSiteMarker[] = [
  { id: 's1', name: 'G+8 Apex Lifeline Center', city: 'Delhi NCR', zone: 'IV', lat: 28.6139, lng: 77.2090, soil: 'Type II Medium Soil', zFactor: 0.24, criticalIssue: 'High Base Shear (Vb = 1,258 kN)' },
  { id: 's2', name: 'Assam Medical University Core', city: 'Guwahati', zone: 'V', lat: 26.1445, lng: 91.7362, soil: 'Type III Soft Alluvium', zFactor: 0.36, criticalIssue: 'Zone V Very Severe (PGA 0.36g)' },
  { id: 's3', name: 'Kutch Reconstructed Commercial', city: 'Bhuj', zone: 'V', lat: 23.2420, lng: 69.6669, soil: 'Type II Stiff Sand', zFactor: 0.36, criticalIssue: 'Mandatory RC Shear Walls' },
  { id: 's4', name: 'Mumbai Coastal Residential', city: 'Mumbai', zone: 'III', lat: 19.0760, lng: 72.8777, soil: 'Type II Marine Clay', zFactor: 0.16, criticalIssue: 'Moderate Wind + Seismic Dual' },
  { id: 's5', name: 'Kashmir Valley Residential G+5', city: 'Srinagar', zone: 'V', lat: 34.0837, lng: 74.7973, soil: 'Type II River Valley Silt', zFactor: 0.36, criticalIssue: 'IS 13920 Confined Links @ 75mm' },
  { id: 's6', name: 'Silicon Tech Park Phase 2', city: 'Bengaluru', zone: 'II', lat: 12.9716, lng: 77.5946, soil: 'Type I Granite Rock', zFactor: 0.10, criticalIssue: 'Low Seismic (Z=0.10)' },
];

interface SeismicCommandCenterViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToDetailing?: () => void;
}

export const SeismicCommandCenterView: React.FC<SeismicCommandCenterViewProps> = ({
  language,
  onLanguageChange,
  onNavigateToDetailing,
}) => {
  // Only 3 Essential Tabs
  const [activeNav, setActiveNav] = useState<'overview' | 'map' | 'spectra'>('overview');
  const [zoneFilter, setZoneFilter] = useState<'ALL' | 'V' | 'IV' | 'III' | 'II'>('ALL');

  // Response Spectra interactive soil state
  const [activeSoil, setActiveSoil] = useState<'I' | 'II' | 'III'>('II');

  const filteredSites = REGIONAL_SITES.filter((s) => {
    if (zoneFilter === 'ALL') return true;
    return s.zone === zoneFilter;
  });

  // Calculate Sa/g values for the curve
  const calculateSag = (T: number, soil: 'I' | 'II' | 'III') => {
    if (soil === 'I') {
      if (T <= 0.10) return 1 + 15 * T;
      if (T <= 0.40) return 2.50;
      return Math.min(2.5, 1.00 / T);
    } else if (soil === 'II') {
      if (T <= 0.10) return 1 + 15 * T;
      if (T <= 0.55) return 2.50;
      return Math.min(2.5, 1.36 / T);
    } else {
      if (T <= 0.10) return 1 + 15 * T;
      if (T <= 0.67) return 2.50;
      return Math.min(2.5, 1.67 / T);
    }
  };

  const samplePeriods = [0.05, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7, 1.0, 1.5, 2.0, 3.0];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f6f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- STREAMLINED DARK SIDEBAR (3 IMP OPTIONS) ----------------- */}
      <aside className="w-full md:w-64 bg-[#1a1917] text-stone-300 border-r border-stone-800 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Top Authority Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="bg-rose-700 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              STRUCTURAL AUTHORITY
            </span>
            <span className="bg-stone-800 text-stone-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-stone-700">
              IS-1893-REV6
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-base font-bold text-white tracking-tight">Seismic Command Center</h1>
            <p className="text-xs text-stone-400">IS 1893 Structural Administration</p>
          </div>

          {/* Navigation Links - 3 Essential Options */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'overview'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-stone-400" />
              <span>Operations Overview</span>
            </button>

            <button
              onClick={() => setActiveNav('map')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'map'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapIcon className="w-4 h-4 text-stone-400" />
                <span>National Seismic Map</span>
              </div>
              <span className="bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                4 Zones
              </span>
            </button>

            <button
              onClick={() => setActiveNav('spectra')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-xs transition-all ${
                activeNav === 'spectra'
                  ? 'bg-stone-800 text-white shadow-xs font-bold border border-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-stone-400" />
              <span>Response Spectra Engine</span>
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
              <p className="font-bold text-xs text-stone-200">Dr. V. K. Sharma</p>
              <p className="text-[11px] text-stone-400">IS 1893 Committee Advisor</p>
            </div>
            <button title="Logout" className="text-stone-500 hover:text-stone-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- DYNAMIC MAIN CONTENT PANELS ----------------- */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl mx-auto">
        {/* PANEL 1: OPERATIONS OVERVIEW */}
        {activeNav === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  SEISMIC DESIGN OPERATIONS DESK • INDIA ZONE MAP
                </span>
                <h2 className="text-3xl font-black text-stone-950 tracking-tight mt-0.5">
                  WHAT NEEDS STRUCTURAL ATTENTION?
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-600">
                <span>IS 1893:2016 Edition Part 1</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Ductile Standards: Active</span>
                </span>
              </div>
            </div>

            {/* Critical Structural Attention Container */}
            <div className="bg-[#fffbfb] border border-rose-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-700 text-white flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-rose-950 uppercase tracking-wide">
                      CRITICAL STRUCTURAL ATTENTION
                    </h3>
                    <p className="text-xs text-rose-700 font-medium">
                      2 critical buildings exhibiting severe seismic irregularity requiring immediate design revision
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToDetailing && onNavigateToDetailing()}
                  className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>Inspect Rebar Detailing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Side-by-side Critical Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900">S-1024</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider bg-rose-700">
                      ZONE IV ALERT
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-stone-950 leading-snug">
                      Potential Soft-Storey Irregularity in G+6 Building
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Ground floor stilt parking without RC shear wall. Lateral stiffness &lt; 70% of floor above. Pancake collapse risk.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500">
                    <span>Delhi NCR (Zone IV) • Medium Soil</span>
                    <span className="font-bold text-stone-800">Er. Rajesh Kumar</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900">S-1025</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider bg-rose-700">
                      REBAR WARNING
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-stone-950 leading-snug">
                      High Joint Shear Stress in G+12 Hospital Frame
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Beam-column joint shear stress exceeds allowable limits per IS 13920. 135° seismic hoops and cross-ties mandatory.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500">
                    <span>Guwahati (Zone V) • Soft Alluvium</span>
                    <span className="font-bold text-stone-800">Er. Manish Yadav</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Boards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      SEISMIC HAZARD QUEUE
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">IS 1893 Categories</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                    <span className="block text-2xl font-black text-rose-800">1</span>
                    <span className="text-[11px] font-semibold text-rose-900">Zone V (Z=0.36)</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                    <span className="block text-2xl font-black text-amber-800">2</span>
                    <span className="text-[11px] font-semibold text-amber-900">Zone IV (Z=0.24)</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl">
                    <span className="block text-2xl font-black text-stone-700">1</span>
                    <span className="text-[11px] font-semibold text-stone-600">Zone III (Z=0.16)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      STRUCTURAL DESIGN METRICS
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">Daily Compilation</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                    <span className="block text-xl font-black text-stone-900">5</span>
                    <span className="text-[10px] text-stone-500 font-medium">Analyzed</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                    <span className="block text-xl font-black text-stone-900">4</span>
                    <span className="text-[10px] text-stone-500 font-medium">SMRF Frames</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl">
                    <span className="block text-xl font-black text-stone-900">0</span>
                    <span className="text-[10px] text-stone-500 font-medium">Violations</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                    <span className="block text-xl font-black text-emerald-800">1</span>
                    <span className="text-[10px] text-emerald-900 font-medium">Rebar Specs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: NATIONAL SEISMIC GIS MAP VIEW */}
        {activeNav === 'map' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  GEOSPATIAL SEISMIC INTELLIGENCE
                </span>
                <h3 className="text-2xl font-black text-stone-950 tracking-tight">
                  National Seismic Hazard & Soil Map
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">IS 1893:2016 Map Reference</span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 text-xs">
              <span className="font-bold text-stone-500 text-[11px] uppercase mr-1">SEISMIC ZONE:</span>
              <button
                onClick={() => setZoneFilter('ALL')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  zoneFilter === 'ALL'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                ALL ZONES
              </button>
              <button
                onClick={() => setZoneFilter('V')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                  zoneFilter === 'V'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <span>⚡ Zone V (Z=0.36)</span>
              </button>
              <button
                onClick={() => setZoneFilter('IV')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  zoneFilter === 'IV'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Zone IV (Z=0.24)
              </button>
              <button
                onClick={() => setZoneFilter('III')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  zoneFilter === 'III'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Zone III (Z=0.16)
              </button>
              <button
                onClick={() => setZoneFilter('II')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  zoneFilter === 'II'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Zone II (Z=0.10)
              </button>
            </div>

            {/* Large Interactive Leaflet Map */}
            <div className="h-96 w-full rounded-2xl overflow-hidden border border-stone-300 relative shadow-xs">
              <MapContainer
                center={[22.5, 78.5]}
                zoom={5}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredSites.map((site) => (
                  <Marker
                    key={site.id}
                    position={[site.lat, site.lng]}
                    icon={site.zone === 'V' ? redMarker : site.zone === 'IV' ? orangeMarker : site.zone === 'III' ? yellowMarker : blueMarker}
                  >
                    <Popup>
                      <div className="p-1 space-y-1">
                        <p className="font-bold text-xs text-stone-900">{site.name}</p>
                        <p className="text-[11px] text-stone-600">{site.city} • Zone {site.zone} (Z={site.zFactor})</p>
                        <p className="text-[10px] text-stone-500 font-semibold">{site.soil}</p>
                        {site.criticalIssue && (
                          <p className="text-[10px] text-rose-700 font-bold">{site.criticalIssue}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* PANEL 3: RESPONSE SPECTRA DYNAMIC ENGINE */}
        {activeNav === 'spectra' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                IS 1893:2016 CLAUSE 6.4.2
              </span>
              <h3 className="text-2xl font-black text-stone-950 tracking-tight">
                Design Horizontal Acceleration Spectrum (Sa/g)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Dynamic 5% damping response spectrum for Type I (Rock), Type II (Medium), and Type III (Soft) soils
              </p>
            </div>

            {/* Interactive Soil Toggle */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setActiveSoil('I')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeSoil === 'I'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="font-bold text-xs block">Type I: Rock / Hard Strata</span>
                <span className="text-[11px] opacity-75 font-mono">Corner Period Tc = 0.40s</span>
              </button>

              <button
                onClick={() => setActiveSoil('II')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeSoil === 'II'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="font-bold text-xs block">Type II: Medium / Stiff Soil</span>
                <span className="text-[11px] opacity-75 font-mono">Corner Period Tc = 0.55s</span>
              </button>

              <button
                onClick={() => setActiveSoil('III')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  activeSoil === 'III'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="font-bold text-xs block">Type III: Soft Soil Strata</span>
                <span className="text-[11px] opacity-75 font-mono">Corner Period Tc = 0.67s</span>
              </button>
            </div>

            {/* Calculated Spectral Values Table & Visualizer */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-stone-900">
                  Spectral Acceleration Multipliers (Sa/g) for {activeSoil === 'I' ? 'Type I Rock' : activeSoil === 'II' ? 'Type II Medium' : 'Type III Soft'}
                </h4>
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-mono font-bold">
                  Peak Plateau: 2.50
                </span>
              </div>

              {/* Spectral Bar Graph Visualizer */}
              <div className="space-y-2 pt-2">
                {samplePeriods.map((T) => {
                  const val = calculateSag(T, activeSoil);
                  const widthPercent = (val / 2.5) * 100;
                  return (
                    <div key={T} className="flex items-center gap-3 text-xs">
                      <span className="w-16 font-mono text-stone-500 shrink-0">T = {T}s</span>
                      <div className="flex-1 bg-stone-100 h-5 rounded-md overflow-hidden relative">
                        <div
                          className="bg-stone-800 h-full rounded-md transition-all duration-300"
                          style={{ width: `${widthPercent}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-right font-mono font-bold text-stone-900 shrink-0">
                        {val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs text-stone-600 leading-relaxed">
                ℹ️ <strong>Soil Amplification Insight:</strong> Type III Soft Soils sustain the peak 2.50 acceleration plateau up to <strong>0.67s</strong> (vs only 0.40s for rock), explaining why flexible structures on soft soils experience significantly higher resonance damage.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
