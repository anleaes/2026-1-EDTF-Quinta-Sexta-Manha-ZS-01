import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthState, UserProfile, LoginFormData, SignupFormData } from "@/types";
import * as authService from "@/services/authService";

// ── Tipos do contexto ──────────────────────────────────────
interface AuthContextType extends AuthState {
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
      const profile = await authService.signInWithGoogle();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
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
