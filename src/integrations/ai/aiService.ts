// ============================================================
// AI SERVICE — Google Gemini Integration
// Assistente inteligente com contexto completo do negócio
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIInsight, AIMessage } from "./types";

export type { AIInsight, AIMessage };

// ─── Configuração ────────────────────────────────────────────
const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY as string;

export const AI_READY = !!(GEMINI_API_KEY && GEMINI_API_KEY.length > 10 && !GEMINI_API_KEY.includes("sua-chave"));

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

// ─── System Prompt com contexto do negócio ───────────────────
export function buildSystemPrompt(storeContext: Record<string, unknown>): string {
  return `Você é a Prateleira IA, assistente inteligente de gestão de estoque para pequenos negócios.
Você fala em português brasileiro de forma amigável, concisa e direta.

CONTEXTO ATUAL DO NEGÓCIO:
${JSON.stringify(storeContext, null, 2)}

SUAS RESPONSABILIDADES:
- Responder perguntas sobre o estoque, vendas e produtos do negócio
- Identificar produtos com estoque baixo (abaixo do mínimo)
- Analisar tendências de vendas
- Sugerir ações de reposição
- Calcular valores totais, médias e projeções
- Dar conselhos práticos baseados nos dados reais

REGRAS:
- Use os dados do contexto para responder com precisão
- Seja objetivo e prático (máximo 3-4 parágrafos por resposta)
- Use emojis moderadamente para deixar mais amigável
- Se não souber algo, diga claramente
- Nunca invente dados que não estão no contexto
- Formate valores monetários em Reais (R$)`;
}

// ─── Envio de mensagem para o assistente ─────────────────────
export async function sendMessageToAssistant(
  messages: AIMessage[],
  storeContext: Record<string, unknown>
): Promise<string> {
  // Fallback inteligente se não tiver API key configurada
  if (!AI_READY) {
    return generateSmartFallback(messages, storeContext);
  }

  try {
    const model = getGenAI().getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: buildSystemPrompt(storeContext),
    });

    // Converter histórico para formato do Gemini
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  } catch (error: unknown) {
    console.error("[AI Service] Erro ao chamar Gemini:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes("API_KEY") || errMsg.includes("403")) {
      return "❌ Chave de API inválida. Verifique o valor de `VITE_GEMINI_API_KEY` no `.env.local`.";
    }
    return "⚠️ Não consegui conectar ao assistente agora. Tente novamente em alguns instantes.";
  }
}

// ─── Fallback inteligente baseado nos dados locais ───────────
function generateSmartFallback(
  messages: AIMessage[],
  context: Record<string, unknown>
): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  const products = (context.products as Array<{
    name: string; stock: number; minStock: number; price: number; category: string;
  }>) ?? [];

  const lowStock = products.filter((p) => p.stock < p.minStock);
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  if (lowStock.length > 0 && (lastMsg.includes("estoque") || lastMsg.includes("repor") || lastMsg.includes("baixo"))) {
    return `⚠️ **${lowStock.length} produto(s) precisam de reposição urgente:**\n\n${lowStock
      .map((p) => `• **${p.name}**: ${p.stock} un. (mínimo: ${p.minStock})`)
      .join("\n")}\n\nRecomendo priorizar esses itens no próximo pedido de compra!`;
  }

  if (lastMsg.includes("valor") || lastMsg.includes("total") || lastMsg.includes("estoque vale")) {
    return `📦 **Valor total do estoque:** R$ ${totalValue.toFixed(2)}\n\nVocê tem **${products.length} produtos** cadastrados.`;
  }

  if (lastMsg.includes("vend") || lastMsg.includes("relat")) {
    return `📊 Para ver relatórios detalhados, acesse a seção **Relatórios** no menu lateral. Lá você encontra o histórico completo de vendas por período.`;
  }

  return `Olá! 👋 Sou a **Prateleira IA**.\n\nPara me usar com inteligência completa, adicione sua chave de API Gemini em \`.env.local\`:\n\`\`\`\nVITE_GEMINI_API_KEY=sua-chave-aqui\n\`\`\`\n\nObtê-la gratuitamente em: **aistudio.google.com**\n\nPor enquanto, posso responder perguntas básicas sobre estoque baixo e totais.`;
}

// ─── Geração de insights automáticos ────────────────────────
export async function generateStockInsights(
  productData: Array<{ name: string; stock: number; minStock: number; price: number; category: string }>
): Promise<AIInsight[]> {
  const lowStock = productData.filter((p) => p.stock < p.minStock);
  const insights: AIInsight[] = [];

  // Produtos com estoque crítico
  lowStock.slice(0, 2).forEach((p, i) => {
    insights.push({
      id: `ins_low_${i}`,
      type: "restock",
      title: `Reposição: ${p.name}`,
      description: `Estoque atual (${p.stock} un.) abaixo do mínimo (${p.minStock} un.). Reponha urgentemente.`,
      priority: "high",
      confidence: 0.99,
      createdAt: new Date().toISOString(),
    });
  });

  // Insight geral de valor
  const totalValue = productData.reduce((s, p) => s + p.stock * p.price, 0);
  insights.push({
    id: "ins_value",
    type: "report",
    title: "Valor total em estoque",
    description: `Seu estoque atual vale R$ ${totalValue.toFixed(2)} distribuído em ${productData.length} produtos.`,
    priority: "low",
    confidence: 1,
    createdAt: new Date().toISOString(),
  });

  return insights.length > 0 ? insights : MOCK_AI_INSIGHTS;
}

// ─── Mock insights para desenvolvimento ─────────────────────
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins_001",
    type: "restock",
    title: "Reposição Urgente: Feijão Preto",
    description: "Com base no ritmo de vendas, o Feijão Preto está abaixo do estoque mínimo. Reponha pelo menos 30 unidades.",
    priority: "high",
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
