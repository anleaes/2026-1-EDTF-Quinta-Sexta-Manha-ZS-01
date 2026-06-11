import { Eye, ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Sale } from "@/types";

interface SalesTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
}

export function SalesTable({ sales, onView }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="w-7 h-7 text-gray-400" />}
        title="Nenhuma venda encontrada"
        description="Registre uma nova venda ou ajuste os filtros aplicados."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/60">
            {["#", "Data", "Produto", "Cliente", "Qtd", "Total", ""].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sales.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">#{s.id}</td>
              <td className="px-5 py-3.5 text-muted-foreground">{formatDate(s.date)}</td>
              <td className="px-5 py-3.5 font-medium text-foreground">{s.product}</td>
              <td className="px-5 py-3.5 text-muted-foreground">{s.customer}</td>
              <td className="px-5 py-3.5 text-foreground">{s.quantity}</td>
              <td className="px-5 py-3.5 font-semibold text-green-600">{formatCurrency(s.total)}</td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => onView(s)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Ver detalhes"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
