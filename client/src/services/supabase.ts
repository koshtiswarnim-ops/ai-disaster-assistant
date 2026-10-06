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
  localStorage.setItem('disasteros_supabase_url', url.trim());
  localStorage.setItem('disasteros_supabase_anon_key', anonKey.trim());
  supabaseClient = null; // force re-instantiation
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem('disasteros_supabase_url');
  localStorage.removeItem('disasteros_supabase_anon_key');
  supabaseClient = null;
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
