import { useState } from "react";
import { motion } from "motion/react";
import { Package, Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de envio de e-mail
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 text-white p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">E-mail Enviado!</h1>
              <p className="text-green-100">
                Verifique sua caixa de entrada
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-foreground mb-4">
                  Enviamos um link de recuperação de senha para:
                </p>
                <p className="font-semibold text-primary bg-accent/50 px-4 py-2 rounded-lg inline-block">
                  {email}
                </p>
              </div>

              <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-accent-foreground font-medium">
                  Próximos passos:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Verifique sua caixa de entrada e pasta de spam</li>
                  <li>Clique no link de recuperação no e-mail</li>
                  <li>Crie uma nova senha segura</li>
                  <li>Faça login com sua nova senha</li>
                </ol>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onBack}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium"
                >
                  Voltar para Login
                </button>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full border border-border py-3 rounded-lg hover:bg-gray-50 transition-colors text-foreground"
                >
                  Reenviar E-mail
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6">
                Não recebeu o e-mail? Verifique se o endereço está correto ou entre em contato com o suporte.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Package className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Esqueceu a Senha?</h1>
            <p className="text-blue-100">
              Sem problemas! Vamos ajudar você a recuperá-la
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <p className="text-muted-foreground text-center mb-6">
              Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium"
              >
                Enviar Link de Recuperação
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 bg-accent/30 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-accent-foreground">
                    O link de recuperação será válido por 24 horas e só pode ser usado uma vez.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{" "}
                <button
                  onClick={onBack}
                  className="text-primary font-medium hover:underline"
                >
                  Voltar para login
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <button
                  onClick={onBack}
                  className="text-primary font-medium hover:underline"
                >
                  Cadastre-se grátis
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Problemas para recuperar sua conta?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Entre em contato com o suporte
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
