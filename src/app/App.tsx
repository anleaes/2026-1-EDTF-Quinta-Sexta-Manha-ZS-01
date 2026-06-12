import { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import { useAuthContext } from "@/context/AuthContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { DashboardHomePage } from "@/pages/dashboard/DashboardHomePage";
import { ProductsPage } from "@/pages/dashboard/ProductsPage";
import { SalesPage } from "@/pages/dashboard/SalesPage";
import { ReportsPage } from "@/pages/dashboard/ReportsPage";
import { AlertsPage } from "@/pages/dashboard/AlertsPage";
import { InventoryPage } from "@/pages/dashboard/InventoryPage";
import { Toaster } from "sonner";

// Spinner de carregamento enquanto a sessão é verificada
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

// Protege rotas que exigem autenticação
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthContext();
  if (isInitializing) return <LoadingScreen />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Redireciona usuário autenticado para fora das páginas de auth
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthContext();
  if (isInitializing) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<HomePage />} />

      {/* Autenticação (redireciona se já logado) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Dashboard — rotas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <StoreProvider>
              <DashboardLayout />
            </StoreProvider>
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster richColors position="top-right" closeButton />
      </AuthProvider>
    </BrowserRouter>
  );
}
