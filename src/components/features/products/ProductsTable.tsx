import { Pencil, Trash2, Package } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrency } from "@/utils/formatters";
import type { Product } from "@/types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-7 h-7 text-gray-400" />}
        title="Nenhum produto encontrado"
        description="Tente ajustar os filtros ou adicione um novo produto."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/60">
            {["Produto", "Código", "Categoria", "Estoque", "Preço", "Status", "Ações"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => {
            const isLow = p.stock <= p.minStock;
            return (
              <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-foreground">{p.name}</p>
                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-muted-foreground">{p.code}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{p.category}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("font-semibold", isLow ? "text-orange-600" : "text-foreground")}>
                    {p.stock}
                  </span>
                  {isLow && (
                    <span className="ml-1.5 text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                      Baixo
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-semibold text-foreground">{formatCurrency(p.price)}</td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    p.status === "Ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
