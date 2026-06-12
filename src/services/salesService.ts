import { supabase, SUPABASE_READY, isDemoSession } from "@/integrations/supabase/client";
import { MOCK_SALES } from "@/data/mockData";
import type { Sale, CreateSaleInput, SalesSummary } from "@/types";
import { getTodayISO } from "@/utils/formatters";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let salesStore: Sale[] = [...MOCK_SALES];

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

/** Busca todas as vendas ordenadas por data desc */
export async function getSales(): Promise<Sale[]> {
  if (SUPABASE_READY && !isDemoSession()) {
    const { data, error } = await (supabase as any)
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbSale);
  }

  await delay();
  return [...salesStore].sort((a, b) => b.date.localeCompare(a.date));
}

/** Busca venda por ID */
export async function getSaleById(id: number): Promise<Sale | null> {
  if (SUPABASE_READY && !isDemoSession()) {
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

/**
 * Cria nova venda com dedução atômica de estoque via RPC.
 * No Supabase: usa create_sale_and_deduct_stock para garantir consistência.
 * No modo demo: valida e atualiza o store local.
 * Retorna { sale, newStock } — o StoreContext usa newStock para atualizar o produto sem refetch.
 */
export async function createSaleAtomic(
  data: CreateSaleInput,
  currentStock: number
): Promise<{ sale: Sale; newStock: number }> {
  // Validação antecipada de estoque (falha rápida em qualquer modo)
  if (data.quantity > currentStock) {
    throw new Error(
      `Estoque insuficiente. Disponível: ${currentStock}, solicitado: ${data.quantity}.`
    );
  }
  if (data.quantity <= 0) throw new Error("Quantidade deve ser maior que zero.");

  if (SUPABASE_READY && !isDemoSession()) {
    const today = getTodayISO();
    const { data: result, error } = await (supabase as any).rpc(
      "create_sale_and_deduct_stock",
      {
        p_product_id: data.productId,
        p_product_name: data.product,
        p_quantity: data.quantity,
        p_total: data.total,
        p_customer: data.customer || "Cliente",
        p_date: data.date || today,
      }
    );

    if (error) throw error;

    const row = Array.isArray(result) ? result[0] : result;
    const newStock: number = row?.new_stock ?? currentStock - data.quantity;
    const saleId: number = row?.sale_id ?? 0;

    const sale: Sale = {
      id: saleId,
      date: data.date || today,
      product: data.product,
      productId: data.productId,
      quantity: data.quantity,
      total: data.total,
      customer: data.customer || "Cliente",
      createdAt: new Date().toISOString(),
    };

    return { sale, newStock };
  }

  // Modo demo / mock
  await delay();
  const newSale: Sale = {
    ...data,
    id: Math.max(...salesStore.map((s) => s.id), 0) + 1,
    createdAt: new Date().toISOString(),
  };
  salesStore = [newSale, ...salesStore];
  return { sale: newSale, newStock: currentStock - data.quantity };
}

/** Mantida para compatibilidade — redireciona para createSaleAtomic */
export async function createSale(data: CreateSaleInput): Promise<Sale> {
  const { sale } = await createSaleAtomic(data, Infinity);
  return sale;
}

/** Calcula resumo de vendas */
export async function getSalesSummary(): Promise<SalesSummary> {
  const currentSales = SUPABASE_READY && !isDemoSession()
    ? await getSales()
    : salesStore;

  const today = getTodayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const thisMonth = today.substring(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .substring(0, 7);

  const todaySales = currentSales.filter((s) => s.date === today);
  const yesterdaySales = currentSales.filter((s) => s.date === yesterday);
  const thisMonthSales = currentSales.filter((s) => s.date.startsWith(thisMonth));
  const lastMonthSales = currentSales.filter((s) => s.date.startsWith(lastMonth));

  const totalToday = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalYesterday = yesterdaySales.reduce((sum, s) => sum + s.total, 0);
  const totalMonth = thisMonthSales.reduce((sum, s) => sum + s.total, 0);
  const lastMonthTotal = lastMonthSales.reduce((sum, s) => sum + s.total, 0);

  const averageTicket =
    currentSales.length > 0
      ? currentSales.reduce((sum, s) => sum + s.total, 0) / currentSales.length
      : 0;

  const growth =
    totalYesterday > 0
      ? parseFloat((((totalToday - totalYesterday) / totalYesterday) * 100).toFixed(1))
      : 0;

  const monthGrowth =
    lastMonthTotal > 0
      ? parseFloat((((totalMonth - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1))
      : 0;

  return {
    totalToday,
    totalYesterday,
    totalMonth,
    averageTicket,
    salesCount: currentSales.length,
    growth,
    monthGrowth,
  };
}

/** Busca vendas de um período */
export async function getSalesByDateRange(
  startDate: string,
  endDate: string
): Promise<Sale[]> {
  if (SUPABASE_READY && !isDemoSession()) {
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
