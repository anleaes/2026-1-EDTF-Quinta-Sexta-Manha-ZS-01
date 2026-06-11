// ============================================================
// SUPABASE CLIENT
// Configure as variáveis de ambiente e descomente para ativar
// ============================================================
//
// COMO ATIVAR:
// 1. Instale: pnpm add @supabase/supabase-js
// 2. Crie .env.local com:
//    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
//    VITE_SUPABASE_ANON_KEY=sua-chave-anonima
// 3. Descomente o código abaixo
// 4. Substitua as funções dos services/ pelas chamadas do Supabase
//
// ============================================================

// import { createClient } from '@supabase/supabase-js'
// import type { Database } from './types'
//
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
//
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables')
// }
//
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true,
//   },
// })
//
// export default supabase

export const SUPABASE_READY = false; // Alterar para true após configurar
