import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configurações para melhorar a persistência e performance
    persistSession: true,
    storageKey: 'taskflow-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Evitar verificações desnecessárias
    debug: process.env.NODE_ENV === 'development',
  },
  // Configurações gerais para melhorar performance
  global: {
    headers: {
      'X-Client-Info': 'taskflow-ai-web'
    }
  },
  // Configurações de realtime para evitar conexões desnecessárias
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cliente para operações server-side (será configurado quando tivermos a service role key)
// export const supabaseAdmin = createClient(
//   supabaseUrl,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );
