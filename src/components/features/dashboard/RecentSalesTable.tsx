import { useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useStoreContext } from "@/context/StoreContext";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, formatCurrency } from "@/utils/formatters";

export function RecentSalesTable() {
  const { sales } = useStoreContext();
  const navigate = useNavigate();
  const recent = sales.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Vendas Recentes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Últimas {recent.length} transações</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/sales")}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Ver todas →
        </button>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-7 h-7 text-gray-400" />}
          title="Nenhuma venda registrada"
          description="Registre a primeira venda na aba Vendas."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Produto</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Cliente</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(sale.date)}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground">{sale.product}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{sale.customer}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-green-600">{formatCurrency(sale.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
