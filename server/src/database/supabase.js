// DisasterOS Supabase Integration Client & Synchronization Service
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseInstance = null;

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return {
    url: url.trim(),
    key: key.trim(),
    isConfigured: Boolean(url && key && url.includes('http'))
  };
}

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (err) {
      console.warn('[Supabase] Failed to initialize Supabase client:', err.message);
      return null;
    }
  }
  return supabaseInstance;
}

export async function testSupabaseConnection(customUrl = null, customKey = null) {
  const url = customUrl || process.env.SUPABASE_URL;
  const key = customKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      connected: false,
      configured: false,
      message: 'Supabase URL or API key is not configured.'
    };
  }

  const startTime = Date.now();
  try {
    const client = createClient(url, key, { auth: { persistSession: false } });
    
    // Test basic query to public schema or auth check
    const { data, error } = await client.from('incidents').select('count', { count: 'exact', head: true });
    
    const latencyMs = Date.now() - startTime;
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's still connected to postgres
      if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
        return {
          connected: true,
          configured: true,
          tablesCreated: false,
          latencyMs,
          message: 'Connected to Supabase project! Schema tables not yet executed. Run schema.sql in Supabase SQL editor.'
        };
      }
      return {
        connected: false,
        configured: true,
        latencyMs,
        error: error.message,
        message: `Supabase query returned error: ${error.message}`
      };
    }

    return {
      connected: true,
      configured: true,
      tablesCreated: true,
      latencyMs,
      message: `Successfully connected to Supabase PostgreSQL (${latencyMs}ms response time)`
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      latencyMs: Date.now() - startTime,
      error: err.message,
      message: `Connection failed: ${err.message}`
    };
  }
}

// Sync in-memory store records to Supabase tables
export async function syncStoreToSupabase(store) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase is not configured. Provide SUPABASE_URL and key.' };
  }

  const results = {};

  try {
    // 1. Sync Disasters
    if (store.disasters?.length) {
      const { error } = await client.from('disasters').upsert(
        store.disasters.map(d => ({
          id: d.id,
          title: d.title,
          type: d.type,
          severity: d.severity,
          status: d.status,
          epicenter_lat: d.epicenter_lat,
          epicenter_lng: d.epicenter_lng,
          radius_km: d.radius_km || 25,
          declared_at: d.declared_at || new Date().toISOString(),
          metadata: { description: d.description, weather_summary: d.weather_summary }
        }))
      );
      results.disasters = error ? `Error: ${error.message}` : `${store.disasters.length} synced`;
    }

    // 2. Sync Incidents
    if (store.incidents?.length) {
      const { error } = await client.from('incidents').upsert(
        store.incidents.map(i => ({
          id: i.id,
          tracking_code: i.tracking_code,
          type: i.type,
          title: i.title,
          description: i.description,
          latitude: i.latitude,
          longitude: i.longitude,
          address: i.address,
          status: i.status,
          severity: i.severity,
          priority_score: i.priority_score,
          affected_count: i.affected_count || 1,
          injured_count: i.injured_count || 0,
          trapped_count: i.trapped_count || 0,
          has_children_elderly: Boolean(i.has_children_elderly),
          medical_urgency: Boolean(i.medical_urgency)
        }))
      );
      results.incidents = error ? `Error: ${error.message}` : `${store.incidents.length} synced`;
    }

    // 3. Sync Rescue Teams
    if (store.rescueTeams?.length) {
      const { error } = await client.from('rescue_teams').upsert(
        store.rescueTeams.map(t => ({
          id: t.id,
          team_code: t.team_code,
          name: t.name,
          lead_name: t.lead_name,
          phone: t.phone,
          current_lat: t.current_lat,
          current_lng: t.current_lng,
          status: t.status,
          skills: t.skills || [],
          capacity: t.capacity || 4
        }))
      );
      results.rescue_teams = error ? `Error: ${error.message}` : `${store.rescueTeams.length} synced`;
    }

    // 4. Sync Hospitals
    if (store.hospitals?.length) {
      const { error } = await client.from('hospitals').upsert(
        store.hospitals.map(h => ({
          id: h.id,
          name: h.name,
          latitude: h.latitude,
          longitude: h.longitude,
          address: h.address,
          phone: h.phone,
          total_beds: h.total_beds,
          available_beds: h.available_beds,
          icu_total: h.icu_total,
          icu_available: h.icu_available,
          trauma_level: h.trauma_level,
          has_helipad: Boolean(h.has_helipad),
          status: h.status
        }))
      );
      results.hospitals = error ? `Error: ${error.message}` : `${store.hospitals.length} synced`;
    }

    // 5. Sync Shelters
    if (store.shelters?.length) {
      const { error } = await client.from('shelters').upsert(
        store.shelters.map(s => ({
          id: s.id,
          name: s.name,
          latitude: s.latitude,
          longitude: s.longitude,
          address: s.address,
          capacity: s.capacity,
          current_occupancy: s.current_occupancy,
          food_supplies_days: s.food_supplies_days,
          water_supplies_days: s.water_supplies_days,
          medical_staff_present: Boolean(s.medical_staff_present),
          pet_friendly: Boolean(s.pet_friendly),
          status: s.status
        }))
      );
      results.shelters = error ? `Error: ${error.message}` : `${store.shelters.length} synced`;
    }

    // 6. Sync Warehouses & Inventory
    if (store.warehouses?.length) {
      const { error } = await client.from('warehouses').upsert(
        store.warehouses.map(w => ({
          id: w.id,
          name: w.name,
          code: w.code,
          latitude: w.latitude,
          longitude: w.longitude,
          address: w.address,
          contact_person: w.contact_person,
          phone: w.phone,
          status: w.status
        }))
      );
      results.warehouses = error ? `Error: ${error.message}` : `${store.warehouses.length} synced`;
    }

    return { success: true, results, message: 'Sync with Supabase completed' };
  } catch (err) {
    return { success: false, error: err.message, results };
  }
}

// Background sync on mutations
export async function syncEntityToSupabase(table, entity) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from(table).upsert(entity);
  } catch (err) {
    console.warn(`[Supabase Async Sync] Failed to sync ${table}:`, err.message);
  }
}
