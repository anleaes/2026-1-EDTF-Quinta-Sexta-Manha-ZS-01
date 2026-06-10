import { motion } from "motion/react";
import { Package, TrendingUp, BarChart3, Bell, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import ProductDemo from "./components/ProductDemo";
import LoginSignup from "./components/LoginSignup";
import ForgotPassword from "./components/ForgotPassword";
import GoogleAuth from "./components/GoogleAuth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "demo" | "login" | "forgot-password" | "google-auth" | "dashboard">("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (currentPage === "demo") {
    return <ProductDemo />;
  }

  if (currentPage === "login") {
    return (
      <LoginSignup
        onBack={() => setCurrentPage("home")}
        onForgotPassword={() => setCurrentPage("forgot-password")}
        onGoogleAuth={() => setCurrentPage("google-auth")}
      />
    );
  }

  if (currentPage === "forgot-password") {
    return <ForgotPassword onBack={() => setCurrentPage("login")} />;
  }

  if (currentPage === "google-auth") {
    return (
      <GoogleAuth
        onBack={() => setCurrentPage("login")}
        onSuccess={() => {
          setIsAuthenticated(true);
          setCurrentPage("dashboard");
        }}
      />
    );
  }

  if (currentPage === "dashboard" || isAuthenticated) {
    return (
      <Dashboard
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentPage("home");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            <span className="font-semibold text-xl text-foreground">Prateleira</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-muted-foreground hover:text-primary transition-colors">Recursos</a>
            <a href="#beneficios" className="text-muted-foreground hover:text-primary transition-colors">Benefícios</a>
            <a href="#contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</a>
          </nav>
          <button
            onClick={() => setCurrentPage("login")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Começar Agora
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Controle Total do Seu Estoque
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sistema completo para gerenciar o estoque do seu mercadinho com facilidade,
                agilidade e controle total de produtos, vendas e relatórios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
                >
                  Teste Grátis por 14 Dias
                </button>
                <button
                  onClick={() => setCurrentPage("demo")}
                  className="border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Ver Demonstração
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Dashboard em Tempo Real</h3>
                    <p className="text-sm text-muted-foreground">Acompanhe seu negócio agora</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <span className="text-sm text-accent-foreground">Produtos em Estoque</span>
                    <span className="font-semibold text-accent-foreground">1.247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-900">Vendas Hoje</span>
                    <span className="font-semibold text-green-900">R$ 3.450,00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <span className="text-sm text-orange-900">Alertas de Estoque</span>
                    <span className="font-semibold text-orange-900">12</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section id="recursos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos Completos para Seu Mercadinho
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu estoque de forma profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Gestão de Produtos",
                description: "Cadastre, organize e controle todos os seus produtos com códigos de barras e categorias."
              },
              {
                icon: TrendingUp,
                title: "Relatórios Inteligentes",
                description: "Acompanhe vendas, lucros e tendências com gráficos e relatórios detalhados."
              },
              {
                icon: Bell,
                title: "Alertas Automáticos",
                description: "Receba notificações quando produtos estiverem com estoque baixo ou vencendo."
              },
              {
                icon: ShoppingCart,
                title: "Controle de Vendas",
                description: "Registre vendas rapidamente e mantenha histórico completo de transações."
              },
              {
                icon: BarChart3,
                title: "Dashboard Intuitivo",
                description: "Visualize métricas importantes em tempo real com interface simples e moderna."
              },
              {
                icon: CheckCircle2,
                title: "Inventário Facilitado",
                description: "Faça contagens de estoque e ajustes com poucos cliques."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Por que escolher o Prateleira?
              </h2>
              <div className="space-y-6">
                {[
                  "Fácil de usar, sem necessidade de treinamento complexo",
                  "Reduza perdas com controle de validade e estoque mínimo",
                  "Aumente suas vendas com dados precisos de performance",
                  "Economize tempo com automações inteligentes",
                  "Acesse de qualquer lugar, web ou mobile",
                  "Suporte dedicado em português"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-foreground">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-border"
            >
              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-2">A partir de</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-primary">R$ 99,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  "Produtos ilimitados",
                  "Usuários ilimitados",
                  "Relatórios completos",
                  "Suporte prioritário",
                  "Atualizações gratuitas",
                  "Backup automático"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage("login")}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Começar Teste Grátis
              </button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Sem cartão de crédito. Cancele quando quiser.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para revolucionar seu mercadinho?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de mercadinhos que já automatizaram seu controle de estoque
            </p>
            <button
              onClick={() => setCurrentPage("login")}
              className="bg-white text-primary px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-xl"
            >
              Começar Agora Gratuitamente
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <span className="font-semibold">Prateleira</span>
              </div>
              <p className="text-slate-400 text-sm">
                Sistema completo de gestão de estoque para mercadinhos
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Prateleira. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}