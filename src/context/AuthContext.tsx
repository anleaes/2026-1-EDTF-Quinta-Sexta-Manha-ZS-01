import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, UserProfile, LoginFormData, SignupFormData } from "@/types";
import * as authService from "@/services/authService";

// ── Tipos do contexto ──────────────────────────────────────
interface AuthContextType extends AuthState {
  isInitializing: boolean;
  login: (data: LoginFormData) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
}

// ── Contexto ────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // isInitializing: true enquanto verifica sessão existente no mount
  const [isInitializing, setIsInitializing] = useState(true);

  // ── Verificar sessão existente ao carregar o app ──────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function init() {
      try {
        // 1. Verificar sessão atual (JWT salvo no localStorage pelo Supabase)
        const existingUser = await authService.getSession();
        setUser(existingUser);
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }

      // 2. Escutar mudanças de autenticação (OAuth redirect, logout em outra aba, etc.)
      unsubscribe = authService.subscribeToAuthChanges((updatedUser) => {
        setUser(updatedUser);
      });
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // ── Operações de auth ─────────────────────────────────────
  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const profile = await authService.login(data);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await authService.loginDemo();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const profile = await authService.signup(data);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      // OAuth redireciona o browser — onAuthStateChange vai capturar o retorno
      await authService.signInWithGoogle();
    } catch {
      setIsLoading(false);
    }
    // Não fazer setIsLoading(false) aqui pois haverá redirect de página
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        isInitializing,
        login,
        loginAsDemo,
        signup,
        logout,
        signInWithGoogle,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext deve ser usado dentro de <AuthProvider>");
  return ctx;
}
