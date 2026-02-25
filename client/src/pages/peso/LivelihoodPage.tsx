import ProgramPage from "./ProgramPage";

export default function LivelihoodPage() {
  return (
    <ProgramPage
      programKey="livelihood"
      title="Livelihood Program"
      description="Livelihood assistance program enrollments"
      endpoint="/peso/livelihood"
      extraColumns={[
        { key: "businessType", header: "Business Type", render: (r: any) => r.businessType ?? "--" },
        { key: "assistanceAmount", header: "Assistance", render: (r: any) => r.assistanceAmount ? `₱${r.assistanceAmount}` : "--" },
      ]}
    />
  );
}
