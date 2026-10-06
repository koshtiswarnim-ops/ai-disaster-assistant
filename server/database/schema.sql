-- =============================================================================
-- DISASTEROS DATABASE SCHEMA (PostgreSQL / Supabase)
-- "One intelligent operating system for disaster response"
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ACCESS CONTROL (RBAC)
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
  ('citizen', 'Citizen', 'Can report emergencies, track requests, view public alerts and shelters'),
  ('authority', 'Emergency Authority', 'Command Center access, verify incidents, approve allocations, dispatch missions'),
  ('rescue_team', 'Rescue Team Responder', 'Field responder, accept missions, live navigation, status telemetry'),
  ('hospital', 'Hospital Administrator', 'Manage ER capacity, ICU beds, ambulance fleet, triage incoming patients'),
  ('warehouse', 'Warehouse Manager', 'Manage inventory, stock replenishment, item dispatches, transfer logs'),
  ('logistics', 'Logistics Coordinator', 'Manage vehicle fleet, route clearance, driver assignments'),
  ('ngo', 'NGO Coordinator', 'Aid distribution, relief supplies, community coordination'),
  ('volunteer', 'Volunteer', 'Accept verified tasks, skills matching, localized assistance'),
  ('admin', 'System Administrator', 'User management, audit telemetry, API configurations, security logs')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) REFERENCES roles(id) DEFAULT 'citizen',
  organization VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  skills TEXT[],
  address TEXT,
  emergency_contact VARCHAR(100),
  medical_notes TEXT,
  blood_group VARCHAR(10),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DISASTERS & AFFECTED ZONES
CREATE TABLE IF NOT EXISTS disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- flood, earthquake, hurricane, wildfire, industrial, tsunami
  severity VARCHAR(50) NOT NULL, -- low, medium, high, critical
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, contained, monitoring, resolved
  epicenter_lat DOUBLE PRECISION NOT NULL,
  epicenter_lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL DEFAULT 25.0,
  declared_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS affected_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  risk_level VARCHAR(50) NOT NULL, -- low, medium, high, extreme
  polygon_coordinates JSONB NOT NULL,
  estimated_population INT DEFAULT 0,
  is_evacuation_ordered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INCIDENTS & CITIZEN SOS
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tracking_code VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- flood, fire, medical, structural_collapse, water_food, trapped_people
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted', -- submitted, verified, prioritized, assigned, in_progress, resolved, rejected
  severity VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  priority_score INT DEFAULT 50, -- 0-100
  affected_count INT DEFAULT 1,
  injured_count INT DEFAULT 0,
  trapped_count INT DEFAULT 0,
  has_children_elderly BOOLEAN DEFAULT FALSE,
  medical_urgency BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incident_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- image, video, audio, document
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incident_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WAREHOUSES & INVENTORY
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'operational', -- operational, limited, inaccessible
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- medical, food, water, rescue_gear, shelter_kits, fuel
  item_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL, -- boxes, liters, units, kg
  quantity_available INT NOT NULL DEFAULT 0,
  quantity_reserved INT NOT NULL DEFAULT 0,
  minimum_threshold INT NOT NULL DEFAULT 50,
  status VARCHAR(50) GENERATED ALWAYS AS (
    CASE 
      WHEN quantity_available = 0 THEN 'out_of_stock'
      WHEN quantity_available <= minimum_threshold * 0.5 THEN 'critical'
      WHEN quantity_available <= minimum_threshold THEN 'low'
      ELSE 'healthy'
    END
  ) STORED,
  last_replenished TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- addition, reservation, dispatch, restock, transfer
  quantity INT NOT NULL,
  reason TEXT,
  reference_mission_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RESCUE TEAMS & SKILLS
CREATE TABLE IF NOT EXISTS rescue_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  lead_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  current_lat DOUBLE PRECISION NOT NULL,
  current_lng DOUBLE PRECISION NOT NULL,
  status VARCHAR(50) DEFAULT 'available', -- available, dispatched, on_scene, returning, rest
  skills TEXT[] DEFAULT '{}', -- water_rescue, medical_evac, hazmat, alpine, k9, structural_collapse
  capacity INT DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VEHICLES & LOGISTICS
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- ambulance, high_clearance_truck, rescue_boat, air_drone, transport_bus
  make_model VARCHAR(100),
  capacity_payload_kg INT DEFAULT 1000,
  passenger_capacity INT DEFAULT 4,
  current_lat DOUBLE PRECISION NOT NULL,
  current_lng DOUBLE PRECISION NOT NULL,
  status VARCHAR(50) DEFAULT 'available', -- available, assigned, en_route, on_mission, maintenance, offline
  assigned_team_id UUID REFERENCES rescue_teams(id) ON DELETE SET NULL,
  driver_name VARCHAR(100),
  fuel_percent INT DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HOSPITALS & CAPACITY
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  total_beds INT NOT NULL DEFAULT 100,
  available_beds INT NOT NULL DEFAULT 20,
  icu_total INT NOT NULL DEFAULT 20,
  icu_available INT NOT NULL DEFAULT 4,
  trauma_level INT DEFAULT 1, -- 1 = highest capability
  has_helipad BOOLEAN DEFAULT TRUE,
  generator_operational BOOLEAN DEFAULT TRUE,
  blood_bank_status VARCHAR(50) DEFAULT 'adequate', -- critical, low, adequate, surplus
  status VARCHAR(50) DEFAULT 'open', -- open, diverted, full, damaged
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SHELTERS & OCCUPANCY
CREATE TABLE IF NOT EXISTS shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 500,
  current_occupancy INT NOT NULL DEFAULT 0,
  food_supplies_days INT DEFAULT 5,
  water_supplies_days INT DEFAULT 5,
  medical_staff_present BOOLEAN DEFAULT TRUE,
  pet_friendly BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'open', -- open, at_capacity, closed
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MISSIONS & DISPATCH WORKFLOW
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_code VARCHAR(50) UNIQUE NOT NULL,
  incident_id UUID REFERENCES incidents(id) ON DELETE RESTRICT,
  team_id UUID REFERENCES rescue_teams(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  target_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  target_shelter_id UUID REFERENCES shelters(id) ON DELETE SET NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'high', -- critical, high, medium, low
  status VARCHAR(50) NOT NULL DEFAULT 'assigned', -- assigned, dispatched, en_route, on_scene, completed, aborted
  objective TEXT NOT NULL,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS mission_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROAD HAZARDS & ROUTE CONDITIONS
CREATE TABLE IF NOT EXISTS road_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  road_name VARCHAR(255) NOT NULL,
  hazard_type VARCHAR(50) NOT NULL, -- flooded, debris, bridge_collapse, landslide, congested
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_passable BOOLEAN DEFAULT FALSE,
  severity VARCHAR(50) DEFAULT 'high', -- warning, impassable
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES users(id)
);

-- 11. NGOS & VOLUNTEERS
CREATE TABLE IF NOT EXISTS ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(100),
  specialties TEXT[], -- food_dist, medical_triage, psychological_support, shelter_mgmt
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT '{}', -- first_aid, boat_pilot, multilingual, heavy_equipment
  availability_status VARCHAR(50) DEFAULT 'available', -- available, deployed, inactive
  current_location_lat DOUBLE PRECISION,
  current_location_lng DOUBLE PRECISION,
  assigned_task TEXT,
  verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI RECOMMENDATIONS & DECISION LOGS
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL, -- allocation, route, evacuation, medical_divert
  suggested_payload JSONB NOT NULL,
  confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.85,
  reasoning TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, overridden
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT & TELEMETRY
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100),
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BROADCAST ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- evacuation, severe_weather, flash_flood, shelter_update
  severity VARCHAR(50) NOT NULL DEFAULT 'critical', -- info, warning, severe, critical
  affected_area TEXT NOT NULL,
  channels TEXT[] DEFAULT ARRAY['push', 'sms'],
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_lat_lng ON incidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_rescue_teams_status ON rescue_teams(status);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
