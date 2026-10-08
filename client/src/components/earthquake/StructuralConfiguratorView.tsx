import React, { useState } from 'react';
import {
  Home,
  PlusCircle,
  FileText,
  BookOpen,
  LogOut,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Calculator,
  Activity,
  Download,
} from 'lucide-react';
import { Language } from './EarthquakeSwitcherBar';
import { DesignConfiguratorModal } from './DesignConfiguratorModal';
import { VulnerabilityAuditModal } from './VulnerabilityAuditModal';
import { SeismicInput, SeismicAnalysisResult } from './is1893Calculator';

export interface StructuralProjectItem {
  id: string;
  code: string;
  title: string;
  city: string;
  zone: string;
  soil: string;
  system: string;
  status: 'IS 13920 COMPLIANT' | 'NEEDS RETROFIT' | 'VERIFIED';
  baseShearVb: number;
  timePeriodTa: number;
  ah: number;
  details: string;
}

interface StructuralConfiguratorViewProps {
  projects: StructuralProjectItem[];
  onAddProject: (project: {
    title: string;
    city: string;
    input: SeismicInput;
    result: SeismicAnalysisResult;
  }) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToDetailing?: (projectId: string) => void;
}

export const StructuralConfiguratorView: React.FC<StructuralConfiguratorViewProps> = ({
  projects,
  onAddProject,
  language,
  onLanguageChange,
  onNavigateToDetailing,
}) => {
  // Only 3 Essential Tabs
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'standards'>('home');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StructuralProjectItem | null>(null);

  // Search & Filter for Projects Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'ALL' | 'Zone V' | 'Zone IV' | 'Zone III' | 'Zone II'>('ALL');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZoneFilter === 'ALL' || p.zone.includes(selectedZoneFilter);
    return matchesSearch && matchesZone;
  });

  const t = {
    tag: language === 'hi' ? 'आईएस १८९३:२०१६ • भूकंप प्रतिरोधी डिजाइन' : 'IS 1893:2016 • SEISMIC DESIGN ASSISTANT',
    greeting: language === 'hi' ? 'सुप्रभात, इंजी. अनन्या।' : 'Good morning, Er. Ananya.',
    subhead: language === 'hi'
      ? 'मृदा और भूकंपीय स्थितियों के आधार पर संरचनात्मक विश्लेषण करें।'
      : 'Analyze earthquake-resistant design concepts based on soil and seismic conditions.',
    configureCTA: language === 'hi' ? 'संरचना कॉन्फ़िगर करें' : 'CONFIGURE A STRUCTURE',
    configureDesc: language === 'hi'
      ? 'भवन की ऊंचाई, मृदा प्रोफाइल (टाइप I/II/III), फ्रेमिंग सिस्टम (SMRF) और बेस शीयर (Ah, Vb) की गणना करें।'
      : 'Analyze base shear (Ah, Vb), spectral acceleration (Sa/g), and ductile rebar rules for any location.',
    vulnerabilityCTA: language === 'hi' ? 'उच्च भूकंपीय भेद्यता जोखिम?' : 'High Seismic Vulnerability Risk?',
    vulnerabilityDesc: language === 'hi'
      ? 'सॉफ्ट-स्टोरी विफलता, मरोड़ विषमता, रीबार कंजेशन या जोन IV/V की नरम मिट्टी।'
      : 'Soft-storey collapse hazard, torsional irregularity, rebar congestion, or Zone IV/V soft soil.',
    auditBtn: language === 'hi' ? 'त्वरित भेद्यता ऑडिट' : 'Vulnerability Audit',
    activeProjects: language === 'hi' ? 'सक्रिय संरचनात्मक परियोजनाएं' : 'Your Active Structural Projects',
    viewAll: language === 'hi' ? `सभी देखें (${projects.length})` : `View all (${projects.length})`,
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f7f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- STREAMLINED LEFT SIDEBAR (ONLY 3 IMP OPTIONS) ----------------- */}
      <aside className="w-full md:w-64 bg-[#f5f2e9] border-r border-stone-300/80 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#262320] text-amber-400 font-black flex items-center justify-center text-sm shadow-sm">
              EQ
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-stone-950 leading-tight">SeismicConfig</h1>
              <p className="text-xs text-stone-500 font-medium">IS 1893 Structural Engine</p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="mb-4">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#262320] hover:bg-stone-900 text-white font-bold px-4 py-3 rounded-2xl text-xs shadow-sm transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? '+ नई संरचना कॉन्फ़िगर करें' : '+ Configure Structure'}</span>
            </button>
          </div>

          {/* Clean Navigation (3 essential options) */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'home'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4 text-stone-700" />
              <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'projects'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-stone-700" />
                <span>{language === 'hi' ? 'परियोजना पुरालेख' : 'Projects Archive'}</span>
              </div>
              <span className="text-xs font-mono font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('standards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'standards'
                  ? 'bg-stone-300 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-stone-700" />
              <span>{language === 'hi' ? 'आईएस कोड संदर्भ' : 'IS 1893 Standards'}</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Area */}
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
              <p className="font-bold text-xs text-stone-950">Er. Ananya Sharma</p>
              <p className="text-[11px] text-stone-500">Lead Structural Engineer</p>
            </div>
            <button title="Logout" className="text-stone-500 hover:text-stone-800">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- DYNAMIC MAIN CONTENT PANELS ----------------- */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-8 overflow-y-auto">
        {/* PANEL 1: DASHBOARD VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Greeting */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-950 tracking-tight mt-1">
                {t.greeting}
              </h2>
              <p className="text-base text-stone-600 mt-1">{t.subhead}</p>
            </div>

            {/* Action Card 1: CONFIGURE A STRUCTURE (Dark Card) */}
            <div
              onClick={() => setIsConfigOpen(true)}
              className="bg-[#262320] text-white rounded-3xl p-6 md:p-8 cursor-pointer hover:bg-stone-900 transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>CIVIL & STRUCTURAL ENGINEERING</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white pt-1">
                    {t.configureCTA}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed pt-1">
                    {t.configureDesc}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Action Card 2: VULNERABILITY AUDIT (Red Warning Card) */}
            <div className="bg-[#fef2f2] border border-rose-200/90 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-700 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-rose-950">{t.vulnerabilityCTA}</h4>
                  <p className="text-xs text-rose-800/90 mt-0.5 leading-relaxed">
                    {t.vulnerabilityDesc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAuditOpen(true)}
                className="w-full sm:w-auto bg-[#881337] hover:bg-rose-900 text-white font-bold px-6 py-3 rounded-2xl text-xs tracking-wide shrink-0 transition-all shadow-sm active:scale-95"
              >
                {t.auditBtn}
              </button>
            </div>

            {/* Section: Your Active Structural Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  {t.activeProjects}
                </h3>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
                >
                  <span>{t.viewAll}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Projects Cards List */}
              <div className="space-y-3">
                {projects.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProject(item)}
                    className="bg-white border border-stone-200 hover:border-stone-400/80 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs hover:shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <span className="font-bold text-stone-700">{item.code}</span>
                        <span>•</span>
                        <span className="font-sans font-medium text-stone-600">{item.city} ({item.zone})</span>
                        <span>•</span>
                        <span className="font-sans font-semibold text-stone-500">{item.soil}</span>
                      </div>
                      <h4 className="font-bold text-base text-stone-950 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500">
                        System: {item.system} | Ah = {item.ah} | Vb = {item.baseShearVb.toLocaleString()} kN | Ta = {item.timePeriodTa}s
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                          item.status === 'IS 13920 COMPLIANT' || item.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>{item.status}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: COMPLETE PROJECTS ARCHIVE VIEW */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-300 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  STRUCTURAL DATABASE
                </span>
                <h2 className="text-3xl font-black text-stone-950 tracking-tight">
                  Analyzed Projects Archive
                </h2>
              </div>

              <button
                onClick={() => setIsConfigOpen(true)}
                className="bg-[#262320] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-stone-900 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>New Structure</span>
              </button>
            </div>

            {/* Search & Zone Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, city, or tracking code..."
                  className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'Zone V', 'Zone IV', 'Zone III', 'Zone II'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZoneFilter(z)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedZoneFilter === z
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Projects Table / Cards */}
            <div className="space-y-3">
              {filteredProjects.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProject(item)}
                  className="bg-white border border-stone-200 hover:border-stone-400 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all shadow-xs"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                      <span className="font-bold text-rose-800">{item.zone}</span>
                      <span>•</span>
                      <span className="text-stone-600 font-sans">{item.city}</span>
                      <span>•</span>
                      <span className="text-stone-500 font-sans">{item.soil}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-950">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 font-mono">
                      <span>Ah: <strong>{item.ah}</strong></span>
                      <span>Vb: <strong>{item.baseShearVb.toLocaleString()} kN</strong></span>
                      <span>Ta: <strong>{item.timePeriodTa}s</strong></span>
                      <span>System: <strong className="font-sans">{item.system}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                        item.status === 'IS 13920 COMPLIANT' || item.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToDetailing) onNavigateToDetailing(item.id);
                      }}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
                    >
                      Detailing &rarr;
                    </button>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  No projects matching your search criteria. Click "+ Configure Structure" to analyze a new building.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: REAL IS 1893:2016 STANDARDS REFERENCE GUIDE */}
        {activeTab === 'standards' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-stone-300 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                BUREAU OF INDIAN STANDARDS
              </span>
              <h2 className="text-3xl font-black text-stone-950 tracking-tight">
                IS 1893:2016 (Part 1) Structural Code Guide
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Criteria for Earthquake Resistant Design of Structures & Ductile Detailing Provisions
              </p>
            </div>

            {/* Key Clauses Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clause 6.4: Design Horizontal Seismic Coeff Ah */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-stone-900">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-sm">Clause 6.4.2 — Seismic Coefficient Ah</h4>
                </div>
                <div className="bg-[#faf8f3] p-3 rounded-xl border border-stone-200 text-xs font-mono text-center font-bold text-stone-800">
                  Ah = (Z / 2) × (I / R) × (Sa / g)
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5">
                  <li>• <strong>Z (Zone Factor):</strong> Peak ground acceleration multiplier per zone.</li>
                  <li>• <strong>I (Importance Factor):</strong> 1.5 for hospitals/schools; 1.0 for general.</li>
                  <li>• <strong>R (Reduction Factor):</strong> 5.0 for ductile SMRF frames; 3.0 for OMRF.</li>
                  <li>• <strong>Sa/g (Spectral Acceleration):</strong> Dynamic amplification factor based on period Ta and soil type.</li>
                </ul>
              </div>

              {/* Table 3: Zone Factors */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-stone-900">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <h4 className="font-bold text-sm">Table 3 — Seismic Zone Factors (Z)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="font-bold text-rose-950 block">Zone V (Very Severe)</span>
                    <span className="font-mono text-rose-800 font-bold">Z = 0.36g (PGA 36%)</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="font-bold text-amber-950 block">Zone IV (Severe)</span>
                    <span className="font-mono text-amber-800 font-bold">Z = 0.24g (PGA 24%)</span>
                  </div>
                  <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <span className="font-bold text-yellow-950 block">Zone III (Moderate)</span>
                    <span className="font-mono text-yellow-800 font-bold">Z = 0.16g (PGA 16%)</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="font-bold text-stone-900 block">Zone II (Low)</span>
                    <span className="font-mono text-stone-700 font-bold">Z = 0.10g (PGA 10%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IS 13920 Ductile Detailing Rules */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-base text-stone-950">
                  IS 13920:2016 Mandatory Ductile Detailing Provisions
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#faf8f3] p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                    1. 135° Seismic Cross-Ties
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    Hoop links must have 135° hooks with extension length not less than 10 times bar diameter (10d) to prevent unravelling under cyclic loads.
                  </p>
                </div>

                <div className="bg-[#faf8f3] p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                    2. Strong-Column Weak-Beam
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    Sum of moment capacities of columns at joint must exceed beam moments by at least 1.4x factor: ∑Mc &ge; 1.4 ∑Mb.
                  </p>
                </div>

                <div className="bg-[#faf8f3] p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                    3. Confining Link Spacing
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    In column plastic hinge zones (ho = 600mm), link spacing shall not exceed min(d/4, 100mm, 8 × min longitudinal bar diameter).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Project Detail Popup */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-stone-500">
                  {selectedProject.code} • {selectedProject.city} ({selectedProject.zone})
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedProject.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{selectedProject.system}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-stone-700">
              <p><strong>Design Horizontal Seismic Coeff (Ah):</strong> {selectedProject.ah}</p>
              <p><strong>Calculated Base Shear (Vb):</strong> {selectedProject.baseShearVb.toLocaleString()} kN</p>
              <p><strong>Fundamental Period (Ta):</strong> {selectedProject.timePeriodTa} seconds</p>
              <p><strong>IS 13920 Ductile Detailing:</strong> Close-spaced 135° seismic cross-ties mandatory at joints.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onNavigateToDetailing) onNavigateToDetailing(selectedProject.id);
                  setSelectedProject(null);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Open Rebar & Detailing Schedule
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <DesignConfiguratorModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSubmit={onAddProject}
        language={language}
      />

      <VulnerabilityAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        language={language}
      />
    </div>
  );
};
