// DisasterOS Frontend API Client
import { Incident, Disaster, Hospital, Shelter, Warehouse, InventoryItem, RescueTeam, Vehicle, Mission, RoadHazard, AuditLog, AlertNotification } from '../types';

const BASE_URL = '/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const role = localStorage.getItem('disasteros_role') || 'authority';
    const email = localStorage.getItem('disasteros_email') || `${role}@disasteros.gov`;
    const token = localStorage.getItem('disasteros_token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-demo-role': role,
      'x-demo-email': email
    };

    const sbUrl = localStorage.getItem('disasteros_supabase_url');
    const sbKey = localStorage.getItem('disasteros_supabase_anon_key');
    if (sbUrl) headers['x-supabase-url'] = sbUrl;
    if (sbKey) headers['x-supabase-key'] = sbKey;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorData.error || `HTTP ${res.status}: Request failed`);
    }
    return res.json();
  }

  // System
  getHealth() { return this.request<{ status: string; active_incidents: number; timestamp: string }>('/health'); }

  // Disasters
  getDisasters() { return this.request<{ disasters: Disaster[]; zones: any[] }>('/disasters'); }

  // Incidents & SOS
  getIncidents(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{ incidents: Incident[]; count: number }>(`/incidents${query ? `?${query}` : ''}`);
  }

  getIncidentById(id: string) { return this.request<{ incident: Incident }>(`/incidents/${id}`); }

  submitSOS(data: Partial<Incident>) {
    return this.request<{ success: boolean; incident: Incident; tracking_code: string; priority: any }>('/sos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  trackSOS(code: string) {
    return this.request<{ incident: Incident; mission: Mission | null }>(`/sos/${code}`);
  }

  updateIncident(id: string, updates: Partial<Incident>) {
    return this.request<{ incident: Incident }>(`/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // AI Intelligence
  aiPrioritize(incidentData: any) {
    return this.request<any>('/ai/prioritize', {
      method: 'POST',
      body: JSON.stringify(incidentData)
    });
  }

  aiAllocate(incidentId: string) {
    return this.request<any>('/ai/allocate', {
      method: 'POST',
      body: JSON.stringify({ incident_id: incidentId })
    });
  }

  aiAssistant(question: string) {
    return this.request<{ answer: string; sources: string[]; confidence: number }>('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }

  getDynamicReallocations() {
    return this.request<{ count: number; recommendations: any[] }>('/ai/dynamic-reallocation');
  }

  // Resources & Logistics
  getWarehouses() { return this.request<{ warehouses: Warehouse[] }>('/warehouses'); }
  getInventory(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{ inventory: InventoryItem[]; count: number }>(`/inventory${query ? `?${query}` : ''}`);
  }
  dispatchInventory(data: { inventory_id: string; quantity: number; reason: string }) {
    return this.request<{ success: boolean; item: InventoryItem }>('/inventory/dispatch', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  replenishInventory(data: { inventory_id: string; quantity: number; reason: string }) {
    return this.request<{ success: boolean; item: InventoryItem }>('/inventory/replenish', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getVehicles() { return this.request<{ vehicles: Vehicle[] }>('/vehicles'); }
  updateVehicle(id: string, updates: Partial<Vehicle>) {
    return this.request<{ vehicle: Vehicle }>(`/vehicles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  getRescueTeams() { return this.request<{ rescue_teams: RescueTeam[] }>('/rescue-teams'); }
  updateRescueTeam(id: string, updates: Partial<RescueTeam>) {
    return this.request<{ rescue_team: RescueTeam }>(`/rescue-teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
  
  // Missions
  getMissions() { return this.request<{ missions: Mission[] }>('/missions'); }
  createMission(missionData: any) {
    return this.request<{ success: boolean; mission: Mission }>('/missions', {
      method: 'POST',
      body: JSON.stringify(missionData)
    });
  }
  updateMission(id: string, updates: Partial<Mission>) {
    return this.request<{ mission: Mission }>(`/missions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Facilities
  getHospitals() { return this.request<{ hospitals: Hospital[] }>('/hospitals'); }
  updateHospitalCapacity(id: string, capacity: { available_beds?: number; icu_available?: number; status?: string }) {
    return this.request<{ hospital: Hospital }>(`/hospitals/${id}/capacity`, {
      method: 'PATCH',
      body: JSON.stringify(capacity)
    });
  }

  getShelters() { return this.request<{ shelters: Shelter[] }>('/shelters'); }
  updateShelterOccupancy(id: string, data: { current_occupancy?: number; status?: string }) {
    return this.request<{ shelter: Shelter }>(`/shelters/${id}/occupancy`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Routes & Hazards
  calculateRoute(startLat: number, startLng: number, destLat: number, destLng: number, vehicleType = 'ambulance') {
    return this.request<any>(`/routes/calculate?startLat=${startLat}&startLng=${startLng}&destLat=${destLat}&destLng=${destLng}&vehicleType=${vehicleType}`);
  }
  getRoadHazards() { return this.request<{ road_hazards: RoadHazard[] }>('/road-conditions'); }

  // Volunteers & NGOs
  getNgos() { return this.request<{ ngos: any[] }>('/ngos'); }
  getVolunteers() { return this.request<{ volunteers: any[] }>('/volunteers'); }
  updateVolunteer(id: string, updates: any) {
    return this.request<{ volunteer: any }>(`/volunteers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Alerts
  getAlerts() { return this.request<{ alerts: AlertNotification[] }>('/alerts'); }
  createAlert(data: any) {
    return this.request<{ alert: AlertNotification }>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Simulation
  getWhatIf(scenario: string) { return this.request<any>(`/simulation/what-if?scenario=${scenario}`); }
  startFloodSimulation() { return this.request<any>('/simulation/start-flood', { method: 'POST' }); }
  stopSimulation() { return this.request<any>('/simulation/stop', { method: 'POST' }); }

  // Risk & Analytics
  getRiskAnalysis() { return this.request<any>('/risk/analysis'); }
  getAnalytics() { return this.request<any>('/analytics'); }
  getAuditLogs() { return this.request<{ audit_logs: AuditLog[] }>('/audit-logs'); }
  getExternalWeather() { return this.request<any>('/external/weather'); }

  // Supabase Cloud Integration
  getSupabaseStatus() { return this.request<any>('/supabase/status'); }
  saveSupabaseConfig(url: string, key: string) {
    return this.request<any>('/supabase/config', {
      method: 'POST',
      body: JSON.stringify({ url, key })
    });
  }
  testSupabase(url: string, key: string) {
    return this.request<any>('/supabase/test', {
      method: 'POST',
      body: JSON.stringify({ url, key })
    });
  }
  syncSupabase() { return this.request<any>('/supabase/sync', { method: 'POST' }); }
}

export const api = new ApiClient();
