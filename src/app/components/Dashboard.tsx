import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  TrendingUp,
  BarChart3,
  Bell,
  ShoppingCart,
  CheckCircle2,
  Home,
  FileText,
  Settings,
  LogOut,
  Search,
  Plus,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Eye,
  Lock
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DashboardProps {
  onLogout: () => void;
}

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

interface Sale {
  id: number;
  date: string;
  product: string;
  quantity: number;
  total: number;
  customer: string;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState<"dashboard" | "products" | "sales" | "reports" | "alerts" | "inventory">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isSaleDetailModalOpen, setIsSaleDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    code: "",
    category: "",
    stock: 0,
    minStock: 0,
    price: 0,
    status: "Ativo" as "Ativo" | "Inativo"
  });
  const [saleForm, setSaleForm] = useState({
    productId: "",
    quantity: 1,
    customer: ""
  });
  const [restockQuantity, setRestockQuantity] = useState(0);

  const [products, setProducts] = useState<Product[]>([
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
    },
    {
      id: 4,
      name: "Açúcar Refinado",
      description: "Pacote 1kg",
      code: "ACU004",
      category: "Açúcares",
      stock: 8,
      minStock: 20,
      price: 4.50,
      status: "Ativo"
    },
    {
      id: 5,
      name: "Café Torrado",
      description: "Pacote 500g",
      code: "CAF005",
      category: "Bebidas",
      stock: 25,
      minStock: 10,
      price: 15.90,
      status: "Ativo"
    }
  ]);

  const [sales, setSales] = useState<Sale[]>([
    { id: 1, date: "2026-05-29", product: "Arroz Tipo 1", quantity: 3, total: 86.70, customer: "João Silva" },
    { id: 2, date: "2026-05-29", product: "Feijão Preto", quantity: 5, total: 42.50, customer: "Maria Santos" },
    { id: 3, date: "2026-05-29", product: "Óleo de Soja", quantity: 2, total: 15.98, customer: "Pedro Costa" },
    { id: 4, date: "2026-05-28", product: "Café Torrado", quantity: 4, total: 63.60, customer: "Ana Oliveira" },
    { id: 5, date: "2026-05-28", product: "Arroz Tipo 1", quantity: 2, total: 57.80, customer: "Carlos Lima" },
    { id: 6, date: "2026-05-27", product: "Açúcar Refinado", quantity: 10, total: 45.00, customer: "Lucia Mendes" },
  ]);

  const salesData = [
    { name: "Seg", vendas: 2400 },
    { name: "Ter", vendas: 1398 },
    { name: "Qua", vendas: 3800 },
    { name: "Qui", vendas: 3908 },
    { name: "Sex", vendas: 4800 },
    { name: "Sáb", vendas: 3800 },
    { name: "Dom", vendas: 2800 },
  ];

  const categoryData = [
    { name: "Grãos", value: 400, color: "#2563eb" },
    { name: "Bebidas", value: 300, color: "#7c3aed" },
    { name: "Óleos", value: 200, color: "#db2777" },
    { name: "Açúcares", value: 100, color: "#ea580c" },
  ];

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalProducts = products.length;
  const totalSalesToday = sales.filter(s => s.date === "2026-05-29").reduce((sum, s) => sum + s.total, 0);
  const totalSalesYesterday = sales.filter(s => s.date === "2026-05-28").reduce((sum, s) => sum + s.total, 0);
  const salesGrowth = ((totalSalesToday - totalSalesYesterday) / totalSalesYesterday * 100).toFixed(1);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos" },
    { id: "sales", icon: ShoppingCart, label: "Vendas" },
    { id: "reports", icon: BarChart3, label: "Relatórios" },
    { id: "alerts", icon: Bell, label: "Alertas" },
    { id: "inventory", icon: FileText, label: "Inventário" },
  ];

  const handleDeleteProduct = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({
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
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({
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

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...productForm, id: editingProduct.id } : p
      ));
      alert("Produto atualizado com sucesso!");
    } else {
      const newProduct: Product = {
        ...productForm,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
      alert("Produto adicionado com sucesso!");
    }

    handleCloseProductModal();
  };

  const handleOpenSaleModal = () => {
    setSaleForm({
      productId: "",
      quantity: 1,
      customer: ""
    });
    setIsSaleModalOpen(true);
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();

    const product = products.find(p => p.id === parseInt(saleForm.productId));
    if (!product) {
      alert("Produto não encontrado!");
      return;
    }

    if (product.stock < saleForm.quantity) {
      alert("Estoque insuficiente!");
      return;
    }

    const total = product.price * saleForm.quantity;
    const newSale: Sale = {
      id: Math.max(...sales.map(s => s.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      product: product.name,
      quantity: saleForm.quantity,
      total: total,
      customer: saleForm.customer
    };

    setSales([newSale, ...sales]);

    // Atualizar estoque
    setProducts(products.map(p =>
      p.id === product.id ? { ...p, stock: p.stock - saleForm.quantity } : p
    ));

    alert(`Venda registrada com sucesso! Total: R$ ${total.toFixed(2)}`);
    setIsSaleModalOpen(false);
    setSaleForm({
      productId: "",
      quantity: 1,
      customer: ""
    });
  };

  const handleOpenRestockModal = (product: Product) => {
    setRestockingProduct(product);
    setRestockQuantity(product.minStock - product.stock > 0 ? product.minStock - product.stock : 10);
    setIsRestockModalOpen(true);
  };

  const handleSubmitRestock = (e: React.FormEvent) => {
    e.preventDefault();

    if (!restockingProduct) return;

    setProducts(products.map(p =>
      p.id === restockingProduct.id ? { ...p, stock: p.stock + restockQuantity } : p
    ));

    alert(`Estoque atualizado! ${restockQuantity} unidades adicionadas.`);
    setIsRestockModalOpen(false);
    setRestockingProduct(null);
    setRestockQuantity(0);
  };

  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale);
    setIsSaleDetailModalOpen(true);
  };

  const handleStartInventory = () => {
    setIsInventoryModalOpen(true);
  };

  const handleSubmitInventory = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inventário iniciado com sucesso! Data: " + new Date().toLocaleDateString('pt-BR'));
    setIsInventoryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed lg:relative z-40 w-64 bg-white border-r border-border h-screen flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl text-foreground">Prateleira</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentSection === item.id
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@prateleira.com</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {menuItems.find(item => item.id === currentSection)?.label}
                </h1>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative"
                >
                  <Bell className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  {lowStockProducts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                      {lowStockProducts.length}
                    </span>
                  )}
                </button>
              </div>
              <button onClick={() => setIsSettingsOpen(true)}>
                <Settings className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard Section */}
          {currentSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      5%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{totalProducts}</h3>
                  <p className="text-sm text-muted-foreground">Produtos Cadastrados</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-1 ${
                      parseFloat(salesGrowth) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {parseFloat(salesGrowth) >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(parseFloat(salesGrowth))}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">R$ {totalSalesToday.toFixed(2)}</h3>
                  <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{lowStockProducts.length}</h3>
                  <p className="text-sm text-muted-foreground">Alertas de Estoque</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      12%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{sales.length}</h3>
                  <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Vendas da Semana</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData} id="dashboard-line-chart">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="vendas" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Produtos por Categoria</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart id="dashboard-pie-chart">
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`dashboard-pie-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Vendas Recentes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Qtd</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sales.slice(0, 5).map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-foreground">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{sale.product}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{sale.customer}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{sale.quantity}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">R$ {sale.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          {currentSection === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Gestão de Produtos</h2>
                  <p className="text-muted-foreground">Gerencie todos os produtos do estoque</p>
                </div>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Produto
                </button>
              </div>

              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estoque</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{product.code}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${product.stock <= product.minStock ? "text-orange-600" : "text-foreground"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">R$ {product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              product.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenProductModal(product)}
                                className="text-primary hover:text-primary/80 transition-colors p-1"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-destructive hover:text-destructive/80 transition-colors p-1"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sales Section */}
          {currentSection === "sales" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Controle de Vendas</h2>
                  <p className="text-muted-foreground">Registre e acompanhe todas as vendas</p>
                </div>
                <button
                  onClick={handleOpenSaleModal}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nova Venda
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <p className="text-sm text-muted-foreground mb-2">Hoje</p>
                  <p className="text-3xl font-bold text-green-600">R$ {totalSalesToday.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-6">
                  <p className="text-sm text-muted-foreground mb-2">Este Mês</p>
                  <p className="text-3xl font-bold text-primary">R$ 12.450,00</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-6">
                  <p className="text-sm text-muted-foreground mb-2">Ticket Médio</p>
                  <p className="text-3xl font-bold text-foreground">R$ 52,30</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Histórico de Vendas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Quantidade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-foreground">#{sale.id}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{sale.product}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{sale.customer}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{sale.quantity}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">R$ {sale.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewSale(sale)}
                              className="text-primary hover:text-primary/80 transition-colors p-1"
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          {currentSection === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Relatórios Inteligentes</h2>
                <p className="text-muted-foreground">Análises detalhadas do seu negócio</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Vendas por Dia</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData} id="reports-bar-chart">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="vendas" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Distribuição por Categoria</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart id="reports-pie-chart">
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`reports-pie-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Produtos Mais Vendidos</h3>
                <div className="space-y-4">
                  {[
                    { name: "Arroz Tipo 1", sales: 45, revenue: 1300.50 },
                    { name: "Café Torrado", sales: 38, revenue: 604.20 },
                    { name: "Óleo de Soja", sales: 32, revenue: 255.68 },
                    { name: "Feijão Preto", sales: 28, revenue: 238.00 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sales} unidades vendidas</p>
                      </div>
                      <p className="font-semibold text-green-600">R$ {item.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {currentSection === "alerts" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Alertas de Estoque</h2>
                <p className="text-muted-foreground">Produtos que precisam de atenção</p>
              </div>

              {lowStockProducts.length > 0 ? (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Estoque Baixo</h3>
                        <p className="text-sm text-muted-foreground">{lowStockProducts.length} produto(s) abaixo do estoque mínimo</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-y border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Produto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estoque Atual</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estoque Mínimo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Necessário</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-white">
                        {lowStockProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.code}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-orange-600">{product.stock}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">{product.minStock}</td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-primary">
                                {product.minStock - product.stock > 0 ? product.minStock - product.stock : 0}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleOpenRestockModal(product)}
                                className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                Reabastecer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Tudo Certo!</h3>
                  <p className="text-muted-foreground">Não há produtos com estoque baixo no momento.</p>
                </div>
              )}
            </div>
          )}

          {/* Inventory Section */}
          {currentSection === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Inventário</h2>
                  <p className="text-muted-foreground">Contagem e ajustes de estoque</p>
                </div>
                <button
                  onClick={handleStartInventory}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Inventário
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Total de Produtos</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">R$ {products.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Último Inventário</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">15/05/2026</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Estoque por Categoria</h3>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                          <span className="text-sm text-muted-foreground">{category.value} itens</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(category.value / 1000) * 100}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseProductModal}
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
                  <button onClick={handleCloseProductModal} className="text-muted-foreground hover:text-foreground">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitProduct} className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Código</label>
                      <input
                        type="text"
                        required
                        value={productForm.code}
                        onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
                      <input
                        type="text"
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
                      <input
                        type="text"
                        required
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Estoque Atual</label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Estoque Mínimo</label>
                      <input
                        type="number"
                        required
                        value={productForm.minStock}
                        onChange={(e) => setProductForm({ ...productForm, minStock: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                      <select
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value as "Ativo" | "Inativo" })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                      {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
                    </button>
                    <button type="button" onClick={handleCloseProductModal} className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sale Modal */}
      <AnimatePresence>
        {isSaleModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSaleModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-xl font-semibold">Nova Venda</h2>
                  <button onClick={() => setIsSaleModalOpen(false)} className="text-white/90 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitSale} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Produto</label>
                      <select
                        required
                        value={saleForm.productId}
                        onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Selecione um produto</option>
                        {products.filter(p => p.status === "Ativo" && p.stock > 0).map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={saleForm.quantity}
                        onChange={(e) => setSaleForm({ ...saleForm, quantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Cliente</label>
                      <input
                        type="text"
                        required
                        value={saleForm.customer}
                        onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })}
                        placeholder="Nome do cliente"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    {saleForm.productId && (
                      <div className="bg-accent/30 border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Total da Venda</p>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {(products.find(p => p.id === parseInt(saleForm.productId))?.price || 0 * saleForm.quantity).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                      Registrar Venda
                    </button>
                    <button type="button" onClick={() => setIsSaleModalOpen(false)} className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Restock Modal */}
      <AnimatePresence>
        {isRestockModalOpen && restockingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsRestockModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-xl font-semibold">Reabastecer Produto</h2>
                  <button onClick={() => setIsRestockModalOpen(false)} className="text-white/90 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitRestock} className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-foreground">{restockingProduct.name}</p>
                      <p className="text-sm text-muted-foreground">{restockingProduct.code}</p>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Estoque Atual</p>
                          <p className="text-lg font-semibold text-orange-600">{restockingProduct.stock}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Estoque Mínimo</p>
                          <p className="text-lg font-semibold text-foreground">{restockingProduct.minStock}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Quantidade a Adicionar</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={restockQuantity}
                        onChange={(e) => setRestockQuantity(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Novo Estoque</p>
                      <p className="text-2xl font-bold text-primary">
                        {restockingProduct.stock + restockQuantity} unidades
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                      Confirmar Reabastecimento
                    </button>
                    <button type="button" onClick={() => setIsRestockModalOpen(false)} className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sale Detail Modal */}
      <AnimatePresence>
        {isSaleDetailModalOpen && viewingSale && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSaleDetailModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-xl font-semibold">Detalhes da Venda</h2>
                  <button onClick={() => setIsSaleDetailModalOpen(false)} className="text-white/90 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">ID da Venda</span>
                      <span className="font-semibold text-foreground">#{viewingSale.id}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">Data</span>
                      <span className="font-semibold text-foreground">{new Date(viewingSale.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">Produto</span>
                      <span className="font-semibold text-foreground">{viewingSale.product}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">Cliente</span>
                      <span className="font-semibold text-foreground">{viewingSale.customer}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">Quantidade</span>
                      <span className="font-semibold text-foreground">{viewingSale.quantity} unidades</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total</p>
                      <p className="text-3xl font-bold text-green-600">R$ {viewingSale.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSaleDetailModalOpen(false)}
                    className="w-full mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Inventory Modal */}
      <AnimatePresence>
        {isInventoryModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsInventoryModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-xl font-semibold">Novo Inventário</h2>
                  <button onClick={() => setIsInventoryModalOpen(false)} className="text-white/90 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitInventory} className="p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-accent-foreground mb-2">
                            Iniciar Contagem de Inventário
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Este processo irá criar um novo registro de inventário com a data atual.
                            Você poderá fazer ajustes no estoque de cada produto.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total de Produtos</span>
                        <span className="font-semibold text-foreground">{products.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Data do Inventário</span>
                        <span className="font-semibold text-foreground">{new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Responsável</span>
                        <span className="font-semibold text-foreground">Admin</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                      Iniciar Inventário
                    </button>
                    <button type="button" onClick={() => setIsInventoryModalOpen(false)} className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsNotificationsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
            >
              <div className="bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-semibold">Notificações</h3>
                  </div>
                  {lowStockProducts.length > 0 && (
                    <span className="bg-white text-primary px-2 py-1 rounded-full text-xs font-semibold">
                      {lowStockProducts.length}
                    </span>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {lowStockProducts.length > 0 ? (
                    <div className="divide-y divide-border">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground mb-1">Estoque Baixo</p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {product.name} está com apenas {product.stock} unidades em estoque
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setIsNotificationsOpen(false);
                                    handleOpenRestockModal(product);
                                  }}
                                  className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                                >
                                  Reabastecer
                                </button>
                                <button
                                  onClick={() => {
                                    setIsNotificationsOpen(false);
                                    setCurrentSection("alerts");
                                  }}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                                >
                                  Ver detalhes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="font-medium text-foreground mb-1">Tudo em ordem!</p>
                      <p className="text-sm text-muted-foreground">
                        Você não tem notificações no momento
                      </p>
                    </div>
                  )}
                </div>

                {lowStockProducts.length > 0 && (
                  <div className="border-t border-border px-6 py-3 bg-gray-50">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setCurrentSection("alerts");
                      }}
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Ver todos os alertas
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Configurações</h2>
                  </div>
                  <button onClick={() => setIsSettingsOpen(false)} className="text-white/90 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Profile Section */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Perfil do Usuário
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                        <input
                          type="text"
                          defaultValue="Admin"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">E-mail</label>
                        <input
                          type="email"
                          defaultValue="admin@prateleira.com"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Cargo</label>
                        <input
                          type="text"
                          defaultValue="Administrador"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notifications Settings */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notificações
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">Alertas de Estoque Baixo</p>
                          <p className="text-sm text-muted-foreground">Receba notificações quando produtos estiverem com estoque baixo</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">Notificações de Vendas</p>
                          <p className="text-sm text-muted-foreground">Receba resumo diário de vendas</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">Relatórios Semanais</p>
                          <p className="text-sm text-muted-foreground">Receba relatório semanal por e-mail</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-primary rounded focus:ring-primary" />
                      </label>
                    </div>
                  </div>

                  {/* System Settings */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Sistema
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Tema</label>
                        <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Claro</option>
                          <option>Escuro</option>
                          <option>Automático</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Idioma</label>
                        <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Português (Brasil)</option>
                          <option>English (US)</option>
                          <option>Español</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Moeda</label>
                        <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Real (R$)</option>
                          <option>Dólar ($)</option>
                          <option>Euro (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Segurança
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-medium text-foreground">Alterar Senha</p>
                        <p className="text-sm text-muted-foreground">Atualize sua senha periodicamente</p>
                      </button>
                      <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-medium text-foreground">Autenticação em Dois Fatores</p>
                        <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                      </button>
                      <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-medium text-foreground">Dispositivos Conectados</p>
                        <p className="text-sm text-muted-foreground">Gerencie dispositivos com acesso à sua conta</p>
                      </button>
                    </div>
                  </div>

                  {/* About */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-4">Sobre</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Versão</span>
                        <span className="text-sm font-medium text-foreground">1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Último Backup</span>
                        <span className="text-sm font-medium text-foreground">Hoje, 14:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Licença</span>
                        <span className="text-sm font-medium text-green-600">Ativa até 01/06/2027</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        alert("Configurações salvas com sucesso!");
                        setIsSettingsOpen(false);
                      }}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
