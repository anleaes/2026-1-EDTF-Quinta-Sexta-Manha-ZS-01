import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: "Ativo" | "Inativo";
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Arroz Tipo 1",
    description: "Pacote 5kg",
    code: "ARR001",
    category: "Grãos",
    stock: 45,
    minStock: 20,
    price: 28.90,
    status: "Ativo"
  },
  {
    id: 2,
    name: "Feijão Preto",
    description: "Pacote 1kg",
    code: "FEJ002",
    category: "Grãos",
    stock: 12,
    minStock: 15,
    price: 8.50,
    status: "Ativo"
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
    status: "Ativo"
  }
];

export default function ProductDemo() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    code: "",
    category: "",
    stock: 0,
    minStock: 0,
    price: 0,
    status: "Ativo"
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        code: "",
        category: "",
        stock: 0,
        minStock: 0,
        price: 0,
        status: "Ativo"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      code: "",
      category: "",
      stock: 0,
      minStock: 0,
      price: 0,
      status: "Ativo"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...formData, id: editingProduct.id } as Product : p
      ));
    } else {
      const newProduct: Product = {
        ...formData as Product,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Controle de Estoque</h1>
          </div>
          <a href="/" className="text-white/90 hover:text-white transition-colors text-sm">
            ← Voltar para Home
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisa rápida por produto, código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Adicionar Produto
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Est. Mínimo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{product.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={product.stock <= product.minStock ? "text-orange-600 font-semibold" : "text-foreground"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-primary hover:text-primary/80 transition-colors p-1"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>

        {/* Alert for low stock */}
        {products.some(p => p.stock <= p.minStock) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4"
          >
            <p className="text-orange-800">
              <span className="font-semibold">Atenção:</span> Existem {products.filter(p => p.stock <= p.minStock).length} produto(s) com estoque baixo ou abaixo do mínimo.
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {editingProduct ? "Editar Produto" : "Novo Produto"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Arroz Tipo 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Código</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => handleInputChange("code", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: ARR001"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
                      <input
                        type="text"
                        required
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Pacote 5kg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Grãos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Estoque Atual</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Estoque Mínimo</label>
                      <input
                        type="number"
                        required
                        value={formData.minStock}
                        onChange={(e) => handleInputChange("minStock", parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange("status", e.target.value as "Ativo" | "Inativo")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
