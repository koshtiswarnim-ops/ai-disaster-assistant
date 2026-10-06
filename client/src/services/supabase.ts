// DisasterOS Client Supabase Cloud Database & Auth Integration
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('disasteros_supabase_url') || '';
  const localKey = localStorage.getItem('disasteros_supabase_anon_key') || '';

  const url = (localUrl || envUrl).trim();
  const anonKey = (localKey || envKey).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.includes('http'))
  };
}

export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: window.localStorage
        }
      });
    } catch (err) {
      console.warn('[Supabase Client] Failed to initialize:', err);
      return null;
    }
  }
  return supabaseClient;
}

export function configureSupabase(url: string, anonKey: string): void {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  localStorage.setItem('disasteros_supabase_url', cleanUrl);
  localStorage.setItem('disasteros_supabase_anon_key', cleanKey);
  supabaseClient = null; // force re-instantiation

  // Forward to server asynchronously to keep backend in sync
  fetch('/api/supabase/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: cleanUrl, key: cleanKey })
  }).catch(err => console.warn('[Supabase Config Auto-Push Error]:', err));
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem('disasteros_supabase_url');
  localStorage.removeItem('disasteros_supabase_anon_key');
  supabaseClient = null;
}

// Direct browser-to-Supabase upsert for instant guarantees
export async function syncIncidentDirectly(incident: any): Promise<{ success: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) {
    return { success: false, error: 'Supabase client not configured in browser' };
  }

  try {
    const payload: any = {
      tracking_code: incident.tracking_code,
      type: incident.type,
      title: incident.title,
      description: incident.description,
      latitude: Number(incident.latitude) || 37.7749,
      longitude: Number(incident.longitude) || -122.4194,
      address: incident.address || 'Reported Location',
      status: incident.status || 'submitted',
      severity: incident.severity || 'high',
      priority_score: Number(incident.priority_score) || 70,
      affected_count: Number(incident.affected_count) || 1,
      injured_count: Number(incident.injured_count) || 0,
      trapped_count: Number(incident.trapped_count) || 0,
      has_children_elderly: Boolean(incident.has_children_elderly),
      medical_urgency: Boolean(incident.medical_urgency)
    };

    const isUuid = typeof incident.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(incident.id);
    if (isUuid) {
      payload.id = incident.id;
    }

    let { error } = await sb.from('incidents').upsert(payload, { onConflict: 'tracking_code' });
    
    if (error) {
      if (error.message?.includes('type uuid')) {
        delete payload.id;
        const retry = await sb.from('incidents').upsert(payload, { onConflict: 'tracking_code' });
        if (retry.error) {
          console.warn('[Direct Supabase SOS Insert Retry Failed]', retry.error.message);
          return { success: false, error: retry.error.message };
        }
        return { success: true };
      }
      console.warn('[Direct Supabase SOS Insert Failed]', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Direct Supabase SOS Insert Success]', incident.tracking_code);
    return { success: true };
  } catch (err: any) {
    console.error('[Direct Supabase SOS Insert Exception]', err);
    return { success: false, error: err.message };
  }
}

export async function testSupabaseConnection(customUrl?: string, customKey?: string) {
  const cfg = getSupabaseConfig();
  const url = customUrl || cfg.url;
  const key = customKey || cfg.anonKey;

  if (!url || !key) {
    return {
      connected: false,
      configured: false,
      message: 'Supabase URL or Anon Key is missing.'
    };
  }

  const startTime = Date.now();
  try {
    const testClient = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await testClient.from('incidents').select('count', { count: 'exact', head: true });
    
    const latencyMs = Date.now() - startTime;
    if (error && error.code !== 'PGRST116') {
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return {
          connected: true,
          configured: true,
          tablesCreated: false,
          latencyMs,
          message: 'Connected to Supabase! Run schema.sql in Supabase SQL editor to create tables.'
        };
      }
      return {
        connected: false,
        configured: true,
        latencyMs,
        message: `Supabase returned: ${error.message}`
      };
    }

    return {
      connected: true,
      configured: true,
      tablesCreated: true,
      latencyMs,
      message: `Connected to Supabase PostgreSQL (${latencyMs}ms latency)`
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      latencyMs: Date.now() - startTime,
      message: `Connection failed: ${err.message}`
    };
  }
}

// Supabase Realtime Channels Subscription Helper
export function subscribeToSupabaseIncidents(onEvent: (payload: any) => void) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel('public:incidents_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, (payload) => {
      onEvent(payload);
    })
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

// Supabase Auth Helpers
export const supabaseAuth = {
  async signUp(email: string, password: string, metadata: { full_name: string; role: string; organization?: string }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase is not configured.');
    return sb.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  },

  async signIn(email: string, password: string) {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase is not configured.');
    return sb.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    const sb = getSupabase();
    if (!sb) return;
    return sb.auth.signOut();
  },

  async getSession() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  async getUser() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getUser();
    return data.user;
  }
};
