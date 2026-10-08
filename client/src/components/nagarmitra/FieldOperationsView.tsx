import React, { useState } from 'react';
import {
  HardHat,
  Calendar,
  AlertTriangle,
  ListTodo,
  CheckCircle2,
  User,
  LogOut,
  MapPin,
  ExternalLink,
  Navigation,
  Check,
  Clock,
  Camera,
  ShieldAlert,
} from 'lucide-react';
import { Language } from './RoleSwitcherBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const taskLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface FieldTask {
  id: string;
  taskCode: string;
  isEmergency: boolean;
  title: string;
  ward: string;
  department: string;
  location: string;
  lat: number;
  lng: number;
  status: 'IN PROGRESS' | 'RESOLVED' | 'PENDING';
  citizenDescription: string;
  govInstructions: string;
  vehicleAssigned?: string;
}

interface FieldOperationsViewProps {
  tasks: FieldTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: 'IN PROGRESS' | 'RESOLVED') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const FieldOperationsView: React.FC<FieldOperationsViewProps> = ({
  tasks,
  onUpdateTaskStatus,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'emergencies' | 'assignments' | 'completed' | 'profile'>('assignments');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const handleLaunchGPS = () => {
    if (!selectedTask) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedTask.lat},${selectedTask.lng}`;
    window.open(url, '_blank');
  };

  const handleResolve = () => {
    if (!selectedTask) return;
    onUpdateTaskStatus(selectedTask.id, 'RESOLVED');
    setShowResolveModal(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f6f4ee] min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-full md:w-64 bg-[#f5f2e9] border-r border-stone-300/80 flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#262320] text-amber-400 flex items-center justify-center shadow-sm">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-stone-950">Field Operations</h1>
              <p className="text-xs text-stone-500 font-mono">FW-401</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'today'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'hi' ? 'आज' : 'Today'}</span>
            </button>

            <button
              onClick={() => setActiveTab('emergencies')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'emergencies'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{language === 'hi' ? 'आपातकाल' : 'Emergencies'}</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-700 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'assignments'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>{language === 'hi' ? 'आवंटित कार्य' : 'Assignments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'completed'
                  ? 'bg-[#262320] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'पूर्ण कार्य' : 'Completed'}</span>
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
              <span>{language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</span>
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
              <p className="font-bold text-xs text-stone-950">Rajesh Kumar</p>
              <p className="text-[11px] text-stone-500">Electrical & Street Lighting</p>
            </div>
            <button title="Logout" className="text-stone-500 hover:text-stone-800">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN TWO-COLUMN TASK AREA ----------------- */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-stone-950 tracking-tight">
            Assigned Tasks Queue
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            All routine municipal work orders assigned to your personnel ID
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tasks List (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`rounded-2xl p-4 border transition-all cursor-pointer shadow-xs ${
                  selectedTaskId === task.id
                    ? 'bg-white border-stone-800 ring-2 ring-stone-900/10'
                    : 'bg-white/80 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-stone-700">
                    {task.taskCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-stone-950 leading-snug">
                  {task.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{task.location}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed Task View (7 cols) */}
          {selectedTask && (
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-5">
              {/* Task Header */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-stone-600">
                    TASK {selectedTask.taskCode}
                  </span>
                  {selectedTask.isEmergency && (
                    <span className="bg-rose-700 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      EMERGENCY TASK
                    </span>
                  )}
                  {selectedTask.status === 'RESOLVED' && (
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      RESOLVED
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-stone-950 tracking-tight leading-snug">
                  {selectedTask.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  {selectedTask.ward} • {selectedTask.department}
                </p>
              </div>

              {/* SITE LOCATION & NAVIGATION SECTION */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-stone-700" />
                  <span>SITE LOCATION & NAVIGATION</span>
                </div>

                {/* Embedded Map */}
                <div className="h-60 w-full rounded-2xl overflow-hidden border border-stone-200 relative">
                  <MapContainer
                    center={[selectedTask.lat, selectedTask.lng]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[selectedTask.lat, selectedTask.lng]} icon={taskLocationIcon}>
                      <Popup>
                        <div className="p-1 space-y-0.5">
                          <p className="font-bold text-xs text-stone-900">{selectedTask.location}</p>
                          <p className="text-[11px] text-stone-500">{selectedTask.ward}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* GPS and Turn-by-Turn Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-stone-500">
                    GPS: {selectedTask.lat}, {selectedTask.lng}
                  </span>

                  <button
                    onClick={handleLaunchGPS}
                    className="bg-[#262320] hover:bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Turn-by-Turn GPS</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </button>
                </div>
              </div>

              {/* Two Side-by-Side Description Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#faf8f3] border border-stone-200/90 rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                    CITIZEN DESCRIPTION
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedTask.citizenDescription}
                  </p>
                </div>

                <div className="bg-[#faf8f3] border border-stone-200/90 rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                    GOVERNMENT WORK INSTRUCTIONS
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedTask.govInstructions}
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2">
                {selectedTask.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete & Mark as Resolved</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateTaskStatus(selectedTask.id, 'IN PROGRESS')}
                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reopen / Mark In Progress</span>
                  </button>
                )}

                <button
                  onClick={() => alert(`Escalation ticket generated for ${selectedTask.taskCode} to Municipal Supervisor.`)}
                  className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-xl text-xs transition-colors"
                >
                  Request Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Resolve Confirmation Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Resolve Task {selectedTask?.taskCode}</h3>
            <p className="text-xs text-stone-600">
              Confirm that the physical hazard or repair at <strong>{selectedTask?.location}</strong> has been fully mitigated and verified safe.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Resolution Work Summary
              </label>
              <textarea
                rows={2}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="e.g., Live wire cut, insulated, and secured to pole junction box. Area safe for public."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResolve}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Confirm Resolution
              </button>
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
