// ============================================================
// PRODUCT TYPES
// Interfaces prontas para integração com Supabase
// Tabela: products
// ============================================================

export type ProductStatus = "Ativo" | "Inativo";

export type ProductCategory =
  | "Grãos"
  | "Bebidas"
  | "Óleos"
  | "Açúcares"
  | "Laticínios"
  | "Hortifruti"
  | "Limpeza"
  | "Higiene"
  | "Carnes"
  | "Padaria"
  | "Congelados"
  | "Outros";

/** Produto completo — espelho da tabela `products` no Supabase */
export interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  category: ProductCategory | string;
  stock: number;
  minStock: number;
  price: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Campos do formulário de produto (sem id e timestamps) */
export interface ProductFormData {
  name: string;
  description: string;
  code: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: ProductStatus;
}

/** Resumo para listagens e relatórios */
export interface ProductSummary {
  id: number;
  name: string;
  code: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: ProductStatus;
  isLowStock: boolean;
  stockValue: number;
}

/** Dados de inventário por categoria */
export interface CategoryInventory {
  name: string;
  totalItems: number;
  totalValue: number;
  productCount: number;
  color: string;
}

/** Input para criação de produto */
export type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

/** Input para atualização de produto */
export type UpdateProductInput = Partial<CreateProductInput>;
