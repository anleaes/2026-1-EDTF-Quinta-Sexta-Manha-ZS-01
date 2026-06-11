import { useState } from "react";
import { Bell, Settings, Menu, X, AlertTriangle, CheckCircle2, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/components/ui/utils";
import { useStoreContext } from "@/context/StoreContext";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":           "Dashboard",
  "/dashboard/products":  "Gestão de Produtos",
  "/dashboard/sales":     "Controle de Vendas",
  "/dashboard/reports":   "Relatórios",
  "/dashboard/alerts":    "Alertas de Estoque",
  "/dashboard/inventory": "Inventário",
};

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar, onOpenSettings }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lowStockProducts } = useStoreContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <header className="bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left: toggle + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-gray-100 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen((v) => !v)}
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {lowStockProducts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {lowStockProducts.length > 9 ? "9+" : lowStockProducts.length}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Notificações</span>
                    </div>
                    {lowStockProducts.length > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                        {lowStockProducts.length}
                      </span>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {lowStockProducts.length === 0 ? (
                      <div className="flex flex-col items-center py-10 text-center px-4">
                        <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                        <p className="text-sm font-medium text-foreground">Tudo em ordem!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Nenhuma notificação.</p>
                      </div>
                    ) : (
                      lowStockProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate("/dashboard/alerts");
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-border last:border-0"
                        >
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">Estoque Baixo</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {p.name}: {p.stock} / {p.minStock} un.
                            </p>
                          </div>
                          <Package className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </div>

                  {lowStockProducts.length > 0 && (
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-border">
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate("/dashboard/alerts");
                        }}
                        className={cn(
                          "text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                        )}
                      >
                        Ver todos os alertas →
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors"
          aria-label="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
