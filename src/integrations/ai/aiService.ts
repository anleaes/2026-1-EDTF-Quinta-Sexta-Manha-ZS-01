// ============================================================
// AI SERVICE
// Estrutura preparada para integração futura com IA
// O assistente de IA analisará estoque, vendas e projetará demandas
// ============================================================
//
// INTEGRAÇÕES PLANEJADAS:
// ─ Anthropic Claude API (análise de dados, sugestões de texto)
// ─ Vercel AI SDK (streaming de respostas)
// ─ Supabase Edge Functions (processamento server-side)
//
// FUNCIONALIDADES FUTURAS:
// ─ Assistente de estoque em linguagem natural
// ─ Sugestões automáticas de reposição
// ─ Análise de padrões de venda
// ─ Previsão de demanda por produto/período
// ─ Detecção de anomalias (vendas incomuns, perdas)
// ─ Relatórios automáticos em linguagem natural
// ─ Alertas preditivos antes do estoque acabar
//
// ============================================================

export interface AIInsight {
  id: string;
  type: "restock" | "trend" | "alert" | "forecast" | "report";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  productId?: number;
  confidence: number; // 0-1
  createdAt: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIAnalysisRequest {
  type: "stock" | "sales" | "forecast" | "general";
  data: Record<string, unknown>;
  question?: string;
}

export interface AIAnalysisResponse {
  answer: string;
  insights: AIInsight[];
  suggestions: string[];
  confidence: number;
}

/** Placeholder: Gera insights automáticos de estoque
 * @future Chamar Anthropic API com dados do Supabase
 */
export async function generateStockInsights(
  _productData: unknown[]
): Promise<AIInsight[]> {
  // TODO: Implementar chamada para API de IA
  // Exemplo com Vercel AI SDK:
  // const { text } = await generateText({
  //   model: anthropic('claude-opus-4-5'),
  //   prompt: `Analise este estoque: ${JSON.stringify(_productData)}...`,
  // });

  console.warn("[AI Service] generateStockInsights: não implementado ainda");
  return MOCK_AI_INSIGHTS;
}

/** Placeholder: Envia mensagem para o assistente de IA
 * @future Streaming via Vercel AI SDK + Supabase Edge Functions
 */
export async function sendMessageToAssistant(
  _messages: AIMessage[],
  _storeContext: Record<string, unknown>
): Promise<string> {
  // TODO: Implementar chat com IA
  console.warn("[AI Service] sendMessageToAssistant: não implementado ainda");
  return "O assistente de IA estará disponível em breve! 🤖";
}

/** Placeholder: Previsão de demanda
 * @future Modelo de ML treinado com histórico de vendas
 */
export async function forecastDemand(
  _productId: number,
  _days: number
): Promise<{ date: string; predictedSales: number }[]> {
  console.warn("[AI Service] forecastDemand: não implementado ainda");
  return [];
}

// ─── Mock insights para desenvolvimento ─────────────────────
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins_001",
    type: "restock",
    title: "Reposição Urgente: Feijão Preto",
    description: "Com base no ritmo de vendas, o Feijão Preto deve acabar em ~2 dias. Reponha pelo menos 30 unidades.",
    priority: "high",
    productId: 2,
    confidence: 0.92,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ins_002",
    type: "trend",
    title: "Alta demanda nas sextas-feiras",
    description: "Vendas aumentam 35% às sextas. Considere aumentar o estoque de Arroz e Feijão nesse dia.",
    priority: "medium",
    confidence: 0.85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ins_003",
    type: "forecast",
    title: "Previsão para a próxima semana",
    description: "Estimativa: R$ 4.200 em vendas na próxima semana, alta de 12% vs. semana passada.",
    priority: "low",
    confidence: 0.78,
    createdAt: new Date().toISOString(),
  },
];

export const AI_READY = false; // Alterar para true após configurar a API de IA
