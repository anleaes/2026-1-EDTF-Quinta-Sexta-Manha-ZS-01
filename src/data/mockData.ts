// ============================================================
// MOCK DATA
// Dados simulados — serão substituídos pelo Supabase
// ============================================================

import type { Product } from "@/types";
import type { Sale } from "@/types";
import type { DailySalesData, TopSellingProduct } from "@/types";
import type { CategoryInventory } from "@/types";

// ─── Produtos ───────────────────────────────────────────────
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
];

// ─── Vendas ─────────────────────────────────────────────────
export const MOCK_SALES: Sale[] = [
  { id: 1, date: "2026-06-10", product: "Arroz Tipo 1", productId: 1, quantity: 3, total: 86.7, customer: "João Silva" },
  { id: 2, date: "2026-06-10", product: "Feijão Preto", productId: 2, quantity: 5, total: 42.5, customer: "Maria Santos" },
  { id: 3, date: "2026-06-10", product: "Óleo de Soja", productId: 3, quantity: 2, total: 15.98, customer: "Pedro Costa" },
  { id: 4, date: "2026-06-09", product: "Café Torrado", productId: 5, quantity: 4, total: 63.6, customer: "Ana Oliveira" },
  { id: 5, date: "2026-06-09", product: "Arroz Tipo 1", productId: 1, quantity: 2, total: 57.8, customer: "Carlos Lima" },
  { id: 6, date: "2026-06-08", product: "Açúcar Refinado", productId: 4, quantity: 10, total: 45.0, customer: "Lucia Mendes" },
  { id: 7, date: "2026-06-08", product: "Leite Integral", productId: 6, quantity: 6, total: 32.94, customer: "Roberto Alves" },
  { id: 8, date: "2026-06-07", product: "Café Torrado", productId: 5, quantity: 3, total: 47.7, customer: "Fernanda Lima" },
];

// ─── Dados de Gráficos ───────────────────────────────────────
export const MOCK_WEEKLY_SALES: DailySalesData[] = [
  { name: "Seg", vendas: 2400 },
  { name: "Ter", vendas: 1398 },
  { name: "Qua", vendas: 3800 },
  { name: "Qui", vendas: 3908 },
  { name: "Sex", vendas: 4800 },
  { name: "Sáb", vendas: 5200 },
  { name: "Dom", vendas: 2800 },
];

export const MOCK_CATEGORY_DATA: CategoryInventory[] = [
  { name: "Grãos", totalItems: 62, totalValue: 1850, productCount: 3, color: "#2563eb" },
  { name: "Bebidas", totalItems: 25, totalValue: 397.5, productCount: 1, color: "#7c3aed" },
  { name: "Óleos", totalItems: 30, totalValue: 239.7, productCount: 1, color: "#db2777" },
  { name: "Açúcares", totalItems: 8, totalValue: 36.0, productCount: 1, color: "#ea580c" },
  { name: "Laticínios", totalItems: 60, totalValue: 329.4, productCount: 1, color: "#16a34a" },
  { name: "Limpeza", totalItems: 18, totalValue: 232.2, productCount: 1, color: "#0891b2" },
];

export const MOCK_TOP_PRODUCTS: TopSellingProduct[] = [
  { name: "Arroz Tipo 1", sales: 45, revenue: 1300.5, trend: "up" },
  { name: "Café Torrado", sales: 38, revenue: 604.2, trend: "up" },
  { name: "Leite Integral", sales: 34, revenue: 186.66, trend: "stable" },
  { name: "Óleo de Soja", sales: 32, revenue: 255.68, trend: "down" },
  { name: "Feijão Preto", sales: 28, revenue: 238.0, trend: "stable" },
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
