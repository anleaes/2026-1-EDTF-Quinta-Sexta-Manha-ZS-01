import { supabase, SUPABASE_READY } from "@/integrations/supabase/client";
import { MOCK_SALES } from "@/data/mockData";
import type { Sale, CreateSaleInput, SalesSummary } from "@/types";
import { getTodayISO } from "@/utils/formatters";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let salesStore: Sale[] = [...MOCK_SALES];

// Mapeadores auxiliares para converter camelCase (Aplicação) <-> snake_case (Supabase)
function mapDbSale(s: any): Sale {
  return {
    id: s.id,
    date: s.date,
    product: s.product_name,
    productId: s.product_id,
    quantity: s.quantity,
    total: s.total,
    customer: s.customer,
    createdAt: s.created_at,
  };
}

function mapToDbInsert(s: CreateSaleInput) {
  return {
    date: s.date,
    product_id: s.productId || 0,
    product_name: s.product,
    quantity: s.quantity,
    total: s.total,
    customer: s.customer,
  };
}

/** Busca todas as vendas ordenadas por data desc
 * @supabase supabase.from('sales').select('*').order('date', { ascending: false })
 */
export async function getSales(): Promise<Sale[]> {
  if (SUPABASE_READY) {
    const { data, error } = await (supabase as any)
      .from("sales")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbSale);
  }

  await delay();
  return [...salesStore].sort((a, b) => b.date.localeCompare(a.date));
}

/** Busca venda por ID
 * @supabase supabase.from('sales').select('*').eq('id', id).single()
 */
export async function getSaleById(id: number): Promise<Sale | null> {
  if (SUPABASE_READY) {
    const { data, error } = await (supabase as any)
      .from("sales")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapDbSale(data) : null;
  }

  await delay(100);
  return salesStore.find((s) => s.id === id) ?? null;
}

/** Cria nova venda
 * @supabase supabase.from('sales').insert(data).select().single()
 */
export async function createSale(data: CreateSaleInput): Promise<Sale> {
  if (SUPABASE_READY) {
    const dbData = mapToDbInsert(data);
    const { data: inserted, error } = await (supabase as any)
      .from("sales")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapDbSale(inserted);
  }

  await delay();
  const newSale: Sale = {
    ...data,
    id: Math.max(...salesStore.map((s) => s.id), 0) + 1,
    createdAt: new Date().toISOString(),
  };
  salesStore = [newSale, ...salesStore];
  return newSale;
}

/** Calcula resumo de vendas
 * @supabase Agrega dados de vendas dinamicamente
 */
export async function getSalesSummary(): Promise<SalesSummary> {
  if (SUPABASE_READY) {
    const currentSales = await getSales();
    const today = getTodayISO();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todaySales = currentSales.filter((s) => s.date === today);
    const yesterdaySales = currentSales.filter((s) => s.date === yesterday);

    const totalToday = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalYesterday = yesterdaySales.reduce((sum, s) => sum + s.total, 0);

    const totalMonth = currentSales
      .filter((s) => s.date.startsWith(today.substring(0, 7)))
      .reduce((sum, s) => sum + s.total, 0);

    const averageTicket =
      currentSales.length > 0
        ? currentSales.reduce((sum, s) => sum + s.total, 0) / currentSales.length
        : 0;

    const growth =
      totalYesterday > 0
        ? parseFloat((((totalToday - totalYesterday) / totalYesterday) * 100).toFixed(1))
        : 0;

    return {
      totalToday,
      totalYesterday,
      totalMonth,
      averageTicket,
      salesCount: currentSales.length,
      growth,
    };
  }

  await delay(100);
  const today = getTodayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const todaySales = salesStore.filter((s) => s.date === today);
  const yesterdaySales = salesStore.filter((s) => s.date === yesterday);

  const totalToday = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalYesterday = yesterdaySales.reduce((sum, s) => sum + s.total, 0);

  const totalMonth = salesStore
    .filter((s) => s.date.startsWith(today.substring(0, 7)))
    .reduce((sum, s) => sum + s.total, 0);

  const averageTicket =
    salesStore.length > 0
      ? salesStore.reduce((sum, s) => sum + s.total, 0) / salesStore.length
      : 0;

  const growth =
    totalYesterday > 0
      ? parseFloat((((totalToday - totalYesterday) / totalYesterday) * 100).toFixed(1))
      : 0;

  return {
    totalToday,
    totalYesterday,
    totalMonth,
    averageTicket,
    salesCount: salesStore.length,
    growth,
  };
}

/** Busca vendas de um período
 * @supabase supabase.from('sales').select('*').gte('date', startDate).lte('date', endDate)
 */
export async function getSalesByDateRange(
  startDate: string,
  endDate: string
): Promise<Sale[]> {
  if (SUPABASE_READY) {
    const { data, error } = await (supabase as any)
      .from("sales")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbSale);
  }

  await delay(100);
  return salesStore.filter((s) => s.date >= startDate && s.date <= endDate);
}

/** Reseta store para dados originais */
export function resetSalesStore(): void {
  salesStore = [...MOCK_SALES];
}
