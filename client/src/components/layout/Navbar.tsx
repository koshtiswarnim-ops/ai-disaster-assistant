import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ChevronDown, 
  Check, 
  Menu, 
  X,
  Sparkles,
  Settings,
  Flame,
  Radio,
  User,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisaster } from '../../context/DisasterContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setRole, availableRoles } = useAuth();
  const { isConnected } = useDisaster();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  // Role-specific navigation links: Citizen vs Operator
  const citizenNavLinks = [
    { path: '/sos', label: '🚨 Emergency SOS' },
    { path: '/map', label: '🗺️ Safe Shelters & Map' },
    { path: '/alerts', label: '📢 Public Advisories' },
    { path: '/ai-assistant', label: '💬 Safety Assistant' },
  ];

  const operatorNavLinks = [
    { path: '/command-center', label: 'Command Center' },
    { path: '/incidents', label: '🚨 SOS Triage Queue' },
    { path: '/map', label: 'Tactical Map' },
    { path: '/resources', label: 'Fleet & Hospitals' },
    { path: '/alerts', label: 'Broadcast Sirens' },
    { path: '/settings', label: 'Database' },
  ];

  const isCitizen = user.role === 'citizen';
  const activeNavLinks = isCitizen ? citizenNavLinks : operatorNavLinks;

  const handleRoleToggle = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'citizen') {
      navigate('/sos');
    } else {
      navigate('/command-center');
    }
  };

  const copyPitchScript = () => {
    const script = `AI DISASTER ASSISTANT — 60-SECOND HACKATHON PITCH:
1. PROBLEM: During disasters (floods, earthquakes, fires, storms), people lack timely and location-specific information. They don't know if their street is safe or where to go.
2. SOLUTION: DisasterOS is an AI Disaster Assistant that analyzes real-time sensor streams, issues predictive early warnings, pinpoints high-risk danger zones, and coordinates faster emergency rescue.
3. 4 PILLARS IN ACTION:
   - Analyze Data: Sub-second multi-sensor ingestion (USGS seismic, NOAA radar, IoT river gauges).
   - Early Warnings: Gives countdowns to danger (e.g. "Flood peak in 38 mins in Zone A").
   - High-Risk Areas: Visualizes danger zones & safe evacuation corridors.
   - Faster Response: Citizen 1-tap SOS + automated rescue team & hospital allocation.
4. IMPACT: Reduces emergency response coordination from 45 minutes to under 4 minutes.`;
    navigator.clipboard.writeText(script);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col shadow-xs">
      <header className="h-14 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          
          {/* Left: Brand with Role Badge */}
          <div className="flex items-center gap-5 shrink-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 duration-200 ${
                isCitizen ? 'bg-emerald-600' : 'bg-slate-900'
              }`}>
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 font-sans">
                  DisasterOS
                </span>
                {isCitizen ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    CITIZEN PORTAL
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    OPERATOR CONSOLE
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Dynamic Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {activeNavLinks.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? isCitizen
                          ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                          : 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Highly-Visible 2-Way Role Switcher Pill */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-300 bg-slate-100 text-xs font-semibold shadow-2xs">
              <button
                onClick={() => handleRoleToggle('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  isCitizen 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Citizen Public Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                onClick={() => handleRoleToggle('authority')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  !isCitizen 
                    ? 'bg-slate-900 text-amber-300 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Authority Operator Console"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Operator</span>
              </button>
            </div>

            {/* Prominent Citizen SOS Shortcut (Quick Trigger) */}
            {isCitizen && (
              <Link
                to="/sos"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95 ${
                  currentPath === '/sos'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400/50'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Send SOS</span>
              </Link>
            )}

            {/* Quick Pitch Guide Modal */}
            <button
              onClick={() => setPitchModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors shadow-2xs"
              title="60-Second Hackathon Winning Pitch Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Pitch (60s)</span>
            </button>

            {/* Settings Shortcut */}
            <Link
              to="/settings"
              className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              title="System & Supabase Database Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Role Mode Ribbon - Instantly distinguishes Citizen vs Operator UI */}
      <div className={`w-full text-xs border-b px-4 py-1.5 transition-colors ${
        isCitizen 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            {isCitizen ? (
              <>
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white shadow-2xs">
                  CITIZEN
                </span>
                <span className="font-bold text-emerald-900 text-xs">
                  Public Safety Portal
                </span>
                <span className="hidden md:inline text-emerald-700 text-xs">
                  — 1-Tap SOS Distress, Live Rescue ETA, Open Shelters & Evacuation Safe Routes
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400 text-slate-950 font-bold shadow-2xs">
                  OPERATOR
                </span>
                <span className="font-bold text-amber-300 text-xs">
                  Command & Dispatch Console (Authority)
                </span>
                <span className="hidden md:inline text-slate-300 text-xs">
                  — Live Triage Queue, Swiftwater & USAR Dispatch, Hospital ICU Balancing
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleRoleToggle(isCitizen ? 'authority' : 'citizen')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 ${
                isCitizen
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>Switch to {isCitizen ? 'Operator Console 🛡️' : 'Citizen Portal 👤'}</span>
            </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5 shadow-lg">
          {activeNavLinks.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive 
                    ? isCitizen ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {isCitizen && (
            <Link
              to="/sos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white text-center"
            >
              🚨 Send Emergency SOS
            </Link>
          )}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => { handleRoleToggle('citizen'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded text-xs font-medium ${isCitizen ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
              >
                Citizen
              </button>
              <button
                onClick={() => { handleRoleToggle('authority'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded text-xs font-medium ${!isCitizen ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
              >
                Operator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 60-Second Hackathon Pitch Guide Modal */}
      {pitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase">
                  Hackathon Pitch Guide
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  How to Explain & Win in 60 Seconds
                </h3>
              </div>
              <button
                onClick={() => setPitchModalOpen(false)}
                className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">1. State the Problem (10 sec):</strong>
                <p>
                  "In disasters like floods, earthquakes, fires, and extreme weather, people lack timely and location-specific information. They don't know if their neighborhood is safe or where to go."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 space-y-1">
                <strong className="text-blue-900 block font-mono text-[11px] uppercase">2. Introduce the Solution (15 sec):</strong>
                <p>
                  "Our <strong>AI Disaster Assistant</strong> eliminates this gap. It analyzes multi-source data, issues early warnings before impact, identifies high-risk danger zones, and powers faster emergency response."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">3. Live Demo the 4 Pillars (25 sec):</strong>
                <ul className="space-y-1 list-disc pl-4 text-[11.5px]">
                  <li><strong>Analyze Data:</strong> Multi-sensor streams (water depth, seismic, weather radar).</li>
                  <li><strong>Early Warnings:</strong> Gives predictive countdowns (e.g. <em>"Flood crest in 38 mins in Zone A"</em>).</li>
                  <li><strong>High-Risk Areas:</strong> Visualizes danger zones & safe evacuation corridors.</li>
                  <li><strong>Faster Response:</strong> Citizen 1-tap SOS + automated rescue team & shelter allocation.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                <strong className="text-emerald-900 block font-mono text-[11px] uppercase">4. The Winning Closer (10 sec):</strong>
                <p>
                  "We reduced emergency response coordination time from 45 minutes down to <strong>under 4 minutes</strong>. That is the difference between life and death."
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={copyPitchScript}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Pitch Script'}</span>
              </button>
              <button
                onClick={() => setPitchModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
