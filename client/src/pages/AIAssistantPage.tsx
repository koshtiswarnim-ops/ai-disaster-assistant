import React, { useState } from 'react';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Bot, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  LifeBuoy, 
  Activity, 
  ArrowRight,
  Droplets,
  Flame,
  Wind,
  Layers,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
  confidence?: number;
  timestamp: string;
  hazardBadge?: string;
}

interface LocationAssessment {
  zoneName: string;
  hazardType: 'flood' | 'earthquake' | 'fire' | 'extreme_weather' | 'safe';
  riskScore: number;
  riskLevel: 'Extreme' | 'High' | 'Severe' | 'Moderate' | 'Safe';
  earlyWarning: string;
  leadTime: string;
  safeRoute: string;
  nearestShelter: string;
  shelterCapacity: string;
  actionProtocol: string;
}

const PRESET_LOCATIONS: Record<string, LocationAssessment> = {
  'zone-a': {
    zoneName: 'Zone A - Marina Waterfront & Lower Mission Basin',
    hazardType: 'flood',
    riskScore: 92,
    riskLevel: 'Extreme',
    earlyWarning: 'Water depth standing at 3.8ft and rising at 2.4 in/hr. Peak storm surge inundation predicted in 38 mins.',
    leadTime: '38 minutes to crest',
    safeRoute: 'Guerrero Street Elevated Corridor or Van Ness Ave (Avoid 14th St Underpass)',
    nearestShelter: 'St. Jude Community Center (1.2 km away)',
    shelterCapacity: '120 beds available · Emergency food & medical staff active',
    actionProtocol: 'EVACUATE IMMEDIATELY to higher ground. Do NOT attempt to drive through standing water.'
  },
  'zone-b': {
    zoneName: 'Zone B - Fault Fracture & Unreinforced Masonry Corridor',
    hazardType: 'earthquake',
    riskScore: 84,
    riskLevel: 'High',
    earlyWarning: '5.4M seismic rupture detected 14km NW. 4 aftershocks (2.8M - 3.6M) logged in past 90 mins. Liquefaction watch active.',
    leadTime: '15 min aftershock advisory',
    safeRoute: 'Open Parkway via Civic Center Plaza (Avoid narrow alleys with brick facades)',
    nearestShelter: 'Lincoln High Gymnasium (2.1 km away)',
    shelterCapacity: '85 open cots · Structural integrity green-tagged',
    actionProtocol: 'DROP, COVER & HOLD ON. Extinguish gas valves. Stay clear of masonry facades.'
  },
  'zone-c': {
    zoneName: 'Zone C - Hillside Timber Belt & Chemical Buffer',
    hazardType: 'fire',
    riskScore: 79,
    riskLevel: 'Severe',
    earlyWarning: 'Industrial Chemical Warehouse fire plume expanding NE at 12 km/h. Smoke particulate AQI 280 (Hazardous).',
    leadTime: '45 min evacuation buffer',
    safeRoute: 'Westward toward Coastal Bypass (Perpendicular to wind vector)',
    nearestShelter: 'North Community Center (3.4 km away)',
    shelterCapacity: '64 beds available · Air filtration systems operating',
    actionProtocol: 'EVACUATE WESTWARD. Seal indoor air vents if unable to leave. Use N95 respirator masks.'
  },
  'zone-d': {
    zoneName: 'Zone D - High Ridge Elevated Staging District',
    hazardType: 'safe',
    riskScore: 14,
    riskLevel: 'Safe',
    earlyWarning: 'Zero flood inundation, clear air quality, and stable bedrock geology. Designated regional emergency staging hub.',
    leadTime: 'Continuous safety buffer',
    safeRoute: 'All primary access arterials open and secured by EOC patrol',
    nearestShelter: 'Regional Emergency Shelter Command (0.3 km away)',
    shelterCapacity: '240 beds available · Full trauma clinic and heliport open',
    actionProtocol: 'SAFE HAVEN. Maintain radio monitoring. Staging point for multi-agency relief distribution.'
  }
};

export const AIAssistantPage: React.FC = () => {
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('zone-a');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: `Hello, I am your AI Disaster Assistant.\n\nDuring floods, earthquakes, fires, and extreme weather, people lack timely, location-specific intelligence. I am here to:\n1. 📊 Analyze real-time disaster sensor feeds & telemetry\n2. ⚠️ Provide location-specific early warnings with impact countdowns\n3. 🗺️ Identify high-risk danger zones and impassable routes\n4. ⚡ Support faster emergency response with instant shelter & SOS coordination.\n\nSelect your zone above or ask any safety or disaster question below.`,
      sources: ['USGS Seismic Stream', 'NOAA Weather Doppler', 'Municipal IoT Water Gauges'],
      confidence: 0.98,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const currentAssessment = PRESET_LOCATIONS[selectedLocationKey];

  const handleSend = async (textToSend?: string) => {
    const qText = textToSend || input;
    if (!qText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: qText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.aiAssistant(qText);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        sources: res.sources,
        confidence: res.confidence,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `AI Disaster Assistant error: ${e.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationCheck = (zoneKey: string) => {
    setSelectedLocationKey(zoneKey);
    const z = PRESET_LOCATIONS[zoneKey];
    handleSend(`Provide a complete disaster risk analysis, early warning, and safe evacuation advice for ${z.zoneName}.`);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'AI Intelligence' },
          { label: 'AI Disaster Assistant' }
        ]}
        title="AI Disaster Assistant"
        description="Timely, location-specific intelligence analyzing floods, earthquakes, fires, and extreme weather to provide early warnings and accelerate emergency response."
        statusText="AI Predictive Engine Active"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">
        
        {/* Hackathon Problem Statement Focus Banner */}
        <div className="rounded border border-blue-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                    Hackathon AI Disaster Assistant
                  </span>
                  <span className="text-[11px] text-slate-400">Multi-Modal Hazard Stream</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1">
                  Location-Specific Early Warnings & Fast Emergency Response
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Solving the disaster information gap with continuous multi-hazard data fusion across floods, earthquakes, fires, and extreme weather.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/sos"
                className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>One-Tap SOS</span>
              </Link>
              <Link
                to="/risk-analysis"
                className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
              >
                <Activity className="w-3.5 h-3.5 text-slate-600" />
                <span>Risk Heatmap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Location-Specific Assessment Selector */}
        <div className="rounded border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Location-Specific Threat & Early Warning Analyzer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Live GIS Geofence Active
            </span>
          </div>

          {/* Location Quick-Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'zone-a', label: 'Zone A (Marina Basin)', sub: '🌊 Flood Surge Active', danger: true },
              { key: 'zone-b', label: 'Zone B (Fault Corridor)', sub: '🌋 5.4M Seismic Watch', danger: true },
              { key: 'zone-c', label: 'Zone C (Hillside Belt)', sub: '🔥 Chemical Fire Plume', danger: true },
              { key: 'zone-d', label: 'Zone D (High Ridge)', sub: '🛡️ Safe Haven Shelter', danger: false },
            ].map(loc => (
              <button
                key={loc.key}
                onClick={() => handleLocationCheck(loc.key)}
                className={`p-3 rounded border text-left transition-all ${
                  selectedLocationKey === loc.key
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-semibold text-slate-900 block truncate">{loc.label}</span>
                <span className={`text-[10.5px] mt-0.5 block font-mono ${loc.danger ? 'text-rose-700' : 'text-emerald-700 font-medium'}`}>
                  {loc.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Location Dynamic Diagnostic Card */}
          {currentAssessment && (
            <div className="rounded border border-slate-200 bg-slate-50/70 p-4 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans">{currentAssessment.zoneName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    currentAssessment.riskLevel === 'Extreme' || currentAssessment.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : currentAssessment.riskLevel === 'Severe'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {currentAssessment.riskLevel} Risk ({currentAssessment.riskScore}/100)
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Early Warning Lead Time: <strong className="text-slate-900">{currentAssessment.leadTime}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px] text-slate-700 font-sans">
                <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">⚠️ Predictive Early Warning</span>
                  <p className="text-slate-900 font-medium leading-relaxed">{currentAssessment.earlyWarning}</p>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">🧭 Safe Evacuation Route</span>
                  <p className="text-slate-900 font-medium leading-relaxed">{currentAssessment.safeRoute}</p>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">🏕️ Nearest Verified Shelter</span>
                  <p className="text-slate-900 font-medium leading-relaxed">{currentAssessment.nearestShelter}</p>
                  <span className="text-[11px] text-emerald-700 font-mono block">{currentAssessment.shelterCapacity}</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">⚡ Life-Safety Action Protocol</span>
                  <p className="text-slate-900 font-bold leading-relaxed">{currentAssessment.actionProtocol}</p>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10.5px] text-slate-500 font-mono">
                  Sources: USGS Seismic Feed · Municipal IoT Water Level Gauges · City Shelter Registry
                </span>
                <Link
                  to="/map"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 font-sans"
                >
                  View on Tactical Live Map &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Multi-Hazard Quick Query Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Multi-Hazard Quick Questions:</span>
            <span className="text-slate-400 font-mono text-[11px]">Click to analyze instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleSend("What is the flood status, standing water depth, and safe evacuation corridors?")}
              className="p-2.5 rounded bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-left transition-colors flex items-start gap-2 shadow-2xs"
            >
              <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">🌊 Floods</span>
                <span className="text-[11px] text-slate-500">Water depth & submerged roads</span>
              </div>
            </button>

            <button
              onClick={() => handleSend("What is the earthquake seismic activity, aftershock forecast, and structural safety protocol?")}
              className="p-2.5 rounded bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 text-left transition-colors flex items-start gap-2 shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">🌋 Earthquakes</span>
                <span className="text-[11px] text-slate-500">Seismic tremors & collapse risk</span>
              </div>
            </button>

            <button
              onClick={() => handleSend("Where is the chemical wildfire spreading, what is the air quality AQI, and safe routes?")}
              className="p-2.5 rounded bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 text-left transition-colors flex items-start gap-2 shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">🔥 Fires & Smoke</span>
                <span className="text-[11px] text-slate-500">Plume direction & toxic AQI</span>
              </div>
            </button>

            <button
              onClick={() => handleSend("What is the extreme weather forecast, sustained gale wind speeds, and shelter status?")}
              className="p-2.5 rounded bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 text-left transition-colors flex items-start gap-2 shadow-2xs"
            >
              <Wind className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">🌪️ Extreme Weather</span>
                <span className="text-[11px] text-slate-500">Gale winds & power outages</span>
              </div>
            </button>
          </div>
        </div>

        {/* Chat Messages Card */}
        <div className="rounded border border-slate-200 p-5 bg-white shadow-xs min-h-[440px] flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto max-h-[460px] pr-1">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 text-xs ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-2xl p-4 rounded-xl ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-slate-900 text-white shadow-xs'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap font-sans text-xs">{m.text}</p>
                    
                    {/* Sources & Confidence */}
                    {m.sources && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10.5px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
                        <span>Data Sources: {m.sources.join(' · ')}</span>
                        {m.confidence && (
                          <span className="font-semibold text-blue-700">
                            {Math.round(m.confidence * 100)}% Confidence
                          </span>
                        )}
                      </div>
                    )}
                    <span className={`block text-[10px] font-mono mt-1 ${isAi ? 'text-slate-400' : 'text-slate-400'} text-right`}>
                      {m.timestamp}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      YOU
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 text-xs items-center text-slate-500 font-mono">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Analyzing real-time multi-hazard telemetry & knowledge graph...</span>
              </div>
            )}
          </div>

          {/* Natural Language Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} 
            className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Disaster Assistant about flood levels, earthquake aftershocks, fire routes, shelters..."
              className="input-field text-xs py-2.5"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
