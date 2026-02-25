import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiGet, apiPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ProgramPageProps {
  programKey: string;
  title: string;
  description: string;
  endpoint: string;
  extraColumns?: { key: string; header: string; render?: (r: any) => React.ReactNode }[];
  extraFields?: React.ReactNode;
}

/**
 * Reusable PESO program page for SPES, OJT, TUPAD, Livelihood.
 */
export default function ProgramPage({
  programKey,
  title,
  description,
  endpoint,
  extraColumns = [],
  extraFields,
}: ProgramPageProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [programKey, page, search],
    queryFn: () =>
      apiGet(`${endpoint}?page=${page}&limit=15&search=${encodeURIComponent(search)}`),
  });

  const baseColumns = [
    {
      key: "beneficiary",
      header: "Beneficiary",
      render: (r: any) => {
        const b = r.beneficiary;
        return b ? (
          <span className="font-medium">
            {b.lastName}, {b.firstName}
          </span>
        ) : (
          r.beneficiaryId
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r: any) => {
        const map: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
          ACTIVE: "success",
          COMPLETED: "secondary",
          DROPPED: "destructive",
          PENDING: "warning",
        };
        return <Badge variant={map[r.status] ?? "secondary"}>{r.status}</Badge>;
      },
    },
    ...extraColumns,
    {
      key: "createdAt",
      header: "Enrolled",
      render: (r: any) => formatDate(r.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Enrollment
        </Button>
      </div>

      <div className="flex max-w-sm items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <DataTable columns={baseColumns} data={((data as any)?.data ?? []) as any} />
          {(data as any)?.meta && (
            <Pagination
              page={(data as any).meta.page}
              totalPages={(data as any).meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Add Enrollment Modal */}
      <EnrollmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        endpoint={endpoint}
        programKey={programKey}
        queryClient={queryClient}
      />
    </div>
  );
}

function EnrollmentModal({
  open,
  onClose,
  endpoint,
  programKey,
  queryClient,
}: {
  open: boolean;
  onClose: () => void;
  endpoint: string;
  programKey: string;
  queryClient: any;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => apiPost(endpoint, data),
    onSuccess: () => {
      toast.success("Enrollment created");
      queryClient.invalidateQueries({ queryKey: [programKey] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create enrollment");
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="New Enrollment" size="lg">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="beneficiaryId"
            label="Beneficiary ID"
            error={errors.beneficiaryId?.message as string}
            {...register("beneficiaryId", { required: "Required" })}
          />
          <Select
            id="status"
            label="Status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "PENDING", label: "Pending" },
            ]}
            placeholder="Select status"
            {...register("status")}
          />
          <Input
            id="startDate"
            label="Start Date"
            type="date"
            {...register("startDate")}
          />
          <Input
            id="endDate"
            label="End Date"
            type="date"
            {...register("endDate")}
          />
          <Input
            id="remarks"
            label="Remarks"
            className="sm:col-span-2"
            {...register("remarks")}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
