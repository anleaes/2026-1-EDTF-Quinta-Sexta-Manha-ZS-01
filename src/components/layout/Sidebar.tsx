import { type ElementType } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  Home,
  ShoppingCart,
  BarChart3,
  Bell,
  FileText,
  LogOut,
  Users,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { cn } from "@/components/ui/utils";
import { useAuthContext } from "@/context/AuthContext";
import { useStoreContext } from "@/context/StoreContext";

interface NavItem {
  id: string;
  path: string;
  icon: ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", path: "/dashboard",           icon: Home,         label: "Dashboard"   },
  { id: "products",  path: "/dashboard/products",  icon: Package,      label: "Produtos"    },
  { id: "sales",     path: "/dashboard/sales",     icon: ShoppingCart, label: "Vendas"      },
  { id: "reports",   path: "/dashboard/reports",   icon: BarChart3,    label: "Relatórios"  },
  { id: "alerts",    path: "/dashboard/alerts",    icon: Bell,         label: "Alertas"     },
  { id: "inventory", path: "/dashboard/inventory", icon: FileText,     label: "Inventário"  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { lowStockProducts } = useStoreContext();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && onClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed lg:relative z-40 w-64 bg-white border-r border-border h-screen flex flex-col shadow-sm"
          >
            {/* Logo */}
            <div className="p-6 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground leading-none block">Prateleira</span>
                <span className="text-xs text-muted-foreground">{user?.storeName ?? "Gestão de Estoque"}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Menu
              </p>
              <div className="space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  const badgeCount = item.id === "alerts" ? lowStockProducts.length : 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group",
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                      {badgeCount > 0 && (
                        <span
                          className={cn(
                            "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {badgeCount}
                        </span>
                      )}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{user?.name ?? "Admin"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
