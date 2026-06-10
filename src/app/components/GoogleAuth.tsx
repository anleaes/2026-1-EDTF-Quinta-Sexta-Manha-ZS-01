import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";

interface GoogleAuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function GoogleAuth({ onBack, onSuccess }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Contas Google simuladas para demonstração
  const mockAccounts = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=Joao+Silva&background=4285F4&color=fff"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=EA4335&color=fff"
    }
  ];

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setIsLoading(true);

    // Simula autenticação com Google
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const handleUseAnotherAccount = () => {
    setIsLoading(true);

    // Simula processo de login com outra conta
    setTimeout(() => {
      alert("Login com Google realizado com sucesso!");
      onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        {!isLoading && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Google Header */}
          <div className="p-8 text-center border-b border-border">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12" viewBox="0 0 48 48">
                <path
                  fill="#4285F4"
                  d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                />
                <path
                  fill="#34A853"
                  d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
                />
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.89 29.93 1 24 1 15.4 1 7.96 5.93 4.34 14.12l7.35 5.7C13.42 14.37 18.27 9.5 24 9.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-normal text-foreground mb-2">Fazer login</h1>
            <p className="text-sm text-muted-foreground">
              Use sua Conta do Google para acessar o Prateleira
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Autenticando com Google...</p>
              </div>
            ) : (
              <>
                {/* Account Selection */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Escolha uma conta
                  </p>
                  {mockAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleAccountSelect(account.id)}
                      className="w-full flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors text-left group"
                    >
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {account.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {account.email}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Use Another Account */}
                <button
                  onClick={handleUseAnotherAccount}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Usar outra conta
                  </span>
                </button>

                {/* Privacy Info */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Para continuar, o Google compartilhará seu nome, endereço de e-mail,
                    preferência de idioma e foto do perfil com o Prateleira. Antes de usar
                    este app, você pode analisar as{" "}
                    <a href="#" className="text-primary hover:underline">
                      políticas de privacidade
                    </a>{" "}
                    e os{" "}
                    <a href="#" className="text-primary hover:underline">
                      termos de serviço
                    </a>{" "}
                    do Prateleira.
                  </p>
                </div>

                {/* Language Selector */}
                <div className="mt-6 flex justify-center">
                  <select className="text-xs text-muted-foreground bg-transparent border-none cursor-pointer hover:text-foreground transition-colors">
                    <option>Português (Brasil)</option>
                    <option>English (US)</option>
                    <option>Español</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Footer Links */}
          {!isLoading && (
            <div className="px-8 py-4 bg-gray-50 border-t border-border">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">
                  Ajuda
                </a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacidade
                </a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Termos
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
