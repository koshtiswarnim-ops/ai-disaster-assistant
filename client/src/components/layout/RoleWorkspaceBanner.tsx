import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import { 
  ShieldAlert, 
  Hospital as HospitalIcon, 
  Boxes, 
  Truck, 
  HeartHandshake, 
  Radio, 
  User, 
  Settings, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  LifeBuoy
} from 'lucide-react';

interface RoleConfig {
  role: UserRole;
  label: string;
  name: string;
  org: string;
  icon: any;
  color: string;
  badgeBg: string;
  primaryPath: string;
  permissions: string[];
  quickActions: { label: string; path: string; icon?: any }[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  authority: {
    role: 'authority',
    label: 'Emergency Authority',
    name: 'Chief Marcus Vance',
    org: 'Command Center EOC',
    icon: Radio,
    color: 'text-slate-900',
    badgeBg: 'bg-slate-900 text-white',
    primaryPath: '/command-center',
    permissions: ['Verify Incidents', 'Approve AI Allocations', 'Deploy Responders', 'Citywide EOC'],
    quickActions: [
      { label: 'EOC Command Center', path: '/command-center' },
      { label: 'Resource Allocation', path: '/allocation' },
      { label: 'Tactical Map', path: '/map' },
      { label: 'Broadcast Siren', path: '/alerts' }
    ]
  },
  citizen: {
    role: 'citizen',
    label: 'Citizen / Evacuee',
    name: 'Sarah Lin',
    org: 'Marina Waterfront Resident',
    icon: User,
    color: 'text-blue-700',
    badgeBg: 'bg-blue-600 text-white',
    primaryPath: '/sos',
    permissions: ['Submit Emergency SOS', 'Track Live Rescue', 'View Safe Shelters', 'Receive Geofence Alerts'],
    quickActions: [
      { label: 'One-Tap SOS', path: '/sos' },
      { label: 'Nearby Safe Shelters', path: '/shelters' },
      { label: 'Nearest Hospitals', path: '/hospitals' },
      { label: 'Ask AI Assistant', path: '/ai-assistant' }
    ]
  },
  rescue_team: {
    role: 'rescue_team',
    label: 'Rescue Responder',
    name: 'Capt. Sarah Jenkins',
    org: 'Swiftwater Taskforce Alpha',
    icon: Shield,
    color: 'text-amber-700',
    badgeBg: 'bg-amber-600 text-white',
    primaryPath: '/rescue-teams',
    permissions: ['Accept Missions', 'Report Field Obstacles', 'Extrication Status', 'Hazard-Avoidance Navigation'],
    quickActions: [
      { label: 'My Mission Queue', path: '/rescue-teams' },
      { label: 'Hazard-Free Routes', path: '/routes' },
      { label: 'Tactical Map', path: '/map' },
      { label: 'Incident SOS Feed', path: '/incidents' }
    ]
  },
  hospital: {
    role: 'hospital',
    label: 'Hospital Triage',
    name: 'Dr. Arvind Patel',
    org: 'Metropolitan Trauma Center',
    icon: HospitalIcon,
    color: 'text-rose-700',
    badgeBg: 'bg-rose-600 text-white',
    primaryPath: '/hospitals',
    permissions: ['Update ICU & Bed Capacity', 'Ambulance Divert Protocol', 'Trauma Admission Triage'],
    quickActions: [
      { label: 'Update Bed Capacity', path: '/hospitals' },
      { label: 'Incoming Trauma Queue', path: '/incidents' },
      { label: 'Patient Transit Map', path: '/map' },
      { label: 'Command Center', path: '/command-center' }
    ]
  },
  warehouse: {
    role: 'warehouse',
    label: 'Warehouse Depot',
    name: 'Elena Rostova',
    org: 'Central Logistics Depot',
    icon: Boxes,
    color: 'text-indigo-700',
    badgeBg: 'bg-indigo-600 text-white',
    primaryPath: '/warehouses',
    permissions: ['Manage Emergency Stock', 'Dispatch Hydration & Trauma Kits', 'Inventory Resupply Logs'],
    quickActions: [
      { label: 'Manage Inventory', path: '/warehouses' },
      { label: 'Supply Allocations', path: '/allocation' },
      { label: 'Fleet Vehicles', path: '/vehicles' },
      { label: 'Command Center', path: '/command-center' }
    ]
  },
  logistics: {
    role: 'logistics',
    label: 'Fleet Logistics',
    name: 'Sgt. Tom Bradley',
    org: 'Transit & Heavy Transport',
    icon: Truck,
    color: 'text-emerald-700',
    badgeBg: 'bg-emerald-600 text-white',
    primaryPath: '/vehicles',
    permissions: ['Manage Transport Fleet', 'Vehicle Fuel & Payloads', 'Corridor Road Clearances'],
    quickActions: [
      { label: 'Vehicle Fleet', path: '/vehicles' },
      { label: 'Road Hazards & Corridors', path: '/routes' },
      { label: 'Tactical Map', path: '/map' },
      { label: 'Depot Stock', path: '/warehouses' }
    ]
  },
  ngo: {
    role: 'ngo',
    label: 'NGO Coordinator',
    name: 'Rachel Simmons',
    org: 'Red Cross Disaster Relief',
    icon: HeartHandshake,
    color: 'text-purple-700',
    badgeBg: 'bg-purple-600 text-white',
    primaryPath: '/volunteers',
    permissions: ['Coordinate Relief Aid', 'Register Food & Blankets', 'Manage Volunteer Units'],
    quickActions: [
      { label: 'Aid Roster & Tasks', path: '/volunteers' },
      { label: 'Evacuation Shelters', path: '/shelters' },
      { label: 'Citizen Distress Feed', path: '/sos' },
      { label: 'Tactical Map', path: '/map' }
    ]
  },
  volunteer: {
    role: 'volunteer',
    label: 'Volunteer Specialist',
    name: 'Dr. Jonathan Hayes',
    org: 'Medical Auxiliary Volunteer',
    icon: LifeBuoy,
    color: 'text-teal-700',
    badgeBg: 'bg-teal-600 text-white',
    primaryPath: '/volunteers',
    permissions: ['Accept Field Tasks', 'Medical First Aid Support', 'Shelter Assistance'],
    quickActions: [
      { label: 'Verified Task Queue', path: '/volunteers' },
      { label: 'Shelter Locations', path: '/shelters' },
      { label: 'Citizen SOS', path: '/sos' },
      { label: 'AI Assistant', path: '/ai-assistant' }
    ]
  },
  admin: {
    role: 'admin',
    label: 'System Administrator',
    name: 'Alex Mercer',
    org: 'DisasterOS Core DevOps',
    icon: Settings,
    color: 'text-slate-800',
    badgeBg: 'bg-slate-800 text-white',
    primaryPath: '/simulation',
    permissions: ['System State Audit', 'Digital Twin Simulation', 'System Analytics', 'RBAC Configuration'],
    quickActions: [
      { label: 'Digital Twin Sandbox', path: '/simulation' },
      { label: 'Audit Logs', path: '/audit-logs' },
      { label: 'Operational Analytics', path: '/analytics' },
      { label: 'Command Center', path: '/command-center' }
    ]
  }
};

export const RoleWorkspaceBanner: React.FC = () => {
  const { user, setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cfg = ROLE_CONFIGS[user.role] || ROLE_CONFIGS.authority;
  const RoleIcon = cfg.icon;

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    const targetConfig = ROLE_CONFIGS[newRole];
    if (targetConfig) {
      navigate(targetConfig.primaryPath);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-2xs text-xs py-2 px-4 sm:px-6 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Active Persona Details & Verified RBAC Mandate */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 shadow-2xs ${cfg.badgeBg}`}>
            <RoleIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs">
                {cfg.name}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${cfg.badgeBg}`}>
                {cfg.label}
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-500 font-mono">
                {cfg.org}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700">RBAC Scope:</span>
              <span className="truncate max-w-[280px] sm:max-w-md">{cfg.permissions.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Right: Role-Specific Action Shortcuts + Quick Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick Actions for Active Role */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2 pr-2 border-r border-slate-200">
            {cfg.quickActions.map(act => (
              <button
                key={act.path}
                onClick={() => navigate(act.path)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  location.pathname === act.path
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Quick Role Tester Pills for Hackathon Presentation */}
          <div className="flex items-center gap-1 text-[10.5px] font-mono">
            <span className="text-slate-400 mr-1 hidden lg:inline">Switch Role:</span>
            {[
              { r: 'citizen' as UserRole, label: 'Citizen', icon: '👤' },
              { r: 'authority' as UserRole, label: 'EOC Chief', icon: '🛡️' },
              { r: 'rescue_team' as UserRole, label: 'Rescue', icon: '🚒' },
              { r: 'hospital' as UserRole, label: 'Hospital', icon: '🏥' },
              { r: 'warehouse' as UserRole, label: 'Depot', icon: '📦' },
            ].map(item => (
              <button
                key={item.r}
                onClick={() => handleRoleSwitch(item.r)}
                className={`px-2 py-0.5 rounded text-[10.5px] font-medium border transition-all ${
                  user.role === item.r
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
                title={`Switch operator role to ${item.label}`}
              >
                <span>{item.icon}</span> <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
