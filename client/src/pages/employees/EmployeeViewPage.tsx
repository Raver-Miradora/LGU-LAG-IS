import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  FileText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiGet } from "@/lib/api";
import type { Employee } from "@/types";

export default function EmployeeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Employee data
  const { data: employee } = useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employees/${id}`),
    enabled: !!id,
  });

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
              {employee?.employeeNo} &middot; {employee?.position}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <a href={`/api/v1/service-records/${employee?.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-1 h-4 w-4" /> PDF
            </a>
          </Button>
          <Button variant="outline" size="sm">
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
