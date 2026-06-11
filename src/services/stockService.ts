// ============================================================
// STOCK SERVICE
// Camada de serviço para controle de estoque
// TODO: Substituir cada função pela chamada equivalente do Supabase
// ============================================================

import type { Product, CategoryInventory } from "@/types";
import { getProducts, updateProduct } from "./productService";
import { MOCK_CATEGORY_DATA } from "@/data/mockData";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

/** Busca produtos com estoque baixo (stock <= minStock)
 * @supabase supabase.from('products').select('*').filter('stock', 'lte', 'min_stock')
 * Requer stored procedure ou computed column no Supabase
 */
export async function getLowStockProducts(): Promise<Product[]> {
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
  await delay();
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) throw new Error(`Produto ${productId} não encontrado.`);
  if (quantity <= 0) throw new Error("Quantidade deve ser maior que zero.");

  return updateProduct(productId, {
    stock: product.stock + quantity,
    updatedAt: new Date().toISOString(),
  });
}

/** Calcula valor total do estoque
 * @supabase supabase.rpc('get_inventory_value')
 */
export async function getTotalStockValue(): Promise<number> {
  const products = await getProducts();
  return products.reduce((sum, p) => sum + p.stock * p.price, 0);
}

/** Retorna distribuição de estoque por categoria
 * @supabase supabase.rpc('get_category_inventory')
 */
export async function getCategoryInventory(): Promise<CategoryInventory[]> {
  await delay(100);
  // TODO: Calcular dinamicamente com base nos produtos reais
  return MOCK_CATEGORY_DATA;
}

/** Registra ajuste de inventário
 * @supabase supabase.from('inventory_adjustments').insert({ product_id, quantity, reason, date })
 */
export async function createInventoryAdjustment(
  productId: number,
  newQuantity: number,
  _reason: string
): Promise<Product> {
  await delay();
  return updateProduct(productId, {
    stock: newQuantity,
    updatedAt: new Date().toISOString(),
  });
}

/** Resumo do inventário
 * @supabase Usar view materializada ou função RPC
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
