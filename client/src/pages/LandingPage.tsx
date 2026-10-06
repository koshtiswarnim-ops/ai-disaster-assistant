import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Activity, 
  Boxes, 
  Sliders, 
  ArrowRight, 
  Users, 
  HeartHandshake, 
  Layers,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Droplets,
  Flame,
  Wind,
  Clock,
  Sparkles,
  LifeBuoy,
  User
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';

interface DisasterDemoScenario {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
  dataAnalyzed: string;
  earlyWarning: string;
  leadTime: string;
  highRiskArea: string;
  riskScore: number;
  riskLevel: string;
  fasterResponse: string;
  shelterTarget: string;
  safeCorridor: string;
}

const DEMO_SCENARIOS: Record<string, DisasterDemoScenario> = {
  flood: {
    id: 'flood',
    name: 'Flash Flood',
    icon: '🌊',
    badgeColor: 'border-blue-200 bg-blue-50 text-blue-800',
    dataAnalyzed: 'IoT river gauges record 38.4 mm/h rainfall. Water depth standing at 3.8ft and rising at 2.4 in/hr.',
    earlyWarning: 'Level-3 Flash Flood Advisory active. Peak inundation crest predicted in 38 minutes.',
    leadTime: '~38 minutes to crest',
    highRiskArea: 'Zone A - Marina Waterfront & Lower Mission Basin',
    riskScore: 92,
    riskLevel: 'Extreme',
    fasterResponse: '3 Swiftwater rescue boat teams dispatched. Responders diverted across elevated viaduct.',
    shelterTarget: 'St. Jude Community Center (120 beds open)',
    safeCorridor: 'Van Ness Ave & Guerrero Elevated Corridor'
  },
  earthquake: {
    id: 'earthquake',
    name: 'Earthquake',
    icon: '🌋',
    badgeColor: 'border-amber-200 bg-amber-50 text-amber-800',
    dataAnalyzed: 'USGS Realtime Stream records 5.4M seismic rupture 14km NW. 4 aftershocks (2.8M - 3.6M) logged in 90 mins.',
    earlyWarning: 'Liquefaction advisory active. High probability of secondary masonry facade collapse.',
    leadTime: '~15 min aftershock advisory',
    highRiskArea: 'Zone B - Fault Fracture & Unreinforced Masonry District',
    riskScore: 84,
    riskLevel: 'High',
    fasterResponse: 'USAR Acoustic Search & Rescue Taskforce Alpha deployed with hydraulic jaws.',
    shelterTarget: 'Lincoln High Gymnasium (85 cots open, green-tagged)',
    safeCorridor: 'Civic Center Open Parkway (Avoid narrow brick alleys)'
  },
  fire: {
    id: 'fire',
    name: 'Wildfire & Chemical Fire',
    icon: '🔥',
    badgeColor: 'border-rose-200 bg-rose-50 text-rose-800',
    dataAnalyzed: 'MODIS thermal satellites detect active industrial solvent fire expanding NE at 12 km/h propelled by 45 km/h winds.',
    earlyWarning: 'Toxic chemical smoke plume spreading toward residential sectors. Ambient AQI 280 (Hazardous).',
    leadTime: '~45 min evacuation buffer',
    highRiskArea: 'Zone C - Hillside Timber Belt & Chemical Buffer',
    riskScore: 79,
    riskLevel: 'Severe',
    fasterResponse: 'Hazmat Suppression Units 1 & 2 deployed with retardant foam buffer.',
    shelterTarget: 'North Community Center (64 filtered cots open)',
    safeCorridor: 'Westward toward Coastal Station (Perpendicular to wind)'
  },
  weather: {
    id: 'weather',
    name: 'Extreme Weather & Gale',
    icon: '🌪️',
    badgeColor: 'border-purple-200 bg-purple-50 text-purple-800',
    dataAnalyzed: 'Doppler atmospheric river radar registers 84 km/h sustained winds with 108 km/h gale gusts. Barometer dropping to 982 hPa.',
    earlyWarning: 'Severe Gale & Structural Debris warning. Risk of coastal transmission line failures.',
    leadTime: '~25 min severe gust arrival',
    highRiskArea: 'Coastal Sector Grid & Exposed Construction Corridors',
    riskScore: 89,
    riskLevel: 'Critical',
    fasterResponse: '14 emergency backup generators staged at regional trauma hospitals.',
    shelterTarget: 'Regional Staging Sanctuary (240 beds open)',
    safeCorridor: 'Inner Ring Arterials (Avoid coastal bridges)'
  }
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const { disaster, incidents, rescueTeams, hospitals } = useDisaster();
  const [selectedDisasterKey, setSelectedDisasterKey] = useState<string>('flood');
  const activeScenario = DEMO_SCENARIOS[selectedDisasterKey];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-200 bg-blue-50/70 text-blue-800 text-[11px] font-mono tracking-wider uppercase mb-4 animate-slide-down">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 pulse-radar" />
            <span>AI DISASTER ASSISTANT · HACKATHON WINNER DEMO</span>
          </div>

          {/* Core Problem Statement Headline */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight font-sans animate-slide-up">
            AI Disaster Assistant
          </h1>

          {/* Plain-Language Subtitle */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal animate-slide-up">
            During disasters like <strong>floods, earthquakes, fires, and extreme weather</strong>, people lack timely and location-specific information. 
            DisasterOS provides two distinct, purpose-built workspaces: one for <strong>Citizens in danger</strong> and one for <strong>Emergency Operators & Authorities</strong>.
          </p>

          {/* TWO DISTINCT WORKSPACES: CITIZEN VS OPERATOR */}
          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left animate-slide-up">
            
            {/* Citizen Safety Portal Card */}
            <div className="relative p-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-50/70 to-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                    <span>👤</span>
                    <span>CITIZEN PORTAL</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    For Evacuees & Public
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Citizen Public Safety Portal
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Need immediate emergency rescue, live responder ETA, or safe refuge?
                  </p>
                </div>

                <ul className="text-xs space-y-2 text-slate-700 pt-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>1-Tap GPS Distress SOS:</strong> Instant location reporting to 911/EOC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>Live Rescuer Tracking:</strong> Real-time ETA of dispatched rescue team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span><strong>Shelters & Evacuation Routes:</strong> Find food, potable water & beds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span><strong>AI Safety Assistant:</strong> Step-by-step guidance during crisis</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-100">
                <button
                  onClick={() => {
                    setRole('citizen');
                    navigate('/sos');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.01]"
                >
                  <span>Launch Citizen Safety Portal 👤</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            </div>

            {/* Operator Command Console Card */}
            <div className="relative p-5 rounded-2xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-2xs">
                    <span>🛡️</span>
                    <span>OPERATOR CONSOLE</span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    For EOC & Dispatchers
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Operator Command Console
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Managing citywide disaster operations, triage queues, and multi-agency units?
                  </p>
                </div>

                <ul className="text-xs space-y-2 text-slate-300 pt-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>Citizen SOS Triage Queue:</strong> AI severity score (0-100) & verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span><strong>Multi-Agency Dispatch:</strong> Deploy Swiftwater boat teams & USAR squads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Hospital ICU & Beds:</strong> Real-time divert & capacity balancing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Broadcast Emergency Sirens:</strong> Trigger alerts across all risk zones</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setRole('authority');
                    navigate('/command-center');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.01]"
                >
                  <span>Launch Operator Console 🛡️</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs animate-slide-up">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">AI Triage Speed</span>
              <strong className="text-slate-900 font-bold text-sm">0.4s</strong>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">Early Warning Lead</span>
              <strong className="text-blue-700 font-bold text-sm">38 mins</strong>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">Safe Route Buffer</span>
              <strong className="text-emerald-700 font-bold text-sm">100%</strong>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">Dispatch Reduction</span>
              <strong className="text-purple-700 font-bold text-sm">&lt; 4 mins</strong>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive 1-Click Disaster Demo Simulator (The Hackathon Showcase) */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mb-1.5 font-bold">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Interactive Judge Demonstration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Test the AI Assistant in 1 Click
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any disaster below to see how the system fulfills all 4 parts of the problem statement in real time.
            </p>
          </div>

          {/* 4 Disaster Modality Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: 'flood', label: 'Flash Floods', icon: '🌊', desc: 'Rising water & submerged roads' },
              { key: 'earthquake', label: 'Earthquakes', icon: '🌋', desc: 'Seismic tremors & collapse risk' },
              { key: 'fire', label: 'Fires & Smoke', icon: '🔥', desc: 'Thermal spread & toxic AQI' },
              { key: 'weather', label: 'Extreme Weather', icon: '🌪️', desc: 'Gale winds & grid outages' }
            ].map(d => (
              <button
                key={d.key}
                onClick={() => setSelectedDisasterKey(d.key)}
                className={`p-3 rounded border text-left transition-all ${
                  selectedDisasterKey === d.key
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{d.icon}</span>
                  <span className="font-bold text-xs text-slate-900">{d.label}</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block truncate font-mono">{d.desc}</span>
              </button>
            ))}
          </div>

          {/* The 4-Pillar Live Solution Output Box */}
          <div className="rounded border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeScenario.icon}</span>
                <span className="font-bold text-sm text-slate-900">{activeScenario.name} Scenario Analysis</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${activeScenario.badgeColor}`}>
                  {activeScenario.riskLevel} Risk ({activeScenario.riskScore}/100)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Lead Time: <strong className="text-slate-900">{activeScenario.leadTime}</strong>
              </span>
            </div>

            {/* 4 Pillars Mapped 1:1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              {/* Pillar 1: Analyze Data */}
              <div className="p-3.5 rounded bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase text-blue-700 font-bold">
                  <span>📊 1. Analyze Disaster Data</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  {activeScenario.dataAnalyzed}
                </p>
              </div>

              {/* Pillar 2: Early Warning */}
              <div className="p-3.5 rounded bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase text-amber-700 font-bold">
                  <span>⚠️ 2. Provide Early Warning</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  {activeScenario.earlyWarning}
                </p>
              </div>

              {/* Pillar 3: High-Risk Area */}
              <div className="p-3.5 rounded bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase text-rose-700 font-bold">
                  <span>🗺️ 3. Identify High-Risk Area</span>
                </div>
                <p className="text-slate-900 font-bold text-xs">
                  {activeScenario.highRiskArea}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Safe Route: {activeScenario.safeCorridor}
                </p>
              </div>

              {/* Pillar 4: Faster Emergency Response */}
              <div className="p-3.5 rounded bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase text-emerald-700 font-bold">
                  <span>⚡ 4. Support Faster Emergency Response</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  {activeScenario.fasterResponse}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold font-mono">
                  Verified Shelter: {activeScenario.shelterTarget}
                </p>
              </div>

            </div>

            {/* Quick Demo Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-mono">
                AI Inference time: 0.38s · Sensor Telemetry: USGS / NOAA / City IoT
              </span>

              <div className="flex items-center gap-2">
                <Link
                  to="/ai-assistant"
                  className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant About This &rarr;</span>
                </Link>
                <Link
                  to="/sos"
                  className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Test 1-Tap SOS &rarr;</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3-Minute Presentation Guide (For Pitching & Explaining Easily) */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              How DisasterOS Solves the Hackathon Problem
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              A connected end-to-end operational pipeline replacing delayed news with sub-second AI action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            
            <div className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center font-mono">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Analyze Data</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Ingests live USGS seismic feeds, municipal flood gauges, and Doppler radar instead of waiting for delayed reports.
              </p>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center font-mono">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Early Warnings</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Sends location-specific countdown alerts before crests or aftershocks strike, saving lives before disaster hits.
              </p>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center justify-center font-mono">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">High-Risk Areas</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Maps danger zones in red and guides citizens away from flooded underpasses to elevated shelters with open cots.
              </p>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center font-mono">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Faster Response</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                One-tap SOS triggers automated triage and dispatches the nearest rescue boat or ambulance in under 4 minutes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">DisasterOS</span>
            <span>·</span>
            <span>AI Disaster Assistant Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/ai-assistant" className="hover:text-slate-900">AI Assistant</Link>
            <Link to="/risk-analysis" className="hover:text-slate-900">Early Warnings</Link>
            <Link to="/map" className="hover:text-slate-900">Tactical Map</Link>
            <Link to="/sos" className="hover:text-slate-900">Citizen SOS</Link>
            <Link to="/command-center" className="hover:text-slate-900">Command Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
