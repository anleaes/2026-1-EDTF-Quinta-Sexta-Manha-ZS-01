import { Package, TrendingUp, FileText } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { useStoreContext } from "@/context/StoreContext";
import { formatCurrency } from "@/utils/formatters";
import { MOCK_CATEGORY_DATA } from "@/data/mockData";

export function InventoryStats() {
  const { products } = useStoreContext();
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const totalItems = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard title="Total de Produtos" value={products.length}
          icon={<Package className="w-6 h-6 text-blue-600" />} iconBg="bg-blue-100" />
        <StatsCard title="Valor Total em Estoque" value={formatCurrency(totalValue)}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />} iconBg="bg-green-100" />
        <StatsCard title="Itens no Estoque" value={totalItems}
          icon={<FileText className="w-6 h-6 text-purple-600" />} iconBg="bg-purple-100" />
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Estoque por Categoria</h3>
        <div className="space-y-3">
          {MOCK_CATEGORY_DATA.map((cat) => {
            const pct = Math.min((cat.totalItems / 100) * 100, 100);
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{cat.totalItems} itens</span>
                    <span className="font-semibold text-foreground">{formatCurrency(cat.totalValue)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Lista de Produtos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Produto", "Categoria", "Estoque", "Mín.", "Preço Unit.", "Valor Total"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{p.code}</p>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className={p.stock <= p.minStock ? "font-bold text-orange-600" : "text-foreground"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.minStock}</td>
                  <td className="px-5 py-3.5 text-foreground">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3.5 font-semibold text-foreground">{formatCurrency(p.stock * p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
