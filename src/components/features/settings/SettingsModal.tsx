import { useState } from "react";
import { Settings, Users, Bell, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { user, updateUser } = useAuthContext();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifSales, setNotifSales] = useState(true);
  const [notifReport, setNotifReport] = useState(false);

  const handleSave = () => {
    updateUser({ name, email });
    toast.success("Configurações salvas com sucesso!");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Configurações</h2>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Perfil */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Users className="w-4 h-4" /> Perfil
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Nome</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </section>

                {/* Notificações */}
                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Bell className="w-4 h-4" /> Notificações
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Alertas de Estoque Baixo", sub: "Quando um produto atingir o mínimo", value: notifLowStock, set: setNotifLowStock },
                      { label: "Resumo de Vendas",          sub: "Resumo diário por e-mail",            value: notifSales,    set: setNotifSales    },
                      { label: "Relatório Semanal",         sub: "Relatório toda segunda-feira",         value: notifReport,   set: setNotifReport   },
                    ].map(({ label, sub, value, set }) => (
                      <label key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => set(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                      </label>
                    ))}
                  </div>
                </section>

                {/* Segurança */}
                <section className="border-t border-border pt-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Lock className="w-4 h-4" /> Segurança
                  </h3>
                  <div className="space-y-2">
                    {["Alterar Senha", "Autenticação em Dois Fatores"].map((item) => (
                      <button
                        key={item}
                        onClick={() => toast.info("Disponível após integração com Supabase.")}
                        className="w-full text-left px-3 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Sobre */}
                <section className="border-t border-border pt-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Sobre</h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Versão</span><span className="font-medium text-foreground">1.0.0</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Licença</span><span className="font-medium text-green-600">Ativa</span></div>
                  </div>
                </section>

                {/* Ações */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
