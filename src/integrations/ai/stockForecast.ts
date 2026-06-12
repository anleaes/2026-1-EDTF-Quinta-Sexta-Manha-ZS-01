// ============================================================
// STOCK FORECAST — Previsão de Ruptura de Estoque
// Lógica local pura, sem chamada de API. Funciona offline.
// ============================================================

import type { Product, Sale } from "@/types";

export type RiskLevel = "baixo" | "médio" | "alto" | "crítico";

export interface StockForecast {
  productId: number;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  price: number;
  /** Média de unidades vendidas por dia (baseada nas vendas dos últimos 30 dias) */
  avgDailySales: number;
  /** Dias estimados até o estoque acabar (Infinity se não houver vendas) */
  daysUntilStockout: number;
  /** Nível de risco de ruptura */
  riskLevel: RiskLevel;
  /** Quantidade sugerida para reposição (cobertura de 30 dias além do mínimo) */
  suggestedRestock: number;
  /** Explicação em linguagem natural */
  explanation: string;
}

/**
 * Calcula previsões de ruptura para todos os produtos ativos.
 * Usa as vendas dos últimos 30 dias para calcular a média diária.
 */
export function calculateStockForecasts(
  products: Product[],
  sales: Sale[]
): StockForecast[] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const recentSales = sales.filter((s) => s.date >= thirtyDaysAgo);

  return products
    .filter((p) => p.status === "Ativo")
    .map((product) => {
      // Total vendido nos últimos 30 dias
      const productSales = recentSales.filter((s) => s.productId === product.id);
      const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
      const avgDailySales = totalSold / 30;

      // Dias até acabar o estoque
      const daysUntilStockout =
        avgDailySales > 0
          ? Math.floor(product.stock / avgDailySales)
          : Infinity;

      // Nível de risco
      const riskLevel = calcRiskLevel(
        product.stock,
        product.minStock,
        daysUntilStockout
      );

      // Sugestão de reposição: cobrir 30 dias de vendas + estoque mínimo
      const coverageDays = 30;
      const suggestedRestock = Math.max(
        0,
        Math.ceil(avgDailySales * coverageDays) + product.minStock - product.stock
      );

      // Texto explicativo
      const explanation = buildExplanation(
        product.name,
        product.stock,
        product.minStock,
        avgDailySales,
        daysUntilStockout,
        riskLevel
      );

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        currentStock: product.stock,
        minStock: product.minStock,
        price: product.price,
        avgDailySales: parseFloat(avgDailySales.toFixed(2)),
        daysUntilStockout,
        riskLevel,
        suggestedRestock,
        explanation,
      };
    })
    .sort((a, b) => riskOrder(a.riskLevel) - riskOrder(b.riskLevel));
}

function riskOrder(r: RiskLevel): number {
  return { crítico: 0, alto: 1, médio: 2, baixo: 3 }[r];
}

function calcRiskLevel(
  stock: number,
  minStock: number,
  daysUntilStockout: number
): RiskLevel {
  // Abaixo do mínimo → crítico
  if (stock <= minStock) return "crítico";
  // Menos de 3 dias ou stock ≤ 1.2× mínimo → alto
  if (daysUntilStockout <= 3 || stock <= minStock * 1.2) return "alto";
  // Menos de 7 dias ou stock ≤ 1.5× mínimo → médio
  if (daysUntilStockout <= 7 || stock <= minStock * 1.5) return "médio";
  return "baixo";
}

function buildExplanation(
  name: string,
  stock: number,
  minStock: number,
  avgDaily: number,
  daysLeft: number,
  risk: RiskLevel
): string {
  if (risk === "crítico") {
    if (stock <= minStock) {
      return `${name} está abaixo do estoque mínimo (${stock} un. / mínimo: ${minStock} un.). Reposição imediata necessária.`;
    }
    return `${name} acabará em aproximadamente ${daysLeft} dia(s) com o ritmo atual de ${avgDaily.toFixed(1)} un./dia.`;
  }
  if (risk === "alto") {
    return `${name} tem estoque para apenas ~${daysLeft} dias. Venda média: ${avgDaily.toFixed(1)} un./dia. Considere repor em breve.`;
  }
  if (risk === "médio") {
    return `${name} tem estoque para ~${daysLeft} dias. Acompanhe o ritmo de vendas para evitar ruptura.`;
  }
  if (avgDaily === 0) {
    return `${name} não teve vendas nos últimos 30 dias. Avalie se o produto ainda é relevante.`;
  }
  return `${name} está bem abastecido. Estoque para ~${daysLeft} dias com a venda atual.`;
}

/** Retorna apenas os produtos com risco crítico ou alto */
export function getCriticalForecasts(forecasts: StockForecast[]): StockForecast[] {
  return forecasts.filter((f) => f.riskLevel === "crítico" || f.riskLevel === "alto");
}

/** Formata os forecasts em texto para injetar no prompt da IA */
export function forecastsToContext(forecasts: StockForecast[]): string {
  const critical = forecasts.filter((f) => f.riskLevel === "crítico" || f.riskLevel === "alto");
  if (critical.length === 0) return "Nenhum produto em risco crítico ou alto no momento.";

  return critical
    .map(
      (f) =>
        `• ${f.productName}: ${f.currentStock} un. em estoque, risco ${f.riskLevel}, ~${
          f.daysUntilStockout === Infinity ? "∞" : f.daysUntilStockout
        } dias até ruptura. Sugestão: repor ${f.suggestedRestock} un.`
    )
    .join("\n");
}
