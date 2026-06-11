import type { Product } from "@/types";
import type { Sale } from "@/types";
import type { DailySalesData, TopSellingProduct } from "@/types";
import type { CategoryInventory } from "@/types";

// ─── Produtos Simulados (14 Itens) ──────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Arroz Tipo 1",
    description: "Pacote 5kg",
    code: "ARR001",
    category: "Grãos",
    stock: 45,
    minStock: 20,
    price: 28.9,
    status: "Ativo",
  },
  {
    id: 2,
    name: "Feijão Preto",
    description: "Pacote 1kg",
    code: "FEJ002",
    category: "Grãos",
    stock: 12,
    minStock: 15,
    price: 8.5,
    status: "Ativo",
  },
  {
    id: 3,
    name: "Óleo de Soja",
    description: "Garrafa 900ml",
    code: "OLE003",
    category: "Óleos",
    stock: 30,
    minStock: 10,
    price: 7.99,
    status: "Ativo",
  },
  {
    id: 4,
    name: "Açúcar Refinado",
    description: "Pacote 1kg",
    code: "ACU004",
    category: "Açúcares",
    stock: 8,
    minStock: 20,
    price: 4.5,
    status: "Ativo",
  },
  {
    id: 5,
    name: "Café Torrado",
    description: "Pacote 500g",
    code: "CAF005",
    category: "Bebidas",
    stock: 25,
    minStock: 10,
    price: 15.9,
    status: "Ativo",
  },
  {
    id: 6,
    name: "Leite Integral",
    description: "Caixa 1L",
    code: "LEI006",
    category: "Laticínios",
    stock: 60,
    minStock: 30,
    price: 5.49,
    status: "Ativo",
  },
  {
    id: 7,
    name: "Macarrão Espaguete",
    description: "Pacote 500g",
    code: "MAC007",
    category: "Grãos",
    stock: 5,
    minStock: 12,
    price: 3.99,
    status: "Ativo",
  },
  {
    id: 8,
    name: "Sabão em Pó",
    description: "Caixa 1kg",
    code: "SAB008",
    category: "Limpeza",
    stock: 18,
    minStock: 8,
    price: 12.9,
    status: "Ativo",
  },
  {
    id: 9,
    name: "Detergente Líquido",
    description: "Frasco 500ml",
    code: "DET009",
    category: "Limpeza",
    stock: 40,
    minStock: 15,
    price: 2.5,
    status: "Ativo",
  },
  {
    id: 10,
    name: "Refrigerante Cola 2L",
    code: "REF010",
    category: "Bebidas",
    description: "Garrafa Pet",
    stock: 15,
    minStock: 10,
    price: 8.99,
    status: "Ativo",
  },
  {
    id: 11,
    name: "Sabonete Barra",
    code: "SBT011",
    category: "Higiene",
    description: "Unidade 90g",
    stock: 50,
    minStock: 20,
    price: 1.99,
    status: "Ativo",
  },
  {
    id: 12,
    name: "Chocolate Barra 90g",
    code: "CHO012",
    category: "Outros",
    description: "Chocolate ao Leite",
    stock: 22,
    minStock: 8,
    price: 5.8,
    status: "Ativo",
  },
  {
    id: 13,
    name: "Farinha de Trigo 1kg",
    code: "FAR013",
    category: "Grãos",
    description: "Tipo 1 Premium",
    stock: 16,
    minStock: 10,
    price: 4.89,
    status: "Ativo",
  },
  {
    id: 14,
    name: "Biscoito Recheado",
    code: "BIS014",
    category: "Outros",
    description: "Sabor Chocolate",
    stock: 35,
    minStock: 12,
    price: 2.99,
    status: "Ativo",
  }
];

// ─── Histórico Amplo de Vendas (Junho, Julho, Agosto, Setembro 2026) ─
export const MOCK_SALES: Sale[] = [
  // --- SETEMBRO 2026 ---
  { id: 1, date: "2026-09-10", product: "Arroz Tipo 1", productId: 1, quantity: 4, total: 115.6, customer: "Julio Nogueira" },
  { id: 2, date: "2026-09-08", product: "Café Torrado", productId: 5, quantity: 2, total: 31.8, customer: "Beatriz Mota" },
  { id: 3, date: "2026-09-05", product: "Leite Integral", productId: 6, quantity: 12, total: 65.88, customer: "Carlos Eduardo" },
  { id: 4, date: "2026-09-02", product: "Refrigerante Cola 2L", productId: 10, quantity: 5, total: 44.95, customer: "Aline Sousa" },

  // --- AGOSTO 2026 ---
  { id: 5, date: "2026-08-28", product: "Feijão Preto", productId: 2, quantity: 4, total: 34.0, customer: "Mariana Dias" },
  { id: 6, date: "2026-08-25", product: "Óleo de Soja", productId: 3, quantity: 3, total: 23.97, customer: "Felipe Neto" },
  { id: 7, date: "2026-08-20", product: "Arroz Tipo 1", productId: 1, quantity: 5, total: 144.5, customer: "Renato Augusto" },
  { id: 8, date: "2026-08-15", product: "Chocolate Barra 90g", productId: 12, quantity: 10, total: 58.0, customer: "Camila Ribeiro" },
  { id: 9, date: "2026-08-12", product: "Sabão em Pó", productId: 8, quantity: 2, total: 25.8, customer: "Daniel Souza" },
  { id: 10, date: "2026-08-08", product: "Biscoito Recheado", productId: 14, quantity: 8, total: 23.92, customer: "Gisele Bündchen" },
  { id: 11, date: "2026-08-03", product: "Macarrão Espaguete", productId: 7, quantity: 6, total: 23.94, customer: "Thiago Silva" },

  // --- JULHO 2026 ---
  { id: 12, date: "2026-07-28", product: "Leite Integral", productId: 6, quantity: 10, total: 54.9, customer: "Clara Nunes" },
  { id: 13, date: "2026-07-24", product: "Farinha de Trigo 1kg", productId: 13, quantity: 5, total: 24.45, customer: "Roberto Carlos" },
  { id: 14, date: "2026-07-20", product: "Detergente Líquido", productId: 9, quantity: 12, total: 30.0, customer: "Sandra Rosa" },
  { id: 15, date: "2026-07-16", product: "Óleo de Soja", productId: 3, quantity: 4, total: 31.96, customer: "Valéria Souza" },
  { id: 16, date: "2026-07-11", product: "Café Torrado", productId: 5, quantity: 3, total: 47.7, customer: "Otávio Mesquita" },
  { id: 17, date: "2026-07-06", product: "Arroz Tipo 1", productId: 1, quantity: 3, total: 86.7, customer: "Everson Silva" },
  { id: 18, date: "2026-07-02", product: "Sabonete Barra", productId: 11, quantity: 15, total: 29.85, customer: "Luiz Gonzaga" },

  // --- JUNHO 2026 (Mês Atual) ---
  { id: 19, date: "2026-06-11", product: "Farinha de Trigo 1kg", productId: 13, quantity: 2, total: 9.78, customer: "Marisa Monte" },
  { id: 20, date: "2026-06-10", product: "Arroz Tipo 1", productId: 1, quantity: 3, total: 86.7, customer: "João Silva" },
  { id: 21, date: "2026-06-10", product: "Feijão Preto", productId: 2, quantity: 5, total: 42.5, customer: "Maria Santos" },
  { id: 22, date: "2026-06-10", product: "Óleo de Soja", productId: 3, quantity: 2, total: 15.98, customer: "Pedro Costa" },
  { id: 23, date: "2026-06-09", product: "Café Torrado", productId: 5, quantity: 4, total: 63.6, customer: "Ana Oliveira" },
  { id: 24, date: "2026-06-09", product: "Arroz Tipo 1", productId: 1, quantity: 2, total: 57.8, customer: "Carlos Lima" },
  { id: 25, date: "2026-06-08", product: "Açúcar Refinado", productId: 4, quantity: 10, total: 45.0, customer: "Lucia Mendes" },
  { id: 26, date: "2026-06-08", product: "Leite Integral", productId: 6, quantity: 6, total: 32.94, customer: "Roberto Alves" },
  { id: 27, date: "2026-06-07", product: "Café Torrado", productId: 5, quantity: 3, total: 47.7, customer: "Fernanda Lima" },
  { id: 28, date: "2026-06-05", product: "Refrigerante Cola 2L", productId: 10, quantity: 6, total: 53.94, customer: "Gabriel Jesus" },
  { id: 29, date: "2026-06-02", product: "Macarrão Espaguete", productId: 7, quantity: 4, total: 15.96, customer: "Bruna Marquezine" }
];

// ─── Dados de Gráficos e Distribuição ───────────────────────────
export const MOCK_WEEKLY_SALES: DailySalesData[] = [
  { name: "Seg", vendas: 2400 },
  { name: "Ter", vendas: 1898 },
  { name: "Qua", vendas: 3800 },
  { name: "Qui", vendas: 4108 },
  { name: "Sex", vendas: 4950 },
  { name: "Sáb", vendas: 5800 },
  { name: "Dom", vendas: 3100 },
];

export const MOCK_CATEGORY_DATA: CategoryInventory[] = [
  { name: "Grãos", totalItems: 78, totalValue: 2125.7, productCount: 4, color: "#2563eb" },
  { name: "Bebidas", totalItems: 40, totalValue: 532.35, productCount: 2, color: "#7c3aed" },
  { name: "Óleos", totalItems: 30, totalValue: 239.7, productCount: 1, color: "#db2777" },
  { name: "Açúcares", totalItems: 8, totalValue: 36.0, productCount: 1, color: "#ea580c" },
  { name: "Laticínios", totalItems: 60, totalValue: 329.4, productCount: 1, color: "#16a34a" },
  { name: "Limpeza", totalItems: 58, totalValue: 332.2, productCount: 2, color: "#0891b2" },
  { name: "Higiene", totalItems: 50, totalValue: 99.5, productCount: 1, color: "#f59e0b" },
];

export const MOCK_TOP_PRODUCTS: TopSellingProduct[] = [
  { name: "Arroz Tipo 1", sales: 62, revenue: 1791.8, trend: "up" },
  { name: "Café Torrado", sales: 48, revenue: 763.2, trend: "up" },
  { name: "Leite Integral", sales: 44, revenue: 241.56, trend: "stable" },
  { name: "Óleo de Soja", sales: 38, revenue: 303.62, trend: "down" },
  { name: "Feijão Preto", sales: 33, revenue: 280.5, trend: "stable" },
];

// ─── Contas Google simuladas ─────────────────────────────────
export const MOCK_GOOGLE_ACCOUNTS = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Joao+Silva&background=4285F4&color=fff",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=EA4335&color=fff",
  },
];
