// DisasterOS Supabase Integration Client & Synchronization Service
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

dotenv.config();

let supabaseInstance = null;

const DISASTEROS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

let runtimeConfig = {
  url: process.env.SUPABASE_URL || '',
  key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
};

export function isUuid(val) {
  return typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export function toDeterministicUuid(val) {
  if (!val) return null;
  if (isUuid(val)) return val;
  return uuidv5(String(val), DISASTEROS_NAMESPACE);
}

export function ensureValidUuid(val) {
  if (!val) return uuidv4();
  if (isUuid(val)) return val;
  return toDeterministicUuid(val);
}

export function setRuntimeSupabaseConfig(url, key) {
  if (!url || !key) return;
  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  runtimeConfig.url = cleanUrl;
  runtimeConfig.key = cleanKey;
  process.env.SUPABASE_URL = cleanUrl;
  process.env.SUPABASE_ANON_KEY = cleanKey;

  // Re-instantiate client
  try {
    supabaseInstance = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log(`[Supabase] Client re-initialized for project: ${cleanUrl.slice(0, 30)}...`);
  } catch (err) {
    console.warn('[Supabase] Failed to instantiate runtime client:', err.message);
  }

  // Persist to .env file
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('SUPABASE_URL=')) {
      envContent = envContent.replace(/SUPABASE_URL=.*/g, `SUPABASE_URL=${cleanUrl}`);
    } else {
      envContent += `\nSUPABASE_URL=${cleanUrl}`;
    }

    if (envContent.includes('SUPABASE_ANON_KEY=')) {
      envContent = envContent.replace(/SUPABASE_ANON_KEY=.*/g, `SUPABASE_ANON_KEY=${cleanKey}`);
    } else {
      envContent += `\nSUPABASE_ANON_KEY=${cleanKey}`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('[Supabase] Credentials successfully persisted to server/.env');
  } catch (err) {
    console.warn('[Supabase] Could not persist credentials to .env:', err.message);
  }
}

export function getSupabaseConfig() {
  const url = runtimeConfig.url || process.env.SUPABASE_URL || '';
  const key = runtimeConfig.key || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
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
  const cfg = getSupabaseConfig();
  const url = customUrl || cfg.url;
  const key = customKey || cfg.key;

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

// Sync single entity to Supabase with automatic schema error resilience
export async function syncEntityToSupabase(table, entity) {
  const client = getSupabaseClient();
  if (!client) {
    console.log(`[Supabase Async Sync] Skipped (${table}): Supabase client not configured`);
    return { success: false, reason: 'Supabase client not configured' };
  }

  try {
    const payload = { ...entity };
    
    // Ensure ID conforms to UUID if required, or keep tracking_code
    if (payload.id && !isUuid(payload.id)) {
      payload.id = ensureValidUuid(payload.id);
    }

    let { data, error } = await client.from(table).upsert(payload, {
      onConflict: table === 'incidents' ? 'tracking_code' : 'id'
    });

    if (error) {
      // If error is UUID type mismatch, omit ID so Postgres generates it with gen_random_uuid()
      if (error.message && error.message.includes('type uuid')) {
        console.warn(`[Supabase Sync] UUID type mismatch on ${table}. Retrying without custom ID...`);
        delete payload.id;
        const retry = await client.from(table).upsert(payload, {
          onConflict: table === 'incidents' ? 'tracking_code' : undefined
        });
        if (retry.error) {
          console.error(`[Supabase Sync] Retry error on ${table}:`, retry.error.message);
          return { success: false, error: retry.error.message };
        }
        console.log(`[Supabase Sync] Successfully mirrored to ${table} on retry`);
        return { success: true, table, retried: true };
      }

      console.error(`[Supabase Sync] Failed to sync ${table}:`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase Sync] Successfully mirrored record to ${table} (${payload.tracking_code || payload.id})`);
    return { success: true, table };
  } catch (err) {
    console.error(`[Supabase Async Sync] Exception syncing ${table}:`, err.message);
    return { success: false, error: err.message };
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
          id: toDeterministicUuid(d.id),
          title: d.title,
          type: d.type,
          severity: d.severity,
          status: d.status,
          epicenter_lat: Number(d.epicenter_lat),
          epicenter_lng: Number(d.epicenter_lng),
          radius_km: Number(d.radius_km) || 25,
          declared_at: d.declared_at || new Date().toISOString(),
          metadata: { description: d.description, weather_summary: d.weather_summary }
        })),
        { onConflict: 'id' }
      );
      results.disasters = error ? `Error: ${error.message}` : `${store.disasters.length} synced`;
    }

    // 2. Sync Incidents
    if (store.incidents?.length) {
      const { error } = await client.from('incidents').upsert(
        store.incidents.map(i => ({
          id: ensureValidUuid(i.id),
          tracking_code: i.tracking_code,
          type: i.type,
          title: i.title,
          description: i.description,
          latitude: Number(i.latitude),
          longitude: Number(i.longitude),
          address: i.address,
          status: i.status,
          severity: i.severity,
          priority_score: Number(i.priority_score),
          affected_count: Number(i.affected_count) || 1,
          injured_count: Number(i.injured_count) || 0,
          trapped_count: Number(i.trapped_count) || 0,
          has_children_elderly: Boolean(i.has_children_elderly),
          medical_urgency: Boolean(i.medical_urgency)
        })),
        { onConflict: 'tracking_code' }
      );
      results.incidents = error ? `Error: ${error.message}` : `${store.incidents.length} synced`;
    }

    // 3. Sync Rescue Teams
    if (store.rescueTeams?.length) {
      const { error } = await client.from('rescue_teams').upsert(
        store.rescueTeams.map(t => ({
          id: toDeterministicUuid(t.id),
          team_code: t.team_code,
          name: t.name,
          lead_name: t.lead_name,
          phone: t.phone,
          current_lat: Number(t.current_lat),
          current_lng: Number(t.current_lng),
          status: t.status,
          skills: t.skills || [],
          capacity: Number(t.capacity) || 4
        })),
        { onConflict: 'team_code' }
      );
      results.rescue_teams = error ? `Error: ${error.message}` : `${store.rescueTeams.length} synced`;
    }

    // 4. Sync Hospitals
    if (store.hospitals?.length) {
      const { error } = await client.from('hospitals').upsert(
        store.hospitals.map(h => ({
          id: toDeterministicUuid(h.id),
          name: h.name,
          latitude: Number(h.latitude),
          longitude: Number(h.longitude),
          address: h.address,
          phone: h.phone,
          total_beds: Number(h.total_beds),
          available_beds: Number(h.available_beds),
          icu_total: Number(h.icu_total),
          icu_available: Number(h.icu_available),
          trauma_level: Number(h.trauma_level) || 1,
          has_helipad: Boolean(h.has_helipad),
          status: h.status
        })),
        { onConflict: 'id' }
      );
      results.hospitals = error ? `Error: ${error.message}` : `${store.hospitals.length} synced`;
    }

    // 5. Sync Shelters
    if (store.shelters?.length) {
      const { error } = await client.from('shelters').upsert(
        store.shelters.map(s => ({
          id: toDeterministicUuid(s.id),
          name: s.name,
          latitude: Number(s.latitude),
          longitude: Number(s.longitude),
          address: s.address,
          capacity: Number(s.capacity),
          current_occupancy: Number(s.current_occupancy) || 0,
          food_supplies_days: Number(s.food_supplies_days) || 7,
          water_supplies_days: Number(s.water_supplies_days) || 7,
          medical_staff_present: Boolean(s.medical_staff_present),
          pet_friendly: Boolean(s.pet_friendly),
          status: s.status
        })),
        { onConflict: 'id' }
      );
      results.shelters = error ? `Error: ${error.message}` : `${store.shelters.length} synced`;
    }

    // 6. Sync Warehouses & Inventory
    if (store.warehouses?.length) {
      const { error } = await client.from('warehouses').upsert(
        store.warehouses.map(w => ({
          id: toDeterministicUuid(w.id),
          name: w.name,
          code: w.code,
          latitude: Number(w.latitude),
          longitude: Number(w.longitude),
          address: w.address,
          contact_person: w.contact_person,
          phone: w.phone,
          status: w.status
        })),
        { onConflict: 'code' }
      );
      results.warehouses = error ? `Error: ${error.message}` : `${store.warehouses.length} synced`;
    }

    // 7. Sync Missions
    if (store.missions?.length) {
      const { error } = await client.from('missions').upsert(
        store.missions.map(m => ({
          id: toDeterministicUuid(m.id),
          mission_code: m.mission_code,
          incident_id: isUuid(m.incident_id) ? m.incident_id : null,
          team_id: m.team_id ? toDeterministicUuid(m.team_id) : null,
          priority: m.priority || 'high',
          status: m.status || 'assigned',
          objective: m.objective,
          assigned_at: m.assigned_at || new Date().toISOString()
        })),
        { onConflict: 'mission_code' }
      );
      results.missions = error ? `Error: ${error.message}` : `${store.missions.length} synced`;
    }

    const anyErrors = Object.values(results).some(r => typeof r === 'string' && r.startsWith('Error:'));
    return { 
      success: !anyErrors, 
      results, 
      message: anyErrors 
        ? 'Some tables were blocked by Supabase RLS. Disable RLS or run policies to enable public sync.' 
        : 'All 7 tables successfully synchronized with Supabase PostgreSQL!' 
    };
  } catch (err) {
    return { success: false, error: err.message, results };
  }
}
