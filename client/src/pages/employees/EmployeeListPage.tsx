import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, PaginatedResponse } from "@/types";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<Employee>>({
    queryKey: ["employees", page, search],
    queryFn: () =>
      apiGet(`/employees?page=${page}&limit=15&search=${encodeURIComponent(search)}`),
  });

  const statusBadge = (status: string) => {
    const map: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
      ACTIVE: "success",
      INACTIVE: "secondary",
      SUSPENDED: "warning",
      RETIRED: "destructive",
    };
    return <Badge variant={map[status] ?? "secondary"}>{status}</Badge>;
  };

  const columns = [
    {
      key: "employeeId",
      header: "Employee ID",
      render: (row: Employee) => (
        <span className="font-mono text-xs">{row.employeeId}</span>
      ),
    },
    {
      key: "fullName",
      header: "Name",
      render: (row: Employee) => (
        <span className="font-medium">
          {row.lastName}, {row.firstName} {row.middleName ?? ""}
        </span>
      ),
    },
    { key: "department", header: "Department" },
    { key: "position", header: "Position" },
    {
      key: "employmentStatus",
      header: "Status",
      render: (row: Employee) => statusBadge(row.employmentStatus),
    },
    {
      key: "dateHired",
      header: "Date Hired",
      render: (row: Employee) => formatDate(row.dateHired),
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage employee profiles
          </p>
        </div>
        <Button onClick={() => navigate("/employees/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex max-w-sm items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      <DataTable
        columns={columns}
        data={(data?.data ?? []) as any}
        onRowClick={(row: any) => navigate(`/employees/${row.id}`)}
      />

      {data && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
