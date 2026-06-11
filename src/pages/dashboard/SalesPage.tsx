import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { useStoreContext } from "@/context/StoreContext";
import { SalesTable } from "@/components/features/sales/SalesTable";
import { SaleModal } from "@/components/features/sales/SaleModal";
import { SaleDetailModal } from "@/components/features/sales/SaleDetailModal";
import { StatsCard } from "@/components/common/StatsCard";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { Sale } from "@/types";

export function SalesPage() {
  const { products } = useStoreContext();
  const { sales, salesSummary, isLoading, searchQuery, setSearchQuery, dateFilter, setDateFilter, createSale } = useSales();
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard title="Vendas Hoje" value={formatCurrency(salesSummary?.totalToday ?? 0)}
          icon={<DollarSign className="w-6 h-6 text-green-600" />} iconBg="bg-green-100"
          trend={salesSummary?.growth} trendLabel="vs. ontem" />
        <StatsCard title="Este Mês" value={formatCurrency(salesSummary?.totalMonth ?? 0)}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />} iconBg="bg-blue-100" />
        <StatsCard title="Ticket Médio" value={formatCurrency(salesSummary?.averageTicket ?? 0)}
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />} iconBg="bg-purple-100"
          trendLabel={`${salesSummary?.salesCount ?? 0} vendas no total`} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por produto ou cliente..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex gap-2">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            className="px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">Todo período</option>
            <option value="today">Hoje</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Últimos 30 dias</option>
          </select>
          <button onClick={() => setSaleModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Nova Venda
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <SalesTable sales={sales} onView={setViewingSale} />
      </div>

      <SaleModal open={saleModalOpen} products={products}
        onClose={() => setSaleModalOpen(false)} onSubmit={createSale} />
      <SaleDetailModal sale={viewingSale} onClose={() => setViewingSale(null)} />
    </div>
  );
}
