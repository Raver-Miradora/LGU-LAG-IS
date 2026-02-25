import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { formatDate, ROLE_LABELS } from "@/lib/utils";
import { toast } from "sonner";
import type { User, PaginatedResponse, Role } from "@/types";

const roleOptions = [
  { value: "HR_ADMIN", label: "HR Admin" },
  { value: "HR_STAFF", label: "HR Staff" },
  { value: "PESO_ADMIN", label: "PESO Admin" },
  { value: "PESO_STAFF", label: "PESO Staff" },
  { value: "VIEWER", label: "Viewer" },
];

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery<PaginatedResponse<User>>({
    queryKey: ["users", page, search],
    queryFn: () =>
      apiGet(`/users?page=${page}&limit=15&search=${encodeURIComponent(search)}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Delete failed");
    },
  });

  const columns = [
    { key: "username", header: "Username" },
    { key: "fullName", header: "Full Name" },
    {
      key: "role",
      header: "Role",
      render: (r: User) => (
        <Badge variant="secondary">{ROLE_LABELS[r.role] ?? r.role}</Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (r: User) => (
        <Badge variant={r.isActive ? "success" : "destructive"}>
          {r.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (r: User) => formatDate(r.createdAt),
    },
    {
      key: "actions",
      header: "",
      render: (r: User) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this user?")) deleteMutation.mutate(r.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage system users and roles
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex max-w-sm items-center gap-2 rounded-md border border-[var(--input)] px-3 py-2">
        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search users..."
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Total: {data.meta.total} users
          </p>
        </div>
      )}

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        queryClient={queryClient}
      />
    </div>
  );
}

function CreateUserModal({
  open,
  onClose,
  queryClient,
}: {
  open: boolean;
  onClose: () => void;
  queryClient: any;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => apiPost("/users", data),
    onSuccess: () => {
      toast.success("User created");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Create User" size="md">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="username"
            label="Username"
            error={errors.username?.message as string}
            {...register("username", { required: "Required" })}
          />
          <Input
            id="fullName"
            label="Full Name"
            error={errors.fullName?.message as string}
            {...register("fullName", { required: "Required" })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            error={errors.password?.message as string}
            {...register("password", {
              required: "Required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />
          <Select
            id="role"
            label="Role"
            options={roleOptions}
            placeholder="Select role"
            error={errors.role?.message as string}
            {...register("role", { required: "Required" })}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
