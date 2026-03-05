import ProgramPage from "./ProgramPage";
import type { FormFieldDef } from "./ProgramPage";

const formFields: FormFieldDef[] = [
  { name: "projectName", label: "Project Name", required: true },
  { name: "workType", label: "Work Type", required: true },
  { name: "barangay", label: "Barangay", required: true },
  { name: "periodFrom", label: "Period From", type: "date", required: true },
  { name: "periodTo", label: "Period To", type: "date", required: true },
  { name: "totalDays", label: "Total Days", type: "number", required: true, valueAsNumber: true },
  { name: "dailyWage", label: "Daily Wage (₱)", type: "number", required: true, valueAsNumber: true },
  { name: "totalWage", label: "Total Wage (₱)", type: "number", required: true, valueAsNumber: true },
  { name: "skillsCategory", label: "Skills Category" },
  { name: "batchNo", label: "Batch No." },
];

export default function TupadPage() {
  return (
    <ProgramPage
      programKey="tupad"
      title="TUPAD Program"
      description="Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers"
      endpoint="/peso/tupad"
      extraColumns={[
        { key: "projectName", header: "Project", render: (r: any) => r.projectName ?? "--" },
        { key: "dailyWage", header: "Daily Wage", render: (r: any) => r.dailyWage ? `₱${r.dailyWage}` : "--" },
        { key: "barangay", header: "Barangay", render: (r: any) => r.barangay ?? "--" },
      ]}
      formFields={formFields}
    />
  );
}
