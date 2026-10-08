import React, { useState } from 'react';
import {
  Home,
  PlusCircle,
  FileText,
  MapPin,
  User,
  LogOut,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { Language } from './RoleSwitcherBar';
import { ReportProblemModal } from './ReportProblemModal';
import { EmergencyAlertModal } from './EmergencyAlertModal';

export interface ComplaintItem {
  id: string;
  trackingCode: string;
  category: string;
  title: string;
  location: string;
  status: 'IN PROGRESS' | 'RESOLVED' | 'PENDING' | 'DISPATCHED';
  date?: string;
  description?: string;
  isEmergency?: boolean;
}

interface CitizenPortalViewProps {
  complaints: ComplaintItem[];
  onAddComplaint: (data: any) => Promise<void>;
  onTriggerEmergency: (data: any) => Promise<void>;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToCommand?: () => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  complaints,
  onAddComplaint,
  onTriggerEmergency,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'complaints' | 'nearby' | 'profile'>('home');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  const t = {
    greeting: language === 'hi' ? 'सुप्रभात, अनन्या।' : 'Good morning, Ananya.',
    subtitle: language === 'hi' ? 'आज हम आपकी कैसे सहायता कर सकते हैं?' : 'How can we help today?',
    wardTag: language === 'hi' ? 'नागरमित्र • वार्ड १२' : 'NAGARMITRA • WARD 12',
    civicResolution: language === 'hi' ? 'नागरिक समाधान' : 'CIVIC RESOLUTION',
    reportProblem: language === 'hi' ? 'समस्या दर्ज करें' : 'REPORT A PROBLEM',
    reportProblemDesc: language === 'hi'
      ? 'सड़क के गड्ढे, टूटी स्ट्रीट लाइट, पानी का लीकेज या कचरा जमा होना'
      : 'Potholes, broken streetlights, water pipeline leaks, or overflowing waste',
    immediateDanger: language === 'hi' ? 'तात्कालिक खतरा?' : 'Immediate danger?',
    immediateDangerDesc: language === 'hi'
      ? 'खुला बिजली का तार, पाइपलाइन फटना, खुला मैनहोल या गंभीर जोखिम'
      : 'Exposed live wire, water main burst, open manhole, or severe hazard',
    emergencyAlert: language === 'hi' ? 'आपातकालीन अलर्ट' : 'Emergency Alert',
    activeComplaints: language === 'hi' ? 'आपकी सक्रिय शिकायतें' : 'Your Active Complaints',
    viewAll: language === 'hi' ? `सभी देखें (${complaints.length})` : `View all (${complaints.length})`,
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f7f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-full md:w-64 bg-[#f5f2e9] border-r border-stone-300/80 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#262320] text-white font-black flex items-center justify-center text-sm shadow-sm">
              NM
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-stone-950 leading-tight">NagarMitra</h1>
              <p className="text-xs text-stone-500 font-medium">Citizen Portal</p>
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
                setActiveTab('report');
                setIsReportOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'report'
                  ? 'bg-stone-300 text-stone-950 font-bold'
                  : 'bg-[#eee8dc] text-stone-900 hover:bg-stone-300/80'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-stone-700" />
              <span>{language === 'hi' ? 'रिपोर्ट करें' : 'Report'}</span>
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'complaints'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'hi' ? 'मेरी शिकायतें' : 'My Complaints'}</span>
            </button>

            <button
              onClick={() => setActiveTab('nearby')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'nearby'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{language === 'hi' ? 'आस-पास' : 'Nearby'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Language & User Info */}
        <div className="pt-6 border-t border-stone-300/80 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium">{language === 'hi' ? 'भाषा:' : 'Language:'}</span>
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
              <p className="font-bold text-xs text-stone-950">Ananya Sharma</p>
              <p className="text-[11px] text-stone-500">Ward 12</p>
            </div>
            <button
              title="Logout"
              className="text-stone-500 hover:text-stone-800 transition-colors p-1"
            >
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
            {t.wardTag}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-stone-950 tracking-tight mt-1">
            {t.greeting}
          </h2>
          <p className="text-base text-stone-600 mt-1">{t.subtitle}</p>
        </div>

        {/* Action Card 1: REPORT A PROBLEM (Big Dark Card) */}
        <div
          onClick={() => setIsReportOpen(true)}
          className="bg-[#262320] text-white rounded-3xl p-6 md:p-8 cursor-pointer hover:bg-stone-900 transition-all shadow-md group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>{t.civicResolution}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white pt-1">
                {t.reportProblem}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed pt-1">
                {t.reportProblemDesc}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Card 2: IMMEDIATE DANGER? (Red Warning Card) */}
        <div className="bg-[#fef2f2] border border-rose-200/90 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-700 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-rose-950">{t.immediateDanger}</h4>
              <p className="text-xs text-rose-800/90 mt-0.5 leading-relaxed">
                {t.immediateDangerDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="w-full sm:w-auto bg-[#881337] hover:bg-rose-900 text-white font-bold px-6 py-3 rounded-2xl text-xs tracking-wide shrink-0 transition-all shadow-sm active:scale-95"
          >
            {t.emergencyAlert}
          </button>
        </div>

        {/* Section: Your Active Complaints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-950 tracking-tight">
              {t.activeComplaints}
            </h3>
            <button
              onClick={() => setActiveTab('complaints')}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              {t.viewAll}
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {complaints.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedComplaint(item)}
                className="bg-white border border-stone-200 hover:border-stone-400/80 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span className="font-bold text-stone-700">{item.trackingCode}</span>
                    <span>•</span>
                    <span className="font-sans font-medium text-stone-600">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-base text-stone-950 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500">{item.location}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'IN PROGRESS'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status === 'RESOLVED' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-700" />
                    )}
                    <span>{item.status}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Complaint Detail Popup */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-stone-500">
                  {selectedComplaint.trackingCode} • {selectedComplaint.category}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{selectedComplaint.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{selectedComplaint.location}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <p className="font-bold uppercase tracking-wider text-stone-500 text-[10px] mb-1">
                Status Tracking Timeline
              </p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Complaint Registered via Citizen Portal</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Assigned to Ward 12 Field Worker (Rajesh Kumar)</span>
                </div>
                {selectedComplaint.status === 'RESOLVED' && (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Resolved & Verified by Municipal Authority</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedComplaint(null)}
              className="w-full bg-stone-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ReportProblemModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={onAddComplaint}
        language={language}
      />

      <EmergencyAlertModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSendEmergency={onTriggerEmergency}
        language={language}
      />
    </div>
  );
};
