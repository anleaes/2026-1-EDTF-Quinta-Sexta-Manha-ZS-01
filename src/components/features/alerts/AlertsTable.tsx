import { AlertTriangle, PackagePlus } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { Product } from "@/types";

interface AlertsTableProps {
  products: Product[];
  onRestock: (product: Product) => void;
}

export function AlertsTable({ products, onRestock }: AlertsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/60">
            {["Produto", "Atual", "Mínimo", "Necessário", "Valor Reposição", ""].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => {
            const needed = Math.max(p.minStock - p.stock, 0);
            const replenishCost = needed * p.price;
            return (
              <tr key={p.id} className="hover:bg-orange-50/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{p.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-orange-600">{p.stock}</span>
                </td>
                <td className="px-5 py-3.5 text-foreground">{p.minStock}</td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-primary">{needed}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{formatCurrency(replenishCost)}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onRestock(p)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    Reabastecer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
