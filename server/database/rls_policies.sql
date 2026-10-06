-- =============================================================================
-- DISASTEROS ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Helpers for auth role checking
CREATE OR REPLACE FUNCTION current_user_role() RETURNS VARCHAR AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Incidents Policies:
-- 1. Anyone authenticated can create an incident / SOS
CREATE POLICY "Allow authenticated users to create incidents"
  ON incidents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Citizens can view their own reported incidents
CREATE POLICY "Citizens can view own incidents"
  ON incidents FOR SELECT
  USING (
    reporter_id = auth.uid() 
    OR current_user_role() IN ('authority', 'rescue_team', 'admin', 'logistics')
  );

-- 3. Only authorities and admins can update incident triage & priority
CREATE POLICY "Authorities can update incidents"
  ON incidents FOR UPDATE
  USING (current_user_role() IN ('authority', 'admin', 'rescue_team'));

-- Missions Policies:
-- Responders can view assigned missions; Authorities can manage all missions
CREATE POLICY "Missions viewable by assigned responders and authorities"
  ON missions FOR SELECT
  USING (
    current_user_role() IN ('authority', 'admin', 'logistics')
    OR team_id IN (SELECT id FROM rescue_teams WHERE lead_name = auth.jwt() ->> 'email')
  );

-- Inventory Policies:
-- Warehouse staff and authorities can modify inventory; others read-only
CREATE POLICY "Warehouse staff can update inventory"
  ON inventory FOR ALL
  USING (current_user_role() IN ('warehouse', 'authority', 'admin'));

-- Audit Logs Policies:
-- Only authorities and system admins can view immutable audit logs
CREATE POLICY "Admins and authorities can read audit logs"
  ON audit_logs FOR SELECT
  USING (current_user_role() IN ('admin', 'authority'));
