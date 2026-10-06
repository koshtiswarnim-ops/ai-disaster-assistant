// DisasterOS Data Store (Unified Reactive In-Memory & Supabase-compatible store)
import { v4 as uuidv4 } from 'uuid';
import {
  seedDisasters,
  seedZones,
  seedIncidents,
  seedWarehouses,
  seedInventory,
  seedRescueTeams,
  seedVehicles,
  seedHospitals,
  seedShelters,
  seedRoadHazards,
  seedMissions,
  seedNgos,
  seedVolunteers,
  seedAuditLogs
} from './seedData.js';

class DisasterOSStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.disasters = JSON.parse(JSON.stringify(seedDisasters));
    this.zones = JSON.parse(JSON.stringify(seedZones));
    this.incidents = JSON.parse(JSON.stringify(seedIncidents));
    this.warehouses = JSON.parse(JSON.stringify(seedWarehouses));
    this.inventory = JSON.parse(JSON.stringify(seedInventory));
    this.rescueTeams = JSON.parse(JSON.stringify(seedRescueTeams));
    this.vehicles = JSON.parse(JSON.stringify(seedVehicles));
    this.hospitals = JSON.parse(JSON.stringify(seedHospitals));
    this.shelters = JSON.parse(JSON.stringify(seedShelters));
    this.roadHazards = JSON.parse(JSON.stringify(seedRoadHazards));
    this.missions = JSON.parse(JSON.stringify(seedMissions));
    this.ngos = JSON.parse(JSON.stringify(seedNgos));
    this.volunteers = JSON.parse(JSON.stringify(seedVolunteers));
    this.auditLogs = JSON.parse(JSON.stringify(seedAuditLogs));
    this.alerts = [
      {
        id: "alert-001",
        title: "Flash Flood Warning - Zone A Waterfront",
        message: "Rapid storm surge inundation detected in Marina & Waterfront basin. Evacuation routes active toward Presidio Gymnasium.",
        severity: "critical",
        type: "evacuation",
        affected_area: "Zone A Waterfront & Marina",
        channels: ["push", "sms", "siren"],
        sent_at: new Date(Date.now() - 45 * 60000).toISOString()
      },
      {
        id: "alert-002",
        title: "Road Closure Alert: Mission & 14th Underpass",
        message: "Underpass is flooded and closed. Emergency vehicles must reroute via Guerrero or Van Ness Ave.",
        severity: "severe",
        type: "road_closure",
        affected_area: "Mission District Transit Corridor",
        channels: ["push"],
        sent_at: new Date(Date.now() - 35 * 60000).toISOString()
      }
    ];
    this.users = [
      { id: "usr-01", email: "authority@disasteros.gov", role: "authority", full_name: "Chief Director Marcus Vance", organization: "Emergency Operations Center" },
      { id: "usr-02", email: "citizen@example.com", role: "citizen", full_name: "Sarah Lin", organization: "Local Resident" },
      { id: "usr-03", email: "responder@disasteros.gov", role: "rescue_team", full_name: "Capt. Sarah Jenkins", organization: "Swiftwater Taskforce" },
      { id: "usr-04", email: "hospital@disasteros.gov", role: "hospital", full_name: "Dr. Arvind Patel", organization: "Metro Trauma Center" },
      { id: "usr-05", email: "warehouse@disasteros.gov", role: "warehouse", full_name: "Elena Rostova", organization: "North Depot Logistics" },
      { id: "usr-06", email: "admin@disasteros.gov", role: "admin", full_name: "System Administrator", organization: "DisasterOS Core" }
    ];
  }

  // --- Audit Logging ---
  addAuditLog(entry) {
    const log = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user_email: entry.user_email || "system@disasteros.gov",
      user_role: entry.user_role || "system",
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      details: entry.details,
      metadata: entry.metadata || {}
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // --- Incidents / SOS ---
  getIncidents(filters = {}) {
    let result = [...this.incidents];
    if (filters.status) result = result.filter(i => i.status === filters.status);
    if (filters.severity) result = result.filter(i => i.severity === filters.severity);
    if (filters.type) result = result.filter(i => i.type === filters.type);
    return result;
  }

  getIncidentById(id) {
    return this.incidents.find(i => i.id === id || i.tracking_code === id);
  }

  createIncident(data) {
    const id = uuidv4();
    const tracking_code = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      id,
      tracking_code,
      type: data.type || "flood",
      title: data.title || "Emergency Assistance Request",
      description: data.description || "",
      latitude: Number(data.latitude) || 37.7749,
      longitude: Number(data.longitude) || -122.4194,
      address: data.address || "Reported Location",
      status: data.status || "submitted",
      severity: data.severity || "high",
      priority_score: data.priority_score || 70,
      affected_count: Number(data.affected_count) || 1,
      injured_count: Number(data.injured_count) || 0,
      trapped_count: Number(data.trapped_count) || 0,
      has_children_elderly: Boolean(data.has_children_elderly),
      medical_urgency: Boolean(data.medical_urgency),
      created_at: new Date().toISOString(),
      ai_classification: data.ai_classification || null
    };

    this.incidents.unshift(newIncident);
    this.addAuditLog({
      action: "SOS_SUBMITTED",
      entity_type: "incident",
      entity_id: newIncident.id,
      details: `New emergency SOS created with tracking code ${newIncident.tracking_code}`,
      user_email: data.reporter_email || "citizen@emergency.local",
      user_role: "citizen"
    });
    return newIncident;
  }

  updateIncident(id, updates, user = {}) {
    const index = this.incidents.findIndex(i => i.id === id);
    if (index === -1) return null;
    const old = this.incidents[index];
    this.incidents[index] = { ...old, ...updates, updated_at: new Date().toISOString() };
    
    this.addAuditLog({
      action: "INCIDENT_UPDATED",
      entity_type: "incident",
      entity_id: id,
      details: `Incident ${id} updated status from '${old.status}' to '${this.incidents[index].status}'`,
      user_email: user.email || "authority@disasteros.gov",
      user_role: user.role || "authority"
    });
    return this.incidents[index];
  }

  // --- Inventory & Warehouses ---
  updateInventoryStock(inventoryId, quantityChange, type = "dispatch", reason = "", user = {}) {
    const item = this.inventory.find(i => i.id === inventoryId);
    if (!item) return null;
    const previousAvailable = item.quantity_available;
    item.quantity_available = Math.max(0, item.quantity_available + quantityChange);
    
    // Auto status recalculation
    if (item.quantity_available === 0) item.status = "out_of_stock";
    else if (item.quantity_available <= item.minimum_threshold * 0.5) item.status = "critical";
    else if (item.quantity_available <= item.minimum_threshold) item.status = "low";
    else item.status = "healthy";

    this.addAuditLog({
      action: `INVENTORY_${type.toUpperCase()}`,
      entity_type: "inventory",
      entity_id: inventoryId,
      details: `${item.item_name} adjusted by ${quantityChange} (${previousAvailable} -> ${item.quantity_available}). Reason: ${reason}`,
      user_email: user.email || "warehouse@disasteros.gov",
      user_role: user.role || "warehouse"
    });
    return item;
  }

  // --- Missions ---
  createMission(missionData, user = {}) {
    const id = `mis-${Date.now().toString().slice(-4)}`;
    const mission_code = `MIS-${Math.floor(100 + Math.random() * 900)}`;
    const newMission = {
      id,
      mission_code,
      incident_id: missionData.incident_id,
      team_id: missionData.team_id,
      vehicle_id: missionData.vehicle_id,
      target_hospital_id: missionData.target_hospital_id || null,
      target_shelter_id: missionData.target_shelter_id || null,
      priority: missionData.priority || "high",
      status: "assigned",
      objective: missionData.objective || "Deploy emergency responders",
      assigned_at: new Date().toISOString(),
      notes: missionData.notes || ""
    };

    this.missions.unshift(newMission);

    // Update assigned team and vehicle status
    if (missionData.team_id) {
      const team = this.rescueTeams.find(t => t.id === missionData.team_id);
      if (team) team.status = "dispatched";
    }
    if (missionData.vehicle_id) {
      const veh = this.vehicles.find(v => v.id === missionData.vehicle_id);
      if (veh) veh.status = "on_mission";
    }

    // Update incident status to assigned
    if (missionData.incident_id) {
      this.updateIncident(missionData.incident_id, { status: "assigned" }, user);
    }

    this.addAuditLog({
      action: "MISSION_CREATED",
      entity_type: "mission",
      entity_id: id,
      details: `Mission ${mission_code} created and assigned to team ${missionData.team_id}`,
      user_email: user.email || "authority@disasteros.gov",
      user_role: user.role || "authority"
    });

    return newMission;
  }

  updateMission(id, updates, user = {}) {
    const index = this.missions.findIndex(m => m.id === id);
    if (index === -1) return null;
    const old = this.missions[index];
    this.missions[index] = { ...old, ...updates };

    if (updates.status === "completed") {
      this.missions[index].completed_at = new Date().toISOString();
      // Free up team and vehicle
      if (old.team_id) {
        const team = this.rescueTeams.find(t => t.id === old.team_id);
        if (team) team.status = "available";
      }
      if (old.vehicle_id) {
        const veh = this.vehicles.find(v => v.id === old.vehicle_id);
        if (veh) veh.status = "available";
      }
      // Update incident to resolved
      if (old.incident_id) {
        this.updateIncident(old.incident_id, { status: "resolved" }, user);
      }
    }

    this.addAuditLog({
      action: "MISSION_UPDATED",
      entity_type: "mission",
      entity_id: id,
      details: `Mission ${id} status updated to '${updates.status}'`,
      user_email: user.email || "responder@disasteros.gov",
      user_role: user.role || "rescue_team"
    });

    return this.missions[index];
  }
}

export const store = new DisasterOSStore();
