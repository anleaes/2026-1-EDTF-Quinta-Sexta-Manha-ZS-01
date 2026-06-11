import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, BarChart3, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { generateStockInsights } from "@/integrations/ai/aiService";
import type { AIInsight } from "@/integrations/ai/types";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { AI_READY } from "@/integrations/ai/aiService";
import { cn } from "@/components/ui/utils";
import { AIChatPanel } from "./AIChatPanel";

const PRIORITY_STYLES = {
  high:   { icon: AlertTriangle, bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  medium: { icon: TrendingUp,    bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200"  },
  low:    { icon: BarChart3,     bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200"   },
};

const initialInsights: AIInsight[] = [
  {
    id: "ins_001",
    type: "restock",
    title: "Reposição Urgente: Feijão Preto",
    description: "Estoque atual (12 un.) abaixo do mínimo (15 un.). Reponha urgentemente.",
    priority: "high",
    confidence: 0.99,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ins_002",
    type: "trend",
    title: "Alta demanda nas sextas-feiras",
    description: "Vendas aumentam 35% às sextas. Aumente o estoque de Arroz e Feijão.",
    priority: "medium",
    confidence: 0.85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ins_003",
    type: "report",
    title: "Valor total em estoque",
    description: `Seu estoque vale R$ ${MOCK_PRODUCTS.reduce((s, p) => s + p.stock * p.price, 0).toFixed(2)} em ${MOCK_PRODUCTS.length} produtos.`,
    priority: "low",
    confidence: 1,
    createdAt: new Date().toISOString(),
  },
];

export function AIInsightsCard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const productData = MOCK_PRODUCTS.map((p) => ({
        name: p.name,
        stock: p.stock,
        minStock: p.minStock,
        price: p.price,
        category: p.category,
      }));
      const fresh = await generateStockInsights(productData);
      setInsights(fresh);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-violet-50 to-white">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Assistente IA</h3>
            <p className="text-xs text-muted-foreground">Insights automáticos do seu estoque</p>
          </div>
          <span
            className={cn(
              "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
              AI_READY
                ? "bg-green-100 text-green-700"
                : "bg-violet-100 text-violet-700"
            )}
          >
            {AI_READY ? "● Ativo" : "● Demo"}
          </span>
        </div>

        {/* Insights preview */}
        <div className="p-4 space-y-2.5">
          {insights.map((insight) => {
            const style = PRIORITY_STYLES[insight.priority];
            const Icon = style.icon;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  style.bg, style.border
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", style.text)} />
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold truncate", style.text)}>{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{insight.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setIsChatOpen(true)}
            id="ai-open-chat-btn"
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Conversar com IA
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Atualizar insights"
            className="px-3 py-2.5 border border-border rounded-lg hover:bg-gray-50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <motion.div animate={refreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.6, repeat: refreshing ? Infinity : 0 }}>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
      </div>
    </>
  );
}
