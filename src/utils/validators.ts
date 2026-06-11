// ============================================================
// VALIDATORS
// Funções de validação para formulários
// ============================================================

import type { ProductFormData } from "@/types";
import type { SaleFormData } from "@/types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ─── Produto ────────────────────────────────────────────────
export function validateProduct(data: ProductFormData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Nome deve ter pelo menos 2 caracteres." });
  }

  if (!data.code || data.code.trim().length === 0) {
    errors.push({ field: "code", message: "Código é obrigatório." });
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: "category", message: "Categoria é obrigatória." });
  }

  if (data.price <= 0) {
    errors.push({ field: "price", message: "Preço deve ser maior que zero." });
  }

  if (data.stock < 0) {
    errors.push({ field: "stock", message: "Estoque não pode ser negativo." });
  }

  if (data.minStock < 0) {
    errors.push({ field: "minStock", message: "Estoque mínimo não pode ser negativo." });
  }

  return { isValid: errors.length === 0, errors };
}

// ─── Venda ──────────────────────────────────────────────────
export function validateSale(
  data: SaleFormData,
  availableStock: number
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.productId) {
    errors.push({ field: "productId", message: "Selecione um produto." });
  }

  if (data.quantity <= 0) {
    errors.push({ field: "quantity", message: "Quantidade deve ser maior que zero." });
  }

  if (data.quantity > availableStock) {
    errors.push({
      field: "quantity",
      message: `Estoque insuficiente. Disponível: ${availableStock} unidades.`,
    });
  }

  if (!data.customer || data.customer.trim().length < 2) {
    errors.push({ field: "customer", message: "Nome do cliente é obrigatório." });
  }

  return { isValid: errors.length === 0, errors };
}

// ─── Email ──────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ─── Senha ──────────────────────────────────────────────────
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (password.length < 6) {
    errors.push({ field: "password", message: "Senha deve ter pelo menos 6 caracteres." });
  }

  return { isValid: errors.length === 0, errors };
}

// ─── Helpers ────────────────────────────────────────────────
export function getFieldError(
  errors: ValidationError[],
  field: string
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
