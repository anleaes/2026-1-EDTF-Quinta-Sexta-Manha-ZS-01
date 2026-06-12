import { supabase, SUPABASE_READY, isDemoSession } from "@/integrations/supabase/client";
import type { UserProfile, LoginFormData, SignupFormData } from "@/types";

// Usuário simulado para modo sem Supabase
const MOCK_USER: UserProfile = {
  id: "usr_001",
  name: "Admin",
  email: "admin@prateleira.com",
  role: "admin",
  storeName: "Mini Mercado Central",
};

// Converte dados do banco de profiles para UserProfile
function mapProfile(authUser: any, profile: any): UserProfile {
  return {
    id: authUser.id,
    name: profile?.name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Usuário",
    email: authUser.email || profile?.email || "",
    role: (profile?.role as any) || "viewer",
    avatarUrl: profile?.avatar_url || authUser.user_metadata?.avatar_url || undefined,
    storeName: profile?.store_name || undefined,
    createdAt: profile?.created_at || new Date().toISOString(),
  };
}

// Busca o perfil estendido de um usuário autenticado
async function fetchProfile(userId: string): Promise<any | null> {
  const { data } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

/** Realiza login com email e senha */
export async function login(data: LoginFormData): Promise<UserProfile> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { data: authData, error } = await (supabase as any).auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    if (!authData.user) throw new Error("Usuário não encontrado.");

    const profile = await fetchProfile(authData.user.id);
    return mapProfile(authData.user, profile);
  }

  // Fallback mock
  await new Promise((r) => setTimeout(r, 600));
  if (!data.email || !data.password) throw new Error("E-mail e senha são obrigatórios.");
  return { ...MOCK_USER, email: data.email };
}

/** Realiza login em modo de demonstração */
export async function loginDemo(): Promise<UserProfile> {
  localStorage.setItem("prateleira_demo", "true");
  await new Promise((r) => setTimeout(r, 400));
  return {
    id: "usr_demo",
    name: "Usuário de Demonstração",
    email: "demo@prateleira.com",
    role: "admin",
    storeName: "Supermercado Demo S.A.",
  };
}

/** Realiza cadastro de novo usuário */
export async function signup(data: SignupFormData): Promise<UserProfile> {
  if (data.password !== data.confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  if (SUPABASE_READY && !isDemoSession()) {
    const { data: authData, error } = await (supabase as any).auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });
    if (error) throw error;
    if (!authData.user) throw new Error("Falha no cadastro.");

    // Após signUp com confirmação de email, o usuário ainda não tem sessão ativa
    // Retornar objeto com os dados básicos
    const profile = await fetchProfile(authData.user.id);
    return mapProfile(authData.user, profile);
  }

  await new Promise((r) => setTimeout(r, 800));
  return { ...MOCK_USER, name: data.name, email: data.email };
}

/** Realiza logout */
export async function logout(): Promise<void> {
  const wasDemo = isDemoSession();
  localStorage.removeItem("prateleira_demo");

  if (SUPABASE_READY && !wasDemo) {
    const { error } = await (supabase as any).auth.signOut();
    if (error) throw error;
    return;
  }
  await new Promise((r) => setTimeout(r, 200));
}

/** Envia e-mail de recuperação de senha */
export async function forgotPassword(email: string): Promise<void> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { error } = await (supabase as any).auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return;
  }
  await new Promise((r) => setTimeout(r, 800));
  if (!email) throw new Error("E-mail é obrigatório.");
}

/**
 * Autentica com Google OAuth.
 * OAuth faz REDIRECT do browser — o retorno é capturado pelo onAuthStateChange.
 * Não retorna UserProfile diretamente.
 */
export async function signInWithGoogle(): Promise<void> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { error } = await (supabase as any).auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    // Após este ponto o browser será redirecionado — nenhum código executará
    return;
  }
  // Modo offline: simular como se o Google tivesse autenticado
  await new Promise((r) => setTimeout(r, 1000));
  // O caller (AuthContext) vai setar o usuário manualmente no modo mock
  throw new Error("Google OAuth requer Supabase configurado. Use email/senha no modo offline.");
}

/** Verifica sessão existente (chamado no mount do AuthContext) */
export async function getSession(): Promise<UserProfile | null> {
  // Modo demo
  if (isDemoSession()) {
    return {
      id: "usr_demo",
      name: "Usuário de Demonstração",
      email: "demo@prateleira.com",
      role: "admin",
      storeName: "Supermercado Demo S.A.",
    };
  }

  if (SUPABASE_READY) {
    const { data: { session }, error } = await (supabase as any).auth.getSession();
    if (error || !session) return null;

    const profile = await fetchProfile(session.user.id);
    return mapProfile(session.user, profile);
  }

  return null;
}

/**
 * Escuta mudanças de estado de autenticação (login, logout, OAuth callback, refresh de token).
 * Retorna função de unsubscribe.
 */
export function subscribeToAuthChanges(
  callback: (user: UserProfile | null) => void
): () => void {
  if (!SUPABASE_READY) return () => {};

  const { data: { subscription } } = (supabase as any).auth.onAuthStateChange(
    async (_event: string, session: any) => {
      if (!session?.user) {
        // Ignorar se for modo demo (controlado pelo localStorage)
        if (!isDemoSession()) {
          callback(null);
        }
        return;
      }

      const profile = await fetchProfile(session.user.id);
      callback(mapProfile(session.user, profile));
    }
  );

  return () => subscription.unsubscribe();
}

/** Atualiza perfil do usuário */
export async function updateProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  if (SUPABASE_READY && !isDemoSession()) {
    const updateData: Record<string, unknown> = {};
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
    return mapProfile({ id: userId, email: profile.email }, profile);
  }

  await new Promise((r) => setTimeout(r, 500));
  return { ...MOCK_USER, ...data, id: userId };
}
