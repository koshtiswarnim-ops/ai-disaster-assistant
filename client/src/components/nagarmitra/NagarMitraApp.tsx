import React, { useState, useEffect } from 'react';
import { RoleSwitcherBar, PortalRole, Language } from './RoleSwitcherBar';
import { CitizenPortalView, ComplaintItem } from './CitizenPortalView';
import { CivicCommandCenterView, EmergencyItem } from './CivicCommandCenterView';
import { FieldOperationsView, FieldTask } from './FieldOperationsView';
import { api } from '../../services/api';

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'c-1',
    trackingCode: '#NM-1024',
    category: 'Electrical & Street Lighting',
    title: 'Exposed live wire dangling near bus stop',
    location: 'Main Bus Stop, Outer Ring Rd, Ward 12',
    status: 'IN PROGRESS',
    description: 'Electrical pole wire snapped after morning rains. Dangling 3 feet above water puddle near Ward 12 Main Bus Stand. Severe hazard for pedestrians.',
    isEmergency: true,
  },
  {
    id: 'c-2',
    trackingCode: '#NM-1019',
    category: 'Road Infrastructure',
    title: 'Deep pothole damaging vehicles on 4th Avenue',
    location: '4th Avenue, Near Post Office, Ward 12',
    status: 'IN PROGRESS',
    description: '1.5-foot deep pothole with exposed gravel causing severe bike accidents and traffic congestion.',
    isEmergency: false,
  },
  {
    id: 'c-3',
    trackingCode: '#NM-1015',
    category: 'Electrical & Street Lighting',
    title: 'Non-functional street light cluster',
    location: 'Lane 7, Civil Lines, Ward 12',
    status: 'RESOLVED',
    description: 'Complete blackout on lane 7 for 3 consecutive nights. Fixed and new LED bulbs installed.',
    isEmergency: false,
  },
];

const INITIAL_EMERGENCIES: EmergencyItem[] = [
  {
    id: 'e-1',
    code: 'E-1024',
    title: 'Potential exposed electrical cable',
    description: 'High-voltage dangling live wire in water puddle near bus stop. Imminent shock hazard.',
    location: 'Main Bus Stop, Outer Ring Rd, Ward 12',
    status: 'RESPONDING',
    assignedTo: 'Rajesh Kumar',
    department: 'Electrical & Street Lighting',
    ward: 'Ward 12',
    lat: 28.6745,
    lng: 77.2215,
    severity: 'critical',
  },
  {
    id: 'e-2',
    code: 'E-1025',
    title: 'Water main burst with road collapse risk',
    description: 'High pressure potable main burst causing ground erosion near road foundation.',
    location: 'Sector 8 Junction, Ward 8',
    status: 'ALERT SENT',
    assignedTo: 'Manish Yadav',
    department: 'Water Supply & Sewage',
    ward: 'Ward 8',
    lat: 28.6812,
    lng: 77.2145,
    severity: 'critical',
  },
];

const INITIAL_TASKS: FieldTask[] = [
  {
    id: 't-1',
    taskCode: '#NM-1024',
    isEmergency: true,
    title: 'Exposed live wire dangling near bus stop',
    ward: 'Ward 12',
    department: 'Electrical & Street Lighting',
    location: 'Main Bus Stop, Outer Ring Rd, Ward 12',
    lat: 28.6745,
    lng: 77.2215,
    status: 'IN PROGRESS',
    citizenDescription: 'Electrical pole wire snapped after morning rains. Dangling 3 feet above water puddle near Ward 12 Main Bus Stand. Severe hazard for pedestrians.',
    govInstructions: 'Priority escalated due to rain forecast. Field worker dispatched on vehicle #DL-04-1290.',
    vehicleAssigned: '#DL-04-1290',
  },
  {
    id: 't-2',
    taskCode: '#NM-1015',
    isEmergency: false,
    title: 'Non-functional street light cluster',
    ward: 'Ward 12',
    department: 'Electrical & Street Lighting',
    location: 'Lane 7, Civil Lines, Ward 12',
    lat: 28.6710,
    lng: 77.2280,
    status: 'RESOLVED',
    citizenDescription: 'Streetlight cluster flickering and sparking since yesterday.',
    govInstructions: 'Replaced faulty capacitor and LED assembly.',
  },
];

export const NagarMitraApp: React.FC = () => {
  const [role, setRole] = useState<PortalRole>('citizen');
  const [language, setLanguage] = useState<Language>('en');

  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [emergencies, setEmergencies] = useState<EmergencyItem[]>(INITIAL_EMERGENCIES);
  const [tasks, setTasks] = useState<FieldTask[]>(INITIAL_TASKS);

  // Sync with backend API on mount
  useEffect(() => {
    const fetchLiveIncidents = async () => {
      try {
        const res = await api.getIncidents();
        if (res.incidents && res.incidents.length > 0) {
          // Add backend incidents to complaints
          const liveComplaints: ComplaintItem[] = res.incidents.slice(0, 5).map((inc: any, idx: number) => ({
            id: inc.id || `live-${idx}`,
            trackingCode: inc.tracking_code || `#NM-${1030 + idx}`,
            category: inc.type || 'Civic Infrastructure',
            title: inc.title || 'Municipal Issue',
            location: inc.address || 'Ward 12, Main Road',
            status: inc.status === 'resolved' ? 'RESOLVED' : 'IN PROGRESS',
            description: inc.description || '',
            isEmergency: inc.severity === 'critical',
          }));

          // Merge without losing default mock items
          setComplaints((prev) => {
            const existingCodes = new Set(prev.map(p => p.trackingCode));
            const fresh = liveComplaints.filter(c => !existingCodes.has(c.trackingCode));
            return [...fresh, ...prev];
          });
        }
      } catch (e) {
        console.warn('Backend sync fallback to state:', e);
      }
    };

    fetchLiveIncidents();
  }, []);

  // Handle citizen reporting a problem
  const handleAddComplaint = async (data: {
    category: string;
    title: string;
    description: string;
    location: string;
    lat: number;
    lng: number;
  }) => {
    const codeNum = 1026 + complaints.length;
    const newCode = `#NM-${codeNum}`;

    const newComplaint: ComplaintItem = {
      id: `c-${Date.now()}`,
      trackingCode: newCode,
      category: data.category,
      title: data.title,
      location: data.location,
      status: 'IN PROGRESS',
      description: data.description,
      isEmergency: false,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Also create task in Field Operations
    const newTask: FieldTask = {
      id: `t-${Date.now()}`,
      taskCode: newCode,
      isEmergency: false,
      title: data.title,
      ward: 'Ward 12',
      department: data.category,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      status: 'IN PROGRESS',
      citizenDescription: data.description,
      govInstructions: `Field worker assigned for inspection at ${data.location}. Verify and report status.`,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Async persist to backend API
    try {
      await api.submitSOS({
        title: data.title,
        description: data.description,
        type: data.category.toLowerCase().includes('water') ? 'water_food' : 'other',
        address: data.location,
        latitude: data.lat,
        longitude: data.lng,
        severity: 'high',
      });
    } catch (e) {
      console.warn('Failed to persist incident to backend, kept in local state:', e);
    }
  };

  // Handle Emergency Alert trigger
  const handleTriggerEmergency = async (data: {
    title: string;
    description: string;
    dangerType: string;
    location: string;
    lat: number;
    lng: number;
  }) => {
    const codeNum = 1026 + emergencies.length;
    const emCode = `E-${codeNum}`;
    const trackingCode = `#NM-${codeNum}`;

    const newEmergency: EmergencyItem = {
      id: `e-${Date.now()}`,
      code: emCode,
      title: data.title,
      description: data.description,
      location: data.location,
      status: 'ALERT SENT',
      assignedTo: 'Rajesh Kumar (Emergency Unit)',
      department: 'Electrical & Street Lighting',
      ward: 'Ward 12',
      lat: data.lat,
      lng: data.lng,
      severity: 'critical',
    };

    const newComplaint: ComplaintItem = {
      id: `c-${Date.now()}`,
      trackingCode: trackingCode,
      category: 'Emergency Hazard',
      title: data.title,
      location: data.location,
      status: 'IN PROGRESS',
      description: data.description,
      isEmergency: true,
    };

    const newTask: FieldTask = {
      id: `t-${Date.now()}`,
      taskCode: trackingCode,
      isEmergency: true,
      title: data.title,
      ward: 'Ward 12',
      department: 'Electrical & Street Lighting',
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      status: 'IN PROGRESS',
      citizenDescription: data.description,
      govInstructions: 'IMMEDIATE EMERGENCY RESPONSE DISPATCHED. Hazard cordoning in progress.',
    };

    setEmergencies((prev) => [newEmergency, ...prev]);
    setComplaints((prev) => [newComplaint, ...prev]);
    setTasks((prev) => [newTask, ...prev]);

    // Send SOS to backend & Supabase
    try {
      await api.submitSOS({
        title: data.title,
        description: data.description,
        type: 'structural_collapse',
        address: data.location,
        latitude: data.lat,
        longitude: data.lng,
        medical_urgency: true,
        affected_count: 5,
      });
    } catch (e) {
      console.warn('Backend SOS dispatch failed, preserved in local state:', e);
    }
  };

  // Handle Task status update from Field Operations
  const handleUpdateTaskStatus = (taskId: string, newStatus: 'IN PROGRESS' | 'RESOLVED') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setComplaints((prev) =>
        prev.map((c) => (c.trackingCode === task.taskCode ? { ...c, status: newStatus } : c))
      );
      setEmergencies((prev) =>
        prev.map((em) =>
          em.code.replace('E-', '#NM-') === task.taskCode
            ? { ...em, status: newStatus === 'RESOLVED' ? 'RESOLVED' : 'RESPONDING' }
            : em
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f4ee]">
      {/* Top Demo Bar for Hackathon judges & role switching */}
      <RoleSwitcherBar
        currentRole={role}
        onRoleChange={setRole}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Render active portal */}
      {role === 'citizen' && (
        <CitizenPortalView
          complaints={complaints}
          onAddComplaint={handleAddComplaint}
          onTriggerEmergency={handleTriggerEmergency}
          language={language}
          onLanguageChange={setLanguage}
          onNavigateToCommand={() => setRole('command')}
        />
      )}

      {role === 'command' && (
        <CivicCommandCenterView
          emergencies={emergencies}
          language={language}
          onLanguageChange={setLanguage}
          onNavigateToField={() => setRole('field')}
        />
      )}

      {role === 'field' && (
        <FieldOperationsView
          tasks={tasks}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
};
