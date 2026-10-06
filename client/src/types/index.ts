// DisasterOS TypeScript Data Types

export type UserRole = 
  | 'citizen'
  | 'authority'
  | 'rescue_team'
  | 'hospital'
  | 'warehouse'
  | 'logistics'
  | 'ngo'
  | 'volunteer'
  | 'admin';

export type IncidentStatus = 
  | 'submitted'
  | 'verified'
  | 'prioritized'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  tracking_code: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  status: IncidentStatus;
  severity: SeverityLevel;
  priority_score: number;
  affected_count: number;
  injured_count: number;
  trapped_count: number;
  has_children_elderly: boolean;
  medical_urgency: boolean;
  created_at: string;
  updated_at?: string;
  ai_classification?: {
    category: string;
    confidence: number;
    recommended_response?: string[];
    rationale?: string;
  };
}

export interface Disaster {
  id: string;
  title: string;
  type: string;
  severity: SeverityLevel;
  status: string;
  epicenter_lat: number;
  epicenter_lng: number;
  radius_km: number;
  declared_at: string;
  description: string;
  affected_population: number;
  weather_summary?: string;
}

export interface DisasterZone {
  id: string;
  disaster_id: string;
  name: string;
  risk_level: string;
  estimated_population: number;
  is_evacuation_ordered: boolean;
  coordinates: [number, number][];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  address: string;
  contact_person: string;
  phone: string;
  status: string;
}

export interface InventoryItem {
  id: string;
  warehouse_id: string;
  category: string;
  item_name: string;
  unit: string;
  quantity_available: number;
  quantity_reserved: number;
  minimum_threshold: number;
  status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
}

export interface RescueTeam {
  id: string;
  team_code: string;
  name: string;
  lead_name: string;
  phone: string;
  current_lat: number;
  current_lng: number;
  status: 'available' | 'dispatched' | 'on_scene' | 'returning' | 'rest';
  skills: string[];
  capacity: number;
  active_mission?: string | null;
}

export interface Vehicle {
  id: string;
  registration_number: string;
  type: string;
  make_model: string;
  capacity_payload_kg: number;
  passenger_capacity: number;
  current_lat: number;
  current_lng: number;
  status: 'available' | 'assigned' | 'en_route' | 'on_mission' | 'maintenance' | 'offline';
  driver_name: string;
  fuel_percent: number;
  assigned_team_id?: string | null;
}

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  total_beds: number;
  available_beds: number;
  icu_total: number;
  icu_available: number;
  trauma_level: number;
  has_helipad: boolean;
  generator_operational: boolean;
  blood_bank_status: string;
  status: 'open' | 'diverted' | 'full' | 'damaged';
  specialties?: string[];
}

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  current_occupancy: number;
  food_supplies_days: number;
  water_supplies_days: number;
  medical_staff_present: boolean;
  pet_friendly: boolean;
  status: 'open' | 'at_capacity' | 'closed';
}

export interface Mission {
  id: string;
  mission_code: string;
  incident_id: string;
  team_id: string;
  vehicle_id: string;
  target_hospital_id?: string | null;
  target_shelter_id?: string | null;
  priority: string;
  status: 'assigned' | 'dispatched' | 'en_route' | 'on_scene' | 'completed' | 'aborted';
  objective: string;
  assigned_at: string;
  completed_at?: string;
  notes?: string;
}

export interface RoadHazard {
  id: string;
  road_name: string;
  hazard_type: string;
  latitude: number;
  longitude: number;
  is_passable: boolean;
  severity: string;
  reported_at: string;
  description?: string;
}

export interface AuditLog {
  id: string;
  user_email: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  timestamp: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  severity: string;
  type: string;
  affected_area: string;
  channels: string[];
  sent_at: string;
}
