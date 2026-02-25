import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ServiceRecord, PaginatedResponse } from "@/types";

export default function ServiceRecordListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<ServiceRecord>>({
    queryKey: ["service-records", page, search, employeeId],
    queryFn: () => {
      let url = `/service-records?page=${page}&limit=15&search=${encodeURIComponent(search)}`;
      if (employeeId) url += `&employeeId=${employeeId}`;
      return apiGet(url);
    },
  });

  const columns = [
    {
      key: "employeeName",
      header: "Employee",
      render: (r: ServiceRecord) => (
        <span className="font-medium">{(r as any).employee?.firstName} {(r as any).employee?.lastName}</span>
      ),
    },
    {
      key: "fromDate",
      header: "From",
      render: (r: ServiceRecord) => formatDate(r.fromDate),
    },
    {
      key: "toDate",
      header: "To",
      render: (r: ServiceRecord) => r.toDate ? formatDate(r.toDate) : "Present",
    },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "salaryGrade", header: "SG" },
    { key: "appointmentStatus", header: "Appointment" },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {employeeId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/employees/${employeeId}`)}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Service Records</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Track employee service history
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/service-records/new${employeeId ? `?employeeId=${employeeId}` : ""}`)}>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>

      <div className="flex max-w-sm items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      <DataTable columns={columns} data={(data?.data ?? []) as any} />

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
