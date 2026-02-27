import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import type { CombinedDashboardStats } from "@/types";

// combine HR and additional metrics used in cards
// alias to shorter name for clarity
type DashboardStats = CombinedDashboardStats;

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiGet("/employees/dashboard"),
  });

  // Static placeholder stats until API endpoint is ready
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Welcome to the LGU Lagonoy Information System
        </p>
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
