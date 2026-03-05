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
import { apiGet, apiPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface FormFieldDef {
  name: string;
  label: string;
  type?: "text" | "date" | "number" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  valueAsNumber?: boolean;
}

interface ProgramPageProps {
  programKey: string;
  title: string;
  description: string;
  endpoint: string;
  extraColumns?: { key: string; header: string; render?: (r: any) => React.ReactNode }[];
  formFields?: FormFieldDef[];
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
  formFields = [],
}: ProgramPageProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
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
          GRADUATED: "success",
          TERMINATED: "destructive",
          ON_HOLD: "warning",
          APPLIED: "warning",
          APPROVED: "success",
          DISBURSED: "success",
          MONITORING: "warning",
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
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-semibold text-red-600">Failed to load {title.toLowerCase()}</p>
          <p className="text-sm text-[var(--muted-foreground)]">Please check the server connection and try again.</p>
        </div>
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
        formFields={formFields}
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
  formFields,
}: {
  open: boolean;
  onClose: () => void;
  endpoint: string;
  programKey: string;
  queryClient: any;
  formFields: FormFieldDef[];
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

  // Default fields + program-specific fields
  const allFields: FormFieldDef[] = [
    { name: "beneficiaryId", label: "Beneficiary ID", required: true },
    ...formFields,
    { name: "remarks", label: "Remarks" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="New Enrollment" size="lg">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <div className="grid gap-4 sm:grid-cols-2">
          {allFields.map((field) =>
            field.type === "select" && field.options ? (
              <Select
                key={field.name}
                id={field.name}
                label={field.label}
                options={field.options}
                placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
                error={errors[field.name]?.message as string}
                {...register(field.name, field.required ? { required: "Required" } : {})}
              />
            ) : (
              <Input
                key={field.name}
                id={field.name}
                label={field.label}
                type={field.type || "text"}
                error={errors[field.name]?.message as string}
                {...register(field.name, {
                  ...(field.required ? { required: "Required" } : {}),
                  ...(field.valueAsNumber ? { valueAsNumber: true } : {}),
                })}
              />
            )
          )}
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
