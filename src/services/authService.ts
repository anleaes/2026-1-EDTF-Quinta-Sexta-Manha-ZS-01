import { supabase, SUPABASE_READY } from "@/integrations/supabase/client";
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
  if (SUPABASE_READY) {
    const { data: authData, error } = await (supabase as any).auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    if (!authData.user) throw new Error("Usuário não encontrado.");

    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return {
        id: authData.user.id,
        name: authData.user.user_metadata?.name || "Usuário",
        email: authData.user.email || "",
        role: "viewer",
        storeName: "",
      };
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatarUrl: profile.avatar_url || undefined,
      storeName: profile.store_name || undefined,
      createdAt: profile.created_at,
    };
  }

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
  if (data.password !== data.confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  if (SUPABASE_READY) {
    const { data: authData, error } = await (supabase as any).auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });
    if (error) throw error;
    if (!authData.user) throw new Error("Falha no cadastro.");

    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    return {
      id: authData.user.id,
      name: profile?.name || data.name,
      email: authData.user.email || data.email,
      role: (profile?.role as any) || "viewer",
      avatarUrl: profile?.avatar_url || undefined,
      storeName: profile?.store_name || undefined,
      createdAt: profile?.created_at || new Date().toISOString(),
    };
  }

  await delay();

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
  if (SUPABASE_READY) {
    const { error } = await (supabase as any).auth.signOut();
    if (error) throw error;
    return;
  }
  await delay(300);
}

/** Envia e-mail de recuperação de senha
 * @supabase supabase.auth.resetPasswordForEmail(email, { redirectTo })
 */
export async function forgotPassword(email: string): Promise<void> {
  if (SUPABASE_READY) {
    const { error } = await (supabase as any).auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return;
  }
  await delay();
  if (!email) throw new Error("E-mail é obrigatório.");
}

/** Autentica com Google OAuth
 * @supabase supabase.auth.signInWithOAuth({ provider: 'google' })
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  if (SUPABASE_READY) {
    const { error } = await (supabase as any).auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    if (error) throw error;
    return MOCK_USER;
  }
  await delay(1500);
  return MOCK_USER;
}

/** Verifica sessão existente
 * @supabase supabase.auth.getSession()
 */
export async function getSession(): Promise<UserProfile | null> {
  if (SUPABASE_READY) {
    const { data: { session }, error } = await (supabase as any).auth.getSession();
    if (error || !session) return null;

    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (!profile) {
      return {
        id: session.user.id,
        name: session.user.user_metadata?.name || "Usuário",
        email: session.user.email || "",
        role: "viewer",
        storeName: "",
      };
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatarUrl: profile.avatar_url || undefined,
      storeName: profile.store_name || undefined,
      createdAt: profile.created_at,
    };
  }
  await delay(200);
  return null;
}

/** Atualiza perfil do usuário
 * @supabase supabase.from('profiles').update(data).eq('id', userId)
 */
export async function updateProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  if (SUPABASE_READY) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.storeName !== undefined) updateData.store_name = data.storeName;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.role !== undefined) updateData.role = data.role;

    const { data: profile, error } = await (supabase as any)
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatarUrl: profile.avatar_url || undefined,
      storeName: profile.store_name || undefined,
      createdAt: profile.created_at,
    };
  }
  await delay();
  return { ...MOCK_USER, ...data, id: userId };
}
