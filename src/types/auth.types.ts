// ============================================================
// AUTH TYPES
// Interfaces prontas para integração com Supabase Auth
// Tabela: users / auth.users
// ============================================================

export type UserRole = "admin" | "manager" | "operator" | "viewer";

/** Perfil de usuário — espelho da tabela `profiles` no Supabase */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  storeName?: string;
  createdAt?: string;
}

/** Estado de autenticação */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Dados do formulário de login */
export interface LoginFormData {
  email: string;
  password: string;
}

/** Dados do formulário de cadastro */
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Configurações do usuário */
export interface UserSettings {
  theme: "light" | "dark" | "auto";
  language: "pt-BR" | "en-US" | "es";
  currency: "BRL" | "USD" | "EUR";
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  lowStock: boolean;
  dailySales: boolean;
  weeklyReport: boolean;
}
