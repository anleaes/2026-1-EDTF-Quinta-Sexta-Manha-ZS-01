import { useState, type FormEvent } from "react";
import { Plus, ClipboardList, ChevronRight, ChevronLeft, Save, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { InventoryStats } from "@/components/features/inventory/InventoryStats";
import { motion, AnimatePresence } from "motion/react";
import { useStoreContext } from "@/context/StoreContext";
import { useAuthContext } from "@/context/AuthContext";
import * as stockService from "@/services/stockService";

// ─── Tipos internos ────────────────────────────────────────────
interface CountEntry {
  productId: number;
  productName: string;
  expectedStock: number;
  countedStock: number;
}

// ─── Modal de Inventário em 3 passos ──────────────────────────
function InventoryModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { products, refreshProducts } = useStoreContext();
  const { user } = useAuthContext();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState("Inventário periódico");
  const [counts, setCounts] = useState<CountEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const activeProducts = products.filter((p) => p.status === "Ativo");

  // Passo 1 → 2: inicializar contagens
  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    const initial: CountEntry[] = activeProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      expectedStock: p.stock,
      countedStock: p.stock, // começa igual ao esperado
    }));
    setCounts(initial);
    setStep(2);
  };

  const handleCountChange = (productId: number, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setCounts((prev) =>
      prev.map((c) => (c.productId === productId ? { ...c, countedStock: num } : c))
    );
  };

  // Passo 2 → 3: revisar diferenças
  const diffs = counts.filter((c) => c.countedStock !== c.expectedStock);

  // Passo 3: salvar ajustes
  const handleSave = async () => {
    if (diffs.length === 0) {
      toast.info("Nenhuma diferença encontrada. Inventário registrado sem ajustes.");
      onClose();
      onSaved();
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(
        diffs.map((d) =>
          stockService.createInventoryAdjustment(
            d.productId,
            d.countedStock,
            reason
          )
        )
      );
      await refreshProducts();
      toast.success(`✅ Inventário concluído! ${diffs.length} ajuste(s) registrado(s).`);
      onClose();
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar inventário.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setReason("Inventário periódico");
    setCounts([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-primary text-white px-5 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  <h2 className="text-base font-semibold">
                    Inventário — Passo {step}/3
                  </h2>
                </div>
                <button onClick={handleClose} className="text-white/80 hover:text-white p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Indicador de progresso */}
              <div className="flex px-5 pt-4 gap-2 flex-shrink-0">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      s <= step ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Conteúdo do passo */}
              <div className="flex-1 overflow-y-auto">
                {/* PASSO 1 — Configurar */}
                {step === 1 && (
                  <form onSubmit={handleStart} className="p-5 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                      <p className="font-semibold mb-1">Iniciar contagem de inventário</p>
                      <p className="text-xs text-blue-700">
                        Você poderá informar a quantidade real de cada produto. Os ajustes serão registrados com data e responsável.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Produtos ativos</span>
                        <span className="font-semibold">{activeProducts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-semibold">{new Date().toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responsável</span>
                        <span className="font-semibold">{user?.name || "Usuário"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        Motivo do inventário
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option>Inventário periódico</option>
                        <option>Inventário de fechamento</option>
                        <option>Conferência surpresa</option>
                        <option>Após perda ou extravio</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Iniciar contagem <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* PASSO 2 — Contar */}
                {step === 2 && (
                  <div className="p-5 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Informe a quantidade real de cada produto. Deixe igual se estiver correto.
                    </p>
                    <div className="space-y-2">
                      {counts.map((c) => {
                        const diff = c.countedStock - c.expectedStock;
                        return (
                          <div
                            key={c.productId}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              diff !== 0
                                ? diff < 0
                                  ? "border-red-200 bg-red-50"
                                  : "border-green-200 bg-green-50"
                                : "border-border bg-white"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{c.productName}</p>
                              <p className="text-xs text-muted-foreground">Esperado: {c.expectedStock} un.</p>
                            </div>
                            <input
                              type="number"
                              min={0}
                              value={c.countedStock}
                              onChange={(e) => handleCountChange(c.productId, e.target.value)}
                              className="w-20 text-center border border-border rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {diff !== 0 && (
                              <span className={`text-xs font-bold w-10 text-right ${diff < 0 ? "text-red-600" : "text-green-600"}`}>
                                {diff > 0 ? "+" : ""}{diff}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PASSO 3 — Confirmar */}
                {step === 3 && (
                  <div className="p-5 space-y-4">
                    {diffs.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <p className="font-semibold text-foreground">Estoque conferido!</p>
                        <p className="text-sm text-muted-foreground">
                          Nenhuma diferença encontrada. O inventário será registrado sem ajustes.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                          <p className="font-semibold mb-1">
                            {diffs.length} ajuste(s) serão registrados
                          </p>
                          <p className="text-xs text-amber-700">
                            Motivo: <strong>{reason}</strong>
                          </p>
                        </div>
                        <div className="space-y-2">
                          {diffs.map((d) => {
                            const diff = d.countedStock - d.expectedStock;
                            return (
                              <div key={d.productId} className="flex items-center justify-between p-3 bg-white border border-border rounded-xl">
                                <span className="text-sm font-medium">{d.productName}</span>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">{d.expectedStock}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="font-bold">{d.countedStock}</span>
                                  <span className={`font-bold ${diff < 0 ? "text-red-600" : "text-green-600"}`}>
                                    ({diff > 0 ? "+" : ""}{diff})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer de navegação */}
              <div className="px-5 pb-5 flex gap-3 flex-shrink-0">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Revisar ajustes <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Salvar inventário
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Página principal ─────────────────────────────────────────
export function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inventoryKey, setInventoryKey] = useState(0);

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

      <InventoryStats key={inventoryKey} />

      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => setInventoryKey((k) => k + 1)}
      />
    </div>
  );
}
