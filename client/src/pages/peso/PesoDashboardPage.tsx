import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Briefcase, Hammer, Sprout } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import type { PESODashboardStats } from "@/types";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function PesoDashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useQuery<PESODashboardStats>({
    queryKey: ["peso-dashboard"],
    queryFn: () => apiGet("/peso/beneficiaries/dashboard"),
  });

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-red-600">Failed to load PESO dashboard</p>
        <p className="text-sm text-[var(--muted-foreground)]">Please check the server connection and try again.</p>
      </div>
    );

  const programCards = [
    {
      label: "Total Beneficiaries",
      value: stats?.totalBeneficiaries ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "SPES Active",
      value: stats?.activePrograms?.spes ?? 0,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "OJT Active",
      value: stats?.activePrograms?.ojt ?? 0,
      icon: Briefcase,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "TUPAD Active",
      value: stats?.activePrograms?.tupad ?? 0,
      icon: Hammer,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Livelihood Active",
      value: stats?.activePrograms?.livelihood ?? 0,
      icon: Sprout,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const programPieData = [
    { name: "SPES", value: stats?.activePrograms?.spes ?? 0 },
    { name: "OJT", value: stats?.activePrograms?.ojt ?? 0 },
    { name: "TUPAD", value: stats?.activePrograms?.tupad ?? 0 },
    { name: "Livelihood", value: stats?.activePrograms?.livelihood ?? 0 },
  ].filter((d) => d.value > 0);

  const barangayData = (stats?.topBarangays ?? []).map((b) => ({
    name: b.barangay?.length > 12 ? b.barangay.slice(0, 11) + "…" : b.barangay,
    count: b.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PESO Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Public Employment Service Office — program overview
          </p>
        </div>
        <Button size="sm" onClick={() => navigate("/peso/beneficiaries/new")}>
          Register Beneficiary
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {programCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Programs Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Active Enrollments by Program</CardTitle>
          </CardHeader>
          <CardContent>
            {programPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={programPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    fontSize={11}
                  >
                    {programPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
                No active enrollments yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Barangays Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Barangays (Beneficiaries)</CardTitle>
          </CardHeader>
          <CardContent>
            {barangayData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barangayData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" fontSize={10} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
                No barangay data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "SPES Enrollments", path: "/peso/spes" },
          { label: "OJT Enrollments", path: "/peso/ojt" },
          { label: "TUPAD Enrollments", path: "/peso/tupad" },
          { label: "Livelihood", path: "/peso/livelihood" },
        ].map((link) => (
          <Card
            key={link.path}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(link.path)}
          >
            <CardContent className="flex items-center justify-center p-6">
              <span className="font-medium">{link.label} →</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
