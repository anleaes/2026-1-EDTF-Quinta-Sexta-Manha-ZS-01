// ============================================================
// FORMATTERS
// Funções utilitárias para formatação de dados
// ============================================================

/**
 * Formata um número como moeda brasileira (BRL)
 * @example formatCurrency(1234.56) → "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma string de data ISO para o padrão brasileiro
 * @example formatDate("2026-05-29") → "29/05/2026"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
}

/**
 * Formata um Date para o padrão brasileiro com hora
 * @example formatDateTime(new Date()) → "29/05/2026, 14:30"
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Retorna a data de hoje no formato ISO (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calcula o percentual de variação entre dois valores
 * @example calcGrowth(120, 100) → 20 (%)
 */
export function calcGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

/**
 * Abrevia um número grande
 * @example formatCompact(1247) → "1.2k"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Gera um código de produto único baseado no nome
 * @example generateProductCode("Arroz Tipo 1") → "ARR001"
 */
export function generateProductCode(name: string, index: number): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, "");
  return `${prefix}${String(index).padStart(3, "0")}`;
}

/**
 * Formata quantidade com unidade
 * @example formatQuantity(5) → "5 unidades"
 */
export function formatQuantity(qty: number): string {
  return `${qty} ${qty === 1 ? "unidade" : "unidades"}`;
}
