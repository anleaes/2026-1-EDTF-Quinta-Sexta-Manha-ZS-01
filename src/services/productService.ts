import { supabase, SUPABASE_READY, isDemoSession } from "@/integrations/supabase/client";
import { MOCK_PRODUCTS } from "@/data/mockData";
import type { Product, CreateProductInput, UpdateProductInput } from "@/types";

// Simula latência de rede (remover ao integrar Supabase)
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// Banco de dados em memória (substituir por Supabase)
let productsStore: Product[] = [...MOCK_PRODUCTS];

// Mapeadores auxiliares para converter camelCase (Aplicação) <-> snake_case (Supabase)
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

function mapToDbInsert(p: CreateProductInput) {
  return {
    name: p.name,
    description: p.description || null,
    code: p.code,
    category: p.category,
    stock: p.stock,
    min_stock: p.minStock,
    price: p.price,
    status: p.status,
  };
}

function mapToDbUpdate(p: UpdateProductInput) {
  const data: any = {};
  if (p.name !== undefined) data.name = p.name;
  if (p.description !== undefined) data.description = p.description || null;
  if (p.code !== undefined) data.code = p.code;
  if (p.category !== undefined) data.category = p.category;
  if (p.stock !== undefined) data.stock = p.stock;
  if (p.minStock !== undefined) data.min_stock = p.minStock;
  if (p.price !== undefined) data.price = p.price;
  if (p.status !== undefined) data.status = p.status;
  return data;
}

/** Busca todos os produtos
 * @supabase supabase.from('products').select('*').order('name')
 */
export async function getProducts(): Promise<Product[]> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .order("name");

    if (error) throw error;
    return (data || []).map(mapDbProduct);
  }

  await delay();
  return [...productsStore];
}

/** Busca produto por ID
 * @supabase supabase.from('products').select('*').eq('id', id).single()
 */
export async function getProductById(id: number): Promise<Product | null> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapDbProduct(data) : null;
  }

  await delay(100);
  return productsStore.find((p) => p.id === id) ?? null;
}

/** Cria novo produto
 * @supabase supabase.from('products').insert(data).select().single()
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  if (SUPABASE_READY && !isDemoSession()) {
    const dbData = mapToDbInsert(data);
    const { data: inserted, error } = await (supabase as any)
      .from("products")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapDbProduct(inserted);
  }

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
  if (SUPABASE_READY && !isDemoSession()) {
    const dbData = mapToDbUpdate(data);
    const { data: updated, error } = await (supabase as any)
      .from("products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapDbProduct(updated);
  }

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
  if (SUPABASE_READY && !isDemoSession()) {
    const { error } = await (supabase as any)
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return;
  }

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
  if (SUPABASE_READY && !isDemoSession()) {
    let query = (supabase as any)
      .from("products")
      .select("id")
      .eq("code", code);

    if (excludeId !== undefined) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data !== null;
  }

  await delay(100);
  return productsStore.some((p) => p.code === code && p.id !== excludeId);
}

/** Reseta store para dados originais (útil para testes) */
export function resetProductsStore(): void {
  productsStore = [...MOCK_PRODUCTS];
}
