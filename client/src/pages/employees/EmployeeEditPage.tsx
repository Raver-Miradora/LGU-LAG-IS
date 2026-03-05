import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { apiGet, apiPut, apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { Employee } from "@/types";

// reuse the same form shape as create
type EmployeeForm = Omit<
  Employee,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "_count"
>;

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const statusOptions = [
  { value: "PERMANENT", label: "Permanent" },
  { value: "CASUAL", label: "Casual" },
  { value: "COTERMINOUS", label: "Coterminous" },
  { value: "JOB_ORDER", label: "Job Order" },
  { value: "CONTRACT_OF_SERVICE", label: "Contract of Service" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "ELECTED", label: "Elected" },
];

const civilStatusOptions = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "SEPARATED", label: "Separated" },
];

export default function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Employee | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>({
    defaultValues: {} as any,
  });

  const photoInput = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // document upload
  const docInput = useRef<HTMLInputElement>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docName, setDocName] = useState<string | null>(null);

  // fetch employee to populate form
  useEffect(() => {
    if (!id) return;
    apiGet<Employee>(`/employees/${id}`)
      .then((e) => {
        setInitialData(e);
        reset(e as any);
        if (e.photoUrl) {
          setPhotoPreview(e.photoUrl);
        }
      })
      .catch(() => toast.error("Failed to load employee"));
  }, [id, reset]);

  const onSubmit = async (data: EmployeeForm) => {
    if (!id) return;
    setLoading(true);
    try {
      const employee = await apiPut<Employee>(`/employees/${id}`, data);
      // upload photo if new selected
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        await apiPost(`/employees/${employee.id}/photo`, formData);
      }
      // upload document if selected
      if (docFile) {
        const formData = new FormData();
        formData.append("document", docFile);
        await apiPost(`/employees/${employee.id}/documents`, formData);
      }
      toast.success("Employee updated successfully");
      navigate(`/employees/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${id}`)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Employee</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Update employee profile
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
                    setPhotoPreview(file ? URL.createObjectURL(file) : photoPreview);
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
                  <button type="button" className="text-xs text-red-500" onClick={() => { setPhotoFile(null); setPhotoPreview(initialData?.photoUrl || null); }}>
                    Remove
                  </button>
                )}
              </div>
              {/* Document upload */}
              <div className="col-span-2 flex flex-col items-start gap-1">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  ref={docInput}
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setDocFile(file || null);
                    setDocName(file?.name || null);
                  }}
                />
                <button
                  type="button"
                  className="text-sm text-blue-600 underline"
                  onClick={() => docInput.current?.click()}
                >
                  {docName || "Attach document (PDF/image)"}
                </button>
                {docFile && (
                  <button type="button" className="text-xs text-red-500" onClick={() => { setDocFile(null); setDocName(null); }}>
                    Remove
                  </button>
                )}
              </div>
              {/* ...fields same as create page... */}
              <Input
                id="employeeNo"
                label="Employee No."
                error={errors.employeeNo?.message as string}
                {...register("employeeNo", { required: "Required" })}
              />
              <Input
                id="lastName"
                label="Last Name"
                error={errors.lastName?.message as string}
                {...register("lastName", { required: "Required" })}
              />
              <Input
                id="firstName"
                label="First Name"
                error={errors.firstName?.message as string}
                {...register("firstName", { required: "Required" })}
              />
              <Input
                id="middleName"
                label="Middle Name"
                {...register("middleName")}
              />
              <Input
                id="suffix"
                label="Extension (Jr., Sr., etc.)"
                {...register("suffix")}
              />
              <Input
                id="birthdate"
                label="Date of Birth"
                type="date"
                error={errors.birthdate?.message as string}
                {...register("birthdate", { required: "Required" })}
              />
              <Select
                id="gender"
                label="Gender"
                options={genderOptions}
                error={errors.gender?.message as string}
                {...register("gender", { required: "Required" })}
              />
              <Select
                id="civilStatus"
                label="Civil Status"
                options={civilStatusOptions}
                {...register("civilStatus")}
              />
              <Input
                id="address"
                label="Address"
                error={errors.address?.message as string}
                {...register("address", { required: "Required" })}
              />
              <Input
                id="contactNo"
                label="Contact Number"
                {...register("contactNo")}
              />
              <Input
                id="email"
                label="Email"
                {...register("email")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="position"
                label="Position"
                error={errors.position?.message as string}
                {...register("position", { required: "Required" })}
              />
              <Input
                id="department"
                label="Department"
                error={errors.department?.message as string}
                {...register("department", { required: "Required" })}
              />
              <Input
                id="salaryGrade"
                type="number"
                label="Salary Grade"
                {...register("salaryGrade")}
              />
              <Input
                id="stepIncrement"
                type="number"
                label="Step Increment"
                {...register("stepIncrement")}
              />
              <Select
                id="employmentStatus"
                label="Status"
                options={statusOptions}
                error={errors.employmentStatus?.message as string}
                {...register("employmentStatus", { required: "Required" })}
              />
              <Input
                id="dateHired"
                label="Date Hired"
                type="date"
                error={errors.dateHired?.message as string}
                {...register("dateHired", { required: "Required" })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
