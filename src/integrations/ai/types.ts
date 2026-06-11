// ─── Tipos compartilhados do serviço de IA ───────────────────

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
