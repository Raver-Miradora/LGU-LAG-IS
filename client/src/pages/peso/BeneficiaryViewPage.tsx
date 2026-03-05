import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { PageLoader } from "@/components/ui/Spinner";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Beneficiary } from "@/types";

interface BeneficiaryDetail extends Beneficiary {
  spesEnrollments?: any[];
  ojtEnrollments?: any[];
  tupadEnrollments?: any[];
  livelihoodEnrollments?: any[];
}

export default function BeneficiaryViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: beneficiary, isLoading, isError } = useQuery<BeneficiaryDetail>({
    queryKey: ["beneficiary", id],
    queryFn: () => apiGet(`/peso/beneficiaries/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader />;
  if (isError || !beneficiary)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-red-600">Beneficiary not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/peso/beneficiaries")}>
          Back to List
        </Button>
      </div>
    );

  const enrollmentColumns = [
    { key: "program", header: "Program" },
    { key: "status", header: "Status", render: (r: any) => <Badge variant={r.status === "ACTIVE" ? "success" : "secondary"}>{r.status}</Badge> },
    { key: "period", header: "Period" },
    { key: "details", header: "Details" },
  ];

  // Combine all enrollments into a flat list for display
  const allEnrollments = [
    ...(beneficiary.spesEnrollments ?? []).map((e: any) => ({
      program: "SPES",
      status: e.status,
      period: `${formatDate(e.periodFrom)} – ${formatDate(e.periodTo)}`,
      details: `${e.school} / ${e.assignedAgency}`,
    })),
    ...(beneficiary.ojtEnrollments ?? []).map((e: any) => ({
      program: "OJT",
      status: e.status,
      period: `${formatDate(e.periodFrom)} – ${formatDate(e.periodTo)}`,
      details: `${e.school} → ${e.hostCompany}`,
    })),
    ...(beneficiary.tupadEnrollments ?? []).map((e: any) => ({
      program: "TUPAD",
      status: e.status,
      period: `${formatDate(e.periodFrom)} – ${formatDate(e.periodTo)}`,
      details: `${e.projectName} (${e.barangay})`,
    })),
    ...(beneficiary.livelihoodEnrollments ?? []).map((e: any) => ({
      program: "Livelihood",
      status: e.status,
      period: e.approvedDate ? formatDate(e.approvedDate) : "--",
      details: `${e.programType?.replace(/_/g, " ")} – ${e.businessType ?? "N/A"}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/peso/beneficiaries")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {beneficiary.lastName}, {beneficiary.firstName} {beneficiary.middleName ?? ""}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">Beneficiary Profile</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/peso/beneficiaries/${id}/edit`)}>
          <Edit className="mr-1 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Full Name</dt>
                <dd className="font-medium">{beneficiary.lastName}, {beneficiary.firstName} {beneficiary.middleName ?? ""} {beneficiary.suffix ?? ""}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Date of Birth</dt>
                <dd>{formatDate(beneficiary.birthdate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Gender</dt>
                <dd>{beneficiary.gender}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Civil Status</dt>
                <dd>{beneficiary.civilStatus}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Contact</dt>
                <dd>{beneficiary.contactNo || "--"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Email</dt>
                <dd>{beneficiary.email || "--"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Address</dt>
                <dd>{beneficiary.address}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Barangay</dt>
                <dd>{beneficiary.barangay}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Education & Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Education & Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Total Enrollments</p>
                <p className="text-2xl font-bold">{allEnrollments.length}</p>
              </div>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Education Level</dt>
                <dd>{beneficiary.educationLevel || "--"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">School</dt>
                <dd>{beneficiary.school || "--"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Course</dt>
                <dd>{beneficiary.course || "--"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Program Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          {allEnrollments.length > 0 ? (
            <DataTable columns={enrollmentColumns} data={allEnrollments as any} />
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              No program enrollments yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
