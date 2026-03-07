import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  FileText,
  CreditCard,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { DataTable } from "@/components/ui/DataTable";
import { apiGet, apiGetBlob, apiPatch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const canArchive = user?.role === "SUPER_ADMIN" || user?.role === "HR_ADMIN";

  // Employee data
  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  // attached documents for this employee
  const { data: docs, isLoading: docsLoading } = useQuery<any[]>({
    queryKey: ["employee-docs", id],
    queryFn: () => apiGet(`/employees/${id}/documents`),
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

  const handleDocDownload = async (docId: string, fileName: string) => {
    const blob = await apiGetBlob(`/documents/${docId}/download`);
    openBlob(blob, fileName);
  };

  const handleId = async () => {
    if (!employee) return;
    const blob = await apiGetBlob(`/employees/${employee.id}/idcard`);
    openBlob(blob, `idcard-${employee.employeeNo}.pdf`);
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await apiPatch(`/employees/${id}/archive`);
      toast.success("Employee archived successfully");
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setArchiveModalOpen(false);
      navigate("/employees");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to archive employee");
    } finally {
      setArchiving(false);
    }
  };


  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}> 
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {employee?.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt="Employee photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No photo</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {employee?.lastName}, {employee?.firstName} {employee?.middleName ?? ""}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                {employee?.employeeNo} &middot; {employee?.position}
              </p>
            </div>
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
          {canArchive && employee?.isActive && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setArchiveModalOpen(true)}
            >
              <Archive className="mr-1 h-4 w-4" /> Archive
            </Button>
          )}
          {employee && !employee.isActive && (
            <Badge variant="destructive">Archived</Badge>
          )}
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

          {/* Documents list */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <PageLoader />
              ) : docs && docs.length > 0 ? (
                <ul className="space-y-2">
                  {docs.map((d: any) => (
                    <li key={d.id} className="flex items-center justify-between">
                      <span>{d.fileName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocDownload(d.id, d.fileName)}
                      >
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">No documents uploaded</p>
              )}
            </CardContent>
          </Card>

          {/* Service records table */}
          <ServiceRecordsTable employeeId={employee.id} />
        </div>
      )}

      {/* Archive Confirmation Modal */}
      <Modal
        open={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        title="Archive Employee"
        size="sm"
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Are you sure you want to archive{" "}
          <strong>{employee?.lastName}, {employee?.firstName}</strong>? 
          This will mark the employee as inactive. The record will not be deleted.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setArchiveModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleArchive} disabled={archiving}>
            {archiving ? "Archiving..." : "Archive Employee"}
          </Button>
        </div>
      </Modal>
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
