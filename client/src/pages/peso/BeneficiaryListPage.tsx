import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Beneficiary, PaginatedResponse } from "@/types";

const programOptions = [
  { value: "", label: "All Programs" },
  { value: "SPES", label: "SPES" },
  { value: "OJT", label: "OJT" },
  { value: "TUPAD", label: "TUPAD" },
  { value: "LIVELIHOOD", label: "Livelihood" },
];

export default function BeneficiaryListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Beneficiary>>({
    queryKey: ["beneficiaries", page, search, programFilter],
    queryFn: () => {
      let url = `/peso/beneficiaries?page=${page}&limit=15&search=${encodeURIComponent(search)}`;
      if (programFilter) url += `&program=${programFilter}`;
      return apiGet(url);
    },
  });

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (r: Beneficiary) => (
        <span className="font-medium">
          {r.lastName}, {r.firstName} {r.middleName ?? ""}
        </span>
      ),
    },
    { key: "barangay", header: "Barangay" },
    {
      key: "birthdate",
      header: "DOB",
      render: (r: Beneficiary) => formatDate(r.birthdate),
    },
    { key: "gender", header: "Gender" },
    { key: "contactNo", header: "Contact" },
    {
      key: "enrollments",
      header: "Enrollments",
      render: (r: Beneficiary) => {
        const c = r._count;
        if (!c) return "--";
        const total =
          (c.spesEnrollments || 0) +
          (c.ojtEnrollments || 0) +
          (c.tupadEnrollments || 0) +
          (c.livelihoodEnrollments || 0);
        return total;
      },
    },
  ];

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-red-600">Failed to load beneficiaries</p>
        <p className="text-sm text-[var(--muted-foreground)]">Please check the server connection and try again.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PESO Beneficiaries</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage program beneficiaries
          </p>
        </div>
        <Button onClick={() => navigate("/peso/beneficiaries/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Beneficiary
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search beneficiaries..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        <Select
          options={programOptions}
          value={programFilter}
          onChange={(e) => {
            setProgramFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        />
      </div>

      <DataTable
        columns={columns as any}
        data={(data?.data ?? []) as any}
        onRowClick={(row: any) => navigate(`/peso/beneficiaries/${row.id}`)}
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
