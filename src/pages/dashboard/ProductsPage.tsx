import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductsTable } from "@/components/features/products/ProductsTable";
import { ProductModal } from "@/components/features/products/ProductModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { Product, ProductFormData } from "@/types";

export function ProductsPage() {
  const {
    products, categories, isLoading, totalStockValue,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    createProduct, updateProduct, deleteProduct,
  } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleOpenCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const handleOpenEdit = (p: Product) => { setEditingProduct(p); setModalOpen(true); };

  const handleSubmit = async (data: ProductFormData): Promise<boolean> => {
    if (editingProduct) return updateProduct(editingProduct.id, data);
    return createProduct(data);
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) await deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
            {" · "}Valor em estoque: <span className="font-semibold text-foreground">R$ {totalStockValue.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, código ou categoria..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "Ativo" | "Inativo")}
              className="pl-8 pr-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white appearance-none"
            >
              <option value="all">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <ProductsTable
          products={products}
          onEdit={handleOpenEdit}
          onDelete={(p) => setDeletingProduct(p)}
        />
      </div>

      <ProductModal
        open={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(v) => { if (!v) setDeletingProduct(null); }}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir "${deletingProduct?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
