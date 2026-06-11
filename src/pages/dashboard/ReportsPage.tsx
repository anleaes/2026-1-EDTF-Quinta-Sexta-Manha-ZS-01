import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { MOCK_WEEKLY_SALES, MOCK_CATEGORY_DATA, MOCK_TOP_PRODUCTS } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus };
const TREND_COLOR = { up: "text-green-600", down: "text-red-500", stable: "text-muted-foreground" };

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vendas por dia */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-1">Vendas por Dia</h3>
          <p className="text-xs text-muted-foreground mb-5">Últimos 7 dias</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_WEEKLY_SALES} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Vendas"]} />
              <Bar dataKey="vendas" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por categoria */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-1">Distribuição por Categoria</h3>
          <p className="text-xs text-muted-foreground mb-5">Itens em estoque</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={MOCK_CATEGORY_DATA} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="totalItems">
                {MOCK_CATEGORY_DATA.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(v: number, _n: string, props: { payload?: { name?: string } }) => [`${v} itens`, props.payload?.name ?? ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produtos mais vendidos */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-1">Produtos Mais Vendidos</h3>
        <p className="text-xs text-muted-foreground mb-5">Top 5 do período</p>
        <div className="space-y-3">
          {MOCK_TOP_PRODUCTS.map((item, i) => {
            const trend = item.trend ?? "stable";
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
      </div>
    </div>
  );
}
