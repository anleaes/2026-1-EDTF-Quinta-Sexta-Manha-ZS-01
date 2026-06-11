import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useStoreContext } from "@/context/StoreContext";
import type { Product, ProductFormData } from "@/types";
import { validateProduct } from "@/utils/validators";

export function useProducts() {
  const { products, lowStockProducts, addProduct, editProduct, removeProduct, isProductsLoading } =
    useStoreContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Ativo" | "Inativo">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ── Filtros ──────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  // ── Operações ────────────────────────────────────────────
  const createProduct = async (data: ProductFormData): Promise<boolean> => {
    const { isValid, errors } = validateProduct(data);
    if (!isValid) {
      toast.error(errors[0].message);
      return false;
    }

    try {
      await addProduct(data);
      toast.success("Produto adicionado com sucesso!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar produto.");
      return false;
    }
  };

  const updateProduct = async (id: number, data: ProductFormData): Promise<boolean> => {
    const { isValid, errors } = validateProduct(data);
    if (!isValid) {
      toast.error(errors[0].message);
      return false;
    }

    try {
      await editProduct(id, data);
      toast.success("Produto atualizado com sucesso!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar produto.");
      return false;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      await removeProduct(id);
      toast.success("Produto removido com sucesso.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover produto.");
      return false;
    }
  };

  const getProduct = (id: number): Product | undefined =>
    products.find((p) => p.id === id);

  const totalStockValue = useMemo(
    () => products.reduce((sum, p) => sum + p.stock * p.price, 0),
    [products]
  );

  return {
    products: filteredProducts,
    allProducts: products,
    lowStockProducts,
    categories,
    isLoading: isProductsLoading,
    totalStockValue,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
