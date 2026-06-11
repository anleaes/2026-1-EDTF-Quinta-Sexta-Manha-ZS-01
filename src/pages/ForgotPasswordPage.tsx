import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Package, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Informe seu e-mail."); return; }
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar e-mail.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para login
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-primary text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Recuperar Senha</h1>
            <p className="text-blue-100 text-sm">Enviaremos um link para redefinir sua senha</p>
          </div>

          <div className="p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">E-mail enviado!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verifique a caixa de entrada de <strong>{email}</strong> e siga as instruções para redefinir sua senha.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors mt-4"
                >
                  Voltar ao Login
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Informe o e-mail cadastrado na sua conta. Você receberá um link para criar uma nova senha.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60"
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
