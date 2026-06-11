import { Sparkles, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { MOCK_AI_INSIGHTS } from "@/integrations/ai/aiService";
import { cn } from "@/components/ui/utils";

const PRIORITY_STYLES = {
  high:   { icon: AlertTriangle, bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  medium: { icon: TrendingUp,    bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200"  },
  low:    { icon: BarChart3,     bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200"   },
};

export function AIInsightsCard() {
  return (
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
        <span className="ml-auto text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Em breve
        </span>
      </div>

      {/* Insights preview */}
      <div className="p-4 space-y-2.5">
        {MOCK_AI_INSIGHTS.map((insight) => {
          const style = PRIORITY_STYLES[insight.priority];
          const Icon = style.icon;
          return (
            <div
              key={insight.id}
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
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs text-center text-muted-foreground bg-gray-50 rounded-lg py-2.5 border border-border">
          🤖 Análise completa disponível após integração com IA
        </div>
      </div>
    </div>
  );
}
