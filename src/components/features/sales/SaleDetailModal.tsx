import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Sale } from "@/types";
import { formatDate, formatCurrency } from "@/utils/formatters";

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailModal({ sale, onClose }: SaleDetailModalProps) {
  return (
    <AnimatePresence>
      {sale && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-base font-semibold">Detalhes da Venda</h2>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "ID",         value: `#${sale.id}` },
                  { label: "Data",       value: formatDate(sale.date) },
                  { label: "Produto",    value: sale.product },
                  { label: "Cliente",    value: sale.customer },
                  { label: "Quantidade", value: `${sale.quantity} unidade${sale.quantity !== 1 ? "s" : ""}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                  </div>
                ))}
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-2">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-green-700 mt-0.5">{formatCurrency(sale.total)}</p>
                </div>
                <button onClick={onClose}
                  className="w-full mt-2 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
