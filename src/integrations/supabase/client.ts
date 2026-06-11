import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

// Verifica se os valores são os placeholders padrões ou estão vazios
const isPlaceholder = (val?: string) => {
  return !val || val.includes('seu-projeto') || val.includes('sua-chave-anonima') || val === '';
};

export const SUPABASE_READY = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

export const isDemoSession = (): boolean => {
  return localStorage.getItem("prateleira_demo") === "true";
};

export const supabase = createClient<Database>(
  SUPABASE_READY ? supabaseUrl! : 'https://placeholder.supabase.co',
  SUPABASE_READY ? supabaseAnonKey! : 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export default supabase;
