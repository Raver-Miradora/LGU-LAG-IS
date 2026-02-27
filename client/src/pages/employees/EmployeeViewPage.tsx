import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
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
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Employee data
  const { data: employee, isLoading, refetch } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  // Photo upload state
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const handlePhotoUpload = async () => {
    if (!photoFile || !employee) return;
    const formData = new FormData();
    formData.append("photo", photoFile);
    await apiPost(`/employees/${employee.id}/photo`, formData);
    setPhotoFile(null); setPhotoPreview(null); refetch();
  };

  // Document upload/attachment state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docList, setDocList] = useState<any[]>([]);
  const fetchDocs = async () => {
    if (!employee) return;
    const docs = await apiGet(`/employees/${employee.id}/documents`);
    setDocList(docs);
  };
  useEffect(() => { if (employee) fetchDocs(); }, [employee]);
  const handleDocUpload = async () => {
    if (!docFile || !employee) return;
    const formData = new FormData();
    formData.append("document", docFile);
    await apiPost(`/employees/${employee.id}/documents`, formData);
    setDocFile(null); fetchDocs();
  };
  const handleDocDelete = async (docId: string) => {
    await apiDelete(`/employees/documents/${docId}`); fetchDocs();
  };

  // Service records
  const { data: recordsRes, refetch: refetchSR } = useQuery<{ data: ServiceRecord[] }>({
    queryKey: ["service-records", id],
    queryFn: () => apiGet(`/service-records?employeeId=${id}`),
    enabled: !!id,
  });
  const [editingSR, setEditingSR] = useState<ServiceRecord | null>(null);
  const [srForm, setSrForm] = useState<Partial<ServiceRecord>>({});
  const handleSrSave = async () => {
    if (!employee) return;
    if (editingSR) {
      await apiPost(`/service-records/${editingSR.id}`, srForm);
    } else {
      await apiPost(`/service-records`, { ...srForm, employeeId: employee.id });
    }
    setEditingSR(null); setSrForm({}); refetchSR();
  };
  const handleSrDelete = async (srId: string) => {
    await apiDelete(`/service-records/${srId}`); refetchSR();
  };

  return (
    <div>
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
              {employee?.employeeId} &middot; {employee?.position}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/service-records/${employee?.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-1 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/employees/${employee?.id}/idcard`} target="_blank" rel="noopener noreferrer">
              <CreditCard className="mr-1 h-4 w-4" /> LGU ID
            </a>
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>
      {/* Additional JSX code for rendering employee details, documents, and service records */}
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
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
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Employee data
  const { data: employee, isLoading, refetch } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  // Photo upload state
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const handlePhotoUpload = async () => {
    if (!photoFile || !employee) return;
    const formData = new FormData();
    formData.append("photo", photoFile);
    await apiPost(`/employees/${employee.id}/photo`, formData);
    setPhotoFile(null); setPhotoPreview(null); refetch();
  };

  // Document upload/attachment state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docList, setDocList] = useState<any[]>([]);
  const fetchDocs = async () => {
    if (!employee) return;
    const docs = await apiGet(`/employees/${employee.id}/documents`);
    setDocList(docs);
  };
  useEffect(() => { if (employee) fetchDocs(); }, [employee]);
  const handleDocUpload = async () => {
    if (!docFile || !employee) return;
    const formData = new FormData();
    formData.append("document", docFile);
    await apiPost(`/employees/${employee.id}/documents`, formData);
    setDocFile(null); fetchDocs();
  };
  const handleDocDelete = async (docId: string) => {
    await apiDelete(`/employees/documents/${docId}`); fetchDocs();
  };

  // Service records
  const { data: recordsRes, refetch: refetchSR } = useQuery<{ data: ServiceRecord[] }>({
    queryKey: ["service-records", id],
    queryFn: () => apiGet(`/service-records?employeeId=${id}`),
    enabled: !!id,
  });
  const [editingSR, setEditingSR] = useState<ServiceRecord | null>(null);
  const [srForm, setSrForm] = useState<Partial<ServiceRecord>>({});
  const handleSrSave = async () => {
    if (!employee) return;
    if (editingSR) {
      await apiPost(`/service-records/${editingSR.id}`, srForm);
    } else {
      await apiPost(`/service-records`, { ...srForm, employeeId: employee.id });
    }
    setEditingSR(null); setSrForm({}); refetchSR();
  };
  const handleSrDelete = async (srId: string) => {
    await apiDelete(`/service-records/${srId}`); refetchSR();
  };

  return (
    <div>
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
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/service-records/${employee.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-1 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/employees/${employee.id}/idcard`} target="_blank" rel="noopener noreferrer">
              <CreditCard className="mr-1 h-4 w-4" /> LGU ID
            </a>
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>
      {/* Additional JSX code for rendering employee details, documents, and service records */}
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
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
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Employee, ServiceRecord } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Employee data
  const { data: employee, isLoading, refetch } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

  // Photo upload state
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const handlePhotoUpload = async () => {
    if (!photoFile || !employee) return;
    const formData = new FormData();
    formData.append("photo", photoFile);
    await apiPost(`/employees/${employee.id}/photo`, formData);
    setPhotoFile(null); setPhotoPreview(null); refetch();
  };

  // Document upload/attachment state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docList, setDocList] = useState<any[]>([]);
  const fetchDocs = async () => {
    if (!employee) return;
    const docs = await apiGet(`/employees/${employee.id}/documents`);
    setDocList(docs);
  };
  useEffect(() => { if (employee) fetchDocs(); }, [employee]);
  const handleDocUpload = async () => {
    if (!docFile || !employee) return;
    const formData = new FormData();
    formData.append("document", docFile);
    await apiPost(`/employees/${employee.id}/documents`, formData);
    setDocFile(null); fetchDocs();
  };
  const handleDocDelete = async (docId: string) => {
    await apiDelete(`/employees/documents/${docId}`); fetchDocs();
  };

  // Service records
  const { data: recordsRes, refetch: refetchSR } = useQuery<{ data: ServiceRecord[] }>({
    queryKey: ["service-records", id],
    queryFn: () => apiGet(`/service-records?employeeId=${id}`),
    enabled: !!id,
  });
  const [editingSR, setEditingSR] = useState<ServiceRecord | null>(null);
  const [srForm, setSrForm] = useState<Partial<ServiceRecord>>({});
  const handleSrSave = async () => {
    if (!employee) return;
    if (editingSR) {
      await apiPost(`/service-records/${editingSR.id}`, srForm);
    } else {
      await apiPost(`/service-records`, { ...srForm, employeeId: employee.id });
    }
    setEditingSR(null); setSrForm({}); refetchSR();
  };
  const handleSrDelete = async (srId: string) => {
    await apiDelete(`/service-records/${srId}`); refetchSR();
  };

  // ...existing render/JSX code...
}

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading, refetch } = useQuery<Employee>({
      // Photo upload
      const photoInput = useRef<HTMLInputElement>(null);
      const [photoFile, setPhotoFile] = useState<File | null>(null);
      const [photoPreview, setPhotoPreview] = useState<string | null>(null);
      const handlePhotoUpload = async () => {
        if (!photoFile || !employee) return;
        const formData = new FormData();
        formData.append("photo", photoFile);
        await apiPost(`/employees/${employee.id}/photo`, formData);
        setPhotoFile(null); setPhotoPreview(null); refetch();
      };
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


      // Employee data
      // ...existing code...
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow"
            onClick={() => photoInput.current?.click()}
          >
            Edit
          </button>
        </div>
        {photoFile && (
          <div className="flex flex-col gap-1">
            <button className="text-xs text-blue-600" onClick={handlePhotoUpload}>Save Photo</button>
            <button className="text-xs text-red-500" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>Cancel</button>
          </div>
        )}
      </div>
      {/* Service Record CRUD UI */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Service Records</h2>
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Position</th>
              <th className="p-2">Department</th>
              <th className="p-2">SG</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recordsRes?.data?.map((sr) => (
              <tr key={sr.id} className="border-t">
                <td className="p-2">{sr.dateFrom}</td>
                <td className="p-2">{sr.dateTo || "Present"}</td>
                <td className="p-2">{sr.designation}</td>
                <td className="p-2">{sr.department}</td>
                <td className="p-2">{sr.salaryGrade}</td>
                <td className="p-2">{sr.status}</td>
                <td className="p-2">
                  <button className="text-xs text-blue-600 mr-2" onClick={() => { setEditingSR(sr); setSrForm(sr); }}>Edit</button>
                  <button className="text-xs text-red-500" onClick={() => handleSrDelete(sr.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Add/Edit Service Record Form */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">{editingSR ? "Edit" : "Add"} Service Record</h3>
          <input className="border p-1 mr-2" placeholder="From" value={srForm.dateFrom || ""} onChange={e => setSrForm(f => ({ ...f, dateFrom: e.target.value }))} />
          <input className="border p-1 mr-2" placeholder="To" value={srForm.dateTo || ""} onChange={e => setSrForm(f => ({ ...f, dateTo: e.target.value }))} />
          <input className="border p-1 mr-2" placeholder="Position" value={srForm.designation || ""} onChange={e => setSrForm(f => ({ ...f, designation: e.target.value }))} />
          <input className="border p-1 mr-2" placeholder="Department" value={srForm.department || ""} onChange={e => setSrForm(f => ({ ...f, department: e.target.value }))} />
          <input className="border p-1 mr-2" placeholder="SG" value={srForm.salaryGrade || ""} onChange={e => setSrForm(f => ({ ...f, salaryGrade: e.target.value }))} />
          <input className="border p-1 mr-2" placeholder="Status" value={srForm.status || ""} onChange={e => setSrForm(f => ({ ...f, status: e.target.value }))} />
          <button className="ml-2 text-xs text-green-600" onClick={handleSrSave}>{editingSR ? "Update" : "Add"}</button>
          {editingSR && <button className="ml-2 text-xs text-gray-500" onClick={() => { setEditingSR(null); setSrForm({}); }}>Cancel</button>}
        </div>
      </div>
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
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/service-records/${employee.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-1 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/v1/employees/${employee.id}/idcard`} target="_blank" rel="noopener noreferrer">
              <CreditCard className="mr-1 h-4 w-4" /> LGU ID
            </a>
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
            {/* Employee Documents */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <input type="file" onChange={e => setDocFile(e.target.files?.[0] || null)} />
                  <Button size="sm" onClick={handleDocUpload} disabled={!docFile}>Upload</Button>
                  {docFile && <span className="text-xs">{docFile.name}</span>}
                </div>
                <ul className="divide-y">
                  {docList.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between py-2">
                      <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{doc.fileName}</a>
                      <Button size="xs" variant="destructive" onClick={() => handleDocDelete(doc.id)}>Delete</Button>
                    </li>
                  ))}
                  {docList.length === 0 && <li className="text-xs text-gray-500">No attachments.</li>}
                </ul>
              </CardContent>
            </Card>
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
