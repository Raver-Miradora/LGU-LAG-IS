import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Briefcase,
  TrendingUp,
  Plus,
} from "lucide-react";
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
import type { CombinedDashboardStats } from "@/types";

type DashboardStats = CombinedDashboardStats;

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiGet("/employees/dashboard"),
  });

  const cards = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees ?? "--",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Service Records",
      value: stats?.totalServiceRecords ?? "--",
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "PESO Beneficiaries",
      value: stats?.totalBeneficiaries ?? "--",
      icon: Briefcase,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Active Programs",
      value: stats?.activePrograms ?? "--",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-red-600">Failed to load dashboard</p>
        <p className="text-sm text-[var(--muted-foreground)]">Please check the server connection and try again.</p>
      </div>
    );

  // chart data
  const deptData = (stats?.byDepartment ?? []).map((d) => ({
    name: d.department?.length > 15 ? d.department.slice(0, 14) + "…" : d.department,
    count: d.count,
  }));

  const statusData = (stats?.byStatus ?? []).map((s) => ({
    name: s.status?.replace(/_/g, " "),
    value: s.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Welcome to the LGU Lagonoy Information System
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/employees/new")}>
            <Plus className="mr-1 h-4 w-4" /> New Employee
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/peso/beneficiaries/new")}>
            <Plus className="mr-1 h-4 w-4" /> New Beneficiary
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{card.value}</p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${card.bg}`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Department Breakdown Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" fontSize={10} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No department data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Employment Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={9}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend fontSize={10} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No status data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>HR Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage employee profiles, service records, generate PDF reports,
              and print LGU IDs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PESO Employment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Track SPES, OJT, TUPAD, and Livelihood program beneficiaries and
              enrollments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
