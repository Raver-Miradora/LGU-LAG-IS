import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoader } from "@/components/ui/Spinner";

// Lazy-load pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const EmployeeListPage = lazy(() => import("@/pages/employees/EmployeeListPage"));
const EmployeeCreatePage = lazy(() => import("@/pages/employees/EmployeeCreatePage"));
const EmployeeViewPage = lazy(() => import("@/pages/employees/EmployeeViewPage"));
const ServiceRecordListPage = lazy(() => import("@/pages/service-records/ServiceRecordListPage"));
const ServiceRecordCreatePage = lazy(() => import("@/pages/service-records/ServiceRecordCreatePage"));
const BeneficiaryListPage = lazy(() => import("@/pages/peso/BeneficiaryListPage"));
const BeneficiaryCreatePage = lazy(() => import("@/pages/peso/BeneficiaryCreatePage"));
const SpesPage = lazy(() => import("@/pages/peso/SpesPage"));
const OjtPage = lazy(() => import("@/pages/peso/OjtPage"));
const TupadPage = lazy(() => import("@/pages/peso/TupadPage"));
const LivelihoodPage = lazy(() => import("@/pages/peso/LivelihoodPage"));
const UserManagementPage = lazy(() => import("@/pages/users/UserManagementPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      // HR - Employees
      {
        path: "employees",
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmployeeListPage />
          </Suspense>
        ),
      },
      {
        path: "employees/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmployeeCreatePage />
          </Suspense>
        ),
      },
      {
        path: "employees/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmployeeViewPage />
          </Suspense>
        ),
      },
      // HR - Service Records
      {
        path: "service-records",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ServiceRecordListPage />
          </Suspense>
        ),
      },
      {
        path: "service-records/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ServiceRecordCreatePage />
          </Suspense>
        ),
      },
      // PESO
      {
        path: "peso/beneficiaries",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BeneficiaryListPage />
          </Suspense>
        ),
      },
      {
        path: "peso/beneficiaries/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BeneficiaryCreatePage />
          </Suspense>
        ),
      },
      {
        path: "peso/spes",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpesPage />
          </Suspense>
        ),
      },
      {
        path: "peso/ojt",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OjtPage />
          </Suspense>
        ),
      },
      {
        path: "peso/tupad",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TupadPage />
          </Suspense>
        ),
      },
      {
        path: "peso/livelihood",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LivelihoodPage />
          </Suspense>
        ),
      },
      // Admin
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserManagementPage />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
