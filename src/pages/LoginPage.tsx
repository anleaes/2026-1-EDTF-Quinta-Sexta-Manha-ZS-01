import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Package, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import type { LoginFormData, SignupFormData } from "@/types";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, signInWithGoogle, isLoading } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const set = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password } as LoginFormData);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("As senhas não coincidem.");
          return;
        }
        await signup(formData as SignupFormData);
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar.");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao autenticar com Google.");
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar para home
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Prateleira</h1>
            <p className="text-blue-100 text-sm">{isLogin ? "Acesse sua conta" : "Crie sua conta grátis"}</p>
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className="flex gap-1 mb-7 bg-gray-100 rounded-lg p-1">
              {["Login", "Cadastro"].map((tab, i) => (
                <button key={tab} onClick={() => setIsLogin(i === 0)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    isLogin === (i === 0) ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" required={!isLogin} value={formData.name} onChange={(e) => set("name", e.target.value)}
                      placeholder="Seu nome completo" className={inputClass} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required value={formData.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="seu@email.com" className={inputClass} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Senha</label>
                  {isLogin && (
                    <button type="button" onClick={() => navigate("/forgot-password")}
                      className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} required value={formData.password}
                    onChange={(e) => set("password", e.target.value)} placeholder="••••••••" minLength={6} className={inputClass} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} required={!isLogin} value={formData.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)} placeholder="••••••••" minLength={6} className={inputClass} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60 mt-2">
                {isLoading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-muted-foreground">ou continue com</span></div>
            </div>

            <button type="button" onClick={handleGoogle} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-60">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium text-foreground">Continuar com Google</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {isLogin ? "Novo por aqui? " : "Já tem conta? "}
          <button onClick={() => setIsLogin((v) => !v)} className="text-primary font-semibold hover:underline">
            {isLogin ? "Crie sua conta grátis" : "Faça login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
