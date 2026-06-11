import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MOCK_CATEGORY_DATA } from "@/data/mockData";

export function CategoryChart() {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Produtos por Categoria</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribuição de itens em estoque</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={MOCK_CATEGORY_DATA}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="totalItems"
          >
            {MOCK_CATEGORY_DATA.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
            formatter={(v: number, _n: string, props: { payload?: { name?: string } }) => [
              `${v} itens`,
              props.payload?.name ?? "",
            ]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
