// ============================================================
// AUTH SERVICE
// Camada de serviço para autenticação
// TODO: Substituir cada função pelo Supabase Auth equivalente
// ============================================================

import type { UserProfile, LoginFormData, SignupFormData } from "@/types";

const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

// Usuário simulado
const MOCK_USER: UserProfile = {
  id: "usr_001",
  name: "Admin",
  email: "admin@prateleira.com",
  role: "admin",
  storeName: "Mini Mercado Central",
};

/** Realiza login com email e senha
 * @supabase supabase.auth.signInWithPassword({ email, password })
 */
export async function login(data: LoginFormData): Promise<UserProfile> {
  await delay();

  // Simulação: qualquer email/senha válidos fazem login
  if (!data.email || !data.password) {
    throw new Error("E-mail e senha são obrigatórios.");
  }

  return { ...MOCK_USER, email: data.email };
}

/** Realiza cadastro de novo usuário
 * @supabase supabase.auth.signUp({ email, password, options: { data: { name } } })
 */
export async function signup(data: SignupFormData): Promise<UserProfile> {
  await delay();

  if (data.password !== data.confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  return {
    ...MOCK_USER,
    name: data.name,
    email: data.email,
  };
}

/** Realiza logout
 * @supabase supabase.auth.signOut()
 */
export async function logout(): Promise<void> {
  await delay(300);
  // Supabase limpa sessão automaticamente
}

/** Envia e-mail de recuperação de senha
 * @supabase supabase.auth.resetPasswordForEmail(email, { redirectTo })
 */
export async function forgotPassword(email: string): Promise<void> {
  await delay();
  if (!email) throw new Error("E-mail é obrigatório.");
  // Supabase enviará o e-mail automaticamente
}

/** Autentica com Google OAuth
 * @supabase supabase.auth.signInWithOAuth({ provider: 'google' })
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  await delay(1500);
  return MOCK_USER;
}

/** Verifica sessão existente
 * @supabase supabase.auth.getSession()
 */
export async function getSession(): Promise<UserProfile | null> {
  await delay(200);
  // TODO: Verificar token de sessão real
  return null;
}

/** Atualiza perfil do usuário
 * @supabase supabase.from('profiles').update(data).eq('id', userId)
 */
export async function updateProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  await delay();
  return { ...MOCK_USER, ...data, id: userId };
}
