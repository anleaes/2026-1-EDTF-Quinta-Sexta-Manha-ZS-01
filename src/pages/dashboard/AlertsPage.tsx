import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useStock } from "@/hooks/useStock";
import { AlertsTable } from "@/components/features/alerts/AlertsTable";
import { RestockModal } from "@/components/features/alerts/RestockModal";
import { EmptyState } from "@/components/common/EmptyState";
import type { Product } from "@/types";

export function AlertsPage() {
  const { lowStockProducts, isLoading, restockProduct } = useStock();
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);

  const handleRestock = async (productId: number, quantity: number): Promise<boolean> => {
    return restockProduct(productId, quantity);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      {lowStockProducts.length > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-orange-900">
              {lowStockProducts.length} produto{lowStockProducts.length !== 1 ? "s" : ""} com estoque baixo
            </p>
            <p className="text-xs text-orange-700 mt-0.5">
              Reponha o estoque para evitar ruptura nas vendas.
            </p>
          </div>
        </div>
      )}

      {/* Table or empty */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {lowStockProducts.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
            iconBg="bg-green-50"
            title="Tudo em ordem!"
            description="Nenhum produto está com estoque abaixo do mínimo no momento."
          />
        ) : (
          <AlertsTable products={lowStockProducts} onRestock={setRestockingProduct} />
        )}
      </div>

      <RestockModal
        product={restockingProduct}
        onClose={() => setRestockingProduct(null)}
        onSubmit={handleRestock}
      />
    </div>
  );
}
