import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

interface ServiceRecordForm {
  employeeId: string;
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

export default function ServiceRecordCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId") || "";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceRecordForm>({
    defaultValues: { employeeId },
  });

  const onSubmit = async (data: ServiceRecordForm) => {
    setLoading(true);
    try {
      // Always POST to the employee-scoped route
      const eid = data.employeeId || employeeId;
      await apiPost(`/service-records/employee/${eid}`, {
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
      toast.success("Service record created");
      navigate(employeeId ? `/employees/${employeeId}` : "/service-records");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Service Record</h1>
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
                id="employeeId"
                label="Employee ID"
                error={errors.employeeId?.message}
                {...register("employeeId", { required: "Required" })}
                readOnly={Boolean(employeeId)}
              />
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
            {loading ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
