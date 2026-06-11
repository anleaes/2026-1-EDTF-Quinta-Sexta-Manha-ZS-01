// ============================================================
// SUPABASE DATABASE TYPES
// Tipos TypeScript do banco de dados gerados automaticamente pelo Supabase
// Execute: supabase gen types typescript --project-id seu-projeto > src/integrations/supabase/types.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // ── products ──────────────────────────────────────────
      products: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          code: string;
          category: string;
          stock: number;
          min_stock: number;
          price: number;
          status: "Ativo" | "Inativo";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          code: string;
          category: string;
          stock?: number;
          min_stock?: number;
          price: number;
          status?: "Ativo" | "Inativo";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          code?: string;
          category?: string;
          stock?: number;
          min_stock?: number;
          price?: number;
          status?: "Ativo" | "Inativo";
          updated_at?: string;
        };
      };

      // ── sales ─────────────────────────────────────────────
      sales: {
        Row: {
          id: number;
          date: string;
          product_id: number;
          product_name: string;
          quantity: number;
          total: number;
          customer: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          date: string;
          product_id: number;
          product_name: string;
          quantity: number;
          total: number;
          customer: string;
          created_at?: string;
        };
        Update: {
          customer?: string;
        };
      };

      // ── profiles ──────────────────────────────────────────
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "manager" | "operator" | "viewer";
          avatar_url: string | null;
          store_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "admin" | "manager" | "operator" | "viewer";
          avatar_url?: string | null;
          store_name?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          role?: "admin" | "manager" | "operator" | "viewer";
          avatar_url?: string | null;
          store_name?: string | null;
        };
      };

      // ── inventory_adjustments ─────────────────────────────
      inventory_adjustments: {
        Row: {
          id: number;
          product_id: number;
          quantity_before: number;
          quantity_after: number;
          reason: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          product_id: number;
          quantity_before: number;
          quantity_after: number;
          reason: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };

    Views: {
      // ── low_stock_products ────────────────────────────────
      // CREATE VIEW low_stock_products AS
      // SELECT * FROM products WHERE stock <= min_stock AND status = 'Ativo';
      low_stock_products: {
        Row: Database["public"]["Tables"]["products"]["Row"];
      };
    };

    Functions: {
      // ── get_inventory_value ───────────────────────────────
      // CREATE FUNCTION get_inventory_value() RETURNS numeric AS $$
      //   SELECT SUM(stock * price) FROM products WHERE status = 'Ativo';
      // $$ LANGUAGE SQL;
      get_inventory_value: {
        Args: Record<string, never>;
        Returns: number;
      };

      // ── restock_product ───────────────────────────────────
      restock_product: {
        Args: { product_id: number; quantity: number };
        Returns: void;
      };
    };
  };
}
