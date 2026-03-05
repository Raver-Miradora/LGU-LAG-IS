import ProgramPage from "./ProgramPage";
import type { FormFieldDef } from "./ProgramPage";

const formFields: FormFieldDef[] = [
  { name: "school", label: "School", required: true },
  { name: "course", label: "Course", required: true },
  { name: "hostCompany", label: "Host Company", required: true },
  { name: "periodFrom", label: "Period From", type: "date", required: true },
  { name: "periodTo", label: "Period To", type: "date", required: true },
  { name: "requiredHours", label: "Required Hours", type: "number", required: true, valueAsNumber: true },
  { name: "renderedHours", label: "Rendered Hours", type: "number", valueAsNumber: true },
  { name: "supervisorName", label: "Supervisor Name" },
  { name: "supervisorContact", label: "Supervisor Contact" },
  { name: "evaluationRating", label: "Evaluation Rating" },
];

export default function OjtPage() {
  return (
    <ProgramPage
      programKey="ojt"
      title="OJT Program"
      description="On-the-Job Training program enrollments"
      endpoint="/peso/ojt"
      extraColumns={[
        { key: "school", header: "School", render: (r: any) => r.school ?? "--" },
        { key: "hostCompany", header: "Company", render: (r: any) => r.hostCompany ?? "--" },
        { key: "requiredHours", header: "Hours", render: (r: any) => `${r.renderedHours ?? 0}/${r.requiredHours}` },
      ]}
      formFields={formFields}
    />
  );
}
