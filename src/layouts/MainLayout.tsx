import { type ReactNode } from "react";

// Layout para páginas públicas (home, login, forgot-password).
// Mantido para facilitar adição futura de nav, footer, etc.
interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return <>{children}</>;
}
