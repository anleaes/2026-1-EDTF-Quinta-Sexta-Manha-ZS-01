import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useStoreContext } from "@/context/StoreContext";
import type { SaleFormData } from "@/types";
import { formatCurrency } from "@/utils/formatters";

export function useSales() {
  const { sales, salesSummary, addSale, products, isSalesLoading } = useStoreContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // ── Filtros ──────────────────────────────────────────────
  const filteredSales = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

    return sales.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && s.date === today) ||
        (dateFilter === "week" && s.date >= weekAgo) ||
        (dateFilter === "month" && s.date >= monthAgo);

      return matchesSearch && matchesDate;
    });
  }, [sales, searchQuery, dateFilter]);

  // ── Criar venda ──────────────────────────────────────────
  const createSale = async (data: SaleFormData): Promise<boolean> => {
    const product = products.find((p) => p.id === parseInt(data.productId));

    if (!product) {
      toast.error("Produto não encontrado.");
      return false;
    }

    if (product.stock < data.quantity) {
      toast.error(`Estoque insuficiente. Disponível: ${product.stock} unidades.`);
      return false;
    }

    if (!data.customer.trim()) {
      toast.error("Nome do cliente é obrigatório.");
      return false;
    }

    try {
      const total = product.price * data.quantity;
      await addSale({
        date: new Date().toISOString().split("T")[0],
        product: product.name,
        productId: product.id,
        quantity: data.quantity,
        total,
        customer: data.customer,
      });

      toast.success(`Venda registrada! Total: ${formatCurrency(total)}`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao registrar venda.");
      return false;
    }
  };

  return {
    sales: filteredSales,
    allSales: sales,
    salesSummary,
    isLoading: isSalesLoading,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    createSale,
  };
}
