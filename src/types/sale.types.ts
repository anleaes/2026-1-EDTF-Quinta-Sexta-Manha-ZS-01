// ============================================================
// SALE TYPES
// Interfaces prontas para integração com Supabase
// Tabela: sales
// ============================================================

/** Venda completa — espelho da tabela `sales` no Supabase */
export interface Sale {
  id: number;
  date: string;
  product: string;
  productId?: number;
  quantity: number;
  total: number;
  customer: string;
  createdAt?: string;
}

/** Campos do formulário de nova venda */
export interface SaleFormData {
  productId: string;
  quantity: number;
  customer: string;
}

/** Resumo de vendas por período */
export interface SalesSummary {
  totalToday: number;
  totalYesterday: number;
  totalMonth: number;
  averageTicket: number;
  salesCount: number;
  growth: number; // percentual
}

/** Dado para gráfico de vendas diárias */
export interface DailySalesData {
  name: string;
  vendas: number;
  meta?: number;
}

/** Produto mais vendido */
export interface TopSellingProduct {
  name: string;
  sales: number;
  revenue: number;
  trend?: "up" | "down" | "stable";
}

/** Input para criação de venda */
export type CreateSaleInput = Omit<Sale, "id" | "createdAt">;
