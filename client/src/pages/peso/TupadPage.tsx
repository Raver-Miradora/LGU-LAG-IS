import ProgramPage from "./ProgramPage";

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
      ]}
    />
  );
}
