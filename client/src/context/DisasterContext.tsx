// DisasterOS Realtime Operational State Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';
import { Incident, Disaster, Hospital, Shelter, Warehouse, InventoryItem, RescueTeam, Vehicle, Mission, RoadHazard, AlertNotification } from '../types';

interface LiveEventNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
}

interface DisasterContextType {
  disaster: Disaster | null;
  incidents: Incident[];
  rescueTeams: RescueTeam[];
  vehicles: Vehicle[];
  hospitals: Hospital[];
  shelters: Shelter[];
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  missions: Mission[];
  hazards: RoadHazard[];
  alerts: AlertNotification[];
  liveNotifications: LiveEventNotification[];
  isLoading: boolean;
  isConnected: boolean;
  refreshData: () => Promise<void>;
  submitSOS: (data: Partial<Incident>) => Promise<any>;
  dispatchMission: (missionData: any) => Promise<any>;
  dismissNotification: (id: string) => void;
  startSimulationCascade: () => Promise<any>;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disaster, setDisaster] = useState<Disaster | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [hazards, setHazards] = useState<RoadHazard[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<LiveEventNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const addNotification = (title: string, message: string, severity: 'critical' | 'high' | 'medium' | 'info' = 'info', type = 'EVENT') => {
    const notif: LiveEventNotification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      severity,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLiveNotifications((prev) => [notif, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setLiveNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const refreshData = useCallback(async () => {
    try {
      const [
        disastersRes,
        incidentsRes,
        teamsRes,
        vehiclesRes,
        hospRes,
        sheltersRes,
        whRes,
        invRes,
        missionsRes,
        hazardsRes,
        alertsRes
      ] = await Promise.all([
        api.getDisasters(),
        api.getIncidents(),
        api.getRescueTeams(),
        api.getVehicles(),
        api.getHospitals(),
        api.getShelters(),
        api.getWarehouses(),
        api.getInventory(),
        api.getMissions(),
        api.getRoadHazards(),
        api.getAlerts()
      ]);

      if (disastersRes.disasters.length > 0) setDisaster(disastersRes.disasters[0]);
      setIncidents(incidentsRes.incidents || []);
      setRescueTeams(teamsRes.rescue_teams || []);
      setVehicles(vehiclesRes.vehicles || []);
      setHospitals(hospRes.hospitals || []);
      setShelters(sheltersRes.shelters || []);
      setWarehouses(whRes.warehouses || []);
      setInventory(invRes.inventory || []);
      setMissions(missionsRes.missions || []);
      setHazards(hazardsRes.road_hazards || []);
      setAlerts(alertsRes.alerts || []);
    } catch (err) {
      console.warn('[DisasterContext] Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    socket.connect();

    const unsubStatus = socket.on('STATUS_CHANGE', ({ connected }) => {
      setIsConnected(connected);
    });

    const unsubSOS = socket.on('SOS_CREATED', (payload) => {
      const inc = payload.incident || payload;
      setIncidents((prev) => [inc, ...prev.filter((i) => i.id !== inc.id)]);
      addNotification(
        `🚨 New Citizen SOS: #${inc.tracking_code}`,
        `${inc.title} (Priority: ${inc.priority_score}/100)`,
        inc.severity === 'critical' ? 'critical' : 'high',
        'SOS_CREATED'
      );
    });

    const unsubIncUpdated = socket.on('INCIDENT_UPDATED', (updatedInc) => {
      setIncidents((prev) => prev.map((i) => (i.id === updatedInc.id ? { ...i, ...updatedInc } : i)));
      addNotification(`Incident Updated`, `#${updatedInc.tracking_code} is now ${updatedInc.status}`, 'medium', 'INCIDENT_UPDATED');
    });

    const unsubMission = socket.on('MISSION_CREATED', (mission) => {
      setMissions((prev) => [mission, ...prev]);
      addNotification(`🚁 Mission Dispatched`, `Mission ${mission.mission_code} created for target incident`, 'info', 'MISSION_CREATED');
      refreshData(); // Refresh teams/vehicles status
    });

    const unsubMissionUpdated = socket.on('MISSION_UPDATED', (mission) => {
      setMissions((prev) => prev.map((m) => (m.id === mission.id ? { ...m, ...mission } : m)));
      refreshData();
    });

    const unsubRoad = socket.on('ROAD_BLOCKED', (hazard) => {
      setHazards((prev) => [hazard, ...prev]);
      addNotification(`⚠️ Road Hazard Blocked`, `${hazard.road_name || 'Corridor'} is impassable. Routing updated.`, 'critical', 'ROAD_BLOCKED');
    });

    const unsubInventory = socket.on('INVENTORY_UPDATED', () => {
      api.getInventory().then((res) => setInventory(res.inventory || []));
    });

    return () => {
      unsubStatus();
      unsubSOS();
      unsubIncUpdated();
      unsubMission();
      unsubMissionUpdated();
      unsubRoad();
      unsubInventory();
    };
  }, [refreshData]);

  const submitSOS = async (data: Partial<Incident>) => {
    const res = await api.submitSOS(data);
    refreshData();
    return res;
  };

  const dispatchMission = async (missionData: any) => {
    const res = await api.createMission(missionData);
    refreshData();
    return res;
  };

  const startSimulationCascade = async () => {
    addNotification('🌊 Simulation Mode Activated', 'Atmospheric River Category 3 cascading events streaming live...', 'critical', 'SIMULATION');
    return api.startFloodSimulation();
  };

  return (
    <DisasterContext.Provider
      value={{
        disaster,
        incidents,
        rescueTeams,
        vehicles,
        hospitals,
        shelters,
        warehouses,
        inventory,
        missions,
        hazards,
        alerts,
        liveNotifications,
        isLoading,
        isConnected,
        refreshData,
        submitSOS,
        dispatchMission,
        dismissNotification,
        startSimulationCascade
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) throw new Error('useDisaster must be used within a DisasterProvider');
  return context;
};
