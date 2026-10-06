import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ChevronDown, 
  Check, 
  Bell, 
  Menu, 
  X,
  Sparkles,
  BookOpen,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisaster } from '../../context/DisasterContext';
import { UserRole } from '../../types';
import { ROLE_CONFIGS } from './RoleWorkspaceBanner';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, setRole, availableRoles } = useAuth();
  const { isConnected, liveNotifications } = useDisaster();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const navRef = React.useRef<HTMLElement>(null);
  const [activeRect, setActiveRect] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hoverRect, setHoverRect] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navigate = useNavigate();

  const getRoleNavLinks = (role: UserRole) => {
    switch (role) {
      case 'citizen':
        return [
          { path: '/', label: 'Overview' },
          { path: '/sos', label: 'Citizen SOS' },
          { path: '/shelters', label: 'Nearby Shelters' },
          { path: '/hospitals', label: 'Nearby Hospitals' },
          { path: '/risk-analysis', label: 'Early Warnings' },
          { path: '/map', label: 'Evacuation Map' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'rescue_team':
        return [
          { path: '/rescue-teams', label: 'My Missions' },
          { path: '/routes', label: 'Hazard-Free Routes' },
          { path: '/map', label: 'Tactical Map' },
          { path: '/incidents', label: 'Incident SOS Feed' },
          { path: '/sos', label: 'Field Report' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'hospital':
        return [
          { path: '/hospitals', label: 'Hospital ICU & Beds' },
          { path: '/incidents', label: 'Incoming Trauma Queue' },
          { path: '/map', label: 'Patient Transit Map' },
          { path: '/command-center', label: 'Command Center' },
          { path: '/risk-analysis', label: 'Risk Telemetry' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'warehouse':
        return [
          { path: '/warehouses', label: 'Depot Stock & Rations' },
          { path: '/allocation', label: 'Supply Allocations' },
          { path: '/vehicles', label: 'Fleet & Deliveries' },
          { path: '/command-center', label: 'Command Center' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'logistics':
        return [
          { path: '/vehicles', label: 'Transport Fleet' },
          { path: '/routes', label: 'Hazard Corridors' },
          { path: '/map', label: 'Transit Map' },
          { path: '/warehouses', label: 'Depots' },
          { path: '/command-center', label: 'Command Center' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'ngo':
      case 'volunteer':
        return [
          { path: '/volunteers', label: 'Volunteer Aid Tasks' },
          { path: '/shelters', label: 'Evacuation Shelters' },
          { path: '/sos', label: 'Citizen Distress Feed' },
          { path: '/map', label: 'Tactical Map' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'admin':
        return [
          { path: '/command-center', label: 'Command Center' },
          { path: '/simulation', label: 'Digital Twin Sandbox' },
          { path: '/audit-logs', label: 'Audit Logs' },
          { path: '/analytics', label: 'Analytics' },
          { path: '/settings', label: 'System Settings' },
          { path: '/ai-assistant', label: 'AI Assistant' },
        ];
      case 'authority':
      default:
        return [
          { path: '/', label: 'Overview & Pitch' },
          { path: '/ai-assistant', label: 'AI Assistant' },
          { path: '/risk-analysis', label: 'Early Warnings' },
          { path: '/map', label: 'Risk Map' },
          { path: '/sos', label: 'Citizen SOS' },
          { path: '/command-center', label: 'Command Center' },
        ];
    }
  };

  const navLinks = getRoleNavLinks(user.role);

  const handleRoleSelect = (rRole: UserRole) => {
    setRole(rRole);
    setRoleMenuOpen(false);
    const targetConfig = ROLE_CONFIGS[rRole];
    if (targetConfig) {
      navigate(targetConfig.primaryPath);
    }
  };

  const secondaryLinks = [
    { path: '/incidents', label: 'Incident Triage Queue' },
    { path: '/allocation', label: 'Smart Resource Allocation' },
    { path: '/hospitals', label: 'Hospital ICU Capacities' },
    { path: '/shelters', label: 'Evacuation Shelters' },
    { path: '/simulation', label: 'Digital Twin Stress Sandbox' },
    { path: '/analytics', label: 'Operational Analytics' },
    { path: '/settings', label: 'Workspace Configuration' },
  ];

  const currentPath = location.pathname;

  const updateActiveRect = React.useCallback(() => {
    if (!navRef.current) return;
    const targetEl = navRef.current.querySelector(`[data-path="${currentPath}"]`) as HTMLElement | null;
    
    if (targetEl) {
      setActiveRect({
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setActiveRect(prev => ({ ...prev, opacity: 0 }));
    }
  }, [currentPath]);

  React.useEffect(() => {
    updateActiveRect();
    const frame = requestAnimationFrame(updateActiveRect);
    const timer = setTimeout(updateActiveRect, 60);
    window.addEventListener('resize', updateActiveRect);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener('resize', updateActiveRect);
    };
  }, [updateActiveRect, currentPath]);

  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    setHoverRect({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  const handleNavMouseLeave = () => {
    setHoverRect(prev => ({ ...prev, opacity: 0 }));
  };

  const copyPitchScript = () => {
    const script = `AI DISASTER ASSISTANT — 60-SECOND HACKATHON PITCH:
1. PROBLEM: During disasters (floods, earthquakes, fires, storms), people lack timely and location-specific information. They don't know if their neighborhood is safe or where to go.
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
    <header className="sticky top-0 z-40 h-14 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-2">
        
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-4 xl:gap-5 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-transform group-hover:scale-105 duration-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-slate-900 font-sans">
                DisasterOS
              </span>
              <span className="hidden sm:inline-block text-slate-300 font-light">|</span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase text-blue-700 font-bold tracking-wider bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                AI Disaster Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Streamlined 6 Core Links) */}
          <nav 
            ref={navRef}
            onMouseLeave={handleNavMouseLeave}
            className="hidden lg:flex items-center gap-0.5 relative py-2"
          >
            {/* Sliding Hover Pill */}
            <div
              className="absolute left-0 top-1.5 bottom-1.5 rounded bg-slate-100/90 border border-slate-200/70 pointer-events-none transition-all duration-200 ease-out"
              style={{
                transform: `translateX(${hoverRect.left}px)`,
                width: `${hoverRect.width}px`,
                opacity: hoverRect.opacity,
              }}
            />

            {/* Sliding Active Bar */}
            <div
              className="absolute left-0 bottom-0 h-[2.5px] bg-slate-900 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: `translateX(${activeRect.left}px)`,
                width: `${activeRect.width}px`,
                opacity: activeRect.opacity,
              }}
            />

            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-path={item.path}
                  onMouseEnter={handleLinkMouseEnter}
                  className={`relative z-10 whitespace-nowrap shrink-0 text-xs font-medium px-2.5 py-1.5 rounded transition-colors duration-150 ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Secondary Modules Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="relative z-10 text-xs font-medium px-2 py-1.5 text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {moreMenuOpen && (
                <div 
                  className="absolute left-0 mt-1.5 w-56 rounded-lg bg-white border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in duration-75 text-xs"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Advanced Modules
                  </div>
                  {secondaryLinks.map((sl) => (
                    <Link
                      key={sl.path}
                      to={sl.path}
                      className="block px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      {sl.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-2.5">
          
          {/* Hackathon Pitch Modal Button */}
          <button
            onClick={() => setPitchModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold shadow-2xs transition-colors"
            title="Open 60-Second Hackathon Pitch Script"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Pitch Script (60s)</span>
            <span className="sm:hidden">Pitch</span>
          </button>

          {/* Telemetry Status Pill */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'LIVE EOC' : 'STANDBY'}</span>
          </div>

          {/* Persona / RBAC Role Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded border border-slate-200 hover:border-slate-300 bg-white text-xs transition-all focus:outline-none"
            >
              <div className="w-5 h-5 rounded bg-slate-900 text-white font-semibold flex items-center justify-center text-[10px]">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-left hidden xl:block">
                <span className="font-medium text-slate-900 block leading-tight">{user.fullName}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-72 rounded-lg bg-white border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in duration-75"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Operator Role (RBAC)</span>
                </div>
                <div className="max-h-72 overflow-y-auto p-1 space-y-0.5">
                  {availableRoles.map((r) => {
                    const isCurrent = user.role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r.role)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          isCurrent ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-slate-900">{r.label}</p>
                          <p className="text-[10.5px] text-slate-500">{r.name} · {r.org}</p>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded text-xs font-medium ${
                  isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* 60-Second Hackathon Winning Pitch Script Modal */}
      {pitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-slide-up">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase">
                    Hackathon Demo Cheat Sheet
                  </span>
                </div>
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
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">1. State the Problem (10 sec):</strong>
                <p>
                  "In disasters like floods, earthquakes, fires, and extreme weather, people lack timely and location-specific information. They don't know if their street is safe or where to go."
                </p>
              </div>

              <div className="p-3 rounded bg-blue-50/70 border border-blue-200 space-y-1">
                <strong className="text-blue-900 block font-mono text-[11px] uppercase">2. Introduce the Solution (15 sec):</strong>
                <p>
                  "Our <strong>AI Disaster Assistant</strong> eliminates this gap. It analyzes multi-source data, issues early warnings before impact, identifies high-risk danger zones, and powers faster emergency response."
                </p>
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">3. Live Demo the 4 Pillars (25 sec):</strong>
                <ul className="space-y-1 list-disc pl-4 text-[11.5px]">
                  <li><strong>Analyze Data:</strong> Ingests USGS seismic feeds, water gauges, and NOAA weather in real time.</li>
                  <li><strong>Early Warnings:</strong> Gives location countdowns (e.g. <em>"Flood crest in 38 mins in Zone A"</em>).</li>
                  <li><strong>High-Risk Areas:</strong> Shows red hazard zones and tells citizens to avoid flooded 14th St.</li>
                  <li><strong>Faster Response:</strong> Directs citizens to St. Jude Shelter (120 beds) and connects 1-tap SOS to emergency dispatch.</li>
                </ul>
              </div>

              <div className="p-3 rounded bg-emerald-50/70 border border-emerald-200 space-y-1">
                <strong className="text-emerald-900 block font-mono text-[11px] uppercase">4. The Winning Closer (10 sec):</strong>
                <p>
                  "We reduced emergency coordination time from 45 minutes down to <strong>under 4 minutes</strong>. That is the difference between life and death."
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={copyPitchScript}
                className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-300"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Script'}</span>
              </button>
              <button
                onClick={() => setPitchModalOpen(false)}
                className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
              >
                Close & Start Demo
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
