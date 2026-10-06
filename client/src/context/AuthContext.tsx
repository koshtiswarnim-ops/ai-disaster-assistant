// DisasterOS Authentication & Role Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

interface AuthUser {
  email: string;
  role: UserRole;
  fullName: string;
  title: string;
}

interface AuthContextType {
  user: AuthUser;
  setRole: (role: UserRole) => void;
  availableRoles: { role: UserRole; label: string; name: string; org: string }[];
}

const rolePersonas: Record<UserRole, { label: string; name: string; org: string }> = {
  authority: { label: "Emergency Authority", name: "Chief Marcus Vance", org: "Command Center EOC" },
  citizen: { label: "Citizen / Evacuee", name: "Sarah Lin", org: "Marina District Resident" },
  rescue_team: { label: "Rescue Responder", name: "Capt. Sarah Jenkins", org: "Swiftwater Taskforce Alpha" },
  hospital: { label: "Hospital Triage", name: "Dr. Arvind Patel", org: "Metropolitan Trauma Hospital" },
  warehouse: { label: "Warehouse Depot", name: "Elena Rostova", org: "Central Logistics Depot" },
  logistics: { label: "Fleet Logistics", name: "Sgt. Tom Bradley", org: "Transit & Heavy Transport" },
  ngo: { label: "NGO Coordinator", name: "Rachel Simmons", org: "Red Cross Disaster Relief" },
  volunteer: { label: "Volunteer Specialist", name: "Dr. Jonathan Hayes", org: "Medical Auxiliary Volunteer" },
  admin: { label: "System Administrator", name: "Alex Mercer", org: "DisasterOS Core DevOps" }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('disasteros_role') as UserRole) || 'authority';
  });

  const persona = rolePersonas[currentRole];
  const user: AuthUser = {
    email: `${currentRole}@disasteros.gov`,
    role: currentRole,
    fullName: persona.name,
    title: `${persona.label} · ${persona.org}`
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('disasteros_role', role);
    localStorage.setItem('disasteros_email', `${role}@disasteros.gov`);
  };

  useEffect(() => {
    localStorage.setItem('disasteros_role', currentRole);
  }, [currentRole]);

  const availableRoles = (Object.keys(rolePersonas) as UserRole[]).map((r) => ({
    role: r,
    label: rolePersonas[r].label,
    name: rolePersonas[r].name,
    org: rolePersonas[r].org
  }));

  return (
    <AuthContext.Provider value={{ user, setRole, availableRoles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
