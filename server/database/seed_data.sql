-- =============================================================================
-- DISASTEROS SUPABASE SEED DATA
-- Insert initial realistic disaster response operational dataset
-- =============================================================================

-- 1. Disasters
INSERT INTO disasters (id, title, type, severity, status, epicenter_lat, epicenter_lng, radius_km, metadata)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Storm Zephyr & Coastal Flash Flooding', 'flood', 'critical', 'active', 37.7749, -122.4194, 35.0, '{"description": "Category 3 atmospheric river storm with severe storm surges and localized landslides."}'::jsonb),
  ('c0000000-0000-0000-0000-000000000002', 'Seismic Tremor & Structural Distress Zone', 'earthquake', 'medium', 'monitoring', 37.8044, -122.2712, 18.0, '{"description": "Magnitude 4.8 seismic tremor with minor aftershocks affecting older commercial buildings."}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 2. Warehouses
INSERT INTO warehouses (id, name, code, latitude, longitude, address, contact_person, phone, status)
VALUES
  ('w0000000-0000-0000-0000-000000000001', 'Central Logistics Depot & Supply Hub', 'WH-MAIN-01', 37.7650, -122.4050, '1200 16th Street, Potrero Hill', 'Elena Rostova', '+1-415-555-0144', 'open'),
  ('w0000000-0000-0000-0000-000000000002', 'North Harbor Emergency Auxiliary Reserve', 'WH-NORTH-02', 37.8050, -122.4150, 'Pier 39 Logistics Warehouse', 'Marcus Brody', '+1-415-555-0177', 'open'),
  ('w0000000-0000-0000-0000-000000000003', 'Sunset District Community Cache', 'WH-WEST-03', 37.7500, -122.4800, '2400 Irving Street', 'Clara Hughes', '+1-415-555-0199', 'open')
ON CONFLICT (id) DO NOTHING;

-- 3. Inventory
INSERT INTO inventory (id, warehouse_id, category, item_name, unit, quantity_available, quantity_reserved, minimum_threshold, status)
VALUES
  ('i0000000-0000-0000-0000-000000000001', 'w0000000-0000-0000-0000-000000000001', 'water', 'Potable Drinking Water (5 Gallon Jugs)', 'jugs', 450, 50, 100, 'healthy'),
  ('i0000000-0000-0000-0000-000000000002', 'w0000000-0000-0000-0000-000000000001', 'medical', 'Tactical Trauma First-Aid Response Packs', 'kits', 20, 10, 30, 'critical'),
  ('i0000000-0000-0000-0000-000000000003', 'w0000000-0000-0000-0000-000000000001', 'food', 'Ready-to-Eat Emergency Meals (MREs)', 'cases', 800, 200, 250, 'healthy'),
  ('i0000000-0000-0000-0000-000000000004', 'w0000000-0000-0000-0000-000000000001', 'rescue_gear', 'Submersible Flood De-Watering Pumps', 'units', 12, 4, 15, 'low')
ON CONFLICT (id) DO NOTHING;

-- 4. Rescue Teams
INSERT INTO rescue_teams (id, team_code, name, lead_name, phone, current_lat, current_lng, status, skills, capacity)
VALUES
  ('r0000000-0000-0000-0000-000000000001', 'RT-SWIFT-01', 'Swiftwater Taskforce Alpha', 'Capt. Sarah Jenkins', '+1-415-555-0101', 37.7780, -122.4250, 'available', ARRAY['swiftwater_rescue', 'boat_operation', 'paramedic'], 6),
  ('r0000000-0000-0000-0000-000000000002', 'RT-USAR-02', 'Urban Search & Collapse Squad 4', 'Lt. Carlos Mendez', '+1-415-555-0102', 37.7600, -122.4100, 'on_scene', ARRAY['structural_collapse', 'heavy_extraction', 'canine_search'], 8),
  ('r0000000-0000-0000-0000-000000000003', 'RT-MED-03', 'Tactical Triage Unit Echo', 'Dr. Rachel Kim', '+1-415-555-0103', 37.7850, -122.4080, 'available', ARRAY['triage', 'advanced_life_support', 'pediatric_care'], 5)
ON CONFLICT (id) DO NOTHING;

-- 5. Hospitals
INSERT INTO hospitals (id, name, latitude, longitude, address, phone, total_beds, available_beds, icu_total, icu_available, trauma_level, has_helipad, status)
VALUES
  ('h0000000-0000-0000-0000-000000000001', 'Metropolitan Trauma & Surgical Center', 37.7820, -122.4080, '1001 Potrero Ave', '+1-415-206-8000', 450, 48, 60, 6, 1, true, 'open'),
  ('h0000000-0000-0000-0000-000000000002', 'St. Jude Emergency Medical Center', 37.7650, -122.4350, '350 Parnassus Ave', '+1-415-353-1000', 320, 18, 45, 2, 2, true, 'open'),
  ('h0000000-0000-0000-0000-000000000003', 'Bayview Community Memorial Hospital', 37.7320, -122.3920, '1301 Third Street', '+1-415-821-5000', 180, 5, 20, 0, 3, false, 'diverted')
ON CONFLICT (id) DO NOTHING;

-- 6. Shelters
INSERT INTO shelters (id, name, latitude, longitude, address, capacity, current_occupancy, food_supplies_days, water_supplies_days, medical_staff_present, pet_friendly, status)
VALUES
  ('s0000000-0000-0000-0000-000000000001', 'Civic Auditorium Evacuation Center', 37.7785, -122.4175, '99 Grove Street', 600, 320, 8, 10, true, true, 'open'),
  ('s0000000-0000-0000-0000-000000000002', 'Marina Middle School Gymnasium Safe Haven', 37.8010, -122.4380, '3500 Fillmore Street', 350, 310, 4, 5, true, false, 'open'),
  ('s0000000-0000-0000-0000-000000000003', 'Presidio YMCA Emergency Safe Refuge', 37.7990, -122.4590, '63 Funston Ave', 250, 85, 12, 14, true, true, 'open')
ON CONFLICT (id) DO NOTHING;
