import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import type { Beneficiary } from "@/types";

interface BeneficiaryForm {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthdate: string;
  gender: string;
  civilStatus: string;
  contactNo?: string;
  email?: string;
  address: string;
  barangay: string;
  educationLevel?: string;
  school?: string;
  course?: string;
}

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const civilStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
];

const educationOptions = [
  { value: "Elementary", label: "Elementary" },
  { value: "High School", label: "High School" },
  { value: "Senior High", label: "Senior High" },
  { value: "Vocational", label: "Vocational" },
  { value: "College", label: "College" },
  { value: "Post-Graduate", label: "Post-Graduate" },
];

export default function BeneficiaryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { data: beneficiary, isLoading } = useQuery<Beneficiary>({
    queryKey: ["beneficiary", id],
    queryFn: () => apiGet(`/peso/beneficiaries/${id}`),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BeneficiaryForm>({
    values: beneficiary
      ? {
          firstName: beneficiary.firstName,
          middleName: beneficiary.middleName ?? "",
          lastName: beneficiary.lastName,
          suffix: beneficiary.suffix ?? "",
          birthdate: beneficiary.birthdate?.slice(0, 10) ?? "",
          gender: beneficiary.gender,
          civilStatus: beneficiary.civilStatus,
          contactNo: beneficiary.contactNo ?? "",
          email: beneficiary.email ?? "",
          address: beneficiary.address,
          barangay: beneficiary.barangay,
          educationLevel: beneficiary.educationLevel ?? "",
          school: beneficiary.school ?? "",
          course: beneficiary.course ?? "",
        }
      : undefined,
  });

  const onSubmit = async (data: BeneficiaryForm) => {
    setSaving(true);
    try {
      await apiPut(`/peso/beneficiaries/${id}`, data);
      toast.success("Beneficiary updated successfully");
      navigate(`/peso/beneficiaries/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update beneficiary");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/peso/beneficiaries/${id}`)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Beneficiary</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Update beneficiary information
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
              <Input id="middleName" label="Middle Name" {...register("middleName")} />
              <Input id="suffix" label="Suffix" {...register("suffix")} />
              <Input
                id="birthdate"
                label="Date of Birth"
                type="date"
                error={errors.birthdate?.message}
                {...register("birthdate", { required: "Required" })}
              />
              <Select
                id="gender"
                label="Gender"
                options={genderOptions}
                error={errors.gender?.message}
                {...register("gender", { required: "Required" })}
              />
              <Select
                id="civilStatus"
                label="Civil Status"
                options={civilStatusOptions}
                error={errors.civilStatus?.message}
                {...register("civilStatus", { required: "Required" })}
              />
              <Input id="contactNo" label="Contact Number" {...register("contactNo")} />
              <Input id="email" label="Email" type="email" {...register("email")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address & Education</CardTitle>
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
                id="educationLevel"
                label="Education Level"
                options={educationOptions}
                {...register("educationLevel")}
              />
              <Input id="school" label="School" {...register("school")} />
              <Input id="course" label="Course" {...register("course")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(`/peso/beneficiaries/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Beneficiary"}
          </Button>
        </div>
      </form>
    </div>
  );
}
