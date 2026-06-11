// ============================================================
// PRODUCT SERVICE
// Camada de serviço para produtos
// TODO: Substituir cada função pela chamada equivalente do Supabase
// Exemplo: const { data } = await supabase.from('products').select('*')
// ============================================================

import { MOCK_PRODUCTS } from "@/data/mockData";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types";

// Simula latência de rede (remover ao integrar Supabase)
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// Banco de dados em memória (substituir por Supabase)
let productsStore: Product[] = [...MOCK_PRODUCTS];

/** Busca todos os produtos
 * @supabase supabase.from('products').select('*').order('name')
 */
export async function getProducts(): Promise<Product[]> {
  await delay();
  return [...productsStore];
}

/** Busca produto por ID
 * @supabase supabase.from('products').select('*').eq('id', id).single()
 */
export async function getProductById(id: number): Promise<Product | null> {
  await delay(100);
  return productsStore.find((p) => p.id === id) ?? null;
}

/** Cria novo produto
 * @supabase supabase.from('products').insert(data).select().single()
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  await delay();
  const newProduct: Product = {
    ...data,
    id: Math.max(...productsStore.map((p) => p.id), 0) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  productsStore = [...productsStore, newProduct];
  return newProduct;
}

/** Atualiza produto existente
 * @supabase supabase.from('products').update(data).eq('id', id).select().single()
 */
export async function updateProduct(
  id: number,
  data: UpdateProductInput
): Promise<Product> {
  await delay();
  const index = productsStore.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Produto ${id} não encontrado.`);

  const updated: Product = {
    ...productsStore[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  productsStore = productsStore.map((p) => (p.id === id ? updated : p));
  return updated;
}

/** Remove produto
 * @supabase supabase.from('products').delete().eq('id', id)
 */
export async function deleteProduct(id: number): Promise<void> {
  await delay();
  productsStore = productsStore.filter((p) => p.id !== id);
}

/** Verifica se código já existe (para validação)
 * @supabase supabase.from('products').select('id').eq('code', code).maybeSingle()
 */
export async function checkCodeExists(
  code: string,
  excludeId?: number
): Promise<boolean> {
  await delay(100);
  return productsStore.some((p) => p.code === code && p.id !== excludeId);
}

/** Reseta store para dados originais (útil para testes) */
export function resetProductsStore(): void {
  productsStore = [...MOCK_PRODUCTS];
}
