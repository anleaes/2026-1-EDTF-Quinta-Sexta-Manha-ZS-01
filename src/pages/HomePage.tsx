import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Package,
  BarChart3,
  Bell,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    bg: "bg-blue-50",
    color: "text-blue-600",
    title: "Controle de Estoque",
    desc: "Gerencie produtos, categorias, preços e quantidades em tempo real.",
  },
  {
    icon: BarChart3,
    bg: "bg-green-50",
    color: "text-green-600",
    title: "Relatórios e Vendas",
    desc: "Acompanhe o desempenho do seu negócio com gráficos e histórico de vendas.",
  },
  {
    icon: Bell,
    bg: "bg-orange-50",
    color: "text-orange-600",
    title: "Alertas Inteligentes",
    desc: "Receba notificações automáticas quando o estoque estiver baixo.",
  },
  {
    icon: Sparkles,
    bg: "bg-violet-50",
    color: "text-violet-600",
    title: "IA em breve",
    desc: "Análises preditivas e sugestões automáticas de reposição com Inteligência Artificial.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-teal-50",
    color: "text-teal-600",
    title: "Seguro e Confiável",
    desc: "Seus dados protegidos com Supabase e autenticação segura.",
  },
  {
    icon: Smartphone,
    bg: "bg-pink-50",
    color: "text-pink-600",
    title: "Mobile Friendly",
    desc: "Interface responsiva que funciona perfeitamente em qualquer dispositivo.",
  },
];

const BENEFITS = [
  "Sem limite de produtos",
  "Histórico completo de vendas",
  "Alertas de estoque baixo",
  "Relatórios automáticos",
  "Suporte em português",
  "IA integrada (em breve)",
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">Prateleira</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Começar grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-primary px-3 py-1.5 rounded-full mb-6 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" /> Gestão inteligente para pequenos negócios
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Controle seu estoque{" "}
            <span className="text-primary">de forma inteligente</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            O Prateleira é um sistema de gestão de estoque moderno para mini-mercados, mercearias
            e pequenos negócios. Simples, rápido e preparado para o futuro com Inteligência Artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Começar agora — é grátis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-border hover:bg-gray-50 transition-colors"
            >
              Ver demonstração
            </button>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-border p-4 shadow-xl"
        >
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 bg-white rounded px-3 py-1 text-xs text-muted-foreground border border-border">
                app.prateleira.com/dashboard
              </div>
            </div>
            {/* Fake dashboard content */}
            <div className="p-5 grid grid-cols-4 gap-3">
              {[
                { label: "Produtos", val: "48", color: "bg-blue-500" },
                { label: "Vendas Hoje", val: "R$ 1.240", color: "bg-green-500" },
                { label: "Alertas", val: "3", color: "bg-orange-500" },
                { label: "Em Estoque", val: "R$ 8.430", color: "bg-purple-500" },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-white border border-border rounded-xl p-4">
                  <div className={`w-8 h-8 ${color} rounded-lg mb-3`} />
                  <div className="text-lg font-bold text-foreground">{val}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 grid grid-cols-3 gap-3">
              <div className="col-span-2 h-28 bg-gray-50 rounded-xl border border-border flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-gray-300" />
              </div>
              <div className="h-28 bg-gray-50 rounded-xl border border-border flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-4">Tudo que seu negócio precisa</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ferramentas poderosas e intuitivas para você focar no que importa: o seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5.5 h-5.5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-primary rounded-2xl p-10 md:p-14 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Tudo incluído, sem surpresas</h2>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto">
              Comece agora e tenha acesso completo a todas as funcionalidades sem custo.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-primary px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Criar conta grátis →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">Prateleira</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Prateleira. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
