import ProgramPage from "./ProgramPage";
import type { FormFieldDef } from "./ProgramPage";

const formFields: FormFieldDef[] = [
  { name: "school", label: "School", required: true },
  { name: "yearLevel", label: "Year Level", required: true },
  { name: "assignedAgency", label: "Assigned Agency", required: true },
  { name: "periodFrom", label: "Period From", type: "date", required: true },
  { name: "periodTo", label: "Period To", type: "date", required: true },
  { name: "dailyRate", label: "Daily Rate (₱)", type: "number", required: true, valueAsNumber: true },
  { name: "totalDays", label: "Total Days", type: "number", required: true, valueAsNumber: true },
  { name: "totalCompensation", label: "Total Compensation (₱)", type: "number", required: true, valueAsNumber: true },
  { name: "govtShare", label: "Govt Share (₱)", type: "number", valueAsNumber: true },
  { name: "employerShare", label: "Employer Share (₱)", type: "number", valueAsNumber: true },
  { name: "batchYear", label: "Batch Year", type: "number", required: true, valueAsNumber: true },
];

export default function SpesPage() {
  return (
    <ProgramPage
      programKey="spes"
      title="SPES Program"
      description="Special Program for Employment of Students"
      endpoint="/peso/spes"
      extraColumns={[
        { key: "school", header: "School", render: (r: any) => r.school ?? "--" },
        { key: "yearLevel", header: "Year Level", render: (r: any) => r.yearLevel ?? "--" },
        { key: "assignedAgency", header: "Agency", render: (r: any) => r.assignedAgency ?? "--" },
      ]}
      formFields={formFields}
    />
  );
}
