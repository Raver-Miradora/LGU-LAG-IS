import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  FileText,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { DataTable } from "@/components/ui/DataTable";
import { apiGet } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  const { data: recordsRes } = useQuery<{ data: ServiceRecord[] }>({
    queryKey: ["service-records", id],
    queryFn: () => apiGet(`/service-records?employeeId=${id}`),
    enabled: !!id,
  });

  const statusVariant = (s: string) => {
    const map: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
      ACTIVE: "success",
      INACTIVE: "secondary",
      SUSPENDED: "warning",
      RETIRED: "destructive",
    };
    return map[s] ?? "secondary";
  };

  const srColumns = [
    { key: "fromDate", header: "From", render: (r: ServiceRecord) => formatDate(r.fromDate) },
    { key: "toDate", header: "To", render: (r: ServiceRecord) => r.toDate ? formatDate(r.toDate) : "Present" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "salaryGrade", header: "SG" },
    { key: "status", header: "Status" },
  ];

  if (isLoading) return <PageLoader />;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {employee.lastName}, {employee.firstName} {employee.middleName ?? ""}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {employee.employeeId} &middot; {employee.position}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-1 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="mr-1 h-4 w-4" /> LGU ID
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--muted)] text-3xl font-bold text-[var(--muted-foreground)]">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span>Born: {formatDate(employee.dateOfBirth)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Gender:</span>
                <span>{employee.gender}</span>
              </div>
              {employee.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span>{employee.email}</span>
                </div>
              )}
              {employee.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span>{employee.phone}</span>
                </div>
              )}
              {employee.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span>{employee.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Department</dt>
                <dd className="font-medium">{employee.department}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Position</dt>
                <dd className="font-medium">{employee.position}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Salary Grade</dt>
                <dd className="font-medium">{employee.salaryGrade || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Date Hired</dt>
                <dd className="font-medium">{formatDate(employee.dateHired)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Status</dt>
                <dd>
                  <Badge variant={statusVariant(employee.employmentStatus)}>
                    {employee.employmentStatus}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Service Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Records</CardTitle>
          <Button
            size="sm"
            onClick={() => navigate(`/service-records/new?employeeId=${id}`)}
          >
            Add Record
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={srColumns}
            data={((recordsRes as any)?.data ?? []) as any}
            emptyMessage="No service records found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
