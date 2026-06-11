import { useState, type FormEvent } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { InventoryStats } from "@/components/features/inventory/InventoryStats";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useStoreContext } from "@/context/StoreContext";

function StartInventoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products } = useStoreContext();

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    toast.success(`Inventário iniciado em ${new Date().toLocaleDateString("pt-BR")}.`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  <h2 className="text-base font-semibold">Novo Inventário</h2>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleStart} className="p-5 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                  <p className="font-semibold mb-1">Iniciar contagem de inventário</p>
                  <p className="text-xs text-blue-700">
                    Será criado um registro com a data atual. Você poderá fazer ajustes no estoque de cada produto.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total de produtos</span><span className="font-semibold">{products.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span className="font-semibold">{new Date().toLocaleDateString("pt-BR")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Responsável</span><span className="font-semibold">Admin</span></div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Iniciar Inventário
                  </button>
                  <button type="button" onClick={onClose} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
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

export function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Visão geral do estoque atual</p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Inventário
        </button>
      </div>

      <InventoryStats />
      <StartInventoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
