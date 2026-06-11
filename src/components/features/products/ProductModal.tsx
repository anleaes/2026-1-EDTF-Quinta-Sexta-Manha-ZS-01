import { useState, useEffect, type FormEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Product, ProductFormData } from "@/types";

const CATEGORIES = [
  "Grãos", "Bebidas", "Óleos", "Açúcares", "Laticínios",
  "Hortifruti", "Limpeza", "Higiene", "Carnes", "Padaria", "Congelados", "Outros",
];

const EMPTY_FORM: ProductFormData = {
  name: "", description: "", code: "", category: "", stock: 0, minStock: 0, price: 0, status: "Ativo",
};

interface ProductModalProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<boolean>;
}

export function ProductModal({ open, product, onClose, onSubmit }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(product ? {
        name: product.name, description: product.description, code: product.code,
        category: product.category, stock: product.stock, minStock: product.minStock,
        price: product.price, status: product.status,
      } : EMPTY_FORM);
    }
  }, [open, product]);

  const set = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onSubmit(form);
    setLoading(false);
    if (ok) onClose();
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-base font-semibold text-foreground">
                  {product ? "Editar Produto" : "Novo Produto"}
                </h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Nome do Produto *</label>
                    <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                      placeholder="Ex: Arroz Tipo 1" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Código *</label>
                    <input required value={form.code} onChange={(e) => set("code", e.target.value)}
                      placeholder="Ex: ARR001" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Categoria *</label>
                    <select required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
                      <option value="">Selecione...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Descrição</label>
                    <input value={form.description} onChange={(e) => set("description", e.target.value)}
                      placeholder="Ex: Pacote 5kg" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Preço (R$) *</label>
                    <input required type="number" step="0.01" min="0" value={form.price}
                      onChange={(e) => set("price", parseFloat(e.target.value) || 0)} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                    <select value={form.status} onChange={(e) => set("status", e.target.value as "Ativo" | "Inativo")} className={inputClass}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Estoque Atual</label>
                    <input required type="number" min="0" value={form.stock}
                      onChange={(e) => set("stock", parseInt(e.target.value) || 0)} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Estoque Mínimo</label>
                    <input required type="number" min="0" value={form.minStock}
                      onChange={(e) => set("minStock", parseInt(e.target.value) || 0)} className={inputClass} />
                    <p className="text-[11px] text-muted-foreground mt-1">Alerta quando atingir este valor</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {loading ? "Salvando..." : product ? "Salvar Alterações" : "Adicionar Produto"}
                  </button>
                  <button type="button" onClick={onClose}
                    className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
