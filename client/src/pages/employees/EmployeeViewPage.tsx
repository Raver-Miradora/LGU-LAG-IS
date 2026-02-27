import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  FileText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/Spinner";
import { DataTable } from "@/components/ui/DataTable";
import { apiGet, apiGetBlob } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Employee data
  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  const openBlob = async (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdf = async () => {
    if (!employee) return;
    const blob = await apiGetBlob(`/service-records/${employee.id}/pdf`);
    openBlob(blob, `service-records-${employee.employeeNo}.pdf`);
  };

  const handleId = async () => {
    if (!employee) return;
    const blob = await apiGetBlob(`/employees/${employee.id}/idcard`);
    openBlob(blob, `idcard-${employee.employeeNo}.pdf`);
  };


  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}> 
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {employee?.lastName}, {employee?.firstName} {employee?.middleName ?? ""}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {employee?.employeeNo} &middot; {employee?.position}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePdf}>
            <FileText className="mr-1 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleId}>
            <CreditCard className="mr-1 h-4 w-4" /> LGU ID
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>
      {/* employee details */}
      {employee && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <p><strong>Birthdate:</strong> {formatDate(employee.birthdate)}</p>
                <p><strong>Gender:</strong> {employee.gender}</p>
                <p><strong>Civil Status:</strong> {employee.civilStatus}</p>
                <p><strong>Contact:</strong> {employee.contactNo || '-'}</p>
                <p><strong>Email:</strong> {employee.email || '-'}</p>
                <p className="sm:col-span-2"><strong>Address:</strong> {employee.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Service records table */}
          <ServiceRecordsTable employeeId={employee.id} />
        </div>
      )}
    </div>
  );
}

// component for records
function ServiceRecordsTable({ employeeId }: { employeeId: string }) {
  const { data: recordsRes, isLoading: srLoading } = useQuery<{ data: ServiceRecord[] }, Error>({
    queryKey: ["service-records", employeeId],
    queryFn: () => apiGet(`/service-records?employeeId=${employeeId}`),
  });

  const columns = [
    { key: "dateFrom", header: "From", render: (r: Record<string, any>) => formatDate((r as ServiceRecord).dateFrom) },
    { key: "dateTo", header: "To", render: (r: Record<string, any>) => ( (r as ServiceRecord).dateTo ? formatDate((r as ServiceRecord).dateTo!) : "Present") },
    { key: "designation", header: "Position" },
    { key: "office", header: "Office" },
    { key: "status", header: "Status" },
  ];

  if (srLoading) return <PageLoader />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Records</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns as any} data={(recordsRes as any)?.data || []} />
      </CardContent>
    </Card>
  );
}
