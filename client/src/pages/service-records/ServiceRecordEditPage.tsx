import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "sonner";
import type { ServiceRecord } from "@/types";

interface ServiceRecordForm {
  dateFrom: string;
  dateTo?: string;
  designation: string;
  office: string;
  salary?: number;
  status: string;
  branch?: string;
  lwop?: string;
  separationDate?: string;
  separationCause?: string;
  referenceNo?: string;
  remarks?: string;
}

const appointmentOptions = [
  { value: "PERMANENT", label: "Permanent" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "COTERMINOUS", label: "Coterminous" },
  { value: "CASUAL", label: "Casual" },
  { value: "CONTRACTUAL", label: "Contractual" },
  { value: "ELECTED", label: "Elected" },
];

export default function ServiceRecordEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId") || "";
  const [loading, setLoading] = useState(false);

  // Fetch current record data from the employee's service records
  const { data: record, isLoading } = useQuery<ServiceRecord>({
    queryKey: ["service-record", id],
    queryFn: async () => {
      // Find the record by fetching all records and filtering
      const all = await apiGet<{ data: ServiceRecord[] }>(`/service-records?limit=1000`);
      const found = all.data.find((r: ServiceRecord) => r.id === id);
      if (!found) throw new Error("Service record not found");
      return found;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceRecordForm>({
    values: record
      ? {
          dateFrom: record.dateFrom?.slice(0, 10) ?? "",
          dateTo: record.dateTo?.slice(0, 10) ?? "",
          designation: record.designation,
          office: record.office,
          salary: Number(record.salary) || 0,
          status: record.status,
          branch: record.branch ?? "",
          lwop: record.lwop ?? "",
          separationDate: record.separationDate?.slice(0, 10) ?? "",
          separationCause: record.separationCause ?? "",
          referenceNo: record.referenceNo ?? "",
          remarks: record.remarks ?? "",
        }
      : undefined,
  });

  const onSubmit = async (data: ServiceRecordForm) => {
    setLoading(true);
    try {
      await apiPut(`/service-records/${id}`, {
        dateFrom: data.dateFrom,
        dateTo: data.dateTo || undefined,
        designation: data.designation,
        office: data.office,
        salary: data.salary ? Number(data.salary) : 0,
        status: data.status,
        branch: data.branch || undefined,
        lwop: data.lwop || undefined,
        separationDate: data.separationDate || undefined,
        separationCause: data.separationCause || undefined,
        referenceNo: data.referenceNo || undefined,
        remarks: data.remarks || undefined,
      });
      toast.success("Service record updated");
      navigate(employeeId ? `/employees/${employeeId}` : "/service-records");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Service Record</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Update service record details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Service Record Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="dateFrom"
                label="Service From"
                type="date"
                error={errors.dateFrom?.message}
                {...register("dateFrom", { required: "Required" })}
              />
              <Input
                id="dateTo"
                label="Service To"
                type="date"
                {...register("dateTo")}
              />
              <Input
                id="designation"
                label="Position / Designation"
                error={errors.designation?.message}
                {...register("designation", { required: "Required" })}
              />
              <Input
                id="office"
                label="Office / Department"
                error={errors.office?.message}
                {...register("office", { required: "Required" })}
              />
              <Input
                id="salary"
                label="Monthly Salary"
                type="number"
                {...register("salary", { valueAsNumber: true })}
              />
              <Select
                id="status"
                label="Appointment Status"
                options={appointmentOptions}
                placeholder="Select status"
                error={errors.status?.message}
                {...register("status", { required: "Required" })}
              />
              <Input
                id="branch"
                label="Branch"
                {...register("branch")}
              />
              <Input
                id="lwop"
                label="LWOP"
                {...register("lwop")}
              />
              <Input
                id="separationDate"
                label="Separation Date"
                type="date"
                {...register("separationDate")}
              />
              <Input
                id="separationCause"
                label="Separation Cause"
                {...register("separationCause")}
              />
              <Input
                id="referenceNo"
                label="Reference No."
                {...register("referenceNo")}
              />
              <Input
                id="remarks"
                label="Remarks"
                {...register("remarks")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
