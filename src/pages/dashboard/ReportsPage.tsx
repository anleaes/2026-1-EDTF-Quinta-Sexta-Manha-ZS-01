import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useStoreContext } from "@/context/StoreContext";
import { formatCurrency } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { calculateStockForecasts } from "@/integrations/ai/stockForecast";
import { isDemoSession } from "@/integrations/supabase/client";
import { MOCK_PRODUCTS, MOCK_SALES } from "@/data/mockData";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus };
const TREND_COLOR = { up: "text-green-600", down: "text-red-500", stable: "text-muted-foreground" };
const CATEGORY_COLORS = [
  "#2563eb","#7c3aed","#db2777","#ea580c",
  "#16a34a","#0891b2","#f59e0b","#64748b",
];

function buildLast7Days(sales: typeof MOCK_SALES) {
  const result: { name: string; vendas: number }[] = [];
  const DAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    const dayName = DAY_NAMES[d.getDay()];
    const total = sales
      .filter((s) => s.date === iso)
      .reduce((sum, s) => sum + s.total, 0);
    result.push({ name: dayName, vendas: Math.round(total) });
  }
  return result;
}

function buildTopProducts(sales: typeof MOCK_SALES) {
  const map: Record<string, { name: string; sales: number; revenue: number }> = {};
  sales.forEach((s) => {
    if (!map[s.product]) map[s.product] = { name: s.product, sales: 0, revenue: 0 };
    map[s.product].sales += s.quantity;
    map[s.product].revenue += s.total;
  });
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p, i) => ({
      ...p,
      trend: i === 0 ? "up" : i === 4 ? "down" : "stable",
    }));
}

function buildCategoryData(products: typeof MOCK_PRODUCTS) {
  const map: Record<string, { name: string; totalItems: number; totalValue: number; productCount: number }> = {};
  products.forEach((p) => {
    if (!map[p.category]) map[p.category] = { name: p.category, totalItems: 0, totalValue: 0, productCount: 0 };
    map[p.category].totalItems += p.stock;
    map[p.category].totalValue += p.stock * p.price;
    map[p.category].productCount += 1;
  });
  return Object.values(map).sort((a, b) => b.totalValue - a.totalValue);
}

export function ReportsPage() {
  const { products, sales, salesSummary } = useStoreContext();
  const isDemo = isDemoSession();

  const effectiveProducts = isDemo ? MOCK_PRODUCTS : products;
  const effectiveSales = isDemo ? MOCK_SALES : sales;

  const weeklySales = useMemo(() => buildLast7Days(effectiveSales), [effectiveSales]);
  const topProducts = useMemo(() => buildTopProducts(effectiveSales), [effectiveSales]);
  const categoryData = useMemo(() => buildCategoryData(effectiveProducts), [effectiveProducts]);
  const forecasts = useMemo(
    () => calculateStockForecasts(effectiveProducts, effectiveSales),
    [effectiveProducts, effectiveSales]
  );
  const atRisk = forecasts.filter((f) => f.riskLevel === "crítico" || f.riskLevel === "alto");

  const thisMonth = new Date().toISOString().substring(0, 7);
  const thisMonthSales = effectiveSales.filter((s) => s.date.startsWith(thisMonth));
  const totalMonth = thisMonthSales.reduce((s, sale) => s + sale.total, 0);
  const ticketMedio = effectiveSales.length > 0
    ? effectiveSales.reduce((s, sale) => s + sale.total, 0) / effectiveSales.length
    : 0;

  return (
    <div className="space-y-6">
      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total este mês", value: formatCurrency(totalMonth), color: "bg-green-100 text-green-700" },
          { label: "Ticket médio", value: formatCurrency(ticketMedio), color: "bg-blue-100 text-blue-700" },
          { label: "Total de vendas", value: `${effectiveSales.length} vendas`, color: "bg-violet-100 text-violet-700" },
          { label: "Produtos em risco", value: `${atRisk.length} produto(s)`, color: atRisk.length > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
            <p className={`text-lg font-bold px-2 py-0.5 rounded-lg inline-block ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vendas por dia — últimos 7 dias */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-1">Vendas por Dia</h3>
          <p className="text-xs text-muted-foreground mb-5">Últimos 7 dias (dados reais)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklySales} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Vendas"]}
              />
              <Bar dataKey="vendas" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por categoria */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-1">Distribuição por Categoria</h3>
          <p className="text-xs text-muted-foreground mb-5">Valor em estoque por categoria</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="totalItems"
              >
                {categoryData.map((e, idx) => (
                  <Cell key={e.name} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(v: number, _n: string, props: { payload?: { name?: string } }) => [
                  `${v} itens`, props.payload?.name ?? "",
                ]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produtos mais vendidos */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-1">Produtos Mais Vendidos</h3>
        <p className="text-xs text-muted-foreground mb-5">
          Top 5 por receita {isDemo ? "(dados demo)" : "(histórico completo)"}
        </p>
        {topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((item, i) => {
              const trend = (item.trend ?? "stable") as "up" | "down" | "stable";
              const Icon = TREND_ICON[trend];
              return (
                <div key={item.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sales} unidades vendidas</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                    <Icon className={`w-4 h-4 ${TREND_COLOR[trend]}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Produtos em risco de ruptura */}
      {atRisk.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-foreground">Risco de Ruptura de Estoque</h3>
            <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
              {atRisk.length} produto(s)
            </span>
          </div>
          <div className="space-y-3">
            {atRisk.map((f) => (
              <div key={f.productId} className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{f.productName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.explanation}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                    f.riskLevel === "crítico" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {f.riskLevel}
                  </span>
                  {f.suggestedRestock > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Repor: +{f.suggestedRestock} un.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
