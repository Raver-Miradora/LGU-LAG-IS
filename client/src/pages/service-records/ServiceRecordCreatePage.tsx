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
  fromDate: string;
  toDate?: string;
  position: string;
  department: string;
  salaryGrade?: string;
  monthlySalary?: number;
  appointmentStatus: string;
  isGovernmentService: boolean;
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
    defaultValues: { employeeId, isGovernmentService: true },
  });

  const onSubmit = async (data: ServiceRecordForm) => {
    setLoading(true);
    try {
      const url = employeeId
        ? `/employees/${employeeId}/service-records`
        : "/service-records";
      await apiPost(url, data);
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
                id="fromDate"
                label="Service From"
                type="date"
                error={errors.fromDate?.message}
                {...register("fromDate", { required: "Required" })}
              />
              <Input
                id="toDate"
                label="Service To"
                type="date"
                {...register("toDate")}
              />
              <Input
                id="position"
                label="Position / Designation"
                error={errors.position?.message}
                {...register("position", { required: "Required" })}
              />
              <Input
                id="department"
                label="Office / Department"
                error={errors.department?.message}
                {...register("department", { required: "Required" })}
              />
              <Input
                id="salaryGrade"
                label="Salary Grade"
                {...register("salaryGrade")}
              />
              <Input
                id="monthlySalary"
                label="Monthly Salary"
                type="number"
                {...register("monthlySalary", { valueAsNumber: true })}
              />
              <Select
                id="appointmentStatus"
                label="Appointment Status"
                options={appointmentOptions}
                placeholder="Select status"
                error={errors.appointmentStatus?.message}
                {...register("appointmentStatus", { required: "Required" })}
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
