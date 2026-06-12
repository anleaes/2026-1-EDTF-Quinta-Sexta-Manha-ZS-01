import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Send, Sparkles, Bot, User, RotateCcw,
  Package, TrendingDown, ShoppingCart, BarChart3, AlertTriangle,
} from "lucide-react";
import { sendMessageToAssistant, AI_READY } from "@/integrations/ai/aiService";
import type { AIMessage } from "@/integrations/ai/types";
import { calculateStockForecasts, forecastsToContext } from "@/integrations/ai/stockForecast";
import { useStoreContext } from "@/context/StoreContext";
import { isDemoSession } from "@/integrations/supabase/client";
import { MOCK_PRODUCTS, MOCK_SALES } from "@/data/mockData";
import { cn } from "@/components/ui/utils";

// ─── Sugestões rápidas ────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  { icon: AlertTriangle, text: "Quais produtos têm risco crítico de ruptura?" },
  { icon: TrendingDown,  text: "O que devo repor hoje?" },
  { icon: ShoppingCart,  text: "Como foram as vendas esta semana?" },
  { icon: BarChart3,     text: "Quanto vale meu estoque total?" },
  { icon: Package,       text: "Quais produtos não tiveram vendas recentes?" },
];

const WELCOME_MESSAGE: AIMessage = {
  role: "assistant",
  content: `Olá! 👋 Sou a **Prateleira IA**, sua assistente de gestão de estoque.\n\nAnaliso seus produtos, vendas e risco de ruptura em tempo real. Use as sugestões abaixo ou faça qualquer pergunta!`,
  timestamp: new Date().toISOString(),
};

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pré-popula o chat com uma pergunta ao abrir */
  initialQuestion?: string;
}

// ─── Bubble de mensagem ───────────────────────────────────────
function MessageBubble({ msg }: { msg: AIMessage }) {
  const isUser = msg.role === "user";

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 rounded text-[11px] font-mono">$1</code>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5",
          isUser
            ? "bg-primary text-white"
            : "bg-gradient-to-br from-violet-500 to-purple-700 text-white"
        )}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
        )}
      >
        {renderContent(msg.content)}
      </div>
    </motion.div>
  );
}

// ─── Indicador de digitação ───────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-violet-400 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Painel principal ─────────────────────────────────────────
export function AIChatPanel({ isOpen, onClose, initialQuestion }: AIChatPanelProps) {
  const { products, sales } = useStoreContext();
  const isDemo = isDemoSession();

  const [messages, setMessages] = useState<AIMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Usar dados reais ou mock dependendo do modo
  const effectiveProducts = isDemo ? MOCK_PRODUCTS : products;
  const effectiveSales = isDemo ? MOCK_SALES : sales;

  // Calcular previsões de estoque com dados reais
  const forecasts = calculateStockForecasts(effectiveProducts, effectiveSales);

  // Contexto completo do negócio para injetar no prompt
  const storeContext = {
    products: effectiveProducts.map((p) => ({
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.minStock,
      price: p.price,
      status: p.status,
    })),
    lowStockProducts: effectiveProducts.filter((p) => p.stock <= p.minStock).map((p) => p.name),
    totalProducts: effectiveProducts.length,
    totalStockValue: effectiveProducts.reduce((s, p) => s + p.stock * p.price, 0).toFixed(2),
    recentSalesCount: effectiveSales.length,
    stockForecasts: forecastsToContext(forecasts),
    currentDate: new Date().toLocaleDateString("pt-BR"),
    isDemo,
  };

  // Scroll automático
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Foco e envio de initialQuestion ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (initialQuestion) {
        setMessages([WELCOME_MESSAGE]);
        setTimeout(() => sendMessage(initialQuestion), 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialQuestion]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: AIMessage = {
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);

      try {
        const allMessages = [...messages, userMsg];
        const response = await sendMessageToAssistant(allMessages, storeContext);
        const assistantMsg: AIMessage = {
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, storeContext]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue("");
  };

  const showSuggestions = messages.length <= 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 380, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 380, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={cn(
              "fixed right-4 bottom-20 z-50",
              "w-[360px] h-[580px] max-h-[calc(100vh-6rem)]",
              "bg-gray-50 rounded-2xl shadow-2xl border border-border",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-none">Prateleira IA</p>
                <p className="text-[11px] text-violet-200 mt-0.5">
                  {AI_READY ? "● Conectada ao Gemini" : "● Análise local"}
                </p>
              </div>
              <button
                onClick={handleReset}
                title="Reiniciar conversa"
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                title="Fechar"
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {isLoading && <TypingIndicator />}

              {showSuggestions && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 space-y-2"
                >
                  <p className="text-[11px] text-muted-foreground text-center font-medium uppercase tracking-wide">
                    Sugestões rápidas
                  </p>
                  {QUICK_SUGGESTIONS.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => sendMessage(text)}
                      className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 bg-white hover:bg-violet-50 border border-border hover:border-violet-200 rounded-xl transition-all text-xs text-foreground group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-3 h-3 text-violet-600" />
                      </div>
                      {text}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-border flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte sobre seu estoque..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                  id="ai-chat-input"
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                Dados reais do seu estoque • Powered by Google Gemini
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
