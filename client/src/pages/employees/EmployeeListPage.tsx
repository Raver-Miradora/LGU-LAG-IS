import { useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, PaginatedResponse } from "@/types";

const departmentOptions = [
  "Mayor's Office",
  "Municipal Planning",
  "Municipal Budget",
  "Municipal Accounting",
  "Municipal Treasurer",
  "Municipal Assessor",
  "Municipal Civil Registrar",
  "Municipal Health Office",
  "Municipal Social Welfare",
  "Municipal Agriculture",
  "Municipal Engineering",
  "Municipal Environment",
  "Human Resource",
  "PESO",
  "MDRRMO",
  "General Services",
];

const statusOptions = [
  { value: "PERMANENT", label: "Permanent" },
  { value: "CASUAL", label: "Casual" },
  { value: "COTERMINOUS", label: "Coterminous" },
  { value: "JOB_ORDER", label: "Job Order" },
  { value: "CONTRACT_OF_SERVICE", label: "Contract of Service" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "ELECTED", label: "Elected" },
];

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<Employee>>({
    queryKey: ["employees", page, search, department, status, isActive],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "15");
      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (status) params.set("status", status);
      if (isActive) params.set("isActive", isActive);
      return apiGet(`/employees?${params.toString()}`);
    },
  });

  const activeFilters = [department, status, isActive !== "true" ? isActive : ""].filter(Boolean).length;

  const clearFilters = () => {
    setDepartment("");
    setStatus("");
    setIsActive("true");
    setPage(1);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
      PERMANENT: "success",
      CASUAL: "secondary",
      COTERMINOUS: "secondary",
      JOB_ORDER: "warning",
      CONTRACT_OF_SERVICE: "warning",
      TEMPORARY: "warning",
      ELECTED: "success",
    };
    return <Badge variant={map[s] ?? "secondary"}>{s.replace(/_/g, " ")}</Badge>;
  };

  const columns: Array<{ key: string; header: string; render?: (row: Employee) => ReactNode; }> = [
    {
      key: "employeeNo",
      header: "Employee No.",
      render: (row: Employee) => (
        <span className="font-mono text-xs">{row.employeeNo}</span>
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
      key: "isActive",
      header: "Active",
      render: (row: Employee) => (
        <Badge variant={row.isActive ? "success" : "destructive"}>
          {row.isActive ? "Active" : "Archived"}
        </Badge>
      ),
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
            Manage employee profiles &middot; {data?.meta.total ?? 0} total
          </p>
        </div>
        <Button onClick={() => navigate("/employees/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by name, employee no, position..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="mr-1 h-4 w-4" /> Filters
          {activeFilters > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              {activeFilters}
            </span>
          )}
        </Button>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {/* Filter Dropdowns */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted-foreground)]">Department</label>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="flex h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">All Departments</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted-foreground)]">Employment Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="flex h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted-foreground)]">Record Status</label>
            <select
              value={isActive}
              onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
              className="flex h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="true">Active Only</option>
              <option value="false">Archived Only</option>
              <option value="">All Records</option>
            </select>
          </div>
        </div>
      )}

      <DataTable<Employee>
        columns={columns}
        data={(data?.data ?? []) as any}
        onRowClick={(row: Employee) => navigate(`/employees/${row.id}`)}
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
