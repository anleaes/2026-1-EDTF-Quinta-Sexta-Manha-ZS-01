import { useState, useEffect, type FormEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { SaleFormData, Product } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface SaleModalProps {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSubmit: (data: SaleFormData) => Promise<boolean>;
}

export function SaleModal({ open, products, onClose, onSubmit }: SaleModalProps) {
  const [form, setForm] = useState<SaleFormData>({ productId: "", quantity: 1, customer: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ productId: "", quantity: 1, customer: "" });
  }, [open]);

  const set = <K extends keyof SaleFormData>(field: K, value: SaleFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedProduct = products.find((p) => p.id === parseInt(form.productId));
  const total = selectedProduct ? selectedProduct.price * form.quantity : 0;

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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-base font-semibold">Nova Venda</h2>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Produto *</label>
                  <select required value={form.productId} onChange={(e) => set("productId", e.target.value)} className={inputClass}>
                    <option value="">Selecione um produto</option>
                    {products.filter((p) => p.status === "Ativo" && p.stock > 0).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.price)} (Estoque: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Quantidade *</label>
                  <input required type="number" min="1"
                    max={selectedProduct?.stock ?? undefined}
                    value={form.quantity}
                    onChange={(e) => set("quantity", parseInt(e.target.value) || 1)}
                    className={inputClass} />
                  {selectedProduct && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Disponível: {selectedProduct.stock} unidades
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Cliente *</label>
                  <input required value={form.customer} onChange={(e) => set("customer", e.target.value)}
                    placeholder="Nome do cliente" className={inputClass} />
                </div>

                {total > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <p className="text-xs text-muted-foreground">Total da venda</p>
                    <p className="text-2xl font-bold text-green-700 mt-0.5">{formatCurrency(total)}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {loading ? "Registrando..." : "Registrar Venda"}
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
