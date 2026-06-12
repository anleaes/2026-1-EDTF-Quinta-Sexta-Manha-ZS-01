import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle, TrendingDown, CheckCircle2,
  ChevronDown, ChevronUp, MessageCircle, Package,
} from "lucide-react";
import { useStoreContext } from "@/context/StoreContext";
import {
  calculateStockForecasts,
  type StockForecast,
  type RiskLevel,
} from "@/integrations/ai/stockForecast";
import { cn } from "@/components/ui/utils";
import { AIChatPanel } from "./AIChatPanel";

// ─── Estilos por nível de risco ─────────────────────────────
const RISK_STYLES: Record<RiskLevel, {
  badge: string; icon: typeof AlertTriangle; iconColor: string; row: string;
}> = {
  crítico: {
    badge: "bg-red-100 text-red-700 border border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    row: "border-l-2 border-l-red-400",
  },
  alto: {
    badge: "bg-orange-100 text-orange-700 border border-orange-200",
    icon: TrendingDown,
    iconColor: "text-orange-500",
    row: "border-l-2 border-l-orange-400",
  },
  médio: {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: TrendingDown,
    iconColor: "text-amber-500",
    row: "border-l-2 border-l-amber-300",
  },
  baixo: {
    badge: "bg-green-100 text-green-700 border border-green-200",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    row: "",
  },
};

// ─── Card de linha de produto ────────────────────────────────
function ForecastRow({ forecast, onAsk }: { forecast: StockForecast; onAsk: (q: string) => void }) {
  const style = RISK_STYLES[forecast.riskLevel];
  const Icon = style.icon;
  const daysText =
    forecast.daysUntilStockout === Infinity
      ? "Sem vendas"
      : `~${forecast.daysUntilStockout} dias`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:shadow-sm transition-shadow pl-4",
        style.row
      )}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0", style.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{forecast.productName}</p>
        <p className="text-xs text-muted-foreground">
          {forecast.currentStock} un. • {daysText}
          {forecast.avgDailySales > 0 && ` • ${forecast.avgDailySales.toFixed(1)}/dia`}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", style.badge)}>
          {forecast.riskLevel}
        </span>
        {forecast.riskLevel !== "baixo" && (
          <button
            onClick={() => onAsk(`Por que ${forecast.productName} está em risco de ruptura e o que devo fazer?`)}
            title="Perguntar à IA"
            className="w-6 h-6 rounded-lg bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
          >
            <MessageCircle className="w-3 h-3 text-violet-600" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Componente principal ────────────────────────────────────
export function StockForecastCard() {
  const { products, sales } = useStoreContext();
  const [showAll, setShowAll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>();

  const forecasts = useMemo(
    () => calculateStockForecasts(products, sales),
    [products, sales]
  );

  const criticalCount = forecasts.filter(
    (f) => f.riskLevel === "crítico" || f.riskLevel === "alto"
  ).length;

  const displayed = showAll ? forecasts : forecasts.slice(0, 4);

  const handleAsk = (question: string) => {
    setInitialQuestion(question);
    setIsChatOpen(true);
  };

  return (
    <>
      <AIChatPanel
        isOpen={isChatOpen}
        onClose={() => { setIsChatOpen(false); setInitialQuestion(undefined); }}
        initialQuestion={initialQuestion}
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-violet-50 to-white">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Previsão de Estoque</h3>
            <p className="text-xs text-muted-foreground">Análise de risco por produto</p>
          </div>
          {criticalCount > 0 && (
            <span className="text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Lista */}
        <div className="p-4 space-y-2">
          {products.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-4">
              Nenhum produto cadastrado.
            </p>
          ) : (
            displayed.map((f) => (
              <ForecastRow key={f.productId} forecast={f} onAsk={handleAsk} />
            ))
          )}
        </div>

        {/* Ações */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => { setInitialQuestion(undefined); setIsChatOpen(true); }}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Perguntar à IA
          </button>
          {forecasts.length > 4 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-3 py-2.5 border border-border rounded-lg hover:bg-gray-50 text-muted-foreground hover:text-foreground transition-colors"
              title={showAll ? "Ver menos" : "Ver todos"}
            >
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
