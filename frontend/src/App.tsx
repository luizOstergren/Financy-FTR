import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Layout } from "@/components/layout";
import { Login } from "@/pages/Auth/Login";
import { Signup } from "@/pages/Auth/Signup";
import { AuthenticatedPage } from "@/components/authenticated-page";
import { DashboardPage } from "@/pages/dashboard";
import { ProfilePage } from "@/pages/profile";
import { CategoriesPage } from "@/pages/category";
import { TransactionsPage } from "@/pages/transactions";

type GuardProps = {
  children: ReactNode;
};

type AppRoute = {
  path: string;
  page: ReactNode;
};

const publicRoutes: AppRoute[] = [
  { path: "/login", page: <Login /> },
  { path: "/signup", page: <Signup /> },
];

const privateRoutes: AppRoute[] = [
  { path: "/", page: <DashboardPage /> },
  { path: "/profile", page: <ProfilePage /> },
  { path: "/categories", page: <CategoriesPage /> },
  { path: "/transactions", page: <TransactionsPage /> },
];

function ProtectedRoute({ children }: GuardProps) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: GuardProps) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function ProtectedPageRoute({ page }: Readonly<{ page: ReactNode }>) {
  return (
    <ProtectedRoute>
      <AuthenticatedPage>{page}</AuthenticatedPage>
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <Layout>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PublicRoute>{route.page}</PublicRoute>}
          />
        ))}

        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedPageRoute page={route.page} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}