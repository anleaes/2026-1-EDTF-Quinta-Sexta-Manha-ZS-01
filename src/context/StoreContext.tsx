import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Product,
  Sale,
  CreateProductInput,
  UpdateProductInput,
  CreateSaleInput,
  SalesSummary,
} from "@/types";
import * as productService from "@/services/productService";
import * as salesService from "@/services/salesService";
import * as stockService from "@/services/stockService";

// ── Tipos do contexto ──────────────────────────────────────
interface StoreContextType {
  // Dados
  products: Product[];
  sales: Sale[];
  salesSummary: SalesSummary | null;
  lowStockProducts: Product[];

  // Estado
  isLoading: boolean;
  isProductsLoading: boolean;
  isSalesLoading: boolean;

  // Operações de produtos
  addProduct: (data: CreateProductInput) => Promise<Product>;
  editProduct: (id: number, data: UpdateProductInput) => Promise<Product>;
  removeProduct: (id: number) => Promise<void>;

  // Operações de vendas (retorna sale + produto atualizado)
  addSale: (data: CreateSaleInput) => Promise<Sale>;

  // Operações de estoque
  restock: (productId: number, quantity: number) => Promise<Product>;

  // Refresh
  refreshProducts: () => Promise<void>;
  refreshSales: () => Promise<void>;
}

// ── Contexto ────────────────────────────────────────────────
const StoreContext = createContext<StoreContextType | null>(null);

// ── Provider ────────────────────────────────────────────────
export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isSalesLoading, setIsSalesLoading] = useState(true);

  // Produtos com estoque baixo (derivado)
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.minStock && p.status === "Ativo"
  );

  const isLoading = isProductsLoading || isSalesLoading;

  // ── Carregamento inicial ─────────────────────────────────
  const refreshProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  const refreshSales = useCallback(async () => {
    setIsSalesLoading(true);
    try {
      const [data, summary] = await Promise.all([
        salesService.getSales(),
        salesService.getSalesSummary(),
      ]);
      setSales(data);
      setSalesSummary(summary);
    } finally {
      setIsSalesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshSales();
  }, [refreshProducts, refreshSales]);

  // ── Operações de produtos ────────────────────────────────
  const addProduct = useCallback(async (data: CreateProductInput): Promise<Product> => {
    const newProduct = await productService.createProduct(data);
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, []);

  const editProduct = useCallback(
    async (id: number, data: UpdateProductInput): Promise<Product> => {
      const updated = await productService.updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    },
    []
  );

  const removeProduct = useCallback(async (id: number): Promise<void> => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Operações de vendas ──────────────────────────────────
  const addSale = useCallback(
    async (data: CreateSaleInput): Promise<Sale> => {
      // Encontrar o produto para validar o estoque
      const product = products.find((p) => p.id === data.productId);
      const currentStock = product?.stock ?? Infinity;

      // createSaleAtomic valida o estoque e retorna o novo valor
      const { sale, newStock } = await salesService.createSaleAtomic(data, currentStock);

      // Atualizar vendas
      setSales((prev) => [sale, ...prev]);

      // Atualizar estoque do produto diretamente com o valor retornado pelo banco
      if (data.productId !== undefined) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === data.productId ? { ...p, stock: newStock } : p
          )
        );
      }

      // Atualizar sumário de vendas em background
      salesService.getSalesSummary().then(setSalesSummary).catch(() => {});

      return sale;
    },
    [products]
  );

  // ── Operações de estoque ─────────────────────────────────
  const restock = useCallback(async (productId: number, quantity: number): Promise<Product> => {
    const updated = await stockService.restockProduct(productId, quantity);
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    return updated;
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        salesSummary,
        lowStockProducts,
        isLoading,
        isProductsLoading,
        isSalesLoading,
        addProduct,
        editProduct,
        removeProduct,
        addSale,
        restock,
        refreshProducts,
        refreshSales,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useStoreContext(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStoreContext deve ser usado dentro de <StoreProvider>");
  return ctx;
}
