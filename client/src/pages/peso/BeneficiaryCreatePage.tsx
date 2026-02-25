import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

interface BeneficiaryForm {
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  dateOfBirth: string;
  gender: string;
  civilStatus?: string;
  contactNumber?: string;
  email?: string;
  address: string;
  barangay: string;
  programType: string;
  batchYear: number;
}

const programOptions = [
  { value: "SPES", label: "SPES" },
  { value: "OJT", label: "OJT" },
  { value: "TUPAD", label: "TUPAD" },
  { value: "LIVELIHOOD", label: "Livelihood" },
];

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export default function BeneficiaryCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BeneficiaryForm>({
    defaultValues: { batchYear: new Date().getFullYear() },
  });

  const onSubmit = async (data: BeneficiaryForm) => {
    setLoading(true);
    try {
      await apiPost("/peso/beneficiaries", data);
      toast.success("Beneficiary created successfully");
      navigate("/peso/beneficiaries");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create beneficiary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/peso/beneficiaries")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Beneficiary</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Register a new PESO beneficiary
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="lastName"
                label="Last Name"
                error={errors.lastName?.message}
                {...register("lastName", { required: "Required" })}
              />
              <Input
                id="firstName"
                label="First Name"
                error={errors.firstName?.message}
                {...register("firstName", { required: "Required" })}
              />
              <Input
                id="middleName"
                label="Middle Name"
                {...register("middleName")}
              />
              <Input
                id="extensionName"
                label="Extension"
                {...register("extensionName")}
              />
              <Input
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                error={errors.dateOfBirth?.message}
                {...register("dateOfBirth", { required: "Required" })}
              />
              <Select
                id="gender"
                label="Gender"
                options={genderOptions}
                placeholder="Select gender"
                error={errors.gender?.message}
                {...register("gender", { required: "Required" })}
              />
              <Input
                id="contactNumber"
                label="Contact Number"
                {...register("contactNumber")}
              />
              <Input id="email" label="Email" type="email" {...register("email")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address & Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="address"
                label="Address"
                error={errors.address?.message}
                {...register("address", { required: "Required" })}
              />
              <Input
                id="barangay"
                label="Barangay"
                error={errors.barangay?.message}
                {...register("barangay", { required: "Required" })}
              />
              <Select
                id="programType"
                label="Program"
                options={programOptions}
                placeholder="Select program"
                error={errors.programType?.message}
                {...register("programType", { required: "Required" })}
              />
              <Input
                id="batchYear"
                label="Batch Year"
                type="number"
                error={errors.batchYear?.message}
                {...register("batchYear", {
                  required: "Required",
                  valueAsNumber: true,
                })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/peso/beneficiaries")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Beneficiary"}
          </Button>
        </div>
      </form>
    </div>
  );
}
