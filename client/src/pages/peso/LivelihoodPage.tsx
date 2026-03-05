import ProgramPage from "./ProgramPage";
import type { FormFieldDef } from "./ProgramPage";

const formFields: FormFieldDef[] = [
  {
    name: "programType",
    label: "Program Type",
    type: "select",
    required: true,
    options: [
      { value: "SKILLS_TRAINING", label: "Skills Training" },
      { value: "STARTER_KIT", label: "Starter Kit" },
      { value: "SEED_CAPITAL", label: "Seed Capital" },
      { value: "CASH_ASSISTANCE", label: "Cash Assistance" },
      { value: "MICRO_ENTERPRISE", label: "Micro Enterprise" },
    ],
  },
  { name: "assistanceType", label: "Assistance Type" },
  { name: "amount", label: "Amount (₱)", type: "number", valueAsNumber: true },
  { name: "businessType", label: "Business Type" },
  { name: "businessName", label: "Business Name" },
];

export default function LivelihoodPage() {
  return (
    <ProgramPage
      programKey="livelihood"
      title="Livelihood Program"
      description="Livelihood assistance program enrollments"
      endpoint="/peso/livelihood"
      extraColumns={[
        {
          key: "programType",
          header: "Type",
          render: (r: any) => r.programType?.replace(/_/g, " ") ?? "--",
        },
        {
          key: "amount",
          header: "Amount",
          render: (r: any) => r.amount ? `₱${Number(r.amount).toLocaleString()}` : "--",
        },
        { key: "businessType", header: "Business", render: (r: any) => r.businessType ?? "--" },
      ]}
      formFields={formFields}
    />
  );
}
