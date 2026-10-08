import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  ListTodo,
  CheckCircle2,
  LogOut,
  MapPin,
  ExternalLink,
  Navigation,
  Check,
  Download,
  ShieldCheck,
  Layers,
  FileText,
} from 'lucide-react';
import { Language } from './EarthquakeSwitcherBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const siteIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface DetailedProject {
  id: string;
  code: string;
  title: string;
  city: string;
  zone: string;
  lat: number;
  lng: number;
  zFactor: number;
  importanceI: number;
  rFactor: number;
  soil: string;
  heightMeters: number;
  timePeriodTa: number;
  sag: number;
  ah: number;
  weightKN: number;
  baseShearVb: number;
  status: 'IN DESIGN' | 'COMPLIANT' | 'NEEDS REVIEW';
  citizenReq: string;
  govInstructions: string;
  rebarSpecs: {
    columnTies: string;
    beamFlexure: string;
    jointShear: string;
    scwbRatio: string;
  };
}

const DEFAULT_SCHEDULES: DetailedProject[] = [
  {
    id: 'p-1',
    code: '#STR-1024',
    title: 'G+8 Apex Lifeline Healthcare Facility',
    city: 'Delhi NCR',
    zone: 'Zone IV (Z=0.24)',
    lat: 28.6139,
    lng: 77.2090,
    zFactor: 0.24,
    importanceI: 1.5,
    rFactor: 5.0,
    soil: 'Type II Medium Stiff Soil (N = 22)',
    heightMeters: 26.4,
    timePeriodTa: 0.87,
    sag: 1.56,
    ah: 0.0562,
    weightKN: 14400,
    baseShearVb: 809,
    status: 'IN DESIGN',
    citizenReq: 'Hospital lifeline structure accommodating emergency ICU beds and trauma center. Non-structural equipment and MEP systems must remain operational during major earthquake.',
    govInstructions: 'IS 1893:2016 Table 8 requires Importance Factor I = 1.5. Special Moment Resisting Frame (SMRF) with IS 13920 ductile detailing is legally mandatory.',
    rebarSpecs: {
      columnTies: '8mm Φ Fe500 ties @ 75mm c/c with 135° seismic hooks (extension 10d = 80mm) in critical end zones (ho = 600mm).',
      beamFlexure: 'Minimum 2 bars top & bottom continuous throughout span. Tension steel ratio between 0.28% and 2.5%.',
      jointShear: 'Special confining reinforcement carried through beam-column joint without interruption.',
      scwbRatio: 'Strong-column weak-beam ratio: Sum of Column Moments >= 1.4 × Sum of Beam Moments.'
    }
  },
  {
    id: 'p-2',
    code: '#STR-1015',
    title: 'G+12 Commercial Core Tower',
    city: 'Guwahati',
    zone: 'Zone V (Z=0.36)',
    lat: 26.1445,
    lng: 91.7362,
    zFactor: 0.36,
    importanceI: 1.2,
    rFactor: 5.0,
    soil: 'Type III Soft Alluvial Soil (N = 9)',
    heightMeters: 39.6,
    timePeriodTa: 1.18,
    sag: 1.42,
    ah: 0.0613,
    weightKN: 21600,
    baseShearVb: 1324,
    status: 'COMPLIANT',
    citizenReq: 'Commercial multi-tenant complex. Open architectural layout requiring large column-free spans.',
    govInstructions: 'Dual lateral load resisting system: Central RC shear wall core taking minimum 75% of lateral base shear + perimeter SMRF frame.',
    rebarSpecs: {
      columnTies: '10mm Φ Fe550 ties @ 75mm c/c in potential plastic hinge zones.',
      beamFlexure: 'Mechanical splices (couplers) staggered outside plastic hinge regions.',
      jointShear: 'Confining shear reinforcement designed for joint shear stress tau_v <= 1.5 * sqrt(fck).',
      scwbRatio: 'Column flexural capacity exceeds beam capacity by minimum 1.4x factor.'
    }
  }
];

interface RebarDetailingViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const RebarDetailingView: React.FC<RebarDetailingViewProps> = ({
  language,
  onLanguageChange,
}) => {
  // Only 3 Essential Tabs
  const [activeTab, setActiveTab] = useState<'schedules' | 'highrisk' | 'cadspecs'>('schedules');
  const [projectsList, setProjectsList] = useState<DetailedProject[]>(DEFAULT_SCHEDULES);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SCHEDULES[0].id);

  const selected = projectsList.find((p) => p.id === selectedId) || projectsList[0];

  const handleMarkCompliant = () => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === selected.id ? { ...p, status: 'COMPLIANT' } : p))
    );
  };

  const highRiskProjects = projectsList.filter(p => p.zone.includes('Zone V') || p.zone.includes('Zone IV'));

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f6f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- STREAMLINED LEFT SIDEBAR (ONLY 3 IMP OPTIONS) ----------------- */}
      <aside className="w-full md:w-64 bg-[#f5f2e9] border-r border-stone-300/80 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#262320] text-amber-400 flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-stone-950">Structural Desk</h1>
              <p className="text-xs text-stone-500 font-mono">SE-401 • IS 13920</p>
            </div>
          </div>

          {/* Navigation Links - 3 Essential Options */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'schedules'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <ListTodo className="w-4 h-4 text-stone-700" />
              <span>Detailing Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('highrisk')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'highrisk'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Zone V High Risk</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-700 text-white font-bold text-xs flex items-center justify-center">
                {highRiskProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cadspecs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'cadspecs'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4 text-stone-700" />
              <span>CAD Rebar BBS Spec</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-stone-300/80 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium">Language:</span>
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg border border-stone-300/60">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'en' ? 'bg-[#262320] text-white' : 'text-stone-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'hi' ? 'bg-amber-600 text-white' : 'text-stone-600'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#eee8dc]/70 p-3 rounded-2xl border border-stone-300/60">
            <div>
              <p className="font-bold text-xs text-stone-950">Er. Rajesh Kumar</p>
              <p className="text-[11px] text-stone-500">Structural Rebar Specialist</p>
            </div>
            <button title="Logout" className="text-stone-500 hover:text-stone-800">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- DYNAMIC MAIN CONTENT PANELS ----------------- */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl mx-auto">
        {/* PANEL 1: DETAILING QUEUE (TWO-COLUMN WORKFLOW) */}
        {activeTab === 'schedules' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black text-stone-950 tracking-tight">
                Preliminary Structural & Rebar Schedule
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                IS 13920 Ductile Detailing & IS 1893:2016 Code Guidelines for Active Projects
              </p>
            </div>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Project List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {projectsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer shadow-xs ${
                      selectedId === item.id
                        ? 'bg-white border-stone-800 ring-2 ring-stone-900/10'
                        : 'bg-white/80 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-stone-700">
                        {item.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'COMPLIANT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-950 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{item.city} ({item.zone})</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column: Detailed Pane (7 cols) */}
              {selected && (
                <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-5">
                  {/* Task Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-stone-600">
                        PROJECT {selected.code}
                      </span>
                      <span className="bg-rose-700 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        LIFELINE STRUCTURE (I={selected.importanceI})
                      </span>
                      {selected.status === 'COMPLIANT' && (
                        <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          IS 13920 COMPLIANT
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-stone-950 tracking-tight leading-snug">
                      {selected.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium">
                      {selected.city} • {selected.zone} • {selected.soil}
                    </p>
                  </div>

                  {/* Geotechnical Location Map */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-700" />
                      <span>SITE GEOTECHNICAL LOCATION & HAZARD MAP</span>
                    </div>

                    <div className="h-48 w-full rounded-2xl overflow-hidden border border-stone-200 relative">
                      <MapContainer
                        center={[selected.lat, selected.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[selected.lat, selected.lng]} icon={siteIcon}>
                          <Popup>
                            <div className="p-1 space-y-0.5">
                              <p className="font-bold text-xs text-stone-900">{selected.title}</p>
                              <p className="text-[11px] text-stone-500">{selected.city} • {selected.zone}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono text-stone-500">
                        GPS: {selected.lat}, {selected.lng} • Soil: {selected.soil}
                      </span>
                    </div>
                  </div>

                  {/* Two Specs Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#faf8f3] border border-stone-200/90 rounded-2xl p-4 space-y-1.5">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-600">
                        IS 1893:2016 SEISMIC COEFFICIENTS
                      </h4>
                      <div className="text-xs text-stone-700 leading-relaxed font-mono space-y-1">
                        <p>• Period Ta: <strong>{selected.timePeriodTa}s</strong></p>
                        <p>• Spectral Sa/g: <strong>{selected.sag}</strong></p>
                        <p>• Seismic Coeff Ah: <strong>{selected.ah}</strong></p>
                        <p>• Base Shear Vb: <strong className="text-rose-800">{selected.baseShearVb.toLocaleString()} kN</strong></p>
                      </div>
                    </div>

                    <div className="bg-[#faf8f3] border border-stone-200/90 rounded-2xl p-4 space-y-1.5">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-600">
                        IS 13920 DUCTILITY PROVISIONS
                      </h4>
                      <div className="text-xs text-stone-700 leading-relaxed space-y-1">
                        <p>• <strong>Column Ties:</strong> {selected.rebarSpecs.columnTies}</p>
                        <p>• <strong>SCWB Ratio:</strong> {selected.rebarSpecs.scwbRatio}</p>
                        <p>• <strong>Joint Shear:</strong> {selected.rebarSpecs.jointShear}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2">
                    {selected.status !== 'COMPLIANT' ? (
                      <button
                        onClick={handleMarkCompliant}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Verify IS 13920 Detailing</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('cadspecs')}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>View CAD Rebar BBS Schedule</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 2: HIGH-RISK ZONE V FOCUS */}
        {activeTab === 'highrisk' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                CRITICAL SEISMIC AUDIT
              </span>
              <h2 className="text-3xl font-black text-stone-950 tracking-tight">
                High-Risk Zone IV & V Projects
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Structures subjected to severe peak ground accelerations (Z = 0.24g to 0.36g) requiring mandatory SMRF ductile detailing
              </p>
            </div>

            <div className="space-y-4">
              {highRiskProjects.map((p) => (
                <div key={p.id} className="bg-white border border-rose-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
                        {p.code} • {p.zone}
                      </span>
                      <h3 className="text-xl font-black text-stone-900 mt-1.5">{p.title}</h3>
                      <p className="text-xs text-stone-500">{p.city} • Soil: {p.soil}</p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-700 text-white uppercase">
                      PGA = {p.zFactor}g
                    </span>
                  </div>

                  {/* Ductility Alert Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
                    <div>
                      <span className="font-bold text-rose-950 block">Confinement Links:</span>
                      <p className="text-rose-800 mt-0.5">8-10mm Φ links spaced at <strong>75mm c/c</strong> with 135° seismic cross-ties.</p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-950 block">Joint Shear Check:</span>
                      <p className="text-rose-800 mt-0.5">Continuous hoops through beam-column core to prevent explosive shear burst.</p>
                    </div>
                    <div>
                      <span className="font-bold text-rose-950 block">Base Shear Demand:</span>
                      <p className="text-rose-800 mt-0.5">Vb = <strong>{p.baseShearVb.toLocaleString()} kN</strong> (Ah = {p.ah}).</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedId(p.id);
                        setActiveTab('schedules');
                      }}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
                    >
                      Open Full Detailer &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: CAD REBAR SPEC & BAR BENDING SCHEDULE (BBS) */}
        {activeTab === 'cadspecs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  IS 13920 & IS 456 SPECIFICATION
                </span>
                <h2 className="text-3xl font-black text-stone-950 tracking-tight">
                  Structural Bar Bending Schedule (BBS)
                </h2>
              </div>

              <button
                onClick={() => alert("Exported IS 13920 BBS CAD Drawing Sheet (.dxf & .pdf) successfully!")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 self-start sm:self-auto shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export BBS Sheet (.DXF/.PDF)</span>
              </button>
            </div>

            {/* Spec Sheet Table */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs overflow-x-auto space-y-4">
              <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wide">
                Reinforcement Schedule for {selected.title} ({selected.code})
              </h3>

              <table className="w-full text-left text-xs text-stone-700 border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 font-bold text-stone-900">
                    <th className="p-3">Member</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3">Main Steel</th>
                    <th className="p-3">Confining Links (IS 13920)</th>
                    <th className="p-3">Lap Splice Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  <tr>
                    <td className="p-3 font-bold font-sans">Ground Column (C1-C4)</td>
                    <td className="p-3">450 × 600 mm</td>
                    <td className="p-3">8 - 25mm Φ Fe500 (2.1%)</td>
                    <td className="p-3 text-rose-800 font-bold">8mm Φ @ 75mm c/c (135° hooks)</td>
                    <td className="p-3 font-sans">Mid-height of column only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-sans">Primary Beam (B1-B8)</td>
                    <td className="p-3">300 × 500 mm</td>
                    <td className="p-3">Top: 4-20mm Φ, Bot: 3-20mm Φ</td>
                    <td className="p-3 text-rose-800 font-bold">8mm Φ @ 85mm c/c in 2d zone</td>
                    <td className="p-3 font-sans">Outside 2d from column face</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-sans">Beam-Column Core Joint</td>
                    <td className="p-3">450 × 600 mm</td>
                    <td className="p-3">Continuous vertical bars</td>
                    <td className="p-3 text-emerald-800 font-bold">Special confining ties @ 75mm c/c</td>
                    <td className="p-3 font-sans">No lap splices permitted</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-sans">RC Shear Wall Core</td>
                    <td className="p-3">250mm thick</td>
                    <td className="p-3">Double curtain 12mm Φ @ 150mm</td>
                    <td className="p-3 text-rose-800 font-bold">Boundary element links @ 75mm</td>
                    <td className="p-3 font-sans">Staggered mechanical couplers</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-4 bg-[#faf8f3] rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed font-sans space-y-1">
                <p>• <strong>Concrete Grade:</strong> Minimum M30 for Zone IV & V ductile frames per IS 13920 Clause 5.2.</p>
                <p>• <strong>Development Length:</strong> Ld = 48 × bar diameter for Fe500 in tension with 90° or 135° anchorage.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
