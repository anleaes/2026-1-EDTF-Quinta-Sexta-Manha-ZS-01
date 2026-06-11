import { supabase, SUPABASE_READY } from "@/integrations/supabase/client";
import type { Product, CategoryInventory } from "@/types";
import { getProducts, updateProduct } from "./productService";
import * as productService from "./productService";
import { MOCK_CATEGORY_DATA } from "@/data/mockData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

// Helper local para mapeamento de produtos
function mapDbProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    code: p.code,
    category: p.category,
    stock: p.stock,
    minStock: p.min_stock,
    price: p.price,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

/** Busca produtos com estoque baixo (stock <= minStock)
 * @supabase supabase.from('low_stock_products').select('*')
 */
export async function getLowStockProducts(): Promise<Product[]> {
  if (SUPABASE_READY) {
    const { data, error } = await (supabase as any)
      .from("low_stock_products")
      .select("*");

    if (error) throw error;
    return (data || []).map(mapDbProduct);
  }

  const products = await getProducts();
  return products.filter((p) => p.stock <= p.minStock && p.status === "Ativo");
}

/** Reabastece estoque de um produto
 * @supabase supabase.rpc('restock_product', { product_id: id, quantity: qty })
 */
export async function restockProduct(
  productId: number,
  quantity: number
): Promise<Product> {
  if (SUPABASE_READY) {
    if (quantity <= 0) throw new Error("Quantidade deve ser maior que zero.");
    
    const { error } = await (supabase as any).rpc("restock_product", {
      product_id: productId,
      quantity,
    });

    if (error) throw error;

    const updated = await productService.getProductById(productId);
    if (!updated) throw new Error(`Produto ${productId} não encontrado.`);
    return updated;
  }

  await delay();
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) throw new Error(`Produto ${productId} não encontrado.`);
  if (quantity <= 0) throw new Error("Quantidade deve ser maior que zero.");

  return updateProduct(productId, {
    stock: product.stock + quantity,
  });
}

/** Calcula valor total do estoque
 * @supabase supabase.rpc('get_inventory_value')
 */
export async function getTotalStockValue(): Promise<number> {
  if (SUPABASE_READY) {
    const { data, error } = await (supabase as any).rpc("get_inventory_value");
    if (error) throw error;
    return data || 0;
  }

  const products = await getProducts();
  return products.reduce((sum, p) => sum + p.stock * p.price, 0);
}

/** Retorna distribuição de estoque por categoria
 * @supabase Calcular dinamicamente se o RPC não estiver presente
 */
export async function getCategoryInventory(): Promise<CategoryInventory[]> {
  if (SUPABASE_READY) {
    const products = await getProducts();
    const categoriesMap: Record<string, { totalItems: number; totalValue: number; productCount: number }> = {};

    products.forEach((p) => {
      if (!categoriesMap[p.category]) {
        categoriesMap[p.category] = { totalItems: 0, totalValue: 0, productCount: 0 };
      }
      categoriesMap[p.category].totalItems += p.stock;
      categoriesMap[p.category].totalValue += p.stock * p.price;
      categoriesMap[p.category].productCount += 1;
    });

    const colors = [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
      "#ec4899", "#14b8a6", "#f97316", "#64748b"
    ];

    return Object.entries(categoriesMap).map(([name, stats], idx) => ({
      name,
      totalItems: stats.totalItems,
      totalValue: stats.totalValue,
      productCount: stats.productCount,
      color: colors[idx % colors.length],
    }));
  }

  await delay(100);
  return MOCK_CATEGORY_DATA;
}

/** Registra ajuste de inventário
 * @supabase supabase.from('inventory_adjustments').insert({ product_id, quantity, reason, date })
 */
export async function createInventoryAdjustment(
  productId: number,
  newQuantity: number,
  reason: string
): Promise<Product> {
  if (SUPABASE_READY) {
    const product = await productService.getProductById(productId);
    if (!product) throw new Error(`Produto ${productId} não encontrado.`);

    const { data: { user } } = await (supabase as any).auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");

    const { error: adjustmentError } = await (supabase as any)
      .from("inventory_adjustments")
      .insert({
        product_id: productId,
        quantity_before: product.stock,
        quantity_after: newQuantity,
        reason,
        user_id: user.id
      });

    if (adjustmentError) throw adjustmentError;

    return productService.updateProduct(productId, {
      stock: newQuantity,
    });
  }

  await delay();
  return updateProduct(productId, {
    stock: newQuantity,
  });
}

/** Resumo do inventário
 * @supabase Usar agregação baseada em produtos
 */
export async function getInventorySummary() {
  const products = await getProducts();
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "Ativo").length,
    lowStockCount: lowStock.length,
    totalValue,
    lastUpdated: new Date().toISOString(),
  };
}
