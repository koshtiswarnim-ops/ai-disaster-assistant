import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  HeartPulse, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search, 
  AlertTriangle,
  LocateFixed,
  PhoneCall,
  Waves,
  Activity,
  Building2,
  Flame,
  Droplets,
  LifeBuoy
} from 'lucide-react';
import { api } from '../services/api';

const EMERGENCY_TYPES = [
  { id: 'flood', label: 'Flash Flood / Rising Water', icon: Waves },
  { id: 'medical', label: 'Medical / Trauma Emergency', icon: Activity },
  { id: 'structural_collapse', label: 'Building / Structural Collapse', icon: Building2 },
  { id: 'fire', label: 'Fire / Chemical Hazard', icon: Flame },
  { id: 'water_food', label: 'Potable Water / Rations Cut Off', icon: Droplets },
  { id: 'evacuation', label: 'Trapped / Evacuation Needed', icon: LifeBuoy },
];

export const CitizenSOSPage: React.FC = () => {
  const { submitSOS } = useDisaster();
  const { user } = useAuth();

  // Form State
  const [selectedType, setSelectedType] = useState<string>('flood');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(37.7749);
  const [longitude, setLongitude] = useState<number>(-122.4194);
  const [affectedCount, setAffectedCount] = useState<number>(2);
  const [injuredCount, setInjuredCount] = useState<number>(0);
  const [trappedCount, setTrappedCount] = useState<number>(0);
  const [hasChildrenElderly, setHasChildrenElderly] = useState<boolean>(true);
  const [medicalUrgency, setMedicalUrgency] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Success state with live tracking
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingCodeQuery, setTrackingCodeQuery] = useState<string>('');
  const [isTrackingLoading, setIsTrackingLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Auto-detect browser GPS coordinates
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(4)));
          setLongitude(Number(position.coords.longitude.toFixed(4)));
          setAddress(`Current GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsDetectingLocation(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setAddress('Downtown Metro Emergency Zone (37.7749, -122.4194)');
          setIsDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      alert('Please provide a brief description of the emergency.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSOS({
        type: selectedType,
        title: title || `${selectedType.toUpperCase()} Emergency Assistance Request`,
        description,
        address: address || 'Current Location',
        latitude,
        longitude,
        affected_count: affectedCount,
        injured_count: injuredCount,
        trapped_count: trappedCount,
        has_children_elderly: hasChildrenElderly,
        medical_urgency: medicalUrgency
      });

      setTrackingResult(res);
      setShowSuccessModal(true);
      setDescription('');
      setTitle('');
      setTrackingCodeQuery(res.tracking_code || res.incident?.tracking_code || '');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCodeQuery) return;
    setIsTrackingLoading(true);
    try {
      const res = await api.trackSOS(trackingCodeQuery.trim().toUpperCase());
      setTrackingResult(res);
    } catch (err: any) {
      alert(err.message || 'Tracking code not found');
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const steps = [
    { label: 'Submitted', key: 'submitted' },
    { label: 'Verified', key: 'verified' },
    { label: 'Prioritized', key: 'prioritized' },
    { label: 'Assigned', key: 'assigned' },
    { label: 'Responding', key: 'in_progress' },
    { label: 'Resolved', key: 'resolved' },
  ];

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 1;
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Citizen Portal' },
          { label: 'Emergency SOS' }
        ]}
        title="Citizen Emergency SOS & Live Rescue Tracker"
        description="Instant GPS-tagged emergency distress reporting. Connects directly to AI triage and dispatch authorities."
        statusText="Public SOS Network Operational"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE-SPECIFIC WORKSPACE: CITIZEN EVACUEE */}
        {user.role === 'citizen' && (
          <div className="card-soft bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-white border-blue-200/80 p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-600 text-white">
                    Citizen Emergency Transmitter
                  </span>
                  <span className="text-xs font-bold text-blue-900">Sarah Lin (Resident)</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Distress Link to EOC Search & Rescue
                </h3>
                <p className="text-xs text-slate-600">
                  Transmitting from Waterfront Marina Sector. GPS coordinates lock automatically to nearest emergency dispatch team.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/shelters"
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold shadow-2xs"
                >
                  Nearby Shelters
                </Link>
                <Link
                  to="/hospitals"
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold shadow-2xs"
                >
                  Nearby Hospitals
                </Link>
              </div>
            </div>

            {/* Instant Emergency Preset Buttons */}
            <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 mr-1 text-[11px]">Instant Distress Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('flood');
                  setTitle('Rising Water Trapping Residents in Apartment');
                  setDescription('Water level at 3.5 feet and rising fast. Electricity is cut off. 2 adults and 1 elderly person trapped on ground floor.');
                  setAffectedCount(3);
                  setTrappedCount(3);
                  setHasChildrenElderly(true);
                }}
                className="px-2.5 py-1 rounded bg-blue-100/80 hover:bg-blue-200 text-blue-900 font-medium text-[11px] transition-colors"
              >
                🌊 Rising Flood Trapped
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('medical');
                  setTitle('Severe Medical Shock / Breathing Distress');
                  setDescription('Elderly family member having severe chest pain and difficulty breathing. Oxygen supply depleted due to power failure.');
                  setAffectedCount(1);
                  setInjuredCount(1);
                  setMedicalUrgency(true);
                }}
                className="px-2.5 py-1 rounded bg-rose-100/80 hover:bg-rose-200 text-rose-900 font-medium text-[11px] transition-colors"
              >
                ❤️ Acute Medical Trauma
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('evacuation');
                  setTitle('Road Submerged / Need Extraction Vehicle');
                  setDescription('Both access roads completely flooded. Water too deep for passenger car. Requesting high-water truck or boat extraction.');
                  setAffectedCount(4);
                  setTrappedCount(4);
                }}
                className="px-2.5 py-1 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-medium text-[11px] transition-colors"
              >
                🚤 Boat / High-Water Rescue
              </button>
            </div>
          </div>
        )}

        {/* Top Tracking Card / Query Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
              Emergency Distress Tracking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Check real-time dispatch and triage status with your tracking code</p>
          </div>
          <form onSubmit={handleTrackByCode} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={trackingCodeQuery}
              onChange={(e) => setTrackingCodeQuery(e.target.value)}
              placeholder="e.g. SOS-8491"
              className="input-field text-xs py-1.5 uppercase font-mono max-w-[160px]"
            />
            <button
              type="submit"
              disabled={isTrackingLoading}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>{isTrackingLoading ? 'Checking...' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Live Tracking Result Card if active */}
        {trackingResult && (
          <div className="bg-white border border-slate-200 p-5 rounded space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    #{trackingResult.tracking_code || trackingResult.incident?.tracking_code}
                  </span>
                  <PriorityBadge
                    priority={trackingResult.incident?.severity || trackingResult.priority?.priority || 'high'}
                    score={trackingResult.incident?.priority_score || trackingResult.priority?.priorityScore}
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                  {trackingResult.incident?.title || 'Emergency Request'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: {trackingResult.incident?.address || 'Reported Location'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block">
                  Live Dispatch Stream
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                {steps.map((st, i) => {
                  const currentIdx = getStepIndex(trackingResult.incident?.status || 'submitted');
                  const isDone = i <= currentIdx;
                  return (
                    <div key={st.key} className="flex flex-col items-center text-center">
                      <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-semibold transition-all ${
                        isDone ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider mt-1.5 ${isDone ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="w-full bg-slate-100 h-1 rounded overflow-hidden mt-1">
                <div 
                  className="bg-slate-900 h-full transition-all duration-500"
                  style={{ width: `${((getStepIndex(trackingResult.incident?.status || 'submitted') + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* AI Triage Details & Mission status */}
            <div className="mt-4 p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  AI Emergency Coordination Status
                </span>
                <span className="text-slate-400 font-normal">
                  Live Dispatch Synced
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                {trackingResult.priority?.explanation || trackingResult.incident?.ai_classification?.rationale || 'Command Center actively routing resources to coordinates.'}
              </p>
              {trackingResult.mission && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 font-medium">Assigned Mission: #{trackingResult.mission.mission_code}</span>
                  <span className="text-emerald-700 uppercase font-semibold">Status: {trackingResult.mission.status}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">Save tracking code for status queries.</span>
              <button
                onClick={() => setTrackingResult(null)}
                className="text-slate-900 hover:text-slate-700 font-medium flex items-center gap-1"
              >
                Submit New Incident &rarr;
              </button>
            </div>
          </div>
        )}

        {/* AI Assistance & Location Intel Banner */}
        <div className="rounded border border-blue-200 bg-blue-50/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="text-slate-800">
              Need location-specific danger analysis or immediate shelter routes before submitting?
            </span>
          </div>
          <Link
            to="/ai-assistant"
            className="text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-2 shrink-0"
          >
            Ask AI Disaster Assistant &rarr;
          </Link>
        </div>

        {/* SOS Submission Form */}
        <div className="bg-white border border-slate-200 p-6 rounded">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-200/80">
            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">Emergency Distress Signal (SOS)</h2>
              <p className="text-xs text-slate-500">Distress transmissions are classified via automated multi-factor triage and routed directly to first responders.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Emergency Type Selection */}
            <div>
              <label className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-wider block mb-2">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {EMERGENCY_TYPES.map((t) => {
                  const isSelected = selectedType === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`p-3 rounded border text-left flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="text-xs font-medium leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Emergency Details */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-wider block mb-1">
                  2. Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flooded ground floor, trapped on roof"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-wider block mb-1">
                  3. Distress Description & Immediate Lethality Hazards <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe your immediate situation, visible hazards (e.g. fallen power lines, water depth), and specific vulnerabilities..."
                  className="input-field text-xs resize-none"
                />
              </div>
            </div>

            {/* Step 3: Location detection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-wider block">
                  4. Location / Coordinates
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
                >
                  <LocateFixed className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isDetectingLocation ? 'Acquiring GPS Fix...' : 'Acquire Current GPS Coordinates'}</span>
                </button>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building name, or geographic landmark"
                className="input-field text-xs mb-2"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Latitude:</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="input-field font-mono text-xs py-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Longitude:</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="input-field font-mono text-xs py-1"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Demographics & Urgency */}
            <div>
              <label className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-wider block mb-2">
                5. Demographics & Vulnerability Assessment
              </label>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="p-3 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Persons in Need</span>
                  <input
                    type="number"
                    min="1"
                    value={affectedCount}
                    onChange={(e) => setAffectedCount(Number(e.target.value))}
                    className="w-16 mx-auto text-center font-bold text-slate-900 rounded border border-slate-200 py-1 text-xs bg-slate-50 font-mono"
                  />
                </div>
                <div className="p-3 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Injured Persons</span>
                  <input
                    type="number"
                    min="0"
                    value={injuredCount}
                    onChange={(e) => setInjuredCount(Number(e.target.value))}
                    className="w-16 mx-auto text-center font-bold text-slate-900 rounded border border-slate-200 py-1 text-xs bg-slate-50 font-mono"
                  />
                </div>
                <div className="p-3 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Trapped Persons</span>
                  <input
                    type="number"
                    min="0"
                    value={trappedCount}
                    onChange={(e) => setTrappedCount(Number(e.target.value))}
                    className="w-16 mx-auto text-center font-bold text-slate-900 rounded border border-slate-200 py-1 text-xs bg-slate-50 font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="p-3 rounded border border-slate-200 bg-white flex items-center justify-between cursor-pointer hover:border-slate-300">
                  <span className="text-xs font-medium text-slate-800">
                    Children or Elderly Persons Present
                  </span>
                  <input
                    type="checkbox"
                    checked={hasChildrenElderly}
                    onChange={(e) => setHasChildrenElderly(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </label>

                <label className="p-3 rounded border border-slate-200 bg-white flex items-center justify-between cursor-pointer hover:border-slate-300">
                  <span className="text-xs font-medium text-slate-800">
                    Critical Medical / Oxygen Urgency
                  </span>
                  <input
                    type="checkbox"
                    checked={medicalUrgency}
                    onChange={(e) => setMedicalUrgency(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </label>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                Dispatches immediately to municipal EOC & emergency responders
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSubmitting ? 'Transmitting Distress Signal...' : 'Transmit Emergency Signal'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Emergency Distress Success Confirmation Modal */}
      {showSuccessModal && trackingResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
                  SOS Signal Dispatched
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Emergency Help Request Received
                </h3>
                <p className="text-xs text-slate-500">
                  Your coordinates and incident description are now live on the EOC responder network.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Incident Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  #{trackingResult.tracking_code || trackingResult.incident?.tracking_code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">AI Triage Prioritization:</span>
                <span className="font-bold text-rose-600">
                  Score {trackingResult.priority?.priorityScore || trackingResult.incident?.priority_score}/100 ({trackingResult.incident?.severity || trackingResult.priority?.priority || 'Critical'})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Dispatch Status:</span>
                <span className="font-bold text-emerald-700">
                  Transmitted to Responders
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Stay in a safe location:</strong> Emergency authorities and nearest swiftwater/medical taskforces have been queued for deployment. You can track rescue progress in real-time below.
            </p>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                View Live Rescue Progress &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
