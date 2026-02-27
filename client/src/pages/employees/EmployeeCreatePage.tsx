import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { Employee } from "@/types";


// Add photo upload to form

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "RETIRED", label: "Retired" },
];

const civilStatusOptions = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "SEPARATED", label: "Separated" },
];

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeForm>();

  const photoInput = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const onSubmit = async (data: EmployeeForm) => {
    setLoading(true);
    try {
      // 1. Create employee
      const employee = await apiPost<Employee>("/employees", data);
      // 2. Upload photo if selected
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        await apiPost(`/employees/${employee.id}/photo`, formData);
      }
      toast.success("Employee created successfully");
      navigate("/employees");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Employee</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Create a new employee profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Photo upload */}
              <div className="col-span-1 flex flex-col items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={photoInput}
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setPhotoFile(file || null);
                    setPhotoPreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
                <div
                  className="h-24 w-24 rounded-full border bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => photoInput.current?.click()}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Upload Photo</span>
                  )}
                </div>
                {photoFile && (
                  <button type="button" className="text-xs text-red-500" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>Remove</button>
                )}
              </div>
              {/* ...existing code for other fields... */}
              <Input
                id="employeeNo"
                label="Employee No."
                error={errors.employeeNo?.message}
                {...register("employeeNo", { required: "Required" })}
              />
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
                label="Extension (Jr., Sr., etc.)"
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
              <Select
                id="civilStatus"
                label="Civil Status"
                options={civilStatusOptions}
                placeholder="Select status"
                {...register("civilStatus")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="email"
                label="Email"
                type="email"
                {...register("email")}
              />
              <Input
                id="phone"
                label="Phone"
                {...register("phone")}
              />
              <Input
                id="address"
                label="Address"
                className="sm:col-span-2"
                {...register("address")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="department"
                label="Department"
                error={errors.department?.message}
                {...register("department", { required: "Required" })}
              />
              <Input
                id="position"
                label="Position"
                error={errors.position?.message}
                {...register("position", { required: "Required" })}
              />
              <Input
                id="salaryGrade"
                label="Salary Grade"
                {...register("salaryGrade")}
              />
              <Input
                id="dateHired"
                label="Date Hired"
                type="date"
                error={errors.dateHired?.message}
                {...register("dateHired", { required: "Required" })}
              />
              <Select
                id="employmentStatus"
                label="Employment Status"
                options={statusOptions}
                placeholder="Select status"
                error={errors.employmentStatus?.message}
                {...register("employmentStatus", { required: "Required" })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/employees")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
