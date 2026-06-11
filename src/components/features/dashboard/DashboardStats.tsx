import { Package, DollarSign, AlertTriangle, ShoppingCart } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { useStoreContext } from "@/context/StoreContext";
import { formatCurrency } from "@/utils/formatters";

export function DashboardStats() {
  const { products, sales, salesSummary, lowStockProducts } = useStoreContext();
  const totalStockValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatsCard
        title="Produtos Cadastrados"
        value={products.length}
        icon={<Package className="w-6 h-6 text-blue-600" />}
        iconBg="bg-blue-100"
        trend={5}
        trendLabel="vs. mês anterior"
        delay={0}
      />
      <StatsCard
        title="Vendas Hoje"
        value={formatCurrency(salesSummary?.totalToday ?? 0)}
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
        iconBg="bg-green-100"
        trend={salesSummary?.growth}
        trendLabel="vs. ontem"
        delay={0.08}
      />
      <StatsCard
        title="Alertas de Estoque"
        value={lowStockProducts.length}
        icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
        iconBg="bg-orange-100"
        delay={0.16}
      />
      <StatsCard
        title="Total em Estoque"
        value={formatCurrency(totalStockValue)}
        icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
        iconBg="bg-purple-100"
        trend={12}
        trendLabel={`${sales.length} vendas registradas`}
        delay={0.24}
      />
    </div>
  );
}
