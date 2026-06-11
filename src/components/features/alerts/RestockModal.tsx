import { useState, useEffect, type FormEvent } from "react";
import { X, PackagePlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Product } from "@/types";

interface RestockModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (productId: number, quantity: number) => Promise<boolean>;
}

export function RestockModal({ product, onClose, onSubmit }: RestockModalProps) {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const suggested = Math.max(product.minStock - product.stock, 10);
      setQuantity(suggested);
    }
  }, [product]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    const ok = await onSubmit(product.id, quantity);
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <PackagePlus className="w-5 h-5" />
                  <h2 className="text-base font-semibold">Reabastecer</h2>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Product info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-foreground text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{product.code}</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Estoque Atual</p>
                      <p className="text-lg font-bold text-orange-600">{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Estoque Mínimo</p>
                      <p className="text-lg font-bold text-foreground">{product.minStock}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Quantidade a Adicionar *
                  </label>
                  <input
                    required type="number" min="1" value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-[11px] text-muted-foreground">Novo estoque após reabastecimento</p>
                  <p className="text-2xl font-bold text-primary mt-0.5">
                    {product.stock + quantity} <span className="text-sm font-normal text-muted-foreground">unidades</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {loading ? "Atualizando..." : "Confirmar Reabastecimento"}
                  </button>
                  <button type="button" onClick={onClose}
                    className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
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
