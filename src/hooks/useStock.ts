import { useState } from "react";
import { toast } from "sonner";
import { useStoreContext } from "@/context/StoreContext";

export function useStock() {
  const { lowStockProducts, restock, isProductsLoading } = useStoreContext();
  const [restockingId, setRestockingId] = useState<number | null>(null);

  const restockProduct = async (productId: number, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      toast.error("Quantidade deve ser maior que zero.");
      return false;
    }
    setRestockingId(productId);
    try {
      await restock(productId, quantity);
      toast.success(`Estoque atualizado! ${quantity} unidades adicionadas.`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar estoque.");
      return false;
    } finally {
      setRestockingId(null);
    }
  };

  return {
    lowStockProducts,
    isLoading: isProductsLoading,
    restockingId,
    restockProduct,
  };
}
