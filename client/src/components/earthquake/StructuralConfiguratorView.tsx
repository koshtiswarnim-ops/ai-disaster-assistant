import React, { useState } from 'react';
import {
  Home,
  PlusCircle,
  FileText,
  MapPin,
  BookOpen,
  LogOut,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Building,
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
  const [activeTab, setActiveTab] = useState<'home' | 'configure' | 'projects' | 'map' | 'standards'>('home');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StructuralProjectItem | null>(null);

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
      {/* ----------------- LEFT SIDEBAR ----------------- */}
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

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'home'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{language === 'hi' ? 'होम' : 'Home'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('configure');
                setIsConfigOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'configure'
                  ? 'bg-stone-300 text-stone-950 font-bold'
                  : 'bg-[#eee8dc] text-stone-900 hover:bg-stone-300/80'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-stone-700" />
              <span>{language === 'hi' ? '+ नया कॉन्फ़िगरेशन' : '+ Configure'}</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? 'परियोजनाएं' : 'Projects'}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'map'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{language === 'hi' ? 'जोन मानचित्र' : 'Seismic Zones'}</span>
            </button>

            <button
              onClick={() => setActiveTab('standards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'standards'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'आईएस कोड मानक' : 'Standards (IS 1893)'}</span>
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

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-8 overflow-y-auto">
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
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              {t.viewAll}
            </button>
          </div>

          {/* Projects Cards List */}
          <div className="space-y-3">
            {projects.map((item) => (
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
